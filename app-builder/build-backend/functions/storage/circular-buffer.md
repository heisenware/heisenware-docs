# Circular buffer

The circular buffer class implements a fixed-size ring buffer structure where elements connect end-to-end. When the buffer reaches capacity, new items overwrite the oldest entries. Use this class for streaming data where only the most recent values matter, such as maintaining the last 100 data points for a live chart widget.

Data remains in memory only and does not persist to disk. This class requires an instance. The code class name is `CircularBuffer`.

### `create`

Creates a new circular buffer instance with a specified capacity.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>capacity</code></td><td>The maximum number of items the buffer can hold. Default 100.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the circular buffer instance.

#### Examples

```yaml
# capacity
10
```

### `pushBack`

Adds an item to the back of the buffer. If the buffer is full, the item at the front is overwritten.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The value or object to add.</td><td>any</td></tr></tbody></table>

#### Output

Returns nothing.

#### Examples

```yaml
# value
Another new item
```

### `pushFront`

Adds an item to the front of the buffer. If the buffer is full, the item at the back is overwritten.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The value or object to add.</td><td>any</td></tr></tbody></table>

#### Output

Returns nothing.

### `popFront`

Removes and returns the item from the front of the buffer.

#### Parameters

None.

#### Output

Returns the removed value or object.

### `popBack`

Removes and returns the item from the back of the buffer.

#### Parameters

None.

#### Output

Returns the removed value or object.

### `getBuffer`

Returns all items currently inside the buffer as a standard array, ordered from front to back.

#### Parameters

None.

#### Output

Returns an array containing all stored values.

### `getSize`

Returns the current number of items stored in the buffer.

#### Parameters

None.

#### Output

Returns the current item count as an integer.

### `getCapacity`

Returns the maximum number of items the buffer can hold.

#### Parameters

None.

#### Output

Returns the buffer capacity configuration as an integer.

### `clear`

Removes all contents and empties the buffer.

#### Parameters

None.

#### Output

Returns `true`.

### `delete`

Removes the circular buffer instance.

#### Parameters

None.

#### Output

Returns nothing.

{% hint style="danger" %}
#### Permanent data loss

Deleting removes the instance configuration. All buffered data is permanently lost.
{% endhint %}
