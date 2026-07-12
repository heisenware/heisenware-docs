# Upload

The upload widget handles file and photo uploads. Users select one or more files from their local storage or capture images directly using their device camera. The widget stores each item as a physical file on the server or as a Base64-encoded string, and displays an interactive preview list of all uploaded items.

<figure><img src="../../../../.gitbook/assets/upload_bottom.png" alt=""><figcaption><p>A full and an empty upload widget</p></figcaption></figure>

## Data binding

### Widget to function input

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `files` | Fires when a user uploads or deletes a file. The payload carries an array of file objects. | array |

### Function output or modifier to widget

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `files` | Populates the widget with an existing array of file objects. | array |
| `clear` | Clears all uploaded files from the widget interface when `true`. | boolean |
| `isLoading` | Displays a loading indicator when `true`. | boolean |
| `button` | Overrides the upload button configuration at runtime. | object |

### Data formats

The structure of the file objects inside the `files` array depends on your configured storage type.

**File storage payload**

When `storageType` is set to `file`, the payload provides a server path:
```json
{
  "lastModified": 1678886400000,
  "name": "document.pdf",
  "size": 102400,
  "type": "application/pdf",
  "path": "/shared/runtime-files/a1b2c3d4e5.pdf"
}
```

**Buffer storage payload**

When `storageType` is set to `buffer`, the payload provides a Base64-encoded string:
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

Set the widget's defaults in the settings panel.

### General settings

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `storageType` | Storage type | Controls whether the widget stores each file as a physical file on the server (`file`) or as a Base64 string (`buffer`). | string |
| `multiple` | Allow multi-file upload | Allows users to select and upload several files simultaneously when `true`. Live camera captures via the photo category still execute one image at a time. | boolean |
| `showThumbnails` | Show thumbnails | Displays a preview thumbnail layout for uploaded image files when `true`. | boolean |
| `thumbnailHeight` | Thumbnail size | Sets the layout height of the preview thumbnails in pixels. | number |

### Restriction settings

Configure these validation and processing behaviors inside the restrictions property group.

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `accept` | Restrict file types | Specifies the allowed file categories for upload. Supported categories include text, documents, spreadsheets, presentations, images, audio, video, archives, web, or photo. | array |
| `maxFiles` | Maximum number of files | Sets the total number of files the widget can hold. The interface automatically disables the upload controls when reaching this limit. | integer |
| `aspectRatio` | Aspect ratio | Enforces a specific crop aspect ratio on image captures taken via the live camera when the photo category is active. | number or string |
| `resolution` | Resolution | Adjusts the target resolution quality optimization for image captures taken via the live camera, supporting `preview`, `balanced`, `high`, or `original`. | string |

#### Allowed file categories and extensions

The `accept` configuration limits user selections to the following mapped extensions:
* **Text**: `.txt`, `.md`
* **Documents**: `.doc`, `.docx`, `.pdf`, `.rtf`, `.odt`
* **Spreadsheets**: `.xls`, `.xlsx`, `.ods`, `.csv`
* **Presentations**: `.ppt`, `.pptx`, `.odp`
* **Images**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.tiff`, `.svg`, `.webp`, `.heic`, `.heif`
* **Audio**: `.mp3`, `.wav`, `.flac`, `.aac`, `.ogg`, `.wma`
* **Video**: `.mp4`, `.avi`, `.mov`, `.wmv`, `.mkv`, `.flv`
* **Archives**: `.zip`, `.rar`, `.7z`, `.tar`, `.gz`, `.iso`
* **Web**: `.html`, `.htm`, `.css`, `.js`, `.json`, `.xml`, `.yml`
* **Photo**: Activates direct live camera capture interfaces.

{% hint style="info" %}
#### Device-specific responsive upload modes
The widget dynamically adjusts its layout buttons based on the user's operating system and your selected file categories. 

On desktop interfaces, it exclusively uses the standard file picker interface. On mobile or tablet devices, selecting only the `Photo` category activates a single camera launch button. Selecting a mix of file categories and `Photo` splits the interface into a two-button layout group, allowing users to choose between picking a file or snapping a photo.
{% endhint %}

### Button configuration

Style the default button appearance directly in the settings panel, or pass a `button` object to override its properties from backend logic at runtime.

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `text` | Sets the button text string label. | string |
| `hint` | Sets the tooltip hover text string. | string |
| `fontSize` | Sets the size of the button text in pixels. | integer |
| `type` | Sets the color style classification, supporting `default`, `normal`, `success`, `danger`, or `back`. | string |
| `stylingMode` | Sets the background container rendering type, supporting `text`, `contained`, or `outlined`. | string |
