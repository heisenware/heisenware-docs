---
description: Jan 24, 2024
---

# v78 — Keep moving

![](https://lh7-qw.googleusercontent.com/docsz/AD_4nXdW7Yf_ODib7ntz8RSmpC_826IwdjkPBHZw4qXklfVbf3GIZ8Dbk-tzWxOQoCrOuNK3hf_0NuP4dbJcn102CU1woFFnA25U6pVQ_n2_hbaIbDEd5eGb7EV4hRh-jKks6BwOyUE0rTaP6Y37loixKI7ZqS-8?key=chRXiLUrI54Os_fCIQ1Z3w)

## Features

* Better organization of available remote functionality
* Implemented traffic shaping when polling data
* Proper section duplication
* Page and Subpage duplication
* Reverse proxy now manages all CORS issues by intercepting the respective HTTP headers
* It is now possible to delay execution of a function by a configurable time (most important for one-by-one processing of API calls)

## Fixes

* Entirely removed buggy undo/redo functionality
* When deleting a page all connected resources are cleaned now
* Fixed issue with default detached properties (e.g. “colCount” on Form widget)
