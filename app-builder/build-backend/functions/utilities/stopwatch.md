# Stopwatch

With a stopwatch, you get a high-resolution timer for accurately measuring time intervals. You can start, stop, and reset it, and record laps: snapshots of the elapsed time at a specific moment without stopping the main timer. This is useful for timing operations, tracking activity, or managing any time-based logic.

The stopwatch also emits events (`start`, `stop`, `reset`, `tick`, and `lap`) that other parts of your App can listen to. This allows you to trigger other functions or flows automatically, for example updating a display every second while the stopwatch is running.

## Static functions

These functions work without creating an instance.

### `formatTime`

Converts a duration in milliseconds into a human-readable, formatted string. This is helpful for displaying the output of `getElapsedTime` or `getLaps` in a friendly format.

The `format` argument uses tokens that are replaced by time values:

* `HH`: Hours, padded with a zero (for example `08`)
* `H`: Hours, not padded (for example `8`)
* `mm`: Minutes, padded with a zero (for example `05`)
* `m`: Minutes, not padded (for example `5`)
* `ss`: Seconds, padded with a zero (for example `01`)
* `s`: Seconds, not padded (for example `1`)
* `ms`: Milliseconds, padded to 3 digits (for example `045`)

{% hint style="warning" %}
Every occurrence of a token letter in the format string is replaced, including inside literal text. A format like `m minutes` therefore produces mangled output. Use only separator characters such as `:`, `.`, or spaces between tokens.
{% endhint %}

#### Parameters

<table><thead><tr><th width="150">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>milliseconds</code></td><td>The duration to format.</td><td>number</td></tr><tr><td><code>format</code></td><td>A string defining the output format. Defaults to <code>HH:mm:ss.ms</code>.</td><td>string</td></tr></tbody></table>

#### Examples

Format 125,500 milliseconds (2 minutes, 5 seconds, 500 ms) using the default format:

```yaml
# milliseconds
125500
```

Output: `00:02:05.500`

Format 3,601,000 milliseconds (1 hour, 1 second) using a custom format:

```yaml
# milliseconds
3601000
# format
H:mm:ss
```

Output: `1:00:01`

## Instance functions

You must create an instance to use the following functions.

### `create`

Creates a new stopwatch instance, initialized in the stopped state with an elapsed time of 0.

### `start`

Starts or resumes the stopwatch and triggers the `onStart` event. If the stopwatch is already running, this function does nothing.

### `stop`

Stops (pauses) the stopwatch and triggers the `onStop` event. The current elapsed time is saved and held until `start` is called again. If the stopwatch is already stopped, this function does nothing.

### `reset`

Stops the stopwatch (if it's running), resets its elapsed time and all recorded laps back to zero, and triggers the `onReset` event.

### `lap`

Records the current elapsed time as a lap without stopping the timer and triggers the `onLap` event. If the stopwatch is not running, this function does nothing.

### `getElapsedTime`

Returns the total elapsed time in milliseconds. This works whether the stopwatch is currently running or stopped.

#### Output

```json
15320.5
```

### `getLaps`

Returns an array of all lap times that have been recorded using the `lap` function.

#### Output

```json
[
  5012.3,
  10050.1,
  15320.5
]
```

### `clearLaps`

Clears all recorded laps. This does not stop or reset the main timer.

### `isRunning`

Checks if the stopwatch is currently running.

#### Output

`true` if running, `false` if stopped.

### `getState`

Returns the current state of the stopwatch.

#### Output

A string, either `running` or `stopped`.

### `setTickInterval`

Sets the update interval for the `tick` event. By default, the interval is `1000` (1 second). If the stopwatch is already running, the new interval is applied immediately.

#### Parameters

<table><thead><tr><th width="130">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>intervalMs</code></td><td>The new update interval in milliseconds. Must be a positive integer, invalid values fall back to the default of <code>1000</code>.</td><td>integer</td></tr></tbody></table>

#### Example

Emit a `tick` event every half second:

```yaml
# intervalMs
500
```

### `onStart`

Subscribes to the `start` event. The listener is executed every time this stopwatch is started and receives the current elapsed time.

### `onStop`

Subscribes to the `stop` event. The listener is executed every time this stopwatch is stopped and receives the final elapsed time.

### `onReset`

Subscribes to the `reset` event. The listener is executed every time this stopwatch is reset.

### `onTick`

Subscribes to the `tick` event. This event fires repeatedly while the stopwatch is running, at the interval set by `setTickInterval`. The listener receives the current elapsed time.

### `onLap`

Subscribes to the `lap` event. This event fires every time the `lap` function is successfully called. The listener receives two arguments: `lapTime`, the time of the lap that was just recorded, and `allLaps`, a list of all laps recorded so far including the new one.

### `removeAllListeners`

Unsubscribes all listeners (`onStart`, `onStop`, `onReset`, `onTick`, and `onLap`) that are currently attached to this stopwatch instance.
