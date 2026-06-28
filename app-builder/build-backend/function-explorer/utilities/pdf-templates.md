# PDF Templates

PDF Templates is a special class that contains all the template instances you create using the PDF Template Editor. Each instance holds the specific `fillTemplate` function for its corresponding layout. For a full guide on how to visually design a template, please refer to the main [PDF Template Editing](../../../build-frontend/pdf-template-editor.md) article. This document focuses on how to use the function in your backend logic.

## fillTemplate

The `fillTemplate` function is the engine that programmatically merges your application's data with a pre-designed PDF layout to generate a finished document.

### Input

The function has two inputs: a required data object and an optional configuration object.

* **Values** (required): A standard data object with key-value pairs. The keys in this object (e.g., `firstName`, `orderDate`) must exactly match the variable names you configured for the placeholders in the Template Editor.
* **Options** (optional): A JSON object for configuring the function's behavior. It has one property:
  * `showEmptyVariables`: Set to `true` to display `null` or `undefined` on the final PDF if a placeholders value is undefined in the data object. Defaults to `false`, which shows nothing for empty values.

**Example:**

```yaml
#values
name: John
surname: Doe
signature: data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...
#options
showEmptyVariables: true
```

### Output

The function provides the finished, populated PDF document as a Base64 encoded string. While designing your logic, the function block itself will show a preview of the rendered PDF with your template's layout. The output can be used to store the document in a [database](../storage/relational-database.md), visualize it in the [media view widget](../../../build-frontend/widgets/display-widgets/media-view.md), send it as an [email](../connectors/email.md) attachment, or process it further in any other way your application requires.

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-02-20 at 16.10.48.png" alt=""><figcaption><p>A simple example of a fillTemplate function</p></figcaption></figure>

{% hint style="info" %}
## Important Notes

* Data is Overwritten: Each execution of the `fillTemplate` function generates a brand new document and completely overwrites all fields.
* **Fill All at Once**: The function is designed to populate the entire template in a single operation.
* **Complex Data**: For templates with many fields, it is a best practice to first gather all the necessary data into a single, structured object before passing it to the function.
* **User-Specific Documents**: Each output is a separate document isolated for the user session that triggered the function.
{% endhint %}

## Full Tutorial

To see the PDF Templates class in action, follow our complete step-by-step guide where we build a dynamic acceptance report from start to finish.

[From Data to Document: Automating PDF Reports](../../../../tutorials/app-templates/automating-pdf-reports.md)
