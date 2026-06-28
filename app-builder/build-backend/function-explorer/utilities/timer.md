# Timer

The `Timer` class provides a versatile countdown timer that can map its progress to a custom range and emit events. It also includes a static utility function for calculating human-readable relative time differences.

An instance must be created to use the countdown timer functionality.

***

### Static Functions

#### getRelativeTime

Calculates a human-readable, relative time string between a given time and the present moment (e.g., "5 minutes ago", "in 2 hours").

Parameters

* `time`: The time input, either as a Unix timestamp (in milliseconds) or an ISO 8601 date string.
* `options`: An optional object.
  * `locale`: The locale to use for formatting (e.g., `en`, `de`). Defaults to `en`.

Example: Time in the past

```yaml
# time
2025-07-12T08:00:00.000Z
# options
locale: en-US
```

Output: A string like `"3 hours ago"`.

Example: Time in the future

```yaml
# time
1752367200000
```

Output: A string like `"in 2 years"`.

***

### Instance-Based Timer

You must create an instance of the `Timer` to use the countdown features.

#### create

Creates a new timer instance with a specified duration and progress range.

Parameters

* `options`: An object for configuring the timer.
  * `min`: The value representing the start of the timer's progress. Defaults to `0`.
  * `max`: The value representing the end of the timer's progress. Defaults to `100`.
  * `totalSeconds`: The total duration of the countdown in seconds. Defaults to `10`.
  * `autoStop`: If `true`, the timer automatically stops when it reaches zero. Defaults to `true`.

Example

```yaml
# options
totalSeconds: 60
min: 0
max: 100
```

***

#### setTotalSeconds

Sets or changes the total duration of the timer.

Parameters

* `seconds`: The total number of seconds for the countdown.

***

#### getTotalSeconds

Retrieves the total duration of the timer in seconds.

Output

An integer representing the total seconds.

***

#### getSecondsLeft

Retrieves the remaining seconds on the timer.

Output

An integer representing the seconds left.

***

#### getProgress

Retrieves the current progress of the timer, mapped to the `min` and `max` range defined at creation.

Output

A number representing the current progress.

***

#### getState

Retrieves the current state of the timer.

Output

A string: stopped or started.

***

#### start

Starts the countdown timer. If called while a delayed `stop` is pending, it will cancel the stop command.

***

#### stop

Stops the timer.

Parameters

* `waitingPeriod`: An optional delay in milliseconds before the timer actually stops. If `start` is called during this period, the stop command is cancelled.

Example: Delayed stop

```yaml
# waitingPeriod
5000
```

***

#### onTick

Registers a handler (listener) that is triggered every second while the timer is running. The listener receives two arguments: `secondsLeft` and `currentProgress`.

Parameters

* `listener`: The callback function to execute on each tick.

Example

```yaml
# listener
<callback>
```

***

#### onTimeup

Registers a handler that is triggered once when the countdown reaches zero. The listener receives one argument: the Unix timestamp (in milliseconds) of when the time was up.

Parameters

* `listener`: The callback function to execute when the time is up.

Example

```yaml
# listener
<callback>
```
