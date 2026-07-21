# OPC UA server

OPC UA server starts and runs a custom OPC UA server on your infrastructure. Use it to construct a declarative information model out of folders, objects, and variables, and attach logic to process data reads and writes from external OPC UA clients. 

This connector requires [instance creation](./#instance-creation) before you can configure network ports, map variable schemas, and manage the server lifecycle.

## Variable interaction types

Variables are defined inside objects within the server's information model. Their operational behavior is governed by three distinct configuration categories:

* **Getters (read-only for clients)** – Managed internally by your logic. External OPC UA clients can read these values but cannot modify them. Update a getter variable by calling `setValue` whenever its real-world state changes.
* **Setters (write-only for clients)** – Designed to ingest data updates transmitted from external OPC UA clients. When a client modifies a setter node, the server triggers the `onSet` event handler. After your logic processes the data, you must invoke `setValue` to finalize the node synchronization.
* **Requestors (read-on-demand for clients)** – Variables whose data payloads are not held in continuous server cache memory. When a client reads a requestor node, the server fires the `onRequest` event handler. Your logic must then immediately calculate or fetch the data value and provide it to the server using `setValue`.

## Server lifecycle

### `create`

Creates an unconnected OPC UA server instance and maps out its information model structure.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>objects</code></td><td>An array defining folders, objects, and variables inside the server information model. Each node requires a <code>path</code> and a <code>type</code> (<code>folder</code> or <code>object</code>), along with <code>getters</code>, <code>setters</code>, or <code>requestors</code> type maps. An object can optionally define an integer <code>offset</code> to assign fixed numeric nodeIds to the object and its getter variables.</td><td>array</td></tr><tr><td></td><td><code>port</code></td><td>The TCP port where the server listens for inbound connections. Separate parallel server instances must use distinct port numbers. Default 4840.</td><td>integer</td></tr><tr><td></td><td><code>allowAnonymous</code></td><td>Controls whether external clients can connect without credentials. When false, clients must authenticate with the credentials of an integration user. Default true. See <a href="opc-ua-server.md#protocol-and-encryption">Protocol and encryption</a> for the supported security level.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns the name of the created instance.

#### Example

```yaml
# options
port: 4841
allowAnonymous: true
objects:
  - path: Machine1
    type: folder
  - path: Machine1/Status
    type: object
    getters:
      currentSpeed: integer
      isHot: boolean
    setters:
      targetSpeed: integer
    requestors:
      uptime: string
```

### `start`

Initializes and starts the underlying OPC UA server engine, exposing the endpoint to network traffic.

#### Parameters

None.

#### Output

Returns a string containing the primary endpoint connection URL (for example, `opc.tcp://localhost:4841/UA/HeisenwareOPCUAServer`), including when the server is already running. Throws an error if starting fails.

### `stop`

Shuts down the active server engine and releases occupied network sockets.

#### Parameters

None.

#### Output

Returns nothing on a successful shutdown. Throws an error if stopping fails.

### `isStarted`

Queries whether the underlying server engine is running and accepting client connections.

#### Parameters

None.

#### Output

Returns `true` if the server engine is active, or `false` if it is not.

### `delete`

Removes the instance and its configuration.

{% hint style="danger" %}
#### Irreversible action

Deleting an instance removes its configuration. To run the server again, you must create a new instance.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` upon removal.

## Data operations and events

### `setValue`

Sets a new data value for a specific variable node on the server. This function updates getter nodes and serves as the response within your custom `onSet` and `onRequest` event scripts. The value must match the declared type, see [Data type validation](opc-ua-server.md#data-type-validation).

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>variablePath</code></td><td>The destination path targeting a specific node variable, formatted as <code>path/to/object:variableName</code>.</td><td>string</td></tr><tr><td><code>value</code></td><td>The data payload to store inside the node variable. Must match the declared schema data type.</td><td>any</td></tr></tbody></table>

#### Output

Returns `true` if the node variable updates successfully, or `false` if the path, variable, or data type is invalid (the reason logs as a warning).

#### Example

```yaml
# variablePath
Machine1/Status:currentSpeed
# value
1500
```

### `onSet`

Registers an event callback executed whenever an external OPC UA client writes a new value to a designated setter variable node.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>variablePath</code></td><td>The path of the setter variable node to monitor, formatted as <code>path/to/object:variableName</code>.</td><td>string</td></tr><tr><td><code>listener</code></td><td>The callback evaluated when a write occurs. Receives the updated value sent by the client.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `'subscribed'` when successfully registered.

#### Example

```yaml
# variablePath
Machine1/Status:targetSpeed
# listener
<callback>
```

### `onRequest`

Registers an event callback executed whenever an external OPC UA client attempts to read a designated requestor variable node on-demand.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>variablePath</code></td><td>The path of the requestor variable node to monitor, formatted as <code>path/to/object:variableName</code>.</td><td>string</td></tr><tr><td><code>listener</code></td><td>The callback evaluated when an on-demand read request arrives.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `'subscribed'` when successfully registered.

#### Example

```yaml
# variablePath
Machine1/Status:uptime
# listener
<callback>
```

### `onServerUpdate`

Registers a global diagnostic event callback executed whenever any variable node value updates on the server via `setValue`. Notifications are throttled, see [Server update throttling](opc-ua-server.md#server-update-throttling).

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback executed on a value update. Receives an epoch millisecond timestamp and the modified variable path string.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `'subscribed'` when successfully registered.

#### Example

```yaml
# listener
<callback>
```

## Complete usage example

The steps show how to configure and run the server based on the model defined in the `create` example.

{% stepper %}
{% step %}
#### Create the server

Create the server instance with the desired information model, as shown in [`create`](opc-ua-server.md#create).
{% endstep %}

{% step %}
#### Handle client writes (onSet)

When a client sets a new `targetSpeed`, process it and confirm the change by calling `setValue`.

```yaml
# variablePath
Machine1/Status:targetSpeed
# listener
<callback>
```
{% endstep %}

{% step %}
#### Handle on-demand reads (onRequest)

When a client requests the `uptime`, calculate it inside the callback and provide it back via `setValue`.

```yaml
# variablePath
Machine1/Status:uptime
# listener
<callback>
```
{% endstep %}

{% step %}
#### Update internal state (setValue)

A flow that reads the machine's actual speed periodically updates the `currentSpeed` getter.

```yaml
# variablePath
Machine1/Status:currentSpeed
# value
1498
```
{% endstep %}

{% step %}
#### Start the server

After all handlers are configured, trigger `start`.
{% endstep %}
{% endstepper %}

## Tips and tricks

### Server update throttling

The internal notification processor throttles `onServerUpdate` events to a maximum of once per second. Rapid successive `setValue` updates apply to memory values instantly, but listeners tracking global server updates receive notifications aggregated at one-second intervals.

### Protocol and encryption

The local server operates with unencrypted communication profiles (`SecurityPolicy.None` and `MessageSecurityMode.None`). It does not support custom certificates or encrypted transport envelopes. Manage outer network security boundaries when routing client traffic across public infrastructure.

### Data type validation

The underlying engine strictly validates values passed to `setValue` against the information model schema. Input data types must comply with these parameters:

| Model data type | Expected platform primitive |
| :--- | :--- |
| `boolean` | Primitive JavaScript boolean values (`true` or `false`). |
| `string`, `date` | Textual strings. Dates must conform to standard ISO 8601 syntax. |
| `integer`, `bigint`, `float`, `double`, `timestamp` | Numeric values. |
| `arrayBoolean`, `arrayInteger`, `arrayString`, etc. | Standard arrays containing matching primitive types. |
