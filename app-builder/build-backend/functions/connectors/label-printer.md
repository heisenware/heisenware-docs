# Label Printer

The label printer connector creates, manages, and prints labels on network-connected printers. It fills a template layout with dynamic variables, collects the generated labels into a batch, and sends the batch as raw text directly over a TCP connection, for example to a Zebra ZT411 UHF.

This connector requires [instance creation](./#instance-creation) before you can interact with a printer.

## Instance and template

### `create`

Creates a label printer instance and sets the initial layout template string.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>template</code></td><td>The layout template string. Use <code>{{variableName}}</code> syntax to mark the fields that receive dynamic text.</td><td>string</td></tr></tbody></table>

#### Example

This example initializes an instance using a Zebra Programming Language (ZPL) template for a 4x6 inch label:

```yaml
# template
^XA^LL1218^PW812^FO50,50^A0N,50,50^FD{{product_name}}^FS^FO50,120^A0N,30,30^FDPart No: {{part_number}}^FS^XZ
```

#### Output

Returns the name of the created instance.

### `setTemplate`

Updates the template for an existing instance. Calling this function also clears all previously generated labels from the batch.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>template</code></td><td>The new template string.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# template
^XA^FO100,100^A0N,40,40^FD{{message}}^FS^XZ
```

#### Output

Returns the updated template string.

### `getTemplate`

Retrieves the template currently assigned to the instance.

#### Parameters

None.

#### Output

Returns the active template string.

### `delete`

Removes the instance, including its template and the current batch.

{% hint style="danger" %}
#### Irreversible action

Deleting an instance removes its configuration and any unsent labels in the batch. To print again, you must trigger `create` anew.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` upon removal.

## Batch handling

### `addLabel`

Generates a single label by inserting the provided variables into the template placeholders and adds it to the batch.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>variables</code></td><td>An object where each key corresponds to a template placeholder name, without the curly brackets.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# variables
product_name: High-Torque Motor
part_number: HT-5000
```

#### Output

Returns the generated label string with all placeholders replaced. Throws an error if a template variable has no matching key in `variables`.

### `showBatch`

Returns all labels generated since the batch was last cleared.

#### Parameters

None.

#### Output

Returns a single string containing all generated labels, joined by line breaks.

### `getNumberOfLabels`

Retrieves how many labels the current batch contains.

#### Parameters

None.

#### Output

Returns an integer representing the number of labels in the batch.

### `removeDuplicates`

Removes duplicated labels from the current batch.

#### Parameters

None.

#### Output

Returns an integer representing the number of removed duplicates.

### `clearBatch`

Removes all generated labels from the current batch, starting a new, empty batch.

#### Parameters

None.

#### Output

Returns `true` upon successful clearing.

## Printing

### `sendBatchToPrinter`

Sends the current batch of labels to a network-connected printer over a raw TCP connection.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="200">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>ip</code></td><td></td><td>The IP address of the target printer.</td><td>string</td></tr><tr><td><code>port</code></td><td></td><td>The network port of the printer. Default 9100.</td><td>integer</td></tr><tr><td><code>options</code></td><td><code>removeDuplicates</code></td><td>When true, removes duplicated labels prior to printing. Default false.</td><td>boolean</td></tr></tbody></table>

#### Example

```yaml
# ip
192.168.1.123
# port
9100
```

#### Output

Returns `true` when the batch transmits successfully. Throws an error if the batch is empty, the connection fails, or the printer does not respond within 5 seconds.
