# MQTT Client

The `MqttClient` class is a wrapper for connecting to an MQTT broker. It simplifies the process of connecting, publishing, subscribing, and handling messages, and automatically manages features like keep-alives and reconnections.

## Working with the Heisenware Broker

Heisenware includes a built-in MQTT broker. There are two main ways to interact with it:

### Connecting an External Client TO Heisenware

If you have an external device or application (like an IoT sensor) that needs to publish data _to_ the Heisenware broker, you must first create credentials for it. Please follow the guide on [Creating an MQTT Integration](../../../../app-manager/integrations-inbound-connections.md#mqtt-client) to do this.

{% hint style="info" %}
**Broker Connection Details**

Your internal Heisenware broker is available at the following address:

* Hostname: `<account>.heisenware.cloud`
* Port: `8884` (MQTTS, TLS encrypted)
* Topic Prefix: `<account>.default/`

For example, an account named `my-company` would publish to a topic like `my-company.default/test`.

**HINT:** To use the secure `8884` port, you may need to adjust your MQTT client's settings. Most clients require you to enable an option to proceed without validating the server certificate, when Heisenware certificate is not stored in your environment.
{% endhint %}

### Using the Internal Client (`internal-mqtt`)

For use within your application logic, Heisenware provides a pre-configured instance called `internal-mqtt`. You can use this instance to subscribe to topics on the internal broker (including data published by your external clients) or to publish messages from your app. No `create` or `connect` step is needed for this instance.

<p align="center"><br><img src="../../../../.gitbook/assets/image (482).png" alt=""></p>

To connect to a different, non-Heisenware broker, you must use the `create` and `connect` functions below. The [video example below](mqtt-client.md#video-example-connecting-to-an-external-broker) focusses on that topic, too.

## Connection Management

### create

Creates a new, unconnected MQTT client instance.

### connect

Connects the client to a specified MQTT broker using a URL and various options.

Parameters

* `url`: The broker URL, including the protocol (e.g., `mqtt://broker.hivemq.com`, `wss://test.mosquitto.org:8081`).
* `options`: An object for connection configuration.
  * `clientId`: A unique ID for this client. If not provided, a random one is generated.
  * `username`: The username for authentication, if required.
  * `password`: The password for authentication, if required.
  * `keepalive`: The interval in seconds for keep-alive pings. Defaults to `60`.
  * `connectTimeout`: Timeout in milliseconds for the connection attempt. Defaults to `30000`.
  * `will`: A "Last Will and Testament" object to be published by the broker if this client disconnects ungracefully.
    * `topic`: The topic for the will message.
    * `payload`: The will message payload.
    * `qos`: The QoS level for the will.
    * `retain`: The retain flag for the will.

Example: Connect with username and a last will

```yaml
# url
mqtt://broker.hivemq.com
# options
username: my-device-user
password: my-secret-password
will: {
  topic: 'devices/my-device/status',
  payload: 'offline',
  qos: 1,
  retain: true
}
```

Output

Returns true on a successful connection.

### disconnect

Closes the connection to the broker.

Parameters

* `force`: If `true`, the client closes immediately without waiting for in-flight messages to be acknowledged. Defaults to `false`.

Output

Returns true on success.

### isConnected

Checks if the client is currently connected to the broker.

Output

Returns true if connected, false otherwise.

### isReconnecting

Checks if the client is in the process of reconnecting after a disconnect.

Output

Returns true if the client is currently trying to reconnect.

## Publishing Messages

### publishString

Publishes a string message to a specific topic.

Parameters

* `topic`: The topic to publish to.
* `message`: The string message to publish.
* `options`: An optional object for publish settings.
  * `qos`: The Quality of Service level (`0`, `1`, or `2`). Defaults to `0`.
  * `retain`: If `true`, the message is stored by the broker as the "last known good" value for that topic. Defaults to `false`.

Example

```yaml
# topic
devices/my-device/log
# message
Device starting up...
# options
qos: 1
```

### publishJson

Publishes a JSON object to a specific topic. The object is automatically stringified.

Parameters

* `topic`: The topic to publish to.
* `message`: The JSON object to publish.
* `options`: An optional configuration object (see `publishString` for details).

Example

```yaml
# topic
devices/my-device/data
# message
temperature: 21.5
humidity: 45.2
```

## Subscribing to Messages

### subscribe

Subscribes to one or more topics to receive messages. Supports MQTT wildcards (`+` for single level, `#` for multi-level).

Parameters

* `topic`: A string, an array of strings, or an object representing the topic(s) to subscribe to.
* `options`: Optional settings, primarily for setting the `qos` level of the subscription.

Example

```yaml
# topic
sensors/+/temperature
# options
qos: 1
```

### onStringMessage

Attaches a listener that is triggered for incoming messages, providing the payload as a string. This is a convenient way to subscribe and handle messages in one step.

Parameters

* `listener`: The callback function that will receive the message.
* `topic`: An optional topic or array of topics to subscribe to. If omitted, the listener will receive messages from all topics the client is already subscribed to.

Example

```yaml
# listener
<callback>
# topic
devices/my-device/commands
```

### onJsonMessage

Attaches a listener for incoming messages and automatically parses the payload as JSON. If parsing fails, the message is ignored.

Parameters

* `listener`: The callback function that will receive the parsed JSON object.
* `topic`: An optional topic or array of topics to subscribe to.

Example

```yaml
# listener
<callback>
# topic
devices/my-device/config
```

### unsubscribe

Unsubscribes from a topic or topics, stopping the flow of messages from them.

Parameters

* `topic`: A string or an array of strings representing the topic(s) to unsubscribe from.

## Utility Functions

### getLastMessageId

Gets the message ID of the last message sent by this client.

Output

The last message ID number.

## Video Example: Connecting to an External Broker

For a complete walkthrough of how to create a new MQTT client instance and connect it to an external, third-party broker (such as HiveMQ), please see the video guide below.

{% embed url="https://www.youtube.com/watch?v=QG1Wsac2NbU" %}
