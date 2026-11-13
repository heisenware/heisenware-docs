# Filter

The filter acts as a conditional gate for your flow. It branches logic or halts it based on a condition and is the primary way to implement `if/else` scenarios in Heisenware.

To add a filter:

1. Click the + icon on the right side of an executor's output, modifier, or existing filter.
2. Select **Filter** from the list.
3. Click the new filter box (_Click to edit…_) to open the code editor and write your condition.

<figure><img src="../../.gitbook/assets/image (53).png" alt=""><figcaption><p>randomInteger executor with filter extension node</p></figcaption></figure>

## How filters work

A filter evaluates a JavaScript expression that must return a boolean value (`true` or `false`). The value from the preceding output is available as `x`.

Click the filter icon on the left to evaluate the filter manually during development.

While a flow runs, the filter shows live what happened to the latest value. The value below the expression is always the one that just arrived. After a pass, the right edge of the filter stands open. After a block, a copper bar closes it: that value stopped here, and a variable on the filter still holds the last value that passed.

### Logical gate

If the result is `true`, the data passes on unchanged: the nodes after the filter, every connection drawn from it, widgets bound to it, and its page and action links all get the data that arrived. If `false`, the flow halts at this point and nothing behind the filter runs. A widget bound to the filter keeps showing the last value that passed.

<div align="center"><figure><img src="../../.gitbook/assets/image (295).png" alt=""><figcaption></figcaption></figure></div>

### Branching logic

Connect another executor to the filter to run it when the data passes. For a second path, add a second filter with the opposite condition: `x > 90` for one path, `x <= 90` for the other.

<figure><img src="../../.gitbook/assets/image (510).png" alt=""><figcaption></figcaption></figure>

{% hint style="warning" %}
#### Falsy values halt the flow

A filter condition that evaluates to a falsy value (e.g., `false`, `0`, `null`, `""`) stops the execution of the flow.

This concerns the condition, not the data. With the condition `x === 0`, the value `0` passes, and a page or action link on the filter fires on it.
{% endhint %}

{% hint style="info" %}
#### Need a true or false value?

A filter hands on data, not its result, and a block sends nothing. To show or store a value that also turns false, such as a widget's visibility, add a [modifier](modifier.md) with the same expression next to the filter.
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

The data passes.

<figure><img src="../../.gitbook/assets/image (506).png" alt=""><figcaption></figcaption></figure>

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

The data passes.

<figure><img src="../../.gitbook/assets/image (507).png" alt=""><figcaption></figcaption></figure>

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

The filter blocks, and the flow halts.

<figure><img src="../../.gitbook/assets/image (509).png" alt=""><figcaption></figcaption></figure>

## Using AI for filters

The assistant in the App Builder writes filters for you. Tell it what data arrives and when the flow should go on, and it adds the filter to the output.

Another AI tool needs this page as context: use the Copy button at the top of the page, or the Open in ChatGPT and Open in Claude buttons in the top navigation bar.

#### Recommended AI prompt

Or paste this prompt into the other AI tool, so it knows how filters work in Heisenware.

```
I am working in Heisenware, a node-based visual programming tool for industrial applications. 
I need a filter expression that acts as a conditional gate in a flow.

Full documentation: https://docs.heisenware.com/app-builder/flowboard/filter.md

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
