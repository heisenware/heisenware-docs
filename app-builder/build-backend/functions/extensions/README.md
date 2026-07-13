# Docker Extensions

Docker Extensions expand the platform's capabilities using Docker container technology. An extension is a standard Docker image that the Heisenware platform loads, executes, and exposes as functions within the App Builder.

{% hint style="info" %}
#### Not to be confused with extension nodes

Extensions are Docker-based modules that add whole new function classes to the platform. [Extension nodes](../../extension-nodes.md) (modifiers, filters, recorders, and error handlers) are the small nodes that attach to a function's output on the canvas.
{% endhint %}

There are two categories of extensions:

1. Official extensions (Heisenware made): ready-to-use, managed modules maintained by us.
2. Custom Extensions (user made): your Docker images containing custom algorithms, drivers, or logic, built by wrapping your code into a [Code Adapter](../../../../account/hosting-and-architecture.md#docker-custom-code-adapter).

## Official extensions

Pre-built modules provided by Heisenware to add advanced capabilities without any coding:

<table><thead><tr><th width="240">Extension</th><th>Description</th></tr></thead><tbody><tr><td><a href="industrial-blockchain.md">Industrial blockchain</a></td><td>Immutable data logging and audit trails.</td></tr><tr><td><a href="rag-ai/">RAG AI</a></td><td>Retrieval-Augmented Generation for context-aware AI assistants.</td></tr><tr><td><a href="process-simulations.md">Process simulations</a></td><td>Simulates energy consumption, production and machine data, and silo fill levels.</td></tr><tr><td><a href="ogc-sensorthings-api.md">OGC SensorThings API</a></td><td>Accesses and manages IoT sensor data via the standardized OGC SensorThings API.</td></tr></tbody></table>

Once installed, these extensions run alongside the standard platform functionality. They appear as new blocks in the [Function Explorer](../function-explorer.md) and can be used immediately in your flows.

<div align="left"><figure><img src="../../../../.gitbook/assets/heisenware_extentions_looped.gif" alt="" width="485"><figcaption><p>Adding extensions to the App Builder</p></figcaption></figure></div>

## Custom Extensions







