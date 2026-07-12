# Label Printer

The `Label` class is designed for creating, managing, and printing labels. It works by using a template string (for example, in a printer-specific language like ZPL) with placeholders that can be dynamically filled with data. Multiple labels can be generated and collected into a single batch, which can then be sent directly to a network-connected printer.

Because this class manages state (like the current batch of labels), you must first create an instance of it before using its functions.

***

### create

Creates an instance of a label-maker and sets the initial template.

Parameters

* template: A string representing the label's layout. Use `{{variable}}` syntax for placeholders that will be replaced with data.

Example

This example creates a `Label` instance with a simple ZPL template for a 4x6 inch label.

```yaml
# template
^XA^LL1218^PW812^FO50,50^A0N,50,50^FD{{product_name}}^FS^FO50,120^A0N,30,30^FDPart No: {{part_number}}^FS^XZ
```

***

### setTemplate

Updates the template for an existing `Label` instance. Note that calling this function will also clear the current batch of any previously generated labels.

Parameters

* template: The new template string to use for subsequent labels.

Example

```yaml
# template
^XA^FO100,100^A0N,40,40^FD{{message}}^FS^XZ
```

***

### addLabel

Generates a new label by filling the current template with the provided variables. The newly created label is added to the internal batch for later printing. The function also returns the single, generated label string.

Parameters

* variables: An object where each key corresponds to a placeholder in the template (without the curly braces) and its value is the data to be inserted.

Example

Using the template from the `create` example, this adds a specific product label to the batch.

```yaml
# variables
product_name: High-Torque Motor
part_number: HT-5000
```

Output

Returns the generated label string with variables replaced. For example: `^XA^LL1218^PW812^FO50,50^A0N,50,50^FDHigh-Torque Motor^FS^FO50,120^A0N,30,30^FDPart No: HT-5000^FS^XZ`

***

### showBatch

Returns the entire current batch of labels that have been generated since the last time the batch was cleared.

Parameters

None.

Output

A single string containing all generated labels concatenated together.

***

### clearBatch

Removes all previously generated labels from the current batch, effectively starting a new, empty batch.

Parameters

None.

Output

Returns `true` upon successful clearing of the batch.

***

### sendBatchToPrinter

Sends the entire current batch of labels to a specified printer over the network.

Parameters

* ip: The IP address of the target printer.
* port: The network port of the printer. Defaults to `9100` if not specified.

Example

```yaml
# ip
192.168.1.123
# port
9100
```

Output

This function returns a Promise. In the platform, this means it will return `null` if the batch is sent successfully or an error object if the connection or printing fails.
