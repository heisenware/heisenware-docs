# Input widgets

Input widgets capture data from your users and their devices, from a single signature to a full, multi-field form. Whatever they collect flows straight into your backend logic for processing, storage, or analysis.

{% hint style="info" %}
#### Categorization by main usage

We group widgets by their primary purpose, but many are versatile. A [form](form.md) (an [input widget](./)) can display data, and a [data grid](../display-widgets/data-grid.md) (a [display widget](../display-widgets/)) can capture it. Always check a widget's properties to see its full range.
{% endhint %}

## Available input widgets

These input widgets sit in the toolbar, each with its own configuration and data properties:

* [**Barcode / QR**](barcode-qr.md): Scans and decodes common barcode and QR-code formats with the device camera.
* [**File upload**](upload.md): Lets users upload files (images, PDFs, CSVs, and more) straight from their device.
* [**Form**](form.md): A configurable widget for complex data-entry screens, with varied field types, grouping, and validation.
* [**Photo**](photo.md): Lets users take pictures with their device camera and add them to the app session.
* [**Signature**](signature.md): Captures handwritten signatures as images, ideal for digital work orders or sign-offs.

## Connecting to backend logic (data binding)

Input widgets exchange data with your logic through the Backend Builder.

### How to link

Link a widget by dragging the logic onto it:

1. Drag a [function](../../../build-backend/functions.md) part (an input or output) or a [modifier](../../../build-backend/extension-nodes/modifier.md) onto the widget.
2. On the function block, pick the widget property you want to link.

### Interaction types

* **To a function input**: The widget sends what the user enters (e.g. `formData`) into a function.
* **From a function output or a modifier**: A function or modifier sends data back to update the widget. Link a function's output to a form's `clear` property, for example, and the form resets the moment the flow reaches that output.

## Configuration and data binding

Widget properties control a widget's behavior, appearance, and the data it exchanges with your backend. Depending on the property, you set it one of two ways:

* **Static configuration**: Set the property once in the widget's settings panel. The value is fixed at design time.
* **Data binding**: Drive the property from your backend logic at runtime, so it updates live as data flows through your App.

Not every property works both ways. Some live only in the settings panel, some exist only through data binding (the live values a widget sends or receives, like a scanned code or a form's data), and many support both. Each widget page lists its bindable properties in the data binding tables and its settings-panel properties under configuration.

## Automatic data isolation (multi-tenancy)

Heisenware isolates the data from every input widget per user and session automatically, so you handle no multi-tenancy yourself.

* **Isolated by default**: If user A and user B use the same form, their data never mixes.
* **Session persistence**: As data moves through a flow, it stays tied to that user's session.
* **User reference**: To reference the current user ID in your logic, use the `$USER` variable. It returns the user's email address (for authenticated Apps) or a unique session string (for public Apps).
