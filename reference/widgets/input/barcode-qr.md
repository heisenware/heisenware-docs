---
description: >-
  Scans barcodes and QR codes with the device camera, single or multiple capture mode
---

# Barcode / QR

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/barcode. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `clear` | output | `any` | Clears all captured barcodes on truthy values. |
| `button` | output | `object` | Configures the scan button. |

### Emits

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `text` | input | `string\|Array<string>` | The scanned result: a single barcode text in `single` scan mode, or an array of all captured texts when saving in `multiple` mode. Writes `''` when cleared. |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>clear</code></summary>

```json
true
```

</details>

<details>

<summary><code>button</code></summary>

```json
{
  "text": "Scan now",
  "type": "success",
  "stylingMode": "contained"
}
```

</details>

## Settings

Double-click the widget in the Page editor to open its settings. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Scan mode | Single writes the first code read and closes the camera; multiple collects codes until the check button writes them as an array. Choices: Single, Multiple. | Single |
| button › Button Text | Label shown on the button; empty shows none. | `Scan Now` |
| button › Icon | Font Awesome class of an icon shown left of the label, e.g. fa-light fa-camera; empty shows none. |  |
| button › Text Size | Font size of the label in px. Range 8 to 40. *Set per screen.* | `14` |
| button › Icon Size | Size of the icon in px. Range 20 to 100. *Set per screen.* | `20` |
| button › Button Type | Color scheme: default uses the accent color, normal is neutral, success green, danger red. Choices: `default`, `normal`, `success`, `danger`. | `default` |
| button › Styling Mode | Contained fills the button with its color, outlined draws only a border, text shows the label alone. Choices: `text`, `contained`, `outlined`. | `contained` |
| button › Hover Text | Tooltip shown while the pointer rests on the button; empty shows the label or nothing. |  |
| button › Initially Disabled | Starts the button greyed out and unclickable until a bound button value enables it. | off |

<!-- /generated -->
