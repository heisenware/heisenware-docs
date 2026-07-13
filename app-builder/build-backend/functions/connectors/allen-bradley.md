# Allen-Bradley

The Allen-Bradley connector communicates with Allen-Bradley programmable logic controllers (PLCs) using the EtherNet/IP protocol. After establishing a connection, the connector automatically discovers all tags at both the controller and program scope. You can then read and write tags individually or in groups, or subscribe to them for real-time updates.

This connector requires [instance creation](/app-builder/build-backend/functions/connectors.md#instance-creation) before you can interact with a PLC.

## Tags and user-defined types

A tag is a PLC variable that represents a named piece of memory with a specific data type, such as `DINT` for a 32-bit integer, `REAL` for a floating-point number, or `BOOL` for a boolean. A user-defined type (UDT) is a structured tag that groups related values into a single unit, similar to an object. For example, a `Recipe` UDT can contain the members `Name` and `TempSetPoint`, which you address as `Recipe.Name` and `Recipe.TempSetPoint`.

The connector discovers all tags and their types when you call `connect`, letting you address every tag by its name.

## Connection management

### `create`

Creates a controller instance that represents the connection to a specific PLC. All other functions require this instance.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>ipAddress</code></td>
      <td></td>
      <td>The IP address of the target PLC on the network.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>slot</code></td>
      <td>The slot number of the CPU in the PLC chassis. Default 0.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# ipAddress
192.168.1.10
# options
slot: 2
```

#### Output

Returns the controller instance. Throws an error if configuration fails.

### `connect`

Connects to the PLC and discovers all controller-scoped and program-scoped tags to make them available for reading, writing, and subscribing.

#### Parameters

None.

#### Output

Returns `true` on a successful connection. Throws an error if the connection or tag discovery fails.

### `isConnected`

Checks the current connection status.

#### Parameters

None.

#### Output

Returns `true` if connected, or `false` if disconnected.

### `disconnect`

Disconnects from the PLC and clears all subscriptions and cached tag information.

#### Parameters

None.

#### Output

Returns `true` on a successful disconnection, including when no active connection exists.

### `delete`

Removes the instance and its connection.

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

Reads the current value of a single tag. This function requires an active connection, and the tag must exist in the discovered tag list.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>tagName</code></td>
      <td>The exact name of the tag to read, such as <code>MotorSpeed</code> or <code>Program:MainProgram.MyData.Status</code>.</td>
      <td>string</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# tagName
MyTemperature
```

#### Output

Returns the raw value of the tag matching its PLC data type (such as 72.5 for a `REAL` tag). Throws an error if the tag does not exist or the read fails.

### `readTagGroup`

Reads multiple tags in a single, optimized network request. This is more efficient than calling `readTag` repeatedly. The connector skips tags that do not exist in the discovered tag list and logs a warning.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>tagNames</code></td>
      <td>An array of tag names to read.</td>
      <td>array</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# tagNames
[MotorSpeed, Machine_Status, MyTemperature]
```

#### Output

Returns an object where each key is a tag name and each value is its current value:

```json
{
  "MotorSpeed": 1750,
  "Machine_Status": 3,
  "MyTemperature": 72.5
}
```

### `writeTag`

Writes a new value to a tag. The function handles both simple tags (numbers, booleans, strings) and UDTs. For a UDT, provide an object where keys map to the member names. Each member must exist as a discovered tag. A type mismatch throws an error.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>tagName</code></td>
      <td>The name of the tag to target.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>value</code></td>
      <td>The value to write. Provide a primitive for simple tags or an object for UDTs.</td>
      <td>any</td>
    </tr>
  </tbody>
</table>

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
Name: "Batch 2A"
TempSetPoint: 95.5
```

#### Output

Returns `true` on a successful write. Throws an error if the tag is unknown, a type mismatch occurs, or the write fails.

### `writeTagGroup`

Writes values to multiple tags in a single, optimized network request. The connector skips tags that do not exist in the discovered tag list and logs a warning.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>tags</code></td>
      <td>An object where each key is a tag name and each value is the value to write.</td>
      <td>object</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# tags
MotorSpeedSP: 1800
Valve_1_Open: true
RecipeName: "Batch 3C"
```

#### Output

Returns `true` when all writes complete. Throws an error if the operation fails.

### `getDiscoveredTags`

Returns a list of all tags discovered during the `connect` phase. Use this for debugging or dynamically exploring a PLC.

#### Parameters

None.

#### Output

Returns an array of tag objects containing detailed schema information for each discovered tag:

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

Subscribes to one or more tags for real-time updates. When a tag value changes on the PLC, the PLC automatically pushes the new value to the platform. Register a listener using `onData` to handle incoming updates. The connector skips tags that are already subscribed or missing from the discovery list and logs a warning.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>tagNames</code></td>
      <td>A single tag name or an array of tag names to subscribe to.</td>
      <td>string or array</td>
    </tr>
    <tr>
      <td><code>rate</code></td>
      <td>How often the PLC sends updates, measured in milliseconds. Default 500.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# tagNames
[Machine_Status, Production_Count, Pressure_Sensor_1]
# rate
250
```

#### Output

Returns nothing. Data arrives through the listener registered with `onData`. Throws an error if the PLC is not connected.

### `onData`

Registers a callback that fires whenever new data arrives from a subscribed tag. You must subscribe to at least one tag for this listener to receive data.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>listener</code></td>
      <td>Callback that fires on new data. Delivers an object containing <code>tagName</code> and <code>value</code>.</td>
      <td>callback</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# listener
<callback>
```

#### Output

Returns the string `subscribed` to confirm listener registration.

### `onError`

Registers a callback that fires when a subscription error occurs, such as a lost PLC connection.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>listener</code></td>
      <td>Callback that handles the subscription error. Delivers the error object.</td>
      <td>callback</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# listener
<callback>
```

#### Output

Returns the string `subscribed` to confirm listener registration.

## Tips and tricks

### Choosing between polling, subscribing, and group operations

Use `readTag` and `writeTag` for on-demand, request-response interactions. Use `subscribe` alongside `onData` for real-time monitoring and dashboards to let the PLC push changes automatically. When handling multiple tags simultaneously, use `readTagGroup` and `writeTagGroup` to bundle requests into a single network packet and reduce network traffic.

### Connection recovery

If the PLC session closes unexpectedly, the connector clears all discovered tags and active subscriptions while logging a warning. Call `connect` again to re-establish the connection and rediscover the tags, then recreate your subscriptions.
