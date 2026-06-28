---
description: Dec 21, 2023
---

# v77 — More intelligence

![](https://lh7-qw.googleusercontent.com/docsz/AD_4nXdfcNVj5MARnW9Mz-s_4hi8IAhJnbMLq5D6csBh7AxAPNi3OJqi6pDXYfpvUxph23RHPRDspFNjTLAvs9uGfQ7OZlJQZ47dXsRfO2ArOaRV_DiDau_siRKvPsiEuR_0NbTKtIbzmasxIFdrWYbvFKBsLxiO?key=chRXiLUrI54Os_fCIQ1Z3w)

## Features

* Added “Artificial Intelligence” Agent, providing a conversational chat interface and an initial RAG AI implementation
* Largely extended App Builders’s linkage highlighting. Highlighting in general works in all directions and across backend and frontend. Input items can now receive data from multiple (and even mixed) sources.
* Data updates are now visible via animated item logos of the corresponding executors.
* Low-Code functions can be commented
* Better UX support for large input objects
* Automatic full-app snapshotting (backup) for each new deployed version

## Fixes

* Snaplines are largely fixed. They react only on visible widgets and appear during resizing as well. Widgets can be resized in a 10px grid only, making it easier to align them.
* Mobile and tablet screen scalings on production apps are fixed and the performance got optimized
* Several fixes in SensorThings API Connector
* App Installation message shows only on platforms that support PWAs
* Entirely removed buggy undo/redo functionality

