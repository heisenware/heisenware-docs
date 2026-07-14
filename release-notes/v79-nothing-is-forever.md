---
description: May 10, 2024
---

# v79 – Nothing is forever

<div align="left"><figure><img src="https://lh7-qw.googleusercontent.com/docsz/AD_4nXcec-5C1DrQbaHD3iqIDjLYucRctDvaCA0mWMDtcNUr2uqIUnKx_N1tUMQYGBp-KYlN9jSNqEn6Z-cVyIDVZ8oiQDxy0s8njGpu6KfQapMO2oA_Q3Nsow2_owKHQSjCIR3oQhtflcJ1ltg5A5vC5Ok0UMQ?key=chRXiLUrI54Os_fCIQ1Z3w" alt=""><figcaption></figcaption></figure></div>

## Features

* Introduced the first version of [PDF templates](../app-builder/build-backend/functions/utilities/pdf-templates.md) and the [PDF Template Editor](../app-builder/build-frontend/pdf-template-editor.md).
* The entire platform is now available as an [on-premise installation](../tutorials/on-premise-installation.md), supporting single-container deployments on edge hardware such as IPCs with x86 or arm64 architectures.
* Added tenancy selection for [input widgets](../app-builder/build-frontend/widgets/input-widgets.md), allowing inputs to be explicitly shared.
* Added a built-in mailing service to the [email](../app-builder/build-backend/functions/connectors/email.md) connector.
* Added support for many-to-many associations between tables in [relational databases](../app-builder/build-backend/functions/storage/relational-database.md).
* Added support for converting non-history tables to history tables, including tracking for all associations in [relational databases](../app-builder/build-backend/functions/storage/relational-database.md).
* The [Kuando Busylight](../app-builder/build-backend/functions/connectors/kuando-busylight.md) driver is now available as a local connector running on an [Agent](../app-builder/build-backend/agents.md).
* Added thousands separators for number input fields inside [form](../app-builder/build-frontend/widgets/input-widgets/form.md) widgets.

## Fixes

* Fixed the tag box component inside the [form](../app-builder/build-frontend/widgets/input-widgets/form.md) widget.
* Fixed an issue where default configuration values for the [email](../app-builder/build-backend/functions/connectors/email.md) connector failed to load properly.
* Fixed image rotation issues and optimized file sizes when combining the [upload](../app-builder/build-frontend/widgets/input-widgets/upload.md) widget with the [photo](../app-builder/build-frontend/widgets/input-widgets/photo.md) widget.
