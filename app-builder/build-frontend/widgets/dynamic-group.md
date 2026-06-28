# Dynamic Group

{% hint style="info" %}
Will be available with the [v90 release](../../../release-notes/v90-grouped-periodically.md).
{% endhint %}

The Dynamic Group is a versatile container that allows you to bundle multiple UI widgets together. While it can be used simply to organize your layout, its true power is unlocked when you bind it to data: it acts as a "repeater".

When you provide an array of data to the Group widget, it automatically generates a "tile" for each item in the array, duplicating the child widgets inside it. This makes it the perfect tool for building custom lists, product cards, user directories, or dynamic dashboards.

{% embed url="https://youtu.be/fkWZCY4u6fQ" %}

## Data Binding

Connect the widget to your application's logic by dragging the corresponding items from the Backend Builder.

### Output

_(Drag an output or modifier element onto the widget)_

| **Property** | **Type**            | **Description**                                                                                                             |
| ------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `data`       | `Array` or `Object` | The dataset used to populate the group. If an array of objects is provided, the group will generate a tile for each object. |

### Input

_(Drag an input element onto the widget)_

When a user interacts with a generated tile or a widget inside it, the Group widget fires events containing the interaction details alongside the full data object of that specific tile (including its `index`).

<table data-header-hidden><thead><tr><th width="160.61614990234375"></th><th width="133.06744384765625"></th><th></th></tr></thead><tbody><tr><td><strong>Property</strong></td><td><strong>Type</strong></td><td><strong>Description</strong></td></tr><tr><td><code>onGroupClick</code></td><td><code>Object</code></td><td>Fired when a user clicks anywhere on the background of a specific tile. The payload is the data object associated with that tile.</td></tr><tr><td><code>onChange</code></td><td><code>Object</code></td><td>Fired when a user changes the value of an input widget (like a text box or switch) inside a tile. The payload includes the updated data for that tile.</td></tr><tr><td><code>onButtonClick</code></td><td><code>Object</code></td><td>Fired when a user clicks a button or trigger widget inside a tile. The payload includes the row data, the <code>clickedBy</code> widget name, and the <code>buttonText</code>.</td></tr></tbody></table>

## Configuration

Because the Group widget manages child widgets, its configuration is split between defining how data flows into the children, and how the repeated tiles are arranged on the screen.

### Data Settings (Data Bindings)

Once you bind an array of objects to the group's `data` property, the widget analyzes your data structure and populates the Data settings panel.

Here, you will see a list of all the child widgets you have placed inside the group (e.g., `Text1`, `Button1`, `Image1`). For each child widget, you can define one or more Bindings:

| **Label**       | **Description**                                                                                                                                                               |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Widget Property | The specific UI property of the child widget you want to control (e.g., `text`, `disabled`, `color`).                                                                         |
| Data Property   | The key from your dataset that contains the value. You can select `<Current Value>` to pass the entire object, or use dot notation for nested paths (e.g., `user.firstName`). |

_Example:_ If your dataset contains a list of users with a `firstName` property, you can bind `firstName` to the `value` property of a [Value Box](display-widgets/value-box.md) inside the group. Every generated tile will then display the correct first name for that specific user.

### Style Settings

These properties apply specifically when you have bound an array of objects to the `data` property, dictating how the generated tiles are arranged inside the main Group container.

Horizontal Axis

<table data-header-hidden><thead><tr><th width="169.87542724609375"></th><th width="435.464599609375"></th><th></th></tr></thead><tbody><tr><td><strong>Label</strong></td><td><strong>Description</strong></td><td><strong>Type</strong></td></tr><tr><td>Justification</td><td>Defines how the tiles align horizontally within the group. Options include <code>Left</code>, <code>Center</code>, <code>Right</code>, <code>Space Between</code>, <code>Space Around</code>, and <code>Space Evenly</code>.</td><td>String</td></tr><tr><td>Spacing</td><td>The amount of horizontal space (in pixels) between individual tiles. <em>(Only available if justification is Left, Center, or Right).</em></td><td>Integer</td></tr></tbody></table>

Vertical Axis

<table data-header-hidden><thead><tr><th width="177.451171875"></th><th width="433.148193359375"></th><th></th></tr></thead><tbody><tr><td><strong>Label</strong></td><td><strong>Description</strong></td><td><strong>Type</strong></td></tr><tr><td>Justification</td><td>Defines how the tiles align vertically if they wrap onto multiple rows. Options include <code>Top</code>, <code>Center</code>, <code>Bottom</code>, <code>Space Between</code>, <code>Space Around</code>, and <code>Space Evenly</code>.</td><td>String</td></tr><tr><td>Spacing</td><td>The amount of vertical space (in pixels) between rows of tiles. <em>(Only available if justification is Top, Center, or Bottom).</em></td><td>Integer</td></tr></tbody></table>

## Tips and Tricks

* Building the layout: When designing your group, place your child widgets (Text, Images, Buttons) into the single visible Group container on the canvas. Arrange them exactly how you want one single tile to look. The widget will automatically handle duplicating that exact layout for every item in your dataset.
* Child Widget Names: Pay attention to the auto-generated names of your child widgets (like `text1`, `text2`). When configuring Data Bindings or handling `onButtonClick` events, these names are used to identify which specific element triggered the action or receives the data.
