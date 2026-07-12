# Input widgets

Input widgets capture data from your users and their devices, handling everything from a single signature to a multi-field form. Collected data flows directly into your backend logic for processing, storage, or analysis.

{% hint style="info" %}
#### Widget versatility and categorization

The platform groups widgets by their primary purpose, though many serve multiple roles. For example, a [form](form.md) (an [input widgets](./)) can display data, and a [data grid](../display-widgets/data-grid.md) (a [display widgets](../display-widgets/)) can capture input. Check the properties of each widget to see its full capabilities.
{% endhint %}

## Available input widgets

The toolbar contains the following input widgets, each featuring distinct configuration and data properties:

* [**Barcode / QR**](barcode-qr.md): Scans and decodes barcode and QR code formats using the device camera.
* [**Upload**](upload.md): Lets users upload files directly from their device.
* [**Form**](form.md): Builds complex data-entry layouts with varied field types, field grouping, and validation rules.
* [**Photo**](photo.md): Captures images using the device camera.
* [**Signature**](signature.md): Captures handwritten signatures as image strings.

## Data binding

Input widgets exchange data with backend logic using the [Backend Builder](../../../build-backend/).

### How to link

Link a widget by dragging logic onto it:

1. Drag a [function](../../../build-backend/functions/) component (input or output) or a [modifier](../../../build-backend/extension-nodes/modifier.md) onto the widget.
2. Select the target widget property inside the configuration menu.

### Interaction types

* **Widget to function input**: The widget transmits user entries into a function input property.
* **Function output or modifier to widget**: A function output or modifier transmits data to update the widget. For example, linking a function output to the `clear` property of a [form](form.md) resets the form automatically when the flow executes that function.

## Configuration

Widget properties control behavior, appearance, and backend data exchange. Configure properties using two methods:

* **Static configuration**: Define the property inside the settings panel. The value remains fixed.
* **Data binding**: Drive the property from backend logic at runtime to update the widget live as data flows through the App.

{% hint style="info" %}
#### Property configuration methods

Not every property supports both methods. Some properties exist exclusively inside the settings panel, others require data binding, and many support both. Individual widget pages list bindable properties in data binding tables and settings panel fields under configuration.
{% endhint %}

## Automatic data isolation

The platform isolates data for every input widget per user and session automatically.

* **Default isolation**: Data never mixes if different users interact with the same form.
* **Session persistence**: Data remains tied to the specific user session as it moves through a flow.
* **User references**: Reference the active user ID in backend logic using the `$USER` variable. This variable returns the user email address in authenticated Apps or a unique session string in public Apps.
