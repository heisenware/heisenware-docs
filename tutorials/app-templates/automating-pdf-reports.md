# Automating PDF reports

Learn how to build an App that lets users fill out and sign an acceptance report, save the submission to a relational database, and email it automatically as a PDF.

## Before you begin

First, download the blank `acceptance_report.pdf` file. You will upload this file to the File Explorer to use as the template background.

You can build the App from scratch by following this guide, or start with the finished App logic by downloading the tag file below and importing it into your account. In that case you still need to link your uploaded PDF to the template.

#### Downloads

{% file src="../../.gitbook/assets/acceptance_report.pdf" %}

{% file src="../../.gitbook/assets/acceptance-report-app.hwt" %}

## Step 1: Create the database table

Create a table in the internal [relational database](../../app-builder/build-backend/functions/storage/relational-database.md) to store the submitted reports.

In the Backend Builder, drag the [`defineTable`](../../app-builder/build-backend/functions/storage/relational-database.md#definetable) function onto the canvas and configure the inputs:

```yaml
# name
acceptanceReports
# fields
customerName: string
projectID: string
acceptanceDate: date
comments: text
signature: text
```

{% hint style="info" %}
The database automatically adds `id`, `createdAt`, and `updatedAt` fields.
{% endhint %}

Trigger the function once to execute the logic and create the table in the database.

<figure><img src="../../.gitbook/assets/image (72).png" alt=""><figcaption></figcaption></figure>

## Step 2: Build the form and submission logic

Build the user interface for data entry, then configure the backend logic to save the submitted data to your database.

### Build the user interface

Add the widgets for the form in the Frontend Builder.

{% stepper %}
{% step %}
#### Add the form widget

Drag a [form](../../app-builder/build-frontend/widgets/input-widgets/form.md) widget onto the canvas. Configure its fields so the field names exactly match your database columns (`customerName`, `projectID`, `acceptanceDate`, `comments`). Define custom, user-friendly labels for each field.
{% endstep %}

{% step %}
#### Add the signature widget

Drag a [signature](../../app-builder/build-frontend/widgets/input-widgets/signature.md) widget onto the canvas and place it below the form.
{% endstep %}

{% step %}
#### Add the submit button

Drag a [button](../../app-builder/build-frontend/widgets/trigger-widgets/button.md) widget below the signature widget and change its label setting to Submit.
{% endstep %}
{% endstepper %}

<figure><img src="../../.gitbook/assets/image (73).png" alt="" width="377"><figcaption></figcaption></figure>

### Configure the submission logic

Switch to the Backend Builder to define the flow when a user clicks the Submit button.

{% stepper %}
{% step %}
#### Format the signature

The signature widget outputs a raw base64 string, but the database expects an object.

1. Drag a [memory](../../app-builder/build-backend/functions/utilities/data-processing.md#memory) function onto the canvas and connect the output of the signature widget to its input.
2. Add a [modifier](../../app-builder/build-backend/extension-nodes/modifier.md) extension node after the memory function. Configure it with the following expression to wrap the signature string in an object whose key matches the database column:

```javascript
{signature: x}
```

<figure><img src="../../.gitbook/assets/image (74).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
#### Combine the form data

Merge the main form data with the signature object.

1. Drag the [`mergeObjects`](../../app-builder/build-backend/functions/utilities/data-processing.md#merging-objects) function onto the canvas.
2. Connect the form widget to the first input of `mergeObjects`.
3. Connect the signature modifier to the second input of `mergeObjects`.
4. Connect both inputs to the trigger of `mergeObjects` to trigger the function `on input update`.

<figure><img src="../../.gitbook/assets/image (75).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
#### Save to the database

1. Drag the [`addRow`](../../app-builder/build-backend/functions/storage/relational-database.md#addrow) function onto the canvas.
2. Set its `table` input to `acceptanceReports`.
3. Connect the output of `mergeObjects` to the `data` input of `addRow`.
4. Connect the Submit button to the trigger of `addRow`. The button now starts the entire save process.

<figure><img src="../../.gitbook/assets/image (76).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
#### Clear the form after submission

1. Connect the output of `addRow` to the form widget.
2. Set the command to `call clear`. The form empties for the next entry after the data has been saved.

<figure><img src="../../.gitbook/assets/image (77).png" alt=""><figcaption></figcaption></figure>
{% endstep %}
{% endstepper %}

## Step 3: Design and configure the PDF template

With the data submission logic in place, create the visual PDF template and configure the logic to populate it.

### Design the template layout

Create the visual layout in the PDF Template Editor.

{% stepper %}
{% step %}
#### Upload the background PDF

Upload the `acceptance_report.pdf` file to the file server via the [File Explorer](../../app-builder/build-backend/file-explorer.md).
{% endstep %}

{% step %}
#### Open the PDF Template Editor

Navigate to the [PDF Template Editor](../../app-builder/build-frontend/pdf-template-editor.md).
{% endstep %}

{% step %}
#### Create the template

Create a new template and name it `AcceptanceReport`.
{% endstep %}

{% step %}
#### Set the background

From the File Explorer, drag the `acceptance_report.pdf` file onto the page canvas. This sets it as the static background.
{% endstep %}

{% step %}
#### Place the placeholders

Using the Add text placeholder and Add image placeholder tools, place placeholders on the background for each of your fields (`customerName`, `projectID`, `acceptanceDate`, `comments`, and `signature`).
{% endstep %}

{% step %}
#### Configure the placeholders

Configure each placeholder with the correct variable name in its settings. Optionally, adjust sizes and colors of your placeholders.
{% endstep %}
{% endstepper %}

<figure><img src="../../.gitbook/assets/image (82).png" alt=""><figcaption></figcaption></figure>

### Configure the PDF generation logic

Return to the Backend Builder to connect the template to your existing logic.

{% stepper %}
{% step %}
#### Add the fill function

From the Function Explorer, find your `AcceptanceReport` instance (under the [PDF templates](../../app-builder/build-backend/functions/utilities/pdf-templates.md) class) and drag its `fillTemplate` function onto the canvas.
{% endstep %}

{% step %}
#### Provide the data

Connect the output of `mergeObjects` (from Step 2) to the `values` input of `fillTemplate`. This provides the data for the placeholders.
{% endstep %}

{% step %}
#### Set the trigger

Connect the output of `addRow` to the trigger of `fillTemplate`. This ensures the PDF is only generated after the data has been successfully saved to the database.
{% endstep %}
{% endstepper %}

The flow is now complete up to the point of generating the PDF. The final step is to email this document.

<figure><img src="../../.gitbook/assets/image (80).png" alt=""><figcaption></figcaption></figure>

## Step 4: Send the report via email

Automatically email the generated PDF report using the `send` function of the internal [email](../../app-builder/build-backend/functions/connectors/email.md) connector, triggered whenever a new report is created.

Return to the Backend Builder to add the final piece of logic to your flow.

{% stepper %}
{% step %}
#### Add the send function

From the Function Explorer, find your internal mailer instance and drag its `send` function onto the canvas.
{% endstep %}

{% step %}
#### Configure the static inputs

```yaml
# address
to: [your email address]
# subject
New Acceptance Report
# content
A new report has been submitted for review. Please see attached PDF.
```
{% endstep %}

{% step %}
#### Format the attachment data

The `send` function's `attachment` input requires a specific object format. Create it directly on the output of `fillTemplate`.

1. Add a JSONata [modifier](../../app-builder/build-backend/extension-nodes/modifier.md) extension node to the `fillTemplate` function.
2. Enter the following JSONata expression. It wraps the raw base64 output (`$`) with a filename and encoding:

```
{
  "filename": "Acceptance Report.pdf",
  "content": $,
  "encoding": "base64"
}
```
{% endstep %}

{% step %}
#### Connect the PDF and set the trigger

1. Connect the modifier of the `fillTemplate` function to the `attachment` input of the `send` function.
2. Connect the `attachment` input to the trigger of the `send` function.
3. Set the trigger to `on input change`.
{% endstep %}
{% endstepper %}

This creates a data-driven workflow: whenever `fillTemplate` generates a new PDF, its output is passed to the `attachment` input, and this change automatically triggers the `send` function.

<figure><img src="../../.gitbook/assets/image (83).png" alt=""><figcaption></figcaption></figure>

## Step 5: Deployment

Congratulations! 🥳 You have built a complete App that captures user input, saves it to a database, generates a customized PDF, and emails it as an attachment.

Click the Deploy button in the App Builder's Top Bar to publish the latest version and make it live.

Once deployed, open the App and test the full workflow. After you fill out and submit the report, the email address you configured in Step 4 receives an email with the PDF attachment, similar to the image below.

From here, you can expand the project by adding more fields, using your own report templates, or integrating this logic into a larger App.

<figure><img src="../../.gitbook/assets/image (84).png" alt=""><figcaption></figcaption></figure>
