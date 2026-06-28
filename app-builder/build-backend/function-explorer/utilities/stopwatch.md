# Stopwatch

The `Stopwatch` class provides a high-resolution timer for accurately measuring time intervals. You can create an instance of a stopwatch to start, stop, pause, and reset it. This is useful for timing operations, tracking user activity, or managing any time-based logic.

A key feature of the stopwatch is its ability to record "laps," which are snapshots of the elapsed time at a specific moment without stopping the main timer.

The stopwatch also emits events (like `start`, `stop`, `lap`, and `tick`) that other parts of your application can listen to. This allows you to trigger other functions or flows automatically—for example, updating a display every second the stopwatch is running.

## Static Functions

### formatTime

Converts a duration in milliseconds into a human-readable, formatted string.

This is a static function, so you can use it directly without creating a `Stopwatch` instance first. It's helpful for displaying the output of `getElapsedTime()` or `getLaps()` in a friendly format.

The `format` argument uses special tokens that are replaced by time values:

* HH: Hours, padded with a zero (e.g., `08`)
* H: Hours, not padded (e.g., `8`)
* mm: Minutes, padded with a zero (e.g., `05`)
* m: Minutes, not padded (e.g., `5`)
* ss: Seconds, padded with a zero (e.g., `01`)
* s: Seconds, not padded (e.g., `1`)
* ms: Milliseconds, padded to 3 digits (e.g., `045`)

#### Parameters

1. `milliseconds`: The number of milliseconds you want to format.
2. `format` (Optional): A string defining the output format. If you don't provide one, the default format is `HH:mm:ss.ms`.

#### Example 1: Default Format

This example formats 125,500 milliseconds (2 minutes, 5 seconds, 500 ms) using the default format.

```yaml
# milliseconds
125500
# format (optional, default is 'HH:mm:ss.ms')
```

#### Output

```json
"00:02:05.500"
```

#### Example 2: Custom Format

This example formats 3,601,000 milliseconds (1 hour, 1 second) using a custom, descriptive string.

```yaml
# milliseconds
3601000
# format
"H hour, m minutes, and s seconds"
```

#### Output

```json
"1 hour, 0 minutes, and 1 seconds"
```

## Constructor and Member Functions

### create

This is the constructor. It creates a new, blank `Stopwatch` instance. The new stopwatch is initialized in a 'stopped' state with an elapsed time of 0.

#### Output

> Returns a new `Stopwatch` instance. You must use this instance to call all the member functions listed below (like `start`, `stop`, etc.).

***

### start

Starts or resumes the stopwatch. If the stopwatch is already running, this function does nothing. This function also triggers the `onStart` event.

***

### stop

Stops (pauses) the stopwatch. The current elapsed time is saved and will be held until `start` is called again. If the stopwatch is already stopped, this function does nothing. This function also triggers the `onStop` event.

***

### reset

Stops the stopwatch (if it's running) and resets its elapsed time and all recorded laps back to zero. This function also triggers the `onReset` event.

***

### lap

Records the current elapsed time as a "lap" without stopping the timer. If the stopwatch is not running, this function does nothing. This function also triggers the `onLap` event.

***

### getElapsedTime

Returns the total elapsed time in milliseconds (as a number). This works whether the stopwatch is currently running or stopped.

#### Output

```json
15320.5
```

***

### getLaps

Returns a list (an array) of all lap times that have been recorded using the `lap()` function.

#### Output

```json
[
  5012.3,
  10050.1,
  15320.5
]
```

***

### clearLaps

Clears all recorded laps from the stopwatch's memory. This does not stop or reset the main timer.

***

### isRunning

Checks if the stopwatch is currently running.

#### Output

The output will be `true` if running, `false` if stopped

***

### getState

Returns the current state of the stopwatch as a text string.

#### Output

The output will be `"running"` or `"stopped"`

***

### setTickInterval

Sets the update interval (in milliseconds) for the 'tick' event. By default, the interval is `1000` (1 second). If the stopwatch is already running, the new interval will be applied immediately.

#### Parameters

1. `intervalMs`: The new update interval in milliseconds.

#### Example

This example sets the stopwatch to emit a 'tick' event every half-second.

```yaml
# intervalMs
500
```

***

### onStart

Subscribes to the 'start' event. The listener flow you provide will be executed every time this stopwatch instance is started.

***

### onStop

Subscribes to the 'stop' event. The listener flow you provide will be executed every time this stopwatch instance is stopped.

***

### onReset

Subscribes to the 'reset' event. The listener flow you provide will be executed every time this stopwatch instance is reset.

***

### onTick

Subscribes to the 'tick' event. This event fires repeatedly while the stopwatch is running, at the interval set by `setTickInterval`.

***

### onLap

Subscribes to the 'lap' event. This event fires every time the `lap()` function is successfully called.

#### Parameters

1. `listener`: The flow to execute when the event fires. This flow will be triggered with an object containing the lap data.

> Input to your Listener Flow: When this event fires, your listener flow will receive an object with two keys:
>
> * `lapTime`: The time of the lap that was just recorded (e.g., `5012.3`).
> * `allLaps`: A list of all laps recorded so far, including the new one (e.g., `[5012.3, 10050.1]`).

***

### removeAllListeners

Unsubscribes all listeners (like `onStart`, `onStop`, `onTick`, etc.) that are currently attached to this specific stopwatch instance.

#### Output

```
"unsubscribed"
```
