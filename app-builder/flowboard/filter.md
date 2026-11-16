# Filter

A filter is a gate. It lets a value through or stops the branch there, and it is how you write "if" in Heisenware.

To add one:

1. Click the **+** on the right of an output, an event output or an extension.
2. Choose **Filter**.
3. Click the new node (_Click to edit…_) to open the editor and write your condition.

<figure><img src="../../.gitbook/assets/image (53).png" alt=""><figcaption><p>randomInteger executor with filter extension node</p></figcaption></figure>

## How filters work

A filter holds one JavaScript expression over `x`, the value that arrives. JSONata is not available here. The expression follows the same [contract](modifier.md#the-expression-contract) as a modifier's: one expression, variables available as `$name`, an IIFE for several steps.

Click the icon on the left of the node to evaluate the filter while you build. The right-click menu offers **Make variable…**, **Add Comment** and **Delete**.

While a flow runs, the filter shows live what happened to the latest value. The value below the expression is always the one that just arrived. After a pass, the right edge of the filter stands open. After a block, a copper bar closes it: that value stopped here, and a variable on the filter still holds the last value that passed.

### A filter's value is what it lets through

The filter does not pass on its own true or false. It passes **the value that arrived**, and only when the expression is truthy.

On a pass, everything behind the filter receives that value: the next extensions, every wire drawn from it, bound widgets, and its page and action links. On a block, nothing behind it receives anything and nothing behind it runs. A widget bound to the filter keeps showing the last value that passed.

This is why a filter feeds an argument, an address part or an instance box exactly like an output does.

<div align="center"><figure><img src="../../.gitbook/assets/image (295).png" alt=""><figcaption></figcaption></figure></div>

### Branching logic

Connect another executor to the filter to run it when the data passes. For a second path, add a second filter with the opposite condition: `x > 90` for one path, `x <= 90` for the other.

A trigger fed from a filter reads what passed, not whether it passed: *true* fires on every pass, *change* only when the value that passed differs from the one before.

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

## Letting the assistant write it

Tell the [assistant](../assistant.md) what arrives and when the flow should go on, and it writes the filter onto the output. Select the output first, so it knows which one you mean.

For an AI outside Heisenware, hand it this page: the Copy button at the top of the page, or **Open in ChatGPT** and **Open in Claude** in the top navigation bar.
