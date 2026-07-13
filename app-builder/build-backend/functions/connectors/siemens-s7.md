# Siemens S7

The Siemens S7 connector communicates directly with Siemens S7 programmable logic controllers (PLCs). It acts as an integration layer to read and write PLC memory areas using raw memory addresses or human-readable variable aliases. 

You must create an instance of the `S7` class to preserve connection states and manage targeted variable polling configurations.

## TIA Portal configuration

To establish a connection, gather the IP address, rack number, and slot number from your TIA Portal project configuration.

### IP address

Select the PLC in your project tree panel. Open the properties tab below and navigate to **PROFINET interface > Ethernet addresses** to identify the configured network IP address.

### Rack and slot

Modern S7-1200 and S7-1500 controllers typically reside on rack 0 and slot 1. For classic S7-300 and S7-400 hardware, click **Device configuration** to verify your CPU's hardware position. The processor is usually positioned on rack 0, slot 2.

### Enable PUT and GET communication

The controller requires explicit access configuration to permit remote partner communication:

1. Right-click the controller block and select **Properties**.
2. Navigate to **Protection & Security > Connection mechanisms**.
3. Enable the checkbox for **Permit access with PUT/GET communication from remote partner**.
4. Compile and download the updated hardware configuration to the physical PLC.

## Connection management

### `connect`

Establishes a connection channel to the target PLC using the hardware addresses gathered from TIA Portal.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>host</code></td><td>The network IP address or hostname of the PLC. Required.</td><td>string</td></tr><tr><td></td><td><code>port</code></td><td>The communication port of the target PLC interface. Default 102.</td><td>integer</td></tr><tr><td></td><td><code>rack</code></td><td>The physical hardware rack position. Default 0.</td><td>integer</td></tr><tr><td></td><td><code>slot</code></td><td>The slot position number of the CPU module. Default 1.</td><td>integer</td></tr><tr><td></td><td><code>timeout</code></td><td>Connection threshold execution limit in milliseconds. Default 5000.</td><td>integer</td></tr></tbody></table>

#### Output

Returns `true` when a connection channel is successfully established, or throws a runtime connection error on failure.

#### Example

```yaml
# options
host: 192.168.0.1
port: 102
rack: 0
slot: 1
```

### `disconnect`

Terminates the active TCP connection session with the PLC.

#### Parameters

None.

#### Output

Returns `true` upon successful disconnection tracking cleanup.

### `getStatus`

Queries the active connection state running on the instance.

#### Parameters

None.

#### Output

Returns a string detailing the current connectivity state: `'disconnected'`, `'connecting'`, or `'connected'`.

## Variable addressing and dictionary

### `setAddressDictionary`

Configures the connector instance with an alias lookup directory. This layer lets you map simple names to raw PLC addresses for use across all subsequent polling or data transactions.

{% hint style="danger" %}
#### Polling configuration reset
Registering a new address directory completely flushes out all items currently added to your read monitoring queues. Always establish your dictionary map sequence before building active tracking tables.
{% endhint %}

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>dictionary</code></td><td>An object structure where keys represent human-readable aliases and values define raw PLC memory strings. Default {}.</td><td>object</td></tr></tbody></table>

#### Output

Returns `true` on a successful layout registration.

#### Example

```yaml
# dictionary
MOTOR_SPEED: 'DB1,REAL4'
E_STOP_PRESSED: 'I0.0'
CONVEYOR_RUNNING: 'Q4.1'
PROCESS_STEP_COMPLETE: 'M10.5'
```

### `showAddressDictionary`

Retrieves an isolated configuration copy of the active address alias directory.

#### Parameters

None.

#### Output

Returns an object structure detailing the currently registered lookup elements.

## Polling list configuration

### `addItems`

Registers specific variable addresses or directory aliases inside the continuous background read polling engine.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>items</code></td><td>A standalone variable string, alias indicator, or an array list of strings to add to the active tracking scope. Required.</td><td>array or string</td></tr></tbody></table>

#### Output

Returns `true` upon successful registration.

#### Examples

Example 1: Register raw memory addresses

```yaml
# items
- 'DB1,X0.0'
- 'MW10'
```

Example 2: Register mixed aliases and raw addresses

```yaml
# items
- MOTOR_SPEED
- 'DB5,X1.5'
```

### `removeItems`

Strips specific variable entries from the internal read polling loop engine. You must provide the exact address string or alias label used to configure the entry.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>items</code></td><td>A variable string, alias key identifier, or an array list of strings to strip from the polling monitor. If left undefined, the function removes all variables.</td><td>array or string</td></tr></tbody></table>

#### Output

Returns `true` on successful execution.

#### Example

```yaml
# items
- E_STOP_PRESSED
```

### `removeAllItems`

Completely flushes out all registered variables from the active background tracking queue.

#### Parameters

None.

#### Output

Returns `true` when the polling parameters clear successfully.

### `showAllItems`

Queries the full collection of address variables currently tracked by the background tracking loop.

#### Parameters

None.

#### Output

An array list of all raw memory paths or dictionary alias keys currently assigned to the active polling queue.

## Data operations

### `readAllItems`

Issues a bulk request to read the current hardware data value of every variable registered inside the active tracking list.

#### Parameters

None.

#### Output

Returns an object containing updated key-value data snapshots where the keys map directly to the item designations defined in the polling configuration block:

```json
{
  "MOTOR_SPEED": 1499.98,
  "DB10,X20.4": true
}
```

### `writeItems`

Writes data updates to one or more memory variables on the PLC.

{% hint style="warning" %}
#### Serialization constraint
The communication layer executes a single write instruction pipeline path at any given point in time. Attempting to pass concurrent writes while an evaluation transaction is in-flight results in a structural write rejection error.
{% endhint %}

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>items</code></td><td>A single target variable address, alias label string, or a matched array list of strings to update. Required.</td><td>array or string</td></tr><tr><td><code>values</code></td><td>The literal value or corresponding array list of values to transfer to the PLC memory map. Ensure the property length and position align perfectly with the inputs array. Required.</td><td>array or any</td></tr></tbody></table>

#### Output

Returns a promise that resolves to `true` when hardware data updates commit successfully.

#### Examples

Example 1: Update a single bit status flag

```yaml
# items
CONVEYOR_RUNNING
# values
true
```

Example 2: Batch write multiple mixed primitive variables

```yaml
# items
- MOTOR_SPEED
- 'DB1,X0.7'
# values
- 1500
- true
```

## Deprecated functions

The following functions are maintained for backward compatibility with older configurations. Update your application logic loops to use the newer direct replacement paths.

| Deprecated function | Use instead |
| :--- | :--- |
| `initiateConnection` | `connect` |
| `dropConnection` | `disconnect` |

## Tips and tricks

### Memory address reference syntax
Memory maps parse data strings using standard industrial notations formatted as `AREA,TYPE<BYTE_OFFSET>[.BIT_OR_LENGTH]`.

#### Memory areas
* **`DB<number>`** (Data Block) — Main shared memory registers used to handle data logic, custom recipes, and process variables (such as `DB1,REAL4`).
* **`I`** (Inputs) — Read-only state registers tracking physical digital and analog input blocks.
* **`Q`** (Outputs) — Control registers driving physical state relays, actuators, or indicators.
* **`M`** (Merkers/Internal Memory) — Internal processor flags and global operational staging variables.

#### Explicit data layouts
* **Boolean** (`X`) — Single-bit data fields (such as `DB1,X0.0`).
* **Byte** (`B`) — 8-bit whole values tracking raw integer scales from 0 to 255.
* **Char Array** (`C`) — Extracts raw, unformatted alphanumeric sequences (such as `DB1,C20.10` for 10 sequential text fields).
* **String** (`S`) — Parses formatted data lines containing standard Siemens S7 string headers.
* **Integer** (`INT`) — 16-bit signed whole values.
* **Word** (`WORD`) — 16-bit unsigned, purely positive data fields.
* **Double Int** (`DINT`) — 32-bit signed whole value parameters.
* **DWord** (`DWORD`) — 32-bit unsigned data fields.
* **Real** (`REAL`) — 32-bit floating-point decimal parameters (such as `DB1,REAL14`).

### Handling runtime string misalignments
If textual characters returned by the `S` string type layout appear scrambled or contain misplaced characters, verify whether the PLC handles raw array elements rather than a standard S7 string definition layout. Standard S7 strings include distinct header properties defining capacity bounds. If your layout skips these fields, pass the `C` (Char Array) data specification block to read text patterns accurately (such as `DB1,C0.16`).

### Evaluating hardware `TIME` values
Siemens S7 processors maintain `TIME` metrics formatted as unique double-word structures tracking elapsed durations in milliseconds. To read or manipulate these values correctly without causing format execution errors, declare the data type tag as a standard `DINT` signed 32-bit parameter.

## Delete instance

### `delete`

Removes the S7 client instance from the runtime configuration engine and purges all active item polling tracking queues.

{% hint style="danger" %}
Deleting an instance removes its configuration. To communicate with the PLC again, trigger `create` anew.
{% endhint %}

#### Parameters

None.

#### Output

Nothing.
```
