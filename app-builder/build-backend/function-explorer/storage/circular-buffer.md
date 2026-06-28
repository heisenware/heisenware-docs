# Circular Buffer

The `Buffer` class implements a circular buffer (also known as a ring buffer), which is a data structure that uses a single, fixed-size buffer as if it were connected end-to-end. When the buffer is full, new elements overwrite the oldest ones. This is useful for managing streams of data where only the most recent items are of interest.

You must create an instance of the buffer with a specified capacity.

***

#### create

Creates a new circular buffer instance with a specified capacity.

Parameters

* `capacity`: The maximum number of items the buffer can hold. Defaults to `100`.

Example

```yaml
# capacity
10
```

***

#### getSize

Returns the current number of items stored in the buffer.

Output

An integer representing the current size of the buffer.

***

#### getCapacity

Returns the maximum number of items the buffer can hold, as specified during creation.

Output

An integer representing the capacity of the buffer.

***

#### getBuffer

Returns all items currently in the buffer as a standard array.

Output

An array containing all values stored in the buffer, ordered from front to back.

***

#### pushFront

Adds an item to the front of the buffer. If the buffer is full, this will overwrite the item at the back.

Parameters

* `value`: The value or object to add to the buffer.

Example

```yaml
# value
New item
```

***

#### pushBack

Adds an item to the back (end) of the buffer. This is the most common "push" operation. If the buffer is full, this will overwrite the item at the front.

Parameters

* `value`: The value or object to add to the buffer.

Example

```yaml
# value
Another new item
```

***

#### popFront

Removes and returns the item from the front of the buffer.

Output

The value that was at the front of the buffer.

***

#### popBack

Removes and returns the item from the back (end) of the buffer.

Output

The value that was at the back of the buffer.

***

#### clear

Empties the buffer, removing all of its contents.

Output

Returns true.
