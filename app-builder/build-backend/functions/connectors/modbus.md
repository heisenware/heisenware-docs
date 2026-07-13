# Modbus

The Modbus connector provides a unified interface for communicating with Modbus devices. It handles low-level data framing and supports the two primary industrial communication protocols:

* Modbus TCP: For devices connected over an Ethernet network.
* Modbus RTU: For devices connected over serial lines (such as RS-485 or RS-232).

This connector requires [instance creation](./#instance-creation) before you can communicate with a device. You must establish an active session using the appropriate connection function before executing any read or write transactions.

## Connection management

### `connectTcp`

Connects to a Modbus device over an Ethernet network.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>host</code></td><td>The hostname or IP address of the Modbus device.</td><td>string</td></tr><tr><td></td><td><code>port</code></td><td>The target network port. Default 1502.</td><td>integer</td></tr><tr><td></td><td><code>unitId</code></td><td>The unit identifier of the target hardware. Default 1.</td><td>integer</td></tr><tr><td></td><td><code>socketTimeout</code></td><td>Network connection timeout threshold in milliseconds. Default 5000.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# options
host: 192.168.1.120
port: 502
unitId: 1
```

#### Output

Returns `true` when a network connection is successfully established. Throws an error if the connection fails.

### `disconnectTcp`

Closes the active Modbus TCP socket connection.

#### Parameters

None.

#### Output

Returns `true` when the network socket closes successfully.

### `connectRtu`

Connects to a Modbus device over a serial interface.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>path</code></td><td>The local platform file path of the serial port (such as <code>/dev/ttyUSB0</code> on Linux or <code>COM3</code> on Windows).</td><td>string</td></tr><tr><td></td><td><code>baudRate</code></td><td>The sequential serial communication speed. Default 9600.</td><td>integer</td></tr><tr><td></td><td><code>dataBits</code></td><td>The count of data bits per character packet (5, 6, 7, or 8). Default 8.</td><td>integer</td></tr><tr><td></td><td><code>stopBits</code></td><td>The spacing bit count at the end of each packet (1, 1.5, or 2). Default 1.</td><td>number</td></tr><tr><td></td><td><code>parity</code></td><td>Error check tracking bit configuration (none, even, odd). Default 'none'.</td><td>string</td></tr><tr><td></td><td><code>unitId</code></td><td>The serial bus unit station address. Default 1.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# options
path: /dev/ttyUSB0
baudRate: 19200
parity: even
unitId: 10
```

#### Output

Returns `true` when the serial port opens successfully. Throws an error if the connection fails.

### `disconnectRtu`

Closes the active Modbus RTU serial port connection.

#### Parameters

None.

#### Output

Returns `true` when the serial port closes successfully.

### `delete`

Removes the instance and frees its associated network or serial resources.

{% hint style="danger" %}
#### Irreversible action

Deleting an instance removes its configuration. To communicate with the device again, you must trigger `create` anew.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` upon removal.

## Reading and writing

### `read`

Reads data from coils or registers on the connected Modbus device. The function automatically handles the underlying Modbus function code framing and parses raw buffers into primitives based on your configuration.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>fc</code></td><td>The Modbus function code used to request data (1: Read Coils, 2: Read Discrete Inputs, 3: Read Holding Registers, 4: Read Input Registers).</td><td>integer</td></tr><tr><td></td><td><code>address</code></td><td>The zero-based starting register or element offset address.</td><td>integer</td></tr><tr><td></td><td><code>length</code></td><td>The total number of sequential elements or 16-bit registers to read.</td><td>integer</td></tr><tr><td></td><td><code>dataType</code></td><td>The target binary parser type used to interpret the raw incoming buffer elements (raw, string, boolean, doubleBE, doubleLE, floatBE, floatLE, int16BE, int16LE, int32BE, int32LE, uint16BE, uint16LE, uint32BE, uint32LE). Default 'raw'.</td><td>string</td></tr></tbody></table>

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

Example 3: Read a 32-bit big-endian floating point variable

Because 32-bit values span two discrete 16-bit Modbus memory registers, set the length parameter to 2.

```yaml
# options
fc: 4
address: 30010
length: 2
dataType: floatBE
```

#### Output

Returns the requested values fetched from the target hardware registers, parsed into the specified data type representation. Throws an error if the operation fails.

### `write`

Writes data payloads directly to target coil or register elements on the connected Modbus hardware.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>data</code></td><td></td><td>The single literal value, array of values, or raw binary Buffer payload to write to the destination device registers.</td><td>any</td></tr><tr><td><code>addressInfo</code></td><td><code>fc</code></td><td>The Modbus transaction function code (5: Write Single Coil, 6: Write Single Register, 15: Write Multiple Coils, 16: Write Multiple Registers).</td><td>integer</td></tr><tr><td></td><td><code>address</code></td><td>The zero-based starting offset address for the target elements.</td><td>integer</td></tr></tbody></table>

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

#### Output

Returns an object containing the response summary block returned by the underlying client layer. Throws an error if the write fails.

## String helper functions

### `readString`

Reads register values sequentially from a specified holding register starting address and extracts them as a decoded text string.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>startAddress</code></td><td>The zero-based register starting offset address.</td><td>integer</td></tr><tr><td><code>length</code></td><td>The total number of consecutive 16-bit registers containing the string character sequence.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# startAddress
40100
# length
10
```

#### Output

Returns the text string parsed from the targeted registers, with all empty trailing null padding characters removed automatically.

### `writeString`

Encodes an alphanumeric text string into binary format and writes the resulting character blocks across consecutive holding registers.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>text</code></td><td>The text string to transmit to the target device.</td><td>string</td></tr><tr><td><code>startAddress</code></td><td>The zero-based register destination starting offset address.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# text
New Product ID
# startAddress
40100
```

#### Output

Returns the response structure returned by the internal Modbus communication engine. Throws an error if the operation fails.

## Tips and tricks

### Modbus TCP port mapping

While the official Modbus TCP standard mandates network communication over port 502, several virtual test rigs or secure industrial gateway firewalls route traffic along port 1502. The connector automatically binds to port 1502 by default. If your physical controller expects standard port constraints, explicitly override the port assignment inside your configuration options block during connection initialization.

### Text string encoding padding

Modbus memory maps allocate a full 16-bit word space per register, whereas conventional text strings occupy single 8-bit bytes per character. When executing `writeString`, the string processor handles this allocation automatically. If your text payload compiles to an uneven byte length count, the helper joins a trailing null termination byte (`0x00`) to fill the final register block correctly.
