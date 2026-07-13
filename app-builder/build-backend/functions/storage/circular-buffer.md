# Circular buffer

The circular buffer class implements a ring buffer: A fixed-size data structure used as if it were connected end-to-end. When the buffer is full, new elements overwrite the oldest ones. Use it for streams of data where only the most recent items matter, like the last 100 values for a live chart.

The data lives in memory only; it is not saved to disk.

### `create`

Creates a buffer instance with a specified capacity.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>capacity</code></td><td>The maximum number of items the buffer can hold. Default <code>100</code>.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# capacity
10
```

### `pushBack`

Adds an item to the back (end) of the buffer. This is the most common push operation. If the buffer is full, the item at the front is overwritten.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The value or object to add.</td><td>any</td></tr></tbody></table>

#### Example

```yaml
# value
Another new item
```

### `pushFront`

Adds an item to the front of the buffer. If the buffer is full, the item at the back is overwritten.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The value or object to add.</td><td>any</td></tr></tbody></table>

### `popFront`

Removes and returns the item from the front of the buffer.

#### Parameters

None.

#### Output

The value that was at the front of the buffer.

### `popBack`

Removes and returns the item from the back (end) of the buffer.

#### Parameters

None.

#### Output

The value that was at the back of the buffer.

### `getBuffer`

Returns all items currently in the buffer as a standard array.

#### Parameters

None.

#### Output

An array containing all stored values, ordered from front to back.

### `getSize`

Returns the current number of items stored in the buffer.

#### Parameters

None.

#### Output

An integer with the current size of the buffer.

### `getCapacity`

Returns the maximum number of items the buffer can hold, as specified during creation.

#### Parameters

None.

#### Output

An integer with the capacity of the buffer.

### `clear`

Empties the buffer, removing all of its contents.

#### Parameters

None.

#### Output

Returns `true`.

### `delete`

Removes the instance. All buffered data is lost.
