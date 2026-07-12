# Dynamic group

The dynamic group widget bundles multiple widgets together into a single cohesive container. While you can use it to organize layout structures, its primary function is to act as a data repeater. Passing an array of objects to the widget generates an independent tile for each item, replicating all nested child widgets automatically. This behavior makes it ideal for building custom lists, product cards, user directories, and modular dashboards.

## Data binding

### Function output or modifier to widget

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `data` | Specifies the dataset that populates the container. Providing an array of objects prompts the widget to generate a repeated tile for each entry. | array or object |

### Widget to function input

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `onGroupClick` | Fires when a user clicks anywhere on the background area of a repeated tile. The payload contains the full data object of the selected tile along with its index. | object |
| `onChange` | Fires when a user modifies the value of an input widget located inside a tile. The payload returns the updated row data along with the target index. | object |
| `onButtonClick` | Fires when a user interacts with a button or trigger widget inside a tile. The payload carries the row data object, the row index, the `clickedBy` widget identifier, and the companion `buttonText`. | object |

## Configuration

Set the widget's defaults in the settings panel. Because the group manages nested child elements, its setup covers both layout positioning rules and internal child data mapping.

### Layout settings

These properties control how the generated tiles arrange inside the main group container area.

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `width` | Width | Sets the overall layout width dimension of the group container. | string |
| `height` | Height | Sets the overall layout height dimension of the group container. | string |
| `tileWidth` | Tile width | Sets the layout width dimension for each repeated tile in pixels. | number |
| `tileHeight` | Tile height | Sets the layout height dimension for each repeated tile in pixels. | number |
| `horizontalAxis.justification` | Horizontal justification | Aligns tiles horizontally within the group container, supporting left, center, right, space between, space around, and space evenly. | string |
| `horizontalAxis.spacing` | Horizontal spacing | Sets the horizontal space between tiles in pixels. This setting takes effect only when horizontal justification uses left, center, or right. | integer |
| `verticalAxis.justification` | Vertical justification | Aligns tiles vertically when wrapping onto multiple rows, supporting top, center, bottom, space between, space around, and space evenly. | string |
| `verticalAxis.spacing` | Vertical spacing | Sets the vertical space between tile rows in pixels. This setting takes effect only when vertical justification uses top, center, or bottom. | integer |

### Data handling

When you wire a dataset to the group's `data` property, the data settings panel reveals configuration fields for every child widget nested inside the container. Define individual item bindings using these options:
* *Widget property*: Specifies the target child component property to control, such as text, disabled, or color.
* *Data property*: Designates the specific key from your object array that maps the runtime value. Select `<Current Value>` to pass the entire root object, or utilize standard dot notation to navigate nested property paths.

## Tips and tricks

* **Design a single tile template**: Arrange your child widgets inside the single visible container layout on the canvas to configure your base appearance. The platform automatically duplicates this layout template for every item in your array.
* **Track child widget names**: Monitor auto-generated child component designations like `text1` or `button1`. These code identifiers specify which component triggered an action or receives information during data binding setups and `onButtonClick` event handling routines.

## Video demo

{% embed url="https://youtu.be/fkWZCY4u6fQ" %}
