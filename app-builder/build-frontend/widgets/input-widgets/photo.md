# Photo

{% hint style="success" %}
Since [v88 - Almost Forever](../../../../release-notes/v88-almost-forever.md), you can use the [Upload](upload.md) to take photos as well and with much higher resolution than with this widget. The widget here is still useful when: smaller images aren't an issue, webcams should work as well, requirements dictate a specific aspect ratio.
{% endhint %}

The **Photo** widget allows users to capture images directly from their device's camera. It provides a full-screen camera interface with options to control aspect ratio and orientation, making it ideal for applications that require photo capture in the field.

Captured photos can be stored as physical files on the server or as Base64-encoded buffers. The widget also includes a preview list for all taken photos.

<figure><img src="../../../../.gitbook/assets/Screenshot from 2025-08-11 13-45-19.png" alt=""><figcaption><p>Default view with one photo taken</p></figcaption></figure>

## Data Binding

Connect the widget to your application's logic by dragging the corresponding items from the Backend Builder.

### Input

| **Property** | **Type** | **Description**                                                                                                                                                             |
| ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`images`** | `Array`  | Fired whenever a new photo is taken and saved, or when a photo is deleted. The payload is an array of photo objects. See the **File Object Structure** section for details. |

#### File Object Structure

The structure of the photo objects in the `images` array depends on the configured **Storage Type**.

**If `Storage Type` is `File`:**

```json
{
  "lastModified": 1678886400000,
  "name": "photo-mar-15-2023-120000",
  "type": "image/jpeg",
  "path": "/shared/runtime-files/a1b2c3d4e5.jpeg"
}

```

**If `Storage Type` is `Buffer`:**

```json
{
  "lastModified": 1678886400000,
  "name": "photo-mar-15-2023-120000",
  "type": "image/jpeg",
  "base64": "iVBORw0KGgoAAAANSUhEUgA..."
}

```

## Configuration

### Settings

These properties control the behavior and appearance of the camera and photo management.

| **Label**                    | **Description**                                                                                          | **Type** | **Property**      |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- | -------- | ----------------- |
| **Storage Type**             | Determines how the captured photo is stored: as a physical `File` on the server or as a Base64 `Buffer`. | String   | `storageType`     |
| **Aspect Ratio**             | Sets the aspect ratio of the camera view. `Cover` fills the screen.                                      | String   | `aspectRatio`     |
| **Orientation**              | Sets the camera orientation to `Portrait` or `Landscape`.                                                | String   | `orientation`     |
| **Maximum Number Of Photos** | The total number of photos that can be captured with the widget.                                         | Integer  | `maxPhotos`       |
| **Thumbnail Size**           | Sets the height (in pixels) of the preview thumbnails.                                                   | Number   | `thumbnailHeight` |

### Button Configuration

A button triggers the camera interface. You can customize its appearance using standard button properties. Common properties include:

* **`text`**: The text displayed on the button (e.g., "Take Photo").
* **`icon`**: The icon displayed on the button (e.g., "camera").
* **`type`**: The button's style type (`normal`, `default`, `success`, `danger`).
* **`stylingMode`**: The visual style of the button (`text`, `outlined`, `contained`).
