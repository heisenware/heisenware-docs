# Siemens S7

The Siemens S7 connector (`S7`) communicates directly with Siemens S7 programmable logic controllers (PLCs). It lets you read and write PLC memory areas using raw memory addresses or human-readable variable aliases. 

This connector requires [instance creation](./#instance-creation) before you can manage connection states and configure variable polling.

## TIA Portal configuration

Before connecting, retrieve the IP address, rack number, and slot number from your TIA Portal project configuration.

### IP address

Select the PLC in the TIA Portal project tree. Open the Properties tab below and navigate to **PROFINET interface > Ethernet addresses** to identify the configured IP address.

### Rack and slot

S7-1200 and S7-1500 controllers typically use rack 0 and slot 1. For classic S7-300 and S7-400 hardware, open **Device configuration** to verify the CPU position. The processor is usually on rack 0, slot 2.

### Enable PUT and GET communication

Configure the controller to permit PUT and GET communication:

1. Right-click the controller and select **Properties**.
2. Navigate to **Protection & Security > Connection mechanisms**.
3. Select **Permit access with PUT/GET communication from remote partner**.
4. Compile and download the updated hardware configuration to the PLC.

## Connection management

{% hint style="info" %}
Typically you first install the Siemens S7 connector within an [Agent](../../agents/). That way you can connect your cloud platform to your on-premises shopfloor PLCs.
{% endhint %}

### `create`

Creates an S7 client instance. The connection details follow in `connect`.

#### Parameters

None.

#### Output

Returns the name of the created instance.

### `connect`

Establishes a connection to the target PLC.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>host</code></td><td>The IP address or hostname of the PLC.</td><td>string</td></tr><tr><td></td><td><code>port</code></td><td>The communication port of the PLC. Default 102.</td><td>integer</td></tr><tr><td></td><td><code>rack</code></td><td>The physical rack position of the CPU. Default 0.</td><td>integer</td></tr><tr><td></td><td><code>slot</code></td><td>The slot position of the CPU. Default 1.</td><td>integer</td></tr><tr><td></td><td><code>timeout</code></td><td>The connection timeout in milliseconds. Default 5000.</td><td>integer</td></tr></tbody></table>

#### Output

Returns `true` when the connection succeeds. Throws an error on failure.

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

Returns `true` on successful disconnection, including when no connection exists.

### `getStatus`

Queries the current connection state of the instance.

#### Parameters

None.

#### Output

Returns `'disconnected'`, `'connecting'`, or `'connected'`.

### `delete`

Removes the instance and its configuration.

{% hint style="danger" %}
#### Irreversible action

Deleting an instance removes its configuration. To communicate with the PLC again, you must create a new instance.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` upon removal.

## Variable addressing and dictionary

The address dictionary is an optional convenience layer. Functions like `addItems` and `writeItems` accept aliases, raw PLC addresses, or a mix of both: the connector first checks whether a string is an alias in the dictionary and otherwise treats it as a direct address. See [Memory address syntax](siemens-s7.md#memory-address-syntax) for the address format.

### `setAddressDictionary`

Configures the connector instance with an address dictionary. This lets you map human-readable aliases to raw PLC addresses for use in subsequent polling or data transactions.

{% hint style="danger" %}
#### Polling configuration reset

Registering a new address dictionary flushes all items from the read monitoring queue. Establish the dictionary before adding items to the polling queue.
{% endhint %}

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>dictionary</code></td><td>An object mapping human-readable aliases to raw PLC addresses. Default {}.</td><td>object</td></tr></tbody></table>

#### Output

Returns `true` on successful registration.

#### Example

```yaml
# dictionary
MOTOR_SPEED: 'DB1,REAL4'
E_STOP_PRESSED: 'I0.0'
CONVEYOR_RUNNING: 'Q4.1'
PROCESS_STEP_COMPLETE: 'M10.5'
```

### `showAddressDictionary`

Retrieves the active address dictionary.

#### Parameters

None.

#### Output

Returns an object containing the registered address aliases.

## Polling list configuration

### `addItems`

Registers variable addresses or dictionary aliases in the background read polling loop.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>items</code></td><td>A variable address, alias, or array of strings to add to the polling queue.</td><td>array or string</td></tr></tbody></table>

#### Output

Returns `true` on success.

#### Examples

**Example 1: Register raw memory addresses**

```yaml
# items
- 'DB1,X0.0'
- 'MW10'
```

**Example 2: Register mixed aliases and raw addresses**

```yaml
# items
- MOTOR_SPEED
- 'DB5,X1.5'
```

### `removeItems`

Removes specific variables from the background polling loop.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>items</code></td><td>A variable address, alias, or array of strings to remove from the polling queue. If omitted, removes all variables.</td><td>array or string</td></tr></tbody></table>

#### Output

Returns `true` on success.

#### Example

```yaml
# items
- E_STOP_PRESSED
```

### `removeAllItems`

Removes all registered variables from the active background polling queue.

#### Parameters

None.

#### Output

Returns `true` on success.

### `showAllItems`

Lists all variables currently in the background polling queue.

#### Parameters

None.

#### Output

Returns an array of all raw memory paths or dictionary aliases in the polling queue.

## Data operations

### `readAllItems`

Reads the current values of all variables in the polling queue.

#### Parameters

None.

#### Output

Returns an object containing the current values of all registered variables. Keys map to the variable names or aliases. Throws an error if reading fails.

```json
{
  "MOTOR_SPEED": 1499.98,
  "DB10,X20.4": true
}
```

### `writeItems`

Writes data updates to one or more variables on the PLC.

{% hint style="warning" %}
#### Concurrent write constraint

The connector executes one write operation at a time. Sending concurrent writes while a write is in progress causes a write rejection error.
{% endhint %}

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>items</code></td><td>A variable address, alias, or array of strings to update.</td><td>array or string</td></tr><tr><td><code>values</code></td><td>The value or array of values to write. Ensure the array length and order match the <code>items</code> parameter.</td><td>array or any</td></tr></tbody></table>

#### Output

Returns `true` when the write succeeds. Throws an error on failure.

#### Examples

**Example 1: Write a single variable**

```yaml
# items
CONVEYOR_RUNNING
# values
true
```

**Example 2: Write multiple variables**

```yaml
# items
- MOTOR_SPEED
- 'DB1,X0.7'
# values
- 1500
- true
```

## Deprecated functions

The following functions are maintained for backward compatibility. Update your App logic to use the recommended replacements.

| Deprecated function | Use instead |
| :--- | :--- |
| `initiateConnection` | `connect` |
| `dropConnection` | `disconnect` |

## Tips and tricks

### Memory address syntax

Format memory address strings as `AREA,TYPE<BYTE_OFFSET>[.BIT_OR_LENGTH]`.

#### Memory areas
* `DB<number>` (Data Block) – Shared memory registers for logic, recipes, and process variables (such as `DB1,REAL4`).
* `I` (Inputs) – Read-only registers tracking physical digital and analog inputs.
* `Q` (Outputs) – Control registers driving physical outputs.
* `M` (Merkers/Internal Memory) – Internal processor flags and global staging variables.

#### Data layouts
* Boolean (`X`) – Single-bit fields (such as `DB1,X0.0`).
* Byte (`B`) – 8-bit integer values from 0 to 255.
* Char Array (`C`) – Alphanumeric sequences (such as `DB1,C20.10` for 10 sequential characters).
* String (`S`) – Siemens S7 strings with standard length headers.
* Integer (`INT`) – 16-bit signed integers.
* Word (`WORD`) – 16-bit unsigned integers.
* Double Int (`DINT`) – 32-bit signed integers.
* DWord (`DWORD`) – 32-bit unsigned integers.
* Real (`REAL`) – 32-bit floating-point decimals (such as `DB1,REAL14`).

### Error "Object does not exist"

This error means you are reading or writing a Data Block (`DB`) that either does not exist or is too small in the PLC. Ensure the DB number is correct and that its size in TIA Portal is large enough to hold all your variables.

### Handling scrambled strings

If characters returned by the `S` string type appear scrambled or out of order, the PLC might store a raw character array instead of a standard S7 string. S7 strings contain a header that defines capacity. If the PLC stores raw characters without a header, use the `C` (Char Array) type to read the text (such as `DB1,C0.16`).

### Reading TIME values

S7 processors store `TIME` values as signed 32-bit integers tracking milliseconds. To read or write these values, use the `DINT` data type.
