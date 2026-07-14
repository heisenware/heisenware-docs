# Counter

The counter class manages a numerical value, such as a production count or sequence number. Increment, decrement, or reset the count as needed. This class requires an instance.

### `create`

Constructs a new counter instance.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>initial</code></td><td>The starting number for the count. Default 0.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the counter instance.

### `increment`

Increments the counter value by one.

#### Parameters

None.

#### Output

Returns the new, incremented count as an integer.

### `decrement`

Decrements the counter value by one.

#### Parameters

None.

#### Output

Returns the new, decremented count as an integer.

### `reset`

Resets the counter back to its initial value.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>initial</code></td><td>An optional new initial value for this and subsequent resets.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the reset count as an integer.

### `getCount`

Retrieves the current value of the counter.

#### Parameters

None.

#### Output

Returns the current count as an integer.
