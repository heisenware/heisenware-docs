---
description: 19 Feb 2026
---

# v90 – Grouped periodically

<div align="left"><figure><img src="../.gitbook/assets/image (29).png" alt="" width="285"><figcaption></figcaption></figure></div>

## Features

* **Generic and nested widget grouping**: Added support for generic and fully nested widget grouping using the [dynamic group](../reference/widgets/layout/group.md) widget.
* **Data binding to groups**: Enabled high-level data binding for widget groups in the [dynamic group](../reference/widgets/layout/group.md) configuration.
* **Introduced the [card](../reference/widgets/display/card.md) widget**: Display visually grouped components dynamically inside your Apps.
* **Multi-state [status lamp](../reference/widgets/display/status-lamp.md)**: Improved the status lamp widget to support multiple states and a rectangular shape.
* **Configurable backgrounds for icons**: Improved the icon component in [Text, icons and images](../app-builder/page-editor.md) to support optional background shapes.
* **Runtime properties**: Added support for configuring multiple new properties at runtime across various [widgets](../reference/widgets/README.md).
* **Database audit logging**: Added database audit logging to the [relational database](../reference/functions/storage/relational-database.md#audit-logging) connector.
* **Machine simulator option**: Added the machine simulator option to the Process Simulations extension.
* **AI assistant (beta)**: Released the first experimental version of the AI assistant.
* **Experimental subflows**: Released the first experimental support for [subflows](../concepts/subflows.md).

## Improvements

* **UI interaction and performance**: Optimized user interface interactions and platform performance across the workspace.
* **Codebase health**: Cleaned up and consolidated the internal widget rendering factory.

## Fixes

* **On-premise system restarts**: Fixed system start behaviors to reliably restore [on-premise installations](../self-hosting/install.md) after a power cycle.
