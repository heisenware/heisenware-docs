# Data store

The data store class provides an in-memory store with an array-like interface. Use it to manage a collection of items (often objects) with methods for adding, removing, updating, and retrieving data.

The data lives in memory only; it is not saved to disk.

### `create`

Creates a new, empty data store instance.

#### Parameters

None.

### `push`

Adds an item to the end of the data store.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>item</code></td><td>The item to add.</td><td>any</td></tr></tbody></table>

#### Example

```yaml
# item
{
  "id": 1,
  "name": "First Item"
}
```

#### Output

The new length of the data store.

### `pop`

Removes and returns the item from the end of the data store.

#### Parameters

None.

#### Output

The removed item.

### `pushFront`

Adds an item to the front of the data store.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>item</code></td><td>The item to add.</td><td>any</td></tr></tbody></table>

#### Output

The new length of the data store.

### `popFront`

Removes and returns the item from the front of the data store.

#### Parameters

None.

#### Output

The removed item.

### `get`

Gets the item at a specific index.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>index</code></td><td>The zero-based index of the item to retrieve.</td><td>integer</td></tr></tbody></table>

#### Output

The item at the specified index.

### `set`

Sets or replaces the value of an item at a specific index.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>index</code></td><td>The zero-based index of the item to update.</td><td>integer</td></tr><tr><td><code>value</code></td><td>The new value to set.</td><td>any</td></tr></tbody></table>

### `update`

Updates an item by merging new data into it. The item is found either by a `where` condition or by a matching `id` property in the data.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>data</code></td><td>The new properties to set on the item.</td><td>object</td></tr><tr><td><code>where</code></td><td>Optional object with a single key-value pair acting as the condition to find the item.</td><td>object</td></tr></tbody></table>

#### Examples

Example 1: Update using a where clause

This finds the item whose `email` is `test@example.com` and updates its status:

```yaml
# data
{
  "status": "archived"
}
# where
email: 'test@example.com'
```

Example 2: Update using an id

Without a `where` clause, the function looks for an item whose `id` matches the `id` in the data object:

```yaml
# data
{
  "id": 123,
  "status": "completed"
}
```

### `length`

Gets the current number of items in the data store.

#### Parameters

None.

#### Output

An integer with the number of items.

### `indexOf`

Returns the index of the first occurrence of a specific item.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>item</code></td><td>The item to search for.</td><td>any</td></tr></tbody></table>

#### Output

The index of the item, or `-1` if not found.

### `includes`

Checks whether the data store contains a specific item.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>item</code></td><td>The item to search for.</td><td>any</td></tr></tbody></table>

#### Output

Returns `true` if the item exists, otherwise `false`.

### `removeAt`

Removes the item at a specific index.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>index</code></td><td>The index of the item to remove.</td><td>integer</td></tr></tbody></table>

#### Output

An array containing the single removed item.

### `toArray`

Returns a shallow copy of all items as a standard array.

#### Parameters

None.

#### Output

An array containing all the items.

### `clear`

Removes all items from the data store.

#### Parameters

None.

### `delete`

Removes the instance. All stored data is lost.
