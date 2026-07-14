---
description: 19 Feb 2026
---

# v90 – Grouped periodically

<div align="left"><figure><img src="../.gitbook/assets/image (29).png" alt="" width="285"><figcaption></figcaption></figure></div>

## Features

* **Generic and nested widget grouping**: Added support for generic and fully nested widget grouping using the [dynamic group](../app-builder/build-frontend/widgets/dynamic-group.md) widget.
* **Data binding to groups**: Enabled high-level data binding for widget groups in the [dynamic group](../app-builder/build-frontend/widgets/dynamic-group.md#data-settings-data-bindings) configuration.
* **Introduced the [card](../app-builder/build-frontend/widgets/display-widgets/card.md) widget**: Display visually grouped components dynamically inside your Apps.
* **Multi-state [status lamp](../app-builder/build-frontend/widgets/display-widgets/status-lamp.md)**: Improved the status lamp widget to support multiple states and a rectangular shape.
* **Configurable backgrounds for icons**: Improved the icon component in [Text, icons and images](../app-builder/build-frontend/text-icons-and-images.md) to support optional background shapes.
* **Runtime properties**: Added support for configuring multiple new properties at runtime across various [widgets](../app-builder/build-frontend/widgets).
* **Database audit logging**: Added database audit logging to the [relational database](../app-builder/build-backend/functions/storage/relational-database.md#audit-logging) connector.
* **Machine simulator option**: Added the machine simulator option to the [Process Simulations](../app-builder/build-backend/functions/extensions/process-simulations.md) extension.
* **AI assistant (beta)**: Released the first experimental version of the AI assistant.
* **Experimental subflows**: Released the first experimental support for [subflows](../app-builder/build-backend/functions/subflows.md).

## Improvements

* **UI interaction and performance**: Optimized user interface interactions and platform performance across the workspace.
* **Codebase health**: Cleaned up and consolidated the internal widget rendering factory.

## Fixes

* **On-premise system restarts**: Fixed system start behaviors to reliably restore [on-premise installations](../tutorials/on-premise-installation.md) after a power cycle.
