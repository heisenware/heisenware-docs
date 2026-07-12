# Trigger widgets

Trigger widgets capture a direct user action, like a click, and kick off logic in your backend.

## Available trigger widgets

* [**Button**](button.md): The standard, highly configurable button. Use it to capture clicks and start your function sequences.

{% hint style="info" %}
#### Icons as trigger widgets

The button is the only official widget in this category, but you can also use [icons](../../text-icons-and-images.md#icons) as triggers. They follow the same data binding rules as the button.
{% endhint %}

## Connecting to backend logic (data binding)

You drag from a function onto the button, and the slot you pick sets what happens:

* **Function trigger to button**: A click starts the connected function. Only the click is sent, no data. This is the main direction for trigger widgets.
* **Function output to button**: A function's output (or a modifier) writes back into a button property. Link an output to a button's `done` property, for example, to show a loading animation until that part of the flow finishes.

When you link a trigger, a button has only one event (`onClick`), so the selection happens automatically. For the full mechanic, see [connecting widgets to logic](../README.md#connecting-widgets-to-logic).

{% hint style="info" %}
#### Auto-triggering on input

To fire a function automatically from UI input rather than a click, wire the function's input to its own trigger. The incoming data then both feeds the function and fires it, no button needed.
{% endhint %}
