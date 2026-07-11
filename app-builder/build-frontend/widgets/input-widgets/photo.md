# Photo

The photo widget lets users capture images with their device camera. Its full-screen camera interface gives control over aspect ratio and orientation, ideal for photo capture in the field. It stores each photo as a physical file on the server or as a Base64-encoded buffer, and shows a preview list of everything taken.

<figure><img src="../../../../.gitbook/assets/Screenshot from 2025-08-11 13-45-19.png" alt=""><figcaption><p>Default view with one photo taken</p></figcaption></figure>

## Data binding

Link this widget to your logic by dragging items from the [Backend Builder](../../../build-backend/) onto it.

### Input

| **Property** | **Type** | **Description**                                                                                                                                                             |
| ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`images`** | `Array`  | Fired whenever a new photo is taken and saved, or when a photo is deleted. The payload is an array of photo objects. See the **File object structure** section for details. |

#### File object structure

The structure of the photo objects in the `images` array depends on the configured storage type.

**If `storageType` is `File`:**

```json
{
  "lastModified": 1678886400000,
  "name": "photo-mar-15-2023-120000",
  "type": "image/jpeg",
  "path": "/shared/runtime-files/a1b2c3d4e5.jpeg"
}
```

**If `storageType` is `Buffer`:**

```json
{
  "lastModified": 1678886400000,
  "name": "photo-mar-15-2023-120000",
  "type": "image/jpeg",
  "base64": "iVBORw0KGgoAAAANSUhEUgA..."
}
```

## Configuration

Set these in the widget's settings panel to control the camera and photo management. Some can also be driven dynamically through [data binding](./#configuration-and-data-binding).

### Settings

| **Label**                    | **Description**                                                                                          | **Type** | **Property**      |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- | -------- | ----------------- |
| **Storage type**             | Determines how the captured photo is stored: as a physical `File` on the server or as a Base64 `Buffer`. | String   | `storageType`     |
| **Aspect ratio**             | Sets the aspect ratio of the camera view. `Cover` fills the screen.                                      | String   | `aspectRatio`     |
| **Orientation**              | Sets the camera orientation to `Portrait` or `Landscape`.                                                | String   | `orientation`     |
| **Maximum number of photos** | The total number of photos that can be captured with the widget.                                         | Integer  | `maxPhotos`       |
| **Thumbnail size**           | Sets the height (in pixels) of the preview thumbnails.                                                   | Number   | `thumbnailHeight` |

### Button configuration

A button triggers the camera interface. Customize its appearance with standard button properties, such as:

* **`text`**: The text displayed on the button (e.g., "Take Photo").
* **`icon`**: The icon displayed on the button (e.g., "camera").
* **`type`**: The button's style type (`normal`, `default`, `success`, `danger`).
* **`stylingMode`**: The visual style of the button (`text`, `outlined`, `contained`).
