---
description: >-
  Modifier, filter, recorder and error handler: steps on an output that reshape, gate, record and catch, and how to branch with them.
---

# Extensions, branching and errors

An **extension** is a step attached to an output that works on its value. Extensions need no executor of their own. They attach to a return, to an [event output](backend-events.md) or to another extension, and so chain into a pipeline: filter first, then reshape, then record.

Except for the recorder, an extension is an output in its own right. Wire it to inputs and triggers, link it to widgets, or publish it into a [variable](variables-and-endpoints.md), exactly like the output it sits on.

## The four kinds

| Extension | What it does |
| --- | --- |
| [**Modifier**](../app-builder/flowboard/modifier.md) | Reshapes the value with a JavaScript or JSONata expression. |
| [**Filter**](../app-builder/flowboard/filter.md) | Lets the value through or stops the branch. This is the platform's "if". |
| [**Recorder**](../app-builder/flowboard/recorder.md) | Keeps the value's history in the timeseries database. |
| [**Error handler**](../app-builder/flowboard/error-handler.md) | Receives the error when the call fails. |

* **Add**: click **+** on an output, an event output or an extension and choose the kind. Several extensions on the same output work side by side, each starting its own branch.
* **Chain**: add an extension to an extension. An error handler sits directly on an output, never behind another extension.
* **Try**: an extension shows its last result below it. Click the icon of a modifier or filter to evaluate it again while you build.
* **Delete**: right-click the extension and choose **Delete**.

## Expressions

A modifier or a filter holds one **expression** that works on `x`, the value that arrives:

```javascript
x.temperature > 80
```

* It is one expression, not a script. For several steps, wrap them in a function that is called at once: `(() => { const rows = x.filter(...); return rows.map(...) })()`.
* Variables are available by name: `x.machine === $machine`.
* Luxon's `DateTime`, `Duration` and `Interval` are available for dates, beside JavaScript's own `Date`, `Intl`, `JSON` and `Math`.
* Write expressions to be read: line breaks, indentation and `//` comments are free.
* Keep a JavaScript expression quick: its backend waits while it runs. One that runs over 1 second is a warning in the log; one that runs over 30 seconds ends its backend, which restarts, and the log names the executor, the item and the expression.
* JSONata is the alternative language for pure reshaping.

## What a filter passes on

A filter's value is what it lets through. When the expression is true, everything behind the filter receives the value that arrived. When it is false, nothing behind it receives anything, and the filter keeps the last value it let through.

For a true or false that must also turn false again, such as a widget's `visible`, use a modifier with the same expression beside the filter.

## Branching

* **If and else**: two filters on the same output, one with the condition, one with its opposite. Each feeds its branch.
* **Several cases**: a modifier that computes the case, and one filter per case behind it.

Nothing else is needed.

{% hint style="warning" %}
A branch that a filter can stop must not feed an **all updated** join: the join would wait for it forever. See [When streams meet](when-streams-meet.md#joining-branches-of-one-impulse).
{% endhint %}

## Errors

When a call fails:

* the executor's [status](executors-and-instances.md#status) turns red and shows the message, until the executor runs again: a value written to an input does not clear it;
* every error handler on its return receives `{ message, cause, originalPayload }`;
* the executor produces **no output**. Nothing behind it runs, and the branch ends there.

So an error does not travel down the flow as a strange value. It either reaches an error handler or stops.

* **Prevent** where you can: give inputs defaults, or put a filter in front, where a missing value would make the function fail.
* **Report** where a person must know: link the error handler to a toast. See [Pages and App actions](pages-and-app-actions.md#on-a-value).
* **Retry** with a `Timer`, not by wiring an output back to its start.

Inside a [loop](when-streams-meet.md#loops-once-per-element) a failing element becomes its error message in the list of results, and the loop goes on. A failure inside a [subflow](subflows.md) that no error handler took there fails the call, and the caller's error handler receives it.

A released App's failures are written to its log, each with the executor and the message.
