# Stopwatch

The stopwatch class manages a high-resolution timer to measure time intervals. Start, stop, and reset the timer, or record lap snapshots of the elapsed time without stopping the main timer. Use this class to time operations, track activity, or manage time-based logic.

The class emits events (including `start`, `stop`, `reset`, `tick`, and `lap`) to trigger other functions or flows automatically in your Apps. This class requires an instance, but also provides static utility functions. The code class name is `Stopwatch`.

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

None.

#### Output

Returns the stopwatch instance.

### `start`

Starts or resumes the stopwatch and triggers the `start` event. If the stopwatch is already running, this function does nothing.

#### Parameters

None.

#### Output

Returns nothing.

### `stop`

Stops the stopwatch and triggers the `stop` event. The stopwatch saves and holds the current elapsed time until you call `start` again. If the stopwatch is already stopped, this function does nothing.

#### Parameters

None.

#### Output

Returns nothing.

### `reset`

Stops the stopwatch, resets the elapsed time and all recorded laps to zero, and triggers the `reset` event.

#### Parameters

None.

#### Output

Returns nothing.

### `lap`

Records the current elapsed time as a lap without stopping the stopwatch and triggers the `lap` event. If the stopwatch is not running, this function does nothing.

#### Parameters

None.

#### Output

Returns the recorded lap time in milliseconds.

### `getElapsedTime`

Returns the total elapsed time in milliseconds. This function works whether the stopwatch is running or stopped.

#### Parameters

None.

#### Output

Returns the elapsed time in milliseconds.

Example payload:
```json
15320.5
```

### `getLaps`

Returns an array of all recorded lap times.

#### Parameters

None.

#### Output

Returns an array of lap times in milliseconds.

Example payload:
```json
[
  5012.3,
  10050.1,
  15320.5
]
```

### `clearLaps`

Clears all recorded laps. This action does not stop or reset the main timer.

#### Parameters

None.

#### Output

Returns nothing.

### `isRunning`

Checks whether the stopwatch is running.

#### Parameters

None.

#### Output

Returns `true` if the stopwatch is running, or `false` if it is stopped.

### `getState`

Returns the current state of the stopwatch.

#### Parameters

None.

#### Output

Returns `running` if the stopwatch is running, or `stopped` if it is stopped.

### `setTickInterval`

Sets the update interval for the `tick` event. If the stopwatch is running, the new interval applies immediately.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>intervalMs</code></td><td>The update interval in milliseconds. Invalid values fall back to the default. Default 1000.</td><td>integer</td></tr></tbody></table>

#### Output

Returns nothing.

#### Example

Emit a `tick` event every half second.

```yaml
# intervalMs
500
```

## Event listeners

These functions let you subscribe callbacks to the stopwatch instance events.

### `onStart`

Subscribes to the `start` event. The callback runs whenever you start the stopwatch.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>callback</code></td><td>The callback function. <br>Payload: the current elapsed time in milliseconds.</td><td>callback</td></tr></tbody></table>

#### Output

Returns nothing.

### `onStop`

Subscribes to the `stop` event. The callback runs whenever you stop the stopwatch.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>callback</code></td><td>The callback function. <br>Payload: the final elapsed time in milliseconds.</td><td>callback</td></tr></tbody></table>

#### Output

Returns nothing.

### `onReset`

Subscribes to the `reset` event. The callback runs whenever you reset the stopwatch.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>callback</code></td><td>The callback function. <br>Payload: none.</td><td>callback</td></tr></tbody></table>

#### Output

Returns nothing.

### `onTick`

Subscribes to the `tick` event. This event fires repeatedly at the set interval while the stopwatch is running.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>callback</code></td><td>The callback function. <br>Payload: the current elapsed time in milliseconds.</td><td>callback</td></tr></tbody></table>

#### Output

Returns nothing.

### `onLap`

Subscribes to the `lap` event. This event fires when you record a new lap.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>callback</code></td><td>The callback function. <br>Payload: an object containing <code>lapTime</code> (the current lap time) and <code>allLaps</code> (an array of all lap times).</td><td>callback</td></tr></tbody></table>

#### Output

Returns nothing.

### `removeAllListeners`

Unsubscribes all active listeners from this stopwatch instance.

#### Parameters

None.

#### Output

Returns nothing.
