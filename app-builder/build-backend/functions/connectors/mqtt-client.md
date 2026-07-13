# MQTT client connector

The MQTT client connector manages client connections to an MQTT broker over various transport protocols, including standard TCP, TLS, and WebSockets. It automatically handles server keep-alive pings, Quality of Service (QoS) delivery flows, automated reconnection routines, and early message queuing.

This connector requires [instance creation](/app-builder/build-backend/functions/connectors.md#instance-creation) before you can communicate with an external broker, though it includes a pre-initialized internal option.

Heisenware provides a built-in, pre-configured instance named `internal-mqtt` connected directly to the platform's local broker. You can use `internal-mqtt` directly in your application logic to publish or subscribe to internal topics without defining connection configurations. To communicate with a distinct, external third-party broker, create a separate connector instance and use the connection management functions below.

## Connection management

### `connect`

Establishes an active connection to the specified MQTT broker. If the client is already connected to an identical URL with matching options, the transaction terminates without re-executing. If you target a different broker configuration path or alter security credentials, the client automatically closes the active session before initializing the new connection handler.

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
      <td><code>url</code></td>
      <td></td>
      <td>The destination broker URL endpoint including the transport protocol prefix (such as <code>mqtt://broker.hivemq.com</code> or <code>mqtts://test.mosquitto.org</code>).</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>clientId</code></td>
      <td>A unique tracking string for the client session. Generates a random alphanumeric hash automatically if omitted.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>username</code></td>
      <td>The authentication username credential required by the broker.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>password</code></td>
      <td>The authentication password credential required by the broker.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>keepalive</code></td>
      <td>The interval in seconds between successive server keep-alive ping messages. Default 60.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>connectTimeout</code></td>
      <td>The connection threshold wait limit in milliseconds before a connection handshake fails. Default 30000.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>will</code></td>
      <td>A last will and testament configuration object delivered automatically by the broker if the client terminates ungracefully.</td>
      <td>object</td>
    </tr>
  </tbody>
</table>

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

#### Output

Returns `true` when a connection session is successfully established with the broker host. Throws an error if the connection fails.

### `disconnect`

Closes the active network channel link with the MQTT broker and removes all instance messaging listeners from memory.

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
      <td><code>force</code></td>
      <td>When set to true, the client severs the network socket instantly without waiting for remaining in-flight message acknowledgments to complete. Default false.</td>
      <td>boolean</td>
    </tr>
  </tbody>
</table>

#### Output

Returns `true` upon successful session termination.

### `isConnected`

Checks whether the client possesses a live, active communication session with the broker.

#### Parameters

None.

#### Output

Returns `true` if connected, or `false` if disconnected.

### `isReconnecting`

Checks whether the client is currently executing an automated reconnection loop following an unexpected connection failure.

#### Parameters

None.

#### Output

Returns `true` if a reconnection routine is running, or `false` if it is not.

### `delete`

Removes the instance configuration from the execution scope and clears active memory paths.

{% hint style="danger" %}
#### Irreversible action
Deleting an instance removes its configuration. To communicate with the broker again, you must trigger `create` anew.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` upon removal.

## Publishing messages

### `publishString`

Transmits an alphanumeric text string payload directly to a specific topic channel destination.

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
      <td><code>topic</code></td>
      <td></td>
      <td>The destination topic channel path string.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>message</code></td>
      <td></td>
      <td>The text message payload to transmit.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>qos</code></td>
      <td>The Quality of Service (QoS) message delivery guarantee level (0, 1, or 2). Default 0.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>retain</code></td>
      <td>When set to true, instructs the broker to persist the message as the last verified value for the target topic path. Default false.</td>
      <td>boolean</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# topic
devices/my-device/log
# message
Device starting up...
# options
qos: 1
```

#### Output

Returns a promise that resolves to `true` when message delivery finishes processing. Throws an error if publication fails.

### `publishJson`

Transmits a structured data object straight to a specified topic channel. The connector formats the payload data automatically into a serialized text string before transmission.

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
      <td><code>topic</code></td>
      <td></td>
      <td>The destination topic channel path string.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>message</code></td>
      <td></td>
      <td>The structured data object payload to transmit.</td>
      <td>object</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>qos</code></td>
      <td>The Quality of Service (QoS) delivery guarantee tier (0, 1, or 2). Default 0.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>retain</code></td>
      <td>When set to true, the broker stores the message record persistently. Default false.</td>
      <td>boolean</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# topic
devices/my-device/data
# message
temperature: 21.5
humidity: 45.2
```

#### Output

Returns a promise that resolves to `true` when the serialized data packet transmission completes. Throws an error if publication fails.

## Subscribing to messages

### `subscribe`

Registers a subscription across designated topic channels to begin intercepting passing message streams.

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
      <td><code>topic</code></td>
      <td></td>
      <td>A standalone routing string, array of topic strings, or tracking map. Supports path wildcard characters (<code>+</code> for single-level and <code>#</code> for multi-level paths).</td>
      <td>any</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>qos</code></td>
      <td>The maximum requested Quality of Service (QoS) assignment matching tier. Default 0.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# topic
sensors/+/temperature
# options
qos: 1
```

#### Output

Returns `true` when the subscription instructions register cleanly into the routing client layers.

### `onStringMessage`

Attaches an event callback listener to intercept arriving message packets and deliver raw payload text strings.

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
      <td><code>listener</code></td>
      <td></td>
      <td>The callback function triggered on message arrival. Receives the payload string, destination topic, and raw packet metadata.</td>
      <td>callback</td>
    </tr>
    <tr>
      <td><code>topic</code></td>
      <td></td>
      <td>An optional path string or array of paths to filter subscriptions. If omitted, the callback monitors messages matching all active subscriptions on the connector.</td>
      <td>any</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>qos</code></td>
      <td>The subscription configuration matching QoS tier. Default 0.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# listener
<callback>
# topic
devices/my-device/commands
```

#### Output

Returns a confirmation string when successfully bound.

### `onJsonMessage`

Attaches an event callback listener to intercept incoming message streams and automatically parse data into standard JSON objects. If the incoming payload fails parser validation, the connector skips the message and logs a warning.

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
      <td><code>listener</code></td>
      <td></td>
      <td>The callback function executed on valid message arrival. Receives the parsed data object enhanced with a fallback <code>__topic__</code> text attribute.</td>
      <td>callback</td>
    </tr>
    <tr>
      <td><code>topic</code></td>
      <td></td>
      <td>An optional routing path or array of paths to filter subscriptions. If left blank, matches all active subscriptions on the instance.</td>
      <td>any</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>qos</code></td>
      <td>The subscription configuration matching QoS tier. Default 0.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# listener
<callback>
# topic
devices/my-device/config
```

#### Output

Returns a confirmation string when successfully bound.

### `unsubscribe`

Instructs the connector to drop specific topic channels and halt related message processing loop updates.

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
      <td><code>topic</code></td>
      <td>A literal path string or an array of string channel paths to remove.</td>
      <td>any</td>
    </tr>
  </tbody>
</table>

#### Output

Returns a promise that resolves to `true` when the unsubscription completes.

## Utility functions

### `getLastMessageId`

Queries the packet tracking identifier integer assigned to the most recently delivered outbound message stream.

#### Parameters

None.

#### Output

Returns an integer matching the tracking number code of the last sent packet.

## Tips and tricks

### Topic wildcards

MQTT topic levels use forward slashes (`/`) to separate data branches. When binding message listeners, use the `+` symbol to match any variable parameter at a single folder level, or use a trailing `#` character code to capture all descending nested paths along that channel branch.

### Pre-handshake publication queuing

You can call `publishString` or `publishJson` before the client fully finishes its initial connection handshake with the target host. Messages passed during startup or a temporary connection loss queue safely inside memory buffers and transmit automatically once the connection resolves.

## Video demo

Watch the walkthrough example to learn how to create and manage external broker communication models using custom instance flows.

{% embed url="https://www.youtube.com/watch?v=QG1Wsac2NbU" %}
