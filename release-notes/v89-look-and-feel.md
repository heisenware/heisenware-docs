---
description: 7 Dec 2025
---

# v89 – Look and feel

<div align="left"><figure><img src="../.gitbook/assets/image (39).png" alt="" width="375"><figcaption></figcaption></figure></div>

## Features

* Redesigned the entire [App Builder](../app-builder/overview.md) user interface:
  * Upgraded the internal rendering engine to MUI.
  * Implemented numerous UI/UX enhancements to improve usability across the platform.
  * Added context-aware popup menus for configuring widget settings.
  * Added context-aware popup menus for configuring function input settings.
  * Enabled viewport navigation using WASD and QE keyboard controls in the [Backend Builder](../app-builder/build-backend.md).
* Added a card detail view option in the [data grid](../app-builder/build-frontend/widgets/display-widgets/data-grid.md) widget.
* Added a global settings menu in the [App Builder](../app-builder/overview.md) to customize workspace and editor behavior.
* Added support for placing annotations anywhere on the canvas in the [Backend Builder](../app-builder/build-backend.md).
* Added support for programmatically generating user invitation links inside your Apps using the [users](../app-builder/build-backend/functions/utilities/users.md) utility class.
* Released professional installation tools for [Native Agents](../app-builder/build-backend/agents/native-agent.md).
* Added the [cron](../app-builder/build-backend/functions/utilities/cron.md) utility class to schedule recurring tasks.
* Introduced the [Allen-Bradley](../app-builder/build-backend/functions/connectors/allen-bradley.md) PLC connector.
* Added the [stopwatch](../app-builder/build-backend/functions/utilities/stopwatch.md) utility class.
* Introduced the [GPIO Counter](../app-builder/build-backend/functions/connectors/gpio-counter.md) connector to count digital pulses and track cycle intervals with Raspberry Pi.

## Fixes

* The `createFolder` function of the [File I/O](../app-builder/build-backend/functions/connectors/file-i-o.md) connector now recursively creates directories and no longer fails if a directory already exists.
* Resolved multiple bugs and hardware incompatibilities in the [Zebra RFID IoT](../app-builder/build-backend/functions/connectors/zebra-rfid-iot.md) connector to fully support recent Zebra hardware releases.
* Fixed several user interface alignment and drag-and-drop inaccuracies inside the canvas.
* Resolved Google authentication failures occurring on self-built [Production Apps](../production-apps/overview.md).
* Improved performance and security hardening of the built-in [timeseries database](../app-builder/build-backend/functions/storage/timeseries-database.md).
