# Media view

The media view widget displays images and PDF documents. It visualizes raw Base64 strings, media server paths, file objects, or public URLs in your Apps.

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-09-27 at 15.22.56.png" alt="" width="264"><figcaption></figcaption></figure>

## Data binding

### Function output or modifier to widget

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `data` | Supplies the media content used to render images or documents on the widget canvas. Automatically unpacks single-item arrays. | string \| array \| object |
| `clear` | Clears the currently displayed media item from the view layout when a signal is received. | boolean |

### Data formats

The `data` property handles multiple flexible input payload types to streamline integration with your backends.

* **Base64 string:** A raw Base64-encoded string character block. The widget automatically resolves standard MIME categories (such as `image/png` or `application/pdf`).
* **File Base64 object:** A structured object defining explicit `base64` data and `type` properties.
* **File path object:** A structured object containing explicit backend server `path` and file `type` keys.
* **Media server path:** A direct text string locator path addressing a storage asset hosted directly on the platform media cluster.
* **URL:** A standard fully qualified public internet web link to an external image or file target.

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-09-27 at 15.26.29.png" alt=""><figcaption><p>A function node with an image connected to the media view widget. The extension node retrieves the content of the output array.</p></figcaption></figure>

<figure><img src="../../../../.gitbook/assets/image (431).png" alt=""><figcaption><p>Binding a file item extracted from the media server file system directly into memory works without extra modifiers.</p></figcaption></figure>

## Configuration

Set the widget's defaults in the settings panel.

### General settings

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `objectFit` | Image fitting | How the image meets its box: `contain` (whole image, bars if needed - the default), `cover` (fill the box, crop the rest), `fill` (stretch), `none` (natural size, clipped) or `scale-down` (never enlarge). | string |
| `objectPosition` | Focal point | Which part of the image stays visible when `cover` or `none` crops it: `center`, `top`, `bottom`, `left`, `right` or a corner. | string |
| `borderRadius` | Corner radius | `theme` (the app theme's radius), a preset from square to circle, or any CSS length. The same setting as on the card and image widgets. Apps built before v93 stored a percent number here; it is migrated on first start. | string |
