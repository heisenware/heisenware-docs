---
description: >-
  A form and a signature become a row in the database, a filled PDF and an email.
---

# Automating PDF reports

A user fills out an acceptance report on a tablet, signs it with a finger, and taps Submit. The App saves the submission, renders it into the company's PDF form, and emails that PDF to the office. This lab builds the whole way.

## Before you begin

Download the blank form. You upload it into the [Files explorer](../app-builder/explorers/files.md) and use it as the background of the PDF template.

{% file src="../.gitbook/assets/acceptance_report.pdf" %}

The finished logic is also available as a bundle. Import it with **Tags** > **Import** in the Builder's top bar, click the imported tag and confirm **Switch**. You still have to upload the PDF and point the template at it.

{% file src="../.gitbook/assets/acceptance-report-app.hwt" %}

{% hint style="info" %}
This bundle was exported by an older platform. Importing it still works: its records are brought up to date on the way in. The App's icon and its language have to be set once more afterwards.
{% endhint %}

## Step 1: the table

The table belongs to the workspace, so it is made in the [Database editor](../app-builder/database-editor.md), not by a function on the Flowboard. Open it from the Builder's top bar, choose `internal-postgres`, and in the **Model** tab use **New table** to make `acceptanceReports`:

| Field | Type | Why |
| --- | --- | --- |
| `customerName` | string | |
| `projectId` | string | |
| `acceptanceDate` | dateonly | a calendar date is the same day everywhere |
| `comments` | text | |
| `signature` | file | a row keeps a file's entry, never its bytes |

`id`, `createdAt` and `updatedAt` are added for you.

The `signature` field is a **file** field. The [signature](../reference/widgets/input/signature.md) widget delivers exactly what such a field takes: one file's entry, `{ name: 'signature.png', type: 'image/png', size, base64 }`, with the PNG inline because it is small. See [Files, data and dates](../concepts/files-data-and-dates.md#files-a-row-keeps).

## Step 2: the form and the submission

### The page

{% stepper %}
{% step %}
#### The form

Place a [form](../reference/widgets/input/form.md) widget. Give it one field per column, with the field names exactly as the columns are called: `customerName`, `projectId`, `acceptanceDate` (a date picker), `comments`. Write the labels in the language your users read.

Switch **Show submit button** on and set its text to `Submit`. The form then writes its data on a valid submit and nothing else, which is the one impulse this flow needs.
{% endstep %}

{% step %}
#### The signature

Place a [signature](../reference/widgets/input/signature.md) widget below the form.
{% endstep %}
{% endstepper %}

<figure><img src="../.gitbook/assets/image (73).png" alt="The page with the form, the signature pad and the submit button" width="377"><figcaption></figcaption></figure>

### The flow

{% stepper %}
{% step %}
#### Pick the signature up

A widget writes an executor's input, so the signature needs a node of its own. Drag **New Echo Executor** from the Flowboard toolbar, select the echo and drag the signature widget onto its input.

Add a [modifier](../app-builder/flowboard/modifier.md) to the echo's output that names the entry the way the column is called:

```javascript
({ signature: x })
```
{% endstep %}

{% step %}
#### Merge it with the form

Drag [`mergeObjects`](../reference/functions/utilities/data-processing.md#mergeobjects) onto the Flowboard.

1. Link the form's `submitted` property to its first input.
2. Wire the signature modifier to its second input.
3. Make the **first** input hot: drag it onto the executor's trigger. The submit drives the flow; the signature is read as context, whenever it was drawn.

Only one input is hot on purpose. Two would run the whole chain again the moment someone redraws a signature. See [When streams meet](../concepts/when-streams-meet.md).
{% endstep %}

{% step %}
#### Save the row

Drag [`addRow`](../reference/functions/storage/relational-database.md#addrow) onto the Flowboard, on the instance `internal-postgres`:

```yaml
# table
acceptanceReports
```

Wire the output of `mergeObjects` to its `data` input and make that input hot.
{% endstep %}

{% step %}
#### Empty the form again

Link the output of `addRow` to the form's `clear` property. The form returns to its default values once the row is safely in the database, ready for the next entry.
{% endstep %}
{% endstepper %}

## Step 3: the PDF template

### Design it

{% stepper %}
{% step %}
#### Upload the background

Upload `acceptance_report.pdf` in the [Files explorer](../app-builder/explorers/files.md).
{% endstep %}

{% step %}
#### Make the template

Open the [Template editor](../app-builder/template-editor.md) from the Builder's top bar and make a new template called `AcceptanceReport`.
{% endstep %}

{% step %}
#### Set the background

Drag the uploaded PDF from the Files explorer onto the page. It becomes the static background.
{% endstep %}

{% step %}
#### Place the placeholders

With **Add Text Variable**, place one box per value and name it after the key it takes: `customerName`, `projectId`, `acceptanceDate`, `comments`.

With **Add Image Variable**, place the signature box and name it **`signature.base64`**. A dot reaches into a nested value, and the file's entry carries its PNG under `base64`.

Resize each box to say how much room the value has, and make sure every placeholder lies above the background.
{% endstep %}
{% endstepper %}

<figure><img src="../.gitbook/assets/image (82).png" alt="The template with text placeholders and the signature's image placeholder over the uploaded form"><figcaption></figcaption></figure>

### Fill it

1. On the Flowboard, open **Utilities** > **PDF Templates** > **AcceptanceReport** and drag its [`fillTemplate`](../reference/functions/utilities/pdf-templates.md#filltemplate) onto the board. Templates are made in the Template editor, so there is no `create` to run.
2. Wire the output of `mergeObjects` to its `values` input.
3. Wire the output of `addRow` to its trigger, so the document is only rendered once the row is saved.

`fillTemplate` answers the finished document as a base64 string, and the executor shows the rendered page on its output while you build.

## Step 4: the email

{% stepper %}
{% step %}
#### Build the attachment

Add a modifier to the output of `fillTemplate` that names the document:

```javascript
[{
  name: 'Acceptance report.pdf',
  type: 'application/pdf',
  base64: x
}]
```

`send` takes a list of attachments, and a file as small content like this travels as it is. A file a row already keeps is attached the same way, by its entry: no conversion, no path.
{% endstep %}

{% step %}
#### Add the send function

Every workspace has a ready-made [email](../reference/functions/connectors/email.md) instance called `internal-email`. Drag its `send` onto the Flowboard. Its emails come from `<Account> Notifier <no-reply@heisenware.com>`, which is fine while you try the flow.

For a report that really goes out, create an instance of your own with your SMTP server's details, and right-click the `auth` input and choose **Secret Input** so the password is masked everywhere. Every credential belongs in a secret, never in a plain input value.
{% endstep %}

{% step %}
#### Configure it

```yaml
# address
to: quality@acme.example
# subject
New acceptance report
# content
A new report has been submitted for review. The PDF is attached.
```
{% endstep %}

{% step %}
#### Connect and trigger

Wire the attachment modifier to the `attachments` input and make that input hot. Every new document then sends one email.

Add an [error handler](../app-builder/flowboard/error-handler.md) to `send`'s output and drop the **Toast** action on it, with **Take message from the live value** on and the type **Error**. A mail server that refuses the message then says so on the screen instead of failing silently.
{% endstep %}
{% endstepper %}

<figure><img src="../.gitbook/assets/image (83).png" alt="The finished flow: form and signature merged, saved, rendered and sent"><figcaption></figcaption></figure>

## Step 5: try it and deploy

Click **Test** and fill the form as a user would. Check the row in the Database editor's **Rows** tab, look at the rendered page on `fillTemplate`'s output, and watch for the email.

Then click **Deploy**. The **Distribute Your App** dialog gives you the link and a QR code for the tablet.

<figure><img src="../.gitbook/assets/image (84).png" alt="The email with the filled PDF attached"><figcaption></figcaption></figure>

## What to change next

* **Dates and words for people**: `fillTemplate` prints what it is given. Where a date must read as text, format it with `$LOCALE` and `$TIMEZONE` in a modifier, or let [`fillTemplate`](../reference/functions/storage/relational-database.md#filltemplate) of the database build the sentence with its `locale` and `timeZone` options.
* **A copy for the customer**: a second recipient on `send`, or a [media view](../reference/widgets/display/media-view.md) on the page that shows the document before it leaves.
* **A fillable PDF**: if your background carries form fields, **Auto generate variables** in the Template editor places a text variable for every one of them, named after the field.
