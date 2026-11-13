---
description: >-
  Uploads files via picker or photo capture — type restrictions, thumbnails, delivers references into the file store or small files inline
---

# Upload

<figure><img src="../../../.gitbook/assets/widget-upload.png" alt="Attach documents panel with an Add files button" width="568"><figcaption></figcaption></figure>

The upload widget lets users add files: from the file picker, or on phones and tablets straight from the camera. You decide which file types it takes and how many, and it can show thumbnails of what was added. The files go into the workspace's file store, and after every change your logic receives what the widget holds: the file itself when it holds one, a list of files when it holds several. Store that in a [`file` or `files` field](../../functions/storage/relational-database.md#files-in-a-table) as it is.

**Good for:** delivery notes and certificates, photos for damage or quality reports, importing lists and recipes.

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/file. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties under Receives and Emits. Drop an executor's output, input or trigger onto a row to link it. An example also fills an unlinked widget as demo data in the App Builder.

{% tabs %}
{% tab title="Receives" %}
**`clear`** (from an output, `boolean`): Truthy values clear the file list (and write back an empty array).

<details>

<summary>Example</summary>

```json
true
```

</details>

{% endtab %}

{% tab title="Emits" %}
**`files`** (into an input, `object | Array<object>`): Writes what the widget holds after every add or delete. Holding one file (`restrictions.maxFiles` is 1, the default) it writes that file's entry, and nothing once it is empty; holding several it writes the list of their entries (an empty list when cleared). Reads either shape.

{% endtab %}

{% endtabs %}

## Settings

Double-click the widget in the Page editor to open its settings, grouped in these tabs. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

<details>

<summary>Look &amp; feel</summary>

* **Storage type**: File uploads into the workspace's file store and delivers a reference; buffer keeps the content in the value as base64, at most 64 kB altogether. Choices: File, Buffer.
* **Button**: The button members press to scan, upload or take a photo.
  * **Button Text**: Label shown on the button; empty shows none.
  * **Icon**: Font Awesome class of an icon shown left of the label, e.g. fa-light fa-camera; empty shows none.
  * **Text Size**: Font size of the label in px. Range 8 to 40. *Set per screen.*
  * **Icon Size**: Size of the icon in px. Range 20 to 100. *Set per screen.*
  * **Button Type**: Color scheme: default uses the accent color, normal is neutral, success green, danger red. Choices: Default, Normal, Success, Danger.
  * **Styling Mode**: Contained fills the button with its color, outlined draws only a border, text shows the label alone. Choices: Text, Contained, Outlined.
  * **Hover Text**: Tooltip shown while the pointer rests on the button; empty shows the label or nothing.
  * **Initially Disabled**: Starts the button greyed out and unclickable until a bound button value enables it.
* **Restrictions**: Limits on the files members may add.
  * **Allowed file types**: File categories the picker allows; empty allows every category. On phones and tablets Photo adds the camera, or alone replaces the picker with it. Choices: Photo, Text, Documents, Spreadsheets, Presentations, Images, Audio, Video, Archives, Web.
  * **Maximum number of files**: Number of files the widget holds; a larger selection takes the first ones, and the button disables once reached. With 1 the widget delivers that one file (for a file field), with more a list of files (for a files field).
  * **Aspect ratio**: Crops every added image to this width-to-height ratio, centered; original keeps the picture as it is. Choices: Original, 16/9, 4/3, 7/5 (DIN A4).
  * **Resolution**: Shrinks every added image to a longest side of 640 (preview), 1920 (balanced) or 2560 px (high), re-encoded as JPEG; original keeps it. Choices: Original, Preview, Balanced, High.
* **Allow multi-file upload**: Lets the picker take several files in one go; the camera always takes one.
* **Show thumbnails**: Shows a preview picture for each file in the list instead of its name and size. *Set per screen.*
* **Thumbnail size**: Height of the preview thumbnails in px. Range 40 to 400. *Set per screen.*

</details>

<!-- /generated -->
