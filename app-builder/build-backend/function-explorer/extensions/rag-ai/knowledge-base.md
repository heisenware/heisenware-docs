# Knowledge Base

The `KnowledgeBase` class is a static utility for creating, managing, and querying vectorized knowledge stores. Its primary purpose is to ingest information from various sources (files, URLs, text), process it into searchable chunks, and store it in a vector database (ChromaDB).

This class serves as the data foundation for the `ChatWithData` class. You first populate a `KnowledgeBase` store with information, and then a `ChatWithData` instance can use that store to answer questions.

Since all methods in this class are static, you do not need to create an instance of it.

***

### addKnowledge

Adds information from a source into a specific knowledge store. The function automatically detects the source type, processes the content, splits it into manageable chunks, creates vector embeddings, and stores them.

Parameters

* `store`: A string name for the knowledge store (e.g., `'product-manuals'`).
* `knowledge`: The content to add. This can be:
  * A URL string (e.g., `'https://my-company.com/faq'`).
  * A file path string (e.g., `'/path/to/my-document.pdf'`). Supported extensions: `pdf`, `txt`, `csv`, `docx`, `pptx`, `html`.
  * A plain text string.
  * A JSON object.
* `name`: A string name to identify this knowledge source, which is useful for later management (e.g., `'Product Manual v2'`).
* `options`: An optional object for text splitting.
  * `chunkSize`: The maximum size of each text chunk. Defaults to `2000`.
  * `chunkOverlap`: The number of characters to overlap between chunks. Defaults to `400`.

Example 1: Adding knowledge from a PDF file

```yaml
# store
'product-manuals'
# knowledge
'/path/to/files/ATR7000-manual.pdf'
# name
'ATR7000 Manual'
```

Example 2: Adding knowledge from a website

```yaml
# store
'company-info'
# knowledge
'https://heisenware.com/about-us'
# name
'About Heisenware'
```

Example 3: Adding knowledge from a plain text string

```yaml
# store
'faq'
# knowledge
'Question: What are the support hours? Answer: Support is available 24/7 via email.'
# name
'Support Hours FAQ'
```

Output

Returns true once the knowledge has been successfully added.

***

### similaritySearch

Performs a similarity search against a knowledge store to find text chunks that are most relevant to a given query.

Parameters

* `store`: The name of the knowledge store.
* `query`: The text query to search for.
* `nDocs`: The maximum number of relevant documents (chunks) to return.

Output

An array of document objects relevant to the query.

***

### getDocuments

Provides a list of all the named documents currently stored in a knowledge base.

Parameters

* `store`: The name of the knowledge store.

Output

An array of objects, where each object represents a document source you've added.

***

### deleteDocument

Deletes all chunks associated with a specific named document from the knowledge store.

Parameters

* `store`: The name of the knowledge store.
* `name`: The name of the document source to delete (the same name provided in `addKnowledge`).

***

### getMetaData

Retrieves detailed metadata for all chunks stored in the knowledge base, useful for debugging.

Parameters

* `store`: The name of the knowledge store.
* `options`: An optional object.
  * `showData`: If `true`, includes the raw text content of each chunk. Defaults to `false`.

***

### reset

Completely deletes all information in a given knowledge store.

Parameters

* `store`: The name of the knowledge store to reset.
