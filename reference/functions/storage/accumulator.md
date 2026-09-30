# Accumulator

The accumulator class builds one record from parts that arrive separately. Every `accumulate` merges fields into the record, keeping the latest value per key, and announces the whole record. Give the instance a template when you create it to name the keys the record is expected to have: once every template key has arrived, the record is complete and `onComplete` fires. This is the meeting point of values that come from different sources, for example a machine's temperature from OPC UA and its setpoint from a form, joined into one record for a dashboard or a database row.

Data remains in memory only and does not persist to disk. This class requires an instance. The code class name is `Accumulator`.

### `create`

Creates a new accumulator instance.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>template</code></td><td>The keys the record is expected to have, with their starting values. Default: none.</td><td>object</td></tr></tbody></table>

#### Output

Returns the accumulator instance.

#### Example

```yaml
# options
template:
  temperature: null
  setpoint: null
```

### `delete`

Removes the accumulator instance.

#### Parameters

None.

#### Output

Returns nothing.

{% hint style="danger" %}
#### Permanent data loss

Deleting removes the instance configuration. The record is permanently lost.
{% endhint %}

### `accumulate`

Merges fields into the record. A field that exists is overwritten, the others are kept. The merge is shallow: a nested object replaces the previous one as a whole.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>fields</code></td><td>The fields to merge, at least one.</td><td>object</td></tr></tbody></table>

#### Output

Returns the record after the merge.

#### Example

```yaml
# fields
temperature: 21.5
```

followed by

```yaml
# fields
setpoint: 22
```

returns `{ temperature: 21.5, setpoint: 22 }`.

### `getRecord`

Returns the record.

#### Parameters

None.

#### Output

Returns a copy of the record.

### `get`

Returns one field of the record.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>key</code></td><td>The field name.</td><td>string</td></tr></tbody></table>

#### Output

Returns the field's value, or nothing when the record has no such field.

### `getMissing`

Returns the template keys that have not arrived since the last reset.

#### Parameters

None.

#### Output

Returns an array of key names, empty when the record is complete.

### `isComplete`

Checks whether every template key has arrived since the last reset. A record without a template is always complete.

#### Parameters

None.

#### Output

Returns `true` when complete, otherwise `false`.

### `reset`

Returns the record to the template and forgets which keys arrived.

#### Parameters

None.

#### Output

Returns a copy of the record after the reset.

## Event listeners

### `onChange`

Subscribes to the `change` event. The callback runs after every `accumulate` with the whole record.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback function. <br>Payload: <code>record</code>, the whole record after the merge, and <code>changed</code>, the keys this merge wrote.</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed`.

### `offChange`

Removes a listener given to `onChange`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The listener to remove.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `true` when the listener was subscribed, otherwise `false`.

### `onComplete`

Subscribes to the `complete` event. The callback runs once when a merge makes the record complete, that is, when every template key has arrived since the last reset. Call `reset` in reaction to pair the next round of values.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback function. <br>Payload: <code>record</code>, the whole record.</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed`.

### `offComplete`

Removes a listener given to `onComplete`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The listener to remove.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `true` when the listener was subscribed, otherwise `false`.
