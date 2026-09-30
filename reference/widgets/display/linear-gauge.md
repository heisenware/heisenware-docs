---
description: >-
  Horizontal or vertical bar gauge for a numeric value with sub-value marker and colored scale ranges
---

# Linear Gauge

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/linear-gauge. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties under Receives and Emits. Drop an executor's output, input or trigger onto a row to link it. An example also fills an unlinked widget as demo data in the App Builder.

{% tabs %}
{% tab title="Receives" %}
**`value`** (from an output, `number`): The main indicator value.

<details>

<summary>Example</summary>

```json
42
```

</details>

**`subValue`** (from an output, `number`): A sub-value visualized next to the value.

<details>

<summary>Example</summary>

```json
50
```

</details>

**`scale`** (from an output, `object`): Settings regarding the value range.

<details>

<summary>Example</summary>

```json
{
  "startValue": 0,
  "endValue": 100
}
```

</details>

**`frame`** (from an output, `object`): Allows you to configure the appearance of the frame.

<details>

<summary>Example</summary>

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

{% endtab %}

{% endtabs %}

## Settings

Double-click the widget in the Page editor to open its settings, grouped in these tabs. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

<details>

<summary>Frame</summary>

* **frame**: The bar around the scale: its direction, thickness, background and colored sections.
  * **Orientation**: Direction of the gauge: vertical runs bottom to top, horizontal left to right. Choices: Vertical, Horizontal. *Set per screen.*
  * **Width**: Thickness of the bar in px. Range 1 to 20.
  * **Background color**: Color of the bar where no colored section covers it; empty or auto keeps the theme's.
  * **ranges**: Colored sections of the bar, each from a start value to an end value.
    * **Start value**: Scale value where the section begins.
    * **End value**: Scale value where the section ends.
    * **Color**: Color of the section; empty takes the next color of the gauge's palette.

</details>

<details>

<summary>Indicator</summary>

* **Primary indicator**: The pointer that marks the bound value.
  * **Type**: Shape of the pointer that marks the value on the scale; each shape unlocks its own settings below. Choices: Rectangle, Rhombus, Circle, Range bar, Triangle marker, Text cloud.
  * **Color**: Color of the pointer; empty or auto keeps the theme's.
  * **Offset**: Distance between the pointer and the scale line in px; empty keeps the shape's default.
  * **Length**: Extent of the rectangle across the scale in px. Only when Type is Rectangle.
  * **Width**: Extent of the rectangle along the scale in px. Only when Type is Rectangle.
  * **Background color**: Color of the bar's track where the bar does not reach; none leaves it transparent. Only when Type is Range bar.
  * **Size**: Thickness of the range bar in px. Only when Type is Range bar.
  * **Arrow length**: Length of the arrow that joins the text cloud to the scale in px. Only when Type is Text cloud.
* **Subvalue indicator**: The pointer used for every bound sub-value.
  * **Type**: Shape of the pointer that marks the value on the scale; each shape unlocks its own settings below. Choices: Rectangle, Rhombus, Circle, Range bar, Triangle marker, Text cloud.
  * **Color**: Color of the pointer; empty or auto keeps the theme's.
  * **Offset**: Distance between the pointer and the scale line in px; empty keeps the shape's default.
  * **Length**: Extent of the rectangle across the scale in px. Only when Type is Rectangle.
  * **Width**: Extent of the rectangle along the scale in px. Only when Type is Rectangle.
  * **Background color**: Color of the bar's track where the bar does not reach; none leaves it transparent. Only when Type is Range bar.
  * **Size**: Thickness of the range bar in px. Only when Type is Range bar.
  * **Arrow length**: Length of the arrow that joins the text cloud to the scale in px. Only when Type is Text cloud.

</details>

<details>

<summary>Scale</summary>

* **Scale**: The value axis of the gauge: its bounds, numbers and tick marks.
  * **Start value**: Value at the start of the scale.
  * **End value**: Value at the end of the scale.
  * **Label**: The numbers written along the scale.
    * **Visible**: Shows the numbers along the scale.
    * **Size**: Font size of the scale numbers in px.
    * **Weight**: Font weight of the scale numbers, 100 (thin) to 900 (black). Range 100 to 900.
    * **Color**: Color of the scale numbers; empty or auto keeps the theme's.
  * **Major tick**: The main tick marks on the scale, one per labeled step.
    * **Visible**: Shows the major tick marks.
    * **Interval**: Distance between major ticks in scale units; empty lets the gauge choose.
    * **Length**: Length of each major tick in px.
  * **Minor tick**: The small tick marks between two major ticks.
    * **Visible**: Shows the minor tick marks.
    * **Interval**: Distance between minor ticks in scale units; empty lets the gauge choose.
    * **Length**: Length of each minor tick in px.

</details>

<!-- /generated -->
