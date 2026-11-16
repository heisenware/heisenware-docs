# Accumulator

The accumulator class builds one record from parts that arrive separately. Every `accumulate` merges fields into the record, keeping the latest value per key, and announces the whole record. Give the instance a template when you create it to name the keys the record is expected to have: once every template key has arrived, the record is complete and `onComplete` fires. This is the meeting point of values that come from different sources, for example a machine's temperature from OPC UA and its setpoint from a form, joined into one record for a dashboard or a database row.

The record lives in memory only: after a restart of the platform the instance is there again, back at its template. This class requires an instance. The code class name is `Accumulator`.

### `create`

Creates a new accumulator instance.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>template</code></td><td>The keys the record is expected to have, with their starting values. Default: none.</td><td>object</td></tr></tbody></table>

#### Output

Returns the name of the created instance. Creating a name that already exists returns it unchanged, with its original template.

#### Example

```yaml
# options
template:
  temperature: null
  setpoint: null
```

### `delete`

Removes the accumulator instance, for every App that uses it.

#### Parameters

None.

#### Output

Returns `true` when the instance is deleted.

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

## Events

Triggering an event executor subscribes it; triggering it again with the same inputs changes nothing. The payload arrives on the executor's event outputs, not on its return. The subscription pauses while the App is stopped and ends with its scope: a user's with the user's last connection, a shared one never by itself. To end it by hand, choose **Stop listening** on the executor's event input; the next trigger subscribes again. See [Backend events](../../../concepts/backend-events.md).

### `onChange`

Subscribes to the `change` event. The listener is called after every `accumulate` with the whole record.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The listener. <br>Payload: <code>record</code>, the whole record after the merge, and <code>changed</code>, the keys this merge wrote.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `true` once the executor is listening. The values arrive on the event outputs.

### `onComplete`

Subscribes to the `complete` event. The listener is called once when a merge makes the record complete, that is, when every template key has arrived since the last reset. Call `reset` in reaction to pair the next round of values.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The listener. <br>Payload: <code>record</code>, the whole record.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `true` once the executor is listening. The values arrive on the event outputs.
