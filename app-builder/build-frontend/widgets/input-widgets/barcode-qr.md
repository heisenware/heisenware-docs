# Barcode / QR

The barcode / QR widget uses a device's built-in camera to scan and decode various barcode formats, such as QR codes and traditional product bar codes. It opens an interactive full-screen camera view directly in your Apps to capture logistical or inventory data fast.

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-06-10 at 16.15.06.png" alt=""><figcaption><p>The barcode / QR scanner button in the UI</p></figcaption></figure>

## Data binding

### Widget to function input

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `text` | Fires whenever the camera successfully decodes a barcode. The payload type depends on your configured scan mode. | string \| array |

### Function output or modifier to widget

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `clear` | Clears any scanned values currently held in memory when a true signal is received. | boolean |
| `scanMode` | Overrides the operational scan mode property dynamically at runtime (options include `single` or `multiple`). | string |
| `button` | Passes a structured configuration object to change button text labels, visual styles, or disabled states from backend logic. | object |

### Data formats

The structure of the data output emitted by the `text` property shifts automatically based on your active scanning configuration.

**Single scan mode output**

When scan mode is configured as `single`, the widget captures a single code, outputs it as a plain text string block, and immediately terminates the camera session:
`"7501030491234"`

**Multiple scan mode output**

When scan mode is configured as `multiple`, the user can scan numerous items continuously without closing the viewfinder. Clicking the confirm checkmark button outputs all collected items as a clean array of unique strings:
```json
[
  "7501030491234",
  "9780593135822",
  "049000028904"
]
```

## Configuration

Set the widget's defaults in the settings panel. Since the activation button is the only permanently visible element on the page layout, most settings define its design.

### General settings

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `scanMode` | Scan mode | Sets whether the camera interface captures a `single` item and closes, or collects `multiple` items continuously. | string |
| `width` | Width | Sets the external layout width dimension of the scan button container. | string \| number |
| `height` | Height | Sets the external layout height dimension of the scan button container. | string \| number |

### Button styling settings

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `text` | Button text | The main text label displayed inside the scan button body. | string |
| `icon` | Icon | The font icon class rendered next to the text label inside the button framework. | string |
| `fontSize` | Text size | The typographical font size of the button's text label. | integer |
| `iconSize` | Icon size | The visual display text size of the button's icon class. | integer |
| `type` | Button type | Sets the contextual theme color layout of the button frame (options include `default`, `normal`, `success`, `danger`, or `back`). | string |
| `stylingMode` | Styling mode | Sets the visual frame style variant of the button (options include `contained`, `outlined`, or `text`). | string |
| `hint` | Hover text | Tooltip text content revealed when a cursor hovers directly over the button area. | string |
| `disabled` | Initially disabled | Checks whether the button is disabled and unclickable when the page layout first instantiates. | boolean |

### Button object schema

When bypassing default panel properties by binding a custom runtime payload to the `button` property slot, use the following structural key configuration:

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `text` | Overrides the display text label printed on the button frame. | string |
| `fontSize` | Overrides the typographical font size of the label text. | integer |
| `iconSize` | Overrides the visual icon scale size inside the button frame. | integer |
| `type` | Overrides the button theme color layout selection. | string |
| `stylingMode` | Overrides the frame visual border fill variant. | string |
| `disabled` | Toggles whether user click interaction with the scan button is locked or unlocked. | boolean |

## Tips and tricks

{% hint style="info" %}
#### Viewfinder rendering overlays and hardware haptics
When active, the camera interface generates a black modal overlay layout directly attached via portals to the application viewport base layer, rendering on top of all other elements. If you have multiple camera lenses available on your hardware, use the interactive camera rotation icon inside this overlay framework to toggle between available feeds.

Every successful code collection triggers a short haptic device vibration pulse (`200ms`) automatically to confirm registration without requiring screen inspection.
{% endhint %}
