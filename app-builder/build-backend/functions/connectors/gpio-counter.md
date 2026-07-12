# GPIO Counter

The `GpioCounter` class provides a high-level interface for counting digital pulses on a Raspberry Pi's GPIO pins. It is designed to interpret signals from sensors (like inductive proximity sensors, light barriers, or rotary encoders) to track production counts, machine cycles, or flow rates.

Beyond simple counting, this class features intelligent state detection. It monitors the time interval between pulses to automatically determine if a machine or process is running or stopped.

It offers two distinct operation modes:

1. Average Mode (Default): Automatically detects a stop if the time between pulses exceeds the running average by a certain factor. This adapts dynamically to the speed of the machine.
2. Target Mode: Detects a stop if the time between pulses exceeds a fixed target interval (plus a defined tolerance). This is useful for processes with strict cycle times.

{% hint style="warning" %}
**Important:** This class requires your application to be running on a Raspberry Pi (supported architectures: RPi 4 and RPi 5).

If no compatible hardware is detected, the class will automatically fall back to a simulation mode, allowing you to test your logic using the `simulatePulse` function.
{% endhint %}

## Internal State Machine

The `GpioCounter` operates on a simple but robust internal state machine. Understanding these states and transitions is helpful for debugging and for predicting how the counter will behave in production environments.

<figure><img src="../../../../.gitbook/assets/image (30).png" alt=""><figcaption></figcaption></figure>

#### States

* **Initialized**: The default starting state when an instance is created or reset. The counter is idle, waiting for the first signal to arrive. No timeouts are active.
* **Counting**: The active state. The counter is registering pulses, calculating averages, and the auto-stop watchdog timer is running.
* **Stopped**: The state entered when the process has finished or paused. This happens automatically if the pulse interval becomes too long (watchdog expiry) or if `stop()` is called manually.

#### Transitions

* **Auto-Start** (`Initialized` → `Counting`): Occurs automatically when the very first pulse is detected on the GPIO pin.
* **Auto-Stop** (`Counting` → `Stopped`): Occurs when the time since the last pulse exceeds the calculated limit (based on `stopFactor` or `targetInterval`). This usually indicates the machine has stopped.
* **Continue** (`Stopped` → `Counting`): If `continueAfterStop` is set to `true`, a new pulse will automatically wake the counter up and resume counting.
* Manual Control:
  * `start()`: Forces transition to Counting.
  * `stop()`: Forces transition to Stopped.
  * `reset()`: Forces transition back to Initialized.

## Static Functions

These functions help you manage hardware resources before creating a counter instance.

### isAccessible

Checks if any compatible GPIO hardware (Raspberry Pi 4 or 5) is accessible on the current system. This is useful for feature detection to avoid errors on unsupported devices.

Output

Returns `true` if compatible hardware is detected, otherwise `false`.

***

### getPinConsumer

Retrieves the name of the process or consumer that is currently holding a specific GPIO pin. This helps diagnose resource conflicts if a pin is busy.

Parameters

* `gpio`: The BCM pin number to check.

Example

```yaml
# gpio
17
```

Output

Returns a string with the consumer name (e.g., `'gpiod'`) or `null` if the pin is free or if the system is in simulation mode.

***

### isPinFree

Checks if a specific GPIO pin is currently free to use.

Parameters

* `gpio`: The BCM pin number to check.

Example

```yaml
# gpio
17
```

Output

Returns `true` if the pin has no active consumer, otherwise `false`.

***

### release

Forcefully releases a specific GPIO pin if it is currently locked by an internal driver instance. This can be used to recover pins that were not properly disposed of.

Parameters

* `gpio`: The BCM pin number to release.

Example

```yaml
# gpio
17
```

Output

Returns `true` if the pin was found and successfully released, otherwise `false`.

## Constructor and Member Functions

### create

Creates a new `GpioCounter` instance. This initializes the hardware connection (or simulation) and configures the counting logic.

You can configure the counter in either Average Mode or Target Mode by providing different combinations of parameters.

Parameters

* `options`: An object containing the configuration settings.
  * `gpio`: (Required) The BCM pin number connected to the sensor.
  * `direction`: (Internal/Fixed) Always set to `'in'`.
  * `pullUpDown`: Resistor configuration. Can be `'none'`, `'pullup'`, or `'pulldown'`. Defaults to `'none'`.
  * `edge`: The signal edge to count. Can be `'rising'`, `'falling'`, or `'both'`. Defaults to `'rising'`.
  * `debounceTimeout`: Hardware/Software debounce time in milliseconds to prevent false counts from noisy switches. Defaults to `10`.
  * `activeLow`: If `true`, inverts the logic (useful if your sensor outputs 0 when active). Defaults to `false`.
  * `minCount`: The minimum number of pulses required before the auto-stop watchdog logic activates. Defaults to `5`.
  * `continueAfterStop`: If `true`, the counter automatically resumes the 'counting' state when a new pulse is detected after a stop. Defaults to `true`.
  * Mode Specific Parameters:
    * `stopFactor`: (Average Mode Only) The multiplier applied to the average interval to trigger a stop. Defaults to `2.0`.
    * `targetInterval`: (Target Mode Only) The expected cycle time in seconds.
    * `deviation`: (Target Mode Only) The allowed deviation in percent (0-100) before a pulse is considered "too late".

Example 1: Average Mode

Configures a counter on GPIO 17. It will stop if a pulse takes more than 2.5 times the current average interval.

```yaml
# options
gpio: 17
pullUpDown: pullup
stopFactor: 2.5
minCount: 10
```

Example 2: Target Mode

Configures a counter on GPIO 22. It expects a pulse every 5 seconds. It will detect a stop/error if a pulse takes longer than 5.5 seconds (5s + 10% deviation).

```yaml
# options
gpio: 22
targetInterval: 5
deviation: 10
```

Output

Returns a new `GpioCounter` instance.

***

### start

Manually starts the counting process.

Normally, the counter starts automatically when the first pulse is detected. Use this function if you want to force the state to 'counting' and arm the watchdog timer immediately, even before a signal arrives.

Output

Returns `true` (void).

***

### stop

Manually stops the counting process.

This transitions the state to 'stopped' and cancels any active watchdogs. The current count is preserved.

Output

Returns `true` (void).

***

### reset

Resets the counter back to its initial state.

This sets the count to 0, clears all averages, and resets the state to 'initialized'.

You can optionally pass new configuration parameters to update the counter's logic during the reset.

Parameters

* `options`: (Optional) An object to update specific settings.
  * `minCount`
  * `stopFactor`
  * `targetInterval`
  * `deviation`
  * `continueAfterStop`

Example: Reset and change to a stricter stop factor

```yaml
# options
stopFactor: 1.5
```

Output

Returns `true` (void).

***

### onCount

Registers a listener that is triggered every time a valid pulse is counted.

This is the primary way to receive data from the counter.

Parameters

* `callback`: The function to execute on each count.

Output Payload

The callback receives an object with detailed information about the event:

```json
{
  "count": 125,
  "exceededTargetCount": 0,
  "avgInterval": 1500.5,
  "delta": 1498,
  "timestamp": 1715605000123,
  "gpio": 17
}
```

* `avgInterval`: The calculated running average time between pulses (ms).
* `delta`: The time passed since the _previous_ pulse (ms).

***

### onStateChange

Registers a listener that is triggered whenever the counter's state changes (e.g., from 'counting' to 'stopped').

Parameters

* `callback`: The function to execute on state change.

Output Payload

```json
{
  "state": "stopped",
  "previousState": "counting",
  "count": 125,
  "timestamp": 1715605005000
}
```

***

### simulatePulse

Manually simulates an input signal pulse.

This is extremely useful for testing your application logic when you are developing away from the physical hardware (Simulation Mode).

Parameters

* `value`: The signal value to simulate. Defaults to `1`.

Example

```yaml
# value
1
```

***

### getCount

Retrieves the current total count.

Output

An integer representing the number of pulses counted so far.

***

### getExceededTargetCount

Retrieves the number of times the pulse interval exceeded the configured target time (only applicable in Target Mode).

Output

An integer count of exceeded targets.

***

### getState

Retrieves the current status of the counter.

Output

A string representing the state: `'initialized'`, `'counting'`, or `'stopped'`.

***

### getAverageInterval

Retrieves the current calculated average time between pulses in milliseconds.

Output

A number representing the average interval.

***

### getData

Retrieves a comprehensive snapshot of the counter's current data.

Output

```json
{
  "state": "counting",
  "count": 500,
  "exceededTargetCount": 0,
  "avgInterval": 1200.5,
  "targetInterval": 1.2
}
```

***

### getConfiguration

Retrieves the current configuration settings of the instance.

Output

```json
{
  "minCount": 5,
  "stopFactor": 2.0,
  "targetInterval": null,
  "deviation": null,
  "continueAfterStop": true
}
```

***

### dispose

Releases the hardware resources (unexports the GPIO pin) and removes all listeners. Call this when the counter is no longer needed to prevent memory leaks or hardware conflicts.

Output

Returns `true` (void).
