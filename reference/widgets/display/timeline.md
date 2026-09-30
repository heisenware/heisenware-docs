---
description: >-
  State-over-time bars per field across up to six bound data sources, with category colors
---

# Timeline

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/timeline. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties under Receives and Emits. Drop an executor's output, input or trigger onto a row to link it. An example also fills an unlinked widget as demo data in the App Builder.

{% tabs %}
{% tab title="Receives" %}
**`data`** (from an output, `Array<object>`): The data source for timelines. Use an array of objects. Each object must be of identical structure/schema, but may contain multiple properties allowing to plot multiple tracks in one timeline.

<details>

<summary>Example</summary>

```json
[
  {
    "timestamp": "2026-08-12T10:00:00Z",
    "pressure": 2.4,
    "temperature": 61.3
  },
  {
    "timestamp": "2026-08-12T10:05:00Z",
    "pressure": 2.7,
    "temperature": 62.1
  },
  {
    "timestamp": "2026-08-12T10:10:00Z",
    "pressure": 2.5,
    "temperature": 61.8
  }
]
```

</details>

**`data2`** (from an output, `Array<object>`): The data source for timelines. Use an array of objects. Each object must be of identical structure/schema, but may contain multiple properties allowing to plot multiple tracks in one timeline.

<details>

<summary>Example</summary>

```json
[
  {
    "timestamp": "2026-08-12T10:00:00Z",
    "pressure": 2.4,
    "temperature": 61.3
  },
  {
    "timestamp": "2026-08-12T10:05:00Z",
    "pressure": 2.7,
    "temperature": 62.1
  },
  {
    "timestamp": "2026-08-12T10:10:00Z",
    "pressure": 2.5,
    "temperature": 61.8
  }
]
```

</details>

**`data3`** (from an output, `Array<object>`): The data source for timelines. Use an array of objects. Each object must be of identical structure/schema, but may contain multiple properties allowing to plot multiple tracks in one timeline.

<details>

<summary>Example</summary>

```json
[
  {
    "timestamp": "2026-08-12T10:00:00Z",
    "pressure": 2.4,
    "temperature": 61.3
  },
  {
    "timestamp": "2026-08-12T10:05:00Z",
    "pressure": 2.7,
    "temperature": 62.1
  },
  {
    "timestamp": "2026-08-12T10:10:00Z",
    "pressure": 2.5,
    "temperature": 61.8
  }
]
```

</details>

**`data4`** (from an output, `Array<object>`): The data source for timelines. Use an array of objects. Each object must be of identical structure/schema, but may contain multiple properties allowing to plot multiple tracks in one timeline.

<details>

<summary>Example</summary>

```json
[
  {
    "timestamp": "2026-08-12T10:00:00Z",
    "pressure": 2.4,
    "temperature": 61.3
  },
  {
    "timestamp": "2026-08-12T10:05:00Z",
    "pressure": 2.7,
    "temperature": 62.1
  },
  {
    "timestamp": "2026-08-12T10:10:00Z",
    "pressure": 2.5,
    "temperature": 61.8
  }
]
```

</details>

**`data5`** (from an output, `Array<object>`): The data source for timelines. Use an array of objects. Each object must be of identical structure/schema, but may contain multiple properties allowing to plot multiple tracks in one timeline.

<details>

<summary>Example</summary>

```json
[
  {
    "timestamp": "2026-08-12T10:00:00Z",
    "pressure": 2.4,
    "temperature": 61.3
  },
  {
    "timestamp": "2026-08-12T10:05:00Z",
    "pressure": 2.7,
    "temperature": 62.1
  },
  {
    "timestamp": "2026-08-12T10:10:00Z",
    "pressure": 2.5,
    "temperature": 61.8
  }
]
```

</details>

**`data6`** (from an output, `Array<object>`): The data source for timelines. Use an array of objects. Each object must be of identical structure/schema, but may contain multiple properties allowing to plot multiple tracks in one timeline.

<details>

<summary>Example</summary>

```json
[
  {
    "timestamp": "2026-08-12T10:00:00Z",
    "pressure": 2.4,
    "temperature": 61.3
  },
  {
    "timestamp": "2026-08-12T10:05:00Z",
    "pressure": 2.7,
    "temperature": 62.1
  },
  {
    "timestamp": "2026-08-12T10:10:00Z",
    "pressure": 2.5,
    "temperature": 61.8
  }
]
```

</details>

{% endtab %}

{% endtabs %}

## Settings

Double-click the widget in the Page editor to open its settings, grouped in these tabs. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

<details>

<summary>Tracks</summary>

* **Time/Date field**: Field holding the timestamp of each record.
* **Timeline tracks**: Rows of the timeline, one per value field; fields found in the bound data are added at design time.
  * **Track name (y-axis label)**: Label of the row on the track axis; empty shows the value field.
  * **Value field**: Field whose runs of equal values form the colored blocks; each distinct value is a category.
  * **Show labels**: Prints the category name inside each block of the track.

</details>

<details>

<summary>Colors</summary>

* **Category colors**: Color per category value found in the data, plus a fallback color.
  * **Fallback color**: Color for categories without their own entry; auto or empty takes the theme's accent background.

</details>

<details>

<summary>Legend</summary>

* **Visible**: Shows the legend of categories. *Set per screen.*
* **Title**: Heading above the legend items; empty shows none.
* **Subtitle**: Line under the legend title; shown only with a title.
* **Vertical alignment**: Puts the legend at the top or bottom of the chart. Choices: Top, Bottom. *Set per screen.*
* **Horizontal alignment**: Puts the legend at the left, center or right of the chart. Choices: Right, Center, Left. *Set per screen.*
* **Item text position**: Side of the color marker its text is on; empty picks it from the orientation. Choices: Top, Bottom, Left, Right.
* **Position**: outside keeps the legend beside the plot, inside draws it over the plot area. Choices: Outside, Inside. *Set per screen.*
* **Orientation**: Lays the entries out in a column or a row; empty picks it from the alignment. Choices: Vertical, Horizontal. *Set per screen.*

</details>

<details>

<summary>Look &amp; feel</summary>

* **Timeline end boundary**: Where each track's last block ends: at the current time (live), or 2 % of the data span past the last data point (snapshot). Choices: Current time (live monitoring), Last point (historical snapshot).
* **Zoom and pan**: none fixes the time axis; selectable adds a lock button that turns wheel zoom and drag pan on; enabled has them always on. Choices: Disabled, Selectable (requires click), Always enabled. *Set per screen.*
* **Rotate plot**: Draws the tracks as columns with time running upward; off, tracks are rows with time running left to right. *Set per screen.*
* **Show vertical grid lines**: Draws grid lines at the ticks of the time axis.
* **Show y-axis track labels**: Draws the axis line along the track names; the names themselves always show.
* **Show tooltips**: Shows a tooltip with category, start and end time when hovering a block.
* **Enable crosshair**: Shows crosshair lines with axis labels following the pointer. *Set per screen.*

</details>

<!-- /generated -->
