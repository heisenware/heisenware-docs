---
description: >-
  A piece of the Flowboard published as a function of your own: when a subflow earns its place, and how its blueprint and callers work.
---

# Subflows

A **subflow** is a piece of your own logic published as a function. On the Flowboard it behaves like any other executor: it has inputs, a trigger and an output, and you wire it into your flows the same way.

## When a subflow earns its place

Reach for one when either of these is true, and leave the logic flat otherwise.

* **The same steps are needed in several flows.** One subflow instead of three copies: fix it once, and every place follows.
* **Several runs must not get in each other's way.** A wired flow shares one [scope](scopes.md) from end to end, so ten readings travelling through the same chain of executors at once would overwrite each other's intermediate values. **Each call of a subflow runs in a scope of its own.** This is the only isolation of that kind the platform has, and the reason a subflow is sometimes the only correct answer.

Like a function in code, a badly cut subflow costs more than it saves. Never wrap a single executor in one.

## Blueprint and callers

A subflow has two sides, and the difference matters.

* The **blueprint** is the section that holds the logic. It carries the signature: which inputs go in, where a call starts, what comes back. The blueprint exists so you can debug the logic visually, and it runs on the screen you are watching. **Your App's logic never triggers the blueprint.**
* A **caller** is what your flows use. Each call runs the blueprint's logic in its own call scope.

Edit the blueprint, and every caller follows. That is the point: the logic lives in one place.

## Making one

{% stepper %}
{% step %}
**Add a subflow**

Drag **New Subflow** from the Flowboard's toolbar onto the board. A named frame appears. A section that already holds the right executors can be turned into one instead, with **Activate Subflow** on the section.
{% endstep %}

{% step %}
**Put the logic inside**

Add the executors that make up the logic to the frame, exactly as you build anything else.
{% endstep %}

{% step %}
**Define what goes in and out**

Wire your logic to the inputs, the trigger and the output of the signature node inside the frame. That node is the function's interface.
{% endstep %}

{% step %}
**Name it**

Edit the frame's title. The name follows into the Functions explorer, under Custom.
{% endstep %}
{% endstepper %}

To use it, drag it from the Functions explorer onto the Flowboard like any other function.

## Timeouts

A call waits 25 seconds for its answer. Where the logic inside takes longer, give the blueprint a longer timeout, and every caller follows.

A call that runs out of time fails the flow that called it, while the logic inside runs on. An agent that goes offline inside the subflow fails the call with its own message.

Under a [loop](when-streams-meet.md#loops-once-per-element), each element gets the full waiting time. Looping over a caller is how each element of a list gets several steps of its own, one after the other.

## Subflows and sections

A [section](../app-builder/flowboard/README.md) is a frame around executors: it tidies the Flowboard and nothing more. A subflow is a working unit with an interface that other flows call. Use sections to arrange, subflows to reuse.
