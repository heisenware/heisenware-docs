# Data store

The data store class keeps an in-memory list of items in insertion order. Address items by position (index), or records (items that are objects) by a `where` condition, and react to every change with `onChange`. A named instance is the data bus between Apps: every App of the workspace that targets the same instance sees the same list.

The list lives in memory only: after a restart of the platform the instance is there again, empty. This class requires an instance. The code class name is `DataStore`.

## Conditions

`find`, `filter`, `update`, and `remove` select records with a `where` condition: an object of field values, at least one. A record matches when every listed field strictly equals the given value; all fields must match (AND). Only top-level fields are compared, there are no operators such as greater-than or pattern matching, and an item that is not an object never matches. `find` answers the first match; `filter`, `update`, and `remove` act on every match. For anything beyond equality, use `toArray` with a [filter](../../../app-builder/flowboard/filter.md) or a [modifier](../../../app-builder/flowboard/modifier.md), or store the data in a [relational database](relational-database.md).

```yaml
# where
status: open
line: 3
```

matches every record whose `status` is `open` **and** whose `line` is `3`.

## Instance

### `create`

Creates a new, empty data store instance.

#### Parameters

None.

#### Output

Returns the name of the created instance.

### `delete`

Removes the data store instance, for every App that uses it.

#### Parameters

None.

#### Output

Returns `true` when the instance is deleted.

{% hint style="danger" %}
#### Permanent data loss

Deleting removes the instance, and all stored data is permanently lost.
{% endhint %}

## By position

### `pushBack`

Adds an item at the back of the data store.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>item</code></td><td>The item or record to add. A missing item is refused.</td><td>any</td></tr></tbody></table>

#### Output

Returns the new total number of items as an integer.

#### Example

```yaml
# item
id: 1
name: First Item
```

### `pushFront`

Adds an item at the front of the data store.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>item</code></td><td>The item or record to add. A missing item is refused.</td><td>any</td></tr></tbody></table>

#### Output

Returns the new total number of items as an integer.

### `popBack`

Removes and returns the last item.

#### Parameters

None.

#### Output

Returns the removed item. Fails with `Store is empty` when there is none.

### `popFront`

Removes and returns the first item.

#### Parameters

None.

#### Output

Returns the removed item. Fails with `Store is empty` when there is none.

### `get`

Retrieves the item at a zero-based position.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>index</code></td><td>The zero-based position of the item.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the item at the position. Fails when the index is not an integer between 0 and `size - 1`.

### `set`

Replaces the item at a zero-based position.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>index</code></td><td>The zero-based position of the item to replace.</td><td>integer</td></tr><tr><td><code>item</code></td><td>The new item.</td><td>any</td></tr></tbody></table>

#### Output

Returns the new item. Fails when the index is out of bounds or the item is missing.

### `removeAt`

Removes the item at a zero-based position.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>index</code></td><td>The zero-based position of the item to remove.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the removed item. Fails when the index is out of bounds.

## By condition

### `find`

Returns the first record matching a condition.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>where</code></td><td>The <a href="#conditions">condition</a>: an object of field values the record must have (all of them).</td><td>object</td></tr></tbody></table>

#### Output

Returns the record, or `null` when none matches.

#### Example

```yaml
# where
status: open
machine: M1
```

### `filter`

Returns all records matching a condition.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>where</code></td><td>The <a href="#conditions">condition</a>: an object of field values the records must have (all of them).</td><td>object</td></tr></tbody></table>

#### Output

Returns an array of the matching records in store order, empty when none matches.

### `update`

Merges fields into every record matching a condition. A field that exists is overwritten, the others are kept.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>where</code></td><td>The <a href="#conditions">condition</a>: an object of field values the records must have (all of them).</td><td>object</td></tr><tr><td><code>fields</code></td><td>The fields to merge, at least one.</td><td>object</td></tr></tbody></table>

#### Output

Returns an array of the updated records in store order, empty when none matched.

#### Example

Finds every record whose `email` is `test@example.com` and sets its status.

```yaml
# where
email: test@example.com
# fields
status: archived
```

### `remove`

Removes all records matching a condition.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>where</code></td><td>The <a href="#conditions">condition</a>: an object of field values the records must have (all of them).</td><td>object</td></tr></tbody></table>

#### Output

Returns an array of the removed records in store order, empty when none matched.

## The whole list

### `getSize`

Returns the current number of items in the data store.

#### Parameters

None.

#### Output

Returns the total count of items as an integer.

### `isEmpty`

Checks whether the data store holds no item.

#### Parameters

None.

#### Output

Returns `true` when empty, otherwise `false`.

### `toArray`

Returns a copy of all data store items as a standard array.

#### Parameters

None.

#### Output

Returns an array containing all stored items in store order.

### `clear`

Removes all items from the data store.

#### Parameters

None.

#### Output

Returns `true`.

## Events

Triggering an event executor subscribes it; triggering it again with the same inputs changes nothing. The payload arrives on the executor's event outputs, not on its return. The subscription pauses while the App is stopped and ends with its scope: a user's with the user's last connection, a shared one never by itself. To end it by hand, choose **Stop listening** on the executor's event input; the next trigger subscribes again. See [Backend events](../../../concepts/backend-events.md).

### `onChange`

Subscribes to the `change` event. The listener is called after every change with the whole list, so a widget linked to its event output always shows the current state, also when another App changed it. An `update` or `remove` that matches no record changes nothing and is silent.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The listener. <br>Payload: <code>items</code>, all items in store order, and <code>action</code>, one of <code>pushBack</code>, <code>pushFront</code>, <code>popBack</code>, <code>popFront</code>, <code>set</code>, <code>removeAt</code>, <code>update</code>, <code>remove</code>, <code>clear</code>.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `true` once the executor is listening. The values arrive on the event outputs.
