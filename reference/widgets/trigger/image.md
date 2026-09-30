---
description: >-
  Shows a static image from the media library (dropped or by path), fitted to its box with position, corner radius and letterbox color; clicks trigger actions or switch pages
---

# Image

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/image. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `path` | file | `string` | The file-server path of the image: set by dropping a file from the media library onto the widget, or written to the staticData prop (create_widget props / upload_shared_file's sharedPath). |

### Emits

| Property | Linked to | What it does |
|---|---|---|
| `onClick` | trigger | Triggers the linked executor when the image is clicked. |
| `onClick` | page | Switches to the linked page when the image is clicked. |
| `onClick` | App action | Runs the linked app action (logout, reload, back) when the image is clicked. |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>path</code></summary>

```json
"/shared/uploads/machine.png"
```

</details>

## Settings

Double-click the widget in the Page editor to open its settings. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

### Data binding

| Setting | What it does | Default |
|---|---|---|
| Path | Media library path of the picture (/shared/...) or a full http(s) URL; a linked file path wins over it. |  |
| Alternative text | Text read by screen readers and shown when the file is missing; empty shows nothing. |  |

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Image fitting | How the picture meets its box when their shapes differ. Choices: Contain (whole image, bars if needed), Cover (fill the box, crop the rest), Fill (stretch to the box), None (natural size, clipped), Scale down (never enlarge). *Set per screen.* | Contain (whole image, bars if needed) |
| Focal point | Which part of the picture stays visible when the fitting crops it or leaves room. Choices: Center, Top, Bottom, Left, Right, Top left, Top right, Bottom left, Bottom right. *Set per screen.* | Center |
| Corner radius | Rounding of the corners, from square to circle; theme keeps the theme's radius. Choices: Theme, Square, Low, Medium, High, Circle. | Square |
| Background color | Color of the box behind the picture, visible as bars when the fitting leaves room; auto keeps the theme's tile color. | `transparent` |

## Good to know

* Drag a page or an App action from the Pages and actions explorer onto it to run it on click.

<!-- /generated -->
