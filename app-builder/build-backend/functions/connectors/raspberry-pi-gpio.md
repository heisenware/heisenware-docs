# Raspberry Pi GPIO

The `GpioPin5` class is a specialized controller designed specifically for the Raspberry Pi 5. It interacts directly with the new RP1 Southbridge architecture (Chip 4) to control General Purpose Input/Output (GPIO) pins.

Use this class when running your application on a Raspberry Pi 5 to read sensors, control LEDs, or interact with other hardware components. It includes software-based polling for detecting value changes (interrupts) and manages pin ownership to prevent conflicts.

You must create an instance of this class to control a specific pin.

## Static Functions

### isAccessible

Checks if the specific GPIO hardware (the RP1 chip used on Raspberry Pi 5) is present and accessible on the current system.

Output

Returns `true` if the system is a Raspberry Pi 5 with accessible GPIO, otherwise `false`.

### getPinConsumer

Checks if a specific GPIO pin is currently being used by another process or driver, and if so, returns the name of that consumer.

Parameters

* `gpio`: The GPIO pin number (BCM numbering).

Example

```yaml
# gpio
17
```

Output

Returns the name of the consumer (e.g., `'GpioPin5'`, `'spi0'`) as a string, or `null` if the pin is free.

### isPinFree

A convenience function to check if a specific GPIO pin is currently available for use.

Parameters

* `gpio`: The GPIO pin number (BCM numbering).

Example

```yaml
# gpio
22
```

Output

Returns `true` if the pin is free, `false` if it is busy.

### release

Forcefully releases a GPIO pin if it is currently held by an internal `GpioPin5` instance. This is useful for cleaning up resources if a pin was not disposed of correctly.

Parameters

* `gpio`: The GPIO pin number to release.

Example

```yaml
# gpio
17
```

Output

Returns `true` if the pin was found and released, `false` otherwise.

## Constructor and Member Functions

### create

Creates a new instance to control a specific GPIO pin. This initializes the pin with the specified direction and behavior settings.

Parameters

* `options`: An object containing the configuration for the pin.
  * `gpio`: The GPIO pin number (BCM).
  * `direction`: How the pin should behave.
    * `'in'`: Input mode (for reading values).
    * `'out'`: Output mode (initialized to 0).
    * `'high'`: Output mode (initialized to 1).
    * `'low'`: Output mode (initialized to 0).
  * `pullUpDown`: Internal resistor configuration (`'none'`, `'pullup'`, `'pulldown'`). _Note: On RPi 5, software control of bias is limited; system-level configuration is often required._
  * `edge`: For input pins, defines which changes trigger an event (`'rising'`, `'falling'`, `'both'`). Defaults to `'rising'`.
  * `debounceTimeout`: Time in milliseconds to wait for the signal to stabilize. Defaults to `10`.
  * `activeLow`: If `true`, inverts the logic (1 becomes 0, 0 becomes 1). Defaults to `false`.
  * `pollInterval`: The interval in milliseconds for checking the pin state. Defaults to `5`.

Example 1: Configure an Output Pin (e.g., for an LED)

```yaml
# options
gpio: 17
direction: 'out'
```

Example 2: Configure an Input Pin (e.g., for a Button)

```yaml
# options
gpio: 27
direction: 'in'
pullUpDown: 'pullup'
edge: 'falling'
debounceTimeout: 50
```

Output

Returns a new `GpioPin5` instance.

### write

Asynchronously sets the value of an output pin.

Parameters

* `value`: The value to write. Accepts `0`, `1`, `true`, or `false`.

Example

```yaml
# value
1
```

Output

Returns `null` (resolves the promise) when the write is complete.

### read

Synchronously reads the current value of the pin.

Output

Returns `0` or `1`.

### onChange

Registers a listener to monitor the pin for changes. The listener is triggered when the pin's value changes according to the `edge` configuration set in the constructor.

Parameters

* `listener`: The function to execute when the event occurs. The function receives the new value (`0` or `1`) as an argument.

Output

Returns the string `'subscribed'`.

### removeListeners

Removes all active listeners and stops the internal polling loop used to detect changes.

Returns `true`.

### dispose

Releases the GPIO pin, freeing the hardware resource and cleaning up all internal listeners and timers.

Returns `true`.
