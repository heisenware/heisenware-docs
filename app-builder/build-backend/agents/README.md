---
description: >-
  Learn how to create, deploy, and use Agents.
---

# Agents

An Agent is a small piece of Heisenware software that you install on a machine inside a separated network, for example on a factory floor. It executes logic, like connectors for S7, Modbus, or OPC UA, directly where the systems and devices are, and exchanges data securely with your workspace. Agents distribute your App logic: parts of it run in the cloud, parts of it at the edge, next to the machines it talks to.

<div data-full-width="true"><figure><img src="../../../.gitbook/assets/Heisenware Agent.png" alt="" width="525"><figcaption><p>Heisenware Agent</p></figcaption></figure></div>

## How Agents work

1. Build or download an Agent and install it on a machine inside the target network.
2. The Agent connects to the Heisenware Cloud through an outbound-only MQTTS connection on port 8883. No inbound firewall rules or VPNs are required.
3. Once online, the Agent appears in the [Function Explorer](../functions/function-explorer.md) as its own entry, holding the connectors it carries.
4. Functions dragged from an Agent entry execute on the Agent's machine, directly at the edge.

Agents run as system services or containers. They start automatically after reboots and power cycles and stay available around the clock.

{% hint style="info" %}
#### A function is a function

In the App Builder, you never notice that you are working on a machine in a different network. A function from an Agent looks and behaves like any other function: drag it onto the canvas, wire it, configure it. It just runs somewhere else. Only its [address](../functions/README.md#advanced-addressing) reveals where.
{% endhint %}

## Types of Agents

Choose the Agent that matches your edge hardware:

<table><thead><tr><th width="220">Type</th><th>Choose when</th></tr></thead><tbody><tr><td><a href="native-agent.md"><strong>Native Agent</strong></a></td><td>You have a Windows, macOS, or Linux machine (including ARM64 industrial PCs). Installs as a background service directly on the operating system. Credentials are built into the installer.</td></tr><tr><td><a href="docker-agent.md"><strong>Docker Agent</strong></a></td><td>Your edge infrastructure already runs Docker. Same functionality in an isolated container. Credentials are passed as environment variables at startup.</td></tr><tr><td><a href="lxc-agent-insys.md"><strong>LXC Agent (Insys)</strong></a></td><td>Your edge device is an INSYS icom industrial router or gateway (MRX, MRO, ECR, SCR series). Distributed as a <code>.tar</code> update packet and installed via the router's web interface.</td></tr></tbody></table>
