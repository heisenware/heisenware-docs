# Pie Chart

The **PieChart** widget is used to visualize the proportions of a whole. It represents data as slices of a circle, where each slice's size is proportional to the value it represents. This makes it an excellent tool for displaying percentage-based data, market share, or any categorical data that sums to a total.

You can configure it as a standard pie or a doughnut chart and customize its labels, legend, and color palette to fit your application's design.

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-06-13 at 16.37.36.png" alt="" width="335"><figcaption><p>A pie chart</p></figcaption></figure>

## Data Binding

Connect the widget to your application's logic by dragging the corresponding items from the Backend Builder.

### Output

| **Property** | **Type** | **Description**                                      |
| ------------ | -------- | ---------------------------------------------------- |
| **`data`**   | `Array`  | An array of data objects to be plotted on the chart. |

#### Automatic Configuration

If you provide data to the widget without pre-defining the `Argument Field` and `Value Field`, the widget will automatically inspect the data. It will attempt to identify the most likely fields for categories (arguments) and their corresponding numeric values and will populate the configuration panel with these suggestions.

## Configuration

### Pie Chart Settings

These properties control the overall appearance and type of the chart.

| **Label**          | **Description**                                                                                   | **Type** | **Property**    |
| ------------------ | ------------------------------------------------------------------------------------------------- | -------- | --------------- |
| **Chart Title**    | The title displayed at the top of the chart.                                                      | String   | `title`         |
| **Chart Type**     | The visual style of the chart. Can be a standard `Pie` or a `Doughnut` with a hole in the center. | String   | `chartType`     |
| **Show Tooltips**  | If `true`, a tooltip with the point's value and argument appears when a user hovers over a slice. | Boolean  | `showTooltips`  |
| **Show Labels**    | If `true`, displays labels for each slice of the pie.                                             | Boolean  | `showLabels`    |
| **Label Position** | The position of the labels relative to the pie slices (`Inside`, `Columns`, `Outside`).           | String   | `labelPosition` |
| **Palette**        | A custom array of colors to use for the pie slices.                                               | Array    | `palette`       |

### Legend Settings

Configure the chart's legend, which identifies the different data categories.

| **Label**                | **Description**                                             | **Type** | **Property**                |
| ------------------------ | ----------------------------------------------------------- | -------- | --------------------------- |
| **Visible**              | Toggles the visibility of the legend.                       | Boolean  | `legendVisible`             |
| **Legend Title**         | The main title for the legend.                              | String   | `legendTitle`               |
| **Vertical Alignment**   | Aligns the legend vertically (`Top` or `Bottom`).           | String   | `legendVerticalAlignment`   |
| **Horizontal Alignment** | Aligns the legend horizontally (`Left`, `Center`, `Right`). | String   | `legendHorizontalAlignment` |
| **Orientation**          | Arranges legend items `Vertically` or `Horizontally`.       | String   | `legendOrientation`         |
| **Marker Size**          | The size of the colored markers in the legend in pixels.    | Integer  | `legendMarkerSize`          |

### Data Settings

This is where you map your data fields to the chart's structure.

| **Label**          | **Description**                                                                            | **Type** | **Property**    |
| ------------------ | ------------------------------------------------------------------------------------------ | -------- | --------------- |
| **Argument Field** | The field from your data source that provides the categories or labels for each pie slice. | String   | `argumentField` |
| **Value Field**    | The field from your data source that provides the numeric value for each pie slice.        | String   | `valueField`    |

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-06-13 at 16.36.39.png" alt="" width="563"><figcaption><p>Example input for pie chart shown above</p></figcaption></figure>
