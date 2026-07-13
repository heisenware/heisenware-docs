# Kuando Busylight

The Kuando Busylight connector controls Kuando Busylight status indicators. It changes the light's color and brightness, makes it blink or pulse, and plays the device's built-in sounds.

Create an instance to control a specific device. Since a Busylight is a USB device on your premises, this class typically runs inside an [Agent](../../agents/) installed on the computer the light is connected to (see [connection scenarios](./#local-connection-via-agent)).

## Device management

### `getDevices`

A static function that scans the system and returns all connected Busylight devices.

#### Parameters

None.

#### Output

An array of device objects, each with details about a connected Busylight.

### `create`

Creates an instance controlling one specific Busylight and connects to it. To control several lights on the same computer, create one instance per device with its respective index.

#### Parameters

<table><thead><tr><th width="140">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>deviceIndex</code></td><td>The zero-based index of the device to control, from the list returned by <code>getDevices</code>. Default <code>0</code>.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# deviceIndex
0
```

### `getName`

Retrieves the model name of the connected device.

#### Parameters

None.

#### Output

A string with the device name (e.g. `Busylight Omega model 2`).

### `getTones`

Retrieves all available tone names of the connected device.

#### Parameters

None.

#### Output

An array of strings, each the name of a playable tone.

### `delete`

Removes the instance.

{% hint style="danger" %}
Deleting an instance removes its configuration. To control the device again, trigger `create` anew.
{% endhint %}

## Light and sound

### `setColor`

Turns the light on with a solid color.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>color</code></td><td>The desired color in any CSS-compatible format (e.g. <code>#ff0000</code>, <code>rgb(255, 0, 0)</code>, or <code>red</code>).</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# color
'#0000FF'
```

### `pulse`

Makes the light gently fade in and out with the specified color.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>color</code></td><td>The color to pulse, in any CSS-compatible format.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# color
orange
```

### `blink`

Makes the light blink with the specified color and timing.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>color</code></td><td>The color to blink, in any CSS-compatible format.</td><td>string</td></tr><tr><td><code>onDuration</code></td><td>The time in seconds the light stays on during each blink. Default <code>0.5</code>.</td><td>number</td></tr><tr><td><code>offDuration</code></td><td>The time in seconds the light stays off during each blink. Default <code>0.3</code>.</td><td>number</td></tr></tbody></table>

#### Example

```yaml
# color
red
# onDuration
0.2
# offDuration
0.2
```

### `setLightIntensity`

Changes the brightness of the light. The new intensity applies immediately to the current light and to all subsequent light commands.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The light intensity in percent (0 to 100).</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# value
50
```

### `playTone`

Plays one of the device's built-in sounds once.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The name of the tone to play, from the list returned by <code>getTones</code>.</td><td>string</td></tr><tr><td><code>volume</code></td><td>Optional volume level (0 to 10). If provided, it also becomes the new default volume. If omitted, the last set volume is used (initially <code>3</code>).</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# name
'Open Office'
```

### `setToneVolume`

Sets the default volume for sounds played by the device.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The volume level (0 to 10).</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# value
7
```

#### Output

Returns `true` once set.

### `alert`

Triggers a pre-configured alert sequence combining a flashing red light and a tone to grab attention. The alert switches off automatically after about 4 seconds.

#### Parameters

None.

### `off`

Switches off both the light and any playing sound immediately.

#### Parameters

None.
