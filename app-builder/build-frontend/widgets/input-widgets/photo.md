# Photo

The photo widget lets users capture images with their device camera. Its full-screen camera interface gives control over aspect ratio and orientation, ideal for photo capture in the field. It stores each photo as a physical file on the server or as a Base64-encoded buffer, and shows a preview list of everything taken.

<figure><img src="../../../../.gitbook/assets/Screenshot from 2025-08-11 13-45-19.png" alt=""><figcaption><p>Default view with one photo taken</p></figcaption></figure>

{% hint style="info" %}
Since [v88 — Almost forever](../../../../release-notes/v88-almost-forever.md), the [upload widget](upload.md) can take photos too, at a much higher resolution than this widget. The photo widget is still the better fit when smaller images are fine, when webcams need to work, or when you require a specific aspect ratio.
{% endhint %}

## Data binding

### Widget to function input

| Property | Description                                                                                                                                                               | Type  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| `images` | Fires whenever a photo is taken and saved, or deleted. The payload is an array of photo objects. See [file object structure](photo.md#file-object-structure) for details. | array |

### Function output or modifier to widget

| Property    | Description                                                                                                                  | Type    |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- | ------- |
| `isLoading` | When `true`, shows a loading indicator, useful during data fetching.                                                         | boolean |
| `button`    | Overrides the capture button at runtime. Takes a `button` object; see [button configuration](photo.md#button-configuration). | object  |

#### File object structure

The structure of the photo objects in the `images` array depends on the `storageType` setting.

**If `storageType` is `file`:**

```json
{
  "lastModified": 1678886400000,
  "name": "photo-mar-15-2023-120000",
  "type": "image/jpeg",
  "path": "/shared/runtime-files/a1b2c3d4e5.jpeg"
}
```

**If `storageType` is `buffer`:**

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

| Property          | Label                    | Description                                                                                        | Type    |
| ----------------- | ------------------------ | -------------------------------------------------------------------------------------------------- | ------- |
| `storageType`     | Storage type             | How each photo is stored: as a physical file on the server (`file`) or a Base64 string (`buffer`). | string  |
| `aspectRatio`     | Aspect ratio             | The aspect ratio of the camera view. `cover` fills the screen.                                     | string  |
| `orientation`     | Orientation              | The camera orientation, `portrait` or `landscape`.                                                 | string  |
| `maxPhotos`       | Maximum number of photos | The total number of photos the widget captures.                                                    | integer |
| `resolution`      | Resolution               | The capture resolution: `preview`, `balanced`, `high`, or `original`.                              | string  |
| `thumbnailHeight` | Thumbnail size           | The height (in pixels) of the preview thumbnails.                                                  | number  |

### Button configuration

A button triggers the camera. Style its defaults in the settings panel, or bind a `button` object to override it from backend logic at runtime. The object accepts standard button properties, most commonly `text`, `hint`, `fontSize`, `type` (`default`, `normal`, `success`, `danger`, `back`), and `stylingMode` (`text`, `contained`, `outlined`).
