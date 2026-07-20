# Zebra RFID IoT

The Zebra RFID IoT connector (`ZebraRfidIot`) controls and receives data from Zebra fixed RFID readers (such as the FX7500, FX9600, or ATR7000). Instead of managing direct physical serial wires or proprietary connections, the connector exchanges structured events and commands asynchronously over the platform's internal MQTT broker by communicating with the Zebra IoT Connector (ZIOTC) service running locally on the reader.

This connector requires [instance creation](./#instance-creation) before you can send commands and receive events.

## Architecture and setup

The communication line links the physical hardware reader directly to your App flows through an intermediary messaging loop:

`Zebra RFID Reader` → `Zebra IoT Connector (On-Reader Service)` → `Platform MQTT Broker` → `Your App Flow`

To establish communication, configure the ZIOTC service interface using the reader's local web administration console (located under communication > Zebra IoT Connector) to append uniform topic suffixes matching these paths:

* Management Event Topic: `<Base Topic>/m-evt`
* Data Event Topic: `<Base Topic>/d-evt`
* Management Request Topic: `<Base Topic>/m-req`
* Control Request Topic: `<Base Topic>/c-req`

If your reader firmware requires explicit response topic declarations, add these routes:
* Management Response Topic: `<Base Topic>/m-res`
* Control Response Topic: `<Base Topic>/c-res`

## Connection management

### `create`

Creates a Zebra IoT connector instance for a specific reader, identified by its base MQTT topic. The base topic is required.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>baseTopic</code></td><td>The root MQTT topic of the target reader, as configured in its ZIOTC interface settings.</td><td>string</td></tr></tbody></table>

#### Output

Returns the name of the created instance.

#### Example

```yaml
# baseTopic
my-account/zebra/atr7000/12345
```

### `isConnected`

Queries whether the underlying MQTT communication channel to the broker layer is open and active.

#### Parameters

None.

#### Output

Returns `true` if the communication link is operational, or `false` if it is not.

### `delete`

Removes the instance and all registered listeners.

{% hint style="danger" %}
#### Irreversible action

Deleting an instance removes its configuration. To communicate with the device again, you must create a new instance.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` upon removal.

## Reader status and configuration

The functions in this section and in [Control and operations](zebra-rfid-iot.md#control-and-operations) send a command to the reader and throw an error if the reader does not respond within 6 seconds.

### `getVersion`

Retrieves the hardware and system firmware version details reported by the connected reader.

#### Parameters

None.

#### Output

Returns an object containing hardware and firmware version metadata.

### `getNetwork`

Retrieves the current network interface settings running on the reader.

#### Parameters

None.

#### Output

Returns an object containing active network parameters, including local IP addresses and MAC addresses.

### `getConfig`

Retrieves the operational parameter configuration block currently deployed to the reader.

#### Parameters

None.

#### Output

Returns an object containing the active configuration settings of the reader.

### `getStatus`

Queries the active status of the physical reader hardware.

#### Parameters

None.

#### Output

Returns an object detailing diagnostic hardware conditions and state parameters.

### `getLed`

Queries the color state configuration displayed on the reader's status indicator LED.

#### Parameters

None.

#### Output

Returns an object detailing the active LED color and visualization status.

### `getMode`

Retrieves the tag scanning mode configuration currently running on the device.

#### Parameters

None.

#### Output

Returns an object containing the active scan mode and its parameters.

### `getLogConfiguration`

Queries the system logging rules and level configurations mapped to the reader.

#### Parameters

None.

#### Output

Returns an object detailing active logging levels and event metrics.

## Control and operations

### `setLed`

Sets the status color displayed on the physical reader's indicator LED.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>color</code></td><td>The target color value to apply (<code>off</code>, <code>red</code>, <code>amber</code>, or <code>green</code>).</td><td>string</td></tr><tr><td><code>seconds</code></td><td>The duration in seconds for the color state to remain active.</td><td>integer</td></tr><tr><td><code>flash</code></td><td>Forces an intermittent flashing animation when set to <code>true</code>.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns `true` when the reader confirms the command.

#### Example

```yaml
# color
green
# seconds
5
# flash
true
```

### `setMode`

Configures the reader's operational mode, including antennas, filters, and metadata collection. See [Tracking mode selection](zebra-rfid-iot.md#tracking-mode-selection) for choosing the right `type`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="200">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>type</code></td><td>The mode of operation: <code>SIMPLE</code>, <code>INVENTORY</code>, <code>PORTAL</code>, <code>CONVEYOR</code>, <code>CUSTOM</code>, or <code>DIRECTIONALITY</code>.</td><td>string</td></tr><tr><td></td><td><code>modeSpecificSettings</code></td><td>Mode-specific settings (such as <code>inventorySettings</code> or <code>portalSettings</code>).</td><td>object</td></tr><tr><td></td><td><code>environment</code></td><td>The operating environment: <code>LOW_INTERFERENCE</code>, <code>HIGH_INTERFERENCE</code>, <code>VERY_HIGH_INTERFERENCE</code>, <code>AUTO_DETECT</code>, or <code>DEMO</code>. Default <code>HIGH_INTERFERENCE</code>.</td><td>string</td></tr><tr><td></td><td><code>antennas</code></td><td>An array of antenna port integers to use. Uses all ports if omitted.</td><td>array</td></tr><tr><td></td><td><code>filter</code></td><td>A tag ID filter object (such as an EPC prefix). No filter if omitted.</td><td>object</td></tr><tr><td></td><td><code>transmitPower</code></td><td>The transmit power in dBm, as a single number or an array of numbers. Default 27 (36 dBm EIRP for ATR).</td><td>any</td></tr><tr><td></td><td><code>antennaStopCondition</code></td><td>Stop condition(s) for antennas, as a single object or an array. Defaults to a single inventory round.</td><td>any</td></tr><tr><td></td><td><code>query</code></td><td>Gen2 query parameters.</td><td>object</td></tr><tr><td></td><td><code>selects</code></td><td>Gen2 select parameters: an array of select objects (applied to all antennas) or an array of arrays (one per antenna).</td><td>array</td></tr><tr><td></td><td><code>delayAfterSelects</code></td><td>The duration in milliseconds (0 to 65) to wait after the final select before issuing a query.</td><td>integer</td></tr><tr><td></td><td><code>accesses</code></td><td>Gen2 access commands (read, write, lock, kill): an array of commands or an array of arrays (one per antenna).</td><td>array</td></tr><tr><td></td><td><code>delayBetweenAntennaCycles</code></td><td>An object defining a delay between antenna cycles if no tags are read.</td><td>object</td></tr><tr><td></td><td><code>tagMetaData</code></td><td>An array of metadata to report: strings such as <code>ANTENNA</code>, <code>RSSI</code>, <code>PHASE</code>, <code>CHANNEL</code>, <code>SEEN_COUNT</code>, <code>PC</code>, <code>XPC</code>, <code>CRC</code>, <code>EPC</code>, <code>TID</code>, <code>USER</code>, <code>MAC</code>, <code>HOSTNAME</code>, <code>TAGURI</code>, <code>EPCURI</code>, partial reads such as <code>EPC[1,3-5]</code>, or objects such as <code>{ userDefined: ... }</code>.</td><td>array</td></tr><tr><td></td><td><code>radioStartConditions</code></td><td>An object controlling when the radio starts inventorying after a start command.</td><td>object</td></tr><tr><td></td><td><code>radioStopConditions</code></td><td>An object controlling when an ongoing operation completes.</td><td>object</td></tr><tr><td></td><td><code>reportFilter</code></td><td>An object controlling when and how often a tag is reported. Cannot be set in <code>INVENTORY</code> mode.</td><td>object</td></tr><tr><td></td><td><code>rssiFilter</code></td><td>An object filtering tags by RSSI threshold. FX9600 only.</td><td>object</td></tr><tr><td></td><td><code>beams</code></td><td>An array of beam objects to use. ATR7000 only.</td><td>array</td></tr></tbody></table>

#### Output

Returns `true` when the reader confirms the configuration. Throws an error if `type` is missing.

#### Examples

**Example 1: Basic inventory polling configuration**

```yaml
# options
type: INVENTORY
antennas:
  - 1
  - 2
transmitPower: 30.1
antennaStopCondition:
  - type: DURATION
    value: 500
tagMetaData:
  - RSSI
  - PC
```

**Example 2: Triggered portal filtering configuration**

```yaml
# options
type: PORTAL
environment: LOW_INTERFERENCE
antennas:
  - 1
transmitPower: 25
filter:
  prefix: '3008'
tagMetaData:
  - EPC
  - TID
  - RSSI
reportFilter:
  duration: 0
```

### `start`

Instructs the remote reader to start radio sweeps and stream tag records over data event channels.

#### Parameters

None.

#### Output

Returns `true` when the reader confirms the command.

### `stop`

Instructs the remote reader to halt active radio polling sweeps and pause incoming tag data streams.

#### Parameters

None.

#### Output

Returns `true` when the reader confirms the command.

## Event listeners

### `onHeartbeatEvent`

Registers a listener for the periodic heartbeat events of the reader, which indicate that it is still online.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback evaluated on every heartbeat. Receives the heartbeat event object.</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed` to confirm listener registration.

#### Example

```yaml
# listener
<callback>
```

### `onErrorEvent`

Registers a listener for error events reported by the reader.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback evaluated on every error event. Receives the error event object.</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed` to confirm listener registration.

#### Example

```yaml
# listener
<callback>
```

### `onDataEvent`

Registers a named handler that receives RFID tag data. This is the primary way of getting tag reads and includes options for aggregating and filtering the data.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td></td><td>A unique name identifying this data handler.</td><td>string</td></tr><tr><td><code>handler</code></td><td></td><td>The callback receiving the tag data and the message count. With aggregation, it receives an array of unique tag messages; without, the single message. After the <code>clearAfter</code> interval of inactivity it fires again with an empty result and count 0.</td><td>callback</td></tr><tr><td><code>options</code></td><td><code>scanDuration</code></td><td>The time in milliseconds to collect unique tags before the callback fires with the batch. Set to 0 to deliver every read instantly. Default 0.</td><td>integer</td></tr><tr><td></td><td><code>clearAfter</code></td><td>The time in milliseconds of inactivity after which the internal list of seen tags clears automatically. Set to 0 to never clear. Default 10000.</td><td>integer</td></tr><tr><td></td><td><code>aggregate</code></td><td>Reports a batch of unique tags seen during <code>scanDuration</code> when <code>true</code>, or every single read immediately when <code>false</code>. Default true.</td><td>boolean</td></tr><tr><td></td><td><code>antenna</code></td><td>If set, only tags read by this antenna port are reported.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the string `subscribed` to confirm listener registration.

#### Examples

**Example 1: Streaming data delivery without aggregation**

```yaml
# name
immediate_reporter
# handler
<callback>
# options
aggregate: false
```

**Example 2: Compiled window aggregation**

This collects all unique tags seen in a 2-second window and then fires the handler with the complete batch:

```yaml
# name
batch_reporter
# handler
<callback>
# options
scanDuration: 2000
aggregate: true
```

### `clearData`

Clears the internal cache of seen tags for a specific data handler, without waiting for the `clearAfter` interval. The handler fires once with an empty result.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The name of the <code>onDataEvent</code> handler to clear.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true`, including when no handler with that name exists.

#### Example

```yaml
# name
batch_reporter
```

### `removeDataListener`

Unregisters a data listener and clears its pending timers.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The name of the data listener to remove.</td><td>string</td></tr></tbody></table>

#### Output

Returns the string `unsubscribed`, or `not found` if no listener with that name exists.

#### Example

```yaml
# name
batch_reporter
```

## Tips and tricks

### Tracking mode selection
* `SIMPLE`: Sends a data event immediately for every tag read. Use this for real-time presence detection.
* `INVENTORY`: Groups reads into periodic batch summaries with statistics. Use this for counting assets.
* `PORTAL`: Links with physical sensors to track tag bursts. Use this for doorways and logistics checkpoints.
* `CONVEYOR`: Optimizes for high-speed line sweeps where tags pass in fractions of a second.
* `CUSTOM`: Allows fine-grained control over low-level radio parameters for advanced scenarios.
