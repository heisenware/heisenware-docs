---
description: 1 June 2025
---

# v85 — Safety net

<div align="left"><figure><img src="../.gitbook/assets/image (438).png" alt="" width="375"><figcaption></figcaption></figure></div>

## Features

* Added support for creating [tags](../app-builder/test-and-deploy.md) and sharing your Apps.
* The [Hydra MIP](../reference/functions/connectors/hydra-mip.md) connector now supports PDM calls for Hydra 8.
* Added more [utility functions](../reference/functions/utilities/README.md).
* Enabled alphanumerical sorting for your Apps, widgets, and items inside the [Function Explorer](../app-builder/explorers/functions.md) and Frontend Builder.

## Fixes

* Fixed an issue in the [relational database](../reference/functions/storage/relational-database.md) connector that prevented establishing multiple one-to-many associations on the same tables.
* Fixed the `onBrowserRefresh` event to trigger reliably inside the [App Builder](../app-builder/README.md).
* Fixed an issue where [input widgets](../reference/widgets/input/README.md) lost focus while a user was typing.
* Optimized the performance of the underlying persistence infrastructure.
