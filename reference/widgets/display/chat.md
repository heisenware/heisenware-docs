---
description: >-
  Displays a conversation of user and bot messages with markup and expandable source citations
---

# Chat

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/chat. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties under Receives and Emits. Drop an executor's output, input or trigger onto a row to link it. An example also fills an unlinked widget as demo data in the App Builder.

{% tabs %}
{% tab title="Receives" %}
**`data`** (from an output, `Array<object>`): The conversation to display, oldest first.

<details>

<summary>Example</summary>

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

**`clear`** (from an output, `any`): Truthy values clear the conversation.

<details>

<summary>Example</summary>

```json
true
```

</details>

{% endtab %}

{% endtabs %}

<!-- /generated -->
