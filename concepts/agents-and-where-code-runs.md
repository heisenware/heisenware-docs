# Agents and where code runs

An Agent is a small piece of Heisenware software that you install on a machine inside a separated network, for example on a factory floor. It executes logic, like connectors for S7, Modbus, or OPC UA, directly where the systems and devices are, and exchanges data securely with your account. Agents distribute your App logic: parts of it run in the cloud, parts of it at the edge, next to the machines it talks to.

<div data-full-width="true"><figure><img src="../.gitbook/assets/Heisenware Agent.png" alt="" width="525"><figcaption><p>Heisenware Agent</p></figcaption></figure></div>

## How Agents work

1. Build or download an Agent and install it on a machine inside the target network.
2. The Agent connects to the Heisenware platform through an outbound-only MQTTS connection on port 8883. No inbound firewall rules or VPNs are required.
3. Once online, the Agent appears in the [Function Explorer](../app-builder/explorers/functions.md) as its own entry, holding the connectors it carries.
4. Functions dragged from an Agent entry execute on the Agent's machine, directly at the edge.

Agents run as system services or containers. They start automatically after reboots and power cycles and stay available around the clock.

{% hint style="info" %}
#### A function is a function

In the App Builder, you never notice that you are working on a machine in a different network. A function from an Agent looks and behaves like any other function: drag it onto the canvas, wire it, configure it. It just runs somewhere else. Only its [address](executors-and-instances.md#advanced-addressing) reveals where.
{% endhint %}

## Types of Agents

Choose the Agent that matches your edge hardware:

<table><thead><tr><th width="220">Type</th><th>Choose when</th></tr></thead><tbody><tr><td><a href="../app-manager/agents/native-agent.md"><strong>Native Agent</strong></a></td><td>You have a Windows, macOS, or Linux machine (including ARM64 industrial PCs). Installs as a background service directly on the operating system. Credentials are built into the installer.</td></tr><tr><td><a href="../app-manager/agents/docker-agent.md"><strong>Docker Agent</strong></a></td><td>Your edge infrastructure already runs Docker. Same functionality in an isolated container. Pass credentials as environment variables at startup.</td></tr><tr><td><a href="../app-manager/agents/lxc-agent.md"><strong>LXC Agent (Insys)</strong></a></td><td>Your edge device is an INSYS icom industrial router or gateway (MRX, MRO, ECR, SCR series). Distributed as a <code>.tar</code> update packet and installed via the router's web interface.</td></tr></tbody></table>

Every [Native Agent](../app-manager/agents/native-agent.md) you build is also stored in the [File Explorer](../app-builder/explorers/files.md) in the `native-agents` folder, ready to download again at any time.

## Connectivity setup guide

### Do you need to connect an external data source?

* **No** – If you are building an independent App that relies solely on built-in databases and does not require external connectivity, you can skip this guide and start directly with the [Overview](../app-builder/README.md).
* **Yes** – If your use case requires reading or writing data to an existing database, machine, IT system, scanner, API, or industrial protocol, continue to [How is your Heisenware tenant hosted?](agents-and-where-code-runs.md#how-is-your-heisenware-tenant-hosted).

### How is your Heisenware tenant hosted?

Your connection method depends on where the Heisenware platform runs.

* [Managed Cloud connectivity](agents-and-where-code-runs.md#managed-cloud-connectivity)
* [Self-hosted connectivity](agents-and-where-code-runs.md#self-hosted-connectivity) (on-premise or private cloud)

### Managed Cloud connectivity

Your tenant is hosted by Heisenware in the cloud. Is your data source accessible via the public internet (such as via an API)?

* **Yes** – If the data source is reachable via the internet, you can use our standard [connectors](../reference/functions/connectors/README.md) directly.
* **No** – If the data source resides in an isolated or local network, continue to [Connecting isolated data sources](agents-and-where-code-runs.md#connecting-isolated-data-sources).

### Self-hosted connectivity

Your tenant is hosted on-premise or in your private cloud. Is your data source accessible from the network where the platform is deployed?

* **Yes** – If the data source is in the same network, you can use our standard [connectors](../reference/functions/connectors/README.md) directly.
* **No** – If the data source is in an isolated network segment, continue to [Connecting isolated data sources](agents-and-where-code-runs.md#connecting-isolated-data-sources).

### Connecting isolated data sources

Does Heisenware offer a standard connector for your specific data source?

* **Yes** – If a standard connector exists, continue to [Choose your Agent setup](agents-and-where-code-runs.md#choose-your-agent-setup).
* **No** – If you need to connect a custom source, you can use a [Code Adapter](../self-hosting/README.md) or build a [Custom Extension](../developers/custom-add-ons.md). These features let you wrap custom code and expose it as visual function blocks inside the platform. Alternatively, contact our support team to discuss your requirements.

### Choose your Agent setup

To access isolated networks, you must deploy an Agent. The Agent acts as a secure, outbound-only tunnel that maps data and enables remote logic configuration. It runs locally to bridge isolated networks and buffers data via MQTTS.

What infrastructure is available in your local network?

* [Native Agent](agents-and-where-code-runs.md#native-agent)
* [Docker Agent](agents-and-where-code-runs.md#docker-agent)
* [LXC Agent](agents-and-where-code-runs.md#lxc-agent)

#### Native Agent

Use the native binary to run the Agent as a highly efficient system service directly on your operating system without requiring Docker. For next steps, see the [Native Agent](../app-manager/agents/native-agent.md) documentation.

#### Docker Agent

Deploy the Docker container for the Agent. This is the recommended approach for containerized environments on OT servers or edge devices. For next steps, see the [Docker Agent](../app-manager/agents/docker-agent.md) documentation.

#### LXC Agent

Deploy the LXC container for the Agent. This setup is suitable for specific edge devices running LXC runtimes, such as INSYS routers. For next steps, see the [LXC Agent (Insys)](../app-manager/agents/lxc-agent.md) documentation.
