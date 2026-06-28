# Kuando Busylight

The `Busylight` class provides a high-level interface to control Kuando Busylight devices. It allows you to change the light's color and brightness, make it blink or pulse, and play various built-in sounds to indicate status.

You must create an instance of this class to control a specific device connected to your computer.

### getDevices

This is a static function that scans the system and returns a list of all connected Busylight devices.

Output

An array of device objects, where each object contains details about a connected Busylight.

***

### create

Creates an instance to control a specific Busylight device found on the system.

Parameters

* `deviceIndex`: The zero-based index of the device to control from the list returned by `getDevices()`. Defaults to `0`.

Example

```yaml
# deviceIndex
0
```

### getName

Retrieves the model name of the connected device.

Output

A string representing the device name (e.g., "Busylight Omega model 2").

### getTones

Retrieves a list of all available sound/tone names for the connected device.

Output

An array of strings, where each string is the name of a playable tone.

### setLightIntensity

Changes the brightness of the light. This setting is applied to all subsequent light commands.

Parameters

* `value`: The light intensity as a percentage (from `0` to `100`).

Example

```yaml
# value
50
```

### setToneVolume

Sets the volume for sounds played by the device.

Parameters

* `value`: The volume level (from `0` to `10`).

Example

```yaml
# value
7
```

### setColor

Turns the light on with a solid, specified color.

Parameters

* `color`: The desired color, which can be provided in any CSS-compatible format (e.g., `#ff0000`, `rgb(255, 0, 0)`, or `red`).

Example

```yaml
# color
'#0000FF'
```

### pulse

Makes the light gently fade in and out with the specified color.

Parameters

* `color`: The color to pulse.

Example

```yaml
# color
orange
```

### blink

Makes the light blink with the specified color and timing.

Parameters

* `color`: The color to blink.
* `onDuration`: The time in seconds to keep the light on during each blink. Defaults to `0.5`.
* `offDuration`: The time in seconds to keep the light off during each blink. Defaults to `0.3`.

Example

```yaml
# color
red
# onDuration
0.2
# offDuration
0.2
```

#### playTone

Plays one of the device's built-in sounds once.

Parameters

* `name`: The name of the tone to play (from the list returned by `getTones()`).
* `volume`: An optional volume level (`0` to `10`). If not provided, the last set volume is used.

Example

```yaml
# name
'Open Office'
```

### alert

Triggers a pre-configured alert sequence, combining a flashing red light and a specific tone to grab attention. The alert automatically turns off after a few seconds.

### off

Switches off both the light and any playing sound immediately.
