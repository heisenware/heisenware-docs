# Zebra RFID IoT

The Zebra RFID IoT connector controls and receives data from Zebra fixed RFID readers (such as the FX7500, FX9600, or ATR7000). Instead of managing direct physical serial wires or proprietary connections, the connector exchanges structured events and commands asynchronously over the platform's internal MQTT broker by communicating with the Zebra IoT Connector (ZIOTC) service running locally on the reader.

You must create an instance to register functional topic scopes, track device heartbeats, and run tag data aggregation stream handlers.

## Architecture and setup

The communication line links the physical hardware reader directly to your application logic flows through an intermediary messaging loop:

`Zebra RFID Reader` → `Zebra IoT Connector (On-Reader Service)` → `Platform MQTT Broker` → `Your Application Flow`

For this coordination to resolve, configure the ZIOTC service interface using the reader's local web administration console (located under **Communication > Zebra IoT Connector**) to append uniform structural topic suffixes matching these paths:

* Management Event Topic: `<Base Topic>/m-evt`
* Data Event Topic: `<Base Topic>/d-evt`
* Management Request Topic: `<Base Topic>/m-req`
* Control Request Topic: `<Base Topic>/c-req`

If your specific reader firmware version requires explicit response topic declarations, supplement the configuration with these routes:
* Management Response Topic: `<Base Topic>/m-res`
* Control Response Topic: `<Base Topic>/c-res`

## Connection management

### `create`

Constructs a Zebra IoT connector instance and binds it to the configured root MQTT tracking topic path.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>baseTopic</code></td><td>The root MQTT topic string assigned to the target reader inside its local ZIOTC interface settings. Required.</td><td>string</td></tr></tbody></table>

#### Output

An instance of the Zebra RFID connector interface.

#### Example

```yaml
# baseTopic
my-account/zebra/atr7000/12345
```

### `isConnected`

Queries whether the underlying MQTT communication channel to the broker layer is fully open and active.

#### Parameters

None.

#### Output

Returns `true` if the communication client link is operational, otherwise `false`.

### `delete`

Removes the connector instance from the local runtime engine execution context and clears all registered data and tracking listeners.

{% hint style="danger" %}
#### Delete instance

Deleting an instance removes its configuration. To communicate with the device again, trigger `create` anew.
{% endhint %}

#### Parameters

None.

#### Output

Nothing.

## Reader status and configuration

### `getVersion`

Retrieves the structural hardware and system firmware version details reported by the connected reader.

#### Parameters

None.

#### Output

An object containing version metadata parameters returned by the hardware host.

### `getNetwork`

Retrieves the current low-level network interface settings running on the reader.

#### Parameters

None.

#### Output

An object highlighting active network parameters, including local IP addresses and hardware MAC locations.

### `getConfig`

Retrieves the entire operational parameter configuration block currently deployed to the reader profile.

#### Parameters

None.

#### Output

An object compiling the comprehensive operational settings of the hardware unit.

### `getStatus`

Queries the active, live device status profile of the physical reader hardware.

#### Parameters

None.

#### Output

An object detailing diagnostic hardware conditions and state parameters.

### `getLed`

Queries the active color state configuration displayed on the reader's application status indicator LED.

#### Parameters

None.

#### Output

An object detailing the target LED color and current visualization status.

### `getMode`

Retrieves the functional tag scanning mode configuration profile currently running on the device.

#### Parameters

None.

#### Output

An object tracking the current operational scan mode and related sub-parameters.

### `getLogConfiguration`

Queries the system logging rules and level configurations mapped to the reader device.

#### Parameters

None.

#### Output

An object detailing the active logging levels and event metrics.

## Control and operations

### `setLed`

Manipulates the status color mode displayed on the physical reader unit's application LED.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>color</code></td><td>The target color value to apply (<code>off</code>, <code>red</code>, <code>amber</code>, or <code>green</code>). Required.</td><td>string</td></tr><tr><td><code>seconds</code></td><td>The execution duration window in seconds for the color state to remain active. Required.</td><td>integer</td></tr><tr><td><code>flash</code></td><td>Forces an intermittent flashing animation routine when set to <code>true</code>. Required.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns `true` once the management instruction successfully logs to the device.

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

Deploys detailed operational scanning attributes, antenna constraints, filtration rules, and metadata collection parameters to the reader unit.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>type</code></td><td>The functional tracking mode type selection (<code>SIMPLE</code>, <code>INVENTORY</code>, `PORTAL`, <code>CONVEYOR</code>, <code>CUSTOM</code>, <code>DIRECTIONALITY</code>). Required.</td><td>string</td></tr><tr><td></td><td><code>environment</code></td><td>The environmental RF interference mitigation tier (<code>LOW_INTERFERENCE</code>, <code>HIGH_INTERFERENCE</code>, <code>VERY_HIGH_INTERFERENCE</code>, <code>AUTO_DETECT</code>, <code>DEMO</code>). Default 'HIGH_INTERFERENCE'.</td><td>string</td></tr><tr><td></td><td><code>antennas</code></td><td>An array list of active antenna port indexes to include in the sweep cycle. Utilizes all ports if omitted.</td><td>array</td></tr><tr><td></td><td><code>transmitPower</code></td><td>The radio transmission energy power value expressed in dBm. Accepts a standalone number or an array of numbers. Default 27.</td><td>number or array</td></tr><tr><td></td><td><code>tagMetaData</code></td><td>An array list of metadata primitives to bundle with tracking events (such as <code>ANTENNA</code>, <code>RSSI</code>, <code>PHASE</code>, <code>CHANNEL</code>, <code>EPC</code>, <code>TID</code>).</td><td>array</td></tr><tr><td></td><td><code>antennaStopCondition</code></td><td>An object block defining operational lifecycle cut-off boundaries for active antennas.</td><td>object or array</td></tr><tr><td></td><td><code>filter</code></td><td>A tag filtration object tracking targeted EPC identifier prefix values.</td><td>object</td></tr></tbody></table>

#### Output

Returns `true` when the configuration parameters deploy and confirm successfully.

#### Examples

Example 1: Basic inventory polling configuration

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

Example 2: Triggered portal filtering configuration

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

Instructs the remote reader unit to instantly start radio sweeps and begin streaming tag information records over data event channels.

#### Parameters

None.

#### Output

Returns `true` when execution completes safely.

### `stop`

Instructs the remote reader unit to halt active radio polling sweeps and pause incoming tag data streams.

#### Parameters

None.

#### Output

Returns `true` when execution completes safely.

## Event listeners

### `onHeartbeatEvent`

Binds a validation callback handler evaluated immediately whenever periodic online heartbeat signals arrive from the tracking hardware.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>A unique identification tracking label string separating this specific event handler module. Required.</td><td>string</td></tr><tr><td><code>handler</code></td><td>The target callback script evaluated on arrival. Receives the raw heartbeat payload structure directly. Required.</td><td>callback</td></tr></tbody></table>

#### Output

Returns a confirmation verification string when successfully bound.

#### Example

```yaml
# name
heartbeat_checker
# handler
<callback>
```

### `onErrorEvent`

Binds a tracking callback handler evaluated instantly whenever the hardware platform intercepts an internal operational or system processing error fault.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>A unique identification tracking label string separating this specific error handler block. Required.</td><td>string</td></tr><tr><td><code>handler</code></td><td>The target callback script executed upon fault detection events. Receives the system error object. Required.</td><td>callback</td></tr></tbody></table>

#### Output

Returns a confirmation verification string when successfully bound.

#### Example

```yaml
# name
error_logger
# handler
<callback>
```

### `onDataEvent`

Registers a data accumulation callback module used to intercept passing RFID tag captures. This block manages aggregation timelines, filters out extraneous reads, and packages metrics before routing payloads upstream.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td></td><td>A unique tracking label identifier used to map this data stream handler module. Required.</td><td>string</td></tr><tr><td><code>handler</code></td><td></td><td>The destination script executed on frame assembly validation. Receives an array list of tracked messages. Required.</td><td>callback</td></tr><tr><td><code>options</code></td><td><code>scanDuration</code></td><td>The temporal collection accumulation window in milliseconds over which to group unique tag reads into a single combined batch. Set to 0 to deliver instantly. Default 0.</td><td>integer</td></tr><tr><td></td><td><code>clearAfter</code></td><td>A quiet operational window limit in milliseconds of absolute interface inactivity after which the internal list flushes automatically. Set to 0 to never clear. Default 10000.</td><td>integer</td></tr><tr><td></td><td><code>aggregate</code></td><td>Groups matching unique hardware records captured during the scan duration window when set to <code>true</code>. Disables batching and delivers items standalone when <code>false</code>. Default true.</td><td>boolean</td></tr><tr><td></td><td><code>antenna</code></td><td>An optional antenna port index filter number to isolate incoming messages to a single physical port line path.</td><td>integer</td></tr></tbody></table>

#### Output

Returns a confirmation verification status string when successfully mapped.

#### Examples

Example 1: Streaming data delivery without aggregation

```yaml
# name
immediate_reporter
# handler
<callback>
# options
aggregate: false
```

Example 2: Compiled window aggregation

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

Manually clears out the internal tracking message records cached inside a targeted data listener. This utility resets tracking tables instantly without waiting for a structural `clearAfter` timeline threshold to trigger.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The explicit string lookup name of the targeted `onDataEvent` handler cache to flush. Required.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` when the internal storage maps clear completely.

#### Example

```yaml
# name
batch_reporter
```

### `removeDataListener`

Unregisters an operational data tracking listener module and tears down its associated collection timers safely.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The precise registration string label of the target data listener module to destroy. Required.</td><td>string</td></tr></tbody></table>

#### Output

Returns a confirmation string indicating whether the module path was successfully unbound or not found.

#### Example

```yaml
# name
batch_reporter
```

## Tips and tricks

### Operational design parameters
* `SIMPLE` — Baseline tracker profile. Delivers a data event notification immediately for every single tag read signature encountered. Ideal for direct detection routines.
* `INVENTORY` — Optimized for counting assets. Periodically aggregates and delivers full batch summaries of every unique tag identified during the tracking interval along with tracking statistics.
* `PORTAL` — Tailored for entry control doors, sorting gates, or logistical chokepoints. Operates in conjunction with physical sensors or automated triggers to track localized physical item transit bursts.
* `CONVEYOR` — Calibrated for picking up fast-moving targets traveling along high-speed automation line tracks where visibility windows span a fraction of a second.
