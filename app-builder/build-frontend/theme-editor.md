# Theme Editor

The Theme Editor lets you set the visual appearance and color scheme of each App individually, so every App matches your corporate branding or specific design requirements.

## How to apply a theme

To set your App's theme:

{% stepper %}
{% step %}
#### Open Theme Editor

From the App Builder's Top Bar, open the Theme Editor (<i class="fa-palette">:palette:</i>).
{% endstep %}

{% step %}
#### Choose a base theme

Select from `Generic`, `Material`, or `Fluent` to define the overall style of your widgets.
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

Click the App Editing icon (<i class="fa-mobile">:mobile:</i>) in the Top Bar to return.
{% endstep %}
{% endstepper %}

{% hint style="info" %}
Heisenware's theming engine is built on the DevExtreme framework. For advanced details on the base themes, see the official [DevExtreme documentation](https://js.devexpress.com/Documentation/Guide/Themes_and_Styles/Predefined_Themes/).
{% endhint %}

<figure><img src="../../.gitbook/assets/theme_editing2_looped.gif" alt="" width="563"><figcaption></figcaption></figure>

## How theming affects widgets

Most [widgets](widgets/) carry color settings that respond directly to the App's theme. By default, a widget's color is `Automatic`.

* **Automatic**: The widget inherits its colors from the global App theme. If you change the theme later, the widget updates automatically.
* **Manual override**: If you set a specific color for a widget (for example, making a specific button solid red), that setting overrides the theme. This specific color remains fixed even if the global theme changes.
