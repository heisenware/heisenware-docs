# Modbus

The `Modbus` class provides a unified interface for communicating with Modbus devices. It supports the two most common communication methods:

* Modbus TCP: For devices connected over an Ethernet network.
* Modbus RTU: For devices connected over a serial line (e.g., RS-485 or RS-232).

You must create an instance of this class and then call one of the `connect...` methods to establish a session before performing any read or write operations.

## Connection Management

You must use one of the following methods to connect to your device.

### connectTcp

Establishes a Modbus TCP connection to a device over a network.

Parameters

* `options`: An object containing the network details.
  * `host`: The hostname or IP address of the Modbus device.
  * `port`: The TCP port of the device. Defaults to `502` or `1502` typically.
  * `unitId`: The Unit ID of the target device. Defaults to `1`.
  * `socketTimeout`: Connection timeout in milliseconds. Defaults to `5000`.

Example

```yaml
# options
host: 192.168.1.120
port: 502
unitId: 1
```

### disconnectTcp

Closes the active Modbus TCP connection.

### connectRtu

Establishes a Modbus RTU connection to a device over a serial port.

Parameters

* `options`: An object containing the serial port configuration.
  * `path`: The system path of the serial port (e.g., `COM3` on Windows, `/dev/ttyUSB0` on Linux).
  * `baudRate`: The communication speed. Must match the device setting. Defaults to `9600`.
  * `dataBits`: Can be `5`, `6`, `7`, or `8`. Defaults to `8`.
  * `stopBits`: Can be `1` or `2`. Defaults to `1`.
  * `parity`: Can be `none`, `even`, or `odd`. Defaults to `none`.
* `address`: The station address (from 1-247) of the device on the serial bus.

Example

```yaml
# options
path: /dev/ttyUSB0
baudRate: 19200
parity: even
# address
10
```

### disconnectRtu

Closes the active Modbus RTU serial port connection.

## Data Read/Write Operations

### read

A generic function to read data from the connected Modbus device. It supports standard read function codes and can interpret the resulting data into various types.

Parameters

* `options`: An object specifying what to read.
  * `fc`: The Function Code for the read operation.
    * `1`: Read Coils (single bits, read/write).
    * `2`: Read Discrete Inputs (single bits, read-only).
    * `3`: Read Holding Registers (16-bit words, read/write).
    * `4`: Read Input Registers (16-bit words, read-only).
  * `address`: The starting address of the data point (zero-based).
  * `length`: The number of items to read (for registers, this is the number of 16-bit words).
  * `dataType`: An optional string specifying how to interpret the raw buffer data. Supported types include `int16BE`, `uint32BE`, `floatBE`, `int16LE`, `floatLE`, etc. `BE` stands for Big-Endian, `LE` for Little-Endian.

Example 1: Read a single boolean coil status

```yaml
# options
fc: 1
address: 100
length: 1
dataType: boolean
```

Example 2: Read a single 16-bit signed integer

```yaml
# options
fc: 3
address: 40001
length: 1
dataType: int16BE
```

Example 3: Read a 32-bit floating point number

Note that a 32-bit value occupies two 16-bit registers, so length must be 2.

```yaml
# options
fc: 4
address: 30010
length: 2
dataType: floatBE
```

Output

The value read from the device, converted to the specified dataType.

### write

A generic function to write data to the connected Modbus device.

Parameters

* `data`: The data to write. This can be a single value, an array of values, or a Buffer.
* `addressInfo`: An object specifying where and how to write.
  * `fc`: The Function Code for the write operation.
    * `5`: Write Single Coil (writes `true` or `false`).
    * `6`: Write Single Register (writes one 16-bit word).
    * `15`: Write Multiple Coils.
    * `16`: Write Multiple Registers.
  * `address`: The starting address for the write operation.

Example 1: Write a single coil ON

```yaml
# data
true
# addressInfo
fc: 5
address: 100
```

Example 2: Write a single 16-bit integer value

```yaml
# data
1234
# addressInfo
fc: 6
address: 40001
```

Example 3: Write an array of two 16-bit values

```yaml
# data
[100, 200]
# addressInfo
fc: 16
address: 40050
```

## String Helper Functions

These functions simplify reading and writing text strings, which are stored across multiple registers.

### readString

A convenience function to read a text string from a sequence of holding registers.

Parameters

* `startAddress`: The starting register address of the string.
* `length`: The number of 16-bit registers the string occupies.

Example

```yaml
# startAddress
40100
# lengthy
10
```

Output

The text string read from the device.

### writeString

A convenience function to encode and write a text string to a sequence of holding registers.

Parameters

* `text`: The string to be written.
* `startAddress`: The starting register address.

Example

```yaml
# text
New Product ID
# startAddress
40100
```
