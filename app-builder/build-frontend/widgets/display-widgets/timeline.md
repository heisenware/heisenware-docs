# Timeline

The timeline widget displays time-based status changes, operational events, or state durations across horizontal rows. It groups sequential point-in-time data logs into continuous duration blocks to monitor machine states, process steps, or execution phases in your Apps.

## Data binding

### Function output or modifier to widget

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `data` | The primary array of sequential data objects containing the timestamp and category metrics. | array |
| `data2` | An optional secondary data array to track an independent data stream simultaneously. | array |
| `data3` | An optional third data array stream. | array |
| `data4` | An optional fourth data array stream. | array |
| `data5` | An optional fifth data array stream. | array |
| `data6` | An optional sixth data array stream. | array |

### Data structure

To populate rows on the chart, bind an array of sequential data records. The widget processes raw point-in-time data points chronologically and builds solid timeline blocks automatically when a status value changes. 

A standard individual data object payload should follow this structure:

```json
{
  "timestamp": "2026-07-12T12:00:00.000Z",
  "status": "Running",
  "operator": "Station A"
}
```

## Configuration

Set the widget's defaults in the settings panel.

### General settings

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `timeField` | Time field | Specifies the property key name in the data objects containing the event timestamp string or epoch number. Defaults to `timestamp`. | string |
| `endTime` | End time | Controls the calculation rule for ending the final active data block. Set to `current time` to dynamically stretch the final block to the present moment. | string |
| `zoomAndPan` | Zoom and pan | Configures chart navigation interactivity. Options include `enabled` (always zoomable), `selectable` (toggled via an on-chart lock button), or `none`. | string |
| `rotated` | Rotated | Inverts the vertical and horizontal orientation layouts of the chart axes. | boolean |
| `gridVisible` | Show grid | Toggles the layout visibility of grid lines running along the value axis. | boolean |
| `visibleX` | Show X axis | Toggles the layout visibility of the horizontal argument axis line. | boolean |
| `enableCrosshair` | Enable crosshair | Toggles displaying fine intersection tracking lines under the cursor when hovering over data segments. | boolean |
| `showTooltips` | Show tooltips | Toggles displaying detailed timing popups on data block hover. | boolean |
| `categoryColors` | Category colors | Configuration object mapping explicit category state strings to unique hex color tracking codes, accepting a `defaultColor` fallback. | object |
| `width` | Width | Sets the total outer width of the chart component container block. | string \| number |
| `height` | Height | Sets the total outer height of the chart component container block. | string \| number |

### Legend settings

Configure the chart's category legend, mapping color blocks to matching status labels.

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `legendVisible` | Show legend | Toggles the layout visibility of the category legend container block. | boolean |
| `legendPosition` | Legend position | Sets the placement anchor location of the legend block relative to the main chart grid. | string |
| `legendOrientation` | Legend orientation | Aligns the internal layout flow of legend items (options include `Vertical` or `Horizontal`). | string |
| `legendVerticalAlignment` | Legend vertical alignment | Sets the vertical placement alignment of the legend container boundaries. | string |
| `legendHorizontalAlignment` | Legend horizontal alignment | Sets the horizontal placement alignment of the legend container boundaries. | string |
| `legendItemTextPosition` | Legend text position | Sets the relative text orientation placement next to each legend item color marker. | string |

### Track settings

Configure individual timeline row layouts nested inside the `tracks` array to distribute distinct value properties onto separate rows.

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `valueField` | The data object property key monitored to determine state categories and segment blocks. | string |
| `trackName` | The explicit string title rendered next to this timeline row. Defaults to the `valueField` key string if omitted. | string |
| `showLabels` | Toggles the text visibility of the active category string directly inside this row's duration blocks. | boolean |

## Tips and tricks

### Scroll containment during zoom interactivity
When setting `zoomAndPan` to `enabled`, or when unlocking the on-chart `selectable` navigation button (hinted as *Lock to Scroll* / *Unlock to Zoom*), the widget intercepts default mouse scroll wheel movements and touch drag gestures to drive timeline zooming actions. 

If your timeline widget sits within a long scrolling page layout, lock the chart navigation view via the interactive button to release scroll control back to the parent page browser body.
