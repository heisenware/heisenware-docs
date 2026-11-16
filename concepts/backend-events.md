---
description: >-
  How an App listens to machines, brokers and timers: event functions, event outputs and subscriptions.
---

# Backend events

Some things report by themselves: an MQTT message arrives, an OPC UA node changes, a timer ticks. An **event function** listens for them. It is called once and then delivers a value every time something happens, until it is released. Most event functions start with `on`: `onMessage`, `onChange`, `onTick`.

## Event outputs

An event function takes a **handler** as an input: the piece that receives the events. On the Flowboard, everything the handler receives appears as **event outputs** below the executor's return, one for each value the event delivers.

* The **return** only answers the call. For an event function it says that listening has begun.
* The **event outputs** carry the data. Each one works like any output: it shows the last value, takes wires and widget links, and carries its own [extensions](extensions-branching-and-errors.md).

<figure><img src="../.gitbook/assets/image (104).png" alt="An executor calling onBinaryMessage: its handler input, and below the return an event output carrying each message" width="563"><figcaption><p>The handler's values arrive on event outputs, not on the return</p></figcaption></figure>

So wire from the event output, not from the return. To run another executor on every event, drop the event output onto its trigger.

Where a function's documentation names what its events deliver, the event outputs carry those names. Otherwise right-click the handler and choose how many values to show.

{% hint style="info" %}
A **callback** is the one-time relative of an event: a handler the function calls once, for example when a long operation has finished. Its value arrives on an event output in the same way.
{% endhint %}

## Subscriptions

Triggering an event executor declares a **subscription**: the App's standing wish to receive those events, with these inputs, from this instance.

* **Start it with the App.** Give the executor the trigger **App Start**. A deployed App listens only to what its logic declares.
* **Triggering again is harmless.** The same inputs change nothing. Other inputs or another address move the subscription to the new target.
* **It heals by itself.** When the agent or the instance goes away and comes back, the subscription continues without the executor running again.
* **It pauses with the App.** A stopped App listens to nothing. Start a **Test** before you check whether events arrive.
* **It ends with its scope.** A subscription a user's click declared ends when that user's last connection closes. One declared at App start has no end of its own: stopping the App pauses it, the next start declares it again.

The executor shows the state of its subscription: listening, waiting (for example for an agent that is offline), paused, ended or failed, with the reason. **Stop listening** ends it until the next trigger.

## Who receives an event

An event arrives in the [scope](scopes.md) its subscription was declared in:

* Declared at App start, it is the App's: what it triggers runs once for everyone, and every user sees the result.
* Declared by a user's action, it is that user's: only that user's App reacts.

## Many devices, one executor

Set the instance in the [address](executors-and-instances.md#addresses-where-a-call-goes) to `*`, and one event executor listens to every instance of the class, including those created later. Its first event output then names the instance that sent the event, and the event's own values follow. Twenty identical machines need one executor, not twenty.

## Events and polling

Prefer an event where the source offers one. An event costs nothing while nothing happens and arrives at once. [Polling](triggers-and-wires.md#polling) is for sources that only answer when asked.
