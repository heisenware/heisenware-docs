---
description: >-
  Pie or doughnut chart of categorical shares from data rows, with clickable slices
---

# Pie Chart

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/pie-chart. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `data` | output | `Array<object>` | The slices to plot. The argument and value fields are selected in the Data settings (auto-detected on first bind). |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>data</code></summary>

```json
[
  {
    "material": "steel",
    "share": 52
  },
  {
    "material": "aluminium",
    "share": 31
  },
  {
    "material": "plastic",
    "share": 17
  }
]
```

</details>

## Settings

Double-click the widget in the Page editor to open its settings. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

### Content

| Setting | What it does | Default |
|---|---|---|
| Argument field | Field that names the slices. |  |
| Value field | Field that sizes the slices. |  |
| Unit | Text appended to every slice label after the value, e.g. %; empty appends nothing. |  |
| Display label infront of value | Puts the slice name and a colon before the value in every slice label. | on |

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Title | Title shown above the chart; empty shows none. |  |
| Chart type | Full disc or a ring with a hollow center half the radius wide. Choices: Pie, Doughnut. | Pie |
| Show tooltips | Shows a popup with name and value when hovering a slice. | on |
| Show labels | Shows a value label on every slice; slices with value 0 get none. *Set per screen.* | on |
| Label position | Placement of the slice labels: on the slice, aligned in columns beside the pie, or outside next to it. Choices: Inside, Columns, Outside. *Set per screen.* | Columns |
| Inner margin | Empty space between the pie and the widget edge in px. | `0` |
| Palette | Colors given to the slices in order; empty keeps the default palette. |  |

### Legend

| Setting | What it does | Default |
|---|---|---|
| Visible | Shows the legend. *Set per screen.* | on |
| Title | Title shown above the legend items; empty shows none. |  |
| Vertical alignment | Vertical placement of the legend block in the widget. Choices: Top, Bottom. *Set per screen.* | Top |
| Horizontal alignment | Horizontal placement of the legend block in the widget. Choices: Right, Center, Left. *Set per screen.* | Right |
| Orientation | Stacks legend items in a column or lays them in a row; empty picks a row when centered, else a column. Choices: Vertical, Horizontal. *Set per screen.* | Vertical |
| Marker size | Size of the color marker in every legend item in px. Range 10 to 40. | `20` |

<!-- /generated -->
