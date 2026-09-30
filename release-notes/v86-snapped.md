---
description: 1 July 2025
---

# v86 — Snapped

<div align="left"><figure><img src="../.gitbook/assets/image (441).png" alt="" width="375"><figcaption></figcaption></figure></div>

## Features

* Improved layout alignment with smart snaplines when designing in the Frontend Builder.
* Select and group multiple widgets simultaneously on the canvas.
* Added a [barcode generation](../reference/functions/utilities/barcode-generation.md) utility to generate QR codes and barcodes.
* Configure asset label templates and print them directly using the [Label Printer](../reference/functions/connectors/label-printer.md) connector.
* Standardized secure sign-up and sign-in URLs for [Production Apps](../app-player/README.md).
* Programmatically toggle edit mode and search queries on the [data list](../reference/widgets/display/data-list.md) widget.
* Exchange files generically between your Apps and a running [Agent](../concepts/agents-and-where-code-runs.md).
* Automatically generate a version [tag](../app-builder/test-and-deploy.md) each time you deploy your App.

## Fixes

* Optimized caching routines to lower the memory consumption of running [Apps](../app-player/README.md).
* Improved performance and stability for the built-in [relational database](../reference/functions/storage/relational-database.md).
* Fixed an issue where newly created widgets were not automatically selected.
* Fixed rendering issues that occurred when collapsing layout sections on the canvas.
* Sped up startup times and reduced memory footprints during whole-platform power-cycles.
* Improved screen scaling for [Production Apps](../app-player/README.md) and resolved a flickering issue on the [data grid](../reference/widgets/display/data-grid.md) widget.
