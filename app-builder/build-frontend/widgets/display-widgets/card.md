# Card

The card widget is a versatile decorative container that adds visual structure, depth, and grouping to your App. It acts as a background surface you can style with elevations (shadows), borders, and custom background colors, ideal for containers, section dividers, or decorative elements that adapt their look to the App's state.

The card really shines once you place other widgets on top and turn it into a [dynamic group](../dynamic-group.md). Bind it to an array of data (your machine fleet, say) and it extends into tiles automatically, perfect for overview pages you can drill down into for detail.

## Data binding

Link this widget to your logic by dragging items from the [Backend Builder](../../../build-backend/) onto it.

### Output

| **Property**          | **Type**         | **Description**                                                                                 |
| --------------------- | ---------------- | ----------------------------------------------------------------------------------------------- |
| **`variant`**         | `String`         | Switches between `elevation` (shadow-based) and `outlined` (border-based) styles.               |
| **`backgroundColor`** | `String` (Color) | Sets the card's background color.                                                                |
| **`opacity`**         | `Number`         | Sets the widget's transparency (0.0 to 1.0).                                                     |
| **`borderRadius`**    | `String`         | Sets the corner rounding (e.g. `0px`, `8px`, `50%`).                                             |
| **`elevation`**       | `String`         | Sets the shadow depth (`flat`, `low`, `medium`, `high`) when the variant is `elevation`.        |
| **`border`**          | `Object`         | Sets the border properties (`width`, `color`, `style`) when the variant is `outlined`.          |

## Configuration

### Card style

These properties set the card's fundamental structure.

| **Label**           | **Description**                                                                                               | **Type** | **Property** |
| ------------------- | ------------------------------------------------------------------------------------------------------------- | -------- | ------------ |
| **Surface style**   | Choose `Elevation` (shadows for depth) or `Outlined` (a border).                                              | String   | `variant`    |
| **Elevation**       | _(Visible when Elevation is selected)_ Sets the shadow depth, from `Flat` to `High`.                          | String   | `elevation`  |
| **Border settings** | _(Visible when Outlined is selected)_ Sets the border `Width`, `Color`, and `Style` (solid, dashed, dotted).  | Object   | `border`     |

### Styling and customization

General visual settings for the card container.

| **Label**            | **Description**                                                                | **Type**       | **Property**      |
| -------------------- | ------------------------------------------------------------------------------ | -------------- | ----------------- |
| **Background color** | Sets the card's fill color.                                                    | String (Color) | `backgroundColor` |
| **Opacity**          | Sets the card's transparency, from fully transparent (0) to opaque (1).       | Number         | `opacity`         |
| **Corner radius**    | Sets how rounded the corners are, from `Square` to `Circle`.                   | String         | `borderRadius`    |

### Custom CSS overrides

For advanced users, this section adds raw CSS properties to the container.

| **Label**    | **Description**                                                       | **Type** | **Property** |
| ------------ | --------------------------------------------------------------------- | -------- | ------------ |
| **Property** | The camelCase CSS property name (e.g. `zIndex`, `cursor`, `filter`).  | String   | `key`        |
| **Value**    | The matching CSS value (e.g. `100`, `pointer`, `blur(5px)`).          | String   | `value`      |
