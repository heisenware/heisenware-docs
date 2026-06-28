---
description: Dec 4, 2023
---

# v76 — Well cooked

<div align="left"><figure><img src="https://lh7-qw.googleusercontent.com/docsz/AD_4nXfVbs4GpROZnpCZINh2kTckcLANZ00Wneeb8TaAfVgVCouTSXsLXrF-X8VJ1tLfk-H-UbLCyobo7vgk7ntzI5EP9VEhZwQoigjo-VOrZRgRG3J_D5cvEGencGcWisNdciXr6OCZ0polVQvU0D7RPZpK28M?key=chRXiLUrI54Os_fCIQ1Z3w" alt=""><figcaption></figcaption></figure></div>

## Features

* All upload widgets (File, Barcode, DocumentScan) now show their uploaded data as “popover”, giving them a constant size (before the height was extended by the number of uploaded data).
* &#x20;The form widget can now be configured to show groups of input elements as tabs
* New command “validate” is available for the Form widget
* Widgets can now have individual “default-detached” properties (currently: “tabView” and “colCount” of Form are supported)

## Fixes

* When an output was linked to an input the input only triggered an event whenever the value of the output was changed. This sometimes led to missing re-renders on respective UI Widgets. Now, linked input items will always trigger an event, even when the corresponding value did not change.
* Improved document recognition in DocumentScan widget
* Improved RFID tag recognition algorithm in Zebra connector
* Clearing the URL on production apps in order to wipe away the auth0 injected “code” parameter
* Fixed slowdowns in rendering of production app when switching between pages of different height
* Fixed choosing to large screen on production app leading to a rendering with scrollbars initially
* Removed experimental Jupyter integration
