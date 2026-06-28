---
description: 16 Mar 2026
---

# v91 — Worth It

<div align="left"><figure><img src="../.gitbook/assets/image (525).png" alt=""><figcaption></figcaption></figure></div>

## Features

* Professional license and subscription management as well as self-service payment possibility (via Stripe integration)
* New multi-fields feature for [Timeseries Database](../app-builder/build-backend/function-explorer/storage/timeseries-database.md)
* App Builder performance tuning, especially when reloading the browser page
* Slimmed-down [Docker agent](../app-builder/build-backend/function-explorer/agents/docker-agent.md) capable of running on resource-limited edge devices and IoT gateways
* New `Duration` and `Interval` objects for [Javascript Modifier](../app-builder/build-backend/modifier.md#javascript-expressions)

## Fixes

* Widget transformation under zooming and extended page height works now
* Fixed wrong auto-page-switching after fresh deploy
* Fixed a race condition leading to zombie-subscriptions on the broker that led to performance issues
* Fixed CSS `z-index` issue leading to widgets overflowing the bottom navigation bar
* Fixed subscription losses on event-style functions when the underlying agent encountered network re-connects
