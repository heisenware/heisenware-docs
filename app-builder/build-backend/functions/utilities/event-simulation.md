# Event simulation

The event simulation class simulates various events to test and validate workflows. Generating mock events ensures that flows handle different scenarios and edge cases effectively. It also serves as a placeholder in a flow before you complete your App. To learn more about event handlers, see [callbacks](../#callbacks).

This class requires an instance.

### `create`

Constructs a new event simulation instance.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>A unique name for the event simulation instance.</td><td>string</td></tr></tbody></table>

#### Output

Returns the event simulation instance.

#### Example

<figure><img src="../../../../.gitbook/assets/create_instance.png" alt=""><figcaption><p>Create an event simulation instance</p></figcaption></figure>

### `triggerManually`

Triggers a manual event within the instance to activate the `onManualTrigger` listener.

#### Parameters

None.

#### Output

Returns nothing.

### `onManualTrigger`

Fires when you execute the `triggerManually` function within the same instance.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>Callback that executes when the manual event triggers. Payload: a UNIX timestamp integer.</td><td>callback</td></tr></tbody></table>

#### Output

Returns a unique listener ID string.

#### Example

<figure><img src="../../../../.gitbook/assets/image (33).png" alt=""><figcaption><p>The listener outputs the timestamp after a manual trigger</p></figcaption></figure>

### `startAutoTrigger`

Starts generating periodic automatic events at a specified interval.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>interval</code></td><td>The repetition interval in milliseconds.</td><td>integer</td></tr></tbody></table>

#### Output

Returns nothing.

### `onAutoTrigger`

Fires periodically when an automatic trigger is active.

{% hint style="info" %}
#### Initializing the listener

You may need to trigger `onAutoTrigger` once to start reacting to automatically generated events after calling `startAutoTrigger`.
{% endhint %}

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>Callback that executes when the automatic event triggers. Payload: a UNIX timestamp integer.</td><td>callback</td></tr></tbody></table>

#### Output

Returns a unique listener ID string.

#### Example

<figure><img src="../../../../.gitbook/assets/image (34).png" alt=""><figcaption><p>React periodically to automatic events</p></figcaption></figure>

### `stopAutoTrigger`

Stops the active automatic trigger and halts periodic event generation.

#### Parameters

None.

#### Output

Returns nothing.

#### Example

<figure><img src="../../../../.gitbook/assets/stopautotrigger.png" alt=""><figcaption><p>Stop event generation</p></figcaption></figure>

### `triggerCallback`

Triggers an event that executes its own callback after a specified delay. To prevent infinite loops, the function does not react to the output of its own callback.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>timeout</code></td><td>The delay duration in milliseconds before the callback executes.</td><td>integer</td></tr><tr><td><code>listener</code></td><td>Callback that executes after the timeout delay. Payload: <code>&#x3C;callback></code>.</td><td>callback</td></tr></tbody></table>

#### Output

Returns nothing.

#### Example

<figure><img src="../../../../.gitbook/assets/triggerCallback.png" alt=""><figcaption><p>Callback execution after a timeout delay</p></figcaption></figure>

### `delete`

Removes the instance and clears its configuration.

{% hint style="danger" %}
#### Irreversible action

Deleting an instance removes its configuration permanently.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` upon removal.

#### Example

<figure><img src="../../../../.gitbook/assets/delete_instance.png" alt=""><figcaption><p>Delete an event simulation instance</p></figcaption></figure>
