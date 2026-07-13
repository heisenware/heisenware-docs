# Modbus

The Modbus connector provides a unified interface for communicating with Modbus devices. It handles low-level data framing and supports the two primary industrial communication protocols:

* Modbus TCP: For devices connected over an Ethernet network.
* Modbus RTU: For devices connected over serial lines (such as RS-485 or RS-232).

To communicate with a device, you must first create a connector instance and then call the appropriate connection function to establish an active session before executing any read or write transactions.

## Connection management

### `connectTcp`

Connect to a Modbus device over an Ethernet network.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>host</code></td><td>The hostname or IP address of the Modbus device. Required.</td><td>string</td></tr><tr><td></td><td><code>port</code></td><td>The target network port. Default 1502.</td><td>integer</td></tr><tr><td></td><td><code>unitId</code></td><td>The unit identifier of the target hardware. Default 1.</td><td>integer</td></tr><tr><td></td><td><code>socketTimeout</code></td><td>Network connection timeout threshold in milliseconds. Default 5000.</td><td>integer</td></tr></tbody></table>

#### Output

Returns `true` when a network connection is successfully established.

#### Example

```yaml
# options
host: 192.168.1.120
port: 502
unitId: 1
```

### `disconnectTcp`

Close the active Modbus TCP socket connection.

#### Parameters

None.

#### Output

Returns `true` when the network socket closes successfully.

### `connectRtu`

Connect to a Modbus device over a serial interface.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>path</code></td><td>The local platform file path of the serial port (such as <code>/dev/ttyUSB0</code> on Linux or <code>COM3</code> on Windows). Required.</td><td>string</td></tr><tr><td></td><td><code>baudRate</code></td><td>The sequential serial communication speed. Default 9600.</td><td>integer</td></tr><tr><td></td><td><code>dataBits</code></td><td>The count of data bits per character packet (5, 6, 7, or 8). Default 8.</td><td>integer</td></tr><tr><td></td><td><code>stopBits</code></td><td>The spacing bit count at the end of each packet (1, 1.5, or 2). Default 1.</td><td>number</td></tr><tr><td></td><td><code>parity</code></td><td>Error check tracking bit configuration (none, even, odd). Default 'none'.</td><td>string</td></tr><tr><td></td><td><code>unitId</code></td><td>The serial bus unit station address. Default 1.</td><td>integer</td></tr></tbody></table>

#### Output

Returns `true` when the serial port opens successfully.

#### Example

```yaml
# options
path: /dev/ttyUSB0
baudRate: 19200
parity: even
unitId: 10
```

### `disconnectRtu`

Close the active Modbus RTU serial port connection.

#### Parameters

None.

#### Output

Returns `true` when the serial port closes successfully.

### `delete`

Removes the instance and frees its associated network or serial resources.

{% hint style="danger" %}
Deleting an instance removes its configuration. To communicate with the device again, trigger `create` anew.
{% endhint %}

#### Parameters

None.

#### Output

Nothing.

## Data read and write operations

### `read`

Read data from coils or registers on the connected Modbus device. The function automatically handles the underlying Modbus function code framing and parses raw buffers into JavaScript primitives based on your configuration.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>fc</code></td><td>The Modbus function code used to request data (1: Read Coils, 2: Read Discrete Inputs, 3: Read Holding Registers, 4: Read Input Registers). Required.</td><td>integer</td></tr><tr><td></td><td><code>address</code></td><td>The zero-based starting register or element offset address. Required.</td><td>integer</td></tr><tr><td></td><td><code>length</code></td><td>The total number of sequential elements or 16-bit registers to read. Required.</td><td>integer</td></tr><tr><td></td><td><code>dataType</code></td><td>The target binary parser type used to interpret the raw incoming buffer elements (raw, string, boolean, doubleBE, doubleLE, floatBE, floatLE, int16BE, int16LE, int32BE, int32LE, uint16BE, uint16LE, uint32BE, uint32LE). Default 'raw'.</td><td>string</td></tr></tbody></table>

#### Output

The requested values fetched from the target hardware registers, parsed into the specified data type representation.

#### Examples

Example 1: Read a single discrete coil element

```yaml
# options
fc: 1
address: 100
length: 1
dataType: boolean
```

Example 2: Read a 16-bit big-endian signed integer from a holding register

```yaml
# options
fc: 3
address: 40001
length: 1
dataType: int16BE
```

Example 2: Read a 32-bit big-endian floating point variable

Because 32-bit values span two discrete 16-bit Modbus memory registers, the length parameter must be set to 2.

```yaml
# options
fc: 4
address: 30010
length: 2
dataType: floatBE
```

### `write`

Write data payloads directly to target coil or register elements on the connected Modbus hardware.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>data</code></td><td></td><td>The single literal value, array of values, or raw binary Buffer payload to write to the destination device registers. Required.</td><td>any</td></tr><tr><td><code>addressInfo</code></td><td><code>fc</code></td><td>The Modbus transaction function code (5: Write Single Coil, 6: Write Single Register, 15: Write Multiple Coils, 16: Write Multiple Registers). Required.</td><td>integer</td></tr><tr><td></td><td><code>address</code></td><td>The zero-based starting offset address for the target elements. Required.</td><td>integer</td></tr></tbody></table>

#### Output

An object containing the response summary block returned by the underlying client layer.

#### Examples

Example 1: Toggle a single coil active

```yaml
# data
true
# addressInfo
fc: 5
address: 100
```

Example 2: Set a single 16-bit register value

```yaml
# data
1234
# addressInfo
fc: 6
address: 40001
```

Example 3: Update multiple sequential register data elements

```yaml
# data
- 100
- 200
# addressInfo
fc: 16
address: 40050
```

## String helper functions

### `readString`

Read register values sequentially from a specified holding register starting address and extract them as a decoded text string.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>startAddress</code></td><td>The zero-based register starting offset address.</td><td>integer</td></tr><tr><td><code>length</code></td><td>The total number of consecutive 16-bit registers containing the string character sequence.</td><td>integer</td></tr></tbody></table>

#### Output

The text string parsed from the targeted registers, with all empty trailing null padding characters removed automatically.

#### Example

```yaml
# startAddress
40100
# length
10
```

### `writeString`

Encode an alphanumeric text string into binary format and write the resulting character blocks across consecutive holding registers.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>text</code></td><td>The text string to transmit to the target device.</td><td>string</td></tr><tr><td><code>startAddress</code></td><td>The zero-based register destination starting offset address.</td><td>integer</td></tr></tbody></table>

#### Output

The response structure returned by the internal Modbus communication engine.

#### Example

```yaml
# text
New Product ID
# startAddress
40100
```

## Tips and tricks

### Modbus TCP port mapping configurations
While the official Modbus TCP standard mandates network communication over port `502`, several virtual test rigs or secure industrial gateway firewalls route traffic along port `1502`. The connector automatically binds to port `1502` by default. If your physical controller expects standard port constraints, make sure to explicitly override the port assignment inside your configuration options block during connection initialization.

### Text string encoding padding rules
Modbus memory maps allocate a full 16-bit word space per register, whereas conventional text strings occupy single 8-bit bytes per character. When executing `writeString`, the string processor handles this allocation automatically. If your text payload compiles to an uneven byte length count, the helper joins a trailing null termination byte (`0x00`) to fill the final register block correctly.
```

***

````markdown
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
```
