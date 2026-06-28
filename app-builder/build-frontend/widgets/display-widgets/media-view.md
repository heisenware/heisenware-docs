# Media View

The **MediaView** widget is a versatile component designed to display various types of media, including images (PNG, JPEG, GIF, SVG) and PDF documents.

It can intelligently handle different data formats, such as Base64 strings, file objects, or direct URLs, making it a flexible solution for rendering visual content within your application.

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-09-27 at 15.22.56.png" alt="" width="264"><figcaption></figcaption></figure>

## Data Binding

Connect the widget to your application's logic by dragging the corresponding items from the Backend Builder.

### Output

| **Property** | **Type**             | **Description**                                                                           |
| ------------ | -------------------- | ----------------------------------------------------------------------------------------- |
| **`data`**   | `String` or `Object` | Provides the media content to be displayed. See the **Data Formats** section for details. |
| **`clear`**  | `Boolean`            | When `true`, clears the currently displayed media.                                        |

#### Data Formats

The `data` property is highly flexible and can interpret several formats to render media:

* **Base64 String:** A raw Base64-encoded string. The widget will automatically detect the MIME type (e.g., `image/png`, `application/pdf`).
* **File Base64 Object:** An object containing `base64` and `type` properties (e.g., `{ base64: '...', type: 'image/jpeg' }`).
* **File Path Object:** An object containing `path` and `type` properties, pointing to a file on the Heisenware media server.
* **Media Server Path:** A direct string path to a file on the media server (e.g., `/shared/runtime-files/image.png`).
* **URL:** A direct public URL to an image or PDF file.

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-09-27 at 15.26.29.png" alt=""><figcaption><p>A function with an image connected to the Media View. The modifier retrieves the content of the output array.</p></figcaption></figure>

<figure><img src="../../../../.gitbook/assets/image (431).png" alt=""><figcaption><p>Dragging a file from the media server into memory and using it as is also works</p></figcaption></figure>

## Configuration

### Settings

These properties control how the media is displayed within the widget's boundaries.

| **Label**             | **Description**                                                                                                                                                                      | **Type** | **Property**   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | -------------- |
| **Image Fitting**     | Controls how the image should be resized to fit its container. `Contain` fits the entire image, `Cover` fills the container (cropping if necessary), and `Fill` stretches the image. | String   | `objectFit`    |
| **Rounded Corners %** | Applies a border radius to the media, making the corners rounded. The value is a percentage of the smaller dimension.                                                                | Integer  | `borderRadius` |
