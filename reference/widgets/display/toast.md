---
description: >-
  Pops a transient notification for each bound message or executor error — invisible at runtime
---

# Toast

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/toast. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `message` | output | `string\|object` | Shows a toast once per received value. Strings display as-is; objects display as `message` (plus `, because: <cause>` when present). |
| `message` | error handler | `object` | Receives the linked executor's error and shows it as a toast: `<message>, because: <cause>`. |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>message</code> (output)</summary>

```json
"Order saved"
```

</details>

<details>

<summary><code>message</code> (error handler)</summary>

```json
{
  "message": "Saving failed",
  "cause": "connection lost"
}
```

</details>

## Settings

Double-click the widget in the Page editor to open its settings. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Type | Color and icon of the notification: info grey, warning yellow, error red, success green. Choices: Info, Warning, Error, Success. | Info |
| Display time | How long the notification stays on screen in ms. Range 100 to 10000. | `3000` |
| Position | Edge or corner of the screen where the notification appears. Choices: Bottom left, Bottom center, Bottom right, Top left, Top center, Top right. *Set per screen.* | Top center |

<!-- /generated -->
