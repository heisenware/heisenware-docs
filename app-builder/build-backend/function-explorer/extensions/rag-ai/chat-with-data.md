# Chat With Data

The `ChatWithData` class creates a conversational AI (chatbot) that answers questions based on the information held within a specific `KnowledgeBase` store.

It uses a Retrieval-Augmented Generation (RAG) process: when you ask a question, it first searches the knowledge base for relevant information using `KnowledgeBase.similaritySearch()`. It then combines your question, the chat history, and this retrieved context into a new, detailed prompt that it sends to an OpenAI model to generate a well-informed answer.

***

### create

Creates a new chat instance that is linked to a specific knowledge base store and configured with your desired AI behavior.

Parameters

* `storeName`: The name of the `KnowledgeBase` store this chat instance will use.
* `options`: An optional object to configure the AI model.
  * `openAIApiKey`: Your OpenAI API key.
  * `temperature`: The model's creativity level (a value from 0 to 1). Defaults to `0.1`.
  * `modelName`: The specific OpenAI model to use (e.g., `gpt-4`, `gpt-3.5-turbo`).
  * `systemMessage`: A general instruction telling the chatbot how to behave (e.g., `"You are a helpful assistant that answers questions concisely."`).
  * `nDocuments`: The maximum number of documents to retrieve from the knowledge base for context. Defaults to `4`.

Example

```yaml
# storeName
'product-manuals'
# options
temperature: 0.2
systemMessage: 'You are an expert on our products. Answer the user's questions based on the provided manuals.'
```

***

### executePrompt

Sends a question to the chatbot and gets an answer. This is the primary function for interacting with the chat instance.

Parameters

* `question`: The user's question or prompt as a string.

Output

An object containing:

* `answer`: The AI's response string.
* `history`: The updated conversation history.
* `sourceDocs`: An array of the source document chunks used to generate the answer.
* `tokenUsage`: Information about the number of tokens used for the request.

***

### addKnowledge

A convenience function to add new information to the underlying knowledge base store associated with this chat instance. This is a wrapper around `KnowledgeBase.addKnowledge()`.

Parameters

* `knowledge`: The content to add (URL, file path, text, etc.).

***

### resetConversion

Clears the current conversation history. The AI will "forget" the previous conversation, but the underlying knowledge base remains unchanged.

***

### reinitialize

Reinitializes the entire chat instance with new configuration options.

***

## Putting It All Together: A Complete Example

Here is a step-by-step workflow demonstrating how the two classes work together.

Step 1: Populate a Knowledge Base

First, use KnowledgeBase to add information to a store.

```yaml
# (Call KnowledgeBase.addKnowledge)
# store
'product-info'
# knowledge
'/path/to/our-product-spec-sheet.pdf'
# name
'Spec Sheet v1.2'
```

Step 2: Create a Chat Instance

Now, create a ChatWithData instance linked to the store you just populated.

```yaml
# (Call ChatWithData.create)
# storeName
'product-info'
# options
systemMessage: 'You are a helpful product support specialist.'
```

Step 3: Ask a Question

Use executePrompt to ask a question related to the document you added.

```yaml
# (Call executePrompt on the instance)
# question
'What is the maximum operating temperature of our product?'
```

> The chatbot will find the relevant section in the PDF, use it as context, and provide a specific answer.

Step 4: Ask a Follow-up Question

The chatbot remembers the context of the conversation.

```yaml
# (Call executePrompt again)
# question
'And what about in Celsius?'
```

> The chatbot will understand that "what about" refers to the maximum operating temperature and will provide the answer in the requested unit.
