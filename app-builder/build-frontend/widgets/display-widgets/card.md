# Card

The **Card** widget is a versatile decorative container used to create visual structure, depth, and grouping within your application. It acts as a background "surface" that can be styled with elevations (shadows), borders, and custom background colors.

It is ideal for creating containers, section dividers, or high-performance decorative elements that need to adapt their styling dynamically based on application state.

The Card widgets really shines when you have placed other widgets on top and formed it into a group. When bound to an array of data (e.g. you machine fleet) it will automatically extend into beautiful tiles ideal for creating overview pages that can be drilled-down for detailed information.

## Data Binding

Connect the widget to your application's logic by dragging the corresponding items from the Flow Builder.

### Output

| **Property**          | **Type**         | **Description**                                                                                 |
| --------------------- | ---------------- | ----------------------------------------------------------------------------------------------- |
| **`variant`**         | `String`         | Dynamically switches between `elevation` (shadow-based) and `outlined` (border-based) styles.   |
| **`backgroundColor`** | `String` (Color) | Programmatically sets the background color of the card.                                         |
| **`opacity`**         | `Number`         | Sets the transparency of the widget (0.0 to 1.0).                                               |
| **`borderRadius`**    | `String`         | Sets the corner rounding (e.g., `0px`, `8px`, `50%`).                                           |
| **`elevation`**       | `String`         | Sets the depth of the shadow (`flat`, `low`, `medium`, `high`) when the variant is `elevation`. |
| **`border`**          | `Object`         | Sets the border properties (`width`, `color`, `style`) when the variant is `outlined`.          |

## Configuration

### Card Style

These properties determine the fundamental structure of the card.

| **Label**           | **Description**                                                                                               | **Type** | **Property** |
| ------------------- | ------------------------------------------------------------------------------------------------------------- | -------- | ------------ |
| **Surface Style**   | Choose between `Elevation` (uses shadows to create depth) or `Outlined` (uses a border).                      | String   | `variant`    |
| **Elevation**       | _(Visible if Elevation selected)_ Sets the depth of the shadow effect, ranging from `Flat` to `High`.         | String   | `elevation`  |
| **Border Settings** | _(Visible if Outlined selected)_ Configures the border `Width`, `Color`, and `Style` (solid, dashed, dotted). | Object   | `border`     |

### Styling & Customization

General visual settings for the card container.

| **Label**            | **Description**                                                                | **Type**       | **Property**      |
| -------------------- | ------------------------------------------------------------------------------ | -------------- | ----------------- |
| **Background Color** | Sets the fill color of the card.                                               | String (Color) | `backgroundColor` |
| **Opacity**          | Adjusts the transparency of the card from fully transparent (0) to opaque (1). | Number         | `opacity`         |
| **Corner Radius**    | Sets how rounded the corners are. Options range from `Square` to `Circle`.     | String         | `borderRadius`    |

### Custom CSS Overrides

For advanced users, this section allows the addition of raw CSS properties to the container.

| **Label**    | **Description**                                                       | **Type** | **Property** |
| ------------ | --------------------------------------------------------------------- | -------- | ------------ |
| **Property** | The camelCase CSS property name (e.g., `zIndex`, `cursor`, `filter`). | String   | `key`        |
| **Value**    | The corresponding CSS value (e.g., `100`, `pointer`, `blur(5px)`).    | String   | `value`      |
