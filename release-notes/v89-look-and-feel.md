---
description: 7 Dec 2025
---

# v89 — Look & Feel

<div align="left"><figure><img src="../.gitbook/assets/image (39).png" alt="" width="375"><figcaption></figcaption></figure></div>

## Features

* Full [App Builder](https://app.gitbook.com/s/E5Ketpww1s7TauSAJrJ8/app-builder) UI revamp
  * Upgrade of the internal engine (MUI)
  * Very many changes to overall UI/UX improving usability
  * Context aware popup menu for widget settings
  * Context aware popup menu for input configurations
  * WASD / QE control on the Flow Builder
* New Card detail view in [Data Grid](../app-builder/build-frontend/widgets/display-widgets/data-grid.md)
* New App Builder wide [settings](/broken/pages/pDUoPQsd9ZlFq3cdGCx6) menu to individualize behavior
* Possibility to add [annotations](/broken/pages/9vKr7mso7EW9dCDhxV7Y#annotation) anywhere in the Flow Builder
* Possibility to create invitation links from within an app (see [Users](../app-builder/build-backend/function-explorer/utilities/users.md) class)
* Professional installer tools for [Native Agents](../app-builder/build-backend/function-explorer/agents/)
* New [Cron](../app-builder/build-backend/function-explorer/utilities/cron.md) class allowing to schedule tasks
* New [AllenBradley](../app-builder/build-backend/function-explorer/connectors/allen-bradley.md) PLC connector
* New [Stopwatch](../app-builder/build-backend/function-explorer/utilities/stopwatch.md) class
* New [Raspberry Pi](../app-builder/build-backend/function-explorer/connectors/raspberry-pi-gpio.md) class allowing to read/write GPIOs
* New [GPIO Counter](../app-builder/build-backend/function-explorer/connectors/gpio-counter.md) class

## Fixes

* The `createFolder` function of the [File](../app-builder/build-backend/function-explorer/connectors/file-i-o.md) widget now recursively creates directories and does not fail on existing ones
* The [Zebra Connector](../app-builder/build-backend/function-explorer/connectors/zebra-rfid-iot.md) got a lot of fixes solving issues and incompatibilities with the latest Zebra Hardware
* UI and drag / drop inaccuracies
* Issues with Google Login on self-built apps
* Hardening and performance improvments on timeseries database
