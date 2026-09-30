---
description: >-
  Background surface placed behind other elements, with bindable color, border and elevation
---

# Card

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/card. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `variant` | output | `'elevation'\|'outlined'` | The global appearance of the card. |
| `backgroundColor` | output | `string` | Any valid CSS color defining the background. |
| `opacity` | output | `number` | Transparency from 0 (transparent) to 1 (opaque) |
| `borderRadius` | output | `string\|number` | Any valid CSS identifier to define the border radius. |
| `border` | output | `object` | An object, defining the border. |
| `elevation` | output | `'theme'\|'flat'\|'low'\|'medium'\|'high'` | The visual height above the background. |
| `style` | output | `object` | Arbitrary CSS key / value instructions. |
| `props` | output | `object` | Facilitates setting several properties at once. |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>variant</code></summary>

```json
"outlined"
```

</details>

<details>

<summary><code>backgroundColor</code></summary>

```json
"#f5f7fa"
```

</details>

<details>

<summary><code>opacity</code></summary>

```json
0.9
```

</details>

<details>

<summary><code>borderRadius</code></summary>

```json
12
```

</details>

<details>

<summary><code>border</code></summary>

```json
{
  "width": 1,
  "color": "#62a378",
  "style": "dashed"
}
```

</details>

<details>

<summary><code>elevation</code></summary>

```json
"medium"
```

</details>

<details>

<summary><code>style</code></summary>

```json
{
  "padding": "8px"
}
```

</details>

<details>

<summary><code>props</code></summary>

```json
{
  "backgroundColor": "#ffffff",
  "opacity": 1
}
```

</details>

## Settings

Double-click the widget in the Page editor to open its settings.

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Surface style | Elevation raises the card with a shadow (see elevation); outlined draws a border instead (see border). Choices: `elevation`, `outlined`. | `elevation` |
| Background color | Fill color of the card as a CSS color; auto or empty keeps the theme's tile color. | automatic |
| Opacity | Transparency of the whole card from 0 (invisible) to 1 (solid). Range 0 to 1. | `1` |
| Corner radius | Rounding of the corners, from square to circle; theme keeps the theme's radius. Choices: Theme, Square, Low, Medium, High, Circle. | Theme |
| Custom CSS overrides | Raw CSS properties applied to the card. |  |
| Custom CSS overrides › Property | CSS property in camelCase, e.g. zIndex or cursor. |  |
| Custom CSS overrides › Value | Value of that property, e.g. 100 or pointer. |  |
| Elevation | Shadow depth under the card, from flat (none) to high; theme keeps the theme's shadow. Choices: Theme, Flat, Low, Medium, High. Only when Surface style is `elevation`. | Theme |
| Border › Width | Line width in px. Only when Surface style is `outlined`. | `1` |
| Border › Color | Line color; auto or empty keeps the theme's border color. Only when Surface style is `outlined`. | automatic |
| Border › Style | Solid, dashed or dotted line. Choices: `solid`, `dashed`, `dotted`. Only when Surface style is `outlined`. | `solid` |

<!-- /generated -->
