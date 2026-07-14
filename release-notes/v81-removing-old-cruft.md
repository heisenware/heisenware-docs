---
description: Jul 28, 2024
---

# v81 – Removing old cruft

<div align="left"><figure><img src="https://lh7-qw.googleusercontent.com/docsz/AD_4nXfIw0MmFzFIHOaaTs5YQuUe92xJhoqPTsGJPEa6cK3WTRyUsOpmS9rJ1AtcRN-q-YFBC9n3X02U26_yfIa4DhbgdpCXzrzT930lkE44MrMGysoKoDuJ7-wv6VRAHF5yjeI1A-ZwVeLaHrN_wKdvTDRBTFo?key=chRXiLUrI54Os_fCIQ1Z3w" alt=""><figcaption></figcaption></figure></div>

## Features

* Introduced the [App Manager](../app-manager/overview.md).
* Upgraded user identity services: integrated FusionAuth as the built-in [user management](../app-manager/users-and-access.md) engine.
* Added support for multiple deployment modes: you can now select between cloud, server, and container options.
* Added configuration options to customize the title and icon displayed in the app bar title.
* App setting modifications no longer require a redeployment to take effect.
* Improved container orchestration: running docker-compose power-cycles now reliably brings up the entire system, including deployed Apps.

## Fixes

* Improved reliability for backend event subscriptions.
* Resolved an issue that prompted users with spurious password entry requests.
