# MQTT client

The MQTT client connector handles client connections to an MQTT broker over various transport protocols, including standard TCP, TLS, and WebSockets. It automatically coordinates server keep-alive pings, Quality of Service (QoS) delivery flows, automated reconnection routines, and early publish message queuing.

Heisenware provides a built-in pre-configured instance named `internal-mqtt` connected directly to the platform's local broker. You can use `internal-mqtt` straight out of the box in your application logic to publish or subscribe to internal topics without defining connection configurations. To communicate with a distinct, external third-party broker, initialize a separate connector instance and use the connection management functions below.

## Connection management

### `connect`

Establishes an active connection to the specified MQTT broker. If the client is already connected to an identical URL with matching options, the transaction terminates without re-executing. If you target a different broker configuration path or alter security credentials, the client automatically closes the active session before initializing the new connection handler.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The destination broker URL endpoint including the transport protocol prefix (such as <code>mqtt://broker.hivemq.com</code> or <code>mqtts://test.mosquitto.org</code>). Required.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>clientId</code></td><td>A unique tracking string for the client session. Generates a random alphanumeric tracking hash automatically if omitted.</td><td>string</td></tr><tr><td></td><td><code>username</code></td><td>The authentication username credential required by the broker.</td><td>string</td></tr><tr><td></td><td><code>password</code></td><td>The authentication password credential required by the broker.</td><td>string</td></tr><tr><td></td><td><code>keepalive</code></td><td>The time window interval in seconds between successive server keep-alive ping messages. Default 60.</td><td>integer</td></tr><tr><td></td><td><code>connectTimeout</code></td><td>The connection threshold wait limit in milliseconds before a connection handshake fails. Default 30000.</td><td>integer</td></tr><tr><td></td><td><code>will</code></td><td>A last will and testament configuration block delivered automatically by the broker if the client terminates ungracefully.</td><td>object</td></tr></tbody></table>

#### Output

Returns `true` when a connection session is successfully established with the broker host.

#### Example

```yaml
# url
mqtt://broker.hivemq.com
# options
username: my-device-user
password: my-secret-password
will:
  topic: devices/my-device/status
  payload: offline
  qos: 1
  retain: true
```

### `disconnect`

Closes the active network channel link with the MQTT broker and purges all instance messaging listeners from memory.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>force</code></td><td>When set to <code>true</code>, the client severs the network socket instantly without waiting for remaining in-flight message acknowledgments to complete. Default false.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns `true` upon successful session termination.

### `isConnected`

Checks whether the client possesses a live, active communication session with the broker.

#### Parameters

None.

#### Output

Returns `true` if connected, otherwise `false`.

### `isReconnecting`

Checks whether the client is currently executing an automated reconnection logic loop following an unexpected connection failure.

#### Parameters

None.

#### Output

Returns `true` if a reconnection routine is running, otherwise `false`.

### `delete`

Removes the instance configuration from the execution scope and clears active memory paths.

{% hint style="danger" %}
Deleting an instance removes its configuration. To communicate with the broker again, trigger `create` anew.
{% endhint %}

#### Parameters

None.

#### Output

Nothing.

## Publishing messages

### `publishString`

Transmits an alphanumeric text string payload directly to a specific topic channel destination.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>topic</code></td><td></td><td>The destination topic channel path string. Required.</td><td>string</td></tr><tr><td><code>message</code></td><td></td><td>The textual message payload data to transmit. Required.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>qos</code></td><td>The Quality of Service message delivery guarantee level (0, 1, or 2). Default 0.</td><td>integer</td></tr><tr><td></td><td><code>retain</code></td><td>When set to <code>true</code>, instructs the broker to persist the message as the last verified value for the target topic path. Default false.</td><td>boolean</td></tr></tbody></table>

#### Output

A promise that resolves when the message packet delivery finishes processing.

#### Example

```yaml
# topic
devices/my-device/log
# message
Device starting up...
# options
qos: 1
```

### `publishJson`

Transmits a structured data object straight to a specified topic path channel. The connector formats the payload data automatically into a serialized text string layout before packet delivery.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>topic</code></td><td></td><td>The destination topic channel path string. Required.</td><td>string</td></tr><tr><td><code>message</code></td><td></td><td>The structured data object payload parameters to transmit. Required.</td><td>object</td></tr><tr><td><code>options</code></td><td><code>qos</code></td><td>The Quality of Service delivery guarantee tier (0, 1, or 2). Default 0.</td><td>integer</td></tr><tr><td></td><td><code>retain</code></td><td>When set to <code>true</code>, the broker stores the message record persistently. Default false.</td><td>boolean</td></tr></tbody></table>

#### Output

A promise that resolves when the serialized data packet transmission completes.

#### Example

```yaml
# topic
devices/my-device/data
# message
temperature: 21.5
humidity: 45.2
```

## Subscribing to messages

### `subscribe`

Registers a subscription across designated topic channels to begin intercepting passing message streams.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>topic</code></td><td></td><td>A standalone routing string, array of topic strings, or tracking map. Supports path wildcard tags (<code>+</code> for single level and <code>#</code> for multi-level paths). Required.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>qos</code></td><td>The maximum requested Quality of Service assignment matching tier. Default 0.</td><td>integer</td></tr></tbody></table>

#### Output

Returns `true` when the subscription instructions map cleanly into the routing client layers.

#### Example

```yaml
# topic
sensors/+/temperature
# options
qos: 1
```

### `onStringMessage`

Attaches an explicit event callback listener to intercept arriving message packets and return raw payload text strings.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td></td><td>The callback script target triggered instantly on message arrival. Receives payload string, destination topic, and raw packet metadata properties. Required.</td><td>callback</td></tr><tr><td><code>topic</code></td><td></td><td>An optional path string or array of paths to subscribe to. If omitted, the callback monitors messages matching all subscriptions active on the connector.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>qos</code></td><td>The subscription configuration matching QoS tier. Default 0.</td><td>integer</td></tr></tbody></table>

#### Output

Returns a confirmation verification string when successfully bound.

#### Example

```yaml
# listener
<callback>
# topic
devices/my-device/commands
```

### `onJsonMessage`

Attaches an event callback listener to intercept incoming message streams and parse incoming data into standard JSON objects automatically. If the incoming payload fails formatting parser validation, the transaction drops with a logging console warning.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td></td><td>The callback function executed on valid arrival. Receives the parsed data parameters enhanced with a fallback <code>__topic__</code> text attribute property. Required.</td><td>callback</td></tr><tr><td><code>topic</code></td><td></td><td>An optional routing path or array of paths to subscribe to. If blank, matches all subscriptions initialized on the instance.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>qos</code></td><td>The subscription configuration matching QoS tier. Default 0.</td><td>integer</td></tr></tbody></table>

#### Output

Returns a status verification string when successfully bound.

#### Example

```yaml
# listener
<callback>
# topic
devices/my-device/config
```

### `unsubscribe`

Instructs the connector client to drop specific topic channel paths and halt related background processing loops.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>topic</code></td><td>A literal path string or an array list of string channel paths to drop. Required.</td><td>any</td></tr></tbody></table>

#### Output

A promise that resolves when the unsubscription transactions clear the client channel layer.

## Utility functions

### `getLastMessageId`

Queries the packet index tracking identifier integer assigned to the most recently delivered outbound message stream.

#### Parameters

None.

#### Output

An integer matching the tracking number code of the last sent packet.

## Tips and tricks

### Multi-level layout wildcards
MQTT path levels use forward slash symbols (`/`) to divide data branches. When binding message listening callbacks, you can map the `+` character symbol to match any variable parameter at an isolated folder level, or add a trailing `#` multi-level character code to capture all descending nested paths along that channel trunk.

### Pre-handshake publication queuing
The communication mapping engine allows direct processing calls to `publishString` or `publishJson` before the client fully finishes its initial connection handshake routines with the target host. Messages passed during a temporary connection loss phase or during startup queue safely inside memory buffers and stream outbound automatically once handshakes resolve.

## Video demo

Watch the walkthrough example to learn how to create and manage external broker communication models using custom instance flows.

{% embed url="https://www.youtube.com/watch?v=QG1Wsac2NbU" %}
```
