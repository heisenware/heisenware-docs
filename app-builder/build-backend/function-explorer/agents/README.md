---
description: >-
  Learn how to create, deploy and use Agents.
---

# Agents

Agents are secure, industrial-grade bridges that run as system services (daemons) within your private network. They tunnel data from local protocols (S7, Modbus, OPC UA, etc.) to your cloud workspace, ensuring connectivity that persists through system restarts and power cycles.

<div data-full-width="true"><figure><img src="../../../../.gitbook/assets/Heisenware Agent.png" alt="" width="525"><figcaption><p>Heisenware Agent</p></figcaption></figure></div>

## Types of agents

Depending on your local infrastructure and edge hardware setup, Heisenware offers three distinct types of agents to bridge your local networks with the cloud workspace.

### Native agent

The [Native agent](native-agent.md) is a fully installable package that registers itself directly as a background service on the host operating system (a Windows Service or Linux Daemon). It is managed natively by the OS to guarantee 24/7 background availability, automatic start-up upon reboots, and compatibility across Windows, macOS, Linux, and ARM64 industrial PCs.

### Docker agent

The [Docker agent](docker-agent.md) provides the same core bridging capabilities but runs inside an isolated containerized environment. It is the ideal deployment choice for edge gateways or servers where infrastructure is already managed via Docker. Unlike the native package, credentials are not baked into the installer and are passed flexibly using environment variables during container runtime.

### LXC agent (Insys)

The [LXC agent](lxc-agent-insys.md) is a specialized runtime container designed specifically for edge computing directly on INSYS icom industrial routers and gateways (such as the MRX, MRO, ECR, and SCR series). It is distributed as a native `.tar` update packet, runs as an isolated Linux System Container (LXC) within the router's web environment, and features optimized memory constraints to safeguard core networking functions.
