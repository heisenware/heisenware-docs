# Barcode Generation

The `Barcode` class provides functionality to generate over 100 different types of 1D and 2D barcodes and return them as Base64 encoded images. It is a utility class with only static methods, so you do not need to create an instance.

### generateBarcode

This function creates a barcode image based on the provided type, text, and configuration options. It returns a base64 encoded string of the generated PNG image.

Parameters

* type: The type of barcode to generate. A full list of supported types can be found [here](https://github.com/metafloor/bwip-js/wiki/BWIPP-Barcode-Types) (e.g., `qrcode`, `code128`, `ean13`, `pdf417`).
* text: The string of text or data that you want to encode into the barcode.
* options: An object containing various options to customize the appearance of the barcode. A full list of options can be found in the [Options Reference](https://github.com/bwipp/postscriptbarcode/wiki/Options-Reference).

#### Example: Simple QR Code

This example generates a standard QR code for a URL.

```yaml
# type
qrcode
# text
https://heisenware.com
```

#### Example: Styled Code 128 Barcode

This example creates a `code128` barcode, scales it, includes the human-readable text, and applies custom colors.

```yaml
# type
code128
# text
Heisenware Rocks!
# options
scale: 3
includeText: true
textAlign: center
barColor: 0F7180
textColor: 0F7180
```

#### Example: Rotated EAN-13 Barcode

This example generates an `ean13` barcode (which requires a 12-digit input) and rotates it 90 degrees to the right.

```yaml
# type
ean13
# text
400638133393
# options
scale: 4
rotate: R
```

Output

The Function Outputs a base64 encoded string representing the generated barcode image. For example: `iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACt...`
