# Sankey

The **SankeyChart** widget is designed to visualize flow or process data. It uses nodes to represent stages or entities and links to show the flow and quantity (weight) between them. This makes it an excellent tool for analyzing energy flows, user journeys, supply chains, or any process where you need to understand distribution and magnitude.

It provides a clear and intuitive representation of complex process data.

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-02-21 at 14.46.22.png" alt="" width="563"><figcaption></figcaption></figure>

## Data Binding

Connect the widget to your application's logic by dragging the corresponding items from the Backend Builder.

### Output

| **Property** | **Type** | **Description**                                                                                                         |
| ------------ | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| **`data`**   | `Array`  | An array of data objects, where each object defines a link in the flow. See the **Data Structure** section for details. |

#### Data Structure

To render a Sankey chart, you must provide an array of objects where each object represents a single link or connection in the flow. The widget needs to know the source of the flow, the target, and the weight (or quantity) of that flow. You specify which fields in your data correspond to these roles in the configuration.

For example, if you configure `Source Key` as `"from"`, `Target Key` as `"to"`, and `Weight Key` as `"amount"`, your data should look like this:

```json
[
  { "from": "Coal", "to": "Power Plant", "amount": 100 },
  { "from": "Power Plant", "to": "Electricity Grid", "amount": 80 },
  { "from": "Power Plant", "to": "Heat Loss", "amount": 20 }
]

```

## Configuration

### Settings

These properties control the title and the mapping of your data fields to the chart's structure.

| **Label**      | **Description**                                                                              | **Type** | **Property** |
| -------------- | -------------------------------------------------------------------------------------------- | -------- | ------------ |
| **Title**      | The title displayed at the top of the Sankey chart.                                          | String   | `title`      |
| **Source Key** | The name of the field in your data objects that represents the source node of a link.        | String   | `source`     |
| **Target Key** | The name of the field in your data objects that represents the target node of a link.        | String   | `target`     |
| **Weight Key** | The name of the field in your data objects that represents the weight or quantity of a link. | String   | `weight`     |
