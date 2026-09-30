---
description: >-
  Horizontal or vertical bar gauge for a numeric value with sub-value marker and colored scale ranges
---

# Linear Gauge

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/linear-gauge. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `value` | output | `number` | The main indicator value. |
| `subValue` | output | `number` | A sub-value visualized next to the value. |
| `scale` | output | `object` | Settings regarding the value range. |
| `frame` | output | `object` | Allows you to configure the appearance of the frame. |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>value</code></summary>

```json
42
```

</details>

<details>

<summary><code>subValue</code></summary>

```json
50
```

</details>

<details>

<summary><code>scale</code></summary>

```json
{
  "startValue": 0,
  "endValue": 100
}
```

</details>

<details>

<summary><code>frame</code></summary>

```json
{
  "ranges": [
    {
      "startValue": 0,
      "endValue": 60,
      "color": "#19914b"
    },
    {
      "startValue": 60,
      "endValue": 100,
      "color": "#dc2828"
    }
  ]
}
```

</details>

## Settings

Double-click the widget in the Page editor to open its settings. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

### Frame

| Setting | What it does | Default |
|---|---|---|
| frame › Orientation | Direction of the gauge: vertical runs bottom to top, horizontal left to right. Choices: Vertical, Horizontal. *Set per screen.* | Vertical |
| frame › Width | Thickness of the bar in px. Range 1 to 20. | `5` |
| frame › Background color | Color of the bar where no colored section covers it; empty or auto keeps the theme's. | automatic |
| frame › ranges | Colored sections of the bar, each from a start value to an end value. |  |
| frame › ranges › Start value | Scale value where the section begins. |  |
| frame › ranges › End value | Scale value where the section ends. |  |
| frame › ranges › Color | Color of the section; empty takes the next color of the gauge's palette. |  |

### Indicator

| Setting | What it does | Default |
|---|---|---|
| Primary indicator › Type | Shape of the pointer that marks the value on the scale; each shape unlocks its own settings below. Choices: Rectangle, Rhombus, Circle, Range bar, Triangle marker, Text cloud. | Rectangle |
| Primary indicator › Color | Color of the pointer; empty or auto keeps the theme's. |  |
| Primary indicator › Offset | Distance between the pointer and the scale line in px; empty keeps the shape's default. |  |
| Primary indicator › Length | Extent of the rectangle across the scale in px. Only when Type is Rectangle. | `15` |
| Primary indicator › Width | Extent of the rectangle along the scale in px. Only when Type is Rectangle. | `15` |
| Primary indicator › Background color | Color of the bar's track where the bar does not reach; none leaves it transparent. Only when Type is Range bar. | `none` |
| Primary indicator › Size | Thickness of the range bar in px. Only when Type is Range bar. | `10` |
| Primary indicator › Arrow length | Length of the arrow that joins the text cloud to the scale in px. Only when Type is Text cloud. | `5` |
| Subvalue indicator › Type | Shape of the pointer that marks the value on the scale; each shape unlocks its own settings below. Choices: Rectangle, Rhombus, Circle, Range bar, Triangle marker, Text cloud. | Triangle marker |
| Subvalue indicator › Color | Color of the pointer; empty or auto keeps the theme's. |  |
| Subvalue indicator › Offset | Distance between the pointer and the scale line in px; empty keeps the shape's default. |  |
| Subvalue indicator › Length | Extent of the rectangle across the scale in px. Only when Type is Rectangle. | `15` |
| Subvalue indicator › Width | Extent of the rectangle along the scale in px. Only when Type is Rectangle. | `15` |
| Subvalue indicator › Background color | Color of the bar's track where the bar does not reach; none leaves it transparent. Only when Type is Range bar. | `none` |
| Subvalue indicator › Size | Thickness of the range bar in px. Only when Type is Range bar. | `10` |
| Subvalue indicator › Arrow length | Length of the arrow that joins the text cloud to the scale in px. Only when Type is Text cloud. | `5` |

### Scale

| Setting | What it does | Default |
|---|---|---|
| Scale › Start value | Value at the start of the scale. | `0` |
| Scale › End value | Value at the end of the scale. | `100` |
| Scale › Label › Visible | Shows the numbers along the scale. | on |
| Scale › Label › Size | Font size of the scale numbers in px. | `12` |
| Scale › Label › Weight | Font weight of the scale numbers, 100 (thin) to 900 (black). Range 100 to 900. | `400` |
| Scale › Label › Color | Color of the scale numbers; empty or auto keeps the theme's. | automatic |
| Scale › Major tick › Visible | Shows the major tick marks. | on |
| Scale › Major tick › Interval | Distance between major ticks in scale units; empty lets the gauge choose. |  |
| Scale › Major tick › Length | Length of each major tick in px. | `5` |
| Scale › Minor tick › Visible | Shows the minor tick marks. | off |
| Scale › Minor tick › Interval | Distance between minor ticks in scale units; empty lets the gauge choose. |  |
| Scale › Minor tick › Length | Length of each minor tick in px. | `3` |

<!-- /generated -->
