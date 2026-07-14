# PDF processing

With PDF processing, you create and manipulate PDF documents: generate PDFs from structured JSON (pdfmake format), convert HTML content into PDFs, and merge multiple existing documents into a single PDF file. All functions are static, so you do not need to create an instance.

## `mergeDocuments`

Merges multiple source documents into a single PDF file. The source documents can be PDFs or images (PNG, JPG, and, as file objects, HEIC). Images are automatically converted to PDF pages before merging, JPG images are auto-rotated based on their EXIF data. Inputs that cannot be read are skipped with a warning instead of failing the whole merge.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>files</code></td><td>An array where each element is either a base64-encoded string of a file or a FileJSON object (an object with a <code>path</code> property pointing to the file).</td><td>array</td></tr></tbody></table>

### Example

```yaml
# files
[
  <FileJSON object for first PDF>,
  <base64 string of a PNG image>,
  <FileJSON object for a JPG image>
]
```

### Output

A new FileJSON object representing the merged PDF file, including its path, name, size, and type.

## `createPdfFileFromJson`

Creates a new PDF file from a structured JSON object that follows the pdfmake document definition format. This allows for precise, programmatic control over the PDF layout and content.

For a detailed guide on the pdfmake format and to experiment with its capabilities, see the [pdfmake playground](http://pdfmake.org/playground.html).

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>content</code></td><td>An object or array that defines the PDF content, following the pdfmake syntax.</td><td>object</td></tr><tr><td><code>options</code></td><td><code>format</code>: the page size (for example <code>A4</code>, <code>A5</code>, <code>LETTER</code>), defaults to <code>A4</code>. <code>orientation</code>: <code>portrait</code> (default) or <code>landscape</code>.</td><td>object</td></tr></tbody></table>

### Example

```yaml
# content
[
  { text: 'My Document Title', style: 'header' },
  'This is a sample paragraph.',
  {
    ul: [
      'First list item',
      'Second list item'
    ]
  }
]
# options
format: A4
orientation: portrait
```

### Output

A FileJSON object representing the newly created PDF file.

## `createPdfBufferFromJson`

Creates a PDF from a pdfmake JSON object, but returns it as a base64-encoded string instead of writing it to a file.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>content</code></td><td>The pdfmake JSON content definition.</td><td>object</td></tr><tr><td><code>options</code></td><td>Page configuration, see <a href="#createpdffilefromjson"><code>createPdfFileFromJson</code></a>.</td><td>object</td></tr></tbody></table>

### Output

A base64-encoded string representing the generated PDF document.

## `createPdfFileFromHtml`

Converts an HTML string into a new PDF file.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>html</code></td><td>The HTML content to be converted.</td><td>string</td></tr><tr><td><code>options</code></td><td>Conversion and page settings. See below.</td><td>object</td></tr></tbody></table>

Available options:

<table><thead><tr><th width="180">Option</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>format</code></td><td>The page size. Defaults to <code>A4</code>.</td><td>string</td></tr><tr><td><code>orientation</code></td><td>The page orientation, <code>portrait</code> (default) or <code>landscape</code>.</td><td>string</td></tr><tr><td><code>tableAutoSize</code></td><td>If <code>true</code>, tables in the HTML are automatically sized. Defaults to <code>true</code>.</td><td>boolean</td></tr><tr><td><code>removeExtraBlanks</code></td><td>If <code>true</code>, attempts to remove extra blank spaces. Defaults to <code>false</code>.</td><td>boolean</td></tr></tbody></table>

### Example

```yaml
# html
<h1>Report Title</h1><p>This report was generated on 2025-07-12.</p>
# options
orientation: landscape
```

### Output

A FileJSON object representing the newly created PDF file.

## `createPdfBufferFromHtml`

Converts an HTML string into a PDF, returning it as a base64-encoded string.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>html</code></td><td>The HTML content string.</td><td>string</td></tr><tr><td><code>options</code></td><td>Conversion and page settings, see <a href="#createpdffilefromhtml"><code>createPdfFileFromHtml</code></a>.</td><td>object</td></tr></tbody></table>

### Output

A base64-encoded string representing the generated PDF document.
