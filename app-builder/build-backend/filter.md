# Filter

The filter acts as a conditional gate for your flow, allowing you to branch logic based on specific conditions. It is the primary method for implementing `if/else` scenarios within Heisenware.

Filters are part of the function extensions. To add a filter to your function:

1. Click the `+` icon on the right side of any function output, modifier, or existing filter.
2. Select filter from the list.
3. A new filter box will appear where you can write your JavaScript logic.

<figure><img src="../../.gitbook/assets/image (505).png" alt=""><figcaption></figcaption></figure>

## When to use

A filter evaluates a JavaScript expression that must return a boolean value (`true` or `false`). The input value from the preceding output is available as the reserved variable `x`.

### **Logical gate**

If the result is `true`, the data is passed on to the next modifier following that filter; if `false`, the data flow is halted at this point.

<div align="center"><figure><img src="../../.gitbook/assets/image (295).png" alt=""><figcaption></figcaption></figure></div>

### **Branching logic**

The `true` and `false` states of the filter can be used to trigger separate logic paths. For example, you can use the `true` state to trigger another function.

<figure><img src="../../.gitbook/assets/image (510).png" alt=""><figcaption></figcaption></figure>

{% hint style="warning" %}
A filter condition that evaluates to a "falsy" value (e.g., `false`, `0`, `null`, `""`) stops the execution of the flow. This is the only way to interrupt a flow and is essential when building complex backend logic.
{% endhint %}

## JS filter examples

Unlike [modifiers](modifier.md), filters strictly require an expression that evaluates to a boolean state (`true` or `false`).

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

Return of the filter: `true`

<figure><img src="../../.gitbook/assets/image (507).png" alt=""><figcaption></figcaption></figure>

### Example 3: Validating array data

Ensures that an array contains data before attempting to process it.

Data:

```json
[]
```

Filter content:

```javascript
x.length > 0
```

Return of the filter: `false`

<figure><img src="../../.gitbook/assets/image (509).png" alt=""><figcaption></figcaption></figure>

## Using AI for filters

You can use AI chatbots like ChatGPT, Claude, or Gemini to generate complex filter logic. Since filters use standard JavaScript, you can provide the AI with the context of your data structure to get an immediate result.

To optimize results, copy this article as context for the AI. Use the Copy button at the top of the page or the direct Open in ChatGPT or Open in Claude buttons located in the top navigation bar.

#### Recommended AI prompt

Copy and paste this prompt into your AI to ensure it understands the Heisenware environment and specific variable references.

```
I am working in Heisenware, a node-based visual programming tool for industrial applications. I need to write a "Filter" expression.

Context:
* Heisenware filters evaluate a JavaScript expression.
* The expression must return true or false.
* The input data is referenced as x.
* I need a concise expression that halts the flow if a condition is not met.

My Task:
[Describe your condition here, e.g., "I have an object with a 'pressure' value. I only want the flow to continue if the pressure is between 2.0 and 4.5 bar."]
```
