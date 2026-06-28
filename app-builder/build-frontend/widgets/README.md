# Widgets

Widgets are the functional building blocks of your application UI. While static elements provide context, widgets are what actually interact with your backend logic. They [display live data](display-widgets/), [capture user input](input-widgets/), and [trigger](trigger-widgets/) functions and flows.

## Configuration

Double-click a widget or select it and click the edit icon (<i class="fa-pen">:pen:</i>) in the toolbar to open its settings. Most settings are unique to the specific widget you are using.

These configurations allow you to:

* **Customize visuals**: Adjust colors, labels, and styling to match your brand.
* **Define behavior**: Set default values, limits, or interaction rules.
* **Toggle features**: Enable or disable additional widget functionality, such as search bars.

### Context menu tools

Right-click any widget to open a menu for quick actions and data settings. Besides the general options (order, full width, tile view), it is possible to:

* **Toggle multi-tenancy**: This controls how users see the data.
  * **Isolated**: Each user sees only their data based on their session filters. Another person can filter differently without affecting your view. This is the default setting.
  * **Shared**: Every user sees the same data in real time. If one user applies a filter, it updates globally for everyone viewing the app.
* **Unlink all**: A reset button that breaks every connection between the widget and your backend flows in one click.

## Data binding

Widgets come to life when linked to your Backend Builder. We call these connection points properties.

### How to link

1. Select the widget in the Frontend Builder (optional).
2. Drag a part of a [function](../../build-backend/functions.md) (input, trigger, output, or modifier) and drop it onto the widget.
3. Pick a widget property appearing inside the function block.

<figure><img src="../../../.gitbook/assets/Data Binding Basics.gif" alt=""><figcaption><p>Data binding basics</p></figcaption></figure>

To unlink, click the `x` next to the property in the linked function, or use the widget context menu to `unlink all`.

### Connection directions

* **To input**: The widget sends data into a function.
* **To trigger**: A user action starts a function flow.
* **From output**: A function sends data to a widget property to visualize a value or change a visual property.
