# Zebra RFID IoT

This document provides a guide to using the `Zebra` class, a powerful interface for controlling and receiving data from Zebra Fixed RFID readers (e.g., FX7500, FX9600). The class leverages Zebra's modern IoT Connector (ZIOTC) service, which runs on the reader and communicates data over standard IoT protocols like MQTT.

## Architecture Overview

The `Zebra` class is designed to be the final piece in a larger data pipeline. It doesn't communicate with the reader directly over a serial or proprietary connection. Instead, it interacts with Heisenware's internal MQTT message broker, subscribing to topics that the reader's ZIOTC service publishes to, and publishing commands back to the reader.

The flow is as follows:

Zebra RFID Reader -> Zebra IoT Connector (on-reader service) -> Heisenware MQTT Broker -> Your Application (using this `Zebra` class)

{% hint style="success" %}
**Important MQTT Topic Configuration**

For this class to function, you must configure the ZIOTC service on the reader's web interface (under Communication > Zebra IoT Connector) to use specific topic suffixes. The topics you configure must match the ones used by this class, which are constructed as follows:

* Management Event Topic: `<Your Base Topic>/m-evt`
* Data Event Topic: `<Your Base Topic>/d-evt`
* Management Request Topic: `<Your Base Topic>/m-req`&#x20;
* Control Request Topic: `<Your Base Topic>/c-req`&#x20;

On newer versions of the web interface you may be also asked to enter a management and control response topic in those cases use:

* Management Response Topic: `<Your Base Topic>/m-res`&#x20;
* Control Response Topic: `<Your Base Topic>/c-res`
{% endhint %}

## Available Functions

### create

Creates an instance of the Zebra IoT connector interface, which will then connect to the MQTT broker to communicate with a specific reader.

Parameters

* `baseTopic`: The root MQTT topic for the target reader, as configured in its ZIOTC settings. This is required.

Example

```yaml
# baseTopic
<account>/zebra/atr7000/12345
```

### getVersion

Retrieves the reader's firmware and hardware version information.

Output

An object containing version details.

### getNetwork

Retrieves the reader's current network configuration (IP address, MAC address, etc.).

Output

An object containing network details.

### getConfig

Retrieves the reader's entire configuration.

Output

An object containing the full configuration.

### getStatus

Retrieves the reader's current operational status.

Output

An object containing status details.

### getLed

Retrieves the current state of the reader's status LED.

Output

An object describing the LED's color and state.

### getMode

Retrieves the reader's current tag reading mode.

Output

An object describing the mode and its parameters.

### getLogConfiguration

Retrieves the reader's logging configuration.

Output

An object containing logging details.

### setLed

Controls the reader's status LED.

Parameters

* `color`: The desired color. Can be `off`, `red`, `amber`, or `green`.
* `seconds`: The duration in seconds for the LED to be in this state.
* `flash`: A boolean indicating if the LED should flash.

Example

```yaml
# color
green
# seconds
5
# flash
true
```

#### setMode

Sets the mode of operation for the reader. This is a highly detailed function that configures all aspects of a reader's operational mode.

**Parameters**

* `options`: Configuration options for the operation mode.
  * `type`: The type of mode of operation. Defaults to `"SIMPLE"`.
    * **Enum**: `"SIMPLE"`, `"INVENTORY"`, `"PORTAL"`, `"CONVEYOR"`, `"CUSTOM"`, `"DIRECTIONALITY"`
  * `modeSpecificSettings`: Mode-specific settings (e.g., `inventorySettings`, `portalSettings`).
  * `environment`: The type of environment in which the reader operates. Defaults to `"HIGH_INTERFERENCE"`.
    * **Enum**: `"LOW_INTERFERENCE"`, `"HIGH_INTERFERENCE"`, `"VERY_HIGH_INTERFERENCE"`, `"AUTO_DETECT"`, `"DEMO"`
  * `antennas`: Array of integers representing the antenna ports to use. If absent, all ports are used.
  * `filter`: Tag ID filter object. If absent, no filter is used.
  * `transmitPower`: Desired Transmit Power (in dBm). Can be a single number or an array of numbers. Defaults to `27` dBm (or `36` dBm EIRP for ATR).
  * `antennaStopCondition`: Stop condition(s) for antennas. Can be a single object or an array of objects. Defaults to a single inventory round.
  * `query`: Gen2 query parameters object.
  * `selects`: Gen2 select parameters. Array of select objects (applied to all antennas) or an array of arrays (one per antenna).
  * `delayAfterSelects`: Duration in milliseconds (0-65) to wait after the final select before issuing a query.
  * `accesses`: Gen2 access commands (read, write, lock, kill). Can be an array of commands (applied to all antennas) or an array of arrays (one per antenna).
  * `delayBetweenAntennaCycles`: Object defining a delay between antenna cycles if no tags are read.
  * `tagMetaData`: Array of strings or objects to control tag metadata.
    * **Enum strings**: `"ANTENNA"`, `"RSSI"`, `"PHASE"`, `"CHANNEL"`, `"SEEN_COUNT"`, `"PC"`, `"XPC"`, `"CRC"`, `"EPC"`, `"TID"`, `"USER"`, `"MAC"`, `"HOSTNAME"`, `"TAGURI"`, `"EPCURI"`.
    * **Partial reads**: You can request portions of memory banks, e.g., `"EPC[1,3-5]"` to get the first word and words 3 through 5.
    * **Objects**: Can be `{"userDefined": ...}` or `{"antennaNames": ...}`.
  * `radioStartConditions`: Object to control when the radio starts inventorying after a "start" command.
  * `radioStopConditions`: Object to control when an ongoing operation completes.
  * `reportFilter`: Object to control when and how often a tag is reported. **Note**: Cannot be set in "INVENTORY" mode.
  * `rssiFilter`: Object to filter tags by RSSI threshold. **Note**: FX9600 only.
  * `beams`: Array of beam objects to use. **Note**: ATR7000 reader only.

**Example 1: Configure a basic Inventory mode** _Goal: Read on antennas 1 & 2 at 30.1 dBm, stop after 500ms, and report RSSI and PC bits._

```yaml
# options
type: INVENTORY
antennas: [1, 2]
transmitPower: 30.1
antennaStopCondition: [
  { type: DURATION, value: 500 }
]
tagMetaData: ['RSSI', 'PC']
```

**Example 2: Advanced mode with filters and metadata** _Goal: Use PORTAL mode, filter for a specific tag prefix on antenna 1, set environment to low interference, and report EPC, TID, and RSSI._

```yaml
# options
type: PORTAL
environment: LOW_INTERFERENCE
antennas: [1]
transmitPower: 25
filter: {
  prefix: '3008'
}
tagMetaData: ['EPC', 'TID', 'RSSI']
reportFilter: {
  duration: 0 
}
```

Understanding Reader Modes

The `type` parameter in `setMode` is crucial for optimizing reader performance:

* `SIMPLE`: The most basic mode. It reads and reports every unique tag it sees. Good for simple "is this tag present?" applications.
* `INVENTORY`: Optimized for taking stock. The reader periodically reports a list of all unique tags seen during an interval, along with metadata like read counts and signal strength (RSSI).
* `PORTAL`: Designed for dock doors or checkpoints. The reader typically waits for an external trigger (e.g., a motion sensor) to start reading and reports the batch of tags that passed through.
* `CONVEYOR`: Optimized for items moving on a conveyor belt, accurately capturing tags that are in view for only a short period.
* `CUSTOM`: Allows for fine-grained control over low-level radio parameters for advanced scenarios.

### start

Commands the reader to start reading RFID tags. Tag data will be sent via data events.

### stop

Commands the reader to stop reading RFID tags.

### onHeartbeatEvent

Registers a handler to be notified of periodic heartbeat events from the reader, which indicate it is still online.

Parameters

* `name`: A unique name for this handler.
* `handler`: The callback function that will receive the heartbeat event object.

Example

```yaml
# name
heartbeat_checker
# handler
<callback>
```

### onErrorEvent

Registers a handler to be notified of any error events reported by the reader.

Parameters

* `name`: A unique name for this handler.
* `handler`: The callback function that will receive the error event object.

Example

```yaml
# name
error_logger
# handler
<callback>
```

### onDataEvent

Registers a handler to receive RFID tag data. This is the primary method for getting tag reads and includes options for filtering and aggregating data.

Parameters

* `name`: A unique name for this data handler.
* `handler`: The callback function that will receive the tag data.
* `options`: An optional object to configure data handling.
  * `scanDuration`: Time in ms to collect unique tags before reporting them in a single batch. `0` reports tags immediately.
  * `clearAfter`: Time in ms of inactivity after which the internal list of seen tags is cleared.
  * `aggregate`: If `true`, reports a batch of unique tags seen during the `scanDuration`. If `false`, reports every single tag read immediately.
  * `antenna`: If set to an integer, only tags read by that specific antenna will be reported.

Example: Immediate Reporting

```yaml
# name
immediate_reporter
# handler
<callback>
# options
aggregate: false
```

Example: Aggregated Reporting

This will collect all unique tags seen in a 2-second window and then fire the handler with the complete list.

```yaml
# name
batch_reporter
# handler
<callback>
# options
scanDuration: 2000
aggregate: true
```

### clearData

Manually clears the internal cache of seen tags for a specific data handler. This is useful for starting a fresh reading session without waiting for the `clearAfter` timeout.

Parameters

* `name`: The name of the `onDataEvent` handler to clear.

Example

```yaml
# name
batch_reporter
```

Output

Returns true on success.
