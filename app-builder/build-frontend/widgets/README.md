# Widgets

Widgets are the interactive building blocks of your App's UI. Static elements set the context; widgets do the work with your backend logic, [displaying live data](display-widgets/), [capturing user input](input-widgets/), and [triggering](trigger-widgets/) functions and flows.

## Configuration

Double-click a widget, or select it and click the pen icon in the toolbar, to open its settings. Most settings are unique to the specific widget you're using.

These settings let you:

* **Customize visuals**: Adjust colors, labels, and styling to match your brand.
* **Define behavior**: Set default values, limits, or interaction rules.
* **Toggle features**: Enable or disable additional widget functionality, such as search bars.

### Context menu tools

Right-click any widget to open a menu for quick actions and data settings. Besides the general options (order, full width, tile view), you can:

* **Toggle multi-tenancy**: This controls how users see the data.
  * **Isolated**: Each user sees only their own data, based on their session filters. Another user can filter differently without affecting your view. This is the default setting.
  * **Shared**: Every user sees the same data in real time. If one user applies a filter, it updates globally for everyone viewing the App.
* **Unlink all**: A reset button that breaks every connection between the widget and your backend flows in one click.

## Connecting widgets to logic

A widget comes to life once you link it to the [Backend Builder](../../build-backend/) through its properties, the connection points that carry data in and out.

### How to link

1. Select the widget in the [Frontend Builder](../) (optional).
2. Drag a [function](../../build-backend/functions.md) part (an input, trigger, or output) or a [modifier](../../build-backend/modifier.md) and drop it onto the widget.
3. Pick a widget property inside the opening menu. By default, the system chooses the main property for you.

<figure><img src="../../../.gitbook/assets/Data Binding Basics.gif" alt=""><figcaption><p>Data binding basics</p></figcaption></figure>

To unlink, click the `x` next to the property in the linked function, or use the widget's context menu to unlink all.

### Which way the data flows

You always drag from the function onto the widget, but the slot you pick on the function decides what happens:

* **Function output or modifier to widget**: A function's output (or a modifier) writes into a widget property, for example feeding a dataset into a chart or a status into a lamp. Data flows from logic to UI.
* **Widget to function input**: A widget event, like a click or an edit, flows into a function's input. These events aren't bare notifications: each one carries its data with it. When a user edits a value in a data grid, for example, the changed record travels into the function the moment the edit is confirmed. Editing events only fire when you enable the matching setting on the widget.
* **Function trigger to a button**: Connect a function's trigger to a [button](trigger-widgets/button.md) so a click starts the function. Only the click is sent, no data. This works with buttons only, since they're the one [trigger widget](trigger-widgets/). However, you can turn [icons](../text-icons-and-images.md) into buttons, too.

To start a function automatically from UI input rather than a click, wire the function's input to its own trigger. The incoming data then both feeds the function and fires it, no button needed. See [auto-triggering on input](trigger-widgets/#auto-triggering-on-input).
