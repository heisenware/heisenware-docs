---
description: 1 July 2025
---

# v86 – Snapped

<div align="left"><figure><img src="../.gitbook/assets/image (441).png" alt="" width="375"><figcaption></figcaption></figure></div>

## Features

* Improved layout alignment with smart snaplines when designing in the [Frontend Builder](../app-builder/build-frontend.md).
* Select and group multiple [widgets](../app-builder/build-frontend/widgets.md) simultaneously on the canvas.
* Added a [barcode generation](../app-builder/build-backend/functions/utilities/barcode-generation.md) utility to generate QR codes and barcodes.
* Configure asset label templates and print them directly using the [Label Printer](../app-builder/build-backend/functions/connectors/label-printer.md) connector.
* Standardized secure sign-up and sign-in URLs for [Production Apps](../production-apps/overview.md).
* Programmatically toggle edit mode and search queries on the [data list](../app-builder/build-frontend/widgets/display-widgets/data-list.md) widget.
* Exchange files generically between your Apps and a running [Agent](../app-builder/build-backend/agents.md).
* Automatically generate a version [tag](../app-builder/deploy-and-maintain.md) each time you deploy your App.

## Fixes

* Optimized caching routines to lower the memory consumption of running [Apps](../production-apps/overview.md).
* Improved performance and stability for the built-in [relational database](../app-builder/build-backend/functions/storage/relational-database.md).
* Fixed an issue where newly created [widgets](../app-builder/build-frontend/widgets.md) were not automatically selected.
* Fixed rendering issues that occurred when collapsing layout sections on the canvas.
* Sped up startup times and reduced memory footprints during whole-platform power-cycles.
* Improved screen scaling for [Production Apps](../production-apps/overview.md) and resolved a flickering issue on the [data grid](../app-builder/build-frontend/widgets/display-widgets/data-grid.md) widget.
