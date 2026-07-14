# Data processing

With data processing tools, you get a collection of functions for common data manipulation, transformation, and logical operations: Working with arrays and objects, handling JSON, mapping value ranges, and delaying flows. All functions are static, so you do not need to create an instance.

## `echo`

Returns the exact input it was given.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>Any input argument.</td><td>any</td></tr></tbody></table>

### Output

The unchanged input argument.

## `combine`

Combines two or more arguments into a single array.

### Parameters

<table><thead><tr><th width="140">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>arg1</code>, <code>arg2</code>, ...</td><td>An arbitrary number of arguments to be combined.</td><td>any</td></tr></tbody></table>

### Example

```yaml
# arg1
123
# arg2
"hello"
# arg3
{ "key": "value" }
```

### Output

```json
[
  123,
  "hello",
  {
    "key": "value"
  }
]
```

## `mergeObjects`

Merges two or more objects into a single new object. If the same key exists in multiple objects, the value from the last object in the argument list wins. Arguments that are not plain objects (including arrays) are ignored.

### Parameters

<table><thead><tr><th width="140">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>arg1</code>, <code>arg2</code>, ...</td><td>Two or more objects to merge.</td><td>object</td></tr></tbody></table>

### Example

```yaml
# arg1
{ "name": "John", "status": "active" }
# arg2
{ "status": "inactive", "id": 123 }
```

### Output

```json
{
  "name": "John",
  "status": "inactive",
  "id": 123
}
```

## `arrayPush`

Pushes one or more items to the end of an array. If an item is itself an array, its elements are unfolded and added individually.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>array</code></td><td>The input array.</td><td>array</td></tr><tr><td><code>items</code></td><td>Any number of items to push to the end of the array.</td><td>any</td></tr></tbody></table>

### Example

```yaml
# array
[1, 2]
# items
[ 3, 4, [5, 6] ]
```

### Output

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

## `mapRange`

Maps a numerical value from an original range to a new range. The result is rounded to the nearest integer.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The number to be mapped.</td><td>number</td></tr><tr><td><code>options</code></td><td>Defines the ranges: <code>origMin</code> and <code>origMax</code> for the original range, <code>newMin</code> and <code>newMax</code> for the new range.</td><td>object</td></tr></tbody></table>

### Example

Map a sensor value (0 to 1023) to a percentage (0 to 100):

```yaml
# value
512
# options
origMin: 0
origMax: 1023
newMin: 0
newMax: 100
```

### Output

`50`

## `delay`

Returns the provided value after a configurable delay. This is an asynchronous function.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The value to be returned after the delay.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>timeout</code>: the delay in milliseconds. Defaults to <code>1000</code>.</td><td>object</td></tr></tbody></table>

### Output

The unchanged input value, after the delay.

## `areAllParamsTrue`

Applies a logical AND operator. Checks if a specific number of provided arguments are all truthy (not `false`, `0`, `""`, `null`, or `undefined`).

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>nParams</code></td><td>The exact number of arguments that must be provided and be truthy.</td><td>integer</td></tr><tr><td><code>args</code></td><td>The arguments to check.</td><td>any</td></tr></tbody></table>

### Examples

```yaml
# nParams
3
# args
[true, "hello", 1]
```

Output: `true` (3 arguments were provided and all are truthy)

```yaml
# nParams
3
# args
[true, ""]
```

Output: `false` (only 2 arguments were provided, not 3)

## `isOneOrMoreParamTrue`

Applies a logical OR operator. Checks if at least one of the provided arguments is truthy.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>args</code></td><td>Any number of input parameters to check.</td><td>any</td></tr></tbody></table>

### Example

```yaml
# args
[false, 0, "hello", null]
```

### Output

`true` (because `"hello"` is truthy)

## `jsonStringify`

Converts a JavaScript value (like an object or array) into a JSON string.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>value</code></td><td>The JavaScript value to be converted.</td><td>any</td></tr></tbody></table>

### Example

```yaml
# value
{ "name": "John", "is_active": true, "roles": ["admin", "editor"] }
```

### Output

`'{"name":"John","is_active":true,"roles":["admin","editor"]}'`

## `jsonParse`

Converts a JSON string back into a JavaScript object or value.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>text</code></td><td>A valid JSON string.</td><td>string</td></tr></tbody></table>

### Example

```yaml
# text
'{"name":"John","is_active":true,"roles":["admin","editor"]}'
```

### Output

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

## `flatten`

Takes a nested JavaScript object and flattens it into a single level by creating dot-delimited keys.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>target</code></td><td>The object to flatten.</td><td>object</td></tr><tr><td><code>options</code></td><td>Optional settings. See below.</td><td>object</td></tr></tbody></table>

Available options:

<table><thead><tr><th width="140">Option</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>delimiter</code></td><td>A custom delimiter to use instead of <code>.</code></td><td>string</td></tr><tr><td><code>safe</code></td><td>If <code>true</code>, arrays and their contents are preserved instead of flattened. Default is <code>false</code>.</td><td>boolean</td></tr><tr><td><code>maxDepth</code></td><td>The maximum number of levels to flatten.</td><td>integer</td></tr></tbody></table>

### Example

```yaml
# target
{
  "user": {
    "name": "John",
    "address": {
      "city": "New York"
    }
  },
  "tags": ["a", "b"]
}
```

### Output

```json
{
  "user.name": "John",
  "user.address.city": "New York",
  "tags.0": "a",
  "tags.1": "b"
}
```

## `unflatten`

The inverse of `flatten`. Takes a flat object with delimited keys and converts it back into a nested object.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>target</code></td><td>The object to unflatten.</td><td>object</td></tr><tr><td><code>options</code></td><td>Optional settings. See below.</td><td>object</td></tr></tbody></table>

Available options:

<table><thead><tr><th width="140">Option</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>delimiter</code></td><td>A custom delimiter to use instead of <code>.</code></td><td>string</td></tr><tr><td><code>safe</code></td><td>If <code>true</code>, arrays and their contents are preserved. Default is <code>false</code>.</td><td>boolean</td></tr><tr><td><code>object</code></td><td>If <code>true</code>, arrays are not created automatically when unflattening. Default is <code>false</code>.</td><td>boolean</td></tr><tr><td><code>override</code></td><td>If <code>true</code>, existing keys may be overwritten if they cannot hold a newly encountered nested value. Default is <code>false</code>.</td><td>boolean</td></tr></tbody></table>

### Example

```yaml
# target
{
  "user.name": "John",
  "user.address.city": "New York"
}
```

### Output

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

## `mergeArrays`

Merges multiple arrays by combining the objects at corresponding indexes. The result is truncated to the length of the shortest input array.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>args</code></td><td>Multiple arrays to merge.</td><td>array</td></tr></tbody></table>

### Example

```yaml
# args
[
  [ { "a": 1 }, { "b": 2 } ],
  [ { "c": 3 }, { "d": 4, "e": 5 } ]
]
```

### Output

```json
[
  { "a": 1, "c": 3 },
  { "b": 2, "d": 4, "e": 5 }
]
```

## `combineArrays`

Combines multiple arrays like `mergeArrays`, but postfixes the keys of the objects with `_` and the array's index to prevent key collisions.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>args</code></td><td>Multiple arrays to combine.</td><td>array</td></tr></tbody></table>

### Example

```yaml
# args
[
  [ { "value": 10 }, { "value": 20 } ],
  [ { "value": 30 }, { "value": 40 } ]
]
```

### Output

```json
[
  { "value_0": 10, "value_1": 30 },
  { "value_0": 20, "value_1": 40 }
]
```

## `groupArrays`

Groups and merges objects from multiple arrays based on a shared key or set of keys. This is a powerful way to join data from different sources.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>keys</code></td><td>The key or array of keys to group by.</td><td>string or array</td></tr><tr><td><code>args</code></td><td>Multiple arrays of objects to group and merge.</td><td>array</td></tr></tbody></table>

### Example

Grouping by a single `id` key:

```yaml
# keys
id
# args
[
  [ { "id": 1, "name": "Alice" }, { "id": 2, "name": "Bob" } ],
  [ { "id": 1, "age": 25 }, { "id": 2, "age": 30 } ]
]
```

### Output

```json
[
  { "id": 1, "name": "Alice", "age": 25 },
  { "id": 2, "name": "Bob", "age": 30 }
]
```

## `renameObjectKeys`

Creates a new object with renamed keys based on a provided mapping.

### Parameters

<table><thead><tr><th width="140">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>object</code></td><td>The object whose keys should be renamed.</td><td>object</td></tr><tr><td><code>keyMapping</code></td><td>An object where each key is an original key name and its value is the new key name.</td><td>object</td></tr></tbody></table>

### Example

```yaml
# object
{ "first_name": "John", "last_name": "Doe" }
# keyMapping
{ "first_name": "firstName", "last_name": "lastName" }
```

### Output

```json
{
  "firstName": "John",
  "lastName": "Doe"
}
```

## `base64Decode`

Decodes a base64-encoded string back to its original string representation.

### Parameters

<table><thead><tr><th width="150">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>base64String</code></td><td>The base64-encoded string.</td><td>string</td></tr><tr><td><code>encoding</code></td><td>The encoding of the returned string. Defaults to <code>utf8</code>.</td><td>string</td></tr></tbody></table>

### Example

```yaml
# base64String
SGVsbG8gV29ybGQ=
```

### Output

`Hello World`

## `base64Encode`

Encodes a string or bytes into a base64 string representation.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bytes</code></td><td>The string or bytes to encode.</td><td>any</td></tr></tbody></table>

### Example

```yaml
# bytes
Hello World
```

### Output

`SGVsbG8gV29ybGQ=`

## `memory`

A function with an input and output only, and no trigger. The function outputs its input value upon any input update.

<figure><img src="../../../../.gitbook/assets/Bildschirmaufnahme2025-12-17144813-ezgif.com-video-to-gif-converter.gif" alt=""><figcaption></figcaption></figure>

{% hint style="info" %}
The main Backend Builder toolbar holds a shortcut to the memory function, as it is useful in many cases.
{% endhint %}
