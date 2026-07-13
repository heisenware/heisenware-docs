# GPIO counter

The GPIO counter counts digital pulses on a Raspberry Pi's GPIO pins. It interprets signals from sensors (such as inductive proximity sensors, light barriers, or rotary encoders) to track production counts, machine cycles, or flow rates.

Beyond counting, the class monitors the time interval between pulses to automatically determine whether a machine or process is running or stopped. It offers two operation modes:

1. average mode (default): Detects a stop when the time between pulses exceeds the running average by a configurable factor. This adapts dynamically to the speed of the machine.
2. target mode: Detects a stop when the time between pulses exceeds a fixed target interval plus a defined tolerance. Use this for processes with strict cycle times. Target mode is active when both `targetInterval` and `deviation` are set.

This connector requires [instance creation](/app-builder/build-backend/functions/connectors.md#instance-creation) before you can interact with a physical pin, though it includes static utilities for hardware and pin detection.

{% hint style="warning" %}
#### Hardware requirement
This class requires a Raspberry Pi 4 or 5. If no compatible hardware is detected, the class automatically falls back to a simulation mode, letting you test your logic with the `simulatePulse` function.
{% endhint %}

## State machine

The counter operates on an internal state machine. Understanding the states helps with debugging and predicting behavior in production.

<figure><img src="../../../../.gitbook/assets/image (30).png" alt=""><figcaption></figcaption></figure>

### States

* `initialized`: The starting state after `create` or `reset`. The counter remains idle while waiting for the first signal, and no watchdog is active.
* `counting`: The active state. The counter registers pulses, calculates averages, and runs the auto-stop watchdog.
* `stopped`: The process has finished or paused. The counter enters this state automatically when the pulse interval becomes too long, or manually when you call `stop`. The current count is preserved.
* `rebooted`: The counter restored a persisted count after a restart. Pulses are ignored in this state. Call `start` to resume counting.
* `ended`: A terminal state entered via `end`. No further counts are registered and no auto-restart occurs until you call `reset`.

### Transitions

* Auto-start (`initialized` → `counting`): The first pulse on the GPIO pin starts the counter automatically.
* Auto-stop (`counting` → `stopped`): The time since the last pulse exceeded the limit calculated from `stopFactor` or `targetInterval`. This indicates the machine has stopped.
* Continue (`stopped` → `counting`): With `continueAfterStop` set to true, a new pulse automatically resumes counting.
* Manual control: `start` forces `counting`, `stop` forces `stopped`, `end` forces `ended`, and `reset` returns the counter to `initialized`.

### Persistence across restarts

The counter continuously persists its count and averages to a state file on disk. When you create an instance and a state file for that GPIO pin already exists, the connector restores the data and shifts the state to `rebooted`. This prevents data loss during a power outage or an App restart.

## Static functions

These functions manage hardware resources before you create a counter instance.

### `isAccessible`

Checks whether compatible GPIO hardware (Raspberry Pi 4 or 5) is accessible on the current system. Use this for feature detection to avoid errors on unsupported devices.

#### Parameters

None.

#### Output

Returns `true` if compatible hardware is detected, or `false` if it is not.

### `getPinConsumer`

Retrieves the name of the process that currently holds a specific GPIO pin. This helps diagnose resource conflicts when a pin is busy.

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
      <td><code>gpio</code></td>
      <td>The BCM pin number to check.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# gpio
17
```

#### Output

Returns a string containing the consumer name (such as `'gpiod'`), or `null` if the pin is free or the system runs in simulation mode.

### `isPinFree`

Checks whether a specific GPIO pin is currently free to use.

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
      <td><code>gpio</code></td>
      <td>The BCM pin number to check.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

#### Output

Returns `true` if the pin has no active consumer, or `false` if it does.

### `release`

Forcefully releases a specific GPIO pin if an internal driver instance holds it. Use this to recover pins that were not properly disposed of.

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
      <td><code>gpio</code></td>
      <td>The BCM pin number to release.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

#### Output

Returns `true` if the pin was found and released, or `false` if it was not.

## Instance and control

### `create`

Creates a counter instance, initializes the hardware connection or simulation, and configures the counting logic. Providing both `targetInterval` and `deviation` activates target mode; otherwise, the counter runs in average mode.

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
      <td><code>options</code></td>
      <td><code>gpio</code></td>
      <td>The BCM pin number connected to the sensor.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>pullUpDown</code></td>
      <td>Resistor configuration: <code>none</code>, <code>pullup</code>, or <code>pulldown</code>. Default <code>none</code>.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>edge</code></td>
      <td>The signal edge to count: <code>rising</code>, <code>falling</code>, or <code>both</code>. Default <code>rising</code>.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>debounceTimeout</code></td>
      <td>Debounce time in milliseconds to prevent false counts from noisy signals. Default 10.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>activeLow</code></td>
      <td>If true, inverts the logic (useful if your sensor outputs 0 when active). Default false.</td>
      <td>boolean</td>
    </tr>
    <tr>
      <td></td>
      <td><code>minCount</code></td>
      <td>The minimum number of pulses required before the auto-stop watchdog activates. Default 5.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>continueAfterStop</code></td>
      <td>If true, the counter automatically resumes counting when a new pulse arrives after a stop. Default true.</td>
      <td>boolean</td>
    </tr>
    <tr>
      <td></td>
      <td><code>stopFactor</code></td>
      <td>Average mode only: The multiplier applied to the average interval to trigger a stop. Default 2.0.</td>
      <td>number</td>
    </tr>
    <tr>
      <td></td>
      <td><code>targetInterval</code></td>
      <td>Target mode only: The expected cycle time in seconds.</td>
      <td>number</td>
    </tr>
    <tr>
      <td></td>
      <td><code>deviation</code></td>
      <td>Target mode only: The allowed deviation in percent (0 to 100) before a pulse counts as too late.</td>
      <td>number</td>
    </tr>
  </tbody>
</table>

#### Examples

Example 1: Average mode

This counter stops when a pulse takes more than 2.5 times the current average interval.

```yaml
# options
gpio: 17
pullUpDown: pullup
stopFactor: 2.5
minCount: 10
```

Example 2: Target mode

This counter expects a pulse every 5 seconds. It detects a stop when a pulse takes longer than 5.5 seconds (5 seconds plus 10 percent deviation).

```yaml
# options
gpio: 22
targetInterval: 5
deviation: 10
```

#### Output

Returns the counter instance. Throws an error if initialization fails.

### `start`

Manually starts the counting process. The counter normally starts automatically with the first pulse; use this function to force the `counting` state and arm the watchdog before a signal arrives, or to resume counting from the `rebooted` state. This call has no effect while the counter is already counting or in the `ended` state.

#### Parameters

None.

#### Output

Returns nothing.

### `stop`

Manually stops the counting process. This transitions the counter to the `stopped` state and cancels the watchdog while preserving the current count. This call has no effect unless the counter is actively counting.

#### Parameters

None.

#### Output

Returns nothing.

### `end`

Forces the counter into the terminal `ended` state. No further pulses are counted and no auto-restart occurs until you call `reset`. Use this to close a production session definitively.

#### Parameters

None.

#### Output

Returns nothing.

### `reset`

Resets the counter to its initial state by setting the count to 0, clearing all averages, and returning the state to `initialized`. You can optionally pass configuration parameters to update the counting logic during the reset.

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
      <td><code>options</code></td>
      <td><code>minCount</code></td>
      <td>New minimum count parameter.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>stopFactor</code></td>
      <td>New stop factor value (average mode).</td>
      <td>number</td>
    </tr>
    <tr>
      <td></td>
      <td><code>targetInterval</code></td>
      <td>New target interval measured in seconds (target mode).</td>
      <td>number</td>
    </tr>
    <tr>
      <td></td>
      <td><code>deviation</code></td>
      <td>New allowed deviation in percent (target mode).</td>
      <td>number</td>
    </tr>
    <tr>
      <td></td>
      <td><code>continueAfterStop</code></td>
      <td>Whether to resume counting automatically when a new pulse arrives after a stop.</td>
      <td>boolean</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# options
stopFactor: 1.5
```

#### Output '

Returns nothing.

### `dispose`

Releases the hardware resources by freeing the GPIO pin and removes all listeners. Call this function when the counter is no longer needed to prevent hardware conflicts.

#### Parameters

None.

#### Output

Returns nothing.

### `delete`

Removes the counter instance.

{% hint style="danger" %}
#### Irreversible action
Deleting an instance removes its configuration. To count on that pin again, you must trigger `create` anew.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` upon removal.

## Data and events

### `onCount`

Registers a callback that fires every time a valid pulse is counted. This serves as the primary method for receiving data from the counter.

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
      <td><code>callback</code></td>
      <td>Callback that fires on each count. Delivers an object containing metrics like total count and interval delta.</td>
      <td>callback</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# callback
<callback>
```

The callback delivers a JSON object matching this structure:

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

The `avgInterval` property tracks the running average time between pulses in milliseconds, while `delta` measures the exact time elapsed since the previous pulse in milliseconds.

#### Output

Returns nothing.

### `onStateChange`

Registers a callback that fires whenever the counter's state changes, such as from `counting` to `stopped`.

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
      <td><code>callback</code></td>
      <td>Callback that fires on state changes. Delivers an object containing the new and previous states.</td>
      <td>callback</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# callback
<callback>
```

The callback delivers a JSON object matching this structure:

```json
{
  "state": "stopped",
  "previousState": "counting",
  "count": 125,
  "exceededTargetCount": 0,
  "timestamp": 1715605005000
}
```

#### Output

Returns nothing.

### `simulatePulse`

Manually simulates an input pulse. Use this to test your application logic away from the physical hardware. This function only works in simulation mode; real hardware ignores the call and logs a warning.

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
      <td><code>value</code></td>
      <td>The signal value to simulate. Default 1.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# value
1
```

#### Output

Returns nothing. The simulated pulse routes directly through the listener registered with `onCount`.

### `getCount`

Retrieves the current total count.

#### Parameters

None.

#### Output

Returns an integer representing the number of pulses counted so far.

### `getExceededTargetCount`

Retrieves how often the pulse interval exceeded the configured target time. This function applies to target mode only.

#### Parameters

None.

#### Output

Returns an integer representing the total number of exceeded targets.

### `getState`

Retrieves the current state of the counter.

#### Parameters

None.

#### Output

Returns a string representing the current state: `initialized`, `counting`, `stopped`, `rebooted`, or `ended`.

### `getAverageInterval`

Retrieves the current running average time between pulses.

#### Parameters

None.

#### Output

Returns a number representing the average interval in milliseconds.

### `getData`

Retrieves a full metrics snapshot of the counter's current data.

#### Parameters

None.

#### Output

Returns a JSON snapshot containing the counter variables:

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

Retrieves the current configuration parameters of the instance.

#### Parameters

None.

#### Output

Returns a JSON object detailing the configuration fields:

```json
{
  "minCount": 5,
  "stopFactor": 2.0,
  "targetInterval": null,
  "deviation": null,
  "continueAfterStop": true
}
```
