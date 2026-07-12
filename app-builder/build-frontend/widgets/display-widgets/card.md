# Card

The card widget is a decorative container that structures and groups other widgets on the canvas of your App. It provides a background surface driven by styling data such as colors, borders, and shadows.

## Data binding

### Function output to widget

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `width` | Sets the horizontal width of the card. | string or number |
| `height` | Sets the vertical height of the card. | string or number |
| `variant` | Switches the surface style between `elevation` (shadow-based) and `outlined` (border-based). | string |
| `backgroundColor` | Sets the background color of the card. | string |
| `opacity` | Sets the transparency of the widget from `0.0` (fully transparent) to `1.0` (opaque). | number |
| `borderRadius` | Sets the corner rounding radius. Use `theme` to match the global app styles. | string |
| `elevation` | Sets the shadow depth (`flat`, `theme`, `low`, `medium`, `high`) when `variant` is set to `elevation`. | string |
| `border` | Sets the border properties when `variant` is set to `outlined`. Takes an object with `width`, `style`, and `color`. | object |
| `style` | An array of custom CSS property objects containing `key` and `value` pairs for advanced styling overrides. | array\<object\> |

## Configuration

Set the widget's defaults in the settings panel.

### Card style

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `variant` | Surface style | Choose elevation for shadows or outlined for borders. | string |
| `elevation` | Elevation | Sets the shadow depth from flat to high. This field is visible when surface style is set to elevation. | string |
| `border` | Border settings | Sets the border width, color, and style. This field is visible when surface style is set to outlined. | object |

### Styling and customization

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `backgroundColor` | Background color | Sets the background color of the card. | string |
| `opacity` | Opacity | Sets the transparency of the card from 0 to 1. | number |
| `borderRadius` | Corner radius | Sets the corner rounding from square to circle. | string |

### Custom CSS overrides

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `key` | Property | The camelCase CSS property name. | string |
| `value` | Value | The matching CSS property value. | string |
