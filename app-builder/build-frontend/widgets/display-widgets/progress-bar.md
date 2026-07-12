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

## Configuration

Set the widget's defaults in the settings panel.

### General settings

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `min` | Minimum | The default minimum value of the progress bar, representing 0%. | integer |
| `max` | Maximum | The default maximum value of the progress bar, representing 100%. | integer |
| `showStatus` | Show status | Toggles the visibility of the percentage text label when checked. | boolean |

## Tips and tricks

{% hint style="info" %}
#### Percentage calculation and theme styling
The widget automatically calculates the fill percentage using the formula: `(value * 100) / (max - min)`. 

The progress bar fill color matches your active theme accent color configuration and cannot be modified independently.
{% endhint %}
