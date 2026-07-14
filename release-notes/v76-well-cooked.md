---
description: Dec 4, 2023
---

# v76 — Well cooked

<div align="left"><figure><img src="https://lh7-qw.googleusercontent.com/docsz/AD_4nXfVbs4GpROZnpCZINh2kTckcLANZ00Wneeb8TaAfVgVCouTSXsLXrF-X8VJ1tLfk-H-UbLCyobo7vgk7ntzI5EP9VEhZwQoigjo-VOrZRgRG3J_D5cvEGencGcWisNdciXr6OCZ0polVQvU0D7RPZpK28M?key=chRXiLUrI54Os_fCIQ1Z3w" alt=""><figcaption></figcaption></figure></div>

## Features

* All upload widgets – including [Upload](../app-builder/build-frontend/widgets/input-widgets/upload.md) and [Barcode / QR](../app-builder/build-frontend/widgets/input-widgets/barcode-qr.md) – now display uploaded data in a popover. This keeps widget sizes constant instead of expanding their height as users upload more data.
* Configure the [form widget](../app-builder/build-frontend/widgets/input-widgets/form.md) to display groups of input elements as tabs.
* The `validate` command is now available for the [form widget](../app-builder/build-frontend/widgets/input-widgets/form.md).
* Widgets now support individual `default-detached` properties. Currently, the [form widget](../app-builder/build-frontend/widgets/input-widgets/form.md) supports two properties: `tabView` and `colCount`.

## Fixes

* Linking an output to an input now always triggers an event, even if the corresponding value remains unchanged. This fixes intermittent rendering issues on UI widgets where linked inputs previously only triggered events when values actually changed.
* Improved document recognition in the document scan widget.
* Improved the RFID tag recognition algorithm in the [Zebra RFID IoT](../app-builder/build-backend/functions/connectors/zebra-rfid-iot.md) connector.
* Cleared the URL on [Production Apps](../production-apps/overview.md) to remove the Auth0-injected `code` parameter.
* Resolved rendering slowdowns in [Production Apps](../production-apps/overview.md) when switching between pages of different heights.
* Fixed initial scrollbar rendering issues that occurred when selecting a large screen size in [Production Apps](../production-apps/overview.md).
* Removed the experimental Jupyter integration.
