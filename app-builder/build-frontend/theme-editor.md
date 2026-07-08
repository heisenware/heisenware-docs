# Theme Editor

The Theme Editor lets you customize the visual appearance and color scheme of each App individually. This ensures your App aligns with your corporate branding or specific design requirements.

## How to apply a Theme

Follow these steps to customize your App's Theme:

{% stepper %}
{% step %}
#### Open Theme Editor

From the App Builder's main Toolbar, select Theme Editing mode (<i class="fa-palette">:palette:</i>).
{% endstep %}

{% step %}
#### Choose a base Theme

Select from `Generic`, `Material`, or `Fluent` to define the overall style of your Widgets.
{% endstep %}

{% step %}
#### Select a color scheme

Choose a predefined scheme from the left menu or manually adjust individual colors to create a custom look.
{% endstep %}

{% step %}
#### Apply changes

Click Apply to refresh the UI preview with your new Theme.
{% endstep %}

{% step %}
#### Exit

Click the App Editing icon (<i class="fa-mobile">:mobile:</i>) in the Toolbar to return.
{% endstep %}
{% endstepper %}

{% hint style="info" %}
Heisenware's theming engine is built on the DevExtreme framework. For advanced details on the base Themes, see the official [DevExtreme documentation](https://js.devexpress.com/Documentation/Guide/Themes_and_Styles/Predefined_Themes/).
{% endhint %}

<figure><img src="../../.gitbook/assets/theme_editing2_looped.gif" alt="" width="563"><figcaption></figcaption></figure>

## How theming affects Widgets

Most [Widgets](widgets/) include color settings that interact directly with the App Theme. By default, a Widget's color is set to `Automatic`.

* **Automatic**: The Widget inherits its colors from the global App Theme. If you change the Theme later, the Widget updates automatically.
* **Manual override**: If you set a specific color for a Widget (for example, making a specific Button solid red), that setting overrides the Theme. This specific color remains fixed even if the global Theme changes.
