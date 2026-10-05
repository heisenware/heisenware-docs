# GPIO counter

The GPIO counter counts digital pulses on a Raspberry Pi's GPIO pins. It interprets signals from sensors (such as inductive proximity sensors, light barriers, or rotary encoders) to track production counts, machine cycles, or flow rates.

Beyond counting, the class monitors the time interval between pulses to automatically determine whether a machine or process is running or stopped. It offers two operation modes:

1. average mode (default): Detects a stop when the time between pulses exceeds the running average by a configurable factor. The average covers the latest intervals only (`averageWindow`), so it follows a machine whose pace drifts during a run; `relearn` starts it anew after a sudden change of pace.
2. target mode: Detects a stop when the time between pulses exceeds a fixed target interval plus a defined tolerance. Use this for processes with strict cycle times. Target mode is active when both `targetInterval` and `deviation` are set.

Nothing the counter sees gets lost. Every event - a count, a state change, a restart - goes out on one stream, numbered without gaps and journaled on the device's disk, so whatever a listener missed while the network was down or the platform restarted can be fetched afterwards with `getEvents`. The count and the averages persist as well: a counter that restarts counts on where it was.

This connector requires [instance creation](README.md#instance-creation) before you can interact with a physical pin, though it includes static utilities for hardware and pin detection.

{% hint style="warning" %}
#### Hardware requirement

This class requires a Raspberry Pi 4 or 5. If no compatible hardware is detected, the class automatically falls back to a simulation mode, letting you test your logic with the `simulatePulse` function.
{% endhint %}

## State machine

The counter operates on an internal state machine. Understanding the states helps with debugging and predicting behavior in production.

### States

* `initialized`: The starting state after `create` or `reset`. The counter waits for the first signal, and no watchdog is active.
* `counting`: The active state. The counter registers pulses, calculates averages, and runs the auto-stop watchdog.
* `stopped`: The process has finished or paused. The counter enters this state automatically when the pulse interval becomes too long, or manually when you call `stop`. The current count is preserved.
* `ended`: A terminal state entered via `end`. No further counts are registered and no auto-restart occurs until you call `reset`.

### Transitions

* Auto-start (`initialized` → `counting`): The first pulse on the GPIO pin starts the counter automatically.
* Auto-stop (`counting` → `stopped`): The time since the last pulse exceeded the limit calculated from `stopFactor` or `targetInterval`. This indicates the machine has stopped.
* Continue (`stopped` → `counting`): With `continueAfterStop` set to true, a new pulse automatically resumes counting. With false, pulses are ignored while stopped.
* Manual control: `start` forces `counting`, `stop` forces `stopped`, `end` forces `ended`, and `reset` returns the counter to `initialized`.

The first pulse after a start or a stop is the reference for the next one: it is counted, but the time before it is not learned as a cycle interval.

### Persistence across restarts

The counter writes its state, count and averages to a state file on disk after every change; the journal (below) is the truth and the state file its snapshot. When an instance is created and a state file or journal for that GPIO pin exists - the agent restarted, the host lost power - the counter restores the snapshot, brings it up to the journal, and counts on in the state it was in: no pulse is ignored because of a restart. It records a `restart` event, and if it was counting, it arms the watchdog at once, so a machine that stopped meanwhile shows as stopped soon.

### The event journal

Every event carries `seq`, a number that counts all events of the counter without gaps, and is appended to a journal file next to the state file and forced onto the disk before anyone hears of it: a power cut can take a pulse that was just being written, never an event a listener already received, so a restarted counter never issues a `seq` twice. The journal keeps at least `journalSize` events (50,000 by default, several days of production at one pulse per few seconds). A consumer remembers the last `seq` it handled; when an event arrives with a `seq` that skips numbers, or the agent comes back online, it calls `getEvents` with that `seq` and receives exactly what it missed. Handling an event twice is harmless when the consumer keys what it stores by `seq`.

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

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>gpio</code></td><td>The BCM pin number to check.</td><td>integer</td></tr></tbody></table>

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

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>gpio</code></td><td>The BCM pin number to check.</td><td>integer</td></tr></tbody></table>

#### Output

Returns `true` if the pin has no active consumer, or `false` if it does.

### `release`

Forcefully releases a specific GPIO pin if an internal driver instance holds it. Use this to recover pins that were not properly disposed of.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>gpio</code></td><td>The BCM pin number to release.</td><td>integer</td></tr></tbody></table>

#### Output

Returns `true` if the pin was found and released, or `false` if it was not.

## Instance and control

### `create`

Creates a counter instance, initializes the hardware connection or simulation, and configures the counting logic. Providing both `targetInterval` and `deviation` activates target mode; otherwise, the counter runs in average mode.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>gpio</code></td><td>The BCM pin number connected to the sensor.</td><td>integer</td></tr><tr><td></td><td><code>pullUpDown</code></td><td>Resistor configuration: <code>none</code>, <code>pullup</code>, or <code>pulldown</code>. Default <code>none</code>.</td><td>string</td></tr><tr><td></td><td><code>edge</code></td><td>The signal edge to count: <code>rising</code>, <code>falling</code>, or <code>both</code>. Default <code>rising</code>.</td><td>string</td></tr><tr><td></td><td><code>debounceTimeout</code></td><td>Debounce time in milliseconds to prevent false counts from noisy signals. Default 10.</td><td>integer</td></tr><tr><td></td><td><code>activeLow</code></td><td>If true, inverts the logic (useful if your sensor outputs 0 when active). Default false.</td><td>boolean</td></tr><tr><td></td><td><code>minCount</code></td><td>How many pulses the counter learns from before the auto-stop watchdog activates, after a reset or <code>relearn</code>. Default 5.</td><td>integer</td></tr><tr><td></td><td><code>continueAfterStop</code></td><td>If true, the counter automatically resumes counting when a new pulse arrives after a stop; if false, pulses are ignored while stopped. Default true.</td><td>boolean</td></tr><tr><td></td><td><code>stopFactor</code></td><td>Average mode only: The multiplier applied to the average interval to trigger a stop. Default 2.0.</td><td>number</td></tr><tr><td></td><td><code>averageWindow</code></td><td>Average mode only: How many of the latest intervals the running average covers. Default 20.</td><td>integer</td></tr><tr><td></td><td><code>targetInterval</code></td><td>Target mode only: The expected cycle time in seconds.</td><td>number</td></tr><tr><td></td><td><code>deviation</code></td><td>Target mode only: The allowed deviation in percent (0 to 100) before a pulse counts as too late.</td><td>number</td></tr><tr><td></td><td><code>journalSize</code></td><td>How many of its latest events the counter keeps on disk at least, for <code>getEvents</code>. Default 50000.</td><td>integer</td></tr></tbody></table>

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

Returns the name of the created instance.

### `start`

Manually starts the counting process. The counter normally starts automatically with the first pulse; use this function to force the `counting` state and arm the watchdog before a signal arrives. This call has no effect while the counter is already counting or in the `ended` state.

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

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>minCount</code></td><td>New minimum count parameter.</td><td>integer</td></tr><tr><td></td><td><code>stopFactor</code></td><td>New stop factor value (average mode).</td><td>number</td></tr><tr><td></td><td><code>averageWindow</code></td><td>New number of intervals the running average covers (average mode).</td><td>integer</td></tr><tr><td></td><td><code>targetInterval</code></td><td>New target interval measured in seconds (target mode).</td><td>number</td></tr><tr><td></td><td><code>deviation</code></td><td>New allowed deviation in percent (target mode).</td><td>number</td></tr><tr><td></td><td><code>continueAfterStop</code></td><td>Whether to resume counting automatically when a new pulse arrives after a stop.</td><td>boolean</td></tr></tbody></table>

#### Example

```yaml
# options
stopFactor: 1.5
```

#### Output

Returns nothing.

### `relearn`

Learns the machine's pace anew while counting goes on: the counter forgets the intervals it learned, so the auto-stop watchdog arms again only after `minCount` new pulses. Count and state are kept. Use it when the pace changes suddenly in the middle of a run, for example another program or another speed; a slow drift the running average follows by itself. Records a `relearn` event.

#### Parameters

None.

#### Output

Returns nothing.

### `dispose`

Releases the hardware resources by freeing the GPIO pin and removes all listeners. Ending an instance is not the machine stopping: no event is recorded. Call this function when the counter is no longer needed to prevent hardware conflicts.

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

### `onEvent`

Registers a callback that fires for every event of the counter, in the order they happen, as soon as the event is on the disk (a few milliseconds after it happened): each counted pulse, each state change, and a restart. This is the primary method for receiving data from the counter.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>callback</code></td><td>Callback that fires on each event. Delivers an object with <code>seq</code>, <code>event</code>, <code>timestamp</code> and the fields of that kind of event.</td><td>callback</td></tr></tbody></table>

#### Example

```yaml
# callback
<callback>
```

Every event carries `seq` (numbering all events of this counter without gaps), `event` (its kind) and `timestamp` (milliseconds since the epoch). A counted pulse:

```json
{
  "seq": 4712,
  "event": "count",
  "timestamp": 1715605000123,
  "count": 125,
  "delta": 1498,
  "avgInterval": 1500.5
}
```

`count` is the total, `delta` the time since the previous pulse in milliseconds (0 for the first pulse after a start or a stop), `avgInterval` the running average in milliseconds.

A state change:

```json
{
  "seq": 4713,
  "event": "stateChange",
  "timestamp": 1715605005000,
  "state": "stopped",
  "previousState": "counting",
  "count": 125
}
```

A restart - the counter came back after its process ended (a crash, an agent restart, a power cut) and counts on in `state` from `count`; `lastEventAt` is the time of the event before:

```json
{
  "seq": 4714,
  "event": "restart",
  "timestamp": 1715608000000,
  "state": "counting",
  "count": 125,
  "lastEventAt": 1715605005000
}
```

A relearn - `relearn` forgot the learned pace; `previousAvgInterval` is the average it had learned:

```json
{
  "seq": 4715,
  "event": "relearn",
  "timestamp": 1715608100000,
  "state": "counting",
  "count": 131,
  "previousAvgInterval": 1500.5
}
```

#### Output

Returns nothing.

### `getEvents`

Retrieves the events after a sequence number, oldest first, exactly as `onEvent` delivered them. Use it to fetch what a listener missed: remember the last `seq` you handled and ask from there whenever an event's `seq` skips numbers or the agent comes back online.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>afterSeq</code></td><td>The last <code>seq</code> you hold; events with a higher one are returned. Default 0.</td><td>integer</td></tr><tr><td></td><td><code>limit</code></td><td>At most this many events. Default 1000.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# options
afterSeq: 4711
limit: 1000
```

#### Output

```json
{
  "events": [{ "seq": 4712, "event": "count", "timestamp": 1715605000123, "count": 125, "delta": 1498, "avgInterval": 1500.5 }],
  "firstSeq": 1,
  "lastSeq": 4714,
  "missed": 0,
  "more": false
}
```

`firstSeq` is the oldest event the journal still holds, `lastSeq` the latest one, `missed` counts the events after `afterSeq` the journal no longer holds, and `more` says whether further events follow beyond `limit`.

### `simulatePulse`

Manually simulates an input pulse. Use this to test your application logic away from the physical hardware. This function only works in simulation mode; real hardware ignores the call and logs a warning.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The signal value to simulate. Default 1.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# value
1
```

#### Output

Returns nothing. The simulated pulse is counted like a real one and reaches the listeners registered with `onEvent`.

### `getData`

Retrieves what the counter knows right now, in one consistent snapshot.

#### Parameters

None.

#### Output

```json
{
  "state": "counting",
  "count": 500,
  "avgInterval": 1200.5,
  "seq": 4714
}
```

`avgInterval` is in milliseconds, `seq` is the number of the latest event.

### `getConfiguration`

Retrieves the current configuration parameters of the instance.

#### Parameters

None.

#### Output

```json
{
  "gpio": 26,
  "minCount": 5,
  "stopFactor": 2.0,
  "averageWindow": 20,
  "targetInterval": null,
  "deviation": null,
  "continueAfterStop": true,
  "journalSize": 50000
}
```
