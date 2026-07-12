# Upload

The upload widget handles file and photo uploads. Users pick one or more files, and you store each as a physical file on the server or as a Base64-encoded buffer in your data. It also offers file-type restriction, multi-file selection, and thumbnail previews.

<figure><img src="../../../../.gitbook/assets/upload_bottom.png" alt=""><figcaption><p>A full and an empty upload widget</p></figcaption></figure>

## Data binding

### Widget to function input

| **Property** | **Description**                                                                                                                                            | **Type** |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **`files`**  | Fires whenever files are uploaded or deleted. The payload is an array of file objects. See [file object structure](#file-object-structure) for details.    | `Array`  |

### Function output to widget

| **Property** | **Description**                                                                                                                                  | **Type**  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| **`clear`**  | When `true`, clears all uploaded files from the widget.                                                                                          | `Boolean` |
| **`button`** | Overrides the upload button at runtime (label, styling, disabled state, and more). Takes a `button` object; see [button configuration](#button-configuration). | `Object`  |

#### File object structure

The structure of the file objects in the `files` array depends on the configured storage type.

**If `storageType` is `File`:**

```json
{
  "lastModified": 1678886400000,
  "name": "document.pdf",
  "size": 102400,
  "type": "application/pdf",
  "path": "/shared/runtime-files/a1b2c3d4e5.pdf"
}
```

**If `storageType` is `Buffer`:**

```json
{
  "lastModified": 1678886400000,
  "name": "image.png",
  "size": 51200,
  "type": "image/png",
  "base64": "iVBORw0KGgoAAAANSUhEUgA..."
}
```

## Configuration

Set the widget's defaults in the settings panel. A button triggers the file selection, so several settings style that button. You can override any of the button settings at runtime through the `button` binding above.

### Settings

| **Property**    | **Label**               | **Description**                                                                | **Type** |
| --------------- | ----------------------- | ----------------------------------------------------------------------------- | -------- |
| `storageType`   | Storage type            | How each file is stored: as a physical `File` on the server or a Base64 `Buffer`. | String |
| `accept`        | Restrict file types     | The selectable file categories. Users can pick one or more.                   | Array    |
| `multiple`      | Allow multi-file upload | If `true`, users can select and upload several files at once.                 | Boolean  |
| `maxFiles`      | Maximum number of files | The total number of files the widget accepts.                                 | Integer  |
| `showThumbnails`| Show thumbnails         | If `true`, shows a preview thumbnail for uploaded image files.                | Boolean  |
| `thumbnailHeight`| Thumbnail size         | The height (in pixels) of the preview thumbnails.                             | Number   |

Plus the standard button settings (`text`, `icon`, `fontSize`, `iconSize`, `type`, `stylingMode`, `hoverText`, `initiallyDisabled`) that style the upload button.

### Taking photos exclusively

When only the `Photo` category is selected (see the dedicated [Photo](photo.md) widget for camera-only capture), phones and tablets open the camera directly when the user taps the button. To allow both file and camera uploads, select every category you want to permit while leaving `Photo` active.

### Button configuration

Bind a `button` object to the widget to override the upload button from backend logic at runtime, for example to change its label or styling for a specific user or context.

| **Property**  | **Description**                                             | **Type** |
| ------------- | ---------------------------------------------------------- | -------- |
| `text`        | The button text.                                           | String   |
| `fontSize`    | The size of the button's text.                             | Integer  |
| `iconSize`    | The size of the button's icon.                             | Integer  |
| `type`        | The button type (`default`, `normal`, `success`, `danger`, `back`). | String |
| `stylingMode` | The button's styling mode (`text`, `contained`, `outlined`). | String   |
| `disabled`    | When truthy, disables the button; when falsy, enables it.  | Any      |
