# PDF processing

The PDF processing class provides static utility functions that create and manipulate PDF documents. It generates PDFs from structured JSON (`pdfmake` format), converts HTML content into PDFs, and merges multiple documents (PDF, PNG, and JPG) into a single PDF file. This class contains static functions only and does not require an instance.

### `mergeDocuments`

Merges multiple source documents into a single PDF file. The function accepts PDFs, PNG images, or JPG images, and automatically converts the images to PDF pages before merging.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>files</code></td><td>An array where each element is either a base64-encoded file string or an object containing a <code>path</code> property pointing to the file.</td><td>array</td></tr></tbody></table>

#### Output

Returns a file object representing the merged PDF file, including its path, name, size, and type.

#### Example

```yaml
# files
  - path: /shared/documents/report.pdf
  - path: /shared/documents/scan.png
```

### `createPdfFileFromJson`

Creates a new PDF file from a structured JSON object that follows the `pdfmake` document definition format. Use this format to control the PDF layout and content precisely. See the [pdfmake playground](http://pdfmake.org/playground.html) to test layouts.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>content</code></td><td></td><td>The content definition object or array following the <code>pdfmake</code> syntax.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>format</code></td><td>The page size (such as <code>A4</code>, <code>A5</code>, or <code>LETTER</code>). Default A4.</td><td>string</td></tr><tr><td></td><td><code>orientation</code></td><td>The page orientation: <code>portrait</code> or <code>landscape</code>. Default portrait.</td><td>string</td></tr></tbody></table>

#### Output

Returns a file object representing the generated PDF file.

#### Example

```yaml
# content
  - text: My Document Title
    style: header
  - This is a sample paragraph.
  - ul:
      - First list item
      - Second list item
# options
format: A4
orientation: portrait
```

### `createPdfBufferFromJson`

Creates a PDF from a `pdfmake` JSON object and returns it as a base64-encoded string instead of writing it to a file.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>content</code></td><td></td><td>The content definition object or array following the <code>pdfmake</code> syntax.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>format</code></td><td>The page size (such as <code>A4</code>, <code>A5</code>, or <code>LETTER</code>). Default A4.</td><td>string</td></tr><tr><td></td><td><code>orientation</code></td><td>The page orientation: <code>portrait</code> or <code>landscape</code>. Default portrait.</td><td>string</td></tr></tbody></table>

#### Output

Returns a base64-encoded string representing the generated PDF document.

#### Example

```yaml
# content
  - text: My Document Title
    style: header
# options
format: A4
```

### `createPdfFileFromHtml`

Converts an HTML string into a new PDF file.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>html</code></td><td></td><td>The HTML content string to convert.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>format</code></td><td>The page size. Default A4.</td><td>string</td></tr><tr><td></td><td><code>orientation</code></td><td>The page orientation: <code>portrait</code> or <code>landscape</code>. Default portrait.</td><td>string</td></tr><tr><td></td><td><code>tableAutoSize</code></td><td>Automatically sizes HTML tables. Default true.</td><td>boolean</td></tr><tr><td></td><td><code>removeExtraBlanks</code></td><td>Removes extra blank spaces from the document. Default false.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns a file object representing the generated PDF file.

#### Example

```yaml
# html
<h1>Report Title</h1><p>This report was generated.</p>
# options
orientation: landscape
```

### `createPdfBufferFromHtml`

Converts an HTML string into a PDF and returns it as a base64-encoded string.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>html</code></td><td></td><td>The HTML content string to convert.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>format</code></td><td>The page size. Default A4.</td><td>string</td></tr><tr><td></td><td><code>orientation</code></td><td>The page orientation: <code>portrait</code> or <code>landscape</code>. Default portrait.</td><td>string</td></tr><tr><td></td><td><code>tableAutoSize</code></td><td>Automatically sizes HTML tables. Default true.</td><td>boolean</td></tr><tr><td></td><td><code>removeExtraBlanks</code></td><td>Removes extra blank spaces from the document. Default false.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns a base64-encoded string representing the generated PDF document.

#### Example

```yaml
# html
<h1>Report Title</h1><p>This report was generated.</p>
# options
orientation: landscape
```
