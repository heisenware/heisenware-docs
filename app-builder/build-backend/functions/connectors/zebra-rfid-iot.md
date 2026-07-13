# Zebra RFID IoT

The Zebra RFID IoT connector (`ZebraRfidIot`) controls and receives data from Zebra fixed RFID readers (such as the FX7500, FX9600, or ATR7000). Instead of managing direct physical serial wires or proprietary connections, the connector exchanges structured events and commands asynchronously over the platform's internal MQTT broker by communicating with the Zebra IoT Connector (ZIOTC) service running locally on the reader.

This connector requires [instance creation](./#instance-creation) before you can register functional topic scopes, track device heartbeats, and run tag data aggregation stream handlers.

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

Constructs a Zebra IoT connector instance and binds it to the configured root MQTT tracking topic path.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>baseTopic</code></td><td>The root MQTT topic string assigned to the target reader inside its local ZIOTC interface settings.</td><td>string</td></tr></tbody></table>

#### Output

Returns the Zebra RFID connector instance.

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

Removes the connector instance from the local runtime engine execution context and clears all registered data and tracking listeners.

{% hint style="danger" %}
#### Destructive action

Deleting an instance removes its configuration. To communicate with the device again, you must create a new instance.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` on successful deletion. Throws an error if the operation fails.

## Reader status and configuration

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

Returns `true` once the command successfully logs to the device.

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

Deploys detailed operational scanning attributes, antenna constraints, filtration rules, and metadata collection parameters to the reader.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>type</code></td><td>The functional tracking mode selection (<code>SIMPLE</code>, <code>INVENTORY</code>, <code>PORTAL</code>, <code>CONVEYOR</code>, <code>CUSTOM</code>, or <code>DIRECTIONALITY</code>).</td><td>string</td></tr><tr><td></td><td><code>environment</code></td><td>The RF interference mitigation tier (<code>LOW_INTERFERENCE</code>, <code>HIGH_INTERFERENCE</code>, <code>VERY_HIGH_INTERFERENCE</code>, <code>AUTO_DETECT</code>, or <code>DEMO</code>). Default <code>HIGH_INTERFERENCE</code>.</td><td>string</td></tr><tr><td></td><td><code>antennas</code></td><td>An array of active antenna port indexes to include in the sweep cycle. Uses all ports if omitted.</td><td>array</td></tr><tr><td></td><td><code>transmitPower</code></td><td>The radio transmission power expressed in dBm. Accepts a single number or an array of numbers. Default 27.</td><td>any</td></tr><tr><td></td><td><code>tagMetaData</code></td><td>An array of metadata fields to bundle with tracking events (such as <code>ANTENNA</code>, <code>RSSI</code>, <code>PHASE</code>, <code>CHANNEL</code>, <code>EPC</code>, or <code>TID</code>).</td><td>array</td></tr><tr><td></td><td><code>antennaStopCondition</code></td><td>An object defining operational cutoff boundaries for active antennas.</td><td>any</td></tr><tr><td></td><td><code>filter</code></td><td>A tag filtration object specifying targeted EPC prefix values.</td><td>object</td></tr></tbody></table>

#### Output

Returns `true` when the configuration parameters deploy and confirm successfully.

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

Returns `true` when execution completes successfully.

### `stop`

Instructs the remote reader to halt active radio polling sweeps and pause incoming tag data streams.

#### Parameters

None.

#### Output

Returns `true` when execution completes successfully.

## Event listeners

### `onHeartbeatEvent`

Binds a callback evaluated whenever periodic heartbeat signals arrive from the hardware.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>A unique tracking label string to identify this specific event handler.</td><td>string</td></tr><tr><td><code>handler</code></td><td>The callback evaluated on arrival. Receives the raw heartbeat payload structure.</td><td>callback</td></tr></tbody></table>

#### Output

Returns a confirmation string when successfully bound.

#### Example

```yaml
# name
heartbeat_checker
# handler
<callback>
```

### `onErrorEvent`

Binds a callback evaluated whenever the hardware encounters an operational or system error.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>A unique tracking label string to identify this specific error handler.</td><td>string</td></tr><tr><td><code>handler</code></td><td>The callback executed upon fault detection events. Receives the system error object.</td><td>callback</td></tr></tbody></table>

#### Output

Returns a confirmation string when successfully bound.

#### Example

```yaml
# name
error_logger
# handler
<callback>
```

### `onDataEvent`

Registers a callback to intercept and aggregate passing RFID tag captures. This block manages aggregation timelines, filters out extraneous reads, and packages metrics before routing payloads upstream.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td></td><td>A unique tracking label identifier used to map this data stream handler.</td><td>string</td></tr><tr><td><code>handler</code></td><td></td><td>The callback executed on frame assembly validation. Receives an array of tracked messages.</td><td>callback</td></tr><tr><td><code>options</code></td><td><code>scanDuration</code></td><td>The collection accumulation window in milliseconds to group unique tag reads into a single combined batch. Set to 0 to deliver instantly. Default 0.</td><td>integer</td></tr><tr><td></td><td><code>clearAfter</code></td><td>A quiet operational window limit in milliseconds of inactivity after which the internal list flushes automatically. Set to 0 to never clear. Default 10000.</td><td>integer</td></tr><tr><td></td><td><code>aggregate</code></td><td>Groups matching unique records captured during the scan duration window when set to <code>true</code>. Disables batching and delivers items standalone when <code>false</code>. Default true.</td><td>boolean</td></tr><tr><td></td><td><code>antenna</code></td><td>An optional antenna port index filter to isolate incoming messages to a single physical port.</td><td>integer</td></tr></tbody></table>

#### Output

Returns a confirmation string when successfully mapped.

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

This gathers unique records inside a rolling 2-second collection timeline before evaluating the callback with the full inventory batch array:

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

Clears the internal tracking records cached inside a targeted data listener. This utility resets tracking tables instantly without waiting for a `clearAfter` interval to trigger.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The string name of the target <code>onDataEvent</code> handler cache to flush.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` when the internal cache clears.

#### Example

```yaml
# name
batch_reporter
```

### `removeDataListener`

Unregisters an active data tracking listener and tears down its collection timers.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The string name of the target data listener to destroy.</td><td>string</td></tr></tbody></table>

#### Output

Returns a confirmation string indicating whether the listener was unbound.

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
