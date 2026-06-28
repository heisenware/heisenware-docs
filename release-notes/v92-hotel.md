---
description: Unreleased (upcoming)
---

# v92 — Hotel

<div align="left"><figure><img src="../.gitbook/assets/image (527).png" alt="" width="375"><figcaption></figcaption></figure></div>

## Features

* Final release of the new subflow feature
* Explicit re-scanning of data connected to a widget
* Complete re haul of the page explorer UX
* Extensions (Modifiers, Filters, Recorders and Error Handlers) are own nodes now
* Implemented anti-node-collision (snowplow) feature in the Backend Builder
* First version of an auto-formatting for backend logic
* Spotlight effect on backend functions, showing clearly the flow of events
* Automatic visual data truncation for huge payloads, improving responsiveness of the UI
* New Database Visualizer informing about connected tables and their data
* New in-app menu widget offering a fixed size drawer
* New Timeline widget
* New Iframe widget
* Custom vertical spacing for DataList widget
* Improved Chart widget's zoom and pan capabilities
* Upgraded internal MQTT broker and configured for more resilience
* Full-fledged, all-app, client-caching for super-fast browser reloads
* New Heidenhain DNC Agent
* New Insys compatible LXC container of our Connector

## Fixes

* Issue with showing the correct backend state directly after account creation
* Persisting of alias names
* Fixed sometimes broken highlighting of widges
* Scaling issue of production apps when browser window spans multiple monitors
