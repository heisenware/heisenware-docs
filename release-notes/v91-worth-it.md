---
description: 16 Mar 2026
---

# v91 — Worth It

<div align="left"><figure><img src="../.gitbook/assets/image (525).png" alt=""><figcaption></figcaption></figure></div>

## Features

* Manage professional licenses, subscriptions, and self-service payments through a Stripe integration in the Plan & Billing screen of the [App Manager](../app-manager/README.md).
* Added support for multi-field configurations in the [timeseries database](../reference/functions/storage/timeseries-database.md).
* Released a lightweight [Docker Agent](../app-manager/agents/docker-agent.md) designed to run on resource-constrained edge devices and IoT gateways.
* Added new `Duration` and `Interval` helper objects for JavaScript expressions within the [modifier](../app-builder/flowboard/modifier.md#javascript-expressions) extension node.

## Improvements

* Optimized [App Builder](../app-builder/README.md) performance and decreased workspace load times, especially when reloading browser pages.

## Fixes

* Fixed canvas widget transformations when zooming on pages with extended height in the [Frontend Builder](../app-builder/page-editor.md).
* Fixed an issue where [Production Apps](../app-player/README.md) performed incorrect automatic page switching after a new deployment.
* Resolved a race condition that created zombie subscriptions on the broker, improving overall platform performance.
* Fixed a CSS z-index layout bug that caused widgets to overflow the bottom navigation bar.
* Fixed event-style function subscription losses that occurred when an [Agent](../concepts/agents-and-where-code-runs.md) encountered network reconnections.
