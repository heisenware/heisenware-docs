# Barcode / QR

The barcode / QR widget uses the device's camera to scan and decode a wide variety of barcode formats, including QR codes and traditional product barcodes.

It opens a full-screen camera view, then captures the decoded value and closes the scanner the moment it detects a barcode, keeping data entry and product identification fast.

<figure><img src="../../../../.gitbook/assets/create_barcod_QR_looped.gif" alt=""><figcaption></figcaption></figure>

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-06-10 at 16.15.06.png" alt=""><figcaption><p>The barcode / QR scanner button in the UI</p></figcaption></figure>

## Data binding

Link this widget to your logic by dragging items from the [Backend Builder](../../../build-backend/) onto it.

### Input

| **Property**  | **Type**                   | **Description**                                                                                                                                                                              |
| ------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`barcode`** | `String\|Array<String>`    | <p>Fired when a barcode is successfully scanned. The payload is the text content decoded from the barcode.<br>In scan mode <code>multiple</code> the result is an array of the contents.</p> |

### Output

| **Property** | **Type**  | **Description**                                                                   |
| ------------ | --------- | --------------------------------------------------------------------------------- |
| **`clear`**  | `Boolean` | When `true`, clears the last scanned barcode value from your application's state. |

## Configuration

### Settings

A button launches the barcode scanner. Customize its appearance with standard button properties, set in the widget's settings panel; some can also be driven dynamically through [data binding](./#configuration-and-data-binding). Common properties include:

* **`scanMode`**: Whether to scan a single or multiple barcodes while the camera is active.
* **`text`**: The text displayed on the button (e.g., "Scan Barcode").
* **`icon`**: The icon displayed on the button (e.g., "fa-thin fa-barcode-scan").
* **`type`**: The button's style type (`normal`, `default`, `success`, `danger`).
* **`stylingMode`**: The visual style of the button (`text`, `outlined`, `contained`).
