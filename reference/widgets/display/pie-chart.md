---
description: >-
  Pie or doughnut chart of categorical shares from data rows, with clickable slices
---

# Pie Chart

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/pie-chart. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties under Receives and Emits. Drop an executor's output, input or trigger onto a row to link it. An example also fills an unlinked widget as demo data in the App Builder.

{% tabs %}
{% tab title="Receives" %}
**`data`** (from an output, `Array<object>`): The slices to plot. The argument and value fields are selected in the Data settings (auto-detected on first bind).

<details>

<summary>Example</summary>

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

{% endtab %}

{% endtabs %}

## Settings

Double-click the widget in the Page editor to open its settings, grouped in these tabs. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

<details>

<summary>Content</summary>

* **Argument field**: Field that names the slices.
* **Value field**: Field that sizes the slices.
* **Unit**: Text appended to every slice label after the value, e.g. %; empty appends nothing.
* **Display label infront of value**: Puts the slice name and a colon before the value in every slice label.

</details>

<details>

<summary>Look &amp; feel</summary>

* **Title**: Title shown above the chart; empty shows none.
* **Chart type**: Full disc or a ring with a hollow center half the radius wide. Choices: Pie, Doughnut.
* **Show tooltips**: Shows a popup with name and value when hovering a slice.
* **Show labels**: Shows a value label on every slice; slices with value 0 get none. *Set per screen.*
* **Label position**: Placement of the slice labels: on the slice, aligned in columns beside the pie, or outside next to it. Choices: Inside, Columns, Outside. *Set per screen.*
* **Inner margin**: Empty space between the pie and the widget edge in px.
* **Palette**: Colors given to the slices in order; empty keeps the default palette.

</details>

<details>

<summary>Legend</summary>

* **Visible**: Shows the legend. *Set per screen.*
* **Title**: Title shown above the legend items; empty shows none.
* **Vertical alignment**: Vertical placement of the legend block in the widget. Choices: Top, Bottom. *Set per screen.*
* **Horizontal alignment**: Horizontal placement of the legend block in the widget. Choices: Right, Center, Left. *Set per screen.*
* **Orientation**: Stacks legend items in a column or lays them in a row; empty picks a row when centered, else a column. Choices: Vertical, Horizontal. *Set per screen.*
* **Marker size**: Size of the color marker in every legend item in px. Range 10 to 40.

</details>

<!-- /generated -->
