---
description: >-
  Compact inline trend line over data points, with min/max and first/last indicators
---

# Sparkline

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/sparkline. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `data` | output | `Array<object>` | The data points to plot. The argument and value fields are selected in the Data settings (auto-detected on first bind). |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>data</code></summary>

```json
[
  {
    "t": 1,
    "v": 2.1
  },
  {
    "t": 2,
    "v": 2.6
  },
  {
    "t": 3,
    "v": 2.2
  },
  {
    "t": 4,
    "v": 3
  }
]
```

</details>

## Settings

Double-click the widget in the Page editor to open its settings.

### Content

| Setting | What it does | Default |
|---|---|---|
| Argument field | Field that orders the points along the sparkline; empty takes the first scanned field. |  |
| Value field | Field that gives the point values; empty takes the second scanned field. |  |
| Ignore empty points | Connects the series across missing values instead of leaving a gap. | off |
| Maximum of value axis | Top of the value axis; empty fits the data. |  |
| Minimum of value axis | Bottom of the value axis; empty fits the data. |  |

### Tooltip

| Setting | What it does | Default |
|---|---|---|
| Tooltip › Enabled | Shows the tooltip. | on |
| Tooltip › Interactive | Lets members select and copy the tooltip text. | off |
| Tooltip › Color | Background color of the tooltip; auto keeps the theme's. | automatic |
| Tooltip › arrowLength | Length of the tooltip's arrow in px. | `10` |
| Tooltip › Border radius | Rounding of the tooltip corners in px. | `4` |
| Tooltip › opacity | Opacity of the whole tooltip, 0 (clear) to 1 (solid). Range 0 to 1. | `1` |
| Tooltip › Padding left and right | Space between the tooltip's left and right borders and its text in px. | `18` |
| Tooltip › Padding top and bottom | Space between the tooltip's top and bottom borders and its text in px. | `15` |
| Tooltip › Border › Color | Color of the outline; auto keeps the theme's. | automatic |
| Tooltip › Border › Dash style | Stroke pattern of the outline. Choices: Dashed, Dotted, Dashed long, Solid. | Solid |
| Tooltip › Border › Opacity | Opacity of the outline, 0 (clear) to 1 (solid). Range 0 to 1. | `1` |
| Tooltip › Border › Visible | Shows the outline. | on |
| Tooltip › Border › Width | Thickness of the outline in px. | `1` |
| Tooltip › Font › Color | Color of the text; auto keeps the theme's. | automatic |
| Tooltip › Font › Family | Typeface of the text. Choices: `Arial`, `Roboto`, `Courier New`, `Georgia`, `Impact`, `Lucida Console`, `Tahoma`, `Times New Roman`, `Verdana`. | `Arial` |
| Tooltip › Font › Opacity | Opacity of the text, 0 (clear) to 1 (solid). Range 0 to 1. | `1` |
| Tooltip › Font › Size | Font size of the text in px. Choices: `8`, `10`, `12`, `14`, `18`, `24`, `36`, `48`. | `12` |
| Tooltip › Font › Weight | Font weight of the text, 100 (thin) to 900 (black). Range 100 to 900. | `400` |

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Type | Drawing style of the sparkline; winloss draws every value as a bar above or below the threshold. Choices: Area, Bar, Line, Spline, Spline area, Step area, Step line, Win-Loss bar. | Spline |
| Apply customized colors | Applies the colors chosen here; off keeps the theme's colors. | off |
| › Color in first and last entry | Marks the first and last points with their own color. | off |
| › First and last color | Color of the first and last point markers; auto keeps the theme's. Only when Color in first and last entry is on and customizeColors is on. | automatic |
| › Color in min and max entry | Marks the lowest and highest points with their own colors. | off |
| › Color of maximum | Color of the highest point's marker; auto keeps the theme's. Only when Color in min and max entry is on. | automatic |
| › Color of minimum | Color of the lowest point's marker; auto keeps the theme's. Only when Color in min and max entry is on. | automatic |
| Point color | Color of the point markers; auto keeps the theme's. Only when Type is Area, Line, Spline, Spline area, Step area or Step line. | automatic |
| Point size in pixels | Diameter of the point markers in px. Only when Type is Area, Line, Spline, Spline area, Step area or Step line. | `6` |
| Point symbol | Shape of the point markers. Choices: `circle`, `cross`, `polygon`, `square`, `triangle`, `triangleDown`, `triangleUp`. Only when Type is Area, Line, Spline, Spline area, Step area or Step line. | `circle` |
| Negative bar color | Color of the bars below zero; auto keeps the theme's. Only when Type is Bar. | automatic |
| Positive bar color | Color of the bars above zero; auto keeps the theme's. Only when Type is Bar. | automatic |
| Line color | Color of the line; auto keeps the theme's. Only when Type is Area, Line, Spline, Spline area, Step area or Step line. | automatic |
| Line width | Thickness of the line in px. Only when Type is Area, Line, Spline, Spline area, Step area or Step line. | `2` |
| Win color | Color of the bars above the win-loss threshold; auto keeps the theme's. Only when Type is Win-Loss bar. | automatic |
| Loss color | Color of the bars below the win-loss threshold; auto keeps the theme's. Only when Type is Win-Loss bar. | automatic |
| Win-Loss threshold | Set the value that divides wins from losses. Only when Type is Win-Loss bar. | `0` |

<!-- /generated -->
