# Signature

The signature widget captures handwritten signatures as image data. It displays an interactive popup drawing pad that saves user drawings as Base64-encoded strings in your Apps.

<figure><img src="../../../../.gitbook/assets/Signature.gif" alt=""><figcaption></figcaption></figure>

## Data binding

### Widget to function input

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `signature` | Fires when the user clicks the accept button to confirm their signature. The payload carries the signature data block. | string |

### Data formats

The widget extracts drawing coordinates from the pad canvas and outputs them as a clean, compressed image string.

**Signature payload**
The payload returns a raw Base64-encoded PNG string, stripped of the standard browser `data:image/png;base64,` schema prefix for direct compatibility with backend file processing blocks:
`"iVBORw0KGgoAAAANSUhEUgAAAZAAAADICAQAA..."`

## Configuration

Set the widget's defaults in the settings panel.

### General settings

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `displayMode` | Display mode | Controls the display architecture of the pad layout. Currently supports `popup` mode to render an activation button on the page. | string |
| `buttonText` | Button text | The text label printed on the main widget activation button when display mode is set to popup. | string |
| `acceptText` | Accept text | The text label printed on the signature validation button inside the popup frame. | string |
| `clearText` | Clear text | The text label printed on the pad clearing button inside the popup frame. | string |
| `penColor` | Pen color | Sets the ink trace stroke color on the sketch area. Defaults to the global theme text color when gray. | string |
| `padColor` | Pad color | Sets the solid background color of the drawing canvas area. | string |
| `width` | Width | Sets the layout width dimension of the activation button in pixels. | integer |
| `height` | Height | Sets the layout height dimension of the activation button in pixels. | integer |

## Tips and tricks

{% hint style="info" %}
#### Display layout limitations and drawing bounds
The current version of the widget requires the display mode parameter configured strictly as `popup`. Setting this value to inline prevents the workspace frame from rendering entirely.

While the activation button respects your configured height and width options, the pop-up drawing pad automatically enforces a fixed, clear bounds of 400x200 pixels to optimize touch responsiveness across mobile and desktop interfaces.
{% endhint %}
