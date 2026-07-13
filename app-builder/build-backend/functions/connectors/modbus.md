# Modbus

The Modbus connector provides a unified interface for communicating with Modbus devices. It handles low-level data framing and supports the two primary industrial communication protocols:

* Modbus TCP: For devices connected over an Ethernet network.
* Modbus RTU: For devices connected over serial lines (such as RS-485 or RS-232).

{% hint style="info" %}
#### Connection workflow

To communicate with a device, you must first create a connector instance in the platform. In your application logic, always trigger `connectTcp` or `connectRtu` to establish an active session before executing any read or write functions.
{% endhint %}
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

Example 3: Read a 32-bit big-endian floating point variable

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
