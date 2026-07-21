# RAG AI

Retrieval-Augmented Generation (RAG) pairs a prompt with relevant content retrieved from a local vector knowledge store. Answers are grounded in your own documents and manuals, which reduces hallucinations.

{% hint style="info" %}
#### Environment configuration requirement
Provide a valid `OPENAI_API_KEY` as environment parameter when launching this module.

![](<../../../../../.gitbook/assets/image (43).png>)
{% endhint %}

The RAG AI extension bundles two classes: `KnowledgeBase` and `ChatWithData`. You first populate a knowledge store using `KnowledgeBase`, then a `ChatWithData` instance uses that store to answer questions.

## Knowledge base

The `KnowledgeBase` class creates, manages, and queries vectorized knowledge stores. It ingests information from various sources (files, URLs, text), splits it into searchable chunks, creates vector embeddings, and stores them in a vector database (ChromaDB). This class provides static functions only and does not require an instance. The code class name is `KnowledgeBase`.

### `addKnowledge`

Adds information from a source into a specific knowledge store. The function automatically detects the source type, processes the content, splits it into chunks, creates vector embeddings, and stores them.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="140">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>store</code></td><td></td><td>The name of the knowledge store, for example <code>product-manuals</code>.</td><td>string</td></tr><tr><td><code>knowledge</code></td><td></td><td>The content to add. Accepts a URL string, a local file path string (supported extensions: <code>pdf</code>, <code>txt</code>, <code>csv</code>, <code>docx</code>, <code>pptx</code>, <code>html</code>), a plain text string, or a JSON object.</td><td>any</td></tr><tr><td><code>name</code></td><td></td><td>A name identifying this knowledge source, used for later management (for example <code>Product Manual v2</code>).</td><td>string</td></tr><tr><td><code>options</code></td><td><code>chunkSize</code></td><td>The maximum size of each text chunk. Default 2000.</td><td>integer</td></tr><tr><td></td><td><code>chunkOverlap</code></td><td>The number of characters to overlap between chunks. Default 400.</td><td>integer</td></tr></tbody></table>

#### Output

Returns `true` once the knowledge has been added.

#### Examples

**Adding knowledge from a PDF file**

```yaml
# store
product-manuals

# knowledge
/path/to/files/ATR7000-manual.pdf

# name
ATR7000 Manual
```

**Adding knowledge from a website**

```yaml
# store
company-info

# knowledge
https://heisenware.com/about-us

# name
About Heisenware
```

**Adding knowledge from a plain text string**

```yaml
# store
faq

# knowledge
'Question: What are the support hours? Answer: Support is available 24/7 via email.'

# name
Support Hours FAQ
```

### `similaritySearch`

Performs a similarity search against a knowledge store to find the text chunks most relevant to a given query.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>store</code></td><td>The name of the knowledge store.</td><td>string</td></tr><tr><td><code>query</code></td><td>The text query to search for.</td><td>string</td></tr><tr><td><code>nDocs</code></td><td>The maximum number of relevant chunks to return.</td><td>integer</td></tr></tbody></table>

#### Output

Returns an array of document objects relevant to the query.

### `getDocuments`

Lists all named documents currently stored in a knowledge store.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>store</code></td><td>The name of the knowledge store.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of objects, one per added document source.

### `deleteDocument`

Deletes all chunks associated with a specific named document from the knowledge store.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>store</code></td><td>The name of the knowledge store.</td><td>string</td></tr><tr><td><code>name</code></td><td>The name of the document source to delete (the same name provided in <code>addKnowledge</code>).</td><td>string</td></tr></tbody></table>

{% hint style="danger" %}
#### Irreversible action
Deleting permanently removes all chunks of the document from the store.
{% endhint %}

### `getMetaData`

Retrieves detailed metadata for all chunks stored in a knowledge store, useful for debugging.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="140">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>store</code></td><td></td><td>The name of the knowledge store.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>showData</code></td><td>If <code>true</code>, includes the raw text content of each chunk. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns the metadata for all chunks stored in the knowledge store.

### `reset`

Completely deletes all information in a given knowledge store.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>store</code></td><td>The name of the knowledge store to reset.</td><td>string</td></tr></tbody></table>

{% hint style="danger" %}
#### Irreversible action
Resetting permanently deletes all information in the store.
{% endhint %}

## Chat with data

The `ChatWithData` class creates a conversational AI (chatbot) that answers questions based on the information held in a specific `KnowledgeBase` store. When you ask a question, it first searches the knowledge store for relevant information using [`similaritySearch`](#similaritysearch). It then combines your question, the chat history, and the retrieved context into a new prompt that it sends to an OpenAI model to generate a well-informed answer. This class requires an instance. The code class name is `ChatWithData`.

### `create`

Creates a chat instance linked to a specific knowledge store and configured with the desired AI behavior.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="140">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>storeName</code></td><td></td><td>The name of the <code>KnowledgeBase</code> store this chat instance will use.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>openAIApiKey</code></td><td>Your OpenAI API key.</td><td>string</td></tr><tr><td></td><td><code>temperature</code></td><td>The model's creativity level, a value from 0 to 1. Default 0.1.</td><td>number</td></tr><tr><td></td><td><code>modelName</code></td><td>The OpenAI model to use, for example <code>gpt-4</code>.</td><td>string</td></tr><tr><td></td><td><code>systemMessage</code></td><td>A general instruction telling the chatbot how to behave.</td><td>string</td></tr><tr><td></td><td><code>nDocuments</code></td><td>The maximum number of documents to retrieve from the knowledge store for context. Default 4.</td><td>integer</td></tr></tbody></table>

{% hint style="info" %}
#### Mark the API key as a secret
Right-click the input carrying the API key and mark it as a secret.
{% endhint %}

#### Output

Returns the name of the created instance.

#### Example

```yaml
# storeName
product-manuals

# options
temperature: 0.2
systemMessage: You are an expert on our products. Answer questions based on the provided manuals.
```

### `delete`

Deletes a chat instance.

#### Parameters

None.

#### Output

Returns `true` upon removal.

{% hint style="danger" %}
#### Irreversible action
Deleting removes the instance configuration. The underlying knowledge store remains unchanged.
{% endhint %}

### `executePrompt`

Sends a question to the chatbot and gets an answer. This is the primary function for interacting with the chat instance.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>question</code></td><td>The user's question or prompt.</td><td>string</td></tr></tbody></table>

#### Output

Returns an object with the keys `answer` (the response string), `history` (the updated conversation history), `sourceDocs` (an array of the source document chunks used to generate the answer), and `tokenUsage` (information about the number of tokens used for the request).

### `addKnowledge`

Adds new information to the knowledge store associated with this chat instance. This is a convenience wrapper around [`addKnowledge`](#addknowledge) of the `KnowledgeBase` class.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>knowledge</code></td><td>The content to add. Accepts the same source types as the <code>KnowledgeBase</code> function.</td><td>any</td></tr></tbody></table>

### `resetConversion`

Clears the current conversation history. The chatbot forgets the previous conversation, but the underlying knowledge store remains unchanged.

#### Parameters

None.

### `reinitialize`

Reinitializes the chat instance with new configuration options.

## Complete example

A step-by-step workflow demonstrating how the two classes work together.

{% stepper %}
{% step %}
#### Populate a knowledge store

Use `addKnowledge` of the `KnowledgeBase` class to add information to a store.

```yaml
# store
product-info

# knowledge
/path/to/our-product-spec-sheet.pdf

# name
Spec Sheet v1.2
```
{% endstep %}

{% step %}
#### Create a chat instance

Create a `ChatWithData` instance linked to the store you just populated.

```yaml
# storeName
product-info

# options
systemMessage: You are a helpful product support specialist.
```
{% endstep %}

{% step %}
#### Ask a question

Use `executePrompt` to ask a question related to the document you added.

```yaml
# question
What is the maximum operating temperature of our product?
```

The chatbot finds the relevant section in the PDF, uses it as context, and provides a specific answer.
{% endstep %}

{% step %}
#### Ask a follow-up question

The chatbot remembers the context of the conversation.

```yaml
# question
And what about in Celsius?
```

The chatbot understands that the follow-up refers to the maximum operating temperature and answers in the requested unit.
{% endstep %}
{% endstepper %}
