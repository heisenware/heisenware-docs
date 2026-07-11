# PDF Template Editor

The PDF Template Editor gives you a visual workflow for designing dynamic documents. You build a template by placing dynamic placeholders onto an uploaded PDF background.

{% hint style="info" %}
The editor works exclusively with the [PDF Templates class](../build-backend/function-explorer/utilities/pdf-templates.md). Each template you create becomes an instance in this class, carrying the `fillTemplate` function that populates your document with data.

To see the complete process in action, follow our [step-by-step guide](../../tutorials/app-templates/automating-pdf-reports.md).
{% endhint %}

## Creating a PDF template

{% stepper %}
{% step %}
#### Open the editor

Open the PDF Template Editor from the Top Bar. <img src="../../.gitbook/assets/image (86).png" alt="" data-size="line">
{% endstep %}

{% step %}
#### Define properties

Enter a unique name for your template and choose a standard page size (`A4`, `A5`, or `Letter`).
{% endstep %}

{% step %}
#### Generate instance

Click Create Template. Heisenware generates the corresponding instance in your Function Explorer.
{% endstep %}
{% endstepper %}

<figure><img src="../../.gitbook/assets/create_pdf_template_looped.gif" alt="" width="563"><figcaption></figcaption></figure>

## Designing the layout

Once your template is created, set up the visual background and place your dynamic fields.

### Managing pages and backgrounds

To use an existing document as a layout, first upload its pages as separate PDF files to the [File Explorer](../build-backend/file-explorer.md).

{% stepper %}
{% step %}
#### Add blank pages

Add a blank page for each page of your source document using the Add Page icon (<i class="fa-circle-plus">:circle-plus:</i>).
{% endstep %}

{% step %}
#### Set background

Drag each page file from the File Explorer onto the corresponding blank page. This sets the file as a static background.
{% endstep %}

{% step %}
#### Organize

Right-click a page to open the context menu, where you move pages up or down or manage the layering (Bring to Front / Send to Back).
{% endstep %}
{% endstepper %}

{% hint style="danger" %}
#### Deleting a page is permanent

It removes the page, its background, and all placeholders on it. You cannot currently replace the background of an existing page.
{% endhint %}

### Placing and configuring placeholders

Placeholders are the dynamic slots where your logic inserts data.

{% stepper %}
{% step %}
#### Add placeholder

Click the text or image placeholder icon in the toolbar (<i class="fa-text-size">:text-size:</i>, <i class="fa-image">:image:</i>), then click the page to place it.
{% endstep %}

{% step %}
#### Assign variable

Select the placeholder and click the gear icon. Provide a variable name (e.g., `firstName`).
{% endstep %}

{% step %}
#### Style

Adjust the font, size, or colors for text, or resize the bounding boxes to define the final content area.
{% endstep %}
{% endstepper %}

{% hint style="info" %}
#### Data matching

The variable name you enter (e.g., `invoiceNumber`) must exactly match the key in the data object you provide in your backend logic later. The editor adds the `<>` tags automatically.
{% endhint %}

<figure><img src="../../.gitbook/assets/Useing_template.png" alt="" width="563"><figcaption></figcaption></figure>

## Populating the template

To bring your PDF to life, call the [`fillTemplate`](../build-backend/function-explorer/utilities/pdf-templates.md#filltemplate) function in your backend logic. It is the engine: it takes a data object (say, a JSON object from a database), merges the values into your placeholders, and outputs the finished PDF. For detailed input and output specifications, see the [PDF Templates class documentation](../build-backend/function-explorer/utilities/pdf-templates.md).

To see these concepts in action, follow our step-by-step guide on [automating PDF reports](../../tutorials/app-templates/automating-pdf-reports.md).

## Deleting a template

To permanently remove a PDF template and its associated function:

1. Navigate to the [Function Explorer](../build-backend/function-explorer/).
2. Open the PDF Templates class.
3. Right-click the specific template instance.
4. Select Remove.

{% hint style="danger" %}
#### This action is irreversible

Deleting an instance removes it completely. Any logic in your Backend Builder referencing this template will break.
{% endhint %}

<figure><img src="../../.gitbook/assets/deleting_template_looped.gif" alt=""><figcaption></figcaption></figure>
