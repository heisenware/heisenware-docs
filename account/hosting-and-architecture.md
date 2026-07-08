# Hosting and Architecture

Heisenware is designed to be flexible. Whether you need a hassle-free cloud setup or strict data sovereignty on your own servers, we support the deployment model that fits your IT strategy.

## Managed cloud (SaaS)

This is the standard, recommended deployment for most customers. It lets you focus entirely on building Apps and optimizing processes, while we handle maintenance tasks like updates, security patching, and backups.

* **Provider**: We rely on [Hetzner](https://www.hetzner.com/), a leading high-performance cloud provider.
* **Location**: All data and servers are hosted exclusively in Germany (EU).
* **Compliance**: Fully GDPR (DSGVO) compliant.

### Cloud architecture

In this scenario, all essential components of the platform run in the cloud. Once you build and deploy an App, it becomes accessible from anywhere with an internet connection. Apps themselves are Progressive Web Apps (PWAs) that run on any operating system and device without feeling different from native apps.

<figure><img src="../.gitbook/assets/image (487).png" alt=""><figcaption><p>Simplified architecture of the Heisenware ecosystem when used as a cloud deployment.</p></figcaption></figure>

### Connectivity (Agents)

While the platform runs in the cloud, your machines usually reside in a local, protected network (OT). To bridge this gap securely, Heisenware uses Agents.

An Agent is a piece of software running on your local hardware that establishes a secure tunnel to the cloud platform. It lets you use industrial protocols like S7, Modbus, OPC UA, and MQTT to connect your devices from within your local network.

#### Native Agent

The Native Agent is a single binary executable (Linux/macOS) or a Windows `.exe` that can be started with one click. It must run on local hardware that can reach the device you want to connect.

Security is built in. When you download the Agent from your Heisenware Account, it is compiled fresh, just for you, with your own credentials embedded directly into the binary. An Agent downloaded from a different Account will not work with yours. [See here](../app-builder/build-backend/function-explorer/agents/#native-agent) for details on using the Native Agent.

#### Docker Agent

This is much like the Native Agent but packed into a Docker container. Docker is especially useful for vendors that offer edge-connectivity hardware, such as Siemens, WAGO, Hilscher, Welotec, or Weidmüller.

We offer our Docker-based Agent for all relevant architectures (amd64, arm64, arm/v7). Get started quickly by passing the necessary credentials as environment variables to the container. [See here](../app-builder/build-backend/function-explorer/agents/#docker-agent) for details.

### Code Adapters (Custom Extensions)

While standard Agents ship with pre-made code for industrial protocols, Code Adapters let you wrap your own source code and expose it as visual building blocks ([Functions](../app-builder/build-backend/functions.md)) in the cloud platform. Think of it as a Heisenware-specific wrapper for your algorithms.

Like Agents, Code Adapters are available as both a native application and a containerized version, which we call [Custom Extensions](../app-builder/build-backend/function-explorer/extensions/README.md#custom-extensions) inside the platform.

#### Native Code Adapter

The Native Code Adapter lets you integrate custom code running natively on your OS. It relies on programming language-specific versions of our [VRPC library](../developers/vrpc/).

#### Docker Code Adapter

We provide a starter project that lets you build a Docker image containing your custom code. This Docker image is treated as a [Custom Extension](../app-builder/build-backend/function-explorer/extensions/README.md#custom-extensions) once built. From there, you have two options for where to run the container:

1. **Inside the platform (cloud)**: You load your image as an extension. The platform handles its lifecycle (hosting, restarting) and automatically persists files into the central `shared` folder. Your code effectively runs as part of the Heisenware cloud.
2. **Outside the platform (edge)**: Useful for bridging a private or local network. You run the container on your own hardware, using environment variables to secure the connection. Your code can interact with local devices, while you still control everything from within the cloud platform.

## Self-hosted (on-premises)

For organizations with strict internal compliance requirements or air-gapped networks, Heisenware can be deployed directly on your infrastructure, whether that's a private cloud or an industrial PC.

### On-premises architecture

In an on-premises deployment, the entire platform runs on your local servers. It is essentially moving every cloud component one level down into your infrastructure.

* **Direct connectivity**: The platform can connect directly to local devices, with no Agent required.
* **Network segmentation**: In large shop-floor setups with segmented networks, you can still use [Agents](../app-builder/build-backend/function-explorer/agents/) (Native or Docker) to securely bridge lower-level subnets.

<figure><img src="../.gitbook/assets/image (488).png" alt=""><figcaption></figcaption></figure>

### Requirements and considerations

This option gives you full control over data and infrastructure, but comes with significant responsibility. It's designed for organizations with expert IT teams comfortable with:

* Server and container orchestration, specifically Docker.
* Managing application resources, scaling, and database backups.
* Implementing their own network security (VPNs, firewalls).

{% hint style="info" %}
When self-hosting, you are the platform operator. Improper configuration can lead to data loss or security vulnerabilities. If your team doesn't have dedicated IT resources, we strongly recommend the Managed Cloud option.
{% endhint %}

#### Getting started

If you have an Enterprise license and are ready to deploy, see our [technical guide](../tutorials/on-premise-installation.md).
