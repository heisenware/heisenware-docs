# Image

The image widget shows a static picture from the media library. It is not in the widget palette: drop a file from the media library onto the canvas and the widget appears at the file's natural size, scaled down to fit the screen. The Heisenware Assistant places it the same way with a media-library path.

The box is the frame. Resizing the box never distorts the picture: by default the whole image is shown inside the box (`contain`), and you choose how it meets the edges.

## Data binding

### Media library to widget

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `path` | The media-library path of the image, set by dropping a file onto the widget. | string |

### Widget to function

| **Property** | **Description** |
| :--- | :--- |
| `onClick` | Triggers the linked function, or switches to the linked page, when the image is clicked. |

## Configuration

Set the widget's defaults in the settings panel.

### Data binding

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `staticData` | Path | The media-library path of the image, e.g. `/shared/uploads/logo.png`. | string |
| `alt` | Alternative text | What the picture shows, read by screen readers and shown when the file is missing. | string |

### Look & feel

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `objectFit` | Image fitting | How the image meets its box: `contain` (whole image, bars if needed - the default), `cover` (fill the box, crop the rest), `fill` (stretch), `none` (natural size, clipped) or `scale-down` (never enlarge). | string |
| `objectPosition` | Focal point | Which part of the image stays visible when `cover` or `none` crops it: `center`, `top`, `bottom`, `left`, `right` or a corner. | string |
| `borderRadius` | Corner radius | `theme` (the app theme's radius), a preset from square to circle, or any CSS length. The same setting as on the card and media view widgets. | string |
| `backgroundColor` | Background color | The color behind the image, visible as bars when `contain` leaves space. `auto` takes the theme's tile color. | string |
