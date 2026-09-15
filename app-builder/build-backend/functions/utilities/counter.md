# Counter

With a counter, you maintain a numerical value, for example a production count or sequence number. You can increment, decrement, set, and reset the count, and react to every change with `onChange`. You must create an instance of the counter to use it. The code class name is `Counter`.

### `create`

Creates a new counter instance, optionally starting from an initial value.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>initial</code></td><td>The number to start counting from and to reset to. Default 0.</td><td>number</td></tr></tbody></table>

#### Output

Returns the name of the created instance.

#### Example

```yaml
# initial
10
```

### `delete`

Deletes a counter instance.

#### Parameters

None.

#### Output

Returns `true` upon removal.

{% hint style="danger" %}
#### Irreversible action
Deleting removes the instance configuration.
{% endhint %}

### `increment`

Adds a step to the count.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>step</code></td><td>The amount to add. Default 1.</td><td>number</td></tr></tbody></table>

#### Output

Returns the new count as a number.

### `decrement`

Subtracts a step from the count.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>step</code></td><td>The amount to subtract. Default 1.</td><td>number</td></tr></tbody></table>

#### Output

Returns the new count as a number.

### `setCount`

Sets the count to a value.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>count</code></td><td>The new count.</td><td>number</td></tr></tbody></table>

#### Output

Returns the new count as a number.

### `reset`

Resets the counter back to its initial value. You can optionally provide a new initial value, including 0, to use for this and all future resets.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>initial</code></td><td>An optional new initial value.</td><td>number</td></tr></tbody></table>

#### Output

Returns the count after the reset as a number.

#### Example

```yaml
# initial
100
```

### `getCount`

Retrieves the current value of the counter.

#### Parameters

None.

#### Output

Returns the current count as a number.

## Event listeners

### `onChange`

Subscribes to the `change` event. The callback runs whenever the count changes through `increment`, `decrement`, `setCount`, or `reset`. A call that leaves the count as it was is silent.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback function. <br>Payload: <code>count</code>, the count after the change, and <code>previous</code>, the count before it.</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed`.

### `offChange`

Removes a listener given to `onChange`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The listener to remove.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `true` when the listener was subscribed, otherwise `false`.
