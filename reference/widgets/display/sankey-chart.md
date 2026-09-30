---
description: >-
  Sankey flow diagram of weighted links between nodes, from rows with source, target and weight fields
---

# Sankey Chart

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/sankey-chart. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `data` | output | `Array<object>` | The flows to plot: one object per link between two nodes. |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>data</code></summary>

```json
[
  {
    "from": "Boiler",
    "to": "Turbine",
    "weight": 120
  },
  {
    "from": "Turbine",
    "to": "Generator",
    "weight": 95
  }
]
```

</details>

## Settings

Double-click the widget in the Page editor to open its settings.

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Title | Title shown above the diagram; empty shows none. |  |
| Source field | Field naming the node a link starts from. |  |
| Target field | Field naming the node a link ends at. |  |
| Weight field | Field giving a link's flow amount, which sets its thickness. |  |

<!-- /generated -->
