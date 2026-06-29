# Automating PDF Reports

This step-by-step guide will walk you through a complete, real-world example: building an application that allows a user to fill out and sign an acceptance report, which is then saved to a database and emailed as a PDF.

### Before You Begin

To get started, the first step for everyone is to download the blank `acceptance_report.pdf` file. You will need to upload this file to your File Server to serve as the template's background, regardless of which method you choose below.

Once you have the PDF, you have two options:

1. Build from Scratch: Follow all the steps in this guide to learn the entire process.
2. Start from a Template: If you'd like to start with the finished application logic, download the Heisenware Tag (`acceptance-report-app.hwt`) file below and import it into your account. You will still need to link your uploaded PDF to the template.

#### Downloads

{% file src="../../.gitbook/assets/acceptance_report.pdf" %}

{% file src="../../.gitbook/assets/acceptance-report-app.hwt" %}

## Step 1: Create the Database Table

First, we need a place to store the submitted reports. We'll use the `defineTable` Function to create a table in the internal PostgreSQL database.

In the Backend Builder, place the `defineTable` Function on the canvas and configure its Inputs  as shown below.

```yaml
#name
acceptanceReports
#fields
customerName: string
projectID: string
acceptanceDate: date
comments: text
signature: text
```

{% hint style="info" %}
The 'id', 'createdAt', and 'updatedAt' fields are added automatically.
{% endhint %}

After configuring the Function, you must trigger it once to execute the logic and create the table in your database.

<figure><img src="../../.gitbook/assets/image (72).png" alt=""><figcaption></figcaption></figure>

## Step 2: Build the Form and Submission Logic

Now, we will create the user interface for data entry and build the backend logic to save the submitted data to our database table.

### Build the User Interface

First, in the Frontend Builder, add the widgets for your form.

{% stepper %}
{% step %}
Drag a [Form widget](../../app-builder/build-frontend/widgets/input-widgets/form.md) onto the canvas. Select it and configure its fields. It is critical that the field names and data types exactly match your database columns (`customerName`, `projectID`, `acceptanceDate`, `comments`). You can also set user-friendly labels for each field.
{% endstep %}

{% step %}
Drag a [Signature widget](../../app-builder/build-frontend/widgets/input-widgets/signature.md) onto the canvas, placing it below the form.
{% endstep %}

{% step %}
Drag a [Button](../../app-builder/build-frontend/widgets/trigger-widgets/button.md) below the `Signature` widget and change its label to `Submit`.
{% endstep %}
{% endstepper %}

<figure><img src="../../.gitbook/assets/image (73).png" alt="" width="377"><figcaption></figcaption></figure>

### Construct the Submission Logic

Next, switch to the Backend Builder to define what happens when the user clicks the `Submit` button.

{% stepper %}
{% step %}
Prepare the Signature Data

The `Signature` widget outputs a raw Base64 string, but our database expects an object. We need to format it correctly.

* Drag a [Memory Function](/broken/pages/sQCEwgV7THJdwOrrJ2fB) onto the canvas and connect the output of the Signature widget to its input.
* Add a [JavaScript Modifier](/broken/pages/i9IfQGI7JsZoIlPbpDlt) after the `Memory`. Use the following expression in it. This wraps the signature string in an object with the key `signature`, matching our database column.

```javascript
{signature: x}
```

<figure><img src="../../.gitbook/assets/image (74).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
Combine All Form Data

Now we'll merge the main form data with our newly created signature object.

* Drag the [`mergeObjects`](../../app-builder/build-backend/function-explorer/utilities/data-processing.md#merging-objects) function onto the canvas.
* Connect the Form widget to the first input of `mergeObjects`.
* Connect the signature Modifier to the second input of `mergeObjects`.
* Connect both Inputs  to the Trigger of `mergeObjects` to trigger the Function `on input update`.

<figure><img src="../../.gitbook/assets/image (75).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
Save to the Database & Trigger the Flow

* Drag the [`addRow`](../../app-builder/build-backend/function-explorer/storage/relational-database.md#addrow) Function onto the canvas.
* Set its `table` input to `acceptanceReports`.
* Connect the output of the `mergeObjects` Function to the `data` input of `addRow`.
* Finally, connect the Submit Button to the Trigger of the `addRow` Functions trigger. This makes the button start the entire save process.

<figure><img src="../../.gitbook/assets/image (76).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
Clear the Form After Submission:

* To provide a good user experience, we'll clear the form after a successful submission.
* Connect the output of the `addRow` Function to the Form widget.
* Set the command to `call clear`. This will empty the form for the next entry after the data has been saved.

<figure><img src="../../.gitbook/assets/image (77).png" alt=""><figcaption></figcaption></figure>
{% endstep %}
{% endstepper %}

## Step 3: Design and Configure the PDF Template

Now that our data submission logic is in place, we will create the visual PDF template and configure the logic to populate it.

### Design the Template Layout

First, we need to create the visual layout in the Template Editor.

{% stepper %}
{% step %}
Upload the `acceptance_report.pdf` file to the [File server via the File Explorer](../../app-builder/build-backend/file-explorer.md).
{% endstep %}

{% step %}
Navigate to [PDF Template Editing](../../app-builder/build-frontend/pdf-template-editor.md) mode.
{% endstep %}

{% step %}
Create a new template and name it `AcceptanceReport`.
{% endstep %}

{% step %}
From the File Explorer, drag the `acceptance_report.pdf` file onto the page canvas. This sets it as the static background.
{% endstep %}

{% step %}
Using the Add Text Placeholder and Add Image Placeholder tools, place placeholders on the background for each of your fields (`customerName`, `projectID`, `acceptanceDate`, `comments`, and `signature`).
{% endstep %}

{% step %}
Configure each placeholder with the correct Variable Name in its settings. Optionally, adjust sizes and colors of your placeholders.
{% endstep %}
{% endstepper %}

<figure><img src="../../.gitbook/assets/image (82).png" alt=""><figcaption></figcaption></figure>

### Construct the PDF Generation Logic

Now, return to the Backend Builder to connect the template to your existing logic.

{% stepper %}
{% step %}
From the Function Explorer, find your `AcceptanceReport` instance (under the [`PDF Templates`](../../app-builder/build-backend/function-explorer/utilities/pdf-templates.md) Class) and drag its `fillTemplate` Function onto the canvas.
{% endstep %}

{% step %}
Connect the output of the `mergeObjects` Function (from Step 2) to the `Values` input of `fillTemplate`. This provides the data for the placeholders.
{% endstep %}

{% step %}
Connect the output of the `addRow` Function to the Trigger of the `fillTemplate` Function. This ensures the PDF is only generated _after_ the data has been successfully saved to the database.
{% endstep %}
{% endstepper %}

Our flow is now complete up to the point of generating the PDF. The final step will be to email this document.

<figure><img src="../../.gitbook/assets/image (80).png" alt=""><figcaption></figcaption></figure>

## Step 4: Send the Report via Email

The final step in our workflow is to automatically email the generated PDF report. We will use the `send` Function from the [internal mailer](../../app-builder/build-backend/function-explorer/connectors/email.md) and configure it to send an email automatically whenever a new report is created.

Return to the Backend Builder to add the final piece of logic to your flow.

{% stepper %}
{% step %}
From the Function Explorer, find your internal mailer instance and drag its `send` Function onto the canvas.
{% endstep %}

{% step %}
Configure the static Inputs  for the email

```yaml
#address
to: [your email address]
#subject
New Acceptance Report
#content
A new report has been submitted for review. Please see attached PDF.
```
{% endstep %}

{% step %}
Format the Attachment Data

The `send` Function's `attachment` input requires a specific object format. We can create this directly on the `fillTemplate` Function's Output using a built-in Modifier.

* Add a JSONata Modifier to the `fillTemplate` Function.
* In the Modifier's settings, enter the following JSONata expression. This wraps the raw Base64 output (`$`) with a filename and encoding:

```
{
  "filename": "Acceptance Report.pdf",
  "content": $,
  "encoding": "base64"
}
```
{% endstep %}

{% step %}
Connect the PDF and Set the Trigger

* Connect the Modifier (from the `fillTemplate` Function) to the `attachment` input of the `send` Function.
* Now, connect the attachment input to the Trigger of the `send` Function.
* Set the Trigger to `on input change`.
{% endstep %}
{% endstepper %}

This creates a simple and powerful data-driven workflow. Whenever a new PDF is generated by the `fillTemplate` Function, its output is passed to the `attachment` input, and this change automatically triggers the `send` Function.

<figure><img src="../../.gitbook/assets/image (83).png" alt=""><figcaption></figcaption></figure>

## Step 5: Deployment

Congratulations! 🥳 You have now built a complete application that captures user input, saves it to a database, generates a customized PDF, and emails it as an attachment.

The final step is to deploy your app. Click the Deploy button in the App Builder's toolbar to publish the latest version and make it live.

Once deployed, open the application and test the full workflow. After you fill out and submit the report, the static email address you configured in Step 4 should receive an email with the PDF attachment, which will look similar to the image below.

From here, you can expand on this project by adding more fields, using your own report templates, or integrating this logic into a larger application.

<figure><img src="../../.gitbook/assets/image (84).png" alt=""><figcaption></figcaption></figure>
