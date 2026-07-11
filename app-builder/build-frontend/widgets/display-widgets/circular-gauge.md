# Circular gauge

The circular gauge shows a value on a circular scale, a strong choice for dashboards displaying measurements, progress, or key performance indicators.

<div align="center"><figure><img src="../../../../.gitbook/assets/circularGauge.png" alt="" width="281"><figcaption></figcaption></figure></div>

## Data binding

Link this widget to your logic by dragging items from the [Backend Builder](../../../build-backend/) onto it.

### Output

| Property       | Type     | Description                                            |
| -------------- | -------- | ----------------------------------------------------- |
| **`value`**    | `Number` | Sets the primary indicator's value on the gauge.      |
| **`subValue`** | `Number` | Sets the secondary (subvalue) indicator's value.      |

## Configuration

### Frame

These properties control the gauge's main body and geometry.

<div align="center"><figure><img src="../../../../.gitbook/assets/image (65).png" alt="" width="375"><figcaption><p>Visual explanation of the properties <code>startAngle</code> and <code>circleSize</code></p></figcaption></figure></div>

| Label                | Description                                                                                                  | Type           | Property          |
| -------------------- | ------------------------------------------------------------------------------------------------------------ | -------------- | ----------------- |
| **Start angle**      | The angle in degrees where the gauge's scale begins.                                                         | Integer        | `startAngle`      |
| **Circle size**      | The total size of the gauge's arc in degrees (e.g. 360 for a full circle).                                   | Integer        | `circleSize`      |
| **Frame width**      | The thickness of the gauge's frame in pixels.                                                                | Integer        | `width`           |
| **Background color** | The background color of the gauge's range container.                                                        | String (Color) | `backgroundColor` |
| **Color sections**   | Colored sections (ranges) on the frame that mark different zones (e.g. low, medium, high).                   | Array          | `ranges`          |

<div align="center"><figure><img src="../../../../.gitbook/assets/image (67).png" alt="" width="563"><figcaption><p>A circular gauge with adjusted frame</p></figcaption></figure></div>

### Indicator

Configure the pointers that show the `value` and `subValue` on the gauge.

<figure><img src="../../../../.gitbook/assets/image (69).png" alt=""><figcaption><p>Indicator types (top-left to bottom-right): <br><code>rectangleNeedle, twoColorNeedle, triangleNeedle, rangeBar, triangleMarker, textCloud</code></p></figcaption></figure>

| Label                  | Description                                            | Type   | Property            |
| ---------------------- | ------------------------------------------------------ | ------ | ------------------- |
| **Primary indicator**  | An object holding settings for the main value indicator.      | Object | `valueIndicator`    |
| **Subvalue indicator** | An object holding settings for the secondary value indicator. | Object | `subvalueIndicator` |

#### Indicator properties

The primary and subvalue indicators share these properties.

| Label              | Description                                                      | Type           | Property |
| ------------------ | ---------------------------------------------------------------- | -------------- | -------- |
| **Indicator type** | The shape of the indicator.                                      | String         | `type`   |
| **Width**          | The width or thickness of the indicator.                         | Integer        | `width`  |
| **Scale offset**   | A custom offset in pixels from the indicator to the gauge scale. | Number         | `offset` |
| **Color**          | The color of the indicator.                                      | String (Color) | `color`  |

Depending on the indicator type, more properties become available:

* **Rectangle needle, two-color needle, triangle needle**: `indentFromCenter`, `spindleSize`, `spindleGapSize`. The two-color needle also has `secondColor` and `secondFraction`.
* **Range bar**: `backgroundColor`, `size`, `baseValue`.
* **Triangle marker**: `length`.
* **Text cloud**: `arrowLength`.

### Scale

These properties control the scale, ticks, and labels that give the gauge's values context.

| Label           | Description                                                | Type   | Property     |
| --------------- | --------------------------------------------------------- | ------ | ------------ |
| **Start value** | The minimum value of the scale.                           | Number | `startValue` |
| **End value**   | The maximum value of the scale.                           | Number | `endValue`   |
| **Label**       | An object holding settings for the scale's numeric labels. | Object | `label`      |
| **Major tick**  | An object holding settings for the major tick marks.       | Object | `tick`       |
| **Minor tick**  | An object holding settings for the minor tick marks.       | Object | `minorTick`  |

#### Label and tick properties

| Label                  | Description                                                                        | Type           | Property   |
| ---------------------- | ---------------------------------------------------------------------------------- | -------------- | ---------- |
| **Display label/tick** | Toggles the visibility of the labels or ticks.                                     | Boolean        | `visible`  |
| **Font size**          | (`Label` only) The font size of the labels.                                        | Integer        | `size`     |
| **Font weight**        | (`Label` only) The font weight of the labels (e.g. 400 for normal, 700 for bold).  | Integer        | `weight`   |
| **Font color**         | (`Label` only) The color of the label text.                                        | String (Color) | `color`    |
| **Interval**           | (`Tick` only) The interval between major or minor ticks.                           | Number         | `interval` |
| **Length**             | (`Tick` only) The length of the tick marks in pixels.                              | Integer        | `length`   |
