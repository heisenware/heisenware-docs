# MQTT client

The MQTT client connector manages client connections to an MQTT broker over various transport protocols, including standard TCP, TLS, and WebSockets. It automatically handles server keep-alive pings, Quality of Service (QoS) delivery flows, automatic reconnection, and message queuing before the connection is established.

This connector requires [instance creation](/app-builder/build-backend/functions/connectors.md#instance-creation) before you can communicate with an external broker, though it includes a pre-initialized internal option.

Heisenware provides a built-in, pre-configured instance named `internal-mqtt` connected directly to the platform's local broker. You can use `internal-mqtt` directly in your application logic to publish or subscribe to internal topics without defining connection configurations. To communicate with a distinct, external third-party broker, create a separate connector instance and use the connection management functions below.

## Connecting an external client to Heisenware

External devices and scripts can also connect the other way around: as MQTT clients of your tenant's broker. Data published this way arrives on the internal broker, where `internal-mqtt` can subscribe to it, and messages published through `internal-mqtt` reach the external client in turn.

To connect an external client:

1. Generate credentials in the [Integrations panel](/app-manager/inbound-integrations.md#connecting-mqtt-and-vrpc-clients) of the App Manager.
2. Configure your client with these credentials and the broker endpoint: `<TODO: broker URL, port, and TLS requirement>`.

For a complete walkthrough, including how to process the incoming data in an App, see [Connect an external MQTT client](/tutorials/integration-guides/connect-an-external-mqtt-client.md).

## Connection management

### `create`

Creates a new, named connector instance for communicating with an external broker. Instance creation works the same for all connectors; see [instance creation](/app-builder/build-backend/functions/connectors.md#instance-creation). The built-in `internal-mqtt` instance exists without this step.

After creating an instance, use `connect` to establish the broker connection.

### `connect`

Establishes a connection to the specified MQTT broker. If the client is already connected to the same URL with the same options, the function does nothing. If you target a different broker or change options, the client disconnects from the current broker before establishing the new connection.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="150">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The broker URL including the transport protocol prefix (such as <code>mqtt://broker.hivemq.com</code> or <code>mqtts://test.mosquitto.org</code>). Supported protocols: <code>mqtt</code>, <code>mqtts</code>, <code>tcp</code>, <code>tls</code>, <code>ws</code>, <code>wss</code>.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>clientId</code></td><td>A unique identifier for the client session. Generates a random identifier if omitted.</td><td>string</td></tr><tr><td></td><td><code>username</code></td><td>The username required by the broker, if any.</td><td>string</td></tr><tr><td></td><td><code>password</code></td><td>The password required by the broker, if any.</td><td>string</td></tr><tr><td></td><td><code>keepalive</code></td><td>The interval in seconds between keep-alive pings. Set to 0 to disable. Default 60.</td><td>integer</td></tr><tr><td></td><td><code>connectTimeout</code></td><td>The time in milliseconds to wait for the connection acknowledgment before the connection fails. Default 30000.</td><td>integer</td></tr><tr><td></td><td><code>reconnectPeriod</code></td><td>The interval in milliseconds between two reconnection attempts. Set to 0 to disable automatic reconnection. Default 1000.</td><td>integer</td></tr><tr><td></td><td><code>clean</code></td><td>Set to false to receive QoS 1 and 2 messages while offline. Default true.</td><td>boolean</td></tr><tr><td></td><td><code>resubscribe</code></td><td>When the connection breaks and reconnects, subscribed topics are subscribed again automatically. Default true.</td><td>boolean</td></tr><tr><td></td><td><code>queueQoSZero</code></td><td>Queue outgoing QoS 0 messages while the connection is broken. Default true.</td><td>boolean</td></tr><tr><td></td><td><code>will</code></td><td>A last will and testament configuration object the broker delivers if the client disconnects ungracefully. Keys: <code>topic</code>, <code>payload</code>, <code>qos</code>, <code>retain</code>.</td><td>object</td></tr></tbody></table>

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

Returns `true` when the connection is established. Throws an error if the connection fails.

### `disconnect`

Closes the connection to the MQTT broker and removes all message listeners of the instance.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>force</code></td><td>When set to true, the client closes the connection immediately without waiting for in-flight messages to be acknowledged. Default false.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns `true` upon successful disconnection.

### `isConnected`

Checks whether the client has an active connection to the broker.

#### Parameters

None.

#### Output

Returns `true` if connected, or `false` if disconnected.

### `isReconnecting`

Checks whether the client is currently trying to reconnect after a connection failure.

#### Parameters

None.

#### Output

Returns `true` if a reconnection attempt is running, or `false` if it is not.

### `delete`

Removes the instance configuration.

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

Publishes a text string payload to a specific topic.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>topic</code></td><td></td><td>The topic to publish to.</td><td>string</td></tr><tr><td><code>message</code></td><td></td><td>The text message payload to publish.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>qos</code></td><td>The Quality of Service (QoS) delivery guarantee level (0, 1, or 2). Default 0.</td><td>integer</td></tr><tr><td></td><td><code>retain</code></td><td>When set to true, the broker stores the message as the last known value for the topic. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>dup</code></td><td>Marks the message as a duplicate. Default false.</td><td>boolean</td></tr></tbody></table>

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

Returns a promise that resolves when the message is published. Throws an error if publication fails.

### `publishJson`

Publishes a structured data object to a specific topic. The connector serializes the payload into a JSON string before transmission.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>topic</code></td><td></td><td>The topic to publish to.</td><td>string</td></tr><tr><td><code>message</code></td><td></td><td>The structured data object payload to publish.</td><td>object</td></tr><tr><td><code>options</code></td><td><code>qos</code></td><td>The Quality of Service (QoS) delivery guarantee level (0, 1, or 2). Default 0.</td><td>integer</td></tr><tr><td></td><td><code>retain</code></td><td>When set to true, the broker stores the message as the last known value for the topic. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>dup</code></td><td>Marks the message as a duplicate. Default false.</td><td>boolean</td></tr></tbody></table>

#### Example

```yaml
# topic
devices/my-device/data
# message
temperature: 21.5
humidity: 45.2
```

#### Output

Returns a promise that resolves when the message is published. Throws an error if publication fails.

## Subscribing to messages

### `subscribe`

Subscribes to one or more topics so the client receives their message streams.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>topic</code></td><td></td><td>A topic string, array of topic strings, or subscription map. Supports topic wildcards (<code>+</code> for a single level and <code>#</code> for multiple levels).</td><td>any</td></tr><tr><td><code>options</code></td><td><code>qos</code></td><td>The maximum requested Quality of Service (QoS) level. Default 0.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# topic
sensors/+/temperature
# options
qos: 1
```

#### Output

Returns `true` when the subscription is registered.

### `onStringMessage`

Attaches an event listener that receives incoming messages as raw text strings.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td></td><td>The callback triggered on message arrival. Receives the payload string, the source topic, and the raw packet metadata.</td><td>callback</td></tr><tr><td><code>topic</code></td><td></td><td>An optional topic string or array of topics. Adds these topics to the subscription and only delivers matching messages. If omitted, the callback receives messages from all active subscriptions on the instance.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>qos</code></td><td>The QoS subscription level. Default 0.</td><td>integer</td></tr></tbody></table>

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

Attaches an event listener that parses incoming messages into JSON objects. If a payload fails to parse, the connector skips the message and logs a warning.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td></td><td>The callback executed on valid message arrival. Receives the parsed data object enhanced with a <code>__topic__</code> attribute containing the source topic.</td><td>callback</td></tr><tr><td><code>topic</code></td><td></td><td>An optional topic string or array of topics. Adds these topics to the subscription and only delivers matching messages. If omitted, the callback receives messages from all active subscriptions on the instance.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>qos</code></td><td>The QoS subscription level. Default 0.</td><td>integer</td></tr></tbody></table>

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

Unsubscribes from one or more topics and stops delivering their messages.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>topic</code></td><td>A topic string or an array of topic strings to remove.</td><td>any</td></tr></tbody></table>

#### Output

Returns a promise that resolves when the unsubscription completes.

## Utility functions

### `getLastMessageId`

Gets the packet identifier of the most recently sent outbound message.

#### Parameters

None.

#### Output

Returns an integer matching the identifier of the last sent packet.

## Tips and tricks

### Topic wildcards

MQTT topic levels use forward slashes (`/`) as separators. When binding message listeners, use `+` to match any value at a single level, or a trailing `#` to capture all nested levels below that branch.

### Pre-handshake publication queuing

You can call `publishString` or `publishJson` before the client finishes its initial connection handshake. Messages sent during startup or a temporary connection loss queue in memory and transmit automatically once the connection resolves.

## Video demo

Watch the walkthrough example to learn how to create and manage external broker communication using custom instance flows.

{% embed url="<https://www.youtube.com/watch?v=QG1Wsac2NbU>" %}
