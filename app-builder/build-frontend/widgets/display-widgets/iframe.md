# Iframe

The iframe widget embeds external websites or web applications directly into your App using a URL. It displays the external web content live within a frame in your App.

## Data binding

### Function output to widget

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `src` | The URL of the website or web asset to load inside the frame. Must use a valid `http:` or `https:` protocol. | string |
| `showBorder` | Toggles the 1px gray border around the frame. | boolean |
| `height` | Sets the vertical height of the frame. | string |

## Configuration

Set the widget's defaults in the settings panel.

### Settings

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `src` | URL | The URL of the website or web page to embed. | string |
| `showBorder` | Show border | Displays a thin border around the frame when enabled. | boolean |
| `height` | Height | The frame height, supporting CSS units like percentage or pixels (defaults to `100%`). | string |
