# RAG AI

RAG, or Retrieval-Augmented Generation, is a technique that makes Large Language Models (LLMs) smarter and more reliable by connecting them to your specific data. Instead of just answering from its general pre-trained knowledge, the AI first retrieves relevant information from a custom knowledge base. It then uses this retrieved information as context to generate a more accurate, fact-based answer.

{% hint style="warning" %}
When loading this extension you MUST provide the environment variable `OPENAI_API_KEY` .

![](<../../../../../.gitbook/assets/image (43).png>)
{% endhint %}

## How We Implement RAG

The [`KnowledgeBase`](knowledge-base.md) and [`ChatWithData`](chat-with-data.md) classes work together to create a complete RAG system:

* `KnowledgeBase` is the "Retrieval" component. Its job is to be the library or "textbook" for the AI. You use `KnowledgeBase.addKnowledge()` to ingest your documents (PDFs, websites, text files, etc.). The class automatically processes this information, breaks it down, and stores it in a way that makes it easy to search for relevant passages.
* `ChatWithData` is the "Augmented Generation" component. This is the expert who consults the library before speaking. When you ask a question using `executePrompt()`, it first queries the `KnowledgeBase` to find the most relevant text snippets related to your question. It then combines your original question with this retrieved context and asks the AI to formulate an answer based _specifically_ on the provided information.

This process grounds the AI's responses in your data, drastically reducing the chances of it making things up (hallucinating) and allowing it to answer questions about private or very recent information.

## Common Problems Solved

With these two classes, you can build powerful AI applications to solve several common problems:

* **Customer Support Chatbots**: Create a knowledge base from your product manuals, FAQs, and support articles. The chatbot can then provide instant, accurate answers to customer questions.
* **Internal Knowledge Portals**: Ingest company policies, technical documentation, or project histories. Employees can then ask natural language questions like, "What is our company's vacation policy?" or "How do I set up the new development environment?"
* **Document Analysis and Q\&A**: Load a long and complex document (like a legal contract, financial report, or scientific paper) into the `KnowledgeBase`. You can then ask specific questions about its contents, such as "What are the key risks mentioned in this report?" or "Summarize the termination clause of this contract."
