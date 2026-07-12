# Button

The button widget captures a user click to trigger backend logic. You can also drive its appearance and operational state from your logic to provide live visual feedback.

## Data binding

### Widget to function trigger

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `onClick` | Fires when a user clicks the button to start a backend process. Sends a pure trigger with no accompanying data payload. | trigger |

### Widget to function input

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `onClick` | Fires when a user clicks the button and passes the configured button text string directly into a function input. | string |

### Function output or modifier to widget

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `disable` | Disables the button and prevents user interactions when `true`. | boolean |
| `enable` | Enables the button when `true`. Use this to re-enable a button that starts as initially disabled. | boolean |
| `toggle` | Dynamically enables or disables the button based on the incoming boolean value. | boolean |
| `done` | Displays an active loading indicator on the button when connected to a running function. The loading state clears automatically when the function returns its output. | any |

## Configuration

Set the widget's defaults in the settings panel.

### General settings

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `text` | Text | Sets the text label displayed on the button. | string |
| `icon` | Icon | Adds a visual icon to the left of the button text. | string |
| `fontSize` | Text size | Sets the font size of the button text label in pixels. | integer |
| `iconSize` | Icon size | Sets the layout size of the button icon in pixels. | integer |
| `type` | Type | Controls the button color scheme configuration based on the theme, supporting `default`, `normal`, `success`, `danger`, `back`, or `transparent`. | string |
| `stylingMode` | Styling mode | Controls the visual container rendering style, supporting `text`, `contained`, or `outlined`. | string |
| `hint` | Hover text | Sets the tooltip text displayed when a user hovers over the button. | string |
| `disabled` | Initially disabled | Disables the button when the App first loads when set to `true`. | boolean |
| `requiresConfirmation` | Requires confirmation | Opens an interactive confirmation modal dialog before executing actions when set to `true`. | boolean |
| `confirmationTitle` | Confirmation title | Sets the title text displayed on the confirmation modal dialog. | string |
| `confirmationText` | Confirmation text | Sets the main description message displayed inside the confirmation modal dialog. | string |
| `reload` | Reload | Reloads the active App automatically upon a user click when set to `true`. | boolean |
| `width` | Width | Sets the layout width dimension of the button in pixels. | integer |
| `height` | Height | Sets the layout height dimension of the button in pixels. | integer |

## Tips and tricks

{% hint style="info" %}
#### Making specific user interface areas clickable
Use transparent buttons to capture user clicks on specific areas of your layout and pass contextual information directly into your logic. This configuration lets you build interactive visual maps.

For example, upload an image of your shopfloor and position a transparent button over a specific machine asset. Set the button text to match the unique machine asset ID. Selecting the `transparent` type keeps the text completely hidden from the view. When a user clicks that area of the image, the button passes the ID into your logic via the `onClick` property to execute filtered data navigation or page routing.
{% endhint %}
