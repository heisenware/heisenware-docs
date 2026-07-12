# Hosting and architecture

Heisenware is flexible. Whether you want a hassle-free cloud setup or strict data sovereignty on your own servers, we support the deployment model that fits your IT strategy.

## Managed cloud (SaaS)

This is the standard, recommended deployment for most customers. You focus entirely on building Apps and optimizing processes, while we handle maintenance like updates, security patching, and backups.

* **Provider**: We rely on [Hetzner](https://www.hetzner.com/), a leading high-performance cloud provider.
* **Location**: All data and servers sit exclusively in Germany (EU).
* **Compliance**: Fully GDPR (DSGVO) compliant.

### Cloud architecture

Here, every essential component of the platform runs in the cloud. Once you build and deploy an App, it becomes reachable from anywhere with an internet connection. The Apps themselves are Progressive Web Apps (PWAs) that run on any operating system and device without feeling different from native apps.

<figure><img src="../.gitbook/assets/image (487).png" alt=""><figcaption><p>Simplified architecture of the Heisenware ecosystem in a cloud deployment.</p></figcaption></figure>

### Connectivity (Agents)

The platform runs in the cloud, but your machines usually sit in a local, protected network (OT). To bridge that gap securely, Heisenware uses Agents.

An Agent is a piece of software that runs on your local hardware and opens a secure tunnel to the cloud platform. Through it, you connect your devices from inside your local network using industrial protocols like S7, Modbus, OPC UA, and MQTT.

#### Native Agent

The Native Agent is a single binary executable (Linux/macOS) or a Windows `.exe` that starts with one click. It must run on local hardware that can reach the device you want to connect.

Security is built in. When you download the Agent from your Heisenware account, Heisenware compiles it fresh, just for you, with your own credentials embedded directly in the binary. An Agent downloaded from a different account will not work with yours. For details on using the Native Agent, [see the Agents documentation](../app-builder/build-backend/agents/#native-agent).

#### Docker Agent

The Docker Agent works much like the Native Agent, but packed into a Docker container. Docker is especially useful for vendors that offer edge-connectivity hardware, such as Siemens, WAGO, Hilscher, Welotec, or Weidmüller.

We offer the Docker Agent for all relevant architectures (amd64, arm64, arm/v7). To get started quickly, pass the necessary credentials as environment variables to the container. For details, [see the Agents documentation](../app-builder/build-backend/agents/#docker-agent).

### Code Adapters (Custom Extensions)

Standard Agents ship with pre-made code for industrial protocols. Code Adapters go further: they wrap your own source code and expose it as visual building blocks ([functions](../app-builder/build-backend/functions/)) in the cloud platform. Think of a Code Adapter as a Heisenware-specific wrapper for your algorithms.

Like Agents, Code Adapters come as both a native application and a containerized version, which the platform calls [Custom Extensions](../app-builder/build-backend/functions/extensions/#custom-extensions).

#### Native Code Adapter

The Native Code Adapter lets you integrate custom code running natively on your OS. It relies on language-specific versions of our [VRPC library](../advanced/vrpc/).

#### Docker Code Adapter

We provide a starter project that builds a Docker image containing your custom code. Once built, the platform treats this image as a [Custom Extension](../app-builder/build-backend/functions/extensions/#custom-extensions). From there, you have two options for where to run the container:

1. **Inside the platform (cloud)**: You load your image as an extension. The platform handles its lifecycle (hosting, restarting) and persists files into the central `shared` folder automatically. Your code effectively runs as part of the Heisenware cloud.
2. **Outside the platform (edge)**: Useful for bridging a private or local network. You run the container on your own hardware and secure the connection with environment variables. Your code can talk to local devices while you still control everything from the cloud platform.

## Self-hosted (on-premises)

For organizations with strict internal compliance requirements or air-gapped networks, you can deploy Heisenware directly on your infrastructure, whether that's a private cloud or an industrial PC.

### On-premises architecture

In an on-premises deployment, the entire platform runs on your local servers. It moves every cloud component one level down into your infrastructure.

* **Direct connectivity**: The platform connects directly to local devices, with no Agent required.
* **Network segmentation**: In large shopfloor setups with segmented networks, you can still use [Agents](../app-builder/build-backend/agents/) (Native or Docker) to bridge lower-level subnets securely.

<figure><img src="../.gitbook/assets/image (488).png" alt=""><figcaption></figcaption></figure>

### Requirements and considerations

This option gives you full control over data and infrastructure, but it carries significant responsibility. It suits organizations with expert IT teams comfortable with:

* Server and container orchestration, specifically Docker.
* Managing application resources, scaling, and database backups.
* Implementing their own network security (VPNs, firewalls).

{% hint style="info" %}
When you self-host, you are the platform operator. Improper configuration can lead to data loss or security vulnerabilities. If your team lacks dedicated IT resources, we strongly recommend the managed cloud option.
{% endhint %}

#### Getting started

If you have an Enterprise license and are ready to deploy, see our [technical guide](../tutorials/on-premise-installation.md).
