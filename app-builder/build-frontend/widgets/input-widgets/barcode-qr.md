# Barcode / QR

The barcode / QR widget uses the device's camera to scan and decode a wide variety of barcode formats, including QR codes and traditional product barcodes.

It opens a full-screen camera view, then captures the decoded value and closes the scanner the moment it detects a barcode, keeping data entry and product identification fast.

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-06-10 at 16.15.06.png" alt=""><figcaption><p>The barcode / QR scanner button in the UI</p></figcaption></figure>

## Data binding

### Widget to function input

| **Property** | **Description**                                                                                                                   | **Type**        |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `text`       | Fires when a barcode is scanned, sending the decoded string. In scan mode `multiple`, the payload is an array of decoded strings. | string or array |

### Function output or modifier to widget

| **Property** | **Description**                                                                                                                                                                                                          | **Type** |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| `clear`      | Clears the scanned value(s) currently held by the widget.                                                                                                                                                                | boolean  |
| `button`     | Overrides the scan button at runtime (label, styling, disabled state, and more), for example to restyle it per user or context. Takes a `button` object; see [button configuration](barcode-qr.md#button-configuration). | object   |

## Configuration

Set the widget's defaults in the settings panel. The scan button is the visible part of the widget, so most settings style that button. You can override any of these at runtime through the `button` binding above.

### Settings

| **Property**        | **Label**          | **Description**                                                     | **Type** |
| ------------------- | ------------------ | ------------------------------------------------------------------- | -------- |
| `scanMode`          | Scan mode          | Scan a `single` barcode or `multiple` while the camera is active.   | string   |
| `text`              | Button text        | The text on the scan button.                                        | string   |
| `icon`              | Icon               | The icon on the scan button.                                        | string   |
| `fontSize`          | Text size          | The size of the button's text.                                      | integer  |
| `iconSize`          | Icon size          | The size of the button's icon.                                      | integer  |
| `type`              | Button type        | The button type (`default`, `normal`, `success`, `danger`, `back`). | string   |
| `stylingMode`       | Styling mode       | The button's styling mode (`text`, `contained`, `outlined`).        | string   |
| `hoverText`         | Hover text         | A tooltip shown when the user hovers over the button.               | string   |
| `initiallyDisabled` | Initially disabled | If `true`, the button is disabled when the App first loads.         | boolean  |

### Button configuration

Bind a `button` object to the widget to override the scan button from backend logic at runtime. This lets you change its label, styling, or state on the fly, for example restyling it for a specific user or context.

| **Property**  | **Description**                                                     | **Type** |
| ------------- | ------------------------------------------------------------------- | -------- |
| `text`        | The button text.                                                    | string   |
| `fontSize`    | The size of the button's text.                                      | integer  |
| `iconSize`    | The size of the button's icon.                                      | integer  |
| `type`        | The button type (`default`, `normal`, `success`, `danger`, `back`). | string   |
| `stylingMode` | The button's styling mode (`text`, `contained`, `outlined`).        | string   |
| `disabled`    | When truthy, disables the button; when falsy, enables it.           | any      |
