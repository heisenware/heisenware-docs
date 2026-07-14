---
description: >-
  This page introduces the core concepts, philosophy, and architectural
  components of the open-source VRPC framework.
---

# VRPC

{% hint style="info" %}
#### The engine behind Heisenware

VRPC (Variadic Remote Procedure Call) is the core communication engine of the Heisenware platform (see [High-level architecture](../high-level-architecture/)). All interactions – including frontend-to-backend logic, inter-microservice calls, and remote edge device connections – rely on VRPC. Understanding this protocol lets you easily integrate custom code into the Heisenware platform.
{% endhint %}

VRPC is an asynchronous Remote Procedure Call (RPC) framework that makes your existing code available over a network. We license VRPC under the permissive MIT open-source license.

The framework supports multiple programming languages:

* **Node.js:** [vrpc-js](https://github.com/heisenware/vrpc-js)
* **C++:** [vrpc-hpp](https://github.com/heisenware/vrpc-hpp)
* **Arduino:** [vrpc-arduino](https://github.com/heisenware/vrpc-arduino)
* **React:** [vrpc-react](https://github.com/heisenware/vrpc-react)
* **Python:** [vrpc-py](https://github.com/heisenware/vrpc-py)
* **R:** [vrpc-r](https://github.com/heisenware/vrpc-r)

For more details on the libraries, visit the official [VRPC website](https://vrpc.io).

## What is VRPC?

VRPC lets you expose classes written in Python, Node.js, or C++ to remote clients without modifying their internal business logic. Remote clients interact with these classes as if they were running locally in their own process, even if the code runs on a physical machine elsewhere.

The core philosophy of VRPC is non-intrusive integration. You focus on writing clean, well-defined business logic classes first. VRPC then adapts this code for network communication rather than forcing you to structure your application around network constraints.

## Core concepts

The VRPC architecture consists of a few decoupled, cooperating components:

### VrpcAdapter

The `VrpcAdapter` is the introspection engine. It analyzes your classes using runtime reflection, reads their public methods and JSDoc documentation, and automatically generates the network communication adapter. This layer abstracts away the complexity of wrapping your code for network access.

<figure><img src="../../.gitbook/assets/image (40).png" alt="Visual representation of the VRPC Adapter code generation flow"><figcaption></figcaption></figure>

### VrpcAgent

A `VrpcAgent` is a server-side process that hosts your adapted code. You run a `VrpcAgent` on the machine where your code executes (see [Agents](../../app-builder/build-backend/agents/)). The `VrpcAgent` manages the following tasks:

* Connects to a central MQTT message broker using an outbound-only connection.
* Advertises its available classes and active instances to the network.
* Listens for incoming RPC requests from clients.
* Uses the `VrpcAdapter` to execute the requested methods on the target instances.
* Returns results or execution errors to the calling client.

### VrpcClient

The `VrpcClient` library connects backend services, frontends, or external systems to the central message broker to interact with your remote code. Its primary job is to generate dynamic proxy objects.

### Proxy objects

When you request a client to instantiate or retrieve a remote class, it returns a local proxy object rather than the actual object. This proxy object exposes the exact same methods and signatures as the underlying class.

Calling a method on the proxy object executes the following sequence:

1. The client packages the method call and arguments into a standard message envelope.
2. The client transmits the message across the broker to the hosting `VrpcAgent`.
3. The `VrpcAgent` executes the real method on the target instance.
4. The broker routes the serialized return value or execution error back to your proxy method.

This makes remote interaction function exactly like a local asynchronous operation.

### The MQTT broker

Heisenware uses MQTT as the core communication backbone for VRPC. The broker acts as a central router for all control and data traffic:

* Agents and clients connect to the broker using outbound-only connections. They do not require knowledge of each other's IP addresses or network locations.
* Outbound-only connections enable seamless NAT traversal, eliminating the need to open incoming firewall ports or manage complex VPN configurations.
* Agents publish metadata about their available classes, and clients subscribe to these catalogs dynamically.

This decoupled design ensures high scalability and resilience. You can start or stop Agents anywhere on your network; as long as they register with the same broker, clients discover and use them automatically.

<figure><img src="../../.gitbook/assets/image (41).png" alt="High-level architecture block diagram showing VrpcAdapter, VrpcAgent, and VrpcClient layers"><figcaption></figcaption></figure>

## Typical workflow

Follow this sequence to write, register, and execute custom code over the network:

{% stepper %}
{% step %}
### Write your business logic

Create a standard class using your preferred language (such as Node.js or Python). Do not write any API routers, network loops, or serialization code.

```javascript
// calculator.js
class Calculator {
  add(a, b) {
    return a + b;
  }
}
module.exports = Calculator;
```
{% endstep %}

{% step %}
### Register with the adapter

Register your class with the `VrpcAdapter` to automatically analyze its methods and expose its metadata.

```javascript
const { VrpcAdapter } = require('vrpc');
const Calculator = require('./calculator');

VrpcAdapter.register(Calculator);
```
{% endstep %}

{% step %}
### Run the Agent

Instantiate and start a `VrpcAgent` on the host machine to establish a secure connection to the central broker and advertise your class.

```javascript
const { VrpcAgent } = require('vrpc');

async function main() {
  const agent = new VrpcAgent({
    domain: 'your-domain',
    agent: 'calculator-agent',
    broker: 'mqtts://broker.heisenware.cloud'
  });
  await agent.start();
}
main();
```
{% endstep %}

{% step %}
### Connect the client

Configure a `VrpcClient` in your frontend App or backend service to connect to the same broker and domain.

```javascript
const { VrpcClient } = require('vrpc');

async function main() {
  const client = new VrpcClient({
    domain: 'your-domain',
    broker: 'mqtts://broker.heisenware.cloud'
  });
  await client.connect();
}
main();
```
{% endstep %}

{% step %}
### Create the proxy instance

Use the client to instantiate a remote instance. The client automatically resolves which Agent hosts the class and maps its methods dynamically.

```javascript
const calculatorProxy = await client.create({
  className: 'Calculator',
  instance: 'my-calculator'
});
```
{% endstep %}

{% step %}
### Execute remote methods

Call methods on the proxy object exactly like a local object. All network packaging, remote execution, and output serialization occur asynchronously under the hood.

```javascript
const result = await calculatorProxy.add(10, 20);
console.log(result); // Outputs: 30
```
{% endstep %}
{% endstepper %}
