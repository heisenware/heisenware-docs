# Stopwatch

The stopwatch class manages a high-resolution timer to measure time intervals. Start, stop, and reset the timer, or record lap snapshots of the elapsed time without stopping the main timer. Use this class to time operations, track activity, or manage time-based logic.

The class emits events (`start`, `stop`, `reset`, `tick`, and `lap`) to trigger other functions or flows automatically in your Apps. The tick interval is set when you create the instance; `setTickInterval` changes it at runtime. This class requires an instance, but also provides static utility functions. The code class name is `Stopwatch`.

## Static functions

Use these functions without creating an instance.

### `formatTime`

Converts a duration in milliseconds into a formatted string. This helps display the outputs of `getElapsedTime` or `getLaps` in a human-readable format.

The `format` parameter replaces specific tokens with time values:

* `HH`: Hours, zero-padded (for example, `08`)
* `H`: Hours, unpadded (for example, `8`)
* `mm`: Minutes, zero-padded (for example, `05`)
* `m`: Minutes, unpadded (for example, `5`)
* `ss`: Seconds, zero-padded (for example, `01`)
* `s`: Seconds, unpadded (for example, `1`)
* `ms`: Milliseconds, padded to three digits (for example, `045`)

{% hint style="info" %}
#### Avoid token letters in literal text

The formatter replaces every occurrence of a token letter in the format string, including letters inside literal text. For example, a format like `m minutes` produces mangled output. Use only separator characters such as colons, periods, or spaces between tokens.
{% endhint %}

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>milliseconds</code></td><td>The duration to format.</td><td>integer</td></tr><tr><td><code>format</code></td><td>A string defining the output format. Default <code>HH:mm:ss.ms</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns the formatted time as a string.

#### Examples

**Default format**

Formats 125,500 milliseconds (2 minutes, 5 seconds, 500 ms) using the default format.

```yaml
# milliseconds
125500
```

Output: `00:02:05.500`

**Custom format**

Formats 3,601,000 milliseconds (1 hour, 1 second) using a custom format.

```yaml
# milliseconds
3601000
# format
H:mm:ss
```

Output: `1:00:01`

## Instance functions

You must create an instance to use these functions.

### `create`

Creates a new stopwatch instance initialized in the stopped state with an elapsed time of 0.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>tickInterval</code></td><td>The time in milliseconds between <code>tick</code> events while running, at least 1. Default 1000.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the name of the created instance.

#### Example

```yaml
# options
tickInterval: 100
```

### `delete`

Deletes a stopwatch instance.

#### Parameters

None.

#### Output

Returns `true` upon removal.

{% hint style="danger" %}
#### Irreversible action
Deleting removes the instance configuration.
{% endhint %}

### `start`

Starts or resumes the stopwatch and triggers the `start` event. If the stopwatch is already running, this function does nothing.

#### Parameters

None.

#### Output

Returns `true` when the stopwatch started, `false` when it was running already.

### `stop`

Stops the stopwatch and triggers the `stop` event. The stopwatch saves and holds the current elapsed time until you call `start` again. If the stopwatch is already stopped, this function does nothing.

#### Parameters

None.

#### Output

Returns `true` when the stopwatch stopped, `false` when it was not running.

### `reset`

Stops the stopwatch, resets the elapsed time and all recorded laps to zero, and triggers the `reset` event.

#### Parameters

None.

#### Output

Returns `true`.

### `lap`

Records the current elapsed time as a lap and triggers the `lap` event. If the stopwatch is not running, this function does nothing.

#### Parameters

None.

#### Output

Returns the lap time in milliseconds, or `null` when the stopwatch is not running.

### `getElapsedTime`

Retrieves the total elapsed time, live while the stopwatch runs.

#### Parameters

None.

#### Output

Returns the elapsed time in milliseconds as a number.

### `getLaps`

Retrieves all recorded lap times.

#### Parameters

None.

#### Output

Returns an array of lap times in milliseconds, in recording order.

### `clearLaps`

Clears all recorded laps without stopping or resetting the stopwatch.

#### Parameters

None.

#### Output

Returns `true`.

### `isRunning`

Checks whether the stopwatch is currently running.

#### Parameters

None.

#### Output

Returns `true` if running, otherwise `false`.

### `getState`

Retrieves the current state of the stopwatch.

#### Parameters

None.

#### Output

Returns `running` or `stopped`.

### `setTickInterval`

Sets the time between `tick` events. If the stopwatch is running, the new interval applies at once.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>intervalMs</code></td><td>The time in milliseconds between ticks, at least 1.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the interval set as an integer.

#### Example

```yaml
# intervalMs
100
```

## Event listeners

These functions let you subscribe callbacks to the stopwatch instance events. Every `on` function has an `off` twin that removes exactly the listener given to it and answers `true` when it was subscribed, otherwise `false`.

### `onStart`

Subscribes to the `start` event. The callback runs whenever you start the stopwatch.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback function. <br>Payload: <code>elapsedTime</code>, the elapsed time in milliseconds resumed from.</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed`.

### `onStop`

Subscribes to the `stop` event. The callback runs whenever you stop the stopwatch.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback function. <br>Payload: <code>elapsedTime</code>, the elapsed time in milliseconds paused at.</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed`.

### `onReset`

Subscribes to the `reset` event. The callback runs whenever you reset the stopwatch.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback function. <br>Payload: none.</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed`.

### `onTick`

Subscribes to the `tick` event. The callback runs at every tick interval while the stopwatch is running.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback function. <br>Payload: <code>elapsedTime</code>, the elapsed time in milliseconds.</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed`.

### `onLap`

Subscribes to the `lap` event. The callback runs whenever you record a lap.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback function. <br>Payload: <code>lapTime</code>, the lap time in milliseconds, and <code>laps</code>, an array of all laps so far.</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed`.

### `offStart`, `offStop`, `offReset`, `offTick`, `offLap`

Remove a listener given to the matching `on` function.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The listener to remove.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `true` when the listener was subscribed, otherwise `false`.

### `removeAllListeners`

Removes every listener from every event of this stopwatch, including those other flows subscribed. Prefer the `off` functions.

#### Parameters

None.

#### Output

Returns the string `unsubscribed`.
