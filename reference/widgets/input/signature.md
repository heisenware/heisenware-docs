---
description: >-
  Captures a hand-drawn signature on a pad, inline or in a popup, and delivers it as a base64 PNG
---

# Signature

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/signature. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Emits

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `signature` | input | `string` | Writes the captured signature as a base64-encoded PNG (no data-URL prefix) when the user accepts it. |
| `onClick` | trigger |  | Triggers the linked executor when a signature is accepted. |

## Settings

Double-click the widget in the Page editor to open its settings.

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Pen color | Color of the drawn stroke; auto keeps the theme's text color. | `#2b2c7c` |
| Pad color | Background color of the signing pad; auto keeps the theme's tile color. | `#ffffff` |
| Display mode | Popup shows a button that opens the signing pad in a dialog; inline draws the pad in the widget itself with its buttons below. Choices: Inline, Popup. | Popup |
| Accept text | Label of the pad button that delivers the signature and closes the dialog; ignored while the pad is empty. | `Accept` |
| Clear text | Label of the pad button that wipes the drawing. | `Clear` |
| Button text | Label of the button on the page, also the title of the dialog. Only when Display mode is Popup. | `Sign Now` |

<!-- /generated -->
