# Cloud or on-prem

Heisenware runs in Heisenware's cloud or on your own servers. It is the same platform either way: the same App Manager, App Builder and App Player, the same functions, the same Apps. What differs is who operates the installation, where the data lies, and what the installation brings with it.

## The short answer

| | Heisenware cloud | On-premise |
| --- | --- | --- |
| **Operated by** | Heisenware: updates, patches, backups, monitoring | you: your IT runs the host, the updates and the backups |
| **Your address** | `acme.heisenware.cloud` | whatever your network calls the host |
| **Where the data lies** | Hetzner, Germany (EU), GDPR compliant | on your hardware, and nowhere else |
| **Reaching machines in your network** | through an [agent](../concepts/agents-and-where-code-runs.md) you install there | directly, as far as the host's own network reaches |
| **Updates** | Heisenware deploys them | you run the installer when you want the new version |
| **Plan** | a [plan](../app-manager/plan-and-billing.md) with a monthly bill | a licence file you upload under **Plan & Billing** |
| **The assistant and Ask** | included | not part of an on-premise installation in v93 |
| **Internet** | required | not required; the platform runs in a closed network |

## Heisenware cloud

Everything runs in the cloud: the Manager, the Builder, the broker, the databases and every App you deploy. An App is a Progressive Web App, reachable at its own URL from anywhere and installable on a device.

* **Provider**: [Hetzner](https://www.hetzner.com/).
* **Location**: all servers and all data in Germany (EU).
* **Compliance**: GDPR (DSGVO).

<figure><img src="../.gitbook/assets/image (487).png" alt="The platform in the cloud, with native and Docker agents in the local network below it, connected by MQTTS"><figcaption><p>A cloud installation: the platform above, your network below, one outbound connection between them.</p></figcaption></figure>

### Your machines need an agent

Your machines answer at addresses that exist only inside your network: `192.168.10.5`, an `opc.tcp://` server, a bare host name. Nothing in the cloud can route there. An [agent](../concepts/agents-and-where-code-runs.md) installed inside that network is the way in: it dials out to the platform over MQTTS on port 8883 and keeps that one connection open, so nothing has to be opened inbound.

You build an agent in the App Manager's [Agents panel](../app-manager/agents/README.md): you choose the connectors, the target platform and a fleet name, and the platform builds it with the credentials of your workspace inside. It comes as a [native agent](../app-manager/agents/native-agent.md) for Windows, macOS, Linux, Alpine, ARM 64 and ctrlX OS, as a [Docker agent](../app-manager/agents/docker-agent.md) for gateways and servers you run with Docker, or as an [LXC agent](../app-manager/agents/lxc-agent.md) for INSYS icom routers.

### Your own code

Code of your own joins the platform as an [add-on](../reference/functions/add-ons/README.md): a Docker image whose classes appear in the Functions explorer like any others. On the cloud, where servers are shared, only Heisenware's own images may be installed; your own image runs on a dedicated server or on-premise. It can always run outside the platform, on your hardware, and connect in as an agent. See [Custom add-ons](../developers/custom-add-ons.md).

## On-premise

The whole platform runs on your hardware: a server in your data centre, a virtual machine, or an industrial PC. It moves every cloud component one level down into your infrastructure.

<figure><img src="../.gitbook/assets/image (488).png" alt="The platform inside the local network, reaching machines directly and optional agents in lower subnets"><figcaption><p>An on-premise installation: the platform sits in your network and reaches your machines itself.</p></figcaption></figure>

* **Direct connectivity**: the platform reaches everything its own host reaches. No agent is needed for that.
* **Network segmentation**: for machines in a segment the host cannot reach, use [agents](../concepts/agents-and-where-code-runs.md) as in the cloud.
* **No internet**: the installation runs closed. It needs outbound access only while you download a release package, and while [remote support](remote-support.md) is switched on.
* **Licence**: an on-premise installation takes a licence file instead of a plan. An account starts on Free until an owner uploads it under **Plan & Billing**; the licence carries the number of Apps, the number of workspaces, the storage and its end date. When a licence ends, the first deployed App keeps running and the others stop. Nothing is deleted.
* **Sign-in**: email and password. Google sign-in is never offered on-premise, whatever the environment says.

### The assistant is not included

In v93 an on-premise installation runs no assistant service: the App Manager and the App Builder show no assistant, and [Ask](../app-manager/ask.md) is not available. Everything else is there.

Your own AI client still works: every workspace runs its own [MCP server](../assistant/mcp-server.md) with the same platform tools, reached at the workspace's MCP address or through a [local MCP server](../app-manager/integrations.md) on a member's computer. The model and its key are then yours, not the installation's.

### What you take on

Self-hosting gives you full control and full responsibility. It suits organizations whose IT is comfortable with:

* Docker Engine and Docker Compose on a Linux server.
* Backups, restores and the disk they need.
* Their own network security: TLS certificates, firewalls, VPNs.

{% hint style="warning" %}
When you self-host, you are the platform operator. A wrong configuration can cost you data or open a hole. If your team has no dedicated IT resources, take the cloud.
{% endhint %}

### Requirements

* **Host**: x86-64 (amd64) Linux. The platform's images are built for amd64 only; an ARM host cannot run them.
* **Docker**: Docker Engine with the Compose plugin. On Windows and macOS, Docker Desktop over WSL 2 works for a trial.
* **Shell tools**: `bash` 4.4 or newer (the installer and the start script need it), `openssl` for the TLS certificate, `curl` for sending a backup to Heisenware.
* **Size**: 4 cores and 8 GB of memory carry the platform and its first workspace; plan about 1 GB of memory more per workspace. 50 GB of disk is a sensible floor: the release package alone is about 2 GB and the images it loads take several more, and an update holds two versions at once.
* **Ports**: the platform serves 80 and 443 (HTTP and HTTPS, where 80 redirects to 443) and 1883, 8883, 1884 and 8884 for MQTT.

## Install it

[Install](install.md) is the step-by-step guide. Coming from v92, read [Upgrading from v92](upgrading-from-v92.md) first.

Heisenware can help with an installation it has no way into: the installation dials out to Heisenware's support account for as long as you allow it, and not a moment longer. See [Remote support](remote-support.md).
