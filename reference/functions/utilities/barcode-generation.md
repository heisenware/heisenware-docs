# Barcode generation

Barcode generation encodes text as a 1D or 2D barcode and answers it as a base64-encoded PNG. Over 100 symbologies are supported, from EAN and Code 128 to QR code, Data Matrix and Aztec. Link the output to a [media view](../../widgets/display/media-view.md) to show it, or hand it to a [label printer](../connectors/label-printer.md) or into a [PDF](pdf-processing.md).

You find the function under **Utilities** > **Barcode Generation** in the Functions explorer. This class provides static functions only and does not require an instance. The code class name is `Barcode`.

### `generateBarcode`

Creates a barcode image from the specified type, text, and options.

#### Parameters

The table lists the options in everyday use. Every other key is passed on to the barcode library in lower case, so any option from the [BWIPP options reference](https://github.com/bwipp/postscriptbarcode/wiki/Options-Reference) works under its own name, for example `paddingwidth` or `textsize`.

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
      <td>The scaling factor of the image. Must be an integer greater than 0. Default 2.</td>
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
      <td><code>rotate</code></td>
      <td>Rotates the image: <code>N</code> (normal), <code>R</code> (right 90 degrees), <code>L</code> (left 90 degrees), or <code>I</code> (180 degrees). Default N.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>binaryText</code></td>
      <td>By default the text string is encoded as UTF-8 binary bytes. If the text is already 8-bit encoded, set this to true to disable that behavior. Default false.</td>
      <td>boolean</td>
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
      <td>Bar color as an RGB, RRGGBB, or CCMMYYKK hex value, for example <code>0F7180</code>.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>textColor</code></td>
      <td>Text color as an RGB, RRGGBB, or CCMMYYKK hex value.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>backgroundColor</code></td>
      <td>Background color as an RGB, RRGGBB, or CCMMYYKK hex value.</td>
      <td>string</td>
    </tr>
  </tbody>
</table>

{% hint style="warning" %}
#### Options without effect

The executor also offers `scaleX`, `scaleY`, `textAlign` and `borderColor`, and none of them changes the image in this version. Use `scale` for the size, `textsize` and `textgaps` from the BWIPP reference for the human-readable text, and `padding` with `backgroundColor` instead of a border.
{% endhint %}

#### Output

Returns a base64-encoded string representing the generated PNG image (for example, `iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACt...`). Throws an error if the type or text is invalid.

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
