# Barcode / QR

The **Barcode** widget uses the device's camera to scan and decode a wide variety of barcode formats, including QR codes and traditional product barcodes.

When activated, it opens a full-screen camera view. Once a barcode is detected, the widget automatically captures its value and closes the scanner, providing a seamless experience for data entry and product identification tasks.

<figure><img src="../../../../.gitbook/assets/create_barcod_QR_looped.gif" alt=""><figcaption></figcaption></figure>

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-06-10 at 16.15.06.png" alt=""><figcaption><p>The Barcode/QR-Code scanner button in the UI</p></figcaption></figure>

## Data Binding

Connect the widget to your application's logic by dragging the corresponding items from the Backend Builder.

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

The barcode scanner is launched by a button. You can customize its appearance using standard button properties. Common properties include:

* **`scanMode`**: Whether to scan a single or multiple barcodes while the camera is active.&#x20;
* **`text`**: The text displayed on the button (e.g., "Scan Barcode").
* **`icon`**: The icon displayed on the button (e.g., "fa-thin fa-barcode-scan").
* **`type`**: The button's style type (`normal`, `default`, `success`, `danger`).
* **`stylingMode`**: The visual style of the button (`text`, `outlined`, `contained`).
