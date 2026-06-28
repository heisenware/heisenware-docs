# PDF Processing

The `Pdf` class is a collection of static utility functions for creating and manipulating PDF documents. It can generate PDFs from structured JSON (`pdfmake` format), convert HTML content into PDFs, and merge multiple existing documents (PDF, PNG, JPG) into a single PDF file.

Since all methods in this class are static, you do not need to create an instance of it.

***

### mergeDocuments

Merges multiple source documents into a single PDF file. The source documents can be PDFs, PNG images, or JPG images. The function automatically handles the conversion of images to PDF pages before merging.

Parameters

* `files`: An array where each element is either a base64 encoded string of a file or a FileJSON object (an object with a `path` property pointing to the file).

Example

```yaml
# files
[
  <FileJSON object for first PDF>,
  <base64 string of a PNG image>,
  <FileJSON object for a JPG image>
]
```

Output

A new FileJSON object representing the successfully merged PDF file, including its path, name, size, and type.

***

### createPdfFileFromJson

Creates a new PDF file from a structured JSON object that follows the `pdfmake` document definition format. This allows for precise, programmatic control over the PDF layout and content.

For a detailed guide on the `pdfmake` format and to experiment with its capabilities, see the [pdfmake playground](http://pdfmake.org/playground.html).

Parameters

* `content`: An object or array that defines the PDF content, following the `pdfmake` syntax.
* `options`: An optional object for page configuration.
  * `format`: The page size (e.g., `A4`, `A5`, `LETTER`). Defaults to `A4`.
  * `orientation`: The page orientation. Can be `portrait` or `landscape`. Defaults to `portrait`.

Example

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

Output

A FileJSON object representing the newly created PDF file.

***

### createPdfBufferFromJson

Creates a PDF from a `pdfmake` JSON object, but returns it as a base64 encoded string instead of writing it to a file.

Parameters

* `content`: The `pdfmake` JSON content definition.
* `options`: An optional object for page configuration (see `createPdfFileFromJson` for details).

Output

A base64 encoded string representing the generated PDF document.

***

### createPdfFileFromHtml

Converts an HTML string into a new PDF file.

Parameters

* `html`: A string containing the HTML content to be converted.
* `options`: An optional object for conversion and page settings.
  * `format`: The page size. Defaults to `A4`.
  * `orientation`: The page orientation. Defaults to `portrait`.
  * `tableAutoSize`: If `true`, tables in the HTML will be automatically sized. Defaults to `true`.
  * `removeExtraBlanks`: If `true`, attempts to remove extra blank spaces. Defaults to `false`.

Example

```yaml
# html
<h1>Report Title</h1><p>This report was generated on 2025-07-12.</p>
# options
orientation: landscape
```

Output

A FileJSON object representing the newly created PDF file.

***

### createPdfBufferFromHtml

Converts an HTML string into a PDF, returning it as a base64 encoded string.

Parameters

* `html`: The HTML content string.
* `options`: An optional object for conversion and page settings (see `createPdfFileFromHtml` for details).

Output

A base64 encoded string representing the generated PDF document.
