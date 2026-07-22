# Modifier

Modifiers transform data on the fly within a flow. Apply a [JSONata](modifier.md#jsonata) or [JavaScript expression](modifier.md#javascript-expressions) to change the structure or value of an output before it reaches the next function, a database, the frontend, or a subsequent extension node (such as another modifier or a filter).

To add a modifier:

1. Click the + icon on the right side of a function output, filter, or existing modifier.
2. Select Modifier from the list.
3. Click the new modifier node (Click to edit...) to open the code editor and write your expression.

A modifier uses either JSONata or a JavaScript expression. Switch between types by right-clicking the modifier and selecting JSONata or Expression. Adjust the default type in the [App Builder settings](../../overview.md#app-builder-settings).

Click the modifier icon on the left to evaluate the modifier manually during development. The last result appears below the expression. Right-click also lets you add a comment to the modifier or delete it.

<figure><img src="../../../.gitbook/assets/image (52).png" alt=""><figcaption><p>A modifier extension node</p></figcaption></figure>

{% hint style="info" %}
#### Need help writing modifiers?

Read how to [use AI for modifiers](modifier.md#using-ai-for-modifiers) to generate JSONata or JavaScript logic with your favorite chatbot.
{% endhint %}

## JSONata

JSONata is a query and transformation language designed for JSON data. It is the preferred method for structural changes, filtering, and simple math. For a complete guide, see the [official JSONata documentation](https://docs.jsonata.org/overview.html).

* **Reference**: Use the `$` sign to refer to the value from the preceding output.
* **Implicit arguments**: JSONata modifiers automatically process the incoming data if the parentheses are left empty. For example, `$uppercase()` is equivalent to `$uppercase($)`.

### JSONata examples

<details>

<summary><strong>Example 1: Path selection and math</strong></summary>

Extracts a specific nested value from a PLC object and performs a calculation.

Data:

```json
{
  "payload": {
    "sensors": {
      "temp_c": 25
    }
  }
}
```

Modifier content:

```
payload.sensors.temp_c * 1.8 + 32
```

Return of the modifier:

```
77
```

<figure><img src="../../../.gitbook/assets/image (14).png" alt=""><figcaption></figcaption></figure>

</details>

<details>

<summary><strong>Example 2: Wrap a value in an object</strong></summary>

Takes the incoming value (`$`) and wraps it inside a JSON object with a key named `temp_sensor_1`.

Data:

```json
25.4
```

Modifier content:

```
{ "temp_sensor_1": $ }
```

Return of the modifier:

```json
{ "temp_sensor_1": 25.4 }
```

<figure><img src="../../../.gitbook/assets/image (17).png" alt=""><figcaption></figcaption></figure>

</details>

<details>

<summary><strong>Example 3: Implicit function usage</strong></summary>

Trims whitespace and converts a raw string to uppercase without explicitly naming the input variable.

Data:

```json
"maintenance_required"
```

Modifier content:

```
$uppercase()
```

Return of the modifier:

```json
"MAINTENANCE_REQUIRED"
```

<figure><img src="../../../.gitbook/assets/image (15).png" alt=""><figcaption></figcaption></figure>

</details>

<details>

<summary><strong>Example 4: Filtering an array</strong></summary>

Returns only the objects from a list that meet a specific status condition.

Data:

```json
[
  { "id": "A1", "status": "OK" },
  { "id": "B2", "status": "ERROR" }
]
```

Modifier content:

```
$[status="ERROR"]
```

Return of the modifier:

```json
{ "id": "B2", "status": "ERROR" }
```

<figure><img src="../../../.gitbook/assets/image (16).png" alt=""><figcaption></figcaption></figure>

</details>

## JavaScript expressions

This modifier type accepts any standard JavaScript expression that evaluates to a new value. Reference the reserved variable `x` to access the preceding data output. For more information, see the MDN documentation on [JavaScript expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators).

### JavaScript expression examples

<details>

<summary><strong>Example 1: Conditional status (ternary)</strong></summary>

Determines a status string based on a numeric threshold.

Data:

```json
85.5
```

Modifier content:

```javascript
x > 80 ? "Critical" : "Normal"
```

Return of the modifier:

```
"Critical"
```

<figure><img src="../../../.gitbook/assets/image (19).png" alt=""><figcaption></figcaption></figure>

</details>

<details>

<summary><strong>Example 2: Array mapping and enrichment</strong></summary>

Iterates through an array of objects to add a new property or modify existing ones using `.map()`.

Data:

```json
[
  { "part": "Bolt", "qty": 10 },
  { "part": "Nut", "qty": 5 }
]
```

Modifier content:

```javascript
x.map(item => ({
  ...item,
  available: item.qty > 0,
  lastChecked: DateTime.now().toISODate()
}))
```

Return of the modifier:

```json
[
  { "part": "Bolt", "qty": 10, "available": true, "lastChecked": "2026-02-12" },
  { "part": "Nut", "qty": 5, "available": true, "lastChecked": "2026-02-12" }
]
```

<figure><img src="../../../.gitbook/assets/image (18).png" alt=""><figcaption></figcaption></figure>

</details>

<details>

<summary><strong>Example 3: Multi-step logic (IIFE)</strong></summary>

Modifiers only support expressions. For more elaborate logic involving temporary variables, use the Immediately Invoked Function Expression (IIFE) pattern.

Data:

```json
{ "raw_value": 1024, "multiplier": 0.5 }
```

Modifier content:

```javascript
(() => {
  const base = x.raw_value;
  const factor = x.multiplier;
  const offset = 10;
  return (base * factor) + offset;
})()
```

Return of the modifier:

```json
522
```

<figure><img src="../../../.gitbook/assets/image (21).png" alt=""><figcaption></figcaption></figure>

</details>

<details>

<summary><strong>Example 4: Removing and adding properties in an array</strong></summary>

Use the spread operator (`...`) to reproduce existing entries while selectively removing or adding properties.

Data:

```json
[ { "a": 1, "b": 1, "c": 1 }, { "a": 2, "b": 2, "c": 2 } ]
```

Modifier content:

```javascript
x.map(y => ({
  ...y,         // Reproduces existing entry
  c: undefined, // Removes property c
  d: 'cool'     // Adds property d
}))
```

Return of the modifier:

```json
[ { "a": 1, "b": 1, "d": "cool" }, { "a": 2, "b": 2, "d": "cool" } ]
```

<figure><img src="../../../.gitbook/assets/image (24).png" alt=""><figcaption></figcaption></figure>

</details>

<details>

<summary><strong>Example 5: Processing multiple inputs (using <code>combine</code>)</strong></summary>

When using the `combine` function, the IIFE pattern cleanly handles multiple input sources stored in the `x` array.

Data (combined by the `combine` function):

```json
[
  [ { "name": "User1" } ], // x[0]
  [ { "asset": "CNC" } ]   // x[1]
]
```

Modifier content:

```javascript
(() => {
  const users = x[0]
  const assets = x[1]
  return {
    assigned_users: users,
    active_assets: assets
  }
})()
```

Return of the modifier:

```json
{
  "assigned_users": [ { "name": "User1" } ],
  "active_assets": [ { "asset": "CNC" } ]
}
```

<figure><img src="../../../.gitbook/assets/image (23).png" alt=""><figcaption></figcaption></figure>

</details>

<details>

<summary><strong>Example 6: Date calculations (using Luxon)</strong></summary>

Heisenware provides built-in support for the [Luxon](https://moment.github.io/luxon/) library via the `DateTime`, `Duration`, and `Interval` objects for complex date and time operations.

{% hint style="warning" %}
`Duration` and `Interval` are only available from version v91.
{% endhint %}

Here are some common modifier patterns:

#### 1. Calculating future or past dates (addition and subtraction)

Data:

```json
[
  { "startDate": "2026-01-01", "days": 5 },
  { "startDate": "2026-01-10", "days": 2 }
]
```

Modifier content:

```javascript
x.map(y => ({
   ...y,
   dueDate: DateTime.fromISO(y.startDate).plus({ days: y.days }).toISODate()
}))
```

Return of the modifier:

```json
[
  { "startDate": "2026-01-01", "days": 5, "dueDate": "2026-01-06" },
  { "startDate": "2026-01-10", "days": 2, "dueDate": "2026-01-12" }
]
```

<figure><img src="../../../.gitbook/assets/image (22).png" alt=""><figcaption></figcaption></figure>

#### 2. Calculating downtime (time differences)

Find the exact duration between two timestamps, such as a machine fault start and end time.

Data:

```json
[
  { "machine": "Press A", "faultStart": "2026-03-12T08:00:00Z", "faultEnd": "2026-03-12T10:15:00Z" }
]
```

Modifier content:

```javascript
x.map(y => ({
   ...y,
   downtime: DateTime.fromISO(y.faultEnd)
      .diff(DateTime.fromISO(y.faultStart), ['hours', 'minutes'])
      .toFormat("h 'hrs' m 'mins'")
}))
```

Return of the modifier:

```json
[
  { "machine": "Press A", "faultStart": "2026-03-12T08:00:00Z", "faultEnd": "2026-03-12T10:15:00Z", "downtime": "2 hrs 15 mins" }
]
```

***

#### 3. Formatting decimal labor hours

Convert raw decimal hours from timesheets or logs into standard `HH:mm` timecode using the `Duration` object.

Data:

```json
[
  { "worker": "Alice", "loggedDecimal": 8.75 },
  { "worker": "Bob", "loggedDecimal": 7.1 }
]
```

Modifier content:

```javascript
x.map(y => ({
   ...y,
   standardTime: Duration.fromObject({ hours: y.loggedDecimal }).toFormat("hh:mm")
}))
```

Return of the modifier:

```json
[
  { "worker": "Alice", "loggedDecimal": 8.75, "standardTime": "08:45" },
  { "worker": "Bob", "loggedDecimal": 7.1, "standardTime": "07:06" }
]
```

***

#### 4. Validating events against shifts (intervals)

Check if a specific event (like a sensor trigger) occurred within a defined time window or shift using the `Interval` object.

Data:

```json
[
  { "eventTime": "2026-03-12T14:30:00Z", "shiftStart": "2026-03-12T06:00:00Z", "shiftEnd": "2026-03-12T18:00:00Z" },
  { "eventTime": "2026-03-12T20:00:00Z", "shiftStart": "2026-03-12T06:00:00Z", "shiftEnd": "2026-03-12T18:00:00Z" }
]
```

Modifier content:

```javascript
x.map(y => ({
   ...y,
   occurredDuringShift: Interval.fromDateTimes(
      DateTime.fromISO(y.shiftStart),
      DateTime.fromISO(y.shiftEnd)
   ).contains(DateTime.fromISO(y.eventTime))
}))
```

Return of the modifier:

```json
[
  { "eventTime": "2026-03-12T14:30:00Z", "shiftStart": "...", "shiftEnd": "...", "occurredDuringShift": true },
  { "eventTime": "2026-03-12T20:00:00Z", "shiftStart": "...", "shiftEnd": "...", "occurredDuringShift": false }
]
```

***

#### 5. Converting UTC sensor data to local time

IoT devices typically send data in UTC. Convert this to a readable local format for UI dashboards.

Data:

```json
[
  { "sensorId": "Temp-01", "utcTimestamp": "2026-03-12T07:43:50Z" }
]
```

Modifier content:

```javascript
x.map(y => ({
   ...y,
   localFormatted: DateTime.fromISO(y.utcTimestamp).toLocal().toFormat("dd. MMM yyyy, HH:mm:ss")
}))
```

Return of the modifier:

```json
[
  { "sensorId": "Temp-01", "utcTimestamp": "2026-03-12T07:43:50Z", "localFormatted": "12. Mar 2026, 08:43:50" }
]
```

</details>

<details>

<summary><strong>Example 7: Round robin (using <code>combine</code>)</strong></summary>

Sometimes you want to extract items of an array in a round-robin fashion. Use a `combine` function in which you link the modifier's output back to the second argument:

<figure><img src="../../../.gitbook/assets/image (503).png" alt=""><figcaption></figcaption></figure>

Data:

```yaml
[a, b, c]
```

Modifier content:

```javascript
(() => {
  const [arr, prev] = x
  const last = prev ? prev : arr[0]
  const index = prev ? arr.indexOf(last) : -1
  const next = arr[(index + 1) % arr.length]
  return next
})()
```

Return of the modifier:

```
a // when triggered first time
b // second time
c // third time
a // fourth time
```

</details>

## Using AI for modifiers

Use AI chatbots (ChatGPT, Claude, Gemini) to generate or optimize your modifiers. This helps especially with complex transformations where you need to reshape large JSON objects on the fly.

For best results, copy this article as context for the AI. Use the Copy button at the top of the page or the Open in ChatGPT / Open in Claude buttons in the top navigation bar.

#### Recommended AI prompt

Alternatively, copy and paste this prompt into your AI so it understands the Heisenware environment and its variable references.

```
I am working in Heisenware, a node-based visual programming tool for industrial applications. 
I need a "modifier" expression that transforms data on the fly between functions.

Full documentation: https://docs.heisenware.com/app-builder/build-backend/extension-nodes/modifier.md

Rules:
* A modifier is a single expression that returns the transformed value. No statements or variable declarations.
* JSONata: the input data is referenced as $. Functions with empty parentheses () automatically process the incoming data, e.g. $uppercase().
* JavaScript: the input data is referenced as x. For multi-step logic with temporary variables, use an IIFE: (() => { ... })().
* JavaScript dates: use the Luxon library via the DateTime, Duration, and Interval objects.
* Unless I say otherwise, pick the simpler of JSONata or JavaScript for the task and tell me which type to select.
* Reply with the expression only, no explanation, no markdown fences.

My input data (sample):
[Paste a sample of the data arriving at the modifier here.]

My task:
[Describe your transformation, e.g., "Extract temp_c from each object in the array and calculate the average."]
```
