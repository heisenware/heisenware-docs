# Barcode generation

With barcode generation, you can create over 100 types of 1D and 2D barcodes and receive them as base64-encoded PNG images. The utility class provides static functions only, meaning you do not need to create an instance before calling them.

### `generateBarcode`

Creates a barcode image from the specified type, text, and options.

#### Parameters

See the [options reference](https://github.com/bwipp/postscriptbarcode/wiki/Options-Reference) for a full list of available configuration keys.

<table>
  <thead>
    <tr>
      <th width="120">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>type</code></td>
      <td></td>
      <td>The barcode type, for example <code>qrcode</code>, <code>code128</code>, <code>ean13</code>, or <code>pdf417</code>. See the full list of <a href="https://github.com/metafloor/bwip-js/wiki/BWIPP-Barcode-Types">supported types</a>.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>text</code></td>
      <td></td>
      <td>The text or data to encode into the barcode.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>scale</code></td>
      <td>Sets both the x-axis and y-axis scaling factor. Must be an integer greater than 0. Default 2.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>width</code></td>
      <td>Bar width in millimeters.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>height</code></td>
      <td>Bar height in millimeters.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>includeText</code></td>
      <td>Shows the human-readable text below the barcode. Default false.</td>
      <td>boolean</td>
    </tr>
    <tr>
      <td></td>
      <td><code>textAlign</code></td>
      <td>Alignment of the human-readable text: <code>left</code>, <code>center</code>, <code>right</code>, or <code>justify</code>. Default center.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>rotate</code></td>
      <td>Rotates the image: <code>N</code> (normal), <code>R</code> (right 90 degrees), <code>L</code> (left 90 degrees), or <code>I</code> (180 degrees). Default N.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>padding</code></td>
      <td>Space generated around the barcode.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>barColor</code></td>
      <td>Bar color as a hex value, for example <code>0F7180</code>.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>textColor</code></td>
      <td>Text color as a hex value.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>backgroundColor</code></td>
      <td>Background color as a hex value.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>borderColor</code></td>
      <td>Border color as a hex value.</td>
      <td>string</td>
    </tr>
  </tbody>
</table>

#### Output

Returns a base64-encoded string representing the generated PNG image (for example, `iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACt...`).

#### Examples

##### Simple QR code

Generates a standard QR code for a URL.

```yaml
# type
qrcode
# text
https://heisenware.com
```

##### Styled Code 128 barcode

Creates a `code128` barcode, scales it, includes the human-readable text, and applies custom colors.

```yaml
# type
code128
# text
12345678
# options
  scale: 3
  includeText: true
  barColor: 0F7180
  textColor: 0F7180
```

##### Rotated EAN-13 barcode

Generates an `ean13` barcode (which requires a 12-digit input) and rotates it 90 degrees to the right.

```yaml
# type
ean13
# text
123456789012
# options
  scale: 4
  rotate: R
```
