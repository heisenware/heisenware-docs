---
description: Dec 21, 2023
---

# v77 — More intelligence

<div align="left"><figure><img src="https://lh7-qw.googleusercontent.com/docsz/AD_4nXdfcNVj5MARnW9Mz-s_4hi8IAhJnbMLq5D6csBh7AxAPNi3OJqi6pDXYfpvUxph23RHPRDspFNjTLAvs9uGfQ7OZlJQZ47dXsRfO2ArOaRV_DiDau_siRKvPsiEuR_0NbTKtIbzmasxIFdrWYbvFKBsLxiO?key=chRXiLUrI54Os_fCIQ1Z3w" alt=""><figcaption></figcaption></figure></div>

## Features

* Introduced an artificial intelligence agent that provides a conversational [chat](../reference/widgets/display/chat.md) interface and an initial [RAG AI](../reference/functions/add-ons/README.md) implementation.
* Expanded connection highlighting in the [App Builder](../app-builder/README.md). Highlighting works in all directions across the Backend Builder and Frontend Builder. Inputs can now receive data from multiple and mixed sources.
* Animated logos on [functions](../concepts/executors-and-instances.md) now visualize active data updates in real time.
* Added support for commenting on functions.
* Improved the user interface when working with large input objects.
* Automatically creates a [tag](../app-builder/test-and-deploy.md) of your App for each new deployed version.

## Fixes

* Improved snapline behavior: Snaplines now react only to visible widgets and appear during resizing. Widgets now snap to a 10px grid for easier alignment.
* Fixed screen scaling for mobile and tablet devices on [Production Apps](../app-player/README.md) and optimized rendering performance.
* Resolved several issues in the [OGC SensorThings API](../reference/functions/add-ons/README.md) extension.
* The App installation prompt now only appears on platforms that support Progressive Web Apps (PWAs).
* Removed the buggy undo and redo features.
