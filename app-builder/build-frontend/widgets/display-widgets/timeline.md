# Timeline

The timeline widget displays time-based status changes, events, or state durations across horizontal tracks. It groups sequential data points into continuous blocks to let you monitor machine states, operational phases, or process logs over time.

## Data binding

### Function output to widget

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `data` | The primary array of sequential data objects containing timestamps and category values. | array\<object\> |
| `data2` | An optional secondary data array to track multiple independent data sources. | array\<object\> |
| `data3` | An optional third data array. | array\<object\> |
| `data4` | An optional fourth data array. | array\<object\> |
| `data5` | An optional fifth data array. | array\<object\> |
| `data6` | An optional sixth data array. | array\<object\> |

## Configuration

Set the widget's defaults in the settings panel.

### Settings

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `timeField` | Time field | The property name in your data objects that contains the timestamp. Defaults to `timestamp`. | string |
| `endTime` | End time | Determines how the end of the final data block is calculated. Set to `current time` to extend the active block to the present moment. | string |
| `zoomAndPan` | Zoom and pan | Controls chart interactivity. Options include `enabled` (always active), `selectable` (toggled via an on-chart lock button), or `none`. | string |
| `rotated` | Rotated | Inverts the orientation of the chart axes. | boolean |
| `legendVisible` | Show legend | Toggles the visibility of the category legend. Defaults to `true`. | boolean |
| `legendPosition` | Legend position | Position of the legend relative to the chart area. | string |
| `legendOrientation` | Legend orientation | Arranges legend items vertically or horizontally. | string |
| `legendVerticalAlignment` | Legend vertical alignment | Aligns the legend to the top, center, or bottom. | string |
| `legendHorizontalAlignment` | Legend horizontal alignment | Aligns the legend to the left, center, or right. | string |
| `legendItemTextPosition` | Legend text position | Positioning of the label text relative to each legend item's marker. | string |
| `gridVisible` | Show grid | Displays grid lines along the value axis. Defaults to `true`. | boolean |
| `visibleX` | Show X axis | Toggles the visibility of the argument axis. Defaults to `true`. | boolean |
| `enableCrosshair` | Enable crosshair | Displays crosshair tracking lines when hovering over the chart area. Defaults to `true`. | boolean |
| `showTooltips` | Show tooltips | Displays detailed informational popups when hovering over data blocks. Defaults to `true`. | boolean |
| `categoryColors` | Category colors | An object mapping specific category or status values to hex color codes, supporting a `defaultColor` fallback. | object |
| `width` | Width | The width of the widget. | string or number |
| `height` | Height | The height of the widget. | string or number |

### Track configuration

Configure individual track behaviors within the `tracks` array to map your data fields to separate rows on the chart.

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `valueField` | The property name in the data array that holds the category or status value. | string |
| `trackName` | The display name for this specific timeline row. Defaults to the `valueField` name if omitted. | string |
| `showLabels` | Toggles the visibility of text labels inside the timeline blocks for this track. Defaults to `true`. | boolean |
