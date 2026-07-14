---
description: 12 July 2026
---

# v92 – Hotel

<div align="left"><figure><img src="../.gitbook/assets/image (527).png" alt="" width="375"><figcaption></figcaption></figure></div>

## Features

* **Finalized [subflows](../app-builder/build-backend/functions/subflows.md)**: Completed the core subflows feature within the [Backend Builder](../app-builder/build-backend.md).
* **Data Visualizer (beta)**: Introduced the Data Visualizer tool to let members inspect connected database tables and data entries directly without building an App.
* **Introduced the [timeline](../app-builder/build-frontend/widgets/display-widgets/timeline.md) widget**: Display chronological data series dynamically inside your App.
* **Introduced the [iframe](../app-builder/build-frontend/widgets/display-widgets/iframe.md) widget**: Cleanly embed external web content inside your frontend layouts.
* **Released the [Heidenhain DNC](../app-builder/build-backend/functions/connectors/heidenhain-dnc.md) Agent**: Run a native Heidenhain DNC Agent to establish direct edge connectivity with supported CNC systems.
* **Released the [LXC Agent (Insys)](../app-builder/build-backend/agents/lxc-agent-insys.md)**: Package your local connector system within an Insys-compatible LXC Agent container.

## Improvements

* **Explicit data schema re-scanning**: Added an explicit data re-scan option for bound [widgets](../app-builder/build-frontend/widgets.md). A widget (such as a [data grid](../app-builder/build-frontend/widgets/display-widgets/data-grid.md)) now checks if its underlying data structure or keys have changed, and then automatically updates its properties and visual layout to match.
* **Overhauled [Page Explorer](../app-builder/build-frontend/page-explorer.md)**: Integrated the navigation menu editor directly into the Page Explorer panel. You can configure the name, icon, and app bar title of each page via an edit icon next to the page name. Menu layout types can now vary based on screen size, using configurations like Bottom tabs only for mobile screens or Fixed left menu for large desktop monitors.
* **Fixed menu drawer**: Added a fixed-size left menu as a new navigation option in the [Page Explorer](../app-builder/build-frontend/page-explorer.md).
* **Independent [extension nodes](../app-builder/build-backend/extension-nodes.md)**: Converted extensions – including modifiers, filters, recorders, and error handlers – into distinct visual nodes on the canvas.
* **Anti-node-collision ("snowplow")**: Implemented automated node-separation behavior in the [Backend Builder](../app-builder/build-backend.md) to prevent overlapping logic blocks.
* **Backend auto-formatting**: Introduced an auto-formatting layout tool for backend flows in the [Backend Builder](../app-builder/build-backend.md).
* **Event flow spotlight**: Added a visual spotlight effect to backend [functions](../app-builder/build-backend/functions.md) to clearly trace active event paths during live execution.
* **Visual data truncation**: Implemented automatic visual data truncation for large data payloads to keep the frontend responsive.
* **Custom [data list](../app-builder/build-frontend/widgets/display-widgets/data-list.md) spacing**: Added custom vertical spacing options to the data list widget configuration.
* **Enhanced [chart](../app-builder/build-frontend/widgets/display-widgets/chart.md) interaction**: Improved zoom and pan responsiveness for the chart widget.
* **Upgraded MQTT broker**: Updated and optimized the internal MQTT broker configuration to increase overall message resilience.
* **Application-wide client caching**: Implemented client-side caching to drastically reduce browser reload times for deployed [Apps](../production-apps/overview.md).
* **Restructured Product Docs**: Completely rebuilt and restructured the [Product Docs](../welcome.md).

## Fixes

* **Initial backend state**: Fixed a synchronization issue where the correct backend state did not display immediately after account creation.
* **Alias persistence**: Fixed an issue where custom alias names did not save or persist correctly.
* **Widget highlighting**: Fixed intermittent visual bugs that broke selection and hover highlighting for [widgets](../app-builder/build-frontend/widgets.md) on the canvas.
* **Multi-monitor scaling**: Fixed a layout scaling issue in deployed [Apps](../production-apps/overview.md) when a browser window spans multiple monitors.
