---
description: 15 April 2025
---

# v84 — Get in the flow

<div align="left"><figure><img src="../.gitbook/assets/get-in-the-flow.webp" alt="" width="375"><figcaption></figcaption></figure></div>

## Features

* Redesigned the Backend Builder to use a flow-based visualization with nodes and edges/wires.
* Added support for the iPhone-specific `.heic` image format in the [upload](../reference/widgets/input/upload.md) and [photo](../reference/widgets/input/photo.md) widgets.
* Enabled clickable text links inside the [kanban](../reference/widgets/display/kanban.md) and [data grid](../reference/widgets/display/data-grid.md) widgets.
* Optimized rendering and layout scaling for [Production Apps](../app-player/README.md) across different devices and screens.
* Added an invite-only option in [Users and access](../app-manager/users-and-access.md) to manage access control for Apps.
* Introduced the [Hydra MIP](../reference/functions/connectors/hydra-mip.md) connector.

## Fixes

* Fixed packaging issues for the Windows Agent.
* Fixed date values submitted from the [form](../reference/widgets/input/form.md) widget to always use the UTC timezone.
* Resolved PDF rendering issues on recent iOS devices.
* Fixed the onboarding flow to log users in automatically immediately after they verify their account from an email invitation.
