---
description: >-
  Round dial gauge showing a value and sub-value markers on a configurable, color-ranged scale
---

# Circular Gauge

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/circular-gauge. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `value` | output | `number` | The main indicator value. |
| `subValue` | output | `number\|Array<number>` | A sub-value or an array of sub-values to visualize next to the value. |
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
[
  30,
  55
]
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
  "startAngle": 225,
  "endAngle": 315,
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

Double-click the widget in the Page editor to open its settings.

### Frame

| Setting | What it does | Default |
|---|---|---|
| frame › Start angle | Where the scale starts, in degrees: 0 is 9 o'clock, positive turns the start clockwise (upward), negative counter-clockwise. Range -180 to 180. | `-45` |
| frame › Circle size | Length of the arc in degrees, drawn clockwise from the start angle; 360 closes the circle. Range 0 to 360. | `270` |
| frame › Width | Thickness of the ring in px. Range 1 to 20. | `5` |
| frame › Background color | Color of the ring where no colored section covers it; empty or auto keeps the theme's. | automatic |
| frame › ranges | Colored sections of the ring, each from a start value to an end value. |  |
| frame › ranges › Start value | Scale value where the section begins. |  |
| frame › ranges › End value | Scale value where the section ends. |  |
| frame › ranges › Color | Color of the section; empty takes the next color of the gauge's palette. |  |

### Indicator

| Setting | What it does | Default |
|---|---|---|
| Primary indicator › Type | Shape of the pointer that marks the value on the scale; each shape unlocks its own settings below. Choices: Rectangle needle, Two-Color needle, Triangle needle, Range bar, Triangle marker, Text cloud. | Rectangle needle |
| Primary indicator › Width | Width of a needle or triangle marker in px; range bar and text cloud ignore it. | `2` |
| Primary indicator › Offset | Distance between the pointer and the scale line in px; empty keeps the shape's default. |  |
| Primary indicator › Color | Color of the pointer; empty or auto keeps the theme's. | automatic |
| Primary indicator › Indent from center | Gap between the center of the gauge and the start of the needle in px; negative extends the needle past the center. Only when Type is Rectangle needle. | `0` |
| Primary indicator › Spindle size | Diameter of the hub disc at the center of the needle in px. Only when Type is Rectangle needle. | `14` |
| Primary indicator › Spindle gap size | Inner diameter of the hub in px, leaving a hole that turns it into a ring. Only when Type is Rectangle needle. | `10` |
| Primary indicator › Secondary color | Color of the needle tip on a two-color needle; empty or auto keeps the theme's. Only when Type is Two-Color needle. | `#ddcc88` |
| Primary indicator › Color fraction | Share of the needle length painted in the secondary color, from the tip, 0 to 1. Only when Type is Two-Color needle. | `0.4` |
| Primary indicator › Background color | Color of the bar's track where the bar does not reach; none leaves it transparent. Only when Type is Range bar. | `none` |
| Primary indicator › Size | Thickness of the range bar in px. Only when Type is Range bar. | `10` |
| Primary indicator › Base value | Value the range bar grows from; empty grows it from the start of the scale. Only when Type is Range bar. |  |
| Primary indicator › Length | Length of the triangle marker in px, from its base to the tip pointing at the scale. Only when Type is Triangle marker. | `15` |
| Primary indicator › Arrow length | Length of the arrow that joins the text cloud to the scale in px. Only when Type is Text cloud. | `5` |
| Subvalue indicator › Type | Shape of the pointer that marks the value on the scale; each shape unlocks its own settings below. Choices: Rectangle needle, Two-Color needle, Triangle needle, Range bar, Triangle marker, Text cloud. | Triangle marker |
| Subvalue indicator › Width | Width of a needle or triangle marker in px; range bar and text cloud ignore it. | `2` |
| Subvalue indicator › Offset | Distance between the pointer and the scale line in px; empty keeps the shape's default. |  |
| Subvalue indicator › Color | Color of the pointer; empty or auto keeps the theme's. | automatic |
| Subvalue indicator › Indent from center | Gap between the center of the gauge and the start of the needle in px; negative extends the needle past the center. Only when Type is Rectangle needle. | `0` |
| Subvalue indicator › Spindle size | Diameter of the hub disc at the center of the needle in px. Only when Type is Rectangle needle. | `14` |
| Subvalue indicator › Spindle gap size | Inner diameter of the hub in px, leaving a hole that turns it into a ring. Only when Type is Rectangle needle. | `10` |
| Subvalue indicator › Secondary color | Color of the needle tip on a two-color needle; empty or auto keeps the theme's. Only when Type is Two-Color needle. | `#ddcc88` |
| Subvalue indicator › Color fraction | Share of the needle length painted in the secondary color, from the tip, 0 to 1. Only when Type is Two-Color needle. | `0.4` |
| Subvalue indicator › Background color | Color of the bar's track where the bar does not reach; none leaves it transparent. Only when Type is Range bar. | `none` |
| Subvalue indicator › Size | Thickness of the range bar in px. Only when Type is Range bar. | `10` |
| Subvalue indicator › Base value | Value the range bar grows from; empty grows it from the start of the scale. Only when Type is Range bar. |  |
| Subvalue indicator › Length | Length of the triangle marker in px, from its base to the tip pointing at the scale. Only when Type is Triangle marker. | `15` |
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
