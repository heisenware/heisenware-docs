# Kuando Busylight

The Kuando Busylight connector controls Kuando Busylight status indicators. It changes the light's color and brightness, makes it blink or pulse, and plays the device's built-in sounds.

This connector requires [instance creation](README.md#instance-creation) before you can control a physical unit, though it finds the connected devices without one. A Busylight hangs on a USB port on your premises, so these functions run on an [agent](../../../concepts/agents-and-where-code-runs.md) installed on the computer the light is plugged into (see the [local connection](README.md#local-connection-via-an-agent)).

## Device management

### `getDevices`

Scans the local system and lists all connected Busylight devices.

#### Parameters

None.

#### Output

Returns one entry per connected Busylight, in the order in which `deviceIndex` counts them. Each entry is the USB descriptor of the device, with keys such as `path`, `product`, `manufacturer` and `serialNumber`.

### `create`

Creates an instance to control a specific Kuando Busylight and opens the connection to it. The connection keeps itself alive until the instance is deleted. To control several lights connected to the same computer, create one instance per device, each with its own index.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>deviceIndex</code></td><td>The zero-based index of the device to control, selected from the array returned by <code>getDevices</code>. Default 0.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# deviceIndex
1
```

#### Output

Returns the name of the created instance.

{% hint style="warning" %}
An index with no device behind it still creates the instance. Light and sound commands are then accepted and nothing happens. `getName` tells you whether a device was found.
{% endhint %}

### `getName`

Retrieves the model name of the connected device.

#### Parameters

None.

#### Output

Returns the model name as a string: `Busylight Alpha model`, `Busylight Alpha model 2`, `Busylight UC model`, `Busylight Omega model` or `Busylight Omega model 2`. Returns an empty string when no device was found at the instance's index.

### `getTones`

Retrieves all available tone names supported by the connected device.

#### Parameters

None.

#### Output

Returns the playable tone names as an array of strings, in the device's own order: eleven tones on most models, twelve on the Busylight Omega model 2. Empty when no device was found.

### `delete`

Removes the instance: switches the light and the tone off, stops the keep-alive and releases the USB device.

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

Returns `true` once the color is sent to the device, `false` when the color cannot be read.

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

Returns `true` once the pulse is sent to the device, `false` when the color cannot be read.

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

Returns `true` once the blink pattern is sent to the device, `false` when the color cannot be read.

### `setLightIntensity`

Changes the brightness of the light. The device knows no brightness of its own: the connector scales the color it sends. The new intensity takes effect at once, with the color last set, and holds for every command that follows.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The light intensity in percent. Values below 0 and above 100 are clamped.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# value
50
```

#### Output

Returns nothing.

### `playTone`

Plays one of the device's built-in sounds once. The connector stops the tone when it has run its course.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The name of the tone to play, matching an item from the list returned by <code>getTones</code>.</td><td>string</td></tr><tr><td><code>volume</code></td><td>Optional volume level. Given, it becomes the volume for the tones that follow as well. Omitted, the instance's current volume applies, which starts at 3.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# name
'Open Office'
```

#### Output

Returns the tone's length in milliseconds, or `-1` when the device does not know that tone name.

### `setToneVolume`

Sets the volume for the sounds played after it.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The volume level. The device has seven steps, <code>1</code> to <code>7</code>; <code>0</code> plays the tone inaudibly. Higher values wrap around (<code>8</code> acts as <code>0</code>, <code>9</code> as <code>1</code>).</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# value
7
```

#### Output

Returns `true` once the volume is set.

### `alert`

Plays a fixed alert: the light blinks red and the device rings with "Telephone Pick Me Up". Both stop by themselves after 4.4 seconds. The alert keeps its own volume and ignores `setToneVolume`.

#### Parameters

None.

#### Output

Returns nothing.

### `off`

Switches off the light and any playing sound immediately.

#### Parameters

None.

#### Output

Returns nothing.
