# Kuando Busylight

The Kuando Busylight connector controls Kuando Busylight status indicators. It changes the light's color and brightness, makes it blink or pulse, and plays the device's built-in sounds.

This connector requires [instance creation](./#instance-creation) before you can control a physical unit, though it includes a static utility for device scanning. Because a Busylight is a physical USB device on your premises, this function typically executes inside an [Agent](../../agents/) installed on the local computer where the light is connected (see the [local connection scenario](./#local-connection-via-agent)).

## Device management

### `getDevices`

Scans the local system and lists all connected Busylight devices.

#### Parameters

None.

#### Output

Returns an array of device objects containing detailed schema and tracking properties for each connected Busylight.

### `create`

Creates an instance to control a specific Kuando Busylight and establishes a connection to it. To control multiple lights connected to the same computer, create one instance per device using its respective index.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>deviceIndex</code></td><td>The zero-based index of the device to control, selected from the array returned by <code>getDevices</code>. Default 0.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# deviceIndex
0
```

#### Output

Returns the device control instance. Throws an error if configuration or connection fails.

### `getName`

Retrieves the model name of the connected device.

#### Parameters

None.

#### Output

Returns the device model name as a string (such as `Busylight Omega model 2`).

### `getTones`

Retrieves all available tone names supported by the connected device.

#### Parameters

None.

#### Output

Returns an array of strings containing the names of all playable tones.

### `delete`

Removes the instance and disconnects from the device.

{% hint style="danger" %}
#### Irreversible action

Deleting an instance removes its configuration. To control the device again, you must trigger `create` anew.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` upon removal.

## Light and sound

### `setColor`

Turns on the light with a solid, continuous color.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>color</code></td><td>The desired color in any CSS-compatible format (such as <code>#ff0000</code>, <code>rgb(255, 0, 0)</code>, or <code>red</code>).</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# color
'#0000FF'
```

#### Output

Returns nothing.

### `pulse`

Fades the light in and out smoothly using the specified color.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>color</code></td><td>The color to pulse, provided in any CSS-compatible format.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# color
orange
```

#### Output

Returns nothing.

### `blink`

Flashes the light using the specified color and timing configuration.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>color</code></td><td>The color to blink, provided in any CSS-compatible format.</td><td>string</td></tr><tr><td><code>onDuration</code></td><td>The time in seconds the light stays on during each blink cycle. Default 0.5.</td><td>number</td></tr><tr><td><code>offDuration</code></td><td>The time in seconds the light stays off during each blink cycle. Default 0.3.</td><td>number</td></tr></tbody></table>

#### Example

```yaml
# color
red
# onDuration
0.2
# offDuration
0.2
```

#### Output

Returns nothing.

### `setLightIntensity`

Changes the brightness of the light. The new intensity applies immediately to the active light state and overrides the default for subsequent commands.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The light intensity measured in percent (0 to 100).</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# value
50
```

#### Output

Returns nothing.

### `playTone`

Plays one of the device's built-in sounds once.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The name of the tone to play, matching an item from the list returned by <code>getTones</code>.</td><td>string</td></tr><tr><td><code>volume</code></td><td>Optional volume level (0 to 10). If provided, this value also sets the new default volume. If omitted, the connector uses the last configured volume. Default 3.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# name
'Open Office'
```

#### Output

Returns nothing.

### `setToneVolume`

Sets the default volume for all sounds played by the device.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The target volume level (0 to 10).</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# value
7
```
