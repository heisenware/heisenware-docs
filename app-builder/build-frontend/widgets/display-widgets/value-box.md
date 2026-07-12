# Value box

The value box widget displays a standalone piece of data. It automatically visualizes text strings, numbers, booleans, complex data structures, or Base64 images in your Apps.

<div><figure><img src="../../../../.gitbook/assets/Screenshot 2024-09-24 at 10.32.06.png" alt="" width="239"><figcaption><p>A value box</p></figcaption></figure> <figure><img src="../../../../.gitbook/assets/Screenshot 2024-09-24 at 11.51.56.png" alt="" width="216"><figcaption><p>A value box displaying an object</p></figcaption></figure></div>

## Data binding

### Function output or modifier to widget

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `value` | Supplies the data payload to be displayed on the widget canvas. | string \| number \| boolean \| object |
| `clear` | Clears the currently displayed value layout when set to `true`. | boolean |
| `textColor` | Programmatically overrides the configured text color property at runtime. | string |

### Widget to function input

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `onClick` | Fires when a user clicks the value box container. The payload carries the current underlying data value. | string \| number \| boolean \| object |

### Data formats

The widget inspects the incoming data type of the `value` property and adaptively switches its rendering style:

* **Booleans:** Renders directly as the text string `"true"` or `"false"`.
* **Objects:** Displays inside an interactive, collapsible JSON tree viewer component.
* **Base64 images:** Strings beginning with standard PNG (`iVBORw0KGgo`), JPEG (`/9j/`), or SVG (`PD94bWwgdm`) headers automatically render as visual images scaling to the container boundary.
* **Multiline strings:** Text blocks containing explicit line breaks (`
`) split automatically into separate paragraph rows, applying any configured prefix or suffix tokens to each separate line.
* **Non-serializable data:** Tokens matching `__vrpc::not-serializable__` display as `[skipped]`.

## Configuration

Set the widget's defaults in the settings panel.

### General settings

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `placeholder` | Placeholder | Italicized text string displayed in gray characters when the bound value is null or undefined. | string |
| `format` | Format | Specifies the formatting mask rule applied to numeric measurements or valid date strings. | string |
| `prefix` | Prefix | Text string prepended directly to the front of the displayed value. | string |
| `suffix` | Suffix | Text string appended directly to the trailing end of the displayed value. | string |
| `color` | Text color | Sets the fallback color of the displayed characters. Defaults to the global workspace theme text color when gray. | string |
| `fontSize` | Font size | Sets the size of the text characters in pixels. | integer \| string |
| `fontWeight` | Font weight | Sets the typographical font thickness weight parameter (such as normal, bold, or explicit thickness numbers). | string \| integer |
| `justifyContent` | Horizontal alignment | Aligns the text content horizontally within the container canvas (options include `left`, `center`, or `right`). | string |
| `alignItems` | Vertical alignment | Aligns the text content vertically within the container canvas (options include `top`, `middle`, or `bottom`). | string |
| `width` | Width | Sets the total outer width layout dimension of the widget container block. | string \| number |
| `height` | Height | Sets the total outer height layout dimension of the widget container block. | string \| number |
