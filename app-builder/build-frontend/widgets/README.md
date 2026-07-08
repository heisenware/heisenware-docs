# Widgets

Widgets are the functional building blocks of your App's UI. While static elements provide context, Widgets are what actually interact with your backend logic. They [display live data](display-widgets/), [capture user input](input-widgets/), and [trigger](trigger-widgets/) Functions and Flows.

## Configuration

Double-click a Widget, or select it and click the pen icon in the Toolbar, to open its settings. Most settings are unique to the specific Widget you're using.

These settings let you:

* **Customize visuals**: Adjust colors, labels, and styling to match your brand.
* **Define behavior**: Set default values, limits, or interaction rules.
* **Toggle features**: Enable or disable additional Widget functionality, such as search bars.

### Context menu tools

Right-click any Widget to open a menu for quick actions and data settings. Besides the general options (order, full width, tile view), you can:

* **Toggle multi-tenancy**: This controls how users see the data.
  * **Isolated**: Each user sees only their own data, based on their session filters. Another user can filter differently without affecting your view. This is the default setting.
  * **Shared**: Every user sees the same data in real time. If one user applies a filter, it updates globally for everyone viewing the App.
* **Unlink all**: A reset button that breaks every connection between the Widget and your backend Flows in one click.

## Data binding

Widgets come to life when linked to the Backend Builder. We call these connection points Properties.

### How to link

1. Select the Widget in the Frontend Builder (optional).
2. Drag a part of a [Function](../../build-backend/functions.md) (an Input, Trigger, Output, or Modifier) and drop it onto the Widget.
3. Pick a Widget Property appearing inside the Function block.

<figure><img src="../../../.gitbook/assets/Data Binding Basics.gif" alt=""><figcaption><p>Data binding basics</p></figcaption></figure>

To unlink, click the `x` next to the Property in the linked Function, or use the Widget's context menu to `unlink all`.

### Connection directions

* **To Input**: The Widget sends data into a Function.
* **To Trigger**: A user action starts a Function Flow.
* **From Output**: A Function sends data to a Widget's Property, either to visualize a value or to change a visual setting.
