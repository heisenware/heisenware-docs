# OPC UA server

The `OpcuaServer` class runs a custom OPC UA server on your infrastructure. It lets you construct a declarative information model out of folders, objects, and variables, and attach dynamic application logic to process incoming data reads and writes from external OPC UA clients. 

You must create an instance of this class to configure network listener ports, map variable schemas, and manage server lifecycles.

## Variable interaction types

Variables are defined inside objects within the server's information model. Their operational behavior is governed by three distinct configuration categories:

* **Getters (Read-Only for clients)** — Managed internally by your application logic. External OPC UA clients can read these values but cannot modify them. Your application logic updates a getter variable by calling `setValue` whenever its real-world state changes.
* **Setters (Write-Only for clients)** — Designed to ingest data updates transmitted from external OPC UA clients. When a client modifies a setter node, the server triggers the `onSet` event handler. After your application logic processes the data, you must invoke `setValue` to finalize the node synchronization.
* **Requestors (Read-On-Demand for clients)** — Variables whose data payloads are not held in continuous server cache memory. When a client reads a requestor node, the server fires the `onRequest` event handler. Your application logic must then immediately calculate or fetch the data value and hand it to the server using `setValue`.

## Server lifecycle

### `create`

Constructs an unconnected OPC UA server instance and maps out its information model structure.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>objects</code></td><td>An array list defining folders, objects, and variables inside the server information model. Each node requires a <code>path</code> and a <code>type</code> (<code>folder</code> or <code>object</code>), along with <code>getters</code>, <code>setters</code>, or <code>requestors</code> primitive type maps. Required.</td><td>array</td></tr><tr><td></td><td><code>port</code></td><td>The TCP network port where the server listens for inbound connections. Separate parallel server instances must use distinct port numbers. Default 4840.</td><td>integer</td></tr><tr><td></td><td><code>allowAnonymous</code></td><td>Controls whether external clients can connect without validating user credentials. Default true.</td><td>boolean</td></tr></tbody></table>

#### Output

An instance of the OPC UA server.

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

Initializes and brings up the underlying OPC UA server engine, exposing the endpoint to network traffic.

#### Parameters

None.

#### Output

Returns a string containing the primary endpoint connection URL (for example, `opc.tcp://localhost:4841/UA/HeisenwareOPCUAServer`).

### `stop`

Gracefully shuts down the active server engine and releases occupied network sockets.

#### Parameters

None.

#### Output

Nothing.

### `isStarted`

Queries whether the underlying server engine is currently running and accepting client connections.

#### Parameters

None.

#### Output

Returns `true` if the server engine is active, otherwise `false`.

### `delete`

Removes the server instance from the runtime environment and deallocates address space configurations.

{% hint style="danger" %}
#### Delete instance

Deleting an instance removes its configuration. To communicate with the device again, trigger `create` anew.
{% endhint %}

#### Parameters

None.

#### Output

Nothing.

## Data operations and events

### `setValue`

Sets a new data value for a specific variable node on the server. This function updates getter nodes and serves as the essential response vehicle within your custom `onSet` and `onRequest` event scripts.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>variablePath</code></td><td>The destination path targeting a specific node variable, formatted as <code>path/to/object:variableName</code>. Required.</td><td>string</td></tr><tr><td><code>value</code></td><td>The data payload to store inside the node variable. Must match the declared schema data type. Required.</td><td>any</td></tr></tbody></table>

#### Output

Returns `true` if the node variable is validated and updated successfully, otherwise `false`.

#### Example

```yaml
# variablePath
Machine1/Status:currentSpeed
# value
1500
```

### `onSet`

Registers an event callback listener executed automatically whenever an external OPC UA client writes a new value to a designated `setter` variable node.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>variablePath</code></td><td>The precise path of the setter variable node to monitor, formatted as <code>path/to/object:variableName</code>. Required.</td><td>string</td></tr><tr><td><code>listener</code></td><td>The callback function evaluated when a write occurs. Receives the updated value parameter sent by the client. Required.</td><td>callback</td></tr></tbody></table>

#### Output

Returns a confirmation string tracking successful registration: `'subscribed'`.

#### Example

```yaml
# variablePath
Machine1/Status:targetSpeed
# listener
<callback>
```

### `onRequest`

Registers an event callback listener executed automatically whenever an external OPC UA client attempts to read a designated `requestor` variable node on-demand.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>variablePath</code></td><td>The precise path of the requestor variable node to monitor, formatted as <code>path/to/object:variableName</code>. Required.</td><td>string</td></tr><tr><td><code>listener</code></td><td>The callback function evaluated when an on-demand read request arrives. Required.</td><td>callback</td></tr></tbody></table>

#### Output

Returns a confirmation string tracking successful registration: `'subscribed'`.

#### Example

```yaml
# variablePath
Machine1/Status:uptime
# listener
<callback>
```

### `onServerUpdate`

Registers a global diagnostic event listener evaluated whenever any data variable node value updates on the server via `setValue`.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback function executed upon value update synchronization events. Receives an epoch millisecond timestamp and the modified variable path string. Required.</td><td>callback</td></tr></tbody></table>

#### Output

Returns a confirmation string tracking successful registration: `'subscribed'`.

#### Example

```yaml
# listener
<callback>
```

## Tips and tricks

### Server update throttling constraints
The internal notification processor throttles `onServerUpdate` events to fire a maximum of once per second to protect system resources. Rapid successions of `setValue` updates apply to memory values instantly, but listeners registered to track global server updates will receive notification markers aggregated at one-second intervals.

### Protocol and encryption limitations
The local server implementation operates with unencrypted communication profiles (`SecurityPolicy.None` and `MessageSecurityMode.None`). It does not support custom application certificates or encrypted transport envelopes. Ensure you manage outer network security boundaries when routing client traffic across public infrastructure.

### Data type mapping validation rules
The underlying engine strictly validates values passed to `setValue` against your information model schema boundaries. Input data types must comply with these precise parameters:

| Model data type | Expected platform primitive |
| :--- | :--- |
| `boolean` | Primitive Javascript boolean values (`true` or `false`). |
| `string`, `date` | Textual strings. Dates must conform to standard ISO 8601 syntax. |
| `integer`, `bigint`, `float`, `double`, `timestamp` | Numeric values. |
| `arrayBoolean`, `arrayInteger`, `arrayString`, etc. | Standard array blocks containing matching primitive types. |
