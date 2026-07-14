# PDF templates

PDF templates let you generate PDF documents by merging App data with layouts designed in the [PDF Template Editor](../../../build-frontend/pdf-template-editor.md). Each template operates as an instance that contains the `fillTemplate` function for its layout. This article describes how to use this function in backend logic. To design templates visually, see the editor documentation.

### `fillTemplate`

Merges data with the pre-designed layout and generates a completed document.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>values</code></td><td></td><td>A data object containing key-value pairs. The keys must exactly match the variable names configured for placeholders in the PDF Template Editor (such as <code>firstName</code> or <code>orderDate</code>). Supports nested objects.</td><td>object</td></tr><tr><td><code>options</code></td><td><code>showEmptyVariables</code></td><td>Displays the variable name in angle brackets (such as <code>&lt;firstName&gt;</code>) for placeholders without a value. If false, leaves them empty. Default false.</td><td>boolean</td></tr></tbody></table>

#### Example

```yaml
# values
name: John
surname: Doe
signature: iVBORw0KGgoAAAANSUhEUg...
# options
showEmptyVariables: true
```

#### Output

Returns the populated PDF document as a base64-encoded string. During development, the function node displays a preview of the rendered PDF layout. Store the output in a [database](../storage/relational-database.md), display it in a media view widget, or send it as an [email](../connectors/email.md) attachment.

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-02-20 at 16.10.48.png" alt=""><figcaption>The fillTemplate function node preview</figcaption></figure>

{% hint style="info" %}
#### Document generation

Each execution generates a new document and populates the entire template in a single operation. For templates with multiple fields, assemble the required data into a single structured object before passing it to the function. Each output document remains isolated to the user session that triggered the function.
{% endhint %}

## Full tutorial

See the step-by-step tutorial to build a dynamic acceptance report from start to finish:

[From Data to Document: Automating PDF Reports](../../../../tutorials/app-templates/automating-pdf-reports.md)
```─
