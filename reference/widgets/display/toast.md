---
description: >-
  Pops a transient notification for each bound message or executor error — invisible at runtime
---

# Toast

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/toast. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties under Receives and Emits. Drop an executor's output, input or trigger onto a row to link it. An example also fills an unlinked widget as demo data in the App Builder.

{% tabs %}
{% tab title="Receives" %}
**`message`** (from an output, `string | object`): Shows a toast once per received value. Strings display as-is; objects display as `message` (plus `, because: <cause>` when present).

<details>

<summary>Example</summary>

```json
"Order saved"
```

</details>

**`message`** (from an error handler, `object`): Receives the linked executor's error and shows it as a toast: `<message>, because: <cause>`.

<details>

<summary>Example</summary>

```json
{
  "message": "Saving failed",
  "cause": "connection lost"
}
```

</details>

{% endtab %}

{% endtabs %}

## Settings

Double-click the widget in the Page editor to open its settings, grouped in these tabs. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

<details>

<summary>Look &amp; feel</summary>

* **Type**: Color and icon of the notification: info grey, warning yellow, error red, success green. Choices: Info, Warning, Error, Success.
* **Display time**: How long the notification stays on screen in ms. Range 100 to 10000.
* **Position**: Edge or corner of the screen where the notification appears. Choices: Bottom left, Bottom center, Bottom right, Top left, Top center, Top right. *Set per screen.*

</details>

<!-- /generated -->
