# Theme Editor

The Theme Editor allows you to customize the visual appearance and color scheme of each application individually. This ensures your app aligns with your corporate branding or specific design requirements.

## How to Apply a Theme

Follow these steps to customize your app's theme:

{% stepper %}
{% step %}
#### Open Theme Editor

From the App Builder's main toolbar, select Theme Editing mode (<i class="fa-palette">:palette:</i>).
{% endstep %}

{% step %}
#### Choose a base theme

Select from `Generic`, `Material`, or `Fluent` to define the overall style of the components.
{% endstep %}

{% step %}
#### Select a color scheme

Choose a predefined scheme from the left menu or manually adjust individual colors to create a custom look.
{% endstep %}

{% step %}
#### Apply changes

Click Apply to refresh the UI preview with your new theme.
{% endstep %}

{% step %}
#### Exit

Click the App Editing icon (<i class="fa-mobile">:mobile:</i>) in the toolbar to return.
{% endstep %}
{% endstepper %}

{% hint style="info" %}
Heisenware's theming engine is built upon the DevExtreme framework. For advanced details on the capabilities of the base themes, please refer to the official [DevExtreme documentation](https://js.devexpress.com/Documentation/Guide/Themes_and_Styles/Predefined_Themes/).
{% endhint %}

<figure><img src="../../.gitbook/assets/theme_editing2_looped.gif" alt="" width="563"><figcaption></figcaption></figure>

## How Theming Affects Widgets

Most [widgets](widgets/) include color settings that interact directly with the app theme. By default, a widget's color is set to `Automatic`.

* **Automatic**: The widget inherits its colors from the global app theme. If you change the theme later, the widget updates automatically.
* **Manual override**: If you set a specific color for a widget (for example, making a specific button solid red), that setting overrides the theme. This specific color will remain fixed even if the global theme is modified.
