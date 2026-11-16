# PDF templates

A PDF template is a page layout with named placeholders, drawn in the [Template editor](../../../app-builder/template-editor.md): fixed text and pictures, an existing PDF as the background, and a placeholder wherever a value belongs. Each template you draw becomes an instance of the `PdfTemplate` class, named as you named it.

From a flow you use one function on it: `fillTemplate`. It takes an object of values, puts them where their placeholders are, and answers the finished document. Everything else about a template, its pages, its elements and their positions, belongs to the editor.

You find the templates under **Utilities** > **PDF Templates** in the Functions explorer, one instance per template. You cannot create one from the Flowboard; the Template editor makes and removes them.

### `fillTemplate`

Fills the template's placeholders with your values and renders the document.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="150">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>values</code></td><td></td><td>One object with a key per placeholder. The key is the variable name the editor shows, for example <code>firstName</code> or <code>orderDate</code>. A nested object is addressed with dots: a placeholder named <code>customer.city</code> takes <code>{ customer: { city: 'Hamburg' } }</code> as well as <code>{ 'customer.city': 'Hamburg' }</code>. A placeholder for a picture takes a base64 PNG or JPEG string, or the path of a picture on the shared volume. A <a href="../../widgets/input/signature.md">signature</a> or a <a href="../../widgets/input/photo.md">photo</a> hands over a file entry, so take its <code>base64</code> with a modifier first.</td><td>object</td></tr><tr><td><code>options</code></td><td><code>showEmptyVariables</code></td><td>Prints the variable name in angle brackets, such as <code>&lt;firstName&gt;</code>, wherever a value is missing. With false, such a placeholder stays blank. Default false.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns the finished PDF as a base64-encoded string. The executor shows it as a page preview on its output, so you see the filled document while you build. When rendering fails, the function answers nothing and writes the reason to the log.

From there the document goes on as a value: as the attachment of an [email](../connectors/email.md), into a [media view](../../widgets/display/media-view.md), or into the workspace's file store so that a table row keeps it and a user can download it. See [Files, data and dates](../../../concepts/files-data-and-dates.md).

#### Example

```yaml
# values
name: John
surname: Doe
signature: iVBORw0KGgoAAAANSUhEUg...
# options
showEmptyVariables: true
```

<figure><img src="../../../.gitbook/assets/Screenshot 2025-02-20 at 16.10.48.png" alt="A fillTemplate executor with the rendered page shown on its output"><figcaption>The executor previews the document it rendered</figcaption></figure>

## Filling a template from a flow

One call fills the whole document, so assemble the values first and trigger `fillTemplate` once. A typical chain: read the rows, merge them into one object (`mergeObjects` in [Data processing](data-processing.md)), wire that object into `values`, and trigger the template from whatever decided that the document is due.

{% hint style="info" %}
#### Dates and numbers are text here

The template prints every value as it arrives. It knows nothing about the App's language or the user's time zone, so a date must already be the text you want to see.

Format it before it reaches the template: [`Database.fillTemplate`](../storage/relational-database.md#filltemplate) builds a sentence from table rows and takes `locale` and `timeZone` as options, which you feed with `$LOCALE` and `$TIMEZONE`. For a single value, a [modifier](../../../app-builder/flowboard/modifier.md) with `Intl.DateTimeFormat` does the same. Never hard-code a language or a zone: see [Languages and time zones](../../../concepts/languages-and-time-zones.md).
{% endhint %}

## Full tutorial

See the step-by-step tutorial to build a dynamic acceptance report from start to finish:

[From Data to Document: Automating PDF Reports](../../../labs/automating-pdf-reports.md)
