---
description: 28 Aug 2025
---

# v87 – Explained

<div align="left"><figure><img src="../.gitbook/assets/image (444).png" alt="" width="375"><figcaption></figcaption></figure></div>

## Features

* Major documentation improvements on our [Product Docs](../welcome.md) portal.
* Added interactive, in-app onboarding to help new developers get started inside the [App Builder](../app-builder/overview.md).
* Redesigned and improved invitation emails sent to new users.
* Added enterprise-grade PKI (public-key infrastructure) security support for the [OPC UA Client](../app-builder/build-backend/functions/connectors/opc-ua-client.md) connector.
* Directly drag and drop backend [functions](../app-builder/build-backend/functions.md) onto [widgets](../app-builder/build-frontend/widgets.md) to connect them instantly.
* Expand [widgets](../app-builder/build-frontend/widgets.md) to full width on the canvas with a single click.
* Introduced the [Modbus](../app-builder/build-backend/functions/connectors/modbus.md) connector.
* Configure conditional runtime visibility for fields inside the [form](../app-builder/build-frontend/widgets/input-widgets/form.md) widget.
* Extract data from a [relational database](../app-builder/build-backend/functions/storage/relational-database.md) across multiple tables on the fly.
* Deregister users directly in [Users and access](../app-manager/users-and-access.md) inside the [App Manager](../app-manager/overview.md).
* Introduced the [SAP Digital Manufacturing](../app-builder/build-backend/functions/connectors/sap-digital-manufacturing.md) connector.

## Fixes

* Optimized [App Builder](../app-builder/overview.md) performance when designing very large Apps.
* Fixed the [text box](../app-builder/build-frontend/text-icons-and-images.md) component to always stay on top of other elements on the canvas while building.
* Prevents widgets from being dragged outside the canvas boundary in the [Frontend Builder](../app-builder/build-frontend.md).
* Resolved access and permission issues with invite-only options in [Users and access](../app-manager/users-and-access.md).
* Fixed addressing issues when using dictionary variable names inside the [Siemens S7](../app-builder/build-backend/functions/connectors/siemens-s7.md) connector.
