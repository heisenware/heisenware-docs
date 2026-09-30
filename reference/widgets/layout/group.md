---
description: >-
  Holds other widgets as one unit and repeats them as one tile per data row, binding row fields to member properties by member name; formed from placed widgets (group_widgets in the tools, Group in the builder), never created empty; groups nest
---

# Group

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/group. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `data` | output | `Array<object>\|object` | The rows to render: one tile (with the full set of child widgets) per row. A single object becomes one tile; the binding editor maps row fields to child properties. A row field may itself hold an **array of points** — bind it to a chart, sparkline or timeline child. |

### Emits

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `onChange` | input | `object` | Writes the tile's row augmented with the changed child value whenever an input child changes. |
| `onButtonClick` | input | `object` | Writes an event envelope when a button child is clicked. Pending child input values of the same tile are merged in. |
| `onGroupClick` | input | `object` | Writes the tile's row (plus pending child input values) when the tile is clicked. |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>data</code></summary>

```json
[
  {
    "name": "Pump A",
    "pressure": 2.4,
    "running": true,
    "status": "running",
    "history": [
      {
        "timestamp": "2026-08-12T10:00:00Z",
        "pressure": 2.2
      },
      {
        "timestamp": "2026-08-12T10:05:00Z",
        "pressure": 2.6
      },
      {
        "timestamp": "2026-08-12T10:10:00Z",
        "pressure": 2.4
      }
    ]
  },
  {
    "name": "Pump B",
    "pressure": 3.1,
    "running": false,
    "status": "idle",
    "history": [
      {
        "timestamp": "2026-08-12T10:00:00Z",
        "pressure": 3.4
      },
      {
        "timestamp": "2026-08-12T10:05:00Z",
        "pressure": 3
      },
      {
        "timestamp": "2026-08-12T10:10:00Z",
        "pressure": 2.9
      }
    ]
  }
]
```

</details>

<details>

<summary><code>onChange</code></summary>

```json
{
  "index": 0,
  "name": "Pump A",
  "pressure": 2.4,
  "form1": {
    "value": 42
  }
}
```

</details>

<details>

<summary><code>onButtonClick</code></summary>

```json
{
  "index": 0,
  "clickedBy": "button1",
  "buttonText": "Go",
  "name": "Pump A",
  "pressure": 2.4
}
```

</details>

<details>

<summary><code>onGroupClick</code></summary>

```json
{
  "index": 0,
  "name": "Pump A",
  "pressure": 2.4
}
```

</details>

## Settings

Double-click the widget in the Page editor to open its settings. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Horizontal axis › Justification | Where the tiles of a row sit across the width; left, center and right keep the spacing, the space variants spread the tiles over the width. Choices: Left, Center, Right, Space between, Space around, Space evenly. *Set per screen.* | Center |
| Horizontal axis › Spacing | Margin in px on both sides of every tile, so neighbours sit twice this apart. Range 0 to 80. Only when Justification is Left, Center or Right. | `0` |
| Vertical axis › Justification | Where the rows of tiles sit down the height; top, center and bottom keep the spacing, the space variants spread the rows over the height. Choices: Top, Center, Bottom, Space between, Space around, Space evenly. *Set per screen.* | Top |
| Vertical axis › Spacing | Margin in px below every tile. Range 0 to 80. Only when Justification is Top, Center or Bottom. | `0` |

## Good to know

* It holds other widgets and repeats them, one tile per data row.

<!-- /generated -->
