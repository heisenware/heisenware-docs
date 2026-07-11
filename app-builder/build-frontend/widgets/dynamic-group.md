# Dynamic group

The dynamic group is a versatile container that bundles multiple widgets together. You can use it just to organize your layout, but its real power comes from binding it to data, which turns it into a repeater.

Feed it an array, and it generates one tile per item, duplicating the child widgets inside it for each one. That makes it the tool for custom lists, product cards, user directories, and dynamic dashboards.

## Data binding

Link this widget to your logic by dragging items from the [Backend Builder](../../build-backend/) onto it.

### Output

_Drag a function output or a modifier onto the widget._

| **Property** | **Type**            | **Description**                                                                                                            |
| ------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `data`       | `Array` or `Object` | The dataset that populates the group. Pass an array of objects and the group generates a tile for each object. |

### Input

_Drag a function input onto the widget._

When a user interacts with a generated tile or a widget inside it, the group fires an event carrying the interaction details together with the full data object of that tile (including its `index`).

<table data-header-hidden><thead><tr><th width="160.61614990234375"></th><th width="133.06744384765625"></th><th></th></tr></thead><tbody><tr><td><strong>Property</strong></td><td><strong>Type</strong></td><td><strong>Description</strong></td></tr><tr><td><code>onGroupClick</code></td><td><code>Object</code></td><td>Fires when a user clicks anywhere on a tile's background. The payload is the data object for that tile.</td></tr><tr><td><code>onChange</code></td><td><code>Object</code></td><td>Fires when a user changes the value of an input widget (like a text box or switch) inside a tile. The payload includes the updated data for that tile.</td></tr><tr><td><code>onButtonClick</code></td><td><code>Object</code></td><td>Fires when a user clicks a button or trigger widget inside a tile. The payload includes the row data, the <code>clickedBy</code> widget name, and the <code>buttonText</code>.</td></tr></tbody></table>

## Configuration

Because the group manages child widgets, its configuration splits in two: how data flows into the children, and how the repeated tiles sit on screen.

### Data settings

Bind an array of objects to the group's `data` property and the widget reads your data structure and fills the data settings panel.

There you see every child widget you placed inside the group (e.g. `Text1`, `Button1`, `Image1`). For each one, you define one or more bindings:

| **Label**       | **Description**                                                                                                                                                              |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Widget property | The child widget property you want to control (e.g. `text`, `disabled`, `color`).                                                                                          |
| Data property   | The key from your dataset that holds the value. Select `<Current Value>` to pass the whole object, or use dot notation for nested paths (e.g. `user.firstName`).            |

For example, if your dataset lists users with a `firstName` property, bind `firstName` to the `value` property of a [value box](display-widgets/value-box.md) inside the group. Every generated tile then shows the right first name for its user.

### Style settings

These properties apply once you bind an array of objects to `data`, and they control how the generated tiles arrange inside the group container.

**Horizontal axis**

<table data-header-hidden><thead><tr><th width="169.87542724609375"></th><th width="435.464599609375"></th><th></th></tr></thead><tbody><tr><td><strong>Label</strong></td><td><strong>Description</strong></td><td><strong>Type</strong></td></tr><tr><td>Justification</td><td>Aligns the tiles horizontally within the group. Options include <code>Left</code>, <code>Center</code>, <code>Right</code>, <code>Space Between</code>, <code>Space Around</code>, and <code>Space Evenly</code>.</td><td>String</td></tr><tr><td>Spacing</td><td>The horizontal space (in pixels) between tiles. <em>Available only when justification is Left, Center, or Right.</em></td><td>Integer</td></tr></tbody></table>

**Vertical axis**

<table data-header-hidden><thead><tr><th width="177.451171875"></th><th width="433.148193359375"></th><th></th></tr></thead><tbody><tr><td><strong>Label</strong></td><td><strong>Description</strong></td><td><strong>Type</strong></td></tr><tr><td>Justification</td><td>Aligns the tiles vertically when they wrap onto multiple rows. Options include <code>Top</code>, <code>Center</code>, <code>Bottom</code>, <code>Space Between</code>, <code>Space Around</code>, and <code>Space Evenly</code>.</td><td>String</td></tr><tr><td>Spacing</td><td>The vertical space (in pixels) between rows of tiles. <em>Available only when justification is Top, Center, or Bottom.</em></td><td>Integer</td></tr></tbody></table>

## Tips and tricks

* **Build one tile**: Place your child widgets (text, images, buttons) into the single visible group container on the canvas and arrange them exactly as one tile should look. The widget duplicates that layout for every item in your dataset.
* **Watch the child names**: Note the auto-generated child names (like `text1`, `text2`). When you configure data bindings or handle `onButtonClick` events, these names identify which element triggered the action or receives the data.

## Video demo

{% embed url="https://youtu.be/fkWZCY4u6fQ" %}
