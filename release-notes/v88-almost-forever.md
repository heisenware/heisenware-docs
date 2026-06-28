---
description: 12 Oct 2025
---

# v88 — Almost forever

<div align="left"><figure><img src="../.gitbook/assets/image (49).png" alt="" width="285"><figcaption></figcaption></figure></div>

## Features

* [Timeseries Database](../app-builder/build-backend/function-explorer/storage/timeseries-database.md): table management, direct writes, auto downsampling
* [Photo widget ](../app-builder/build-frontend/widgets/input-widgets/photo.md)with selectable resolution
* [Extensions](../app-builder/build-backend/function-explorer/extensions/) to power-up apps with any custom code running cloud or on-prem
* [Industrial Blockchain](../app-builder/build-backend/function-explorer/extensions/industrial-blockchain.md) Extension
* [Process Simulator](../app-builder/build-backend/function-explorer/extensions/process-simulations.md) Extension
* [RAG AI](../app-builder/build-backend/function-explorer/extensions/rag-ai/) Extension
* One-command [on-premise installer](../tutorials/on-premise-installation.md)
* [Docker Agent](/broken/pages/G4PEtPdTe3j9GRx6sLC6) allowing to run all our connectors on any hardware supporting Docker
* The [File Uploader](../app-builder/build-frontend/widgets/input-widgets/upload.md) widget can now directly upload photos as well
* The [Barcode](../app-builder/build-frontend/widgets/input-widgets/barcode-qr.md) widget can now scan several barcodes at once with the camera staying opened

## Fixes

* [File Uploader ](../app-builder/build-frontend/widgets/input-widgets/upload.md)when using buffer storage and multi-file upload option.
* Fixed different behavior between App Builder preview and production apps with respect to widget positioning when using `Top Bar` or `Top Bar and Bottom Tabs`  in the [App Settings](../app-builder/build-frontend/page-explorer.md#in-app-navigation). Production app widgets rendered to low in `y` (by the height of the top bar).
* Fixed broken `fontSize` setting for the [Button](../app-builder/build-frontend/widgets/trigger-widgets/button.md) widget
* When duplicating [Sections](/broken/pages/9vKr7mso7EW9dCDhxV7Y#organizing-logic-with-sections-grouping), all previously existing widget links get cleaned which wasn't the case before
* Fixed [onJsonMessage](../app-builder/build-backend/function-explorer/connectors/mqtt-client.md#onjsonmessage) and [onStringMessage](../app-builder/build-backend/function-explorer/connectors/mqtt-client.md#onstringmessage) not behaving correctly when used multiple times
* Fixed dependency issue (realizing serial data transfer) causing immediate crash of the [Modbus](../app-builder/build-backend/function-explorer/connectors/modbus.md) Agent
* Fixed missing arrow when linking event handler items to inputs in the flow builder
* Fixed loading correct initial page when app is using programmatic page switch

## Changes

* Renamed input widget [File](../app-builder/build-frontend/widgets/input-widgets/upload.md) to `Upload`. Added fresh categories for filtering uploaded data, most importantly added `Photo`
* Activating event flow from backend only in test mode

## Breaking Changes

* When `Top Bar` or `Top Bar and Bottom Tabs` widget in the App Builder need to be re-positioned to result in the same production app (see [Fixes](v88-almost-forever.md#fixes))&#x20;
* The [`readXlsx`](../app-builder/build-backend/function-explorer/connectors/file-i-o.md#readxlsx) function does not anymore return an object with the sheet name as sole key, but in cases of a single sheet returns the array of rows directly
