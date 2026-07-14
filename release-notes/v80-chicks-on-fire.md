---
description: May 15, 2024
---

# v80 — Chicks on fire

<div align="left"><figure><img src="https://lh7-qw.googleusercontent.com/docsz/AD_4nXc0a72bTrXBx67PN1W3ULv1vBLUdTNv_Can7EPyQwms7AYwbk-8TW3RTP9XAMtz_yxaP9Si9-tyTKXo3A2lMCwW0N5sz9lR-MwVYoIjcJsyMKF0_oKSmbYg8pB9U-co7z4pT2XMsG5FpsPG1WMVJC0ko6dY?key=chRXiLUrI54Os_fCIQ1Z3w" alt=""><figcaption></figcaption></figure></div>

## Features

* Added support for Agent and instance wildcards.
* Textareas are now resizable when used as a single input field in input widgets.
* Integrated a Chroma-based vector database with full CRUD operation support for the [RAG AI](../app-builder/build-backend/functions/extensions/rag-ai.md) extension.
* Added source attribution indicators to the [RAG AI](../app-builder/build-backend/functions/extensions/rag-ai.md) extension.
* Enabled single-executable, multi-host deployments for Agents and connectors using auto-generated, cached identifiers.
* Added the [relational database](../app-builder/build-backend/functions/storage/relational-database.md) connector for the Agent to connect to SQL databases locally on your infrastructure.

## Fixes

* Resolved event-handling conflicts that occurred when a single user duplicated active browser tabs.
* Optimized deployment routines to eliminate long wait times when large amounts of App data are already accumulated.
* Reduced expensive, redundant internal rendering cycles for files loaded from the media server in [Media view](../app-builder/build-frontend/widgets/display-widgets/media-view.md).
