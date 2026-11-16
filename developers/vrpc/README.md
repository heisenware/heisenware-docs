---
description: >-
  The open-source RPC framework the whole platform talks over, and how your own
  code joins it.
---

# VRPC

VRPC (Variadic Remote Procedure Call) makes the classes of one program callable from another, over a network, without REST routes, schemas or WebSocket plumbing. It is open source under the MIT licence, developed by Heisenware, and it is what every part of the platform speaks: frontend to backend, service to service, and the platform to an agent on a shop floor (see [Architecture](../README.md)).

You need it when you bring your own code to the platform. Everything else the platform hides.

The platform runs **VRPC 3.18** for JavaScript. The family:

* **Node.js and the browser**: [vrpc-js](https://github.com/heisenware/vrpc-js)
* **C++**: [vrpc-hpp](https://github.com/heisenware/vrpc-hpp)
* **Python**: [vrpc-py](https://github.com/heisenware/vrpc-py)
* **Arduino and ESP32**: [vrpc-arduino](https://github.com/heisenware/vrpc-arduino)
* **React hooks**: [vrpc-react](https://github.com/heisenware/vrpc-react)

The full documentation, including the protocol specification every implementation follows, is at [vrpc.io](https://vrpc.io).

## The idea

You write a plain class. No API router, no network loop, no serialization. VRPC reads the class at run time, publishes what it offers, and lets other programs call it. A caller gets a proxy object with the same functions and the same signatures; calling one is a local asynchronous call that happens to run somewhere else.

Three parts do it:

* **`VrpcAdapter`**: reads your classes. It finds the public functions, the constructor and the JSDoc, and builds the network adapter from them. Nothing in your code changes.
* **`VrpcAgent`**: the program that offers the adapted classes. It connects out to an MQTT broker, announces its classes and instances, takes calls and returns results or errors.
* **`VrpcClient`**: the program that uses them. It makes the proxy objects and finds by itself which agent hosts a class.

<figure><img src="../../.gitbook/assets/image (40).png" alt="The VrpcAdapter reading a class and generating its network adapter"><figcaption></figcaption></figure>

### Why a broker

Agents and clients never talk to each other. Both connect out to one MQTT broker and stay connected.

* Neither needs to know where the other is, and neither needs an address of its own.
* Outbound-only connections cross NAT and firewalls: nothing has to be opened inbound, no VPN, no port forwarding.
* An agent announces its classes; clients pick them up as they appear. Start and stop agents anywhere; as long as they reach the same broker, clients find them.
* A connection that breaks comes back by itself.

<figure><img src="../../.gitbook/assets/image (41).png" alt="VrpcAdapter, VrpcAgent and VrpcClient around a central MQTT broker"><figcaption></figcaption></figure>

## A complete example

{% stepper %}
{% step %}
### Write the class

```javascript
// calculator.js
class Calculator {
  add (a, b) {
    return a + b
  }
}
module.exports = Calculator
```
{% endstep %}

{% step %}
### Offer it

Register the class and serve it under an agent name.

```javascript
const { VrpcAdapter, VrpcAgent } = require('vrpc')

VrpcAdapter.register(require('./calculator'))

new VrpcAgent({
  domain: 'acme.default',
  agent: 'calculator-agent',
  broker: 'mqtts://acme.heisenware.cloud:8883',
  username: 'calculator@acme.default',
  password: '<the integration password>'
})
  .serve()
  .then(() => console.log('serving'))
```

The username and password come from a VRPC integration of the workspace: App Manager → [Integrations](../../app-manager/integrations.md) → **Add** → VRPC client.
{% endstep %}

{% step %}
### Connect a client

```javascript
const { VrpcClient } = require('vrpc')

const client = new VrpcClient({
  domain: 'acme.default',
  broker: 'mqtts://acme.heisenware.cloud:8883',
  username: '<integration>',
  password: '<password>'
})
await client.connect()
```
{% endstep %}

{% step %}
### Make an instance and call it

```javascript
const calculator = await client.create({
  agent: 'calculator-agent',
  className: 'Calculator',
  instance: 'my-calculator'
})

console.log(await calculator.add(10, 20)) // 30
```

Name the agent: a client that was not constructed with one has no default. The instance keeps its name and its state until it is deleted, and any other client reaches it by that name with `client.getInstance('my-calculator')`.
{% endstep %}
{% endstepper %}

Serve this agent against your workspace and `Calculator` appears in the [Functions explorer](../../app-builder/explorers/functions.md) under `calculator-agent`, with `add` as a two-input executor. That is all an [add-on](../custom-add-ons.md) is.

## Event functions

A function that calls a handler again and again, rather than answering once, returns a **registration**: an object that tells the agent how to undo the call, and optionally how to greet a listener that arrives later.

```javascript
/**
 * Calls back with every reading, beginning with the current one
 *
 * @param {Function} handler
 * @returns {Registration}
 */
onReading (handler) {
  this._emitter.on('reading', handler)
  return {
    [Symbol.dispose]: () => this._emitter.off('reading', handler),
    greet: greeting => greeting(this._reading)
  }
}
```

The agent calls such a function once however many clients listen, hands every event to every listener, and releases it when the last one leaves. On the Flowboard that is what makes an executor's event outputs: see [Backend events](../../concepts/backend-events.md).

Two things declare an event function, and nothing else does: `@returns {Registration}`, or a name of `on` followed by a capital letter. The engine, the Builder, the client and the assistant all read the same rule.

## What the platform runs on the bus

Every message under a workspace begins with that workspace's domain, `<account>.<workspace>`. Under it, these agents are always there:

| Agent | What it offers |
| --- | --- |
| `builder-backend` | the design version of every App in the workspace |
| `app-backend-<appId>` | one released App, one agent per App |
| `Connectors`, `Utility Functions`, `Templates`, `Media Server` | the platform's own classes |
| the agents you install | your [native, Docker and LXC agents](../../concepts/agents-and-where-code-runs.md) and your [add-ons](../custom-add-ons.md), each under its own name |

An App's own values live on singleton instances. In the Builder they carry the App's id: `variables-<appId>` and `endpoints-<appId>` of the classes `Variables` and `Endpoints` on `builder-backend`. In a release the same records are served under the well-known names `variables` and `endpoints` on `app-backend-<appId>`, so that code outside the platform can address them without knowing an id. `themes` works the same way.

Instance names are global per agent and only per agent: the builder backend and a released App hold instances of the same name, and they are different objects. Always name the agent.

## Declare what changes nothing

A function whose call changes nothing another caller, a device or storage could observe - no instance state, no stored record, no output of a device, no message to others - says so in its documentation. Reading a sensor counts as changing nothing; calibrating it while reading does not.

| Language | Declaration |
| --- | --- |
| JavaScript and TypeScript | the JSDoc tag `@nosideeffects` |
| Python | a `:nosideeffects:` field in the docstring |
| C++ | a function declared `const`, by the language's own promise |

```javascript
class Calculator {
  /**
   * The sum of two numbers
   *
   * @nosideeffects
   */
  add (a, b) {
    return a + b
  }
}
```

The class info then carries `"nosideeffects": true` for the function, and a connection that may only observe - a read-only local MCP server, for example - can call it. A function without the declaration counts as having side effects and stays out of such a connection's reach. Declare only what holds. For code whose source you cannot change, declare at registration: `VrpcAdapter.register(Vendor, { meta: { read: { nosideeffects: true } } });`.
