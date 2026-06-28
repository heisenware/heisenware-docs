# Input Widgets

Input widgets are the primary tools for capturing data from your users and their devices. They range from single-purpose components like a signature pad to the powerful, all-in-one form widget. The data collected by these widgets can be passed directly to your backend logic for processing, storage, or analysis.

{% hint style="info" %}
#### Categorization by main usage

We categorize widgets based on their primary purpose. However, some widgets are versatile; for example, a [form](form.md) (an [input widget](./)) can display data, while a [data grid](../display-widgets/data-grid.md) (a [display widget](../display-widgets/)) can be used for data input. Always check the specific properties of a widget to see its full range of capabilities.
{% endhint %}

## Available input widgets

You can find the following input widgets in the toolbar. Each has its own specific configuration and data properties:

* [**Barcode/QR-code scan**](barcode-qr.md): Uses the device camera to scan and decode common barcode and QR-code formats.
* [**File upload**](upload.md): Allows users to upload files (e.g., images, PDFs, CSVs) from their device directly into your application.
* [**Form**](form.md): A highly configurable widget for creating complex data entry screens with various field types, grouping, and logic-based validation.
* [**Photo**](photo.md): Lets users take pictures with their device's camera and upload them into the app session.
* [**Signature**](signature.md): Captures handwritten signatures as images—ideal for digital work orders or sign-offs.

## Connecting to backend logic (data binding)

Input widgets send and receive data via the Flow Builder.

### How to link

You link widgets by dragging the logic to the UI:

1. Drag a part of a function (input, output, or modifier) and drop it onto the widget.
2. A menu will appear on the function block; pick the specific widget property you want to link.

### Interaction types

* **To function input**: The widget sends user-entered data (e.g., `formData`) to a function.
* **From function output / from modifier:** A function sends data back to the widget to update its state. For example, you can link a function's output to a form's `clear` property. When the flow reaches that output, the form is instantly reset.

## Automatic data isolation (multi-tenancy)

Heisenware handles multi-tenancy of your apps for you automatically. Any data captured from an input widget is isolated per user and session.

* **Isolated by default**: If User A and User B use the same form, their data never mixes.
* **Session persistence**: As data moves through a flow, it remains tied to that specific user session.
* **User reference**: If you need to explicitly reference the current user ID in your logic, use the `$USER` variable. This returns the user's email address (for authenticated apps) or a unique session string (for public apps).
