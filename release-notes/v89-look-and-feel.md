---
description: 7 Dec 2025
---

# v89 — Look & feel

<div align="left"><figure><img src="../.gitbook/assets/image (39).png" alt="" width="375"><figcaption></figcaption></figure></div>

## Features

* Redesigned the entire [App Builder](../app-builder/README.md) user interface:
  * Upgraded the internal rendering engine to MUI.
  * Implemented numerous UI/UX enhancements to improve usability across the platform.
  * Added context-aware popup menus for configuring widget settings.
  * Added context-aware popup menus for configuring function input settings.
  * Enabled viewport navigation using WASD and QE keyboard controls in the Backend Builder.
* Added a card detail view option in the [data grid](../reference/widgets/display/data-grid.md) widget.
* Added a global settings menu in the [App Builder](../app-builder/README.md) to customize workspace and editor behavior.
* Added support for placing annotations anywhere on the canvas in the [Backend Builder](../app-builder/flowboard/README.md).
* Added support for programmatically generating user invitation links inside your Apps using the [users](../reference/functions/utilities/users.md) utility class.
* Released professional installation tools for [Native Agents](../app-manager/agents/native-agent.md).
* Added the [cron](../reference/functions/utilities/cron.md) utility class to schedule recurring tasks.
* Introduced the [Allen-Bradley](../reference/functions/connectors/allen-bradley.md) PLC connector.
* Added the [stopwatch](../reference/functions/utilities/stopwatch.md) utility class.
* Introduced the [GPIO Counter](../reference/functions/connectors/gpio-counter.md) connector to count digital pulses and track cycle intervals with Raspberry Pi.

## Fixes

* The `createFolder` function of the [File I/O](../reference/functions/connectors/file-i-o.md) connector now recursively creates directories and no longer fails if a directory already exists.
* Resolved multiple bugs and hardware incompatibilities in the [Zebra RFID IoT](../reference/functions/connectors/zebra-rfid-iot.md) connector to fully support recent Zebra hardware releases.
* Fixed several user interface alignment and drag-and-drop inaccuracies inside the canvas.
* Resolved Google authentication failures occurring on self-built [Production Apps](../app-player/README.md).
* Improved performance and security hardening of the built-in [timeseries database](../reference/functions/storage/timeseries-database.md).
