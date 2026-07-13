# Label printer

The label printer connector creates, manages, and prints layout streams on industrial network-connected devices. It merges baseline template layouts with dynamic variables, accumulates them into distinct printing batches, and transmits raw text streams directly over TCP network connections.

You must create an instance of the `Label` class to preserve configuration schemas and track the state of accumulated label records.

## Instance and control

### `create`

Constructs a label printer instance and sets the initial layout template string.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>template</code></td><td>The layout layout blueprint string. Use <code>{{variableName}}</code> syntax to mark the layout fields that receive dynamic text updates.</td><td>string</td></tr></tbody></table>

#### Output

An instance of the label printer.

#### Example

This example initializes an instance using a standard Zebra Programming Language (ZPL) layout template tailored for a 4x6 inch label area:

```yaml
# template
^XA^LL1218^PW812^FO50,50^A0N,50,50^FD{{product_name}}^FS^FO50,120^A0N,30,30^FDPart No: {{part_number}}^FS^XZ
```

### `setTemplate`

Updates the print template layout blueprint for an existing instance. Calling this function automatically flushes all previously generated label text records from the internal print queue.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>template</code></td><td>The updated layout layout text block.</td><td>string</td></tr></tbody></table>

#### Output

Returns the updated template string.

#### Example

```yaml
# template
^XA^FO100,100^A0N,40,40^FD{{message}}^FS^XZ
```

### `getTemplate`

Retrieves the text blueprint layout currently assigned to the active instance.

#### Parameters

None.

#### Output

Returns the active template string line.

### `addLabel`

Generates a single label record by inserting dynamic key data variables straight into the template placeholders, then automatically saves the entry to the printing batch.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>variables</code></td><td>An object where each key corresponds exactly to an designated template placeholder tag name excluding the curly brackets.</td><td>object</td></tr></tbody></table>

#### Output

Returns the compiled text string value with all placeholder tags replaced. The function throws a validation error if any template placeholder variable is missing from the input properties object.

#### Example

```yaml
# variables
product_name: High-Torque Motor
part_number: HT-5000
```

### `showBatch`

Retrieves the complete sequence of generated label records currently stored in the queue.

#### Parameters

None.

#### Output

Returns a single concatenated text block containing all batched label instructions separated by carriage return and line feed markers (`\r\n`).

### `getNumberOfLabels`

Queries the total quantity of labels currently compiled inside the printing queue.

#### Parameters

None.

#### Output

Returns an integer tracking the length of the batch list.

### `clearBatch`

Clears out all accumulated label strings from the internal print queue to start a fresh batch sequence.

#### Parameters

None.

#### Output

Returns `true` when the print queue array flushes successfully.

### `removeDuplicates`

Filters out identical text strings from the current print queue to avoid wasting media rolls on duplicated output patterns.

#### Parameters

None.

#### Output

Returns an integer defining the total count of duplicate labels removed from the active batch list.

### `sendBatchToPrinter`

Transmits the compiled text block sequence directly to a network-connected industrial printer via a raw TCP socket connection.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>ip</code></td><td></td><td>The IP address of the destination network printer device.</td><td>string</td></tr><tr><td><code>port</code></td><td></td><td>The designated raw printing port. Default 9100.</td><td>integer</td></tr><tr><td><code>options</code></td><td><code>removeDuplicates</code></td><td>When set to <code>true</code>, automatically filters identical labels from the queue before transmitting data. Default false.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns a promise that resolves to `true` when transmission succeeds. The operation rejects with an error if the batch queue is empty, the connection times out past 5000 milliseconds, or network write paths fail.

#### Example

```yaml
# ip
192.168.1.123
# port
9100
# options
removeDuplicates: true
```

### `delete`

Removes the instance and clears the label batch queues from memory.

{% hint style="danger" %}
Deleting an instance removes its configuration. To communicate with the printer again, trigger `create` anew.
{% endhint %}

#### Parameters

None.

#### Output

Nothing.

## Tips and tricks

### Zebra hardware matching constraints
The socket layer pushes layout text chunks joined by standard network carriage returns and line feeds (`\r\n`). This raw TCP output channel perfectly suits default print servers like the Zebra ZT411 UHF, or any network thermal engine expecting unfiltered ZPL commands.

### Blueprint alteration behaviors
Altering your print layouts mid-flow via `setTemplate` completely strips out the underlying data array. Always trigger this method before running your loops, because updating a structural blueprint layout automatically resets the layout memory to safeguard against printing mismatched layout fields.
