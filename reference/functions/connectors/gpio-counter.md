# GPIO counter

The GPIO counter counts digital pulses on a Raspberry Pi's GPIO pins. It interprets signals from sensors (such as inductive proximity sensors, light barriers, or rotary encoders) to track production counts, machine cycles, or flow rates.

A counter can also watch several pins: a machine with two producing units, for example two spindles, reports each unit's parts on its own signal. Each pulse on any of its pins is one part, and each pin keeps its own pace (see [Several inputs](#several-inputs)).

Beyond counting, the class monitors the time interval between pulses to automatically determine whether a machine or process is running or stopped. It offers two operation modes:

1. pace mode (default): Detects a stop when the time between pulses exceeds a limit learned from the machine itself: from the median of its latest intervals (`paceWindow`) and how far they scatter, and never below `minStopInterval` (see [The pace and the limit](#the-pace-and-the-limit)). The counter follows a machine whose pace changes during a run by itself. Until the pace is learned, the expected time per part (`expectedInterval`, for example the order's target time) takes its place (see [Before the pace is learned](#before-the-pace-is-learned)).
2. target mode: Detects a stop when the time between pulses exceeds a fixed target interval plus a defined tolerance. Use this for processes with strict cycle times. Target mode is active when both `targetInterval` and `targetDeviation` are set.

Settings are in seconds, except `debounceTimeout` in milliseconds as on the pin classes; everything the counter reports is in milliseconds.

A pulse that comes sooner than `minPulseInterval` after the last counted one is a double pulse, not a part: it is not counted, and it is journaled as `ignored`, so a diagnosis can show that a machine bounces. The rules the counter decides by - `minStopInterval`, `minPulseInterval` and the others - can change on a running counter with `configure`, without losing the count.

Nothing the counter sees gets lost. Every event - a count, a state change, a restart - goes out on one stream, numbered without gaps and journaled on the device's disk, so whatever a listener missed while the network was down or the platform restarted can be fetched afterwards with `getEvents`. The count and the learned paces persist as well: a counter that restarts counts on where it was.

This connector requires [instance creation](README.md#instance-creation) before you can interact with a physical pin, though it includes static utilities for hardware and pin detection.

{% hint style="warning" %}
#### Hardware requirement

This class requires a Raspberry Pi 4 or 5. If no compatible hardware is detected, the class automatically falls back to a simulation mode, letting you test your logic with the `simulatePulse` function.
{% endhint %}

## State machine

The counter operates on an internal state machine. Understanding the states helps with debugging and predicting behavior in production.

### States

* `initialized`: The starting state after `create` or `reset`. The counter waits for the first signal, and no watchdog is active.
* `counting`: The active state. The counter registers pulses, learns the pace, and runs the auto-stop watchdog.
* `stopped`: The process has finished or paused. The counter enters this state automatically when the pulse interval becomes too long, or manually when you call `stop`. The current count is preserved.
* `ended`: A terminal state entered via `end`. No further counts are registered and no auto-restart occurs until you call `reset`.

### Transitions

* Auto-start (`initialized` → `counting`): The first pulse on the GPIO pin starts the counter automatically.
* Auto-stop (`counting` → `stopped`): The time since the last pulse exceeded the limit: the learned one in pace mode, `targetInterval` plus `targetDeviation` in target mode. This indicates the machine has stopped. The `stateChange` event names the late pin in `pins` and says in `stoppedAt` when the machine really stopped.
* Continue (`stopped` → `counting`): With `continueAfterStop` set to true, a new pulse automatically resumes counting; after an auto-stop, every late pin must pulse again. With false, pulses are ignored while stopped.
* Manual control: `start` forces `counting`, `stop` forces `stopped`, `end` forces `ended`, and `reset` returns the counter to `initialized`.

The first pulse after a start or a manual stop is the reference for the next one: it is counted, but the time before it is not learned as a cycle interval. After an auto-stop, the gap the pulse ends is learned like any other interval.

### The pace and the limit

In pace mode, each pin learns the pace it really runs at from every interval between its pulses, over its latest `paceWindow` intervals of the current run. Nothing is filtered first, and the gap that ends a stop is learned like any other. Two measures stand up to what is not a regular interval: the pace, which is the median of the intervals, and their median absolute deviation (MAD), the median distance from the pace. A pause or a double pulse barely moves either.

A pin is late after

```
limit = max(pace + stopDeviations x MAD, stopFactor x pace, minStopInterval)
```

* `pace + stopDeviations x MAD` adapts to how far the intervals scatter. `stopDeviations` is 4 by default.
* `stopFactor x pace` is the floor for very regular intervals, whose MAD falls to about 0. `stopFactor` is 1.5 by default.
* `minStopInterval` is the floor you set, in seconds: a shorter gap is never a stop, however fast the pace. It is off by default.

All three can change per machine, also on a running counter with `configure`. A gap under the limit is a short stop: the machine stays in `counting`. With the default factors, a machine with a median of 153 seconds and a MAD of 21 seconds is late after 237 seconds; with `minStopInterval` 120, a machine at 35 seconds per part is late after 120 seconds.

When the pace changes in the middle of a run, for example another program or another speed, the counter follows by itself within about half of `paceWindow` parts. Until then the new pace can stop the machine after a part, and the next pulse ends the stop at once.

The counter can only tell a machine stopped once the limit has run out, but the machine stopped earlier. So the `stateChange` event of an auto-stop carries `stoppedAt`: when the next part was due, the pin's last pulse plus its median. Use `stoppedAt` for downtime; `timestamp` says when the counter found out.

### Before the pace is learned

A `reset` or a `start` begins a new run: every pin forgets its pace and learns it from the intervals that follow. A pulse that ends a manual `stop` does not: the run goes on and the pace stays. A pin's own pace watches it once `learnIntervals` intervals of the run exist. The first pulse is the reference and measures no interval, so with `learnIntervals` 2 that is the third part. Without `expectedInterval`, nothing watches the pin meanwhile: a machine that stands still after the start reads as `counting` until it has made those parts.

With `expectedInterval`, the expected time per part in seconds - typically the order's target time - the counter has a first guess at the pace: a pin that has not learned its pace yet is late after `stopFactor` times `expectedInterval`, or after `minStopInterval` if that is longer. The time counts from `start`, or from the first pulse when that starts the counter. Once `learnIntervals` intervals exist, the pin's own pace takes over. `expectedInterval` decides nothing about what is learned.

`expectedInterval` applies in pace mode only, to every pin of the counter alike: for a machine with several units, give it the target time of the slowest one. A change through `configure` applies at once, and `null` (the default) switches it off.

Example: an order with a target time of 200 seconds per part and `learnIntervals` 2, with the default factors. After `start`, the machine shows as stopped if no part arrives within 300 seconds. The first intervals measure the real pace - say 180 seconds - and from the third part on the machine stops when a part takes longer than 270 seconds.

### Several inputs

With a list of pins in `gpio`, one counter counts a machine with several producing units:

* Each pin learns its own pace: it has its own median, its own `learnIntervals` learning phase and its own limit (the target in target mode).
* One late pin stops the machine. The `stateChange` event names it in `pins`. A pin that is late too while the machine already stopped joins the stop, recorded as a `fault` event.
* The machine counts again only when every late pin has pulsed again. Parts of a pin that stayed in time are counted meanwhile, but do not end the stop.
* The count is the sum over all pins. Each `count` event carries its `pin` and that pin's median.
* Without `expectedInterval`, a pin that has not finished learning cannot stop the machine. `start` begins a new run on every pin, so a unit that is idle for a whole order never stops the machine. With `expectedInterval`, every pin is watched against that one value until it has learned its own pace, so an idle unit does stop the machine.
* `minPulseInterval` applies per pin: two units that finish within milliseconds of each other are two parts.
* `pullUpDown`, `edge`, `debounceTimeout` and `activeLow` apply to every pin.

`getData` reports each pin and the machine's pace over all of them.

### Persistence across restarts

The counter writes its state, count, learned paces and configuration to a state file on disk after every change; the journal (below) is the truth and the state file its snapshot. When an instance is created and a state file or journal for that GPIO pin (or set of pins) exists - the agent restarted, the host lost power - the counter restores the snapshot, brings it up to the journal, and counts on in the state it was in: no pulse is ignored because of a restart. It records a `restart` event, and if it was counting, it arms the watchdog at once, so a machine that stopped meanwhile shows as stopped soon. A value changed with `configure` survives the restart, unless `create` now gives that value differently than when the counter was first created.

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

Creates a counter instance, initializes the hardware connection or simulation, and configures the counting logic. Providing both `targetInterval` and `targetDeviation` activates target mode; otherwise, the counter runs in pace mode.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>gpio</code></td><td>The BCM pin number connected to the sensor, or a list of pin numbers for a machine with several producing units.</td><td>integer or array</td></tr><tr><td></td><td><code>pullUpDown</code></td><td>Resistor configuration: <code>none</code>, <code>pullup</code>, or <code>pulldown</code>. Default <code>none</code>.</td><td>string</td></tr><tr><td></td><td><code>edge</code></td><td>The signal edge to count: <code>rising</code>, <code>falling</code>, or <code>both</code>. Default <code>rising</code>.</td><td>string</td></tr><tr><td></td><td><code>debounceTimeout</code></td><td>Electrical debounce time in milliseconds against contact bounce, applied by the pin driver. Default 10. Not a minimum cycle time: use <code>minPulseInterval</code> against double parts.</td><td>integer</td></tr><tr><td></td><td><code>activeLow</code></td><td>If true, inverts the logic (useful if your sensor outputs 0 when active). Default false.</td><td>boolean</td></tr><tr><td></td><td><code>learnIntervals</code></td><td>How many intervals a pin learns its pace from, after a <code>reset</code> or <code>start</code>, before its own pace watches it; until then <code>expectedInterval</code> does, if set. In target mode: the intervals before the target watches. Default 5.</td><td>integer</td></tr><tr><td></td><td><code>minPulseInterval</code></td><td>Shortest time in seconds between two counted pulses of a pin. A pulse sooner is not counted but recorded as an <code>ignored</code> event. Default 0 (off).</td><td>number</td></tr><tr><td></td><td><code>continueAfterStop</code></td><td>If true, the counter automatically resumes counting when a new pulse arrives after a stop; if false, pulses are ignored while stopped. Default true.</td><td>boolean</td></tr><tr><td></td><td><code>minStopInterval</code></td><td>Pace mode only: The time in seconds a pin may stay silent in any case; the limit never falls below it (see <a href="#the-pace-and-the-limit">The pace and the limit</a>). Default 0 (off).</td><td>number</td></tr><tr><td></td><td><code>stopFactor</code></td><td>Pace mode only: The factor of a pin's median, or of <code>expectedInterval</code> while it learns, before which it is never late. At least 1. Default 1.5.</td><td>number</td></tr><tr><td></td><td><code>stopDeviations</code></td><td>Pace mode only: How many median absolute deviations above its median a pin is late: how far its parts may scatter. 0 is off. Default 4.</td><td>number</td></tr><tr><td></td><td><code>paceWindow</code></td><td>Pace mode only: How many of the latest intervals the pace covers. The counter follows a changed pace within about half of them. Default 20.</td><td>integer</td></tr><tr><td></td><td><code>expectedInterval</code></td><td>Pace mode only: The expected time per part in seconds, typically the order's target time. The first guess at a pin's pace until it has learned its own (see <a href="#before-the-pace-is-learned">Before the pace is learned</a>). Default <code>null</code> (off).</td><td>number</td></tr><tr><td></td><td><code>targetInterval</code></td><td>Target mode only: The expected cycle time in seconds.</td><td>number</td></tr><tr><td></td><td><code>targetDeviation</code></td><td>Target mode only: The allowed deviation in percent (0 to 100) before a pulse counts as too late.</td><td>number</td></tr><tr><td></td><td><code>journalSize</code></td><td>How many of its latest events the counter keeps on disk at least, for <code>getEvents</code>. Default 50000.</td><td>integer</td></tr></tbody></table>

#### Examples

Example 1: Pace mode

This counter learns its pace from 10 intervals, and a gap shorter than 2 minutes is never a stop.

```yaml
# options
gpio: 17
pullUpDown: pullup
minStopInterval: 120
learnIntervals: 10
```

Example 2: Target mode

This counter expects a pulse every 5 seconds. It detects a stop when a pulse takes longer than 5.5 seconds (5 seconds plus 10 percent deviation).

```yaml
# options
gpio: 22
targetInterval: 5
targetDeviation: 10
```

Example 3: Two producing units, double pulses filtered

This counter counts a machine with two spindles on GPIO 26 and 16. The machine stops when either spindle is late by its own pace, never within 2 minutes of its last part, and a pulse within 3 seconds of a spindle's last part is not counted.

```yaml
# options
gpio: [26, 16]
minStopInterval: 120
minPulseInterval: 3
```

#### Output

Returns the name of the created instance.

### `start`

Manually starts a new run. The counter normally starts automatically with the first pulse; use this function to force the `counting` state and arm the watchdog before a signal arrives, for example when an order begins. Every pin forgets its pace, so `expectedInterval` is the first guess again, and the watchdog measures from now; the count stays. A counter that is already counting begins the new run too, and stays in `counting`. This call has no effect in the `ended` state. It is recorded as a `newRun` event.

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

Resets the counter to its initial state by setting the count to 0, clearing the learned paces, and returning the state to `initialized`. You can optionally pass configuration parameters to update the counting logic during the reset; they are recorded as a `configure` event. To change the configuration without losing the count, use `configure`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>learnIntervals</code></td><td>New minimum count parameter.</td><td>integer</td></tr><tr><td></td><td><code>minStopInterval</code></td><td>New time in seconds a pin may stay silent in any case (pace mode).</td><td>number</td></tr><tr><td></td><td><code>stopFactor</code></td><td>New factor of the median before which a pin is never late (pace mode).</td><td>number</td></tr><tr><td></td><td><code>stopDeviations</code></td><td>New number of median absolute deviations above the median at which a pin is late (pace mode).</td><td>number</td></tr><tr><td></td><td><code>paceWindow</code></td><td>New number of intervals the pace covers (pace mode).</td><td>integer</td></tr><tr><td></td><td><code>minPulseInterval</code></td><td>New shortest time in seconds between two counted pulses of a pin.</td><td>number</td></tr><tr><td></td><td><code>expectedInterval</code></td><td>New expected time per part in seconds, the order's target time (pace mode); <code>null</code> switches it off.</td><td>number</td></tr><tr><td></td><td><code>targetInterval</code></td><td>New target interval measured in seconds (target mode).</td><td>number</td></tr><tr><td></td><td><code>targetDeviation</code></td><td>New allowed deviation in percent (target mode).</td><td>number</td></tr><tr><td></td><td><code>continueAfterStop</code></td><td>Whether to resume counting automatically when a new pulse arrives after a stop.</td><td>boolean</td></tr></tbody></table>

#### Example

```yaml
# options
minStopInterval: 90
```

#### Output

Returns nothing.

### `configure`

Changes the rules the counter decides by while it runs. Count, state, learned paces and `seq` are kept. A counting counter applies the new limit at once, measured from each pin's last pulse: lowering `minStopInterval` on a machine that is already past the new limit stops it right away. Only the values you pass change. The change is recorded as a `configure` event and survives a restart.

The pin settings (`gpio`, `edge`, `debounceTimeout`, `pullUpDown`, `activeLow`) and `journalSize` cannot change on a running counter; the call refuses them, as it refuses invalid values, and then changes nothing. To change them, delete the counter and create it anew; it counts on from its state file.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>learnIntervals</code></td><td>Intervals a pin learns its pace from before its own pace watches it.</td><td>integer</td></tr><tr><td></td><td><code>minStopInterval</code></td><td>Time in seconds a pin may stay silent in any case (pace mode); 0 is off.</td><td>number</td></tr><tr><td></td><td><code>stopFactor</code></td><td>Factor of a pin's median, or of <code>expectedInterval</code> while it learns, before which it is never late (pace mode); at least 1.</td><td>number</td></tr><tr><td></td><td><code>stopDeviations</code></td><td>How many median absolute deviations above its median a pin is late (pace mode); 0 is off.</td><td>number</td></tr><tr><td></td><td><code>paceWindow</code></td><td>How many of a pin's latest intervals its pace covers (pace mode).</td><td>integer</td></tr><tr><td></td><td><code>minPulseInterval</code></td><td>Shortest time in seconds between two counted pulses of a pin; 0 is off.</td><td>number</td></tr><tr><td></td><td><code>expectedInterval</code></td><td>Expected time per part in seconds, the order's target time (pace mode): the first guess at a pin's pace until it has learned its own. A pin that is learning is re-armed against the new value at once; <code>null</code> switches it off.</td><td>number</td></tr><tr><td></td><td><code>targetInterval</code></td><td>Target interval in seconds (target mode); <code>null</code> returns to pace mode.</td><td>number</td></tr><tr><td></td><td><code>targetDeviation</code></td><td>Allowed deviation in percent (target mode).</td><td>number</td></tr><tr><td></td><td><code>continueAfterStop</code></td><td>Whether a pulse after a stop resumes counting.</td><td>boolean</td></tr></tbody></table>

#### Example

An order of 240 seconds per part: the machine is late at 1.5 times that until it has learned its pace, then by its own pace but never within 2 minutes of the last part, and a pulse within 3 seconds of the last part is a double pulse.

```yaml
# options
expectedInterval: 240
minStopInterval: 120
minPulseInterval: 3
```

#### Output

Returns the configuration now, as `getConfiguration` returns it.

### `dispose`

Releases the hardware resources by freeing the GPIO pins and removes all listeners. Ending an instance is not the machine stopping: no event is recorded. Call this function when the counter is no longer needed to prevent hardware conflicts.

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

Registers a callback that fires for every event of the counter, in the order they happen, as soon as the event is on the disk (a few milliseconds after it happened): each counted or ignored pulse, each state change, each change of configuration, and a restart. This is the primary method for receiving data from the counter.

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
  "pace": 1500.5,
  "pin": 26
}
```

`count` is the total over all pins, `pin` the pin the pulse came from, `delta` the time since that pin's previous pulse in milliseconds, the interval it learned, the gap of an auto-stop included (0 for its first pulse after a start, a manual stop or a restart), `pace` the median of that pin's latest intervals in milliseconds.

A state change; an auto-stop names the late pin in `pins` and says in `stoppedAt` when its next part was due, in milliseconds since the epoch: its last pulse plus its median, in target mode plus `targetInterval`. `timestamp` is when the limit ran out. A manual `stop` has neither:

```json
{
  "seq": 4713,
  "event": "stateChange",
  "timestamp": 1715605005000,
  "state": "stopped",
  "previousState": "counting",
  "count": 125,
  "pins": [26],
  "stoppedAt": 1715605001624
}
```

A fault - with several pins, another pin was late too while the machine had already stopped; the machine counts again once all late pins pulsed:

```json
{
  "seq": 4714,
  "event": "fault",
  "timestamp": 1715605007000,
  "state": "stopped",
  "count": 125,
  "pins": [16]
}
```

An ignored pulse - it came sooner than `minPulseInterval` after the last counted pulse of its pin, `delta` milliseconds after it, and was not counted:

```json
{
  "seq": 4715,
  "event": "ignored",
  "timestamp": 1715605009000,
  "pin": 26,
  "delta": 877,
  "count": 125
}
```

A change of configuration by `configure` or `reset`; `from` and `to` hold the values that changed:

```json
{
  "seq": 4716,
  "event": "configure",
  "timestamp": 1715607000000,
  "state": "counting",
  "count": 125,
  "from": { "minStopInterval": 60 },
  "to": { "minStopInterval": 120 }
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

A new run - `start` made every pin forget its pace; `previousPace` is the machine's pace before, in milliseconds per part, `state` and `count` are as they were:

```json
{
  "seq": 4717,
  "event": "newRun",
  "timestamp": 1715608100000,
  "state": "stopped",
  "count": 131,
  "previousPace": 1500.5
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
  "events": [{ "seq": 4712, "event": "count", "timestamp": 1715605000123, "count": 125, "delta": 1498, "pace": 1500.5 }],
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

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The signal value to simulate. Default 1.</td><td>integer</td></tr><tr><td><code>gpio</code></td><td>The pin the pulse arrives on, for a counter on several pins. Default: the first pin.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# value
1
# gpio
16
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
  "state": "stopped",
  "count": 500,
  "pace": 25000,
  "seq": 4714,
  "inputs": [
    { "pin": 26, "count": 250, "pace": 50000, "limit": 75000, "armed": true, "state": "faulted" },
    { "pin": 16, "count": 250, "pace": 50000, "limit": 75000, "armed": true, "state": "healthy" }
  ]
}
```

`pace` is the machine's pace over all pins in milliseconds per part (two units at 50 seconds each make a part every 25 seconds), `seq` is the number of the latest event. `inputs` holds each pin: its `count`, the median of its latest intervals as `pace`, the `limit` in milliseconds after which it is late, whether it is `armed` (it can stop the machine: it has learned its pace, or `expectedInterval` watches it), and its `state`, `healthy` or `faulted` (late, the machine stopped for it).

### `getConfiguration`

Retrieves the current configuration parameters of the instance.

#### Parameters

None.

#### Output

```json
{
  "gpio": 26,
  "learnIntervals": 5,
  "minStopInterval": 0,
  "stopFactor": 1.5,
  "stopDeviations": 4,
  "paceWindow": 20,
  "minPulseInterval": 0,
  "expectedInterval": null,
  "targetInterval": null,
  "targetDeviation": null,
  "continueAfterStop": true,
  "journalSize": 50000
}
```
