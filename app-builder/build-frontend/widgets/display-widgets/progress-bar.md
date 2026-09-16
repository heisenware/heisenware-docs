# Progress bar

The progress bar widget visualizes the operational status of a task or a specific metric within a defined range. It displays a horizontal bar that fills from left to right to represent progress as a percentage in your Apps.

<figure><img src="../../../../.gitbook/assets/progressBar.png" alt="" width="375"><figcaption><p>A progress bar in Heisenware</p></figcaption></figure>

## Data binding

### Function output or modifier to widget

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `value` | Sets the current numeric value determining how much of the bar is filled. | number |
| `min` | Sets the minimum boundary value corresponding to 0% progress. | number |
| `max` | Sets the maximum boundary value corresponding to 100% progress. | number |
| `showStatus` | Toggles the layout visibility of the percentage text label inside the progress bar. | boolean |
| `color` | Any valid CSS color for the filled part of the bar; overrides the configured color. | string |
| `props` | Sets several of the above at once, e.g. `{ "min": 0, "max": 200, "color": "#dc2828" }`. The bundle wins over the individually bound properties. | object |

## Configuration

Set the widget's defaults in the settings panel.

### General settings

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `min` | Minimum | The default minimum value of the progress bar, representing 0%. | integer |
| `max` | Maximum | The default maximum value of the progress bar, representing 100%. | integer |
| `showStatus` | Show status | Toggles the visibility of the percentage text label when checked. | boolean |
| `barWidth` | Bar width | Thickness of the bar in pixels. | integer |
| `color` | Color | Fill color of the bar; `auto` follows the theme accent. | string |

## Tips and tricks

{% hint style="info" %}
#### Percentage calculation and theme styling
The widget automatically calculates the fill percentage using the formula: `(value * 100) / (max - min)`. 

By default the fill color follows your theme's accent color. Set `color` in the settings panel for a fixed color, or bind `color` to paint the bar from data — inside a group, each row can color its own bar (e.g. red below a threshold).
{% endhint %}
