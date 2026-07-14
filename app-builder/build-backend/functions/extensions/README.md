# Docker Extensions

Docker Extensions expand platform capabilities using Docker container technology. A Docker Extension is a standard Docker image that the platform loads, executes, and exposes as functions inside the App Builder.

{% hint style="info" %}
#### Docker Extensions versus extension nodes

Docker Extensions add completely new function classes to the platform. Do not confuse them with [extension nodes](../../extension-nodes/) (modifiers, filters, recorders, and error handlers), which are the small nodes that attach directly to a function output on the canvas.
{% endhint %}

The platform supports two categories of Docker Extensions:

1. **Official extensions**: Pre-built, managed modules maintained by Heisenware.
2. **Custom Extensions**: User-created Docker images containing custom algorithms, drivers, or proprietary logic.

## Official extensions

Pre-built modules add advanced capabilities to the platform without manual coding:

<table><thead><tr><th width="220">Extension</th><th>Description</th></tr></thead><tbody><tr><td><a href="industrial-blockchain.md">Industrial blockchain</a></td><td>Provides immutable data logging and audit trails.</td></tr><tr><td><a href="rag-ai.md">RAG AI</a></td><td>Enables Retrieval-Augmented Generation for context-aware AI assistants.</td></tr><tr><td><a href="process-simulations.md">Process simulations</a></td><td>Simulates utilities consumption, CNC machine telemetry, and silo fill levels.</td></tr><tr><td><a href="ogc-sensorthings-api.md">OGC SensorThings API</a></td><td>Manages IoT sensor data via the standardized OGC SensorThings specification.</td></tr></tbody></table>

Once installed, these extensions run alongside standard platform services, appearing as selectable blocks in the Function Explorer.

<div align="left"><figure><img src="../../../../.gitbook/assets/heisenware_extentions_looped.gif" alt="" width="485"><figcaption>Adding extensions to the App Builder</figcaption></figure></div>

## Custom Extensions

Build a custom Docker Extension by wrapping code inside a Code Adapter and loading the image into the platform or running it on your infrastructure. See the [Custom Extensions](custom-extensions.md) guide for deployment steps.
