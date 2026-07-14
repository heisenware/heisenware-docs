# Process simulations

The process simulations extension models industrial equipment behaviors, machine profiles, and utilities dynamics. Use these nodes to feed synthetic workflows into data grids, charts, and databases before connecting live physical machinery. This class requires an instance. The code class identifier maps to individual simulator models.

## Energy consumption simulation

The `EnergySimulator` class models continuous household or factory utilities usage (power, gas, and hot water) using cyclical sine wave rhythms combined with dynamic noise variations.

### `create`

Initializes an energy simulator model targeting explicit annual baselines.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>config</code></td><td><code>power</code></td><td>Target annual power consumption in kilowatt-hours (kWh).</td><td>integer</td></tr><tr><td></td><td><code>gas</code></td><td>Target annual gas volume consumption in cubic meters (m³).</td><td>integer</td></tr><tr><td></td><td><code>water</code></td><td>Target annual hot water volume consumption in cubic meters (m³).</td><td>integer</td></tr></tbody></table>

#### Output

Returns the simulation instance. The background loop starts automatically.

#### Examples

```yaml
# config
power: 4500
gas: 1200
water: 90
```

### `start`

Resumes the background calculations updater loop.

#### Parameters

None.

#### Output

Returns `true` when execution resumes.

### `stop`

Freezes current values and pauses the updater background loop.

#### Parameters

None.

#### Output

Returns `true` when execution pauses.

### `getLiveValue`

Returns the instantaneous usage rate for a chosen media utility.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>mediaType</code></td><td>The targeted utility name. Must be <code>power</code>, <code>gas</code>, or <code>water</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns a number representing the immediate consumption rate:
* **Power**: Kilowatts (kW)
* **Gas**: Cubic meters per hour (m³/h)
* **Water**: Cubic meters per hour (m³/h)

#### Examples

```yaml
# mediaType
power
```

### `getAggregatedValue`

Returns the total accumulated consumption volume logged since instance launch.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>mediaType</code></td><td>The targeted utility name. Must be <code>power</code>, <code>gas</code>, or <code>water</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns a number tracking cumulative metrics:
* **Power**: Kilowatt-hours (kWh)
* **Gas**: Cubic meters (m³)
* **Water**: Cubic meters (m³)

## Machine simulation

The `MachineSimulator` class reproduces a standard CNC milling station, fluctuating real-time operational telemetry (including speed, load, and internal temperatures) while processing order backlogs.

### `create`

Constructs a simulated CNC equipment identity profile.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>config</code></td><td><code>id</code></td><td>Unique serial or station string ID.</td><td>string</td></tr><tr><td></td><td><code>name</code></td><td>Human-readable display name string.</td><td>string</td></tr><tr><td></td><td><code>model</code></td><td>Equipment model designation. Default <code>Generic-CNC</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns the machine simulation instance.

#### Examples

```yaml
# config
id: cnc-042
name: 5-Axis Miller
model: Mazak-X5
```

### `connect`

Spins up internal runtime loops, transitioning device telemetry states from offline baselines into live operational parameters.

#### Parameters

None.

#### Output

Returns `true`.

### `disconnect`

Shuts down active cycles, resetting spindle metrics to zero and cooling temperatures back to room ambient baselines.

#### Parameters

None.

#### Output

Returns `true`.

### `getData`

Returns a unified state record combining active job specifics with raw sensor diagnostics.

#### Parameters

None.

#### Output

Returns a flat payload object tracking running characteristics.

Example payload:
```json
{
  "id": "cnc-042",
  "name": "5-Axis Miller",
  "model": "Mazak-X5",
  "timestamp": "2026-02-19T10:25:14.000Z",
  "status": "RUNNING",
  "spindleSpeed": 11950.4,
  "feedRate": 1495.2,
  "temperature": 64.8,
  "powerLoad": 76.1,
  "currentOrderId": "ORD-8392",
  "operationId": "OP-45",
  "partName": "Flange-X9",
  "targetQuantity": 45,
  "completedQuantity": 12,
  "cycleTime": 4,
  "lastCycleStart": 1708338310000
}
```

## Silo fill level simulation

The `SiloSimulator` class outputs an ongoing depletion lifecycle. Material content gradually drains until crossing a low 10% safety threshold, automatically engaging a rapid recharge process.

### `create`

Defines physical volume boundaries and consumption speeds.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>capacity</code></td><td>The maximum structural mass or volume capacity. Default 100.</td><td>integer</td></tr><tr><td></td><td><code>timeToEmpty</code></td><td>Duration in seconds required to deplete content from full capacity down to the 10% target threshold. Default 60.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the silo simulation instance.

#### Examples

```yaml
# options
capacity: 500
timeToEmpty: 300
```

### `start`

Engages depletion cycles and kicks off regular telemetry broadcasts.

### `stop`

Halts processing routines.

### `getLevel`

Returns the immediate quantitative volume level state manually.

#### Output

Returns the level metric as an integer or float.

### `onLevelUpdate`

Fires update events repeatedly every second during active operations.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>callback</code></td><td>The callback function. <br>Payload: current volume level.</td><td>callback</td></tr></tbody></table>

#### Output

Returns nothing.
