# Widgets

Widgets are the interactive building blocks of your App's UI. Static elements set the context; widgets work with your backend logic to display live data, capture user input, and trigger functions and flows. See [display widgets](display-widgets/), [input widgets](input-widgets/), and [trigger widgets](trigger-widgets/) for details.

## Configuration

Double-click a widget, or select it and click the edit icon on the toolbar, to open its settings. Most settings are unique to the specific widget.

These settings let you:

* **Customize visuals**: Adjust colors, labels, and styling to match your brand.
* **Define behavior**: Set default values, limits, or interaction rules.
* **Toggle features**: Enable or disable additional widget functionality, such as search bars.

### Context menu tools

Right-click any widget to open a menu for quick actions and data settings. Besides the general options (order, full width, tile view), you can:

* **Toggle multi-tenancy**: Controls how users see data.
  * **Isolated**: Each user sees only their own data, based on their session filters. Another user can filter differently without affecting your view. This is the default setting.
  * **Shared**: Every user sees the same data in real time. If one user applies a filter, it updates globally for everyone viewing the App.
* **Unlink all**: Clears every connection between the widget and your backend flows in a single click.

## Data binding

A widget operates once you link it to the [Backend Builder](../../build-backend/) through its properties, which serve as connection points that carry data in and out.

### How to link

1. Select the widget in the [Frontend Builder](../) (optional).
2. Drag a [function](../../build-backend/functions/) part (an input, trigger, or output) or a [modifier](../../build-backend/extension-nodes/modifier.md) from the [Backend Builder](../../build-backend/) and drop it onto the widget.
3. Pick a widget property inside the menu. The platform selects the main property automatically.

To break a link, click the `x` next to the property in the linked function, or use the widget's context menu to unlink all.

### Data direction mechanics

Drag from the function or extension node onto the widget. The selected slot determines the behavior:

* **Function output or modifier to widget**: A function output or modifier writes into a widget property, such as feeding a dataset into a chart or a status into a status lamp. Data flows from logic to the UI.
* **Widget to function input**: A widget event flows into a function input. Each event carries its data payload. For example, when a user edits a value in a data grid, the modified record travels into the function immediately. For some widgets, editing events only fire when you enable the corresponding setting on the widget.
* **Button to function trigger**: Connect a function trigger to a [button](trigger-widgets/button.md) so a click executes the function. The trigger transmits no data. This applies strictly to buttons since they are the only trigger widget, though you can also configure [icons](../text-icons-and-images.md) to act as buttons.

{% hint style="info" %}
#### Auto-triggering on input

To execute a function automatically from UI input instead of a click, wire the input of the function to its trigger. The incoming data feeds and executes the function without requiring a button.
{% endhint %}
