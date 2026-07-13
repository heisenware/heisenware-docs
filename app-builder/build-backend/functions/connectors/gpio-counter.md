# GPIO counter

The GPIO counter counts digital pulses on a Raspberry Pi's GPIO pins. It interprets signals from sensors (like inductive proximity sensors, light barriers, or rotary encoders) to track production counts, machine cycles, or flow rates.

Beyond counting, the class monitors the time interval between pulses to automatically determine whether a machine or process is running or stopped. It offers two operation modes:

1. Average mode (default): Detects a stop when the time between pulses exceeds the running average by a configurable factor. This adapts dynamically to the speed of the machine.
2. Target mode: Detects a stop when the time between pulses exceeds a fixed target interval plus a defined tolerance. Use this for processes with strict cycle times. Target mode is active when both `targetInterval` and `deviation` are set.

{% hint style="warning" %}
#### Hardware requirement

This class requires a Raspberry Pi 4 or 5. If no compatible hardware is detected, the class automatically falls back to a simulation mode, letting you test your logic with the `simulatePulse` function.
{% endhint %}

## State machine

The counter operates on an internal state machine. Understanding the states helps with debugging and predicting the behavior in production.

<figure><img src="../../../../.gitbook/assets/image (30).png" alt=""><figcaption></figcaption></figure>

### States

* `initialized`: The starting state after `create` or `reset`. The counter is idle, waiting for the first signal. No watchdog is active.
* `counting`: The active state. The counter registers pulses, calculates averages, and runs the auto-stop watchdog.
* `stopped`: The process has finished or paused. Entered automatically when the pulse interval becomes too long, or manually via `stop`. The count is preserved.
* `rebooted`: The counter restored a persisted count after a restart. Pulses are ignored in this state; call `start` to resume counting.
* `ended`: A terminal state entered via `end`. No further counts are registered and no auto-restart occurs until you call `reset`.

### Transitions

* Auto-start (`initialized` → `counting`): The very first pulse on the GPIO pin starts the counter automatically.
* Auto-stop (`counting` → `stopped`): The time since the last pulse exceeded the limit calculated from `stopFactor` or `targetInterval`. This usually means the machine has stopped.
* Continue (`stopped` → `counting`): With `continueAfterStop: true`, a new pulse automatically resumes counting.
* Manual control: `start` forces `counting`, `stop` forces `stopped`, `end` forces `ended`, and `reset` returns to `initialized`.

### Persistence across restarts

The counter continuously persists its count and averages to a state file on disk. When an instance is created and a state file for the GPIO pin exists, the data is restored and the state becomes `rebooted`. This way a power cut or App restart does not lose your production count.

## Static functions

These functions manage hardware resources before you create a counter instance.

### `isAccessible`

Checks whether compatible GPIO hardware (Raspberry Pi 4 or 5) is accessible on the current system. Useful for feature detection to avoid errors on unsupported devices.

#### Parameters

None.

#### Output

Returns `true` if compatible hardware is detected, otherwise `false`.

### `getPinConsumer`

Retrieves the name of the process that currently holds a specific GPIO pin. Helps diagnose resource conflicts when a pin is busy.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>gpio</code></td><td>The BCM pin number to check.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# gpio
17
```

#### Output

A string with the consumer name (e.g. `'gpiod'`), or `null` if the pin is free or the system runs in simulation mode.

### `isPinFree`

Checks whether a specific GPIO pin is currently free to use.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>gpio</code></td><td>The BCM pin number to check.</td><td>integer</td></tr></tbody></table>

#### Output

Returns `true` if the pin has no active consumer, otherwise `false`.

### `release`

Forcefully releases a specific GPIO pin if an internal driver instance holds it. Use this to recover pins that were not properly disposed of.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>gpio</code></td><td>The BCM pin number to release.</td><td>integer</td></tr></tbody></table>

#### Output

Returns `true` if the pin was found and released, otherwise `false`.

## Instance and control

### `create`

Creates a counter instance. This initializes the hardware connection (or the simulation) and configures the counting logic. The parameter combination determines the mode: providing both `targetInterval` and `deviation` activates target mode, otherwise the counter runs in average mode.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>gpio</code></td><td>The BCM pin number connected to the sensor. Required.</td><td>integer</td></tr><tr><td></td><td><code>pullUpDown</code></td><td>Resistor configuration: <code>none</code>, <code>pullup</code>, or <code>pulldown</code>. Default <code>none</code>.</td><td>string</td></tr><tr><td></td><td><code>edge</code></td><td>The signal edge to count: <code>rising</code>, <code>falling</code>, or <code>both</code>. Default <code>rising</code>.</td><td>string</td></tr><tr><td></td><td><code>debounceTimeout</code></td><td>Debounce time in milliseconds to prevent false counts from noisy signals. Default <code>10</code>.</td><td>integer</td></tr><tr><td></td><td><code>activeLow</code></td><td>If <code>true</code>, inverts the logic (useful if your sensor outputs 0 when active). Default <code>false</code>.</td><td>boolean</td></tr><tr><td></td><td><code>minCount</code></td><td>The minimum number of pulses required before the auto-stop watchdog activates. Default <code>5</code>.</td><td>integer</td></tr><tr><td></td><td><code>continueAfterStop</code></td><td>If <code>true</code>, the counter automatically resumes counting when a new pulse arrives after a stop. Default <code>true</code>.</td><td>boolean</td></tr><tr><td></td><td><code>stopFactor</code></td><td>Average mode only: The multiplier applied to the average interval to trigger a stop. Default <code>2.0</code>.</td><td>number</td></tr><tr><td></td><td><code>targetInterval</code></td><td>Target mode only: The expected cycle time in seconds.</td><td>number</td></tr><tr><td></td><td><code>deviation</code></td><td>Target mode only: The allowed deviation in percent (0 to 100) before a pulse counts as too late.</td><td>number</td></tr></tbody></table>

#### Examples

Example 1: Average mode

This counter on GPIO 17 stops when a pulse takes more than 2.5 times the current average interval.

```yaml
# options
gpio: 17
pullUpDown: pullup
stopFactor: 2.5
minCount: 10
```

Example 2: Target mode

This counter on GPIO 22 expects a pulse every 5 seconds. It detects a stop when a pulse takes longer than 5.5 seconds (5 s plus 10 % deviation).

```yaml
# options
gpio: 22
targetInterval: 5
deviation: 10
```

### `start`

Manually starts the counting process. Normally the counter starts automatically with the first pulse; use this to force the `counting` state and arm the watchdog before a signal arrives, or to resume counting from the `rebooted` state.

Has no effect while the counter is already counting or in the `ended` state (call `reset` first).

#### Parameters

None.

#### Output

Nothing.

### `stop`

Manually stops the counting process. Transitions to `stopped` and cancels the watchdog. The current count is preserved. Has no effect unless the counter is counting.

#### Parameters

None.

#### Output

Nothing.

### `end`

Forces the counter into the terminal `ended` state. No further pulses are counted and no auto-restart occurs until you call `reset`. Use this to close a production session definitively.

#### Parameters

None.

#### Output

Nothing.

### `reset`

Resets the counter to its initial state: The count becomes 0, all averages clear, and the state returns to `initialized`. Optionally pass configuration parameters to update the counting logic during the reset.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>minCount</code></td><td>New minimum count.</td><td>integer</td></tr><tr><td></td><td><code>stopFactor</code></td><td>New stop factor (average mode).</td><td>number</td></tr><tr><td></td><td><code>targetInterval</code></td><td>New target interval in seconds (target mode).</td><td>number</td></tr><tr><td></td><td><code>deviation</code></td><td>New deviation in percent (target mode).</td><td>number</td></tr><tr><td></td><td><code>continueAfterStop</code></td><td>Whether to resume counting automatically after a stop.</td><td>boolean</td></tr></tbody></table>

#### Example

Reset and switch to a stricter stop factor:

```yaml
# options
stopFactor: 1.5
```

#### Output

Nothing.

### `dispose`

Releases the hardware resources (frees the GPIO pin) and removes all listeners. Call this when the counter is no longer needed to prevent hardware conflicts.

#### Parameters

None.

#### Output

Nothing.

### `delete`

Removes the instance.

{% hint style="danger" %}
Deleting an instance removes its configuration. To count on that pin again, trigger `create` anew.
{% endhint %}

## Data and events

### `onCount`

Registers a callback that fires every time a valid pulse is counted. This is the primary way to receive data from the counter.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>callback</code></td><td>Callback that receives a data object on each count.</td><td>callback</td></tr></tbody></table>

#### Callback payload

```json
{
  "count": 125,
  "exceededTargetCount": 0,
  "avgInterval": 1500.5,
  "delta": 1498,
  "timestamp": 1715605000123,
  "gpio": 17
}
```

`avgInterval` is the running average time between pulses in milliseconds; `delta` is the time since the previous pulse in milliseconds.

### `onStateChange`

Registers a callback that fires whenever the counter's state changes (e.g. from `counting` to `stopped`).

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>callback</code></td><td>Callback that receives a state object on each change.</td><td>callback</td></tr></tbody></table>

#### Callback payload

```json
{
  "state": "stopped",
  "previousState": "counting",
  "count": 125,
  "exceededTargetCount": 0,
  "timestamp": 1715605005000
}
```

### `simulatePulse`

Manually simulates an input pulse. Useful for testing your application logic away from the physical hardware. Only works in simulation mode; on real hardware the call is ignored with a warning in the logs.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The signal value to simulate. Default <code>1</code>.</td><td>integer</td></tr></tbody></table>

#### Output

Nothing. The pulse arrives through the listener registered with `onCount`.

### `getCount`

Retrieves the current total count.

#### Output

An integer with the number of pulses counted so far.

### `getExceededTargetCount`

Retrieves how often the pulse interval exceeded the configured target time (target mode only).

#### Output

An integer with the number of exceeded targets.

### `getState`

Retrieves the current state of the counter.

#### Output

A string: `initialized`, `counting`, `stopped`, `rebooted`, or `ended`.

### `getAverageInterval`

Retrieves the current running average time between pulses.

#### Output

A number with the average interval in milliseconds.

### `getData`

Retrieves a snapshot of the counter's current data.

#### Output

```json
{
  "state": "counting",
  "count": 500,
  "exceededTargetCount": 0,
  "avgInterval": 1200.5,
  "targetInterval": 1.2
}
```

### `getConfiguration`

Retrieves the current configuration of the instance.

#### Output

```json
{
  "minCount": 5,
  "stopFactor": 2.0,
  "targetInterval": null,
  "deviation": null,
  "continueAfterStop": true
}
```
