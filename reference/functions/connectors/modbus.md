# Modbus

The Modbus connector reads and writes the coils and registers of a Modbus device. It frames the requests for you and supports both transports:

* **Modbus TCP**: for devices on an Ethernet network.
* **Modbus RTU**: for devices on a serial line (RS-485 or RS-232).

This connector requires [instance creation](README.md#instance-creation). One instance talks to one device: create it, connect it with `connectTcp` or `connectRtu`, then read and write.

{% hint style="info" %}
#### The connection is yours to open

An instance outlives restarts, its connection does not: after a restart of the agent, or when the device drops the line, reads and writes fail until you connect again. The connector does not reconnect by itself, so trigger `connectTcp` or `connectRtu` when the App starts, and again after a failure.
{% endhint %}

## Connection management

### `create`

Creates a Modbus client instance. It takes no parameters: the connection details follow in `connectTcp` or `connectRtu`.

#### Parameters

None.

#### Output

Returns the name of the created instance.

### `connectTcp`

Connects to a Modbus device over an Ethernet network. A new connection replaces the one the instance had.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>host</code></td><td>The hostname or IP address of the Modbus device.</td><td>string</td></tr><tr><td></td><td><code>port</code></td><td>The port of the device. Default 1502, see <a href="modbus.md#modbus-tcp-port-mapping">Modbus TCP port mapping</a>.</td><td>integer</td></tr><tr><td></td><td><code>unitId</code></td><td>The unit identifier of the target hardware. Default 1.</td><td>integer</td></tr><tr><td></td><td><code>socketTimeout</code></td><td>How long to wait for the connection, in milliseconds. Default 5000.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# options
host: 192.168.1.120
port: 502
unitId: 1
```

#### Output

Returns `true` when the connection is established. Throws an error if `host` is missing, the device refuses, or it does not answer within `socketTimeout`.

### `disconnectTcp`

Closes the Modbus TCP connection.

#### Parameters

None.

#### Output

Returns `true` when the connection is closed, also when there was none.

### `connectRtu`

Connects to a Modbus device over a serial port. A new connection replaces the one the instance had.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>path</code></td><td>The serial port on the host the agent runs on (such as <code>/dev/ttyUSB0</code> on Linux or <code>COM3</code> on Windows).</td><td>string</td></tr><tr><td></td><td><code>baudRate</code></td><td>The serial communication speed in bits per second. Default 9600.</td><td>integer</td></tr><tr><td></td><td><code>dataBits</code></td><td>The number of data bits per character frame (5, 6, 7, or 8). Default 8.</td><td>integer</td></tr><tr><td></td><td><code>stopBits</code></td><td>The number of stop bits at the end of each frame (1, 1.5, or 2). Default 1.</td><td>number</td></tr><tr><td></td><td><code>parity</code></td><td>The parity error-checking mode (none, even, or odd). Default 'none'.</td><td>string</td></tr><tr><td></td><td><code>unitId</code></td><td>The station address (unit ID) of the device on the serial bus. Default 1.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# options
path: /dev/ttyUSB0
baudRate: 19200
parity: even
unitId: 10
```

#### Output

Returns `true` when the serial port is open. Throws an error if `path` is missing or the port cannot be opened.

### `disconnectRtu`

Closes the serial port of the Modbus RTU connection.

#### Parameters

None.

#### Output

Returns `true` when the serial port is closed, also when none was open.

### `delete`

Deletes the instance and closes its TCP connection or serial port.

{% hint style="danger" %}
#### Irreversible action

To talk to the device again, trigger `create` and connect anew.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` upon removal.

## Reading and writing

### `read`

Reads coils or registers from the connected device and converts the answer to the data type you name.

A conversion yields one value, taken from the start of the answer: read one value per call, with the `length` its type needs (see the examples). `raw` hands back all bytes of the answer unconverted, and `string` decodes all of them as text.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>fc</code></td><td>The Modbus function code (1: Read Coils, 2: Read Discrete Inputs, 3: Read Holding Registers, 4: Read Input Registers).</td><td>integer</td></tr><tr><td></td><td><code>address</code></td><td>The zero-based address of the first coil or register, see <a href="modbus.md#addresses-are-offsets">Addresses are offsets</a>.</td><td>integer</td></tr><tr><td></td><td><code>length</code></td><td>The number of coils or 16-bit registers to read.</td><td>integer</td></tr><tr><td></td><td><code>dataType</code></td><td>How to convert the answer: raw, string, boolean, doubleBE, doubleLE, floatBE, floatLE, int16BE, int16LE, int32BE, int32LE, uint16BE, uint16LE, uint32BE or uint32LE. An unknown type falls back to raw with a warning in the agent's log. Default 'raw'.</td><td>string</td></tr></tbody></table>

#### Examples

Example 1: Read a single coil

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
address: 0
length: 1
dataType: int16BE
```

Example 3: Read a 32-bit big-endian floating point value from input registers

A 32-bit value spans two 16-bit registers, so `length` is 2. A double spans four.

```yaml
# options
fc: 4
address: 10
length: 2
dataType: floatBE
```

#### Output

Returns the value in the data type you named. Throws an error if no connection was opened, the function code is not 1 to 4, the device answers with an exception, or the answer is too short for the data type.

### `write`

Writes coils or registers on the connected device.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>data</code></td><td></td><td>The value to write. Its shape follows the function code: a boolean for 5, a number for 6, an array of booleans for 15, an array of numbers for 16.</td><td>boolean, number or array</td></tr><tr><td><code>addressInfo</code></td><td><code>fc</code></td><td>The Modbus function code (5: Write Single Coil, 6: Write Single Register, 15: Write Multiple Coils, 16: Write Multiple Registers).</td><td>integer</td></tr><tr><td></td><td><code>address</code></td><td>The zero-based address of the first coil or register.</td><td>integer</td></tr></tbody></table>

#### Examples

Example 1: Switch a single coil on

```yaml
# data
true
# addressInfo
fc: 5
address: 100
```

Example 2: Set a single 16-bit register

```yaml
# data
1234
# addressInfo
fc: 6
address: 0
```

Example 3: Set two consecutive registers

```yaml
# data
- 100
- 200
# addressInfo
fc: 16
address: 50
```

#### Output

Returns the raw response object of the underlying jsmodbus client, containing the request, the device response, and timing metrics. What matters for a flow is that the call completed without an error. Throws an error if no connection was opened, the function code is not 5, 6, 15 or 16, or the device refuses the write.

## String helper functions

### `readString`

Reads consecutive holding registers (function code 3) and decodes them as UTF-8 text.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>startAddress</code></td><td>The zero-based address of the first register.</td><td>integer</td></tr><tr><td><code>length</code></td><td>The number of 16-bit registers the text occupies: two characters per register.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# startAddress
100
# length
10
```

#### Output

Returns the text, with all null padding characters removed. Throws an error if the read fails or no data is received.

### `writeString`

Encodes a text as UTF-8 and writes it across consecutive holding registers (function code 16). See [Text padding](modbus.md#text-padding) for texts of uneven length.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>text</code></td><td>The text to write.</td><td>string</td></tr><tr><td><code>startAddress</code></td><td>The zero-based address of the first register.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# text
New Product ID
# startAddress
100
```

#### Output

Returns the raw response object of the underlying jsmodbus client, like `write`. Throws an error if the write fails or `text` is not a string.

## Tips and tricks

### Modbus TCP port mapping

The Modbus TCP standard port is 502. The connector defaults to 1502, the port simulators and some gateways use. For a device on the standard port, set `port: 502` in the options of `connectTcp`.

### Addresses are offsets

Every `address` is the zero-based offset the protocol itself uses, counted separately for coils, discrete inputs, input registers and holding registers. Device manuals often number registers in the classic notation instead, where holding registers start at 40001 and input registers at 30001. Subtract that base: holding register 40001 is `address: 0` with function code 3, and input register 30011 is `address: 10` with function code 4.

### Text padding

A register holds 16 bits, a character of plain text 8. `writeString` therefore writes two characters per register, and appends a null byte (`0x00`) to a text of uneven byte length so that the last register is full. `readString` removes null bytes again.
