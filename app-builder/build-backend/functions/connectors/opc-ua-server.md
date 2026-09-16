# OPC UA server

OPC UA server starts and runs a custom OPC UA server on your infrastructure. Use it to construct a declarative information model out of folders, objects, and variables, and attach logic to process data reads and writes from external OPC UA clients.

This connector requires [instance creation](./#instance-creation) before you can configure network ports, map variable schemas, and manage the server lifecycle.

## Variable interaction types

Variables are defined inside objects within the server's information model. Their operational behavior is governed by three distinct configuration categories:

* **Getters (read-only for clients)** – Managed by your logic. External OPC UA clients can read and monitor these values but cannot modify them. Update a getter variable by calling `setValue` whenever its real-world state changes; subscribed clients are notified immediately.
* **Setters (writable for clients)** – Designed to ingest data updates transmitted from external OPC UA clients. When a client writes a setter node, the server stores the value, serves it to readers right away and triggers the `onSet` event handler. Your logic may call `setValue` afterwards to correct or clamp what was written.
* **Requestors (read-on-demand for clients)** – Variables whose value is fetched when a client reads them. When a client reads a requestor node, the server fires the `onRequest` event handler. Your logic calculates or fetches the value and hands it over with `setValue`; the read is answered as soon as that happens. If nothing arrives within the request timeout, the last known value is served flagged `UncertainLastUsableValue` (or `BadNoDataAvailable` when there is none yet).

## Node ids

Every node has a deterministic node id that clients can rely on across restarts:

* Without further configuration, folders and objects get a string id built from their path (`s=Machine1/Status`) and variables get the path plus the variable name (`s=Machine1/Status:currentSpeed`).
* An object may declare an integer `offset`: the object becomes `i=<offset>` and its variables count on from there in declaration order (getters, then setters, then requestors).
* Any node may declare an explicit `nodeId`. Give the identifier part (`s=…`, `i=…`, `g=…` or `b=…`) or the full `ns=<index>;…` form, which must name the model namespace. This lets a simulated server mirror the exact node ids of a real one.

The model lives in the server's own namespace (index 1) unless the `namespaceUri` option registers an additional namespace, which gets index 2 on a fresh server. Clients address a node as `ns=<index>;<nodeId>`; `describe` lists the resolved ids.

## Server lifecycle

### `create`

Creates an unconnected OPC UA server instance and maps out its information model. Invalid models (unknown types, a child before its parent, a variable declared twice, a malformed node id) are refused here.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="140">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>objects</code></td><td>An array defining folders, objects, and variables inside the server information model. Each node requires a <code>path</code> and a <code>type</code> (<code>folder</code> or <code>object</code>); parents are declared before their children. An object may carry <code>getters</code>, <code>setters</code> and <code>requestors</code> maps whose values are a type name or an object <code>{ type, nodeId, initialValue }</code>. Objects and folders accept an optional <code>nodeId</code>; objects alternatively an integer <code>offset</code>. See <a href="opc-ua-server.md#node-ids">Node ids</a>.</td><td>array</td></tr><tr><td></td><td><code>port</code></td><td>The TCP port where the server listens for inbound connections. Separate parallel server instances must use distinct port numbers. Default 4840.</td><td>integer</td></tr><tr><td></td><td><code>hostname</code></td><td>The hostname the endpoint is advertised with. Default: the machine's hostname.</td><td>string</td></tr><tr><td></td><td><code>alternateHostname</code></td><td>Additional hostnames or IP addresses the endpoint is advertised with.</td><td>string or array</td></tr><tr><td></td><td><code>namespaceUri</code></td><td>Registers an additional namespace and builds the model there (index 2 on a fresh server). Default: the server's own namespace (index 1).</td><td>string</td></tr><tr><td></td><td><code>allowAnonymous</code></td><td>Controls whether external clients can connect without credentials. When false, <code>users</code> must be declared. Default true.</td><td>boolean</td></tr><tr><td></td><td><code>users</code></td><td>Accepted username/password pairs (<code>{ username, password }</code>). The password token is always encrypted, also on an unencrypted channel.</td><td>array</td></tr><tr><td></td><td><code>securityModes</code></td><td>Security modes the server offers: <code>None</code>, <code>Sign</code>, <code>SignAndEncrypt</code>. Default <code>[None]</code>. See <a href="opc-ua-server.md#protocol-and-encryption">Protocol and encryption</a>.</td><td>array</td></tr><tr><td></td><td><code>securityPolicies</code></td><td>Security policies the server offers, e.g. <code>Basic256Sha256</code>. Default <code>[None]</code>.</td><td>array</td></tr><tr><td></td><td><code>requestTimeout</code></td><td>Milliseconds a requestor read waits for <code>setValue</code> after <code>onRequest</code> fired. Default 1000.</td><td>integer</td></tr></tbody></table>

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
      lastService:
        type: date
        initialValue: 2026-01-15T08:00:00Z
    setters:
      targetSpeed: integer
    requestors:
      uptime: string
```

Mirroring a real server's address space:

```yaml
# options
port: 4841
namespaceUri: urn:vendor:gateway
objects:
  - path: Local Items
    type: folder
    nodeId: s=Local Items
  - path: Local Items/Line4
    type: object
    nodeId: s=Local Items.Line4
    getters:
      silo10:
        type: double
        nodeId: s=Local Items.Line4.Silo_10_Level_kg
```

A client then reads `ns=2;s=Local Items.Line4.Silo_10_Level_kg`.

### `start`

Initializes and starts the underlying OPC UA server engine, exposing the endpoint to network traffic. Values set before `start` are served from the first read on.

#### Parameters

None.

#### Output

Returns a string containing the primary endpoint connection URL (for example, `opc.tcp://localhost:4841/UA/HeisenwareOPCUAServer`), including when the server is already running. Throws an error if starting fails (for example, when an explicit node id names a namespace other than the model's).

### `stop`

Shuts down the active server engine and releases occupied network sockets. Values and registered listeners survive; a later `start` rebuilds the address space from them.

#### Parameters

None.

#### Output

Returns `true`, also when the server was not running.

### `isStarted`

Queries whether the underlying server engine is running and accepting client connections.

#### Parameters

None.

#### Output

Returns `true` if the server engine is active, or `false` if it is not.

### `getEndpointUrl`

Returns the primary endpoint URL.

#### Parameters

None.

#### Output

Returns the URL string, or `null` while the server is not started.

### `describe`

Describes the information model with the node ids clients see.

#### Parameters

None.

#### Output

Returns `{ endpointUrl, namespaceIndex, namespaceUri, objects }` where every object lists `{ path, type, nodeId, variables: [{ name, kind, type, nodeId }] }`. Before `start` the namespace index is unknown and ids are reported without the `ns=` prefix.

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

Wherever a `variablePath` is expected, the variable's node id (`s=…` or `ns=1;s=…`) is accepted as well.

### `setValue`

Sets a new data value for a variable of any kind. This function updates getter nodes, answers `onRequest` reads and may correct a value a client wrote to a setter. The value must match the declared type, see [Data type validation](opc-ua-server.md#data-type-validation).

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="140">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>variablePath</code></td><td></td><td>The destination path targeting a specific node variable, formatted as <code>path/to/object:variableName</code>.</td><td>string</td></tr><tr><td><code>value</code></td><td></td><td>The data payload to store inside the node variable. Must match the declared data type.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>statusCode</code></td><td>Optional OPC UA status code name the value is served with, e.g. <code>Bad</code> or <code>UncertainSensorNotAccurate</code>. Default <code>Good</code>.</td><td>string</td></tr><tr><td></td><td><code>sourceTimestamp</code></td><td>Optional source timestamp of the value (ISO string or epoch milliseconds). Default: now.</td><td>string or number</td></tr></tbody></table>

#### Output

Returns `true` if the node variable updates successfully, or `false` if the path, variable, or data type is invalid (the reason logs as a warning).

#### Example

```yaml
# variablePath
Machine1/Status:currentSpeed
# value
1500
```

### `setValues`

Sets several variables at once.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>values</code></td><td>A map of <code>variablePath</code> to value.</td><td>object</td></tr></tbody></table>

#### Output

Returns `{ applied, rejected }`: the list of variable paths that were set and a map of refused paths to the reason.

### `getValue`

Returns the current value of a variable. Dates are returned as ISO 8601 strings.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>variablePath</code></td><td>The path of the variable, formatted as <code>path/to/object:variableName</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns the value. Throws when the variable does not exist.

### `onSet`

Registers an event callback executed whenever an external OPC UA client writes a new value to a designated setter variable node. Every write fires, also when the same value is written twice. Writes of the wrong data type are refused with `BadTypeMismatch` and do not fire.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>variablePath</code></td><td>The path of the setter variable node to monitor, formatted as <code>path/to/object:variableName</code>.</td><td>string</td></tr><tr><td><code>listener</code></td><td>The callback evaluated when a write occurs. Receives the written value (dates as ISO strings).</td><td>callback</td></tr></tbody></table>

#### Output

Returns `'subscribed'` when successfully registered.

#### Example

```yaml
# variablePath
Machine1/Status:targetSpeed
# listener
<callback>
```

### `offSet`

Removes all callbacks registered with `onSet` for a variable.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>variablePath</code></td><td>The path of the setter variable node.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true`.

### `onRequest`

Registers an event callback executed whenever an external OPC UA client reads a designated requestor variable node. Concurrent reads share one request.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>variablePath</code></td><td>The path of the requestor variable node to monitor, formatted as <code>path/to/object:variableName</code>.</td><td>string</td></tr><tr><td><code>listener</code></td><td>The callback evaluated when an on-demand read request arrives. Receives the request timestamp (epoch milliseconds).</td><td>callback</td></tr></tbody></table>

#### Output

Returns `'subscribed'` when successfully registered.

#### Example

```yaml
# variablePath
Machine1/Status:uptime
# listener
<callback>
```

### `offRequest`

Removes all callbacks registered with `onRequest` for a variable. Reads then serve the last known value flagged uncertain.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>variablePath</code></td><td>The path of the requestor variable node.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true`.

### `onServerUpdate`

Registers a global diagnostic event callback executed whenever variable values change on the server, through `setValue` or through a client write. Notifications are throttled, see [Server update throttling](opc-ua-server.md#server-update-throttling).

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback executed on a value update. Receives an epoch millisecond timestamp, the path of the last changed variable and the list of all paths changed since the previous notification.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `'subscribed'` when successfully registered.

### `offServerUpdate`

Removes all callbacks registered with `onServerUpdate`.

#### Parameters

None.

#### Output

Returns `true`.

## Complete usage example

The steps show how to configure and run the server based on the model defined in the `create` example.

{% stepper %}
{% step %}
#### Create the server

Create the server instance with the desired information model, as shown in [`create`](opc-ua-server.md#create).
{% endstep %}

{% step %}
#### Handle client writes (onSet)

When a client sets a new `targetSpeed`, the server already serves the written value; process it in the callback and, if the machine clamps it, confirm the effective value with `setValue`.

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

After all handlers are configured, trigger `start`. Values set before that are served from the first read on.
{% endstep %}
{% endstepper %}

## Tips and tricks

### Server update throttling

The internal notification processor throttles `onServerUpdate` events to a maximum of once per second. Rapid successive `setValue` updates apply to memory values instantly and reach subscribed clients immediately, but listeners tracking global server updates receive one notification per second carrying every path changed in that window.

### Protocol and encryption

By default the server offers an unencrypted endpoint (`SecurityPolicy.None` and `MessageSecurityMode.None`). Passwords of declared `users` are encrypted with the server certificate nevertheless, so they never travel in clear. To encrypt the whole channel, offer `Sign` or `SignAndEncrypt` with a policy such as `Basic256Sha256`; the server then uses the certificate in the platform's shared PKI folder (the same folder the [OPC UA client](opc-ua-client.md) manages), generating a self-signed one on first start. Clients trust it once, as they do with any OPC UA server certificate. Client certificates are accepted automatically.

### Data type validation

The server strictly validates values passed to `setValue` against the information model. Input data types must comply with these parameters:

| Model data type | Expected platform primitive |
| :--- | :--- |
| `boolean` | Primitive JavaScript boolean values (`true` or `false`). |
| `integer` | Integer numbers within the Int32 range. |
| `bigint`, `timestamp` | Safe integers (`timestamp` non-negative epoch milliseconds). Clients receive Int64 / UInt64. |
| `float`, `double` | Finite numbers. |
| `string` | Textual strings. |
| `date` | ISO 8601 strings or Date objects; served and returned as ISO strings. |
| `arrayBoolean`, `arrayInteger`, `arrayString`, etc. | Arrays whose every item passes the scalar rule. |

`null`, `undefined`, `NaN` and fractions for integer types are refused; the refusal reason names the variable and the expected type.

### Reachability

The server listens on the port of the container or machine that hosts it. In a native agent that is the machine itself; in the cloud the port is only reachable inside the platform's network until a public endpoint is configured for it.
