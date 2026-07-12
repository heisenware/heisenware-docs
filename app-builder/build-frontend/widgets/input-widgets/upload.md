# Upload

The upload widget handles file and photo uploads. Users pick one or more files, and you store each as a physical file on the server or as a Base64-encoded buffer in your data. It also offers file-type restriction, multi-file selection, and thumbnail previews.

<figure><img src="../../../../.gitbook/assets/upload_bottom.png" alt=""><figcaption><p>A full and an empty upload widget</p></figcaption></figure>

## Data binding

### Widget to function input

| **Property** | **Description**                                                                                                                                                  | **Type** |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `files`      | Fires whenever files are uploaded or deleted. The payload is an array of file objects. See [file object structure](upload.md#file-object-structure) for details. | `Array`  |

### Function output or modifier to widget

| **Property** | **Description**                                                                                                                                         | **Type**  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `clear`      | When `true`, clears all uploaded files from the widget.                                                                                                 | `Boolean` |
| `button`     | Overrides the upload button at runtime (label, styling, and more). Takes a `button` object; see [button configuration](upload.md#button-configuration). | `Object`  |

#### File object structure

The structure of the file objects in the `files` array depends on the `storageType` setting.

**If `storageType` is `file`:**

```json
{
  "lastModified": 1678886400000,
  "name": "document.pdf",
  "size": 102400,
  "type": "application/pdf",
  "path": "/shared/runtime-files/a1b2c3d4e5.pdf"
}
```

**If `storageType` is `buffer`:**

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

| **Property**      | **Label**               | **Description**                                                                                   | **Type** |
| ----------------- | ----------------------- | ------------------------------------------------------------------------------------------------- | -------- |
| `storageType`     | Storage type            | How each file is stored: as a physical file on the server (`file`) or a Base64 string (`buffer`). | string   |
| `accept`          | Restrict file types     | The file categories users may upload (see below). Pick one or more.                               | array    |
| `multiple`        | Allow multi-file upload | If `true`, users can select and upload several files at once.                                     | boolean  |
| `maxFiles`        | Maximum number of files | The total number of files the widget accepts.                                                     | integer  |
| `showThumbnails`  | Show thumbnails         | If `true`, shows a preview thumbnail for uploaded image files.                                    | boolean  |
| `thumbnailHeight` | Thumbnail size          | The height (in pixels) of the preview thumbnails.                                                 | number   |

The button that opens the file picker is styled through the same settings as any button (`text`, `icon`, text size, icon size, type, styling mode, hover text, initially disabled).

#### File categories

The `accept` setting limits uploads to these categories:

`Text`, `Documents`, `Spreadsheets`, `Presentations`, `Images`, `Audio`, `Video`, `Archives`, `Web`, and `Photo` (live camera capture).

When you include `Photo`, the widget can also apply an aspect ratio and a resolution to captured images (`preview`, `balanced`, `high`, or `original`).

### Taking photos exclusively

When only the `Photo` category is selected (see the dedicated [Photo](photo.md) widget for camera-only capture), phones and tablets open the camera directly when the user taps the button. To allow both file and camera uploads, select every category you want to permit while leaving `Photo` active.

### Button configuration

Bind a `button` object to the widget to override the upload button from backend logic at runtime, for example to change its label or styling for a specific user or context.

| **Property**  | **Description**                                                     | **Type** |
| ------------- | ------------------------------------------------------------------- | -------- |
| `text`        | The button text.                                                    | string   |
| `hint`        | The tooltip shown on hover.                                         | string   |
| `fontSize`    | The size of the button's text.                                      | integer  |
| `type`        | The button type (`default`, `normal`, `success`, `danger`, `back`). | string   |
| `stylingMode` | The button's styling mode (`text`, `contained`, `outlined`).        | string   |
