# Filter

The filter acts as a conditional gate for your flow. It branches logic or halts it based on a condition and is the primary way to implement `if/else` scenarios in Heisenware.

To add a filter:

1. Click the + icon on the right side of a function output, modifier, or existing filter.
2. Select Filter from the list.
3. Click the new filter box (_Click to edit…_) to open the code editor and write your condition.

<figure><img src="../../../.gitbook/assets/image (53).png" alt=""><figcaption><p>randomInteger function with filter extension node</p></figcaption></figure>

## How filters work

A filter evaluates a JavaScript expression that must return a boolean value (`true` or `false`). The input value from the preceding output is available as the reserved variable `x`.

Click the filter icon on the left to evaluate the filter manually during development. The last result appears below the expression.

### Logical gate

If the result is `true`, the data passes on to the next node following the filter. If `false`, the flow halts at this point.

<div align="center"><figure><img src="../../../.gitbook/assets/image (295).png" alt=""><figcaption></figcaption></figure></div>

### Branching logic

Use the `true` and `false` states of the filter to trigger separate logic paths. For example, use the `true` state to trigger another function.

<figure><img src="../../../.gitbook/assets/image (510).png" alt=""><figcaption></figcaption></figure>

{% hint style="warning" %}
#### Falsy values halt the flow

A filter condition that evaluates to a falsy value (e.g., `false`, `0`, `null`, `""`) stops the execution of the flow.
{% endhint %}

## Filter examples

### Example 1: Threshold monitoring

Checks if a sensor value exceeds a critical limit.

Data:

```json
{
  "temperature": 92.5,
  "unit": "°C"
}
```

Filter content:

```javascript
x.temperature > 90
```

Return of the filter: `true`

<figure><img src="../../../.gitbook/assets/image (506).png" alt=""><figcaption></figcaption></figure>

### Example 2: Industrial error detection

Inspects a status message for specific keywords like "Error".

Data:

```json
"System Error: PLC Communication Timeout"
```

Filter content:

```javascript
x.includes('Error')
```

Return of the filter: `true`

<figure><img src="../../../.gitbook/assets/image (507).png" alt=""><figcaption></figcaption></figure>

### Example 3: Validating array data

Ensures that an array contains data before the flow processes it.

Data:

```json
[]
```

Filter content:

```javascript
x.length > 0
```

Return of the filter: `false`

<figure><img src="../../../.gitbook/assets/image (509).png" alt=""><figcaption></figcaption></figure>

## Using AI for filters

Use AI chatbots like ChatGPT, Claude, or Gemini to generate complex filter logic. Filters use standard JavaScript, so provide the AI with your data structure to get an immediate result.

For best results, copy this article as context for the AI. Use the Copy button at the top of the page or the Open in ChatGPT / Open in Claude buttons in the top navigation bar.

#### Recommended AI prompt

Copy and paste this prompt into your AI so it understands the Heisenware environment and its variable references.

```
I am working in Heisenware, a node-based visual programming tool for industrial applications. 
I need a "Filter" expression that acts as a conditional gate in a flow.

Full documentation: https://docs.heisenware.com/app-builder/build-backend/extension-nodes/filter.md

Rules:
* A filter is a single JavaScript expression that must return true or false. JSONata is not supported here.
* The input data is referenced as x.
* If the result is falsy, the flow halts at the filter.
* No statements or variable declarations. For multi-step logic, use an IIFE: (() => { ... })().
* Reply with the expression only, no explanation, no markdown fences.

My input data (sample):
[Paste a sample of the data arriving at the filter here.]

My task:
[Describe your condition, e.g., "Only continue if pressure is between 2.0 and 4.5 bar."]
```
