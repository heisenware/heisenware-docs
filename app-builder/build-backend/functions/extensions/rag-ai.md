# RAG AI

Retrieval-Augmented Generation (RAG) optimizes Large Language Model execution by pairing prompts with contextual documentation assets pulled from a local vector knowledge store. This process structures answers around validated company records or manuals, mitigating text hallucinations.

{% hint style="danger" %}
#### Environment configuration requirement

You must append a valid `OPENAI_API_KEY` configuration argument inside environment parameters when launching this module.

<img src="../../../../.gitbook/assets/image (43).png" alt="" data-size="original">
{% endhint %}

The RAG AI extension bundles two distinct classes to manage information retrieval pipelines: `KnowledgeBase` and `ChatWithData`.

## Knowledge base

The `KnowledgeBase` class processes documentation, splits text blocks into searchable segments, generates vector tokens, and tracks items inside an embedded database. This class provides static functions only and does not require an instance. The code class name is `KnowledgeBase`.

### `addKnowledge`

Parses external source documents and indexes content assets into a specific target store category.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>store</code></td><td></td><td>The name of the target vector destination store.</td><td>string</td></tr><tr><td><code>knowledge</code></td><td></td><td>The raw content source. Accepts web URLs, text strings, structured JSON, or absolute local file system path strings (supporting <code>pdf</code>, <code>txt</code>, <code>csv</code>, <code>docx</code>, <code>pptx</code>, or <code>html</code>).</td><td>any</td></tr><tr><td><code>name</code></td><td></td><td>Unique source identifier label used for subsequent document management.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>chunkSize</code></td><td>The maximum character size limit per single split segment. Default 2000.</td><td>integer</td></tr><tr><td></td><td><code>chunkOverlap</code></td><td>Character padding overlap length shared between adjacent data segments. Default 400.</td><td>integer</td></tr></tbody></table>

#### Output

Returns `true` upon successful storage indexing completion.

#### Examples

**Index a file path**

```yaml
# store
product-manuals
# knowledge
/path/to/files/ATR7000-manual.pdf
# name
ATR7000 Manual
```

**Index a website target**

```yaml
# store
company-info
# knowledge
https://heisenware.com/about-us
# name
About Heisenware
```

### `similaritySearch`

Queries a selected destination store to extract the closest matching textual segments.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>store</code></td><td>The targeted vector destination store name.</td><td>string</td></tr><tr><td><code>query</code></td><td>The query prompt text string to match.</td><td>string</td></tr><tr><td><code>nDocs</code></td><td>Maximum quantity limit of relevant text segments to return.</td><td>integer</td></tr></tbody></table>

#### Output

Returns an array containing the matched documentation text segment objects.

### `getDocuments`

Lists user-indexed document sources registered inside a specific vector store.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>store</code></td><td>The targeted vector store name.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array tracking document information records.

### `deleteDocument`

Purges text segment elements tied to a specific named resource asset source from the store.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>store</code></td><td>The targeted vector store name.</td><td>string</td></tr><tr><td><code>name</code></td><td>The asset reference name identifier assigned during ingestion.</td><td>string</td></tr></tbody></table>

#### Output

Returns nothing.

### `getMetaData`

Returns inner vector store metadata details.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>store</code></td><td></td><td>The targeted vector store name.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>showData</code></td><td>Appends raw segment text content payloads into debug profiles. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns an array containing chunk configuration descriptors.

### `reset`

Wipes all entries out of a chosen target vector destination store.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>store</code></td><td>The name of the target store to empty.</td><td>string</td></tr></tbody></table>

#### Output

Returns nothing.

## Chat with data

The `ChatWithData` class initiates interactive conversational bots linked to designated `KnowledgeBase` targets. It runs automated retrieval queries to supply language models with context. This class requires an instance. The code class name is `ChatWithData`.

### `create`

Instantiates an interactive AI chatbot conversation channel linked to an explicit source documentation store.

#### Parameters

<table><thead><tr><th width="120.53875732421875">Input</th><th width="154.51171875">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>storeName</code></td><td></td><td>The target vector documentation store name to reference.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>openAIApiKey</code></td><td>Your direct OpenAI credential key.</td><td>string</td></tr><tr><td></td><td><code>temperature</code></td><td>Creativity randomness variation constraint factor from 0.0 to 1.0. Default 0.1.</td><td>number</td></tr><tr><td></td><td><code>modelName</code></td><td>The deployment engine model string (such as <code>gpt-4</code>).</td><td>string</td></tr><tr><td></td><td><code>systemMessage</code></td><td>The primary system instruction rule context defining chatbot behaviors.</td><td>string</td></tr><tr><td></td><td><code>nDocuments</code></td><td>Max document count parameters passed per single query context block. Default 4.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the chatbot instance channel wrapper object.

#### Examples

```yaml
# storeName
product-manuals
# options
temperature: 0.2
systemMessage: You are an expert on our products. Answer queries using the manuals.
```

### `executePrompt`

Dispatches prompts through conversational workflows and returns model responses.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>question</code></td><td>The direct user question string payload.</td><td>string</td></tr></tbody></table>

#### Output

Returns an execution payload detailing chat status updates.

Example payload:

```json
{
  "answer": "The maximum operating temperature threshold is 85°C.",
  "history": [],
  "sourceDocs": [],
  "tokenUsage": {
    "promptTokens": 1024,
    "completionTokens": 56,
    "totalTokens": 1080
  }
}
```

### `addKnowledge`

Passes knowledge content inputs directly down into the associated storage mapping space.

### `resetConversation`

Wipes conversational thread history to clear past conversation memories. Store contents remain untouched.

### `reinitialize`

Reconfigures bot operational settings and parameters dynamically.
