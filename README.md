---
description: >-
  Overview of the Heisenware platform, architecture, core concepts, and key
  terminology.
layout:
  width: default
  title:
    visible: true
  description:
    visible: true
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
  metadata:
    visible: true
  tags:
    visible: true
  actions:
    visible: true
---

# Welcome

**Heisenware is an industrial application platform.** You build software visually and deploy it to production without writing boilerplate or setting up infrastructure. Underneath sits a distributed architecture, so your Apps scale from a single machine to a whole plant. When you need to go deeper, you reach the code and configuration directly.

## The platform at a glance

Three core components cover the entire application lifecycle:

<table data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th><th data-hidden data-card-cover data-type="image">Cover image</th></tr></thead><tbody><tr><td><strong>App Manager</strong></td><td>Admin dashboard to create and manage Apps, members, and integrations.</td><td><a href="app-manager/README.md">overview.md</a></td><td><a href=".gitbook/assets/App Manager in Browser preview.png">App Manager in Browser preview.png</a></td></tr><tr><td><strong>App Builder</strong></td><td>Visual programming interface to build and test custom software applications.</td><td><a href="app-builder/README.md">overview.md</a></td><td><a href=".gitbook/assets/658shots_so.png">658shots_so.png</a></td></tr><tr><td><strong>App Player</strong></td><td>Runs your Apps for their users, in the browser or installed on a device.</td><td><a href="app-player/README.md">overview.md</a></td><td><a href=".gitbook/assets/tracking.jpg">tracking.jpg</a></td></tr></tbody></table>

## Hosting and architecture

The [Heisenware architecture](self-hosting/README.md) consists of the central platform and optional [Agents](concepts/agents-and-where-code-runs.md). Each account runs in isolation and supports two deployment modes:

* **Cloud deployment**: The recommended way to use Heisenware. We host your Apps on [Hetzner](https://www.hetzner.com/) in Germany.
* **On-premises deployment**: You run the entire platform as a Docker application on your local servers or private cloud.

Whichever mode you choose, [Agents](concepts/agents-and-where-code-runs.md) bridge separated networks for you. For example, when you host the platform in a corporate data center (IT) and need to reach machines in a secured shopfloor network (OT), an Agent opens the secure tunnel.

## See it in action

Watch how to build and operate industrial apps in Heisenware.

{% embed url="https://www.youtube.com/watch?v=MM4teGtbB7k" %}

## Engineering philosophy and core concepts

Heisenware is a visual programming environment. A few engineering concepts, all kept visible and under your control, make it click.

### Transparency and flexibility

Heisenware keeps the underlying complexity visible and reachable. When you need custom logic, it is there.

* **Visual with full code access:** You build logic visually in the [Flowboard](app-builder/flowboard/README.md) and still reach developer tools directly, like JavaScript expressions for data transformation and YAML for configuration.
* **Extensible**: When the built-in [functions](concepts/executors-and-instances.md) fall short, you wrap your own code (Node.js, Python, C++) into Custom Extensions that become native functions.

### Object-oriented scalability

Heisenware uses an object-oriented model. You build logic once and instantiate it across an entire fleet of devices.

* **Classes (the blueprint)**: Reusable logic definitions, e.g. the [OPC UA client connector](reference/functions/connectors/opc-ua-client.md) or an [email connector](reference/functions/connectors/email.md).
* **Instances (the asset)**: Living, stateful copies of a class. You don't write code for machine A. You create an instance of the OPC UA client, name it `opcua-machine-a`, and give it the machine's IP and credentials.
* **Stateful context**: Instance functions carry their own context, e.g. which server to use, so you pass no global variables.

### Native event-driven architecture

Industrial systems are asynchronous. Sensors spike, users click, and machines stop at unpredictable times. Heisenware Apps handle this natively.

* **Reactive logic**: [Backend flows](app-builder/flowboard/README.md) do not run in a linear loop. They sit dormant until a specific trigger (an event) fires.
* **Event sources**: A trigger can be a user interaction (a UI event), a data change (e.g. a PLC tag update), or a system lifecycle event.
* **Non-blocking**: Your UI stays responsive while backend logic handles complex tasks asynchronously.

### Distributed connectivity

Heisenware closes the "OT vs. IT" network gap by treating local hardware as a first-class citizen of the cloud platform.

* **The bridge**: [Native Agents](app-manager/agents/native-agent.md) and [Docker Agents](app-manager/agents/docker-agent.md) securely connect local, private networks (OT/shopfloor) to the cloud without VPNs.
* **Local execution**: You push backend logic ([connectors](reference/functions/connectors/README.md)) to run locally on the edge device, and the platform treats these remote functions exactly like cloud functions.

### Unified data binding

Heisenware removes the "glue code" you would normally write to connect a frontend to a backend.

* **Direct linking**: In the [App Builder](app-builder/README.md), you connect a backend function's output straight to a frontend [widget's](reference/widgets/README.md) property.
* **Reactive UI**: When backend data changes (e.g. a new sensor reading), the bound widget re-renders to reflect the new state.

<figure><img src=".gitbook/assets/Data Binding Basics.gif" alt=""><figcaption></figcaption></figure>

## Glossary

The [glossary](reference/glossary.md) explains the words Heisenware uses, from account to widget.
