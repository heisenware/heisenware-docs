---
description: Oct 15, 2024
---

# v83 — Beauty treatment

<div align="left"><figure><img src="../.gitbook/assets/Wendy.webp" alt="" width="175"><figcaption></figcaption></figure></div>

## Features

* Improved the visual style of the login form for [Production Apps](../app-player/README.md).
* Improved connection highlighting across the Backend Builder and Frontend Builder.
* Added Agent selection as a field type inside the [form](../reference/widgets/input/form.md) widget.
* Added the new [data tiles](../reference/widgets/display/data-tiles.md) widget.
* Expanded features and improved the overall usability of the [operating system (OS)](../reference/functions/connectors/operating-system-os.md) connector.
* Added support for method calling and file I/O operations in the [OPC UA Client](../reference/functions/connectors/opc-ua-client.md) connector.
* Enabled Docker container monitoring in the OS connector.
* Added the new [pie chart](../reference/widgets/display/pie-chart.md) widget.

## Fixes

* Fixed an issue where logging into an App with a username and password assigned the anonymous user identity.
* Fixed transparency rendering issues on the bottom tab bar.
* Fixed drag-and-drop interactions for address items when moving them to and from other canvas components.
* Resolved a connection issue in [Production Apps](../app-player/README.md) when communicating with the built-in [timeseries database](../reference/functions/storage/timeseries-database.md).
* Resolved unexpected behavior in the [form](../reference/widgets/input/form.md) widget when reconfiguring data fields.
* Fixed the auto-fill behavior of the [form](../reference/widgets/input/form.md) widget to gracefully handle input payloads containing more data than configured.
* Improved App deployment stability and resolved minor build pipeline errors.
* Fixed data export functionality in the [data grid](../reference/widgets/display/data-grid.md) widget.
