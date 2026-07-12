# Pie chart

The pie chart widget visualizes proportional data as segments of a circular whole. It displays data arrays as either standard pie slices or a doughnut structure in your Apps.

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-06-13 at 16.37.36.png" alt="" width="335"><figcaption><p>A pie chart</p></figcaption></figure>

## Data binding

### Function output or modifier to widget

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `data` | An array of data objects to be plotted on the chart. | array |

#### Automatic configuration

If an array of objects is bound without pre-defining the `argumentField` (Argument field) and `valueField` (Value field) in the configuration panel, the widget inspects the incoming data structure. It automatically selects the most probable string field for the argument (labels) and the numeric field for the value (sizes) and assigns them to the widget settings.

## Configuration

Set the widget's defaults in the settings panel.

### General settings

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `title` | Chart title | The text string displayed as a header at the top of the chart canvas. | string |
| `chartType` | Chart type | The visual layout style geometry of the chart (options include `Pie` or `Doughnut`). | string |
| `showTooltips` | Show tooltips | Enables contextual popups showing exact values and arguments when a user hovers over a slice. | boolean |
| `showLabels` | Show labels | Toggles the visibility of permanent text labels attached to each pie slice. | boolean |
| `labelPosition` | Label position | Sets the layout placement anchor of the labels relative to the pie slices (options include `Inside`, `Columns`, or `Outside`). | string |
| `palette` | Palette | Defines a custom array of color codes used to paint the sequential pie slices. | array |

### Legend settings

Configure the chart's legend, which identifies the different data categories.

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `legendVisible` | Visible | Toggles the layout visibility of the data category legend container. | boolean |
| `legendTitle` | Legend title | The text string displayed as the header of the legend container. | string |
| `legendVerticalAlignment` | Vertical alignment | Sets the vertical placement anchor for the legend block (options include `Top` or `Bottom`). | string |
| `legendHorizontalAlignment` | Horizontal alignment | Sets the horizontal placement anchor for the legend block (options include `Left`, `Center`, or `Right`). | string |
| `legendOrientation` | Orientation | Sets the internal flow direction layout of the legend items (options include `Vertical` or `Horizontal`). | string |
| `legendMarkerSize` | Marker size | Sets the pixel dimension size of the colored status blocks next to the legend text. | integer |

### Data fields

Map the inbound payload structure to the chart geometry axes.

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `argumentField` | Argument field | The key name from your data object that defines the categories or text labels for each slice. | string |
| `valueField` | Value field | The key name from your data object that defines the numeric value controlling the proportional size of each slice. | string |

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-06-13 at 16.36.39.png" alt="" width="563"><figcaption><p>Example input for pie chart shown above</p></figcaption></figure>
