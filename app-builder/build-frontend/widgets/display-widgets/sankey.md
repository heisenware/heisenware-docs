# Sankey

The sankey widget visualizes flow or process data across multiple operational stages. It uses nodes to represent entities and connecting links to illustrate distribution paths and quantities in your Apps.

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-02-21 at 14.46.22.png" alt="" width="563"><figcaption></figcaption></figure>

## Data binding

### Function output or modifier to widget

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `data` | An array of data objects, where each object defines an individual link in the process flow. | array |

### Data structure

To render a Sankey chart, the bound `data` array must provide objects where each item represents a single connection in the flow. The widget requires a source node, a target node, and a numeric weight value to map the distribution profile.

For example, if you configure the `source` (Source key) as `"from"`, `target` (Target key) as `"to"`, and `weight` (Weight key) as `"amount"`, the array data payload should follow this structure:

```json
[
  { "from": "Coal", "to": "Power Plant", "amount": 100 },
  { "from": "Power Plant", "to": "Electricity Grid", "amount": 80 },
  { "from": "Power Plant", "to": "Heat Loss", "amount": 20 }
]
```

## Configuration

Set the widget's defaults in the settings panel.

### General settings

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `title` | Title | The text string displayed as a header at the top of the chart canvas. | string |
| `source` | Source key | The name of the data object field that represents the origin node of a flow link. | string |
| `target` | Target key | The name of the data object field that represents the destination node of a flow link. | string |
| `weight` | Weight key | The name of the data object field that represents the numerical volume or quantity of a flow link. | string |
