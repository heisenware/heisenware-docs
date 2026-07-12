# Photo

The photo widget lets users capture images with their device camera. The full-screen camera interface provides direct control over aspect ratio and orientation to support photo capture in the field. The widget stores each photo as a physical file on the server or as a Base64-encoded string, and displays a preview list of captured images.

<figure><img src="../../../../.gitbook/assets/Screenshot from 2025-08-11 13-45-19.png" alt=""><figcaption><p>Default view with one photo taken</p></figcaption></figure>

{% hint style="info" %}
#### Alternative photo capture options
The upload widget also captures photos at higher resolutions since v88. Use the photo widget when you require webcams, smaller image sizes, or specific aspect ratios.
{% endhint %}

## Data binding

### Widget to function input

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `images` | Fires when a user takes, saves, or deletes a photo. The payload carries an array of photo objects. | array |

### Function output or modifier to widget

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `images` | Populates the widget with an existing array of photo objects. | array |
| `isLoading` | Displays a loading indicator when `true`. | boolean |
| `button` | Overrides the capture button configuration at runtime. | object |

### Data formats

The structure of the photo objects inside the `images` array depends on your configured storage type.

**File storage payload**

When `storageType` is set to `file`, the payload provides a server path:
```json
{
  "lastModified": 1678886400000,
  "name": "photo-mar-15-2023-120000",
  "type": "image/jpeg",
  "path": "/shared/runtime-files/a1b2c3d4e5.jpeg"
}
```

**Buffer storage payload**

When `storageType` is set to `buffer`, the payload provides a Base64-encoded string:
```json
{
  "lastModified": 1678886400000,
  "name": "photo-mar-15-2023-120000",
  "type": "image/jpeg",
  "base64": "iVBORw0KGgoAAAANSUhEUgA..."
}
```

## Configuration

Set the widget's defaults in the settings panel.

### General settings

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `storageType` | Storage type | Controls whether the widget stores each photo as a physical file on the server (`file`) or as a Base64 string (`buffer`). | string |
| `aspectRatio` | Aspect ratio | Sets the aspect ratio of the camera view. Use `cover` to fill the available screen area. | string |
| `orientation` | Orientation | Dictates the camera capture orientation, supporting `portrait` or `landscape`. | string |
| `maxPhotos` | Maximum number of photos | Sets the total number of photos the widget can hold. The capture button disables automatically when the list reaches this limit. | integer |
| `resolution` | Resolution | Sets the active camera capture resolution quality, supporting `preview`, `balanced`, `high`, or `original`. | string |
| `thumbnailHeight` | Thumbnail size | Sets the layout height of the preview thumbnails in pixels. | number |

### Button configuration

The widget renders a button to activate the camera interface. Style the default appearance directly in the settings panel, or pass a `button` object to override its properties from backend logic at runtime. The configuration object accepts standard button fields including text, hint, font size, type (`default`, `normal`, `success`, `danger`, `back`), and styling mode (`text`, `contained`, `outlined`).
