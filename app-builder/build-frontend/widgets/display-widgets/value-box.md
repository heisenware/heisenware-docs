# Value Box

The **ValueBox** widget is a highly versatile component for displaying a single piece of data. It can intelligently render various data types, including text, numbers, booleans, and even complex objects or images encoded in Base64.

It's an essential building block for dashboards, detail views, and any interface where you need to display a specific value with customizable styling, such as font size, weight, color, and alignment.

This widget is perfect for debugging as well, as the connected value is shown without frills.

<div><figure><img src="../../../../.gitbook/assets/Screenshot 2024-09-24 at 10.32.06.png" alt="" width="239"><figcaption><p>A value box</p></figcaption></figure> <figure><img src="../../../../.gitbook/assets/Screenshot 2024-09-24 at 11.51.56.png" alt="" width="216"><figcaption><p>A Value box displaying an object</p></figcaption></figure></div>

## Data Binding

Connect the widget to your application's logic by dragging the corresponding items from the Backend Builder.

### Input

| **Property**  | **Type** | **Description**                                                                           |
| ------------- | -------- | ----------------------------------------------------------------------------------------- |
| **`onClick`** | `Any`    | Fired when a user clicks on the widget. The payload is the current value being displayed. |

### Output

| **Property**    | **Type**  | **Description**                                                                                                      |
| --------------- | --------- | -------------------------------------------------------------------------------------------------------------------- |
| **`value`**     | `Any`     | The data to be displayed. The widget adapts its rendering based on the data type (e.g., text, object, Base64 image). |
| **`clear`**     | `Boolean` | When `true`, clears the currently displayed value.                                                                   |
| **`textColor`** | `String`  | Programmatically overrides the configured text color.                                                                |

## Configuration

### Settings

These properties control the appearance and styling of the text displayed within the widget.

| **Label**                | **Description**                                                             | **Type**       | **Property**     |
| ------------------------ | --------------------------------------------------------------------------- | -------------- | ---------------- |
| **Font Size**            | The size of the text in pixels.                                             | Integer        | `fontSize`       |
| **Font Weight**          | The weight (thickness) of the text, from `normal` to `bolder`.              | Integer        | `fontWeight`     |
| **Horizontal Alignment** | Aligns the text horizontally within the widget (`left`, `center`, `right`). | String         | `justifyContent` |
| **Vertical Alignment**   | Aligns the text vertically within the widget (`top`, `middle`, `bottom`).   | String         | `alignItems`     |
| **Text Color**           | The color of the displayed text.                                            | String (Color) | `color`          |
| **Suffix**               | Text to be appended to the displayed value.                                 | String         | `suffix`         |
| **Placeholder**          | Text to display when the widget has no value.                               | String         | `placeholder`    |
