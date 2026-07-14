---
description: 12 Oct 2025
---

# v88 — Almost forever

<div align="left"><figure><img src="../.gitbook/assets/image (49).png" alt="" width="285"><figcaption></figcaption></figure></div>

## Features

* Added table management, direct writes, and automatic downsampling to the [timeseries database](../app-builder/build-backend/functions/storage/timeseries-database.md).
* Configure photo resolution directly within the [photo](../app-builder/build-frontend/widgets/input-widgets/photo.md) widget.
* Introduced [Docker Extensions](../app-builder/build-backend/functions/extensions/) to run custom code for your Apps, both in the cloud or on-premises. (Made the [Industrial Blockchain](../app-builder/build-backend/functions/extensions/industrial-blockchain.md), [Process Simulations](../app-builder/build-backend/functions/extensions/process-simulations.md), and [RAG AI](../app-builder/build-backend/functions/extensions/rag-ai.md) Docker Extensions.
* Added a single-command script for [on-premise installation](../tutorials/on-premise-installation.md).
* Released the [Docker Agent](../app-builder/build-backend/agents/docker-agent.md), which lets you run connectors on any hardware that supports Docker.
* The [upload](../app-builder/build-frontend/widgets/input-widgets/upload.md) widget now directly supports uploading photos.
* The [barcode / QR](../app-builder/build-frontend/widgets/input-widgets/barcode-qr.md) widget now supports scanning multiple barcodes sequentially without closing the camera preview.

## Fixes

* Fixed multi-file upload behavior in the [upload](../app-builder/build-frontend/widgets/input-widgets/upload.md) widget when utilizing buffer storage.
* Resolved a positioning discrepancy between the [App Builder](../app-builder/overview.md) preview and [Production Apps](../production-apps/overview.md) when using the Top Bar or Top Bar and Bottom Tabs in the [Page Explorer](../app-builder/build-frontend/page-explorer.md). Widgets in Production Apps no longer render too low on the y-axis.
* Fixed a bug where the `fontSize` property on the [button](../app-builder/build-frontend/widgets/trigger-widgets/button.md) widget did not apply correctly.
* Duplicating canvas sections now correctly clears all pre-existing widget connections.
* Fixed an issue where the `onJsonMessage` and `onStringMessage` events inside the [MQTT Client](../app-builder/build-backend/functions/connectors/mqtt-client.md) connector failed to trigger correctly when registered multiple times.
* Resolved a dependency issue with serial data transfer that caused the [Modbus](../app-builder/build-backend/functions/connectors/modbus.md) connector to crash on startup.
* Fixed a rendering bug in the [Backend Builder](../app-builder/build-backend.md) flow interface where the connection arrow was missing when linking event handlers to function inputs.
* Fixed an issue where the incorrect initial page loaded when an App used programmatic page switching.

## Changes

* Renamed the File input widget to [Upload](../app-builder/build-frontend/widgets/input-widgets/upload.md), and added new filtering categories including photo.
* Configured backend event flows to only activate when running in test mode.

## Breaking changes

* If your App uses a top bar or top bar and bottom tabs navigation layout, you may need to adjust your widget positions o align with the new layout rendering (see [Fixes](v88-almost-forever.md#fixes)).
* The `readXlsx` function in the [File I/O](../app-builder/build-backend/functions/connectors/file-i-o.md) connector no longer returns an object containing the sheet name as the sole key when processing a single sheet. It now returns the array of rows directly.
