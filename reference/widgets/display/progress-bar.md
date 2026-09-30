---
description: >-
  Progress bar filling between configurable min and max, with optional percentage status text
---

# Progress Bar

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/progress. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `value` | output | `number` | The current progress value (between the configured `min` and `max`). |
| `min` | output | `number` | Lower bound of the scale. |
| `max` | output | `number` | Upper bound of the scale. |
| `showStatus` | output | `boolean` | Show the percentage status text. |
| `color` | output | `string` | Any valid CSS color for the bar (overrides the configured color). |
| `props` | output | `object` | Facilitates setting several properties at once, e.g. `{ "min": 0, "max": 200, "showStatus": true, "color": "#dc2828" }`. The bundle wins over the individually linked channels. |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>value</code></summary>

```json
67
```

</details>

<details>

<summary><code>min</code></summary>

```json
0
```

</details>

<details>

<summary><code>max</code></summary>

```json
200
```

</details>

<details>

<summary><code>showStatus</code></summary>

```json
true
```

</details>

<details>

<summary><code>color</code></summary>

```json
"#dc2828"
```

</details>

<details>

<summary><code>props</code></summary>

```json
{
  "min": 0,
  "max": 200,
  "showStatus": true
}
```

</details>

## Settings

Double-click the widget in the Page editor to open its settings. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Minimum | Value at which the bar is empty (0%). | `0` |
| Maximum | Value at which the bar is full (100%). | `1` |
| Show status | Shows the percentage text next to the bar. | on |
| Bar width | Thickness of the bar in px. Range 2 to 40. *Set per screen.* | `4` |
| Color | Fill color of the bar; empty or auto keeps the theme's accent. | automatic |

<!-- /generated -->
