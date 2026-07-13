# Label Printer

The label printer connector creates, manages, and prints layout streams on industrial network-connected devices. It merges template layouts with dynamic variables, groups them into distinct printing batches, and transmits raw text streams directly over TCP connections.

This connector requires [instance creation](./#instance-creation) before you can interact with a printer.

## Instance and control

### `create`

Constructs a label printer instance and sets the initial layout template string.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>template</code></td><td>The layout blueprint string. Use <code>{{variableName}}</code> syntax to mark the layout fields that receive dynamic text updates.</td><td>string</td></tr></tbody></table>

#### Example

This example initializes an instance using a standard Zebra Programming Language (ZPL) layout template tailored for a 4x6 inch label area:

```yaml
# template
^XA^LL1218^PW812^FO50,50^A0N,50,50^FD{{product_name}}^FS^FO50,120^A0N,30,30^FDPart No: {{part_number}}^FS^XZ
```

#### Output

Returns the label printer instance. Throws an error if configuration fails.

### `setTemplate`

Updates the print template layout blueprint for an existing instance. Calling this function automatically clears all previously generated label records from the internal print queue.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>template</code></td><td>The updated layout text block.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# template
^XA^FO100,100^A0N,40,40^FD{{message}}^FS^XZ
```

#### Output

Returns the updated template string.

### `getTemplate`

Retrieves the text blueprint layout currently assigned to the active instance.

#### Parameters

None.

#### Output

Returns the active template string.

### `addLabel`

Generates a single label record by inserting dynamic variables directly into the template placeholders, then saves the entry to the printing batch.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>variables</code></td><td>An object where each key corresponds to a designated template placeholder name, excluding the curly brackets.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# variables
product_name: High-Torque Motor
part_number: HT-5000
```
