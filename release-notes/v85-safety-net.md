---
description: 1 June 2025
---

# v85 – Safety net

<div align="left"><figure><img src="../.gitbook/assets/image (438).png" alt="" width="375"><figcaption></figcaption></figure></div>

## Features

* Added support for creating [tags](../app-builder/deploy-and-maintain.md) and sharing your Apps.
* The [Hydra MIP](../app-builder/build-backend/functions/connectors/hydra-mip.md) connector now supports PDM calls for Hydra 8.
* Added more [utility functions](../app-builder/build-backend/functions/utilities.md).
* Enabled alphanumerical sorting for your Apps, [widgets](../app-builder/build-frontend/widgets.md), and items inside the [Function Explorer](../app-builder/build-backend/functions/function-explorer.md) and [Frontend Builder](../app-builder/build-frontend.md).

## Fixes

* Fixed an issue in the [relational database](../app-builder/build-backend/functions/storage/relational-database.md) connector that prevented establishing multiple one-to-many associations on the same tables.
* Fixed the `onBrowserRefresh` event to trigger reliably inside the [App Builder](../app-builder/overview.md).
* Fixed an issue where [input widgets](../app-builder/build-frontend/widgets/input-widgets.md) lost focus while a user was typing.
* Optimized the performance of the underlying persistence infrastructure.
