# Heidenhain DNC

Some Heidenhain controls offer no OPC UA server. Those are reached over DNC, Heidenhain's own remote interface. Heisenware talks to them through an agent built for that interface, not through a connector you create an instance of yourself.

[Reach out to us](mailto:support@heisenware.com) for this integration. We build the agent for your control and hand it to your IT to install.

{% hint style="info" %}
If your control offers an OPC UA server, you need none of this: use [Heidenhain OPC UA](heidenhain-opc-ua.md), which is part of the platform and which you set up yourself.
{% endhint %}

## How it looks in the Builder

* **Its own agent**: the DNC agent runs in the machine's network and appears in the [Functions explorer](../../../app-builder/explorers/functions.md) next to the other agents once it comes online. An executor addresses it like any other agent, so the same flow can serve several machines by their agent names (see [Agents and where code runs](../../../concepts/agents-and-where-code-runs.md)).
* **Functions for your control**: the class the agent offers is built for the control it talks to. What you can read and write differs from machine to machine; the Functions explorer lists what yours has.
* **Names without parameter help**: the agent is not written in JavaScript, so the explorer shows its function names but no parameter descriptions. The notes delivered with the integration say what each function takes.
* **Not part of the agent fleet**: the App Manager's **Agents** panel does not build, update or restart a DNC agent. Its host is maintained with us.
