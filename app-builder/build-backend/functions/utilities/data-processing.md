# Data processing

The data processing class provides static functions for data manipulation, transformation, and logical operations. These functions help you manage arrays, objects, JSON data, and value range mappings without creating an instance.

### `echo`

Returns the input value exactly as provided.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The input value.</td><td>any</td></tr></tbody></table>

#### Output

Returns the unchanged input value.

### `combine`

Combines multiple arguments into a single array.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>args</code></td><td>An arbitrary number of arguments to combine.</td><td>any</td></tr></tbody></table>

#### Example

```yaml
# args
  - 123
  - hello
  - key: value
```

#### Output

Returns the combined array.

```json
[
  123,
  "hello",
  {
    "key": "value"
  }
]
```

### `mergeObjects`

Merges multiple objects into a single new object. If a key exists in multiple objects, the value from the last object overrides previous values. The function ignores arguments that are not plain objects.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>args</code></td><td>Two or more objects to merge.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# args
  - name: John
    status: active
  - status: inactive
    id: 123
```

#### Output

Returns the merged object.

```json
{
  "name": "John",
  "status": "inactive",
  "id": 123
}
```

### `arrayPush`

Pushes items to the end of an array. If an item is an array, the function flattens its elements and adds them individually.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>array</code></td><td>The input array.</td><td>array</td></tr><tr><td><code>items</code></td><td>The items to add to the end of the array.</td><td>any</td></tr></tbody></table>

#### Example

```yaml
# array
  - 1
  - 2
# items
  - 3
  - 4
  - [5, 6]
```

#### Output

Returns the updated array.

```json
[
  1,
  2,
  3,
  4,
  5,
  6
]
```

### `mapRange`

Maps a numerical value from an original range to a new range, rounding the result to the nearest integer.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td></td><td>The number to map.</td><td>number</td></tr><tr><td><code>options</code></td><td><code>origMin</code></td><td>The minimum value of the original range.</td><td>number</td></tr><tr><td></td><td><code>origMax</code></td><td>The maximum value of the original range.</td><td>number</td></tr><tr><td></td><td><code>newMin</code></td><td>The minimum value of the new range.</td><td>number</td></tr><tr><td></td><td><code>newMax</code></td><td>The maximum value of the new range.</td><td>number</td></tr></tbody></table>

#### Example

```yaml
# value
512
# options
origMin: 0
origMax: 1023
newMin: 0
newMax: 100
```

#### Output

Returns the mapped integer value.

### `delay`

Returns the provided value after a configurable delay.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td></td><td>The value to return after the delay.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>timeout</code></td><td>The delay duration in milliseconds. Default 1000.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the unchanged input value after the specified delay.

### `areAllParamsTrue`

Checks if all provided arguments are truthy (not `false`, `0`, `""`, `null`, or `undefined`).

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>nParams</code></td><td>The exact number of arguments that must be provided and evaluate to truthy.</td><td>integer</td></tr><tr><td><code>args</code></td><td>The arguments to check.</td><td>any</td></tr></tbody></table>

#### Example

```yaml
# nParams
3
# args
  - true
  - hello
  - 1
```

#### Output

Returns `true` if all arguments are truthy and match `nParams`, otherwise `false`.

### `isOneOrMoreParamTrue`

Checks if at least one provided argument is truthy.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>args</code></td><td>The input parameters to check.</td><td>any</td></tr></tbody></table>

#### Example

```yaml
# args
  - false
  - 0
  - hello
  - null
```

#### Output

Returns `true` if at least one argument is truthy, otherwise `false`.

### `jsonStringify`

Converts a JavaScript value (such as an object or array) into a JSON string.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The value to convert.</td><td>any</td></tr></tbody></table>

#### Example

```yaml
# value
name: John
is_active: true
roles:
  - admin
  - editor
```

#### Output

Returns the generated JSON string.

### `jsonParse`

Parses a JSON string into a JavaScript object or value.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>text</code></td><td>A valid JSON string.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# text
'{"name":"John","is_active":true,"roles":["admin","editor"]}'
```

#### Output

Returns the parsed JavaScript entity.

```json
{
  "name": "John",
  "is_active": true,
  "roles": [
    "admin",
    "editor"
  ]
}
```

### `flatten`

Flattens a nested JavaScript object into a single level using dot-delimited keys.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>target</code></td><td></td><td>The object to flatten.</td><td>object</td></tr><tr><td><code>options</code></td><td><code>delimiter</code></td><td>A custom delimiter string to use instead of a dot.</td><td>string</td></tr><tr><td></td><td><code>safe</code></td><td>Preserves arrays and their contents instead of flattening them. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>maxDepth</code></td><td>The maximum number of nested levels to flatten.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# target
user:
  name: John
  address:
    city: New York
tags:
  - a
  - b
```

#### Output

Returns the flattened object.

```json
{
  "user.name": "John",
  "user.address.city": "New York",
  "tags.0": "a",
  "tags.1": "b"
}
```

### `unflatten`

Converts a flat object with delimited keys back into a nested object structure.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>target</code></td><td></td><td>The object to unflatten.</td><td>object</td></tr><tr><td><code>options</code></td><td><code>delimiter</code></td><td>A custom delimiter string to use instead of a dot.</td><td>string</td></tr><tr><td></td><td><code>safe</code></td><td>Preserves arrays and their contents. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>object</code></td><td>Prevents automatic creation of arrays when unflattening. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>override</code></td><td>Overwrites existing keys if they cannot hold a newly encountered nested value. Default false.</td><td>boolean</td></tr></tbody></table>

#### Example

```yaml
# target
user.name: John
user.address.city: New York
```

#### Output

Returns the unflattened nested object.

```json
{
  "user": {
    "name": "John",
    "address": {
      "city": "New York"
    }
  }
}
```

### `mergeArrays`

Merges multiple arrays by combining the objects at corresponding indexes. The function truncates the result to the length of the shortest input array.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>args</code></td><td>The arrays to merge.</td><td>array</td></tr></tbody></table>

#### Example

```yaml
# args
  - - a: 1
    - b: 2
  - - c: 3
    - d: 4
      e: 5
```

#### Output

Returns the merged array.

```json
[
  { "a": 1, "c": 3 },
  { "b": 2, "d": 4, "e": 5 }
]
```

### `combineArrays`

Combines multiple arrays and appends an underscore and the array index to object keys to prevent collisions.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>args</code></td><td>The arrays to combine.</td><td>array</td></tr></tbody></table>

#### Example

```yaml
# args
  - - value: 10
    - value: 20
  - - value: 30
    - value: 40
```

#### Output

Returns the combined array.

```json
[
  { "value_0": 10, "value_1": 30 },
  { "value_0": 20, "value_1": 40 }
]
```

### `groupArrays`

Groups and merges objects from multiple arrays based on a shared key or set of keys.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>keys</code></td><td>The key or array of keys to group by.</td><td>string or array</td></tr><tr><td><code>args</code></td><td>The arrays of objects to group and merge.</td><td>array</td></tr></tbody></table>

#### Example

```yaml
# keys
id
# args
  - - id: 1
      name: Alice
    - id: 2
      name: Bob
  - - id: 1
      age: 25
    - id: 2
      age: 30
```

#### Output

Returns the grouped and merged array.

```json
[
  { "id": 1, "name": "Alice", "age": 25 },
  { "id": 2, "name": "Bob", "age": 30 }
]
```

### `renameObjectKeys`

Creates a new object with renamed keys based on a specified mapping configuration.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>object</code></td><td>The target object.</td><td>object</td></tr><tr><td><code>keyMapping</code></td><td>An object mapping original key names to new key names.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# object
first_name: John
last_name: Doe
# keyMapping
first_name: firstName
last_name: lastName
```

#### Output

Returns the object with updated keys.

```json
{
  "firstName": "John",
  "lastName": "Doe"
}
```

### `base64Decode`

Decodes a base64-encoded string back to its original text representation.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>base64String</code></td><td></td><td>The base64 string to decode.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>encoding</code></td><td>The character encoding of the returned string. Default <code>utf8</code>.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# base64String
SGVsbG8gV29ybGQ=
```

#### Output

Returns the decoded string.

### `base64Encode`

Encodes a string or byte payload into a base64 string.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bytes</code></td><td>The text or bytes to encode.</td><td>any</td></tr></tbody></table>

#### Example

```yaml
# bytes
Hello World
```

#### Output

Returns the base64-encoded string.

### `memory`

Outputs its input value immediately upon any input update. This function has an input and an output slot but no trigger action.

<figure><img src="../../../../.gitbook/assets/Bildschirmaufnahme2025-12-17144813-ezgif.com-video-to-gif-converter.gif" alt=""><figcaption></figcaption></figure>

{% hint style="info" %}
The Backend Builder toolbar includes a shortcut to the memory function.
{% endhint %}
