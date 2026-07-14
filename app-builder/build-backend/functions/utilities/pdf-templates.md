# PDF templates

With PDF templates, you generate finished PDF documents by merging your App's data with layouts designed in the [PDF Template Editor](../../../build-frontend/pdf-template-editor.md). Each template you create becomes its own instance holding the `fillTemplate` function for its layout. This article covers how to use that function in your backend logic; for designing templates visually, refer to the editor article.

## `fillTemplate`

Programmatically merges your data with the pre-designed layout and generates a finished document.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>values</code></td><td>A data object with key-value pairs. The keys (for example <code>firstName</code>, <code>orderDate</code>) must exactly match the variable names you configured for the placeholders in the PDF Template Editor. Nested objects are supported: a placeholder named <code>customer.name</code> matches <code>{ customer: { name: ... } }</code>.</td><td>object</td></tr><tr><td><code>options</code></td><td><code>showEmptyVariables</code>: when <code>true</code>, placeholders without a value show the variable name in angle brackets on the final PDF, for example <code>&#x3C;firstName></code>. Defaults to <code>false</code>, which leaves them empty.</td><td>object</td></tr></tbody></table>

### Example

```yaml
# values
name: John
surname: Doe
signature: iVBORw0KGgoAAAANSUhEUg...
# options
showEmptyVariables: true
```

Image placeholders take a base64-encoded PNG or JPG string, like the signature above.

### Output

The function outputs the finished, populated PDF document as a base64-encoded string. While designing your logic, the function node itself shows a preview of the rendered PDF with your template's layout. You can store the output in a [database](../storage/relational-database.md), visualize it in the [media view widget](../../../build-frontend/widgets/display-widgets/media-view.md), send it as an [email](../connectors/email.md) attachment, or process it further in any other way your App requires.

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-02-20 at 16.10.48.png" alt=""><figcaption><p>A simple example of a fillTemplate function</p></figcaption></figure>

{% hint style="info" %}
#### Notes

* Each execution generates a brand new document and fills the entire template in a single operation.
* For templates with many fields, gather all the necessary data into one structured object before passing it to the function.
* Each output is a separate document, isolated to the user session that triggered the function.
{% endhint %}

## Full tutorial

To see PDF templates in action, follow our complete step-by-step guide where we build a dynamic acceptance report from start to finish:

[From Data to Document: Automating PDF Reports](../../../../tutorials/app-templates/automating-pdf-reports.md)
