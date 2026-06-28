---
description: >-
  Use this guide to determine the best way to connect your data sources to
  Heisenware. Follow the questions below and click the links to navigate to the
  exact setup that fits your use case.
---

# Connectivity setup guide

## Do you need to connect an external data source?

* _No, I am building an independent application that relies solely on the built-in databases and doesn't need external connectivity._ <i class="fa-arrow-right">:arrow-right:</i> You can skip this guide and start directly with the [overview.md](../../app-builder/overview.md "mention").&#x20;
* _Yes, my use case requires reading or writing data to an existing database, machine, IT system, scanner, API, or industrial protocol._ <i class="fa-arrow-right">:arrow-right:</i> Continue with [platform hosting](connectivity-setup-guide.md#how-is-your-heisenware-tenant-hosted).

## How is your Heisenware tenant hosted?

The way you connect to external systems depends on where your Heisenware platform runs.

* [Managed Cloud (SaaS)](connectivity-setup-guide.md#managed-cloud-saas-connectivity)
* [Self-hosted (on-premise or private cloud)](connectivity-setup-guide.md#self-hosted-connectivity)

## Managed Cloud Connectivity

Your tenant is hosted by Heisenware in the cloud. Is your data source accessible via the public internet, e.g., via API?

* _Yes, the data source is reachable via the internet._ <i class="fa-arrow-right">:arrow-right:</i> You can use our [standard connectors](../../app-builder/build-backend/function-explorer/connectors/) and don't need anything extra.
* _No, the data source is in an isolated or local network_. <i class="fa-arrow-right">:arrow-right:</i> Continue with [connecting isolated data sources](connectivity-setup-guide.md#connecting-isolated-data-sources).

## Self-Hosted Connectivity

Your tenant is hosted on-premise or in your private cloud. Is your data source accessible from the network where the platform is deployed?

* _Yes, the data source is in the same network._ <i class="fa-arrow-right">:arrow-right:</i> You can use our [standard connectors](../../app-builder/build-backend/function-explorer/connectors/) and don't need anything extra.
* No, the data source is in an isolated network segment. <i class="fa-arrow-right">:arrow-right:</i> Continue with [connecting isolated data sources](connectivity-setup-guide.md#connecting-isolated-data-sources).

## Connecting isolated data sources

Does Heisenware offer a [standard connector](../../app-builder/build-backend/function-explorer/connectors/) for your specific data source?

* _Yes, a standard connector exists._ <i class="fa-arrow-right">:arrow-right:</i> Continue with choosing your [agent setup](connectivity-setup-guide.md#choose-your-edge-agent-setup).
* _No, I need to connect a custom source._ <i class="fa-arrow-right">:arrow-right:</i> As an advanced user, you can use our [Code Adapter](../../account/hosting-and-architecture.md#custom-code-adapters) or build a [Custom Extension](https://docs.heisenware.com/app-builder/build-backend/functions-library/extensions#custom-extensions). These features allow you to wrap custom code and expose it as visual function blocks to the platform. Alternatively, please contact our support team to discuss your specific requirements.

## Choose your edge agent setup

To access isolated networks, you need to deploy an agent. The agent is a secure tunnel that maps data and enables remote logic configuration. It runs locally to bridge isolated networks and buffers data via MQTTS.&#x20;

What infrastructure is available in your local network?

* Native Windows or Linux OS
* Docker runtime
* LXC runtime

### Native agent&#x20;

You can use the native binary. It runs as a highly efficient system service directly on your OS without requiring Docker. Continue to the [native agent setup documentation](../../app-builder/build-backend/function-explorer/agents/native-agent.md) for the next steps.

### Docker agent&#x20;

You can deploy the Docker container. This is the recommended approach for containerized environments on OT servers or edge devices. Continue to the [Docker agent setup documentation](../../app-builder/build-backend/function-explorer/agents/docker-agent.md) for the next steps.

### LXC agent&#x20;

You can deploy the LXC agent. This setup is suitable for specific edge devices running LXC runtimes, such as INSYS routers. Continue to the [LXC agent setup documentation](../../app-builder/build-backend/function-explorer/agents/lxc-agent-insys.md) for the next steps.
