# Timer

The timer class introduces countdowns with one-second resolution into your flows, maps countdown progress to a custom range, and reacts to ticks and finished countdowns. The duration and the progress range are set when you create the instance; `setTotalSeconds` changes the duration for the next start. It also provides a static utility function to format human-readable relative time differences. This class requires an instance for countdown features. The code class name is `Timer`.

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

Formats an ISO date string.

```yaml
# time
2025-07-12T08:00:00.000Z
# options
locale: en
```

The output depends on the current time, for example `3 hours ago`.

**Future time**

Formats a Unix timestamp in milliseconds.

```yaml
# time
1783903200000
```

The output depends on the current time, for example `in 2 years`.

## Instance functions

You must create an instance to use these functions.

### `create`

Creates a new timer instance with a configured duration and progress range.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>min</code></td><td>The progress value at the start. Default 0.</td><td>number</td></tr><tr><td></td><td><code>max</code></td><td>The progress value when time is up. Default 100.</td><td>number</td></tr><tr><td></td><td><code>totalSeconds</code></td><td>The total duration of the countdown in seconds, at least 1. Default 10.</td><td>integer</td></tr><tr><td></td><td><code>autoStop</code></td><td>Automatically stops the timer when it reaches zero. If <code>false</code>, the timer keeps ticking past zero (negative seconds left, progress beyond <code>max</code>) and its state becomes <code>overdue</code> until stopped. Default <code>true</code>.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns the name of the created instance.

#### Example

```yaml
# options
totalSeconds: 60
min: 0
max: 100
```

### `delete`

Deletes a timer instance.

#### Parameters

None.

#### Output

Returns `true` upon removal.

{% hint style="danger" %}
#### Irreversible action
Deleting removes the instance configuration.
{% endhint %}

### `setTotalSeconds`

Sets the countdown length for the next start. A running countdown keeps its current length.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>seconds</code></td><td>The countdown length in seconds, at least 1.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the length set as an integer.

### `getTotalSeconds`

Retrieves the countdown length.

#### Parameters

None.

#### Output

Returns the total seconds as an integer.

### `getSecondsLeft`

Retrieves the seconds left on the running countdown: the full length when stopped, negative when overdue.

#### Parameters

None.

#### Output

Returns the seconds left as an integer.

### `getProgress`

Retrieves the progress of the running countdown, mapped from `min` at the start to `max` when time is up: `min` when stopped, beyond `max` when overdue.

#### Parameters

None.

#### Output

Returns the progress as a number with up to three decimals.

### `getState`

Retrieves the current state of the timer.

#### Parameters

None.

#### Output

Returns `stopped`, `started`, or `overdue`.

### `start`

Starts the countdown from the full length. If called while the countdown runs, this action only cancels a pending delayed stop and changes nothing else.

#### Parameters

None.

#### Output

Returns the state after the call: `started` or `overdue`.

### `stop`

Stops the countdown, at once or after a waiting period. During the waiting period a `start` cancels the stop, and further `stop` calls are ignored. A stopped timer reports the full length and `min` progress.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>waitingPeriod</code></td><td>The time in milliseconds to wait before stopping. Default 0.</td><td>integer</td></tr></tbody></table>

#### Output

Returns `true`.

#### Example

Stops the timer after a five-second delay, unless the timer is started again in the meantime.

```yaml
# waitingPeriod
5000
```

## Event listeners

These functions let you subscribe callbacks to the timer instance events.

### `onTick`

Subscribes to the tick event. The callback runs every second while the countdown runs.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback function. <br>Payload: <code>secondsLeft</code> (integer, negative when overdue) and <code>progress</code> (number between <code>min</code> and <code>max</code>, beyond <code>max</code> when overdue).</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed`.

### `offTick`

Removes a listener given to `onTick`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The listener to remove.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `true` when the listener was subscribed, otherwise `false`.

### `onTimeup`

Subscribes to the timeup event. The callback runs once per start, when the countdown reaches zero.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback function. <br>Payload: <code>time</code>, the Unix timestamp in milliseconds when the countdown finished.</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed`.

### `offTimeup`

Removes a listener given to `onTimeup`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The listener to remove.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `true` when the listener was subscribed, otherwise `false`.
