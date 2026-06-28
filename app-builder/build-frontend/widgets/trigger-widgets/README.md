# Trigger Widgets

Trigger widgets are interactive UI elements designed to capture direct user actions and initiate processes in your backend logic.

## Available trigger widgets

* [**Button**](button.md): The standard, highly configurable button. You use it to capture clicks and start your Function sequences.

{% hint style="success" %}
**Icons as trigger widgets**\
While the button is the only official widget in this category, you can also use [icons](../../text-icons-and-images.md#icon) as triggers. They follow the same data binding rules as the button widget.
{% endhint %}

## Connecting to backend logic (data binding)

Trigger widgets connect to your logic by linking an event (like a click) to a Function.

### How to link

You link widgets by dragging the logic to the UI:

1. Drag a trigger from a Function and drop it onto the widget.
2. A menu will appear on the Function block; pick the specific widget event, usually `onClick`, to complete the link. For buttons, there is only one property, so the selection is automatic.

### Two-way interaction

* **To Function trigger**: Clicking the button starts the connected logic flow.
* **From Function output / from modifier**: A Function sends data back to the button. For example, you can link a Function's output to a button's `done` property to show a loading animation inside the button until that part of your flow is executed.

{% hint style="success" %}
**Auto-triggering on input**

&#x20;You can trigger a Function automatically when a user enters data. To do this, connect the Function input with the Function trigger. In such a case, no extra event (like a click) by the user.
{% endhint %}
