# Timer

With a timer, you introduce countdowns into your flows, map the countdown progress to a custom range, and react to tick and timeup events. A static helper also formats human-readable relative time differences.

## Static functions

These functions work without creating an instance.

### `getRelativeTime`

Calculates a human-readable, relative time string between a given time and the present moment, for example "5 minutes ago" or "in 2 hours".

#### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="140">Type</th></tr></thead><tbody><tr><td><code>time</code></td><td>The time input, either as a Unix timestamp (in milliseconds) or an ISO 8601 date string.</td><td>number or string</td></tr><tr><td><code>options</code></td><td><code>locale</code>: the locale to use for formatting, for example <code>en</code> or <code>de</code>. Defaults to <code>en</code>.</td><td>object</td></tr></tbody></table>

#### Examples

Time in the past:

```yaml
# time
2025-07-12T08:00:00.000Z
# options
locale: en-US
```

Output: A string like `3 hours ago`.

Time in the future:

```yaml
# time
1752367200000
```

Output: A string like `in 2 years`.

## Instance functions

You must create an instance to use the countdown features.

### `create`

Creates a new timer instance with a specified duration and progress range.

#### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td>Settings for the timer. See below.</td><td>object</td></tr></tbody></table>

Available options:

<table><thead><tr><th width="150">Option</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>min</code></td><td>The value representing the start of the timer's progress. Defaults to <code>0</code>.</td><td>number</td></tr><tr><td><code>max</code></td><td>The value representing the end of the timer's progress. Defaults to <code>100</code>.</td><td>number</td></tr><tr><td><code>totalSeconds</code></td><td>The total duration of the countdown in seconds. Defaults to <code>10</code>.</td><td>number</td></tr><tr><td><code>autoStop</code></td><td>If <code>true</code>, the timer automatically stops when it reaches zero. If <code>false</code>, it keeps running and its state becomes <code>overdue</code>. Defaults to <code>true</code>.</td><td>boolean</td></tr></tbody></table>

#### Example

```yaml
# options
totalSeconds: 60
min: 0
max: 100
```

### `setTotalSeconds`

Sets or changes the total duration of the timer.

#### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>seconds</code></td><td>The total number of seconds for the countdown.</td><td>integer</td></tr></tbody></table>

### `getTotalSeconds`

Retrieves the total duration of the timer in seconds.

#### Output

An integer representing the total seconds.

### `getSecondsLeft`

Retrieves the remaining seconds on the timer. When the timer is stopped, this returns the total seconds.

#### Output

An integer representing the seconds left.

### `getProgress`

Retrieves the current progress of the timer, mapped to the `min` and `max` range defined at creation. When the timer is stopped, this returns `min`.

#### Output

A number representing the current progress.

### `getState`

Retrieves the current state of the timer.

#### Output

A string representing the current state:

* `stopped`: The timer is not running.
* `started`: The countdown is running.
* `overdue`: The time is up, but the timer keeps running because `autoStop` is `false`.

### `start`

Starts the countdown timer. If called while a delayed `stop` is pending, it cancels the stop command.

### `stop`

Stops the timer.

#### Parameters

<table><thead><tr><th width="150">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>waitingPeriod</code></td><td>An optional delay in milliseconds before the timer actually stops. Defaults to <code>0</code>. If <code>start</code> is called during this period, the stop command is cancelled. Further <code>stop</code> calls during this period are ignored.</td><td>number</td></tr></tbody></table>

#### Example

Delayed stop:

```yaml
# waitingPeriod
5000
```

### `onTick`

Registers a handler (listener) that is triggered every second while the timer is running. The listener receives two arguments: `secondsLeft` and `currentProgress`.

#### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback function to execute on each tick.</td><td>function</td></tr></tbody></table>

#### Example

```yaml
# listener
<callback>
```

### `onTimeup`

Registers a handler that is triggered once when the countdown reaches zero. The listener receives one argument: the Unix timestamp (in milliseconds) of when the time was up.

#### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback function to execute when the time is up.</td><td>function</td></tr></tbody></table>

#### Example

```yaml
# listener
<callback>
```
