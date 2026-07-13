# Allen-Bradley

The Allen-Bradley connector communicates with Allen-Bradley programmable logic controllers (PLCs) using the EtherNet/IP protocol. After connecting, it automatically discovers all tags at the controller and program scope. You can then read and write tags individually or in groups, and subscribe to them for real-time updates.

There are no static functions in this class. Create an instance first to interact with a PLC.

## Tags and UDTs

A tag is a PLC variable: a named piece of memory with a specific data type (e.g. `DINT` for a 32-bit integer, `REAL` for a floating-point number, `BOOL` for a boolean). A UDT (User-Defined Type) is a structured tag that groups related values into one unit, similar to an object. A `Recipe` UDT could contain the members `Name` and `TempSetPoint`, addressed as `Recipe.Name` and `Recipe.TempSetPoint`.

The connector discovers all tags and their types during `connect`, so you address every tag simply by its name.

## Instance and connection

### `create`

Creates a controller instance that represents the connection to one specific PLC. All other functions require this instance.

#### Parameters

<table><thead><tr><th width="130">Input</th><th width="110">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>ipAddress</code></td><td></td><td>The IP address of the target PLC on the network. Required.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>slot</code></td><td>The slot number of the CPU in the PLC chassis. Default <code>0</code>.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# ipAddress
192.168.1.10
# options
slot: 2
```

### `connect`

Connects to the PLC and discovers all controller-scoped and program-scoped tags, making them available for reading, writing, and subscribing.

#### Parameters

None.

#### Output

Returns `true` on a successful connection. Throws an error if the connection or tag discovery fails.

### `disconnect`

Disconnects from the PLC and clears all subscriptions and cached tag information. Call this when you are finished interacting with the PLC.

#### Parameters

None.

#### Output

Returns `true` on a successful disconnection (also if no connection existed).

### `isConnected`

Checks the current connection status.

#### Parameters

None.

#### Output

Returns `true` if connected, otherwise `false`.

### `delete`

Removes the instance and its connection.

{% hint style="danger" %}
Deleting an instance removes its configuration. To interact with the PLC again, trigger `create` and `connect` anew.
{% endhint %}

## Reading and writing

### `readTag`

Reads the current value of a single tag. Requires an established connection, and the tag must exist in the discovered tag list.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>tagName</code></td><td>The exact name of the tag to read (e.g. <code>MotorSpeed</code> or <code>Program:MainProgram.MyData.Status</code>).</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# tagName
MyTemperature
```

#### Output

The raw value of the tag, matching its data type in the PLC (e.g. `72.5` for a `REAL` tag). Throws an error if the tag does not exist or the read fails.

### `readTagGroup`

Reads multiple tags in a single, optimized request. More efficient than calling `readTag` repeatedly. Tags that are not found in the discovered tag list are skipped with a warning in the logs.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>tagNames</code></td><td>An array of tag names to read.</td><td>array</td></tr></tbody></table>

#### Example

```yaml
# tagNames
[MotorSpeed, Machine_Status, MyTemperature]
```

#### Output

An object where each key is a tag name and each value is its current value:

```json
{
  "MotorSpeed": 1750,
  "Machine_Status": 3,
  "MyTemperature": 72.5
}
```

### `writeTag`

Writes a new value to a tag. The function handles both simple tags (number, boolean, string) and UDTs: for a UDT, provide an object whose keys are the member names. Each member must exist as a discovered tag (e.g. `Recipe.Name`). A type mismatch (an object for a simple tag, or a primitive for a UDT) throws an error.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>tagName</code></td><td>The name of the tag to write to.</td><td>string</td></tr><tr><td><code>value</code></td><td>The value to write. A primitive for simple tags, an object for UDTs.</td><td>any</td></tr></tbody></table>

#### Examples

Example 1: Writing to a simple tag

```yaml
# tagName
MotorSpeedSP
# value
150
```

Example 2: Writing to a UDT

This writes two members of a structured tag named `Recipe` in one operation.

```yaml
# tagName
Recipe
# value
Name: "Batch 2A"
TempSetPoint: 95.5
```

#### Output

Returns `true` on a successful write. Throws an error on unknown tags, type mismatches, or failed writes.

### `writeTagGroup`

Writes values to multiple tags in a single, optimized network request. Tags that are not found in the discovered tag list are skipped with a warning in the logs.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>tags</code></td><td>An object where each key is a tag name and each value is the value to write to that tag.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# tags
MotorSpeedSP: 1800
Valve_1_Open: true
RecipeName: "Batch 3C"
```

#### Output

Returns `true` when all writes have completed.

### `getDiscoveredTags`

Returns the list of all tags discovered during `connect`. Useful for debugging or exploring a PLC dynamically.

#### Parameters

None.

#### Output

An array of tag objects with detailed information about each tag:

```json
[
  {
    "id": 1234,
    "name": "MotorSpeed",
    "type": { "code": 195, "sint": null, "string": "DINT" },
    "structure": false
  },
  {
    "id": 5678,
    "name": "Recipe",
    "type": { "code": 160, "sint": 4321, "string": "MyRecipeUDT" },
    "structure": true
  }
]
```

## Subscriptions

### `subscribe`

Subscribes to one or more tags for real-time updates. When a tag's value changes on the PLC, the new value is pushed to your application automatically, which is far more efficient than polling. Register a listener with `onData` to handle the incoming data.

Tags that are already subscribed or not found in the discovered tag list are skipped with a warning in the logs.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="130">Type</th></tr></thead><tbody><tr><td><code>tagNames</code></td><td>A single tag name or an array of tag names to subscribe to.</td><td>string or array</td></tr><tr><td><code>rate</code></td><td>How often (in milliseconds) the PLC sends updates. Default <code>500</code>.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# tagNames
[Machine_Status, Production_Count, Pressure_Sensor_1]
# rate
250
```

#### Output

None. Data arrives through the listener registered with `onData`. Throws an error if the PLC is not connected.

### `onData`

Registers a callback that fires whenever new data arrives from a subscribed tag. Subscribe to at least one tag for this to have any effect.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>Callback that receives an object containing the <code>tagName</code> and its new <code>value</code>.</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed` to confirm the listener is registered.

### `onError`

Registers a callback that fires when a subscription error occurs (e.g. the PLC connection is lost).

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>Callback that receives the error.</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed` to confirm the listener is registered.

## Tips and tricks

### Choosing between polling, subscribing, and group operations

Use `readTag` and `writeTag` for on-demand, request-response interactions. Use `subscribe` with `onData` for real-time monitoring and dashboards, since the PLC pushes changes instead of being polled. Use `readTagGroup` and `writeTagGroup` when handling many tags at once: they bundle multiple requests into a single network packet, which significantly reduces network traffic.

### Lost connections

If the PLC session closes unexpectedly, the connector clears all discovered tags and active subscriptions and logs a warning. Trigger `connect` again to re-establish the connection and re-discover the tags, then re-create your subscriptions.
