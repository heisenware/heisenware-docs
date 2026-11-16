# PDF processing

PDF processing builds PDFs and merges documents. It renders a PDF from a `pdfmake` document definition or from HTML, and it folds PDFs and pictures into one document: a scan, a photo from the shop floor and a generated report become one file.

You find the functions under **Utilities** > **PDF Processing** in the Functions explorer. This class provides static functions only and does not require an instance. The code class name is `Pdf`.

Each generator comes in two flavors. The `…File…` ones write the PDF to the shared volume and answer a file object (`path`, `name`, `type`, `lastModified`); the `…Buffer…` ones write nothing and answer the document as a base64 string. A path travels well inside the platform: the next executor reads the file where it lies. To keep a generated PDF with a table row, or to let a user download it, put it into the workspace's file store and keep the reference; see [Files, data and dates](../../../concepts/files-data-and-dates.md).

### `mergeDocuments`

Merges two or more documents into one PDF. PDFs are taken page by page, pictures become one page each. PNG and JPEG are understood everywhere; HEIC only for a file that lies on the volume or in the file store, because its type is read from the entry. A JPEG is turned upright as its EXIF data says. An encrypted PDF is decrypted once before it is read. An entry that cannot be read is skipped and written to the log, and the merge carries on with the rest.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>files</code></td><td>The documents, in the order they are to appear. Each one is a base64 string, a file on the volume (<code>{ name, type, path }</code>, as the other functions here answer), or a file a table row keeps: its reference into the file store (<code>{ id, name, type, size }</code>) or its small content (<code>{ name, type, size, base64 }</code>). A list among the entries is flattened, so the <code>files</code> field of a row can go in as it is and gives a document per file.</td><td>array</td></tr></tbody></table>

#### Output

Returns the merged PDF as a file object on the volume: `path`, `name`, `type`, `size` and `lastModified`. Returns nothing when `files` is not a list, or is empty.

#### Example

```yaml
# files
  - path: /shared/runtime-files/report.pdf
    type: application/pdf
  - path: /shared/runtime-files/scan.png
    type: image/png
```

### `createPdfFileFromJson`

Creates a new PDF file from a structured JSON object that follows the `pdfmake` document definition format. Use this format to control the PDF layout and content precisely. See the [pdfmake playground](http://pdfmake.org/playground.html) to test layouts.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>content</code></td><td></td><td>The content definition object or array following the <code>pdfmake</code> syntax.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>format</code></td><td>The page size (such as <code>A4</code>, <code>A5</code>, or <code>LETTER</code>). Default A4.</td><td>string</td></tr><tr><td></td><td><code>orientation</code></td><td>The page orientation: <code>portrait</code> or <code>landscape</code>. Default portrait.</td><td>string</td></tr></tbody></table>

#### Output

Returns a file object on the volume: `path`, `name`, `type` and `lastModified`.

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

Returns the PDF as a base64-encoded string.

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

Returns a file object on the volume: `path`, `name`, `type` and `lastModified`.

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

Returns the PDF as a base64-encoded string.

#### Example

```yaml
# html
<h1>Report Title</h1><p>This report was generated.</p>
# options
orientation: landscape
```
