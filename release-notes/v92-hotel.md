---
description: Unreleased (upcoming)
---

# v92 — Hotel

<div align="left"><figure><img src="../.gitbook/assets/image (527).png" alt="" width="375"><figcaption></figcaption></figure></div>

## v92 – Hotel

### Features

* **Finalized** [**subflows**](../app-builder/build-backend/subflows.md): Completed the core subflows feature within the Backend Builder.
* **Explicit data schema re-scanning**: Added an explicit data re-scan option for bound [widgets](../app-builder/build-frontend/widgets/). A widget, such as a data grid, checks if its underlying data structure or keys have changed or been added, and then automatically updates its properties and visual layout to match.
* **Overhauled** [**Page Explorer**](../app-builder/build-frontend/page-explorer.md): Integrated the navigation menu editor directly into the Page Explorer panel. You can configure quick settings like name, icon, and app bar title via a small edit icon next to each page. Menu layout types can now vary based on screen size, using configurations like **Bottom tabs only** for mobile screens or **Fixed left menu** for large desktop monitors.
* **Independent extension nodes**: Converted extensions—including modifiers, filters, recorders, and error handlers—into distinct visual nodes on the canvas.
* **Anti-node-collision ("snowplow")**: Implemented an automated node-separation behavior in the Backend Builder to prevent overlapping logic blocks.
* **Backend auto-formatting**: Introduced the initial layout auto-formatting tool for backend flows.
* **Event flow spotlight**: Added a visual spotlight effect to backend functions to clearly trace active event paths during live execution.
* **Visual data truncation**: Implemented automatic visual data truncation for large data payloads to maintain optimal frontend UI responsiveness.
* **Data Visualizer**: Introduced the Data Visualizer tool to let members inspect connected database tables and data entries directly without building an App.
* **Menu drawer widget**: Added a new navigation menu widget providing a fixed-size drawer component.
* **Timeline widget**: Introduced a new timeline widget to display chronological data series.
* **Iframe widget**: Introduced a new iframe widget to cleanly embed external web content.
* **Data list spacing**: Added custom vertical spacing options to the data list widget configuration.
* **Enhanced chart interaction**: Improved the zoom and pan responsiveness of the chart widget.
* **Upgraded MQTT broker**: Updated and optimized the internal MQTT broker configuration to increase overall message resilience.
* **Application-wide client caching**: Implemented comprehensive client-side caching to drastically reduce browser reload times for deployed Apps.
* **Heidenhain DNC Agent**: Released a native Heidenhain DNC Agent to facilitate direct edge connectivity with supported CNC systems.
* **Insys LXC Agent**: Released an Insys-compatible LXC Agent container variant of the local connector system.

### Fixes

* **Initial backend state**: Fixed a synchronization issue where the correct backend state failed to display immediately after account creation.
* **Alias persistence**: Resolved a bug where custom alias names failed to save or persist correctly.
* **Widget highlighting**: Fixed intermittent visual bugs that broke selection and hover highlighting for widgets on the canvas.
* **Multi-monitor scaling**: Resolved a layout scaling defect in deployed Apps when a browser window spans multiple monitors.
