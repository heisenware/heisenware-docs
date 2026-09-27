---
description: "One class for every simulated source: a seeded, declarative time-series engine with ready-made presets."
---

# Signal simulation

The signal simulation class produces the data of a source that is not connected yet: a machine before its OPC UA server is reachable, a site a development tenant mirrors, a load test, a history to seed charts and databases. An instance owns a **simulated clock** and a set of **named signals** declared as JSON. On every tick it evaluates all signals in dependency order and emits one map of name to value. The same configuration and `seed` always produce the same series, and `generate` produces a series for a time range without running. Presets provide complete signal sets (silo, tank, pump, conveyor, machine, CNC machine, energy meter, production orders) that you instantiate as they are, with other parameters, or with your own signals added. This class requires an instance. The code class name is `SignalSimulator`.

{% hint style="info" %}
#### Feeding a sink

Name the signals after what the sink addresses. For the [OPC UA server](../connectors/opc-ua-server.md) use its variable paths or node ids and wire `onTick` to `setValues`; with `emitQuality` the value map carries status codes and timestamps that `setValues` takes as they are. For MQTT publish the map, for a database call `generate` to backfill history, for a widget link a signal directly.
{% endhint %}

## Static functions

Use these functions without creating an instance.

### `listPresets`

Lists the built-in presets.

#### Parameters

None.

#### Output

Returns an array of `{ name, description, params }`, `params` being the defaults the preset takes.

### `preset`

Returns a preset's complete configuration with parameters applied, ready to be edited or passed to `create`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The preset name, see <code>listPresets</code>.</td><td>string</td></tr><tr><td><code>params</code></td><td>Parameter overrides. Optional.</td><td>object</td></tr></tbody></table>

#### Output

Returns `{ preset, description, params, signals }`.

### `reference`

Returns the reference of the engine: clock options, clock variables, expression functions, every signal kind with its parameters, decorators and scenario actions. The tables below are this reference in prose.

#### Parameters

None.

#### Output

Returns the reference object.

### `evaluate`

Evaluates an expression against plain values, to try a formula before putting it in a signal.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>expression</code></td><td>The expression, for example <code>clamp(a * 2, 0, b)</code>.</td><td>string</td></tr><tr><td><code>variables</code></td><td>Values by name. Optional.</td><td>object</td></tr></tbody></table>

#### Output

Returns the result.

#### Examples

```yaml
# expression
state == 'Running' ? speed * 0.8 : 0
# variables
state: Running
speed: 1200
```

Returns `960`.

## Instance functions

You must create an instance to use these functions.

### `create`

Creates a simulation. The configuration given here is what the platform persists, so the instance comes back after a restart as declared.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>preset</code></td><td>Name of a preset whose signals and params form the base. Optional.</td><td>string</td></tr><tr><td></td><td><code>params</code></td><td>Named constants usable in every expression and as <code>${name}</code> in numeric fields; override a preset's params. Optional.</td><td>object</td></tr><tr><td></td><td><code>signals</code></td><td>Signals by name: <code>{ kind, ...kind parameters, ...decorators }</code>, see the tables below. Added to or overriding the preset's signals. Optional.</td><td>object</td></tr><tr><td></td><td><code>seed</code></td><td>Seed of all random streams; every signal draws from its own stream derived from the seed and its name, so a series never changes because another signal was added. Default <code>heisenware</code>.</td><td>string</td></tr><tr><td></td><td><code>tickInterval</code></td><td>Milliseconds between ticks, at least 10. Default <code>1000</code>.</td><td>integer</td></tr><tr><td></td><td><code>timeScale</code></td><td>Simulated time per real time: <code>60</code> is one simulated minute per second, <code>1440</code> a day per minute. Default <code>1</code>.</td><td>number</td></tr><tr><td></td><td><code>startTime</code></td><td>Simulated time of the first tick, ISO string or epoch milliseconds. Default now.</td><td>string</td></tr><tr><td></td><td><code>autoStart</code></td><td>Run the clock right after creation. Default <code>true</code>.</td><td>boolean</td></tr><tr><td></td><td><code>emitQuality</code></td><td>Emit <code>{ value, quality, timestamp }</code> per signal instead of the bare value. Default <code>false</code>.</td><td>boolean</td></tr><tr><td></td><td><code>scenario</code></td><td>Timed actions on the simulated clock: <code>[{ at, action, signal, ... }]</code>, see <code>inject</code>. Optional.</td><td>array</td></tr></tbody></table>

#### Signal kinds

Every signal is `{ kind, ...parameters, ...decorators }`. Durations are milliseconds as a number or strings such as `500ms`, `10s`, `2m`, `1h`, `1d`. Numeric fields also take `${param}` or an expression over params, resolved once at creation.

<table><thead><tr><th width="150">Kind</th><th>Parameters</th><th width="220">Value</th></tr></thead><tbody><tr><td><code>constant</code></td><td><code>value</code>: number, text or boolean.</td><td>The value.</td></tr><tr><td><code>random</code></td><td><code>distribution</code> <code>uniform</code> (<code>low</code>, <code>high</code>) or <code>gaussian</code> (<code>mean</code>, <code>sigma</code>).</td><td>An independent draw per tick.</td></tr><tr><td><code>randomWalk</code></td><td><code>start</code>, <code>step</code> (sigma per tick), <code>mean</code>, <code>reversion</code> (pull toward the mean per second).</td><td>Wanders, reflected at <code>min</code>/<code>max</code>.</td></tr><tr><td><code>sine</code>, <code>triangle</code>, <code>square</code>, <code>sawtooth</code></td><td><code>period</code> (duration), <code>amplitude</code>, <code>center</code>, <code>phase</code> (0-1 of the period), <code>duty</code> (square).</td><td>Periodic in simulated time.</td></tr><tr><td><code>ramp</code></td><td><code>rate</code> per second, <code>start</code>, <code>wrap</code> (between <code>min</code> and <code>max</code>).</td><td>Linear.</td></tr><tr><td><code>integrator</code></td><td><code>input</code> (a signal or expression, a rate per second), <code>gain</code>, <code>initial</code>.</td><td>Accumulates, clamped by <code>min</code>/<code>max</code>.</td></tr><tr><td><code>counter</code></td><td><code>every</code> ticks or <code>onTrigger</code>, <code>increment</code>, <code>start</code>, <code>reset</code> (wrap above <code>max</code>).</td><td>An integer.</td></tr><tr><td><code>lag</code></td><td><code>setpoint</code> (number, signal or expression), <code>timeConstant</code> (duration), <code>initial</code>.</td><td>A first-order response toward the setpoint.</td></tr><tr><td><code>sequence</code></td><td><code>steps: [{ value, duration, jitter }]</code>, <code>loop</code>.</td><td>Each step for its duration.</td></tr><tr><td><code>switch</code></td><td><code>on</code> (a signal), <code>cases: { value of on: value }</code>, <code>default</code>, <code>jitter</code> (re-rolled on every case change).</td><td>A lookup.</td></tr><tr><td><code>stateMachine</code></td><td><code>initial</code>, <code>states: { name: { duration | { min, max }, until, next: name | { name: weight } } }</code>. <code>until</code> is a condition over the previous tick.</td><td>The state name.</td></tr><tr><td><code>pulse</code></td><td><code>rate</code> events per second (Poisson), <code>every</code> ticks, or <code>trigger</code>; <code>width</code> ticks.</td><td>A boolean.</td></tr><tr><td><code>profile</code></td><td><code>points</code> (<code>{ hour: value }</code> or <code>[[hour, value]]</code> over the simulated day, hours 0-24 in UTC), <code>days</code> (<code>{ mon..sun or 0-6: points }</code> for days that differ), <code>interpolate</code> <code>linear</code> or <code>step</code>.</td><td>The value at the clock's hour of the day; follows <code>seek</code>.</td></tr><tr><td><code>replay</code></td><td><code>samples</code> (<code>[value]</code> spaced by <code>interval</code>, or <code>[[time, value]]</code>) or <code>file</code> (a CSV in the <a href="../../file-explorer.md">File Explorer</a> such as <code>uploads/line4.csv</code>, with <code>column</code>, <code>timeColumn</code>, <code>delimiter</code>, <code>header</code>), <code>loop</code>, <code>interpolate</code>.</td><td>The recorded sample at the simulated time; loops over the recording or holds the last sample.</td></tr><tr><td><code>expression</code></td><td><code>expr</code>: a formula over signals, params and clock variables.</td><td>The result.</td></tr></tbody></table>

#### Decorators

Any signal takes these, applied in this order: `scale` (multiply), `offset` (add), `noise` (an amplitude, or `{ distribution: gaussian | uniform, amplitude }`), `spikes` (a probability, or `{ probability, magnitude }`), `min`/`max` (clamp), `quantize` (step size), an injected fault, `stuck` (a probability, or `{ probability, ticks }`), `dropout` (probability of quality `Bad`, value held), `precision` (decimals), `type` (`number`, `integer`, `boolean`, `string`). Informational: `unit`, `description`. `deadband` makes `onSignal` fire only when the value moved by more than it.

#### Expressions

Operators `+ - * / % ^`, comparisons, `and or not`, the ternary `c ? a : b` and parentheses. Functions: `abs min max clamp round floor ceil sqrt pow exp log log10 sin cos tan atan2 sign lerp step smoothstep if number string len`, per signal `random(low, high)`, `gaussian(mean, sigma)`, `chance(p)`, and history `prev(x)`, `delta(x)` and `elapsed(x)` (seconds since a signal last changed; for a state machine, the time in its state). Names: signals, params, the clock variables `t` (seconds since the start), `dt` (seconds per tick), `tick`, `time` (epoch milliseconds), `hour` (0-24, UTC), `weekday` (0 = Sunday, UTC), and the constants `pi`, `e`. A name that is not an identifier, such as an OPC UA node id, goes in backticks. Dependencies come from the names an expression reads; a cycle is refused by name, and the history functions read without creating a dependency, so a signal can read itself or a later one through them.

#### Output

Returns the simulation instance. With `autoStart` the clock is running.

#### Examples

**A preset with other parameters**

```yaml
# options
preset: pump
params:
  nominalFlow: 80
  nominalPressure: 8
seed: line-4
```

**Own signals: an oven chasing a setpoint that a state machine switches**

```yaml
# options
tickInterval: 1000
signals:
  phase:
    kind: stateMachine
    initial: heating
    states:
      heating: { until: "temperature >= 180", next: holding }
      holding: { duration: 10m, next: cooling }
      cooling: { until: "temperature <= 40", next: heating }
  setpoint:
    kind: switch
    on: phase
    cases: { heating: 200, holding: 200, cooling: 20 }
  temperature:
    kind: lag
    setpoint: setpoint
    timeConstant: 3m
    initial: 20
    noise: 0.3
    min: 0
    max: 250
    precision: 1
    unit: °C
  doorOpen:
    kind: pulse
    rate: 0.005
    width: 20
```

**A day per minute with a scripted fault**

```yaml
# options
preset: energyMeter
timeScale: 1440
startTime: 2026-09-14T00:00:00Z
scenario:
  - { at: 30s, action: inject, signal: power, fault: dropout, duration: 2h }
  - { at: 45s, action: set, signal: gas, value: 0 }
  - { at: 50s, action: release, signal: gas }
```

### `start`

Starts the clock. A running clock stays as it is.

#### Parameters

None.

#### Output

Returns `true`.

### `stop`

Stops the clock, rewinds the simulated time to the start and rebuilds every signal from its configuration.

#### Parameters

None.

#### Output

Returns `true`.

### `pause`

Freezes the clock; values stay where they are.

#### Parameters

None.

#### Output

Returns `true`.

### `resume`

Continues a paused clock.

#### Parameters

None.

#### Output

Returns `true`.

### `step`

Advances the simulation by a number of ticks right away, in any state; listeners fire for every tick.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>n</code></td><td>The number of ticks. Default <code>1</code>.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the values after the last tick, as `getValues`.

### `seek`

Moves the simulated clock to a point in time without evaluating the ticks in between; profiles and replays follow the new time.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>time</code></td><td>An ISO string, epoch milliseconds, or a duration after the start such as <code>2h</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns the new time as `getTime`.

### `getState`

#### Parameters

None.

#### Output

Returns `stopped`, `running` or `paused`.

### `getTime`

#### Parameters

None.

#### Output

Returns `{ time, t, tick }`: the simulated time as an ISO string, the simulated seconds since the start and the tick count.

### `getValues`

#### Parameters

None.

#### Output

Returns the current value of every signal by name (or `{ value, quality, timestamp }` per signal with `emitQuality`). Before the first tick these are the start values.

### `getValue`

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The signal name.</td><td>string</td></tr></tbody></table>

#### Output

Returns the signal's current value.

### `set`

Holds a signal at a value until `release`, the PLC "force".

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The signal name.</td><td>string</td></tr><tr><td><code>value</code></td><td>The value to hold.</td><td>any</td></tr></tbody></table>

#### Output

Returns `true`.

### `release`

Returns a forced signal to its generator.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The signal name.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true`.

### `trigger`

Fires a `pulse` or increments a `counter` that counts triggers.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The signal name.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true`.

### `setState`

Moves a state machine into a state.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The signal name.</td><td>string</td></tr><tr><td><code>state</code></td><td>The target state.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true`.

### `inject`

Injects a fault into a signal for a while. The same faults run scripted through the `scenario` option, whose entries are `{ at, action, signal, ... }` with the actions `set`, `release`, `trigger`, `setState`, `inject`, `addSignal`, `updateSignal`, `removeSignal`, `pause`, `resume` and `stop`, and `at` a duration after the start or an ISO time.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td></td><td>The signal name.</td><td>string</td></tr><tr><td><code>fault</code></td><td><code>fault</code></td><td><code>spike</code>, <code>dropout</code> (quality <code>Bad</code>, value held), <code>stuck</code> (frozen) or <code>drift</code> (moves away linearly).</td><td>string</td></tr><tr><td></td><td><code>duration</code></td><td>How long, in simulated time. Default <code>10s</code>.</td><td>string</td></tr><tr><td></td><td><code>magnitude</code></td><td>The added value of a spike, or the value reached at the end of a drift. Default <code>1</code>.</td><td>number</td></tr></tbody></table>

#### Output

Returns `true`.

### `addSignal`

Adds a signal to the running simulation.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The signal name.</td><td>string</td></tr><tr><td><code>config</code></td><td><code>{ kind, ... }</code> as in <code>create</code>.</td><td>object</td></tr></tbody></table>

#### Output

Returns `true`.

### `updateSignal`

Replaces a signal's configuration; its state starts over.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The signal name.</td><td>string</td></tr><tr><td><code>config</code></td><td><code>{ kind, ... }</code> as in <code>create</code>.</td><td>object</td></tr></tbody></table>

#### Output

Returns `true`.

### `removeSignal`

Removes a signal. Refused while another signal depends on it.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The signal name.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true`.

### `describe`

Describes the simulation: state, last error, clock, params, and every signal with its kind, type, unit, range, dependencies, current value and quality. The `config` of each signal is the configuration to copy into a new instance.

#### Parameters

None.

#### Output

Returns the description.

### `generate`

Produces the series for a time range without touching the running simulation, for seeding databases, charts and histories.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>from</code></td><td>The start, ISO string or epoch milliseconds.</td><td>string</td></tr><tr><td></td><td><code>to</code></td><td>The end, ISO string, epoch milliseconds, or a duration after <code>from</code> such as <code>1d</code>.</td><td>string</td></tr><tr><td></td><td><code>step</code></td><td>Simulated time between rows. Default one tick.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of `{ time, <signal>: value, ... }`, at most 100,000 rows.

#### Examples

```yaml
# options
from: 2026-09-01T00:00:00Z
to: 7d
step: 15m
```

### `onTick`

Subscribes to the tick event.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback function. <br>Payload: <code>values</code> (every signal by name), <code>time</code> (the simulated time, ISO) and <code>changed</code> (the names whose value changed on this tick).</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed`.

### `offTick`

Removes a listener given to `onTick`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The listener to remove.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `true` when the listener was subscribed, otherwise `false`.

### `onSignal`

Subscribes to one signal: every tick, or only when the value moved by more than the signal's `deadband`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The signal name.</td><td>string</td></tr><tr><td><code>listener</code></td><td>The callback function. <br>Payload: <code>value</code> and <code>time</code> (the simulated time, ISO).</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed`.

### `offSignal`

Removes a listener given to `onSignal`, from one signal or from every signal it listens to.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The signal name. Optional: without it, the listener leaves every signal.</td><td>string</td></tr><tr><td><code>listener</code></td><td>The listener to remove.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `true` when the listener was subscribed, otherwise `false`.

## Presets

A preset is a complete, parametric signal set. Instantiate it by name, change its `params`, and add or override `signals`. `preset` returns the configuration to start your own from.

<table><thead><tr><th width="160">Preset</th><th>Params</th><th>Signals</th></tr></thead><tbody><tr><td><code>silo</code></td><td><code>capacity</code>, <code>timeToEmpty</code>, <code>variance</code></td><td><code>phase</code> (emptying, refilling), <code>rate</code>, <code>level</code>: drains at a slightly random rate and refills fast below 10 %.</td></tr><tr><td><code>tank</code></td><td><code>capacity</code>, <code>inflowRate</code>, <code>outflowRate</code></td><td><code>valve</code> (open below 20 %, closed above 90 %), <code>inflow</code>, <code>outflow</code>, <code>level</code>, <code>fill</code>.</td></tr><tr><td><code>pump</code></td><td><code>nominalFlow</code>, <code>nominalPressure</code>, <code>efficiency</code>, <code>faultShare</code></td><td><code>state</code> (running, stopped, fault), <code>flowTarget</code>, <code>flow</code>, <code>pressure</code>, <code>power</code>, <code>vibration</code>.</td></tr><tr><td><code>conveyor</code></td><td><code>beltSpeed</code>, <code>partSpacing</code>, <code>nominalCurrent</code></td><td><code>state</code> (running, stopped), <code>speedTarget</code>, <code>speed</code>, <code>part</code> (true when a part passes the sensor), <code>partCount</code>, <code>motorCurrent</code>.</td></tr><tr><td><code>machine</code></td><td><code>cycleTime</code>, <code>ambient</code>, <code>faultShare</code></td><td>The minimal generic machine: <code>state</code> (running, idle, fault), <code>loadTarget</code>, <code>load</code>, <code>temperature</code>, <code>progress</code>, <code>partCount</code>.</td></tr><tr><td><code>cncMachine</code></td><td><code>programName</code>, <code>programSeconds</code>, <code>maxSpindleSpeed</code>, <code>programSpeed</code>, <code>programFeed</code>, <code>toolCount</code>, <code>toolSeconds</code>, <code>travelX</code>, <code>travelY</code>, <code>travelZ</code>, <code>interruptShare</code></td><td>What the <a href="../connectors/heidenhain-opc-ua.md">Heidenhain connector</a> reports: <code>programState</code> (Running, Ended, Interrupted), <code>operatingMode</code> (Automatic, Manual), <code>programName</code>, <code>feedOverride</code>, <code>speedOverride</code> (0-150 %), <code>rapidOverride</code> (0-100 %), <code>blockFeed</code>, <code>feedRate</code>, <code>spindleSpeed</code>, <code>cutterX</code>, <code>cutterY</code>, <code>cutterZ</code>, <code>toolChanges</code>, <code>toolDatabaseId</code>, <code>toolIdentifier</code>, <code>toolName</code>, <code>programExecutionTime</code>, <code>machineUpTime</code>, <code>activeErrors</code>, <code>partCount</code>.</td></tr><tr><td><code>injectionMoulding</code></td><td>machine and order master data, the phase times (<code>closeTime</code>, <code>injectionTime</code>, <code>holdTime</code>, <code>coolingTime</code>, <code>dosingTime</code>, ...), <code>operatorPause</code>, screw and mould geometry, <code>peakPressure</code>, <code>holdingPressure</code>, <code>clampForceSet</code>, counters, temperatures, energy</td><td>An injection moulding machine at <code>tickInterval: 10</code>: <code>phase</code> (Idle, Close, Lock, Approach, Injection, Hold, Cooling with <code>dosing</code>, Unlock, Open, Eject, Pause), 20 high-speed curves (<code>screwPosition</code>, <code>injectionPressure</code>, <code>clampForce</code>, <code>mouldPosition</code>, torques, speeds, ejector, ...), 32 events holding the machine's millisecond tick of their last occurrence (<code>cycleStart</code>, <code>injectionStart</code>, <code>dosingEnd</code>, ...), 21 cyclic KPIs published when the machine publishes them (<code>kpiInjectionPressureMax</code> after injection end, <code>kpiClampForceMax</code> and the cycle counter at unlock, the dosing KPIs 0.2 s into the next cycle's injection), production data and counters, machine information, temperatures and set values. Feed it through a <a href="../storage/buffer.md">Buffer</a> to write one packet per 100 ms.</td></tr><tr><td><code>energyMeter</code></td><td><code>annualPower</code>, <code>annualGas</code>, <code>annualWater</code>, <code>noise</code></td><td>Daily profiles sized by the annual figures: <code>power</code> (kW), <code>gas</code>, <code>water</code> (m³/h) and the totals <code>powerTotal</code> (kWh), <code>gasTotal</code>, <code>waterTotal</code> (m³).</td></tr><tr><td><code>productionOrders</code></td><td><code>ordersPerHour</code>, <code>completionsPerHour</code>, <code>firstOrderNumber</code>, <code>minQuantity</code>, <code>maxQuantity</code>, <code>minLeadHours</code>, <code>maxLeadHours</code></td><td>Orders as an ERP exports them, arriving on a minute scale: <code>newOrder</code> (true on the tick one arrives), <code>orderCount</code>, and the latest order's <code>orderId</code>, <code>material</code>, <code>quantity</code>, <code>workCenter</code>, <code>priority</code>, <code>releasedAt</code>, <code>dueAt</code>, which hold until the next order; <code>orderDone</code>, <code>openOrders</code>, <code>completedOrders</code>. React to <code>onSignal(newOrder)</code> to store each order; replay a real export with the <code>replay</code> kind.</td></tr></tbody></table>

Every preset instantiates with its defaults and keeps every signal inside its declared range; the unit tests check that for 500 ticks.
