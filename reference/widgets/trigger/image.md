---
description: >-
  Shows a static image from the media library (dropped or by path), fitted to its box with position, corner radius and letterbox color; clicks trigger actions or switch pages
---

# Image

<figure><img src="../../../.gitbook/assets/widget-image.png" alt="Floor plan of the acme bottling plant, hall 1, with lines 1 to 3, the warehouse, the ovens and the syrup room" width="808"><figcaption></figcaption></figure>

An image shows a picture from your media library: a logo, a machine photo, a floor plan, a wiring diagram. Drop the file on the widget and choose how it fits its box, where it sits and how round the corners are. A click on the image can run your logic, switch to a page or run an App action, so a floor plan can lead to the page of each line.

**Good for:** logos and headers, machine photos, clickable floor plans and overviews.

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/image. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties under Receives and Emits. Drop an executor's output, input or trigger onto a row to link it. An example also fills an unlinked widget as demo data in the App Builder.

{% tabs %}
{% tab title="Receives" %}
**`path`** (from a file, `string`): The file-server path of the image: set by dropping a file from the media library onto the widget, or written to the staticData prop (create_widget props / upload_shared_file's sharedPath).

<details>

<summary>Example</summary>

```json
"/shared/uploads/machine.png"
```

</details>

{% endtab %}

{% tab title="Emits" %}
**`onClick`** (fires a trigger): Triggers the linked executor when the image is clicked.

**`onClick`** (switches to a page): Switches to the linked page when the image is clicked.

**`onClick`** (runs an App action): Runs the linked app action (logout, reload, back) when the image is clicked.

{% endtab %}

{% endtabs %}

## Settings

Double-click the widget in the Page editor to open its settings, grouped in these tabs. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

<details>

<summary>Data binding</summary>

* **Path**: Media library path of the picture (/shared/...) or a full http(s) URL; a linked file path wins over it.
* **Alternative text**: Text read by screen readers and shown when the file is missing; empty shows nothing.

</details>

<details>

<summary>Look &amp; feel</summary>

* **Image fitting**: How the picture meets its box when their shapes differ. Choices: Contain (whole image, bars if needed), Cover (fill the box, crop the rest), Fill (stretch to the box), None (natural size, clipped), Scale down (never enlarge). *Set per screen.*
* **Focal point**: Which part of the picture stays visible when the fitting crops it or leaves room. Choices: Center, Top, Bottom, Left, Right, Top left, Top right, Bottom left, Bottom right. *Set per screen.*
* **Corner radius**: Rounding of the corners, from square to circle; theme keeps the theme's radius. Choices: Theme, Square, Low, Medium, High, Circle.
* **Background color**: Color of the box behind the picture, visible as bars when the fitting leaves room; auto keeps the theme's tile color.

</details>

## Good to know

* Drag a page or an App action from the Pages and actions explorer onto it to run it on click.

<!-- /generated -->
