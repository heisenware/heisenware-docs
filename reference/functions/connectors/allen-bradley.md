# Allen-Bradley

The Allen-Bradley connector communicates with Allen-Bradley programmable logic controllers (PLCs) using the EtherNet/IP protocol. Once connected, you read and write tags by name, individually or in groups, or subscribe to them to receive their values as they change.

This connector requires [instance creation](README.md#instance-creation) before you can interact with a PLC.

## Tags and user-defined types

A tag is a PLC variable that represents a named piece of memory with a specific data type, such as `DINT` for a 32-bit integer, `REAL` for a floating-point number, or `BOOL` for a boolean. A user-defined type (UDT) is a structured tag that groups related values into a single unit, similar to an object. For example, a `Recipe` UDT can contain the members `BatchSize` and `TempSetPoint`, which you address as `Recipe.BatchSize` and `Recipe.TempSetPoint`.

The connector does not browse the PLC's tag list. You address a tag by its name, and the PLC answers its data type with the first read:

| Tag | Name |
| --- | --- |
| Controller scope | `MotorSpeed` |
| Program scope | `Program:MainProgram.MotorSpeed` |
| Array element | `Values[3]` |
| UDT member | `Recipe.TempSetPoint` |

{% hint style="info" %}
The connector reads and writes the atomic data types `BOOL`, `SINT`, `INT`, `DINT` and `REAL`. A tag of another type, such as a `STRING` or a whole UDT, fails with an error: read a UDT member by member.
{% endhint %}

## Connection management

### `create`

Creates a controller instance that represents the connection to a specific PLC. All other functions require this instance. Creating it does not connect yet: call `connect`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>ipAddress</code></td><td></td><td>The IP address of the target PLC on the network.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>slot</code></td><td>Optional. The slot number of the CPU in the PLC chassis. Default 0.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# ipAddress
192.168.1.10
# options
slot: 2
```

#### Output

Returns the name of the created instance.

### `connect`

Opens a session with the PLC at the instance's IP address and slot. See [Connection recovery](allen-bradley.md#connection-recovery) for the behavior after an unexpected session loss.

#### Parameters

None.

#### Output

Returns `true` once the session is open, also when the instance is connected already. Throws an error if the PLC cannot be reached or refuses the session.

### `isConnected`

Checks the current connection status.

#### Parameters

None.

#### Output

Returns `true` if connected, or `false` if disconnected.

### `disconnect`

Ends the session with the PLC and clears all subscriptions.

#### Parameters

None.

#### Output

Returns `true` once disconnected, including when no active connection exists.

### `delete`

Removes the instance. Its session and subscriptions end with it.

{% hint style="danger" %}
#### Irreversible action

Deleting an instance removes its configuration. To interact with the PLC again, you must trigger `create` and `connect` anew.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` upon removal.

## Reading and writing

### `readTag`

Reads the current value of a single tag. This function requires an active connection.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>tagName</code></td><td>The exact name of the tag to read, such as <code>MotorSpeed</code> or <code>Program:MainProgram.MyData.Status</code>.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# tagName
MyTemperature
```

#### Output

Returns the raw value of the tag matching its PLC data type (such as 72.5 for a `REAL` tag). Throws an error if the name is not a valid tag name, or if the read fails. A tag the PLC does not have fails with the PLC's CIP status, for example `Failed to read tag "MyTemperature": CIP status 0x05`.

### `readTagGroup`

Reads multiple tags in a single, optimized network request. This is more efficient than calling `readTag` repeatedly.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>tagNames</code></td><td>An array of tag names to read.</td><td>array</td></tr></tbody></table>

#### Example

```yaml
# tagNames
[MotorSpeed, Machine_Status, MyTemperature]
```

#### Output

Returns an object where each key is a tag name and each value is its current value. Returns an empty object for an empty list. Throws an error if the read fails:

```json
{
  "MotorSpeed": 1750,
  "Machine_Status": 3,
  "MyTemperature": 72.5
}
```

### `writeTag`

Writes a new value to a tag. The function handles both simple tags (numbers, booleans) and UDTs. For a UDT, provide an object where keys map to the member names: the connector writes each member as its own tag (`Recipe.TempSetPoint`), all in one request. Members can nest.

A write carries the tag's data type. The connector reads a tag first when it does not know the type yet.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>tagName</code></td><td>The name of the tag to target.</td><td>string</td></tr><tr><td><code>value</code></td><td>The value to write. Provide a primitive for simple tags or an object for UDTs.</td><td>any</td></tr></tbody></table>

#### Examples

Example 1: Simple tag

```yaml
# tagName
MotorSpeedSP
# value
150
```

Example 2: UDT

```yaml
# tagName
Recipe
# value
BatchSize: 1200
TempSetPoint: 95.5
```

#### Output

Returns `true` on a successful write. Throws an error if the name is not a valid tag name or the write fails.

### `writeTagGroup`

Writes values to multiple tags in a single, optimized network request. A value can be an object for a UDT, as in `writeTag`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>tags</code></td><td>An object where each key is a tag name and each value is the value to write.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# tags
MotorSpeedSP: 1800
Valve_1_Open: true
BatchSize: 1200
```

#### Output

Returns `true` when all writes complete, also for an empty object. Throws an error if the operation fails.

### `getDiscoveredTags`

Returns the tags this instance knows: every tag it has read, written or subscribed to. The PLC's own tag list is not browsed. Use this for debugging.

#### Parameters

None.

#### Output

Returns an array of tag objects, sorted by name. `type` is the data type the PLC answered, or `null` before the tag's first read:

```json
[
  { "name": "MotorSpeed", "type": "DINT" },
  { "name": "MyTemperature", "type": "REAL" },
  { "name": "Recipe.TempSetPoint", "type": null }
]
```

## Subscriptions

### `subscribe`

Subscribes to one or more tags. The connector scans the PLC for all subscribed tags at a fixed rate and reports a tag's first value, then every change. Use `onData` to receive the updates. The connector skips tags that are already subscribed and logs a warning.

All subscribed tags share one scan: the rate given last applies to every tag.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>tagNames</code></td><td>A single tag name or an array of tag names to subscribe to.</td><td>string or array</td></tr><tr><td><code>rate</code></td><td>Optional. How often the connector scans the PLC, in milliseconds. Default 500.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# tagNames
[Machine_Status, Production_Count, Pressure_Sensor_1]
# rate
250
```

#### Output

Returns nothing. Data arrives through `onData`. Throws an error if the PLC is not connected or a name is not a valid tag name.

### `onData`

Listens for the values of subscribed tags. This is an event function: trigger it once, for example when the App starts, and it delivers every update on its event output. You must subscribe to at least one tag to receive data.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The handler. The platform fills it in: each update arrives on the executor's event output.</td><td>event</td></tr></tbody></table>

#### Output

Returns `true` once the executor is listening. The values arrive on the event outputs.

```json
{
  "tagName": "Machine_Status",
  "value": 3
}
```

### `onError`

Listens for subscription errors. The event fires when a scan of the subscribed tags fails, for example because a subscribed tag does not exist. The scan resumes after one scan period while the session lasts.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The handler. The platform fills it in: each error arrives on the executor's event output.</td><td>event</td></tr></tbody></table>

#### Output

Returns `true` once the executor is listening. The values arrive on the event outputs.

## Tips and tricks

### Choosing between polling, subscribing, and group operations

Use `readTag` and `writeTag` for on-demand, request-response interactions. Use `subscribe` alongside `onData` for live monitoring: the connector scans the tags and reports only changes. When handling multiple tags simultaneously, use `readTagGroup` and `writeTagGroup` to bundle requests into a single network packet and reduce network traffic.

### Connection recovery

If the PLC session closes unexpectedly, the connector clears all active subscriptions and logs a warning. It does not reconnect by itself: `isConnected` returns `false`, and reads and writes fail with `PLC is not connected`. Call `connect` again, then `subscribe` again. Executors listening with `onData` and `onError` keep listening.
