---
description: >-
  Displays bound media — pdf, image or svg — from a file object, file-server path or URL
---

# Media View

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/media-view. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `data` | output | `string\|object\|Array<object>` | The medium to display (pdf, jpeg, png, gif or svg): a file object, a file-server path or a URL. A single-element array is unwrapped. |
| `clear` | output | `any` | Truthy values clear the displayed medium. |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>data</code></summary>

```json
{
  "name": "report.pdf",
  "type": "application/pdf",
  "path": "/shared/uploads/report.pdf"
}
```

</details>

<details>

<summary><code>clear</code></summary>

```json
true
```

</details>

## Settings

Double-click the widget in the Page editor to open its settings. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Image fitting | How a picture meets its box when their shapes differ; PDFs ignore it. Choices: Contain (whole image, bars if needed), Cover (fill the box, crop the rest), Fill (stretch to the box), None (natural size, clipped), Scale down (never enlarge). *Set per screen.* | Contain (whole image, bars if needed) |
| Focal point | Which part of a picture stays visible when the fitting crops it or leaves room. Choices: Center, Top, Bottom, Left, Right, Top left, Top right, Bottom left, Bottom right. *Set per screen.* | Center |
| Corner radius | Rounding of the corners, from square to circle; theme keeps the theme's radius. Choices: Theme, Square, Low, Medium, High, Circle. | Square |

<!-- /generated -->
