# Trigger widgets

Trigger widgets capture a direct user action, like a click, and kick off logic in your backend.

## Available trigger widgets

* [**Button**](button.md): The standard, highly configurable button. Use it to capture clicks and start your function sequences.

{% hint style="info" %}
#### Icons as trigger widgets

The button is the only official widget in this category, but you can also use [icons](../../text-icons-and-images.md#icons) as triggers. They follow the same data binding rules as the button.
{% endhint %}

## Connecting to backend logic (data binding)

Trigger widgets link an event, like a click, to a [function](../../../build-backend/functions.md).

### How to link

Link a widget by dragging the logic onto it:

1. Drag a trigger from a function onto the widget.
2. On the function block, pick the widget event, usually `onClick`, to complete the link. A button has only one event, so the selection happens automatically.

### Two-way interaction

* **To a function trigger**: Clicking the button starts the connected flow.
* **From a function output or a modifier**: A function or modifier sends data back to the button. Link a function's output to a button's `done` property, for example, to show a loading animation on the button until that part of the flow finishes.

{% hint style="info" %}
#### Auto-triggering on input

You can fire a function automatically when a user enters data, with no click required. Connect the function's input to its trigger.
{% endhint %}
