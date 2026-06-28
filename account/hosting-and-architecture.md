# Hosting & Architecture

Heisenware is designed to be flexible. Whether you need a hassle-free cloud setup or strict data sovereignty on your servers, we support the deployment model that fits your IT strategy.

## Managed cloud (SaaS)

This is the standard, recommended deployment for most customers. It allows you to focus entirely on building apps and optimizing processes, while we handle maintenance tasks like updates, security patching, and backups.

* **Provider**: We rely on [Hetzner Online GmbH](https://www.hetzner.com/), a leading high-performance cloud provider.
* **Location**: All data and servers are hosted exclusively in Germany (EU).
* **Compliance**: Fully GDPR (DSGVO) compliant.

### Cloud architecture

In this scenario, all essential components of the platform run in the cloud. Once you build and deploy an app, it becomes accessible from any place on the planet that provides an internet connection. The apps themselves are Progressive web apps (PWAs) that run on any operating system and device without feeling different from "native" apps.

<figure><img src="../.gitbook/assets/image (487).png" alt=""><figcaption><p>Simplified architecture of the Heisenware ecosystem when used as a cloud deployment.</p></figcaption></figure>

### Connectivity (Agents)

While the platform runs in the cloud, your machines usually reside in a local, protected network (OT). To bridge this gap securely, Heisenware uses Agents.

The agent is a piece of software running on your local hardware that establishes a secure tunnel to the cloud platform. It allows you to utilize various industrial protocols (like S7, Modbus, OPC UA, MQTT) to connect your devices _from within_ your local network.

#### Native Agent

The Native Agent is a single binary executable (Linux/MacOS) or a Windows `.exe` that can be started with one click. It must run on local hardware that can reach the device required to be connected.

Security is baked in: When you download the agent from your Heisenware account, it is indeed freshly compiled (!) only for you, with your very personal set of credentials embedded directly into the binary. This means an agent downloaded by another Heisenware user is inherently incompatible with your account. [See here](../app-builder/build-backend/function-explorer/agents/#native-agent) to understand how to use the Native Agent.

#### Docker Agent

This is much like the native agent but packed into a Docker container. Docker technology is especially useful for vendors that offer edge-connectivity hardware (such as Siemens, WAGO, Hilscher, Welotec, Weidmüller, etc.).

We offer our Docker-based agent for all relevant architectures (amd64, arm64, arm/v7). You can get started safely and quickly by providing the necessary credentials as environmental variables to the container. [See here](../app-builder/build-backend/function-explorer/agents/#docker-agent) for all the details.

### Custom code adapters

While standard agents ship with pre-made code for industrial protocols, code adapters allow you to wrap your custom source code and expose it as visual building blocks ([functions](../app-builder/build-backend/functions.md)) in the cloud platform. Think of it as a Heisenware-specific wrapper for your algorithms.

Like the agents, code adapters are available as both a native application and a containerized version (which we call [custom extensions](https://docs.heisenware.com/app-builder/build-backend/functionality/extensions#custom-extensions) inside the platform).

#### **Native custom code adapter**

The native code adapter allows you to integrate custom code running natively on your OS. It relies on programming language-specific versions of our powerful [VRPC library](https://docs.heisenware.com/developers/vrpc).

#### **Docker custom code adapter**

We provide a starter project that lets you build a Docker image containing your custom code. This Docker image is treated as a [custom extension](https://docs.heisenware.com/app-builder/build-backend/functionality/extensions#custom-made). Once built, you have two flexible options for where to execute the container:

1. **Inside the platform (Cloud)**: You load your image as an extension. The platform takes care of its lifecycle (hosting, restarting) and automatically persists files into the central `shared` folder. Your code effectively runs as part of the Heisenware cloud.
2. **Outside the platform (Edge)**: This is useful for bridging a private/local network. You run the container on your hardware using environment variables to secure the connection. Your code can interact with local devices, but you can still control everything seamlessly from within the cloud platform.

## Self-hosted / On-premise

For organizations with strict internal compliance requirements or "air-gapped" networks, Heisenware can be deployed directly on your infrastructure (private cloud or Industrial PC).

### On-premise architecture

In an on-premise deployment, the entire platform runs on your local servers. It is essentially moving every cloud component one level down into your infrastructure.

* **Direct connectivity**: The platform can directly connect to local devices without the need for agents.
* **Network segmentation**: In large shop-floor setups with segmented networks, you can still use [Edge Agents](../app-builder/build-backend/function-explorer/agents/) (native or Docker) to securely bridge lower-level subnets.

<figure><img src="../.gitbook/assets/image (488).png" alt=""><figcaption></figcaption></figure>

### Requirements & considerations

This option provides full control over data and infrastructure but comes with significant responsibility. It is designed for organizations with expert IT teams comfortable with:

* Server and container orchestration (specifically Docker).
* Managing application resources, scaling, and database backups.
* Implementing own network security (VPNs, firewalls).

{% hint style="info" %}
When self-hosting, you are the platform operator. Improper configuration can lead to data loss or security vulnerabilities. If your team does not have dedicated IT resources, we strongly recommend the Managed Cloud option.
{% endhint %}

#### Getting started

If you have an Enterprise license and are ready to deploy, please refer to our [technical guide](../tutorials/on-premise-installation.md).
