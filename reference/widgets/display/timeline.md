---
description: >-
  State-over-time bars per field across up to six bound data sources, with category colors
---

# Timeline

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/timeline. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `data` | output | `Array<object>` | The data source for timelines. Use an array of objects. Each object must be of identical structure/schema, but may contain multiple properties allowing to plot multiple tracks in one timeline. |
| `data2` | output | `Array<object>` | The data source for timelines. Use an array of objects. Each object must be of identical structure/schema, but may contain multiple properties allowing to plot multiple tracks in one timeline. |
| `data3` | output | `Array<object>` | The data source for timelines. Use an array of objects. Each object must be of identical structure/schema, but may contain multiple properties allowing to plot multiple tracks in one timeline. |
| `data4` | output | `Array<object>` | The data source for timelines. Use an array of objects. Each object must be of identical structure/schema, but may contain multiple properties allowing to plot multiple tracks in one timeline. |
| `data5` | output | `Array<object>` | The data source for timelines. Use an array of objects. Each object must be of identical structure/schema, but may contain multiple properties allowing to plot multiple tracks in one timeline. |
| `data6` | output | `Array<object>` | The data source for timelines. Use an array of objects. Each object must be of identical structure/schema, but may contain multiple properties allowing to plot multiple tracks in one timeline. |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>data</code></summary>

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

<details>

<summary><code>data2</code></summary>

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

<details>

<summary><code>data3</code></summary>

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

<details>

<summary><code>data4</code></summary>

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

<details>

<summary><code>data5</code></summary>

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

<details>

<summary><code>data6</code></summary>

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

## Settings

Double-click the widget in the Page editor to open its settings. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

### Tracks

| Setting | What it does | Default |
|---|---|---|
| Time/Date field | Field holding the timestamp of each record. |  |
| Timeline tracks | Rows of the timeline, one per value field; fields found in the bound data are added at design time. |  |
| Timeline tracks › Track name (y-axis label) | Label of the row on the track axis; empty shows the value field. |  |
| Timeline tracks › Value field | Field whose runs of equal values form the colored blocks; each distinct value is a category. |  |
| Timeline tracks › Show labels | Prints the category name inside each block of the track. | off |

### Colors

| Setting | What it does | Default |
|---|---|---|
| Category colors › Fallback color | Color for categories without their own entry; auto or empty takes the theme's accent background. | `#cccccc` |

### Legend

| Setting | What it does | Default |
|---|---|---|
| Visible | Shows the legend of categories. *Set per screen.* | on |
| Title | Heading above the legend items; empty shows none. |  |
| Subtitle | Line under the legend title; shown only with a title. |  |
| Vertical alignment | Puts the legend at the top or bottom of the chart. Choices: Top, Bottom. *Set per screen.* | Top |
| Horizontal alignment | Puts the legend at the left, center or right of the chart. Choices: Right, Center, Left. *Set per screen.* | Left |
| Item text position | Side of the color marker its text is on; empty picks it from the orientation. Choices: Top, Bottom, Left, Right. | Right |
| Position | outside keeps the legend beside the plot, inside draws it over the plot area. Choices: Outside, Inside. *Set per screen.* | Outside |
| Orientation | Lays the entries out in a column or a row; empty picks it from the alignment. Choices: Vertical, Horizontal. *Set per screen.* | Horizontal |

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Timeline end boundary | Where each track's last block ends: at the current time (live), or 2 % of the data span past the last data point (snapshot). Choices: Current time (live monitoring), Last point (historical snapshot). | Current time (live monitoring) |
| Zoom and pan | none fixes the time axis; selectable adds a lock button that turns wheel zoom and drag pan on; enabled has them always on. Choices: Disabled, Selectable (requires click), Always enabled. *Set per screen.* | Selectable (requires click) |
| Rotate plot | Draws the tracks as columns with time running upward; off, tracks are rows with time running left to right. *Set per screen.* | off |
| Show vertical grid lines | Draws grid lines at the ticks of the time axis. | off |
| Show y-axis track labels | Draws the axis line along the track names; the names themselves always show. | on |
| Show tooltips | Shows a tooltip with category, start and end time when hovering a block. | on |
| Enable crosshair | Shows crosshair lines with axis labels following the pointer. *Set per screen.* | off |

<!-- /generated -->
