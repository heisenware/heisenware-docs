# Buffer

The buffer class holds a fixed number of values in order, from front to back. Once it is full, every push drops a value at the opposite end, so the buffer always holds the most recent `capacity` values: a sliding window, for example the last 100 data points of a live chart. React to a full buffer with `onFull` and clear it in reaction to get a tumbling window (one batch per `capacity` values), or push at the back and pop at the front to use it as a queue.

Data remains in memory only and does not persist to disk. This class requires an instance. The code class name is `Buffer`.

### `create`

Creates a new buffer instance with a fixed capacity.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>capacity</code></td><td>The maximum number of values the buffer holds, at least 1. Default 100.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the buffer instance.

#### Example

```yaml
# capacity
10
```

### `delete`

Removes the buffer instance.

#### Parameters

None.

#### Output

Returns nothing.

{% hint style="danger" %}
#### Permanent data loss

Deleting removes the instance configuration. All buffered data is permanently lost.
{% endhint %}

### `pushBack`

Adds a value at the back of the buffer. If the buffer is full, the value at the front (the oldest one pushed at the back) is dropped first.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The value or object to add. A missing value is refused.</td><td>any</td></tr></tbody></table>

#### Output

Returns the number of values held after the push as an integer.

#### Example

```yaml
# value
Another new item
```

### `pushFront`

Adds a value at the front of the buffer. If the buffer is full, the value at the back is dropped first.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The value or object to add. A missing value is refused.</td><td>any</td></tr></tbody></table>

#### Output

Returns the number of values held after the push as an integer.

### `popFront`

Removes and returns the value at the front of the buffer.

#### Parameters

None.

#### Output

Returns the removed value or object. Fails with `Buffer is empty` when there is none.

### `popBack`

Removes and returns the value at the back of the buffer.

#### Parameters

None.

#### Output

Returns the removed value or object. Fails with `Buffer is empty` when there is none.

### `peekFront`

Returns the value at the front without removing it.

#### Parameters

None.

#### Output

Returns the front value or object. Fails with `Buffer is empty` when there is none.

### `peekBack`

Returns the value at the back without removing it.

#### Parameters

None.

#### Output

Returns the back value or object. Fails with `Buffer is empty` when there is none.

### `getBuffer`

Returns all values currently inside the buffer as a standard array, ordered from front to back.

#### Parameters

None.

#### Output

Returns a copy of the stored values as an array.

### `getSize`

Returns the current number of values stored in the buffer.

#### Parameters

None.

#### Output

Returns the current value count as an integer, from 0 to the capacity.

### `getCapacity`

Returns the maximum number of values the buffer can hold.

#### Parameters

None.

#### Output

Returns the capacity set at creation as an integer.

### `isFull`

Checks whether the buffer holds as many values as its capacity.

#### Parameters

None.

#### Output

Returns `true` when the buffer is full, otherwise `false`.

### `isEmpty`

Checks whether the buffer holds no value.

#### Parameters

None.

#### Output

Returns `true` when the buffer is empty, otherwise `false`.

### `clear`

Removes all contents and empties the buffer. The capacity stays.

#### Parameters

None.

#### Output

Returns `true`.

## Event listeners

### `onFull`

Subscribes to the `full` event. The callback runs after every push that leaves the buffer full, which means on every push once the capacity is reached (a sliding window). Clear the buffer in reaction to get one call per `capacity` pushes (a tumbling window).

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback function. <br>Payload: <code>values</code>, all values held, from front to back.</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed`.

### `offFull`

Removes a listener given to `onFull`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The listener to remove.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `true` when the listener was subscribed, otherwise `false`.
