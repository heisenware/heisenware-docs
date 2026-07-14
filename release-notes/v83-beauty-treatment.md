---
description: Oct 15, 2024
---

# v83 — Beauty treatment

<div align="left"><figure><img src="../.gitbook/assets/Wendy.webp" alt="" width="175"><figcaption></figcaption></figure></div>

## Features

* Improved the visual style of the login form for [Production Apps](../production-apps/overview.md).
* Improved connection highlighting across the Backend Builder and Frontend Builder.
* Added Agent selection as a field type inside the [form](../app-builder/build-frontend/widgets/input-widgets/form.md) widget.
* Added the new [data tiles](../app-builder/build-frontend/widgets/display-widgets/data-tiles.md) widget.
* Expanded features and improved the overall usability of the [operating system (OS)](../app-builder/build-backend/functions/connectors/operating-system-os.md) connector.
* Added support for method calling and file I/O operations in the [OPC UA Client](../app-builder/build-backend/functions/connectors/opc-ua-client.md) connector.
* Enabled Docker container monitoring in the OS connector.
* Added the new [pie chart](../app-builder/build-frontend/widgets/display-widgets/pie-chart.md) widget.

## Fixes

* Fixed an issue where logging into an App with a username and password assigned the anonymous user identity.
* Fixed transparency rendering issues on the bottom tab bar.
* Fixed drag-and-drop interactions for address items when moving them to and from other canvas components.
* Resolved a connection issue in [Production Apps](../production-apps/overview.md) when communicating with the built-in [timeseries database](../app-builder/build-backend/functions/storage/timeseries-database.md).
* Resolved unexpected behavior in the [form](../app-builder/build-frontend/widgets/input-widgets/form.md) widget when reconfiguring data fields.
* Fixed the auto-fill behavior of the [form](../app-builder/build-frontend/widgets/input-widgets/form.md) widget to gracefully handle input payloads containing more data than configured.
* Improved App deployment stability and resolved minor build pipeline errors.
* Fixed data export functionality in the [data grid](../app-builder/build-frontend/widgets/display-widgets/data-grid.md) widget.
