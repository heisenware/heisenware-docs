# Signature

The signature widget provides a canvas for capturing handwritten signatures. It appears either as an inline pad or as a popup window that a button opens.

It suits forms and documents that need user authorization, such as contracts, agreements, or delivery confirmations. Heisenware saves the captured signature as a PNG image.

<figure><img src="../../../../.gitbook/assets/Signature.gif" alt=""><figcaption></figcaption></figure>

## Data binding

### Widget to function input

| **Property**    | **Description**                                                                                                                                                        | **Type** |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `signature` | Fires when the user accepts a signature. The payload is a Base64-encoded string of the signature as a PNG image, without the `data:image/png;base64,` prefix.          | `String` |

## Configuration

### Settings

| Property      | Label        | Description                                                                                           | Type           |
| ------------- | ------------ | ---------------------------------------------------------------------------------------------------- | -------------- |
| `penColor`    | Pen color    | The color of the signature ink.                                                                      | string (color) |
| `padColor`    | Pad color    | The background color of the signature pad.                                                            | string (color) |
| `displayMode` | Display mode | How the pad shows: `inline` on the page, or `popup` as a button that opens the pad in a popup window. | string         |
| `acceptText`  | Accept text  | The text on the confirm-and-save button.                                                             | string         |
| `clearText`   | Clear text   | The text on the clear button.                                                                        | string         |
| `buttonText`  | Button text  | The text on the main button when display mode is `popup`.                                             | string         |
| `width`       | Width        | The width of the signature pad in pixels.                                                            | integer        |
| `height`      | Height       | The height of the signature pad in pixels.                                                           | integer        |
