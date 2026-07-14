# Automating PDF reports

Learn how to build an App that lets users fill out and sign an acceptance report, save the submission to a relational database, and email it automatically as a PDF.

## Before you begin

First, download the blank `acceptance_report.pdf` file. You will upload this file to the File Explorer to use as the template background.

You can build the App from scratch by following this guide, or start with the finished App logic by downloading the tag file below and importing it into your account.

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
The signature widget outputs a raw base64 string. Use an extension node to format it as an object for the database.

1. Drag a [data store](../../app-builder/build-backend/functions/storage/data-store.md) function onto the canvas and connect the output of the signature widget to its input.
2. Add a [modifier](../../app-builder/build-backend/extension-nodes/modifier.md) extension node after the data store function. Configure it with the following expression to wrap the signature string in an object:

```javascript
{signature: x}
