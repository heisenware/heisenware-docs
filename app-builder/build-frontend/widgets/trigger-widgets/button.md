# Button

The button widget is a fundamental element in any user interface. Its primary function is to capture a user click to trigger your backend logic. Beyond this, a button appearance can be dynamically changed to provide visual feedback to the user.

## Data Bindings

Connect the widget to your application logic by dragging the corresponding items from the Flow Builder.

### Widget to logic

This describes the events the button sends to your backend logic.

<table><thead><tr><th width="171.7139892578125">Property</th><th width="177.5711669921875">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>onClick</code></td><td><code>Event</code> / <code>String</code></td><td>Fires when the user clicks the button. Connect it to a function trigger to start a process, or connect it to a function input to pass the button text to your logic.</td></tr></tbody></table>

### Logic to widget

This describes the properties you can control from your backend logic.

<table><thead><tr><th width="140.42822265625">Property</th><th width="126.8575439453125">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>disable</code></td><td><code>Boolean</code></td><td>When <code>true</code>, disables the button and prevents clicks.</td></tr><tr><td><code>enable</code></td><td><code>Boolean</code></td><td>When <code>true</code>, enables the button. Use this to re-enable a button that was set to <code>initially disabled</code> in its <a href="button.md#configuration">settings</a>.</td></tr><tr><td><code>toggle</code></td><td><code>Boolean</code></td><td>Toggles the button state between enabled and disabled based on a <code>true</code> or <code>false</code> input.</td></tr><tr><td><code>done</code></td><td><code>Any</code></td><td>Connect the output of a long-running function to this property to show a loading indicator on the button. The indicator disappears when the function provides an output.</td></tr></tbody></table>

## Configuration

Double-click a button in the UI preview or select the button and click the edit icon to access its configuration settings.

<table><thead><tr><th width="165.57177734375">Setting</th><th width="387.42822265625">Description</th><th>Property</th></tr></thead><tbody><tr><td>Text</td><td>The text label displayed on the button.</td><td><code>text</code></td></tr><tr><td>Icon</td><td>Adds an icon to the left of the text.</td><td><code>icon</code></td></tr><tr><td>Text Size</td><td>Changes the size of the text.</td><td><code>textSize</code></td></tr><tr><td>Icon Size</td><td>Changes the size of the icon.</td><td><code>iconSize</code></td></tr><tr><td>Type</td><td>Sets the button color scheme based on the app theme. Options include <code>default</code>, <code>normal</code>, <code>success</code>, <code>danger</code>, <code>back</code>, and <code>transparent</code>.</td><td><code>type</code></td></tr><tr><td>Styling Mode</td><td>Adjusts the visual style of the button. Options include <code>text</code>, <code>contained</code>, and <code>outlined</code>.</td><td><code>style</code></td></tr><tr><td>Hover Text</td><td>Adds a tooltip that appears when the user hovers over the button.</td><td><code>hoverText</code></td></tr><tr><td>Initially Disabled</td><td>If <code>true</code>, the button is disabled when the app first loads.</td><td><code>initiallyDisabled</code></td></tr><tr><td>Requires Confirmation</td><td>If <code>true</code>, opens a confirmation popup on click. You can adjust the title and text of the dialogue. The user can choose to answer with yes or no.</td><td></td></tr></tbody></table>

{% hint style="info" %}
### Making specific UI areas clickable

You can use transparent buttons to collect clicks in specific areas of your interface and pass information to your logic. This is useful for building interactive visual maps.

For example, you can upload an image of your shopfloor and place a transparent button over a specific machine. Set the button text to the machine ID. Because the button type is set to transparent, the text remains hidden. When a user clicks the machine on the image, the button passes the machine ID to your logic via the `onClick` event. You can use this ID to perform further actions, such as navigating to a detail page and filtering the data for that specific machine.
{% endhint %}
