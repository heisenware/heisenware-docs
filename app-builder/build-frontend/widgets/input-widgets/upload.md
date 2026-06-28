# Upload

The **Upload** widget provides a comprehensive interface for file and/or photo uploads. Users can select one or multiple files, which can be stored either as physical files on the server or as Base64-encoded buffers within your data.

The widget includes features like file type restriction, multi-file selection, and thumbnail previews.

<figure><img src="../../../../.gitbook/assets/Upload_bottom_looped.gif" alt=""><figcaption></figcaption></figure>

<figure><img src="../../../../.gitbook/assets/upload_bottom.png" alt=""><figcaption><p>A full and an empty upload widget</p></figcaption></figure>

## Data Binding

Connect the widget to your application's logic by dragging the corresponding items from the Backend Builder.

### Input

| **Property** | **Type** | **Description**                                                                                                                                            |
| ------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`files`**  | `Array`  | Fired whenever files are successfully uploaded or deleted. The payload is an array of file objects. See the **File Object Structure** section for details. |

### Output

| **Property** | **Type**  | **Description**                                         |
| ------------ | --------- | ------------------------------------------------------- |
| **`clear`**  | `Boolean` | When `true`, clears all uploaded files from the widget. |

#### File Object Structure

The structure of the file objects in the `files` array depends on the configured **Storage Type**.

**If `Storage Type` is `File`:**

```json
{
  "lastModified": 1678886400000,
  "name": "document.pdf",
  "size": 102400,
  "type": "application/pdf",
  "path": "/shared/runtime-files/a1b2c3d4e5.pdf"
}

```

**If `Storage Type` is `Buffer`:**

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

### Settings

These properties control the behavior and appearance of the file widget.

| **Label**                   | **Description**                                                                                         | **Type** | **Property**      |
| --------------------------- | ------------------------------------------------------------------------------------------------------- | -------- | ----------------- |
| **Storage Type**            | Determines how the uploaded file is stored: as a physical `File` on the server or as a Base64 `Buffer`. | String   | `storageType`     |
| **Restrict File Types**     | Restricts the selectable file types. Users can select one or more predefined categories.                | Array    | `accept`          |
| **Allow Multi-File Upload** | If `true`, users can select and upload multiple files at once.                                          | Boolean  | `multiple`        |
| **Maximum Number Of Files** | The total number of files that can be uploaded to the widget.                                           | Integer  | `maxFiles`        |
| **Show Thumbnails**         | If `true`, displays a preview thumbnail for uploaded image files.                                       | Boolean  | `showThumbnails`  |
| **Thumbnail Size**          | Sets the height (in pixels) of the preview thumbnails.                                                  | Number   | `thumbnailHeight` |

### Taking Photos exclusively

<div align="left"><figure><img src="../../../../.gitbook/assets/Upload_photo.png" alt=""><figcaption></figcaption></figure></div>

When only selecting the `Photo` option, modern devices like mobile phones and tablets will directly open the camera upon clicking this widget's button. If you want to allow a combination of file and camera uploads simply select all allowed categories leaving the `Photo` active.

### Button Configuration

The file selection is triggered by a button. You can customize its appearance using standard button properties. Common properties include:

* **`text`**: The text displayed on the button (e.g., "Upload File").
* **`icon`**: The icon displayed on the button (e.g., "upload").
* **`type`**: The button's style type (`normal`, `default`, `success`, `danger`).
* **`stylingMode`**: The visual style of the button (`text`, `outlined`, `contained`).

These properties are configured within a `button` object.
