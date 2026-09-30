---
description: >-
  Captures webcam photos with aspect-ratio crop and quality presets — legacy, superseded by Upload
---

# Photo

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/photo. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Emits

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `images` | input | `Array<object>` | Writes the full list of captured photos after every capture or delete. |
| `onClick` | trigger |  | Triggers the linked executor when a photo is captured. |

## Settings

Double-click the widget in the Page editor to open its settings. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Storage type | File uploads each photo as JPEG to the server and delivers a path; buffer keeps it in the value as base64. Choices: File, Buffer. | File |
| button › Button Text | Label shown on the button; empty shows none. | `Take Photo` |
| button › Icon | Font Awesome class of an icon shown left of the label, e.g. fa-light fa-camera; empty shows none. |  |
| button › Text Size | Font size of the label in px. Range 8 to 40. *Set per screen.* | `14` |
| button › Icon Size | Size of the icon in px. Range 20 to 100. *Set per screen.* |  |
| button › Button Type | Color scheme: default uses the accent color, normal is neutral, success green, danger red. Choices: `default`, `normal`, `success`, `danger`. | `default` |
| button › Styling Mode | Contained fills the button with its color, outlined draws only a border, text shows the label alone. Choices: `text`, `contained`, `outlined`. | `contained` |
| button › Hover Text | Tooltip shown while the pointer rests on the button; empty shows the label or nothing. |  |
| button › Initially Disabled | Starts the button greyed out and unclickable until a bound button value enables it. | off |
| Aspect ratio | Width-to-height ratio of the crop frame over the camera view; portrait orientation flips it. Choices: 16/9, 4/3, 7/5 (DIN A4). | 16/9 |
| Resolution | JPEG quality of the saved photo: low 50%, medium 80%, high 100%; the camera stream is always asked for 1920x1080. Choices: Low, Medium, High. | High |
| Orientation | Portrait makes the crop frame taller than wide, landscape wider than tall. Choices: Portrait, Landscape. | Portrait |
| Maximum number of photos | Number of photos the widget holds; the button disables once reached. | `1` |
| Thumbnail size | Height of the preview thumbnails. Range 40 to 400. *Set per screen.* | `200` |

<!-- /generated -->
