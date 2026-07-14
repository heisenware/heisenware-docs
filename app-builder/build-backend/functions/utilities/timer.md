# Timer

The timer class introduces countdowns into your flows, maps countdown progress to a custom range, and reacts to ticks and finished countdowns. It also provides a static utility function to format human-readable relative time differences. This class requires an instance for countdown features. The code class name is `Timer`.

## Static functions

Use these functions without creating an instance.

### `getRelativeTime`

Calculates a human-readable, relative time string between a specified time and the current moment (for example, "3 hours ago" or "in 2 years").

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>time</code></td><td></td><td>The time input, either as a Unix timestamp in milliseconds or an ISO 8601 date string.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>locale</code></td><td>The locale code to use for formatting (for example, <code>en</code> or <code>de</code>). Default <code>en</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns the relative time as a string.

#### Examples

**Past time**

Formats a date string from the past.

```yaml
# time
2025-07-12T08:00:00.000Z
# options
locale: en-US
```

Output: `3 hours ago`

**Future time**

Formats a Unix timestamp in the future.

```yaml
# time
1752367200000
```

Output: `in 2 years`

## Instance functions

You must create an instance to use these functions.

### `create`

Creates a new timer instance with a configured duration and progress range.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>min</code></td><td>The value representing the start of the timer progress. Default 0.</td><td>integer</td></tr><tr><td></td><td><code>max</code></td><td>The value representing the end of the timer progress. Default 100.</td><td>integer</td></tr><tr><td></td><td><code>totalSeconds</code></td><td>The total duration of the countdown in seconds. Default 10.</td><td>integer</td></tr><tr><td></td><td><code>autoStop</code></td><td>Automatically stops the timer when it reaches zero. If <code>false</code>, the timer keeps running and its state becomes <code>overdue</code>. Default <code>true</code>.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns the timer instance.

#### Example

```yaml
# options
totalSeconds: 60
min: 0
max: 100
```

### `setTotalSeconds`

Sets the total duration of the timer.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>seconds</code></td><td>The total number of seconds for the countdown.</td><td>integer</td></tr></tbody></table>

#### Output

Returns nothing.

### `getTotalSeconds`

Returns the total duration of the timer in seconds.

#### Parameters

None.

#### Output

Returns the total seconds as an integer.

### `getSecondsLeft`

Returns the remaining seconds on the timer. When the timer is stopped, this returns the total seconds configuration.

#### Parameters

None.

#### Output

Returns the seconds left as an integer.

### `getProgress`

Returns the current progress of the timer, mapped to the defined `min` and `max` range. When the timer is stopped, this returns the `min` value.

#### Parameters

None.

#### Output

Returns the progress value as an integer.

### `getState`

Returns the current state of the timer.

#### Parameters

None.

#### Output

Returns a string representing the state: `stopped`, `started`, or `overdue`.

### `start`

Starts the countdown timer. If called while a delayed stop is pending, this action cancels the stop command.

#### Parameters

None.

#### Output

Returns nothing.

### `stop`

Stops the timer.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>waitingPeriod</code></td><td>An optional delay in milliseconds before the timer stops. If you call <code>start</code> during this period, the stop command is cancelled. Subsequent <code>stop</code> calls during this period are ignored. Default 0.</td><td>integer</td></tr></tbody></table>

#### Output

Returns nothing.

#### Example

**Delayed stop**

Stops the timer after a 5-second delay.

```yaml
# waitingPeriod
5000
```

## Event listeners

These functions let you subscribe callbacks to the timer instance events.

### `onTick`

Subscribes to the tick event. The callback runs every second while the timer is running.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>callback</code></td><td>The callback function. <br>Payload: <code>secondsLeft</code> (integer) and <code>currentProgress</code> (integer).</td><td>callback</td></tr></tbody></table>

#### Output

Returns nothing.

#### Example

```yaml
# callback
<callback>
```

### `onTimeup`

Subscribes to the timeup event. The callback runs once when the countdown reaches zero.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>callback</code></td><td>The callback function. <br>Payload: the Unix timestamp in milliseconds when the countdown finished.</td><td>callback</td></tr></tbody></table>

#### Output

Returns nothing.

#### Example

```yaml
# callback
<callback>
```
