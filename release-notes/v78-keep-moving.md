---
description: Jan 24, 2024
---

# v78 – Keep moving

<div align="left"><figure><img src="https://lh7-qw.googleusercontent.com/docsz/AD_4nXdW7Yf_ODib7ntz8RSmpC_826IwdjkPBHZw4qXklfVbf3GIZ8Dbk-tzWxOQoCrOuNK3hf_0NuP4dbJcn102CU1woFFnA25U6pVQ_n2_hbaIbDEd5eGb7EV4hRh-jKks6BwOyUE0rTaP6Y37loixKI7ZqS-8?key=chRXiLUrI54Os_fCIQ1Z3w" alt=""><figcaption></figcaption></figure></div>

## Features

* Improved the organization of available remote functionality in the [Function Explorer](../app-builder/build-backend/functions/function-explorer.md).
* Implemented traffic shaping to optimize data polling.
* Added support for duplicating layout sections inside the canvas.
* Added support for duplicating a [page or subpage](../app-builder/build-frontend/page-explorer.md).
* The reverse proxy now resolves all CORS issues by intercepting corresponding HTTP headers.
* Added a configurable delay setting to pause [function](../app-builder/build-backend/functions.md) execution, designed for sequential, one-by-one API processing.

## Fixes

* Entirely removed the buggy undo and redo features.
* Deleting a [page](../app-builder/build-frontend/page-explorer.md) now cleans up all its connected resources.
* Fixed an issue where default-detached properties (such as `colCount` on the [form widget](../app-builder/build-frontend/widgets/input-widgets/form.md)) failed to apply correctly.
