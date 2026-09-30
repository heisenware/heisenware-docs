---
description: >-
  Uploads files via picker or photo capture — type restrictions, thumbnails, path or base64 delivery
---

# Upload

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/file. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `clear` | output | `any` | Truthy values clear the file list (and write back an empty array). |

### Emits

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `files` | input | `Array<object>` | Writes the full list of selected/uploaded files after every add or delete (an empty array when cleared). |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

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
| Storage type | File uploads to the server and delivers a path; buffer keeps the content in the value as base64. Choices: File, Buffer. | File |
| button › Button Text | Label shown on the button; empty shows none. | `Upload` |
| button › Icon | Font Awesome class of an icon shown left of the label, e.g. fa-light fa-camera; empty shows none. |  |
| button › Text Size | Font size of the label in px. Range 8 to 40. *Set per screen.* | `14` |
| button › Icon Size | Size of the icon in px. Range 20 to 100. *Set per screen.* |  |
| button › Button Type | Color scheme: default uses the accent color, normal is neutral, success green, danger red. Choices: `default`, `normal`, `success`, `danger`. | `default` |
| button › Styling Mode | Contained fills the button with its color, outlined draws only a border, text shows the label alone. Choices: `text`, `contained`, `outlined`. | `contained` |
| button › Hover Text | Tooltip shown while the pointer rests on the button; empty shows the label or nothing. |  |
| button › Initially Disabled | Starts the button greyed out and unclickable until a bound button value enables it. | off |
| restrictions › Allowed file types | File categories the picker allows; empty allows every category. On phones and tablets Photo adds the camera, or alone replaces the picker with it. Choices: `Photo`, `Text`, `Documents`, `Spreadsheets`, `Presentations`, `Images`, `Audio`, `Video`, `Archives`, `Web`. | `[]` |
| restrictions › Maximum number of files | Number of files the widget holds; the button disables once reached. | `1` |
| restrictions › Aspect ratio | Crops every added image to this width-to-height ratio, centered; original keeps the picture as it is. Choices: Original, 16/9, 4/3, 7/5 (DIN A4). | Original |
| restrictions › Resolution | Shrinks every added image to a longest side of 640 (preview), 1920 (balanced) or 2560 px (high), re-encoded as JPEG; original keeps it. Choices: Original, Preview, Balanced, High. | Original |
| Allow multi-file upload | Lets the picker take several files in one go; the camera always takes one. | off |
| Show thumbnails | Shows a preview picture for each file in the list instead of its name and size. *Set per screen.* | off |
| Thumbnail size | Height of the preview thumbnails in px. Range 40 to 400. *Set per screen.* | `60` |

<!-- /generated -->
