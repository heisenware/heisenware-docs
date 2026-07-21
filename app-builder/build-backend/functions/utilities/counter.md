# Counter

With a counter, you maintain a numerical value, for example a production count or sequence number. You can increment, decrement, and reset the count. You must create an instance of the counter to use it. The code class name is `Counter`.

### `create`

Creates a new counter instance, optionally starting from an initial value.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>initial</code></td>
      <td>The number to start counting from. Default 0.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

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

Increments the counter's value by one.

#### Parameters

None.

#### Output

Returns the new count as an integer.

### `decrement`

Decrements the counter's value by one.

#### Parameters

None.

#### Output

Returns the new count as an integer.

### `reset`

Resets the counter back to its initial value. You can optionally provide a new initial value to use for this and all future resets. A value of 0 cannot be set as a new initial value; in that case the counter resets to the previously configured initial value.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>initial</code></td>
      <td>An optional new initial value.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

#### Output

Returns nothing.

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

Returns the current count as an integer.
