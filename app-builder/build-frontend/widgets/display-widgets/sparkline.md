# Sparkline

The **Sparkline** widget is a small, lightweight chart that presents the general shape of data variation in a simple and highly condensed way. It's perfect for dashboards and reports where you need to show a trend within a compact space, often alongside related text or other data.

You can configure its appearance as a line, bar, area, or win-loss chart, and customize its colors, points, and tooltips to create a clear and informative visualization.

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-08-20 at 18.56.42.png" alt="" width="375"><figcaption></figcaption></figure>

## Data Binding

Connect the widget to your application's logic by dragging the corresponding items from the Flow Builder.

### Output

| **Property** | **Type** | **Description**                                          |
| ------------ | -------- | -------------------------------------------------------- |
| **`data`**   | `Array`  | An array of data objects to be plotted on the sparkline. |

#### Automatic Configuration

If you provide data to the widget without pre-defining the `Argument Key` and `Value Key`, the widget will automatically inspect the data. It will attempt to identify the most likely fields for the arguments and their corresponding numeric values and will populate the configuration panel with these suggestions.

## Configuration

### Styling

These properties allow you to customize the visual appearance of the sparkline.

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-09-18 at 15.27.59.png" alt=""><figcaption><p>All types of sparkline</p></figcaption></figure>

| **Label**                         | **Description**                                                                               | **Type**       | **Property**      |
| --------------------------------- | --------------------------------------------------------------------------------------------- | -------------- | ----------------- |
| **Type**                          | The visual representation of the sparkline (e.g., `Line`, `Bar`, `Area`).                     | String         | `type`            |
| **Apply customized Colors**       | If `true`, enables the custom color settings below. Otherwise, default theme colors are used. | Boolean        | `customizeColors` |
| **Color in first and last entry** | If `true`, applies a special color to the first and last data points.                         | Boolean        | `showFirstLast`   |
| **First and Last Color**          | The color to use for the first and last data points.                                          | String (Color) | `firstLastColor`  |
| **Color in min and max entry**    | If `true`, applies a special color to the minimum and maximum data points.                    | Boolean        | `showMinMax`      |
| **Color of Maximum**              | The color to use for the maximum data point.                                                  | String (Color) | `maxColor`        |
| **Color of Minimum**              | The color to use for the minimum data point.                                                  | String (Color) | `minColor`        |
| **Margin**                        | An object that sets the padding around the sparkline (`top`, `bottom`, `left`, `right`).      | Object         | `margin`          |

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-09-18 at 16.34.27.png" alt="" width="563"><figcaption><p>A sparkline with the first, last, minimum and maximum entries marked with points</p></figcaption></figure>

#### Line, Area, and Spline Options

These options apply when the **Type** is set to `line`, `area`, `spline`, etc.

| **Label**                | **Description**                                                             | **Type**       | **Property**  |
| ------------------------ | --------------------------------------------------------------------------- | -------------- | ------------- |
| **Point Color**          | The color of the individual data point markers.                             | String (Color) | `pointColor`  |
| **Point size in pixels** | The size of the data point markers.                                         | Integer        | `pointSize`   |
| **Point Symbol**         | The shape of the data point markers (e.g., `circle`, `square`, `triangle`). | String         | `pointSymbol` |
| **Line Color**           | The color of the sparkline's main line.                                     | String (Color) | `lineColor`   |
| **Line Width**           | The thickness of the sparkline's main line in pixels.                       | Number         | `lineWidth`   |

#### Bar Options

These options apply when the **Type** is set to `bar`.

| **Label**              | **Description**                                    | **Type**       | **Property**       |
| ---------------------- | -------------------------------------------------- | -------------- | ------------------ |
| **Negative Bar Color** | The color for bars that represent negative values. | String (Color) | `barNegativeColor` |
| **Positive Bar Color** | The color for bars that represent positive values. | String (Color) | `barPositiveColor` |

#### Win-Loss Options

These options apply when the **Type** is set to `winloss`.

| **Label**              | **Description**                                           | **Type**       | **Property**       |
| ---------------------- | --------------------------------------------------------- | -------------- | ------------------ |
| **Win Color**          | The color for bars that are above the threshold (wins).   | String (Color) | `winColor`         |
| **Loss Color**         | The color for bars that are below the threshold (losses). | String (Color) | `lossColor`        |
| **Win-Loss Threshold** | The numeric value that separates "wins" from "losses".    | Number         | `winlossThreshold` |

### Tooltip Settings

These properties control the tooltip that appears when a user hovers over the sparkline.

| **Label**          | **Description**                                                                             | **Type**       | **Property**   |
| ------------------ | ------------------------------------------------------------------------------------------- | -------------- | -------------- |
| **Enabled**        | Toggles the visibility of the tooltip.                                                      | Boolean        | `enabled`      |
| **Interactive**    | If `true`, allows users to select and copy text from the tooltip.                           | Boolean        | `interactive`  |
| **Color**          | The background color of the tooltip.                                                        | String (Color) | `color`        |
| **Border Radius**  | The corner radius of the tooltip box in pixels.                                             | Number         | `cornerRadius` |
| **Opacity**        | The opacity of the tooltip, from 0 (transparent) to 1 (opaque).                             | Number         | `opacity`      |
| **Tooltip Border** | An object containing settings for the tooltip's border (`color`, `width`, `visible`, etc.). | Object         | `border`       |
| **Tooltip Font**   | An object containing settings for the tooltip's text (`color`, `size`, `weight`, etc.).     | Object         | `font`         |

### Data Settings

These properties control the fundamental data mapping and axis configuration of the sparkline.

| **Label**                    | **Description**                                                                            | **Type** | **Property**        |
| ---------------------------- | ------------------------------------------------------------------------------------------ | -------- | ------------------- |
| **Argument Key**             | The name of the field in your data objects that represents the argument (horizontal axis). | String   | `argumentField`     |
| **Value Key**                | The name of the field in your data objects that represents the value (vertical axis).      | String   | `valueField`        |
| **Ignore empty data points** | If `true`, empty or null data points will be ignored and not plotted.                      | Boolean  | `ignoreEmptyPoints` |
| **Maximum of Value Axis**    | Sets a fixed maximum value for the vertical axis.                                          | Number   | `maxValue`          |
| **Minimum of Value Axis**    | Sets a fixed minimum value for the vertical axis.                                          | Number   | `minValue`          |
