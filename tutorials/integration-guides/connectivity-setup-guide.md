---
description: >-
  Use this guide to determine the best way to connect your data sources to
  Heisenware. Follow the questions below and click the links to navigate to the
  exact setup that fits your use case.
---

# Connectivity setup guide

Use this guide to determine the best way to connect your data sources to Heisenware. Follow the questions below and click the links to navigate to the exact setup that fits your use case.

## Do you need to connect an external data source?

* **No** – If you are building an independent App that relies solely on built-in databases and does not require external connectivity, you can skip this guide and start directly with the [Overview](../../app-builder/overview.md).
* **Yes** – If your use case requires reading or writing data to an existing database, machine, IT system, scanner, API, or industrial protocol, continue to [How is your Heisenware tenant hosted?](#how-is-your-heisenware-tenant-hosted).

## How is your Heisenware tenant hosted?

Your connection method depends on where the Heisenware platform runs.

* [Managed Cloud connectivity](#managed-cloud-connectivity)
* [Self-hosted connectivity](#self-hosted-connectivity) (on-premise or private cloud)

## Managed Cloud connectivity

Your tenant is hosted by Heisenware in the cloud. Is your data source accessible via the public internet (such as via an API)?

* **Yes** – If the data source is reachable via the internet, you can use our standard [connectors](../../app-builder/build-backend/functions/connectors.md) directly.
* **No** – If the data source resides in an isolated or local network, continue to [Connecting isolated data sources](#connecting-isolated-data-sources).

## Self-hosted connectivity

Your tenant is hosted on-premise or in your private cloud. Is your data source accessible from the network where the platform is deployed?

* **Yes** – If the data source is in the same network, you can use our standard [connectors](../../app-builder/build-backend/functions/connectors.md) directly.
* **No** – If the data source is in an isolated network segment, continue to [Connecting isolated data sources](#connecting-isolated-data-sources).

## Connecting isolated data sources

Does Heisenware offer a standard connector for your specific data source?

* **Yes** – If a standard connector exists, continue to [Choose your Agent setup](#choose-your-agent-setup).
* **No** – If you need to connect a custom source, you can use a [Code Adapter](../../account/hosting-and-architecture.md) or build a [Custom Extension](../../app-builder/build-backend/functions/extensions/custom-extensions.md). These features let you wrap custom code and expose it as visual function blocks inside the platform. Alternatively, contact our support team to discuss your requirements.

## Choose your Agent setup

To access isolated networks, you must deploy an Agent. The Agent acts as a secure, outbound-only tunnel that maps data and enables remote logic configuration. It runs locally to bridge isolated networks and buffers data via MQTTS.

What infrastructure is available in your local network?

* [Native Agent](#native-agent)
* [Docker Agent](#docker-agent)
* [LXC Agent](#lxc-agent)

### Native Agent

Use the native binary to run the Agent as a highly efficient system service directly on your operating system without requiring Docker. For next steps, see the [Native Agent](../../app-builder/build-backend/agents/native-agent.md) documentation.

### Docker Agent

Deploy the Docker container for the Agent. This is the recommended approach for containerized environments on OT servers or edge devices. For next steps, see the [Docker Agent](../../app-builder/build-backend/agents/docker-agent.md) documentation.

### LXC Agent

Deploy the LXC container for the Agent. This setup is suitable for specific edge devices running LXC runtimes, such as INSYS routers. For next steps, see the [LXC Agent (Insys)](../../app-builder/build-backend/agents/lxc-agent-insys.md) documentation.
