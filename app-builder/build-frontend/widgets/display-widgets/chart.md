# Chart

The chart widget displays data arrays as line, bar, area, scatter, bubble, or financial charts. It visualizes complex datasets across multiple customizable panes, axes, and series to build interactive dashboards.

<figure><img src="../../../../.gitbook/assets/Chart1.png" alt=""><figcaption><p>All types of single-series chart</p></figcaption></figure>

<figure><img src="../../../../.gitbook/assets/Stacked bars.png" alt=""><figcaption></figcaption></figure>

## Data binding

### Function output to widget

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `data` | An array of data objects or values to plot on the chart. The chart automatically flattens nested objects using a hyphen delimiter (for example, `sensor: { temp: 21 }` becomes `sensor-temp`). | array |
| `constantLines` | An array of dynamic constant lines fed from the backend to display indicator lines across matching axis indices. | array\<object\> |

#### Automatic configuration

Feed data to the widget without defining any series in the data settings, and it configures itself. It reads the data to find the most likely `argumentField` and `valueField`, creates a default series, and fills the configuration panel with what it detected, ready for you to customize further.

## Configuration

Set the widget's defaults in the settings panel.

### Chart settings

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `showTooltips` | Show value tooltips | Displays a detailed informational popup when hovering over a data point. Formats dates and numbers automatically based on system locale. | boolean |
| `zoomAndPan` | Zoom and pan | Controls chart interactivity. Set to `enabled` (always active), `selectable` (adds an on-chart button to lock scrolling and unlock zoom), or `none`. | string |
| `scaleToConstantLines` | Scale to constant lines | Adds an 8% padding margin to the top and bottom of the value scales to prevent constant line labels from clipping. | boolean |
| `adjustOnZoom` | Adjust on zoom | Recalculates the value axis range dynamically when zooming into an argument range. | boolean |
| `autoHidePointMarkers` | Auto hide point markers | Hides point markers automatically when the density of data points clutters the view. | boolean |
| `enableCrosshair` | Enable crosshair | Displays crosshair tracking lines that follow the user cursor to map intersections on the axes. | boolean |
| `negativesAsZeroes` | Negatives as zeroes | Treats all negative values in the dataset as zero. | boolean |
| `rotated` | Rotated | Swaps the horizontal argument axis and the vertical value axis layouts. | boolean |
| `disabled` | Disabled | Disables all hover, zoom, pan, and click interactions on the chart canvas. | boolean |
| `pointSelectionMode` | Point selection mode | Determines whether users can select a `single` point or `multiple` points. | string |
| `seriesSelectionMode` | Series selection mode | Determines whether users can select a `single` series or `multiple` series. | string |
| `barGroupPadding` | Bar group padding | Controls the spacing between distinct groups of bars in a bar chart. | number |
| `barGroupWidth` | Bar group width | Enforces a fixed pixel width for groups of bars. | number |
| `palette` | Palette | An array of custom hex color codes used sequentially to paint chart series. | array |
| `defaultPane` | Default pane | Names the primary pane used when no explicit pane assignment is configured on a series. | string |

### Value axes settings

Configure the value axes for the chart. You can add multiple axes and distribute them across different layout panes.

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `title` | Title | The text label displayed alongside the axis line. | string |
| `position` | Position | Positions the axis relative to the pane area (`left`, `right`, `top`, `bottom`). | string |
| `width` | Axis width | Sets the line thickness of the axis in pixels. | integer |
| `color` | Color | Sets the color of the axis line. | string |
| `fixedStartValue` | Start value | Enforces a hard starting limit for the axis range, overriding automatic calculations. | number |
| `fixedEndValue` | End value | Enforces a hard ending limit for the axis range, overriding automatic calculations. | number |
| `visible` | Visible | Toggles the visibility of the entire axis line. | boolean |
| `endOnTick` | End on tick | Forces the axis scale boundary to snap perfectly to a major tick mark. | boolean |
| `inverted` | Inverted | Flips the direction of values along the scale. | boolean |
| `label` | Label | Configuration object for axis labels, including `visible`, `fontSize`, `fontWeight`, `fontColor`, and `format`. | object |
| `grid` | Grid and ticks | Configuration object managing major and minor grid lines, line colors, and tick visibility. | object |
| `constantLines` | Constant lines | An array of static indicator lines to draw across this axis, supporting custom labels, dash styles, and colors. | array\<object\> |

### Argument axis settings

Configure the axis representing your independent variable (usually the horizontal X-axis).

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `titleX` | Title | The text label displayed underneath or beside the argument axis. | string |
| `argumentTypeX` | Argument type | Dictates the data scale type (`numeric`, `datetime`, `string`). | string |
| `widthX` | Axis width | Sets the line thickness of the axis line in pixels. | integer |
| `colorX` | Color | Sets the color of the axis line. | string |
| `visibleX` | Visible | Toggles the visibility of the argument axis line. | boolean |
| `endOnTickX` | End on tick | Forces the argument axis scale boundary to snap perfectly to a major tick mark. | boolean |
| `invertedX` | Inverted | Reverses the horizontal or vertical progression direction of the arguments. | boolean |
| `intervalUnitX` | Tick interval unit | Sets the date-time unit size (`days`, `months`, `hours`) for tick generation. | string |
| `intervalX` | Tick interval | The step multiplier between major tick marks based on the selected unit. | integer |
| `aggregationUnitX` | Aggregation unit | The date-time unit size used to group dense raw points into summary intervals. | string |
| `aggregationIntervalX` | Aggregation interval | The step multiplier defining the duration of each summary interval group. | integer |
| `labelX` | Label | Configuration object for layout spacing, text formatting, and font styling of labels. | object |
| `gridX` | Grid and ticks | Toggles visibility and colors for major/minor grids and physical ticks. | object |

### Legend settings

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `legendVisible` | Visible | Toggles the visibility of the series legend block. | boolean |
| `legendTitle` | Title | The main header string shown inside the legend bounding box. | string |
| `legendSubtitle` | Subtitle | Secondary text positioned directly below the legend title. | string |
| `legendVerticalAlignment` | Vertical alignment | Snaps the legend block vertically to the `top` or `bottom`. | string |
| `legendHorizontalAlignment` | Horizontal alignment | Snaps the legend block horizontally to the `left`, `center`, or `right`. | string |
| `legendItemTextPosition` | Item text position | Controls whether item labels sit to the `left`, `right`, `top`, or `bottom` of their color marker. | string |
| `legendPosition` | Position | Places the entire legend block `inside` or `outside` the active chart plotting pane. | string |
| `legendOrientation` | Orientation | Lays out the legend items `horizontally` or `vertically`. | string |
| `legendFont` | Font settings | Styling configuration object managing legend text size, weight, and color. | object |

### Data settings

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `argumentField` | Argument field | The object key path in your data array providing the base axis coordinates. | string |
| `seriesData` | Series data | An array of series mapping configurations detailing individual plots. | array\<object\> |

#### Series properties

Each object inside the `seriesData` configuration array supports these properties:

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `pane` | Pane | Assigns this specific data series to a designated chart layout pane. | string |
| `name` | Series name | The display label for this series inside tooltips and the legend block. | string |
| `valueField` | Value field | The object key path in your data array providing the primary Y-axis values. | string |
| `type` | Series type | The chart visualization type (such as `line`, `bar`, `area`, `scatter`, `bubble`, `rangebar`, `candlestick`). | string |
| `axis` | Value axis | Associates the series with a specific named value axis. | string |
| `aggregation` | Aggregation | The downsampling function applied when data is clustered (`avg`, `min`, `max`, `sum`, `count`). | string |
| `pointSymbol` | Data points | Defines the geometric shape marking points on lines or areas (`circle`, `square`, `triangle`, `none`). | string |
| `color` | Custom color | Overrides the global color palette with a specific hex color code for this plot. | string |
| `tagField` | Tag field | Key path to a data property whose string value gets appended as a highlighted header tag inside the tooltip. | string |
| `ignoreEmptyPoints` | Ignore empty points | Connects lines across missing or null data gaps instead of leaving empty canvas breaks. | boolean |
| `rangeValue1Field` | Range value 1 | Specifies the starting boundary key for range charts (`rangearea`, `rangebar`). | string |
| `rangeValue2Field` | Range value 2 | Specifies the ending boundary key for range charts (`rangearea`, `rangebar`). | string |
| `sizeField` | Size field | Specifies the key determining bubble diameter calculations in bubble charts. | string |
| `openValueField` | Open value field | Maps the opening value key for financial stock tracking layouts. | string |
| `closeValueField` | Close value field | Maps the closing value key for financial stock tracking layouts. | string |
| `highValueField` | High value field | Maps the maximum threshold value key for financial stock tracking layouts. | string |
| `lowValueField` | Low value field | Maps the minimum threshold value key for financial stock tracking layouts. | string |

## Tips and tricks

### Reading nested data objects

The chart automatically flattens complex data structures passed into `data`. If your backend payload contains nested objects, access deep keys by substituting hyphens for the object path. For example, a structure like `sensor: { temp: 21 }` becomes `sensor-temp`.

### Multi-series charts

To show several data series on one chart (comparing temperature and humidity over time, for example), the chart needs a specific data format. You cannot plug in separate arrays; you must combine them into a single array of objects where each object shares a common argument like a timestamp.

#### Prepare the data

Combine your data arrays using a combine function node inside the Backend Builder. Then, append a JavaScript modifier node to the output. This code merges the two datasets by timestamp, producing a list of objects with `date`, `value1` (from the first array), and `value2` (from the second):

```js
// 'x' represents the input array containing your two datasets
Array.from(new Set((x[0] || []).concat(x[1] || []).map(i => i.date)))
  .sort()
  .map(d => ({
    date: d,
    // Find value in first dataset, or return null if missing
    value1: (x[0] || []).find(i => i.date === d)?.value ?? null,
    // Find value in second dataset, or return null if missing
    value2: (x[1] || []).find(i => i.date === d)?.value ?? null
  }))
```

If your data uses different field names (like `timestamp` instead of `date`), adjust the property names in the code to match.

#### The required data structure

After the modifier node, your data uses this structure. Some values are `null`, which is normal: it happens when a timestamp exists in one dataset but not the other (such as when sensors record at slightly different milliseconds):

```json
[
  { "date": "2026-10-27T10:00:01Z", "value1": 25.5, "value2": null },
  { "date": "2026-10-27T10:00:02Z", "value1": 25.6, "value2": 60.2 },
  { "date": "2026-10-27T10:00:03Z", "value1": null, "value2": 60.1 }
]
```

#### Configure the chart

1. Connect the modifier node output to the chart `data` property.
2. Enable ignore empty points for series 1, so the chart bridges `null` points instead of breaking the line.
3. Add a second series under `seriesData`, bind it to `value2`, and enable ignore empty points there too.

The chart now displays both lines on the same time axis, bridging any gaps from mismatched timestamps.

#### Video walkthrough

{% embed url="https://www.youtube.com/watch?v=bB2iL4SBEiM" %}

### Optimizing for large datasets

With thousands of data points, rendering performance becomes a concern. The most effective fix is data aggregation. Instead of plotting every point, the chart groups your data into intervals (days, weeks, months) and shows a single aggregated point per interval (the average, sum, min, or max).

To enable aggregation:

* **Set the series aggregation**: In the series properties under `seriesData`, set the aggregation method to `avg`, `sum`, `min`, or `max`.
* **Configure the argument axis**: In the argument axis settings, set the aggregation unit (such as `days`) and the aggregation interval (such as `7` for weekly groupings).

### Enhancing the user experience

* **Zooming and panning**: The chart supports zooming and panning out of the box. Users drag to select a region to zoom into and scroll the mouse wheel to zoom in and out. This pairs well with aggregation, as zooming in reveals more granular, non-aggregated data.
* **Intelligent markers**: On dense line or area charts, a marker on every point clutters the view. Turn on auto hide point markers in the chart settings to hide them automatically; they reappear when the user zooms in.
* **Tooltips and crosshairs**: Enable show value tooltips to give users precise values on hover. To compare values across multiple series at the same argument coordinate, enable the crosshairs. Configuring a tag field in your series data adds rich, contextual information to the tooltips.
* **Interacting with the chart**: On desktop, zoom by scrolling with a mouse or trackpad. Placing the cursor directly on an axis zooms that dimension only, leaving the other unchanged. Placing the cursor inside the pane zooms without warping, centering on the cursor. On touch devices, zoom using spread and pinch gestures, and pan with a drag gesture.
* **Interactivity controls**: When setting `zoomAndPan` to `selectable`, an interactive toggle button appears in the top-right corner of the canvas:
  * **Lock to scroll (Search icon)**: Disables chart zooming. Mouse wheels and touch drags scroll the page layout normally.
  * **Unlock to zoom (Lock icon)**: Intercepts mouse wheels, pinch gestures, and click-drags to zoom into chart values. The rest of the App screen stays locked in place.
