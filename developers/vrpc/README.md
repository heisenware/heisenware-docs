# VRPC

{% hint style="success" %}
VRPC is the engine behind Heisenware. All communication including frontend-backend, inter-microservice and also to external entities is based on VRPC. Understanding this protocol allows you to integrate any code to the Heisenware platform easily.
{% endhint %}

Welcome to VRPC! This document will introduce you to the core concepts of the VRPC framework, its philosophy, and its main components. By the end, you'll have a solid understanding of how VRPC works and how it can help you build powerful, distributed systems with ease.

{% hint style="info" %}
For the ultimate reference, please visit the [VRPC Website (vrpc.io)](https://vrpc.io)
{% endhint %}

We licensed VRPC with the most flexible open-source licence MIT. Feel free to do with it whatever is useful for you. Its available for different programming languages:

- Node.js: [https://github.com/heisenware/vrpc-js](https://github.com/heisenware/vrpc-js)
- C++: [https://github.com/heisenware/vrpc-hpp](https://github.com/heisenware/vrpc-hpp)
- Arduino: [https://github.com/heisenware/vrpc-arduino](https://github.com/heisenware/vrpc-arduino)
- React: [https://github.com/heisenware/vrpc-react](https://github.com/heisenware/vrpc-react)
- Python: [https://github.com/heisenware/vrpc-py](https://github.com/heisenware/vrpc-py)
- R: [https://github.com/heisenware/vrpc-r](https://github.com/heisenware/vrpc-r)

Usage is designed for programmers with sound knowledge in the respective programming language. Maturity, feature completeness and support follows the order of the above list.

## What is VRPC?

VRPC is an asynchronous **Remote Procedure Call (RPC)** framework designed to make your existing code available over the network with minimal effort.

At its core, it allows you to take almost any class you've written in Python, Node.js or C++ (more is coming) and, without modifying its internal logic, expose its methods to remote clients. These clients can then interact with your class as if it were running locally in their own process, even if it's actually on a different machine halfway across the world.

The key philosophy behind VRPC is to be **non-intrusive**. You write your business logic first, focusing on creating clean, well-defined classes. Then, VRPC adapts this code for network communication, rather than forcing you to structure your code around the network from the start.

## The Main Concepts

VRPC's architecture is composed of a few key components that work together. Understanding their roles is key to using the framework effectively.

### VrpcAdapter

The **Adapter** is the heart of VRPC. It's the component that works directly with your code. Using language features like introspection, the Adapter can analyze a class, understand its methods and documentation, and prepare it to be called remotely. This is the magic that makes VRPC non-intrusive; the Adapter does the heavy lifting of wrapping your code for network access.

<figure><img src="../../.gitbook/assets/image (40).png" alt=""><figcaption><p>Visual example of how the Adapter works, here shown for C++</p></figcaption></figure>

### VrpcAgent

An **Agent** is a server-side process that hosts your adapted code. You run an Agent on the machine where your code lives. The Agent's job is to:

- Connect to a central message broker.
- Tell the network which classes and instances it has available.
- Listen for incoming RPC requests from clients.
- Use the `VrpcAdapter` to execute the requested method on the correct instance.
- Send the result (or any errors) back to the client.

### VrpcClient

The **Client** is the library your end-users or other services will use to interact with your remote code. The Client connects to the same message broker as the Agents. Its primary job is to create **Proxy Objects**.

### Proxy Objects

This is the main abstraction you'll work with on the client-side. When you ask a `VrpcClient` to create or get an instance of a remote class, it doesn't return the real object. Instead, it gives you a **Proxy**.

This Proxy Object looks and feels exactly like the original class—it has the same methods. When you call a method on the proxy, however, the call is transparently:

1. Packaged into a message.
2. Sent over the network to the correct Agent.
3. Executed on the real object.
4. The result is sent back and returned from your proxy method call.

This makes remote interaction feel completely natural and local.

### The MQTT Broker

The final piece of the puzzle is the **MQTT Broker**. VRPC uses MQTT as its communication backbone. The broker is a central server that acts like a post office for messages.

- Agents and Clients both connect to the broker.
- They **do not need to know each other's IP addresses**.
- Agents publish information about the classes they have, and clients subscribe to this information.
- When a client makes an RPC call, the message goes to the broker, which then routes it to the correct agent.

This decoupled architecture makes the system incredibly flexible and scalable. You can add or remove agents anywhere on the network, and as long as they connect to the same broker, clients will be able to discover and use them automatically.

<figure><img src="../../.gitbook/assets/image (41).png" alt=""><figcaption><p>Visual example of the three main components: Adapter, Agent and Client</p></figcaption></figure>

## A Typical Workflow

Putting it all together, a typical workflow looks like this:

{% stepper %}
{% step %}
**Write Your Code**

You create a standard Python or Node.js class (e.g., `class MyService`).
{% endstep %}

{% step %}
**Adapt It**

In your server-side code, you tell the `VrpcAdapter` about your class using `VrpcAdapter.register(MyService)`.
{% endstep %}

{% step %}
**Run an Agent**

You start a `VrpcAgent`, which connects to the broker and announces that it offers the `MyService` class.
{% endstep %}

{% step %}
**Connect a Client**

In another application, you start a `VrpcClient` and connect it to the same broker.
{% endstep %}

{% step %}
**Create a Proxy**

You ask the client to create an instance: `proxy = await client.create({ className: 'MyService' })`.
{% endstep %}

{% step %}
**Call a Method**

You use the proxy just like a local object: `result = await proxy.some_method(42)`.
{% endstep %}
{% endstepper %}

Behind the scenes, VRPC handles all the networking, serialization, and message routing required to make this simple interaction possible.
