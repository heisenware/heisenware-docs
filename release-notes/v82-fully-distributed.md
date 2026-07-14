---
description: Aug 28, 2024
---

# v82 — Fully distributed

<div align="left"><figure><img src="https://lh7-qw.googleusercontent.com/docsz/AD_4nXd0g7bLPr5hP19EXcKk-IGmIJh5cCI9cyT0cILnyViQvDqK0y7N2v0v9QhgkpjFJCGSmf1TtwsutzstMXKksw2w8na-ogZY0ZNXesTswQZh4tmpEvooLKKEIjsglMsD6FavoCLhwTygsI9cI8Bsq7fs9Gc?key=chRXiLUrI54Os_fCIQ1Z3w" alt=""><figcaption></figcaption></figure></div>

## Features

* Released the first fully distributed deployment option. See [Hosting and architecture](../account/hosting-and-architecture.md).
* Introduced an initial implementation of the [OPC UA server](../app-builder/build-backend/functions/connectors/opc-ua-server.md) connector.
* Persists [MQTT client](../app-builder/build-backend/functions/connectors/mqtt-client.md) connections to allow seamless restarts of the authentication server.
* Updated the core UI libraries and implemented license key validation.
* Added a new default fluent theme in the [Theme Editor](../app-builder/build-frontend/theme-editor.md) that aligns with the Heisenware brand identity.
* Automatically detects and re-establishes services when cloud slave nodes restart.
* Added the [kanban](../app-builder/build-frontend/widgets/display-widgets/kanban.md) widget.
* Added the [data list](../app-builder/build-frontend/widgets/display-widgets/data-list.md) widget.
* Added a new [chart](../app-builder/build-frontend/widgets/display-widgets/chart.md) widget.
* Improved the text box widget in input widgets to support local configuration.
* Enabled reordering functions across different sections in the Backend Builder.
* Introduced the [Heidenhain DNC](../app-builder/build-backend/functions/connectors/heidenhain-dnc.md) connector.
* Hides void input arguments on the canvas to declutter the workspace.
* Visualizes connections to linked widgets even when their layout sections are closed.

## Fixes

* Fixed an issue where function aliases did not function correctly.
* Resolved a vulnerability that allowed unauthorized logins with incorrect credentials.
* Restored support for Docker Extensions.
* Resolved various CSS and layout rendering issues across the platform.
* Fixed a critical performance bottleneck related to MQTT client authentication.
