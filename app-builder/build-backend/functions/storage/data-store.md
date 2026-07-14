# Data store

The data store class provides an in-memory storage array to manage collections of data items or objects. Add, remove, update, and retrieve data points dynamically within your flows. Data remains in memory only and does not persist to disk. This class requires an instance. The code class name is `DataStore`.

### `create`

Creates a new, empty data store instance.

#### Parameters

None.

#### Output

Returns the data store instance.

### `push`

Adds an item to the end of the data store.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>item</code></td><td>The item or object to add to the data store.</td><td>any</td></tr></tbody></table>

#### Output

Returns the new total length of the data store as an integer.

#### Examples

```yaml
# item
id: 1
name: First Item
```

### `pop`

Removes and returns the last item from the end of the data store.

#### Parameters

None.

#### Output

Returns the removed item or object.

### `pushFront`

Adds an item to the front of the data store.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>item</code></td><td>The item or object to add.</td><td>any</td></tr></tbody></table>

#### Output

Returns the new total length of the data store as an integer.

### `popFront`

Removes and returns the first item from the front of the data store.

#### Parameters

None.

#### Output

Returns the removed item or object.

### `get`

Retrieves the item at a specific zero-based index.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>index</code></td><td>The zero-based index of the item to retrieve.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the item at the specified index.

### `set`

Replaces the value of an item at a specific zero-based index.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>index</code></td><td>The zero-based index of the item to update.</td><td>integer</td></tr><tr><td><code>value</code></td><td>The new value to assign to the index.</td><td>any</td></tr></tbody></table>

#### Output

Returns nothing.

### `update`

Updates an item by merging new properties into it. The function matches items using an explicit lookup condition or an implicit ID field.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>data</code></td><td></td><td>An object containing the new properties to merge into the item.</td><td>object</td></tr><tr><td></td><td><code>id</code></td><td>The unique identifier used to match the target item if you omit the <code>where</code> input.</td><td>any</td></tr><tr><td><code>where</code></td><td></td><td>An optional selection object containing a single key-value pair to locate the item.</td><td>object</td></tr></tbody></table>

#### Output

Returns nothing.

#### Examples

**Update with where condition**

Finds the item where `email` equals `test@example.com` and modifies its status property.

```yaml
# data
status: archived
# where
email: test@example.com
```

**Update with implicit ID**

Matches the target item using the provided `id` property because no `where` input is defined.

```yaml
# data
id: 123
status: completed
```

### `length`

Returns the current number of items in the data store.

#### Parameters

None.

#### Output

Returns the total count of items as an integer.

### `indexOf`

Returns the zero-based index of the first occurrence of a specific item.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>item</code></td><td>The item to search for.</td><td>any</td></tr></tbody></table>

#### Output

Returns the zero-based index as an integer, or `-1` if the item does not exist.

### `includes`

Checks whether the data store contains a specific item.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>item</code></td><td>The item to search for.</td><td>any</td></tr></tbody></table>

#### Output

Returns `true` if the item exists, or `false` if it does not.

### `removeAt`

Removes the item at a specific zero-based index.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>index</code></td><td>The zero-based index of the item to remove.</td><td>integer</td></tr></tbody></table>

#### Output

Returns an array containing the removed item.

### `toArray`

Returns a shallow copy of all data store items as a standard array.

#### Parameters

None.

#### Output

Returns an array containing all stored items.

### `clear`

Removes all items from the data store.

#### Parameters

None.

#### Output

Returns nothing.

### `delete`

Removes the data store instance.

#### Parameters

None.

#### Output Implies

Returns nothing.

{% hint style="danger" %}
#### Permanent data loss

Deleting removes the instance configuration, and all stored data is permanently lost.
{% endhint %}
