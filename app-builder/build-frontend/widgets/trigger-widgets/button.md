# Button

The button widget captures a user click and triggers your backend logic. You can also drive its appearance and state from logic to give the user visual feedback.

## Data binding

### Function trigger to button

Connect a function's trigger to the button so a click starts the function. Only the click is sent, no data. You can also connect `onClick` to a function input to pass the button's text into your logic.

| Property  | Description                                                                                                                                | Type            |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `onClick` | Fires when the user clicks the button. Connect it to a function trigger to start a process, or to a function input to pass the button text. | event or string |

### Function output to widget

State and appearance you drive from backend logic. The button's visual properties (`text`, `icon`, `fontSize`, `iconSize`, `type`, `stylingMode`, `hint`) are also bindable, so you can restyle it at runtime.

| Property  | Description                                                                                                                | Type    |
| --------- | ------------------------------------------------------------------------------------------------------------------------- | ------- |
| `disable` | When `true`, disables the button and prevents clicks.                                                                     | boolean |
| `enable`  | When `true`, enables the button. Use this to re-enable a button that starts disabled in its [settings](#configuration).   | boolean |
| `toggle`  | Enables or disables the button based on a `true` or `false` input.                                                        | boolean |
| `done`    | Connect a long-running function's output here to show a loading indicator on the button. It clears when the function returns an output. | any |

## Configuration

Double-click a button in the UI preview, or select it and click the edit icon, to open its settings.

| Property               | Label                 | Description                                                                                          | Type    |
| ---------------------- | --------------------- | --------------------------------------------------------------------------------------------------- | ------- |
| `text`                 | Text                  | The text label on the button.                                                                       | string  |
| `icon`                 | Icon                  | Adds an icon to the left of the text.                                                                | string  |
| `fontSize`             | Text size             | The size of the text.                                                                                | integer |
| `iconSize`             | Icon size             | The size of the icon.                                                                                | integer |
| `type`                 | Type                  | The button color scheme, based on the App theme (`default`, `normal`, `success`, `danger`, `back`, `transparent`). | string |
| `stylingMode`          | Styling mode          | The visual style (`text`, `contained`, `outlined`).                                                 | string  |
| `hint`                 | Hover text            | A tooltip shown when the user hovers over the button.                                               | string  |
| `disabled`             | Initially disabled    | If `true`, the button starts disabled when the App loads.                                            | boolean |
| `requiresConfirmation` | Requires confirmation | If `true`, a click opens a confirmation dialog before the button acts.                               | boolean |
| `confirmationTitle`    | Confirmation title    | The title of the confirmation dialog.                                                               | string  |
| `confirmationText`     | Confirmation text     | The message in the confirmation dialog.                                                             | string  |
| `reload`               | Reload                | If `true`, clicking the button reloads the App.                                                     | boolean |

{% hint style="info" %}
#### Making specific UI areas clickable

Use transparent buttons to collect clicks on specific areas of your interface and pass information to your logic, handy for building interactive visual maps.

For example, upload an image of your shopfloor and place a transparent button over a machine. Set the button text to the machine ID. Because the type is `transparent`, the text stays hidden. When a user clicks the machine, the button passes the ID to your logic via `onClick`. You can then act on it, such as navigating to a detail page filtered for that machine.
{% endhint %}
