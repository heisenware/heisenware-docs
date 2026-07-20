# Counter

With a counter, you maintain a numerical value, for example a production count or sequence number. You can increment, decrement, and reset the count. You must create an instance of the counter to use it.

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
      <td><code>name</code></td>
      <td>The unique name for the counter instance.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>initial</code></td>
      <td>The number to start counting from. Defaults to <code>0</code>.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

#### Output

Returns the counter instance.

#### Example

```yaml
# name
production_counter
# initial
10
```

### `increment`

Increments the counter's value by one.

#### Parameters

None.

#### Output

The new, incremented count as an integer.

### `decrement`

Decrements the counter's value by one.

#### Parameters

None.

#### Output

The new, decremented count as an integer.

### `reset`

Resets the counter back to its initial value. You can optionally provide a new initial value to use for this and all future resets.

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

The reset count as an integer.

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

The current count as an integer.
