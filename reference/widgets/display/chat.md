---
description: >-
  Displays a conversation of user and bot messages with markup and expandable source citations
---

# Chat

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/chat. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `data` | output | `Array<object>` | The conversation to display, oldest first. |
| `clear` | output | `any` | Truthy values clear the conversation. |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>data</code></summary>

```json
[
  {
    "role": "user",
    "content": "How do I reset the filter?"
  },
  {
    "role": "bot",
    "content": "Open **Settings** and press *Reset*.",
    "sources": [
      {
        "name": "manual.pdf",
        "pageNumber": 12,
        "lineFrom": 3,
        "lineTo": 9
      }
    ]
  }
]
```

</details>

<details>

<summary><code>clear</code></summary>

```json
true
```

</details>

<!-- /generated -->
