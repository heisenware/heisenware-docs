# Trigger widgets

Trigger widgets capture direct user actions, such as clicks, to execute backend logic.

## Available trigger widgets

* [**Button**](button.md): Captures clicks to execute function sequences.

{% hint style="info" %}
#### Using icons as triggers
The button is the primary widget in this category, but you can also configure [icons](../../text-icons-and-images.md#icons) as triggers. Icons follow identical data binding rules.
{% endhint %}

## Data binding

Drag from a function or modifier onto the button. The selected slot determines the behavior:
* **Button to function trigger**: A click executes the connected function. The trigger transmits no data. This is the primary direction for trigger widgets.
* **Function output or modifier to widget**: A function output or modifier writes back into a button property. For example, link an output to the `done` property of a [button](button.md) to display a loading animation until that segment of the flow finishes.

The button features a single `onClick` event, so the selection happens automatically when linking a trigger. See [Widgets](../README.md#data-binding) for the full mechanics.

{% hint style="info" %}
#### Auto-triggering on input
To execute a function automatically from user interface input instead of a click, wire the input of the function to its own trigger. The incoming data feeds and executes the function without requiring a button widget.
{% endhint %}
