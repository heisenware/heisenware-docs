---
description: Unreleased
---

# v93 — Blue Meth

<div align="left"><figure><img src="../.gitbook/assets/v93-blue-meth.png" alt="" width="375"><figcaption></figcaption></figure></div>

## Features

* **Rebuilt platform engine**: One new engine now runs your flows both while you build in the [App Builder](../app-builder/overview.md) and inside deployed [Production Apps](../production-apps/overview.md). Existing Apps migrate automatically the first time they load, and older `.hwt` bundles migrate on [import](../app-builder/deploy-and-maintain.md).
* **Introduced variables**: Store named, App-wide values. Create them in the new Variables explorer, or right-click any function output, [modifier](../app-builder/build-backend/extension-nodes/modifier.md), [filter](../app-builder/build-backend/extension-nodes/filter.md), or [error handler](../app-builder/build-backend/extension-nodes/error-handler.md) and choose *Make variable…*. Read them as `$name` in YAML inputs and in JavaScript or JSONata expressions. Mark a variable as secret to keep it encrypted and masked. The built-in `$USER` holds the signed-in user.
* **Introduced endpoints**: Publish any [function](../app-builder/build-backend/functions/) under a stable public name from the new Endpoints explorer or the function's context menu. External [VRPC](../advanced/vrpc/) clients set its inputs, trigger it by name, and subscribe to its output.
* **AI assistant for everyone**: The assistant is now part of the platform. In the [App Manager](../app-manager/overview.md), the new Assistant area plans Apps with you from the requirements, data samples, and logos you drop into its knowledge rail, and keeps shared project notes. In the App Builder, the AI button opens the assistant panel, where it builds widgets, flows, sections, subflows, pages, variables, and endpoints, shows its work on the canvas, asks before deleting or releasing, and stops whenever you say so. Every checkpoint it creates is an ordinary [tag](../app-builder/deploy-and-maintain.md) you can roll back to.
* **Released the** [**MCP server**](../app-builder/build-backend/agents/mcp-server.md): Connect Claude Code, Claude Desktop, or any MCP client to your workspace and build with the same 60 tools the assistant uses. Add an MCP connector in the [Integrations panel](../app-manager/inbound-integrations.md) of the App Manager and it hands you a self-contained package with the credentials inside, plus the lines to paste into your client.
* **Widget General tab**: Every [widget's](../app-builder/build-frontend/widgets/) settings now open on a General tab that lists what it receives and emits. Linked rows show the live value, unlinked rows offer demo data you inject with one click, and you drop a function output straight onto a row to link it.
* **Per-screen layouts**: Every widget has a reference screen. Other screens follow it automatically until you touch the widget there; from then on that screen keeps its own layout. Dots on the selected widget show which screens are automatic, authored, or the reference, and *Reset position to auto* returns a screen to automatic. The [Frontend Builder](../app-builder/build-frontend/) preview and the deployed App render layouts identically.
* **Introduced the polar chart widget**: Draw radar and wind-rose style charts, with one series per numeric field seeded automatically.
* **Data grid conditional formatting**: Color cells or whole rows of the [data grid](../app-builder/build-frontend/widgets/display-widgets/data-grid.md) by rules on column values, including dates.
* **Data Visualizer becomes a data workbench**: Create tables, insert and edit rows, duplicate tables, export tables as CSV, export and import complete SQL dumps, write timeseries points, export measurements, back up and restore all timeseries data, and generate test data. It also browses databases running on Native Agents.
* **New database functions**: The [relational database](../app-builder/build-backend/functions/storage/relational-database.md) gains `dumpDatabase`, `importDatabase`, `duplicateTable`, `getTableRowCount`, and `generateFakeRelationalData`. The [timeseries database](../app-builder/build-backend/functions/storage/timeseries-database.md) gains `deletePoint`, `updatePoint`, `exportAppData`, `importAppData`, `exportMeasurementData`, and `generateFakeInfluxData`; `writePoint` accepts a timestamp, and `read` supports `offset` and `sortDesc`.
* **"All updated" trigger mode**: A [trigger](../app-builder/build-backend/functions/#trigger-sources) with several sources can now wait until every source has delivered, then fire once.

## Improvements

* **Section colors**: Tint [sections](../app-builder/build-backend/#grouping-sections) on the flow board from a palette in the section header.
* **Settings panel overhaul**: Range settings combine a slider with a number input, long tabs fold into collapsible sections, labels use sentence case, and every widget's data tab is *Content* and its appearance tab *Look & feel*. Text and chat widgets get a settings panel.
* **Automatic colors everywhere**: Every color field, including chart axes and palettes, map markers, kanban, and status lamps, accepts *Automatic* and previews the theme color it resolves to. The color keyword `gray` becomes `auto`; the old keyword keeps working.
* [**Progress bar**](../app-builder/build-frontend/widgets/display-widgets/progress-bar.md): Configure the bar width, and bind `min`, `max`, and `showStatus` individually.
* [**Group widget**](../app-builder/build-frontend/widgets/dynamic-group.md) **editing**: Edit and delete act on the selected child, overlays stay aligned after resizing, and child names show verbatim.
* [**Photo**](../app-builder/build-frontend/widgets/input-widgets/photo.md) **widget**: The camera shows the full frame, streams in Full HD, mirrors the front camera, and the captured preview matches the live view.
* **Open a page by URL**: Append `?page=<name>` to a Production App URL to open it on that page.
* **Smoother live data**: Widgets keep their live values when moved or reconfigured, and updates render at most once per frame.
* **Precise interaction on charts**: The App player renders plain DOM, giving exact click handling on charts.
* **Deploy without reload**: The App Builder keeps running after a deploy instead of reloading.
* **Ordered wiring**: Connecting and disconnecting functions is atomic, and values arrive before triggers fire.
* **Unlinked data widgets**: Data grids, lists, and tiles show their configured columns but never stale rows until linked.
* **Explorer order**: The explorers now read Functions, Pages, Files, Variables, Endpoints.
* **Protected file zones**: The [File Explorer](../app-builder/build-backend/file-explorer.md) no longer lets you delete or move system folders, and downloads of runtime files as well as all uploads require an access ticket.
* **Database notifications after commit**: `onChange` fires only once a transaction is committed.
* **Relation naming**: Foreign keys use proper singularization (`roastBatches` yields `roastBatchId`). Existing databases are untouched.
* [**On-premise**](../tutorials/on-premise-installation.md) **rollback**: Backups include the platform version, so a restore rolls back data and version together and warns when old images were pruned.

## Fixes

* **Multiple tabs**: Closing or reloading one browser tab no longer silences live data in another tab of the same user; every tab holds its own connection.
* **Deployed App integrity**: Deleting a page in the App Builder no longer removes widgets of the deployed twin.
* **Connector instances**: Instances created in the Function Explorer survive a restart of the connector service.
* **Audit tables**: Tables with a custom primary key create their audit log correctly, and a failing `auditLog` reports the error instead of blocking writes.
* **Boot window clicks**: Clicking a widget while a Production App is still loading no longer crashes it.
* **Buttons in groups**: Buttons inside group widgets trigger their function in deployed Apps.
* **Fresh data on first load**: Grids show current data instead of the snapshot taken at deploy time.
* **Form fields**: Forms bound to a function input no longer lose typed fields.
* **Lost updates under load**: Widget values, uploads, and form commits reach the backend reliably under load, and toasts are no longer dropped while the App is busy.
* **App start on subpages**: Data emitted on App start reaches data grids on subpages.
* **Page switching**: Programmatic page switches no longer replay after a reload or get swallowed.
* **Chart aggregation**: Fixed an aggregation bug in the [chart](../app-builder/build-frontend/widgets/display-widgets/chart.md) widget.
* **Inviting known users**: Inviting an address the account already knows, such as an App user, to the App Manager works again.
* **Toggle multitenancy**: The context menu action works again.
* **Account signup**: An account whose name is a prefix of an existing one gets its routing, duplicate workspace entries are no longer created and are healed on boot, and the workspace list is correct after switching accounts.
* [**Integrations**](../app-manager/inbound-integrations.md): Clients marked for deletion no longer show as online.

## Changes

* The experimental assistant and its activation switch are gone; the new assistant is on for every member.
* Removed the widget import/export action from the App Builder.
* Self-hosted installations: `HW_AUTH_CLIENT_TOKEN` is now `HW_PLATFORM_PUBLISHABLE_KEY`, and the assistant reads `HW_ANTHROPIC_API_KEY`.

## Breaking changes

* A quoted `"$USER"` inside modifier or filter expressions no longer expands. Use the bare `$USER` binding instead.
