# Data Store

The `DataStore` class provides an in-memory data store with an array-like interface. It's designed to manage a collection of items (often objects) with a rich set of methods for adding, removing, updating, and retrieving data.

You must create an instance of the `DataStore` to use it.

***

#### create

Creates a new, empty data store instance.

Example

```yaml
# (No arguments needed)
```

***

#### push

Adds an item to the end of the data store.

Parameters

* `item`: The item to add.

Example

```yaml
# item
{
  "id": 1,
  "name": "First Item"
}
```

Output

The new length of the data store.

***

#### pop

Removes and returns the item from the end of the data store.

Output

The removed item.

***

#### pushFront

Adds an item to the front of the data store.

Parameters

* `item`: The item to add.

Output

The new length of the data store.

***

#### popFront

Removes and returns the item from the front of the data store.

Output

The removed item.

***

#### length

Gets the current number of items in the data store.

Output

An integer representing the number of items.

***

#### get

Gets the item at a specific index.

Parameters

* `index`: The zero-based index of the item to retrieve.

Output

The item at the specified index.

***

#### set

Sets or replaces the value of an item at a specific index.

Parameters

* `index`: The zero-based index of the item to update.
* `value`: The new value to set.

***

#### update

Updates an item in the data store by merging new data into it. The item to be updated is found either by a `where` condition or by a matching `id` property.

Parameters

* `data`: An object containing the new properties to set on the item.
* `where`: An optional object with a single key-value pair that acts as a condition to find the item.

Example: Update using a where clause

This finds the item where the email property is 'test@example.com' and updates its status.

```yaml
# data
{
  "status": "archived"
}
# where
email: 'test@example.com'
```

Example: Update using an id

If no where clause is given, the function looks for an item with an id that matches the id in the data object.

```yaml
# data
{
  "id": 123,
  "status": "completed"
}
```

***

#### indexOf

Returns the index of the first occurrence of a specific item.

Parameters

* `item`: The item to search for.

Output

The index of the item, or -1 if not found.

***

#### removeAt

Removes the item at a specific index.

Parameters

* `index`: The index of the item to remove.

Output

An array containing the single removed item.

***

#### includes

Checks if the data store contains a specific item.

Parameters

* `item`: The item to search for.

Output

true if the item exists, otherwise false.

***

#### clear

Removes all items from the data store.

***

#### toArray

Returns a shallow copy of all items in the data store as a standard array.

Output

An array containing all the items.
