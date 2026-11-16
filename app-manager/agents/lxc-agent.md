# LXC agent (Insys)

The LXC agent is a Heisenware agent for INSYS icom industrial routers and gateways (the MRX, MRO, ECR and SCR series). It runs as a Linux system container (LXC) inside the router's icom firmware, so no extra industrial PC is needed at the machine.

## How it differs from a native agent

* **On the router itself**: it runs on the router's firmware, next to its networking.
* **A `.tar` update packet**: the router's own container format, uploaded through its web interface.
* **A small footprint**: the container caps its heap at 128 MB, so the router's networking is never crowded out.
* **Persistence on the router's flash**: it links its `/shared` directory to the router's `/data` partition, so instances and configuration survive a new packet.
* **Not built by the platform**: the packet comes from the public download server, so the App Manager neither builds it nor updates it. In the [Agents panel](README.md) it shows under **Unmanaged agents**, with its status and when it was last seen.

It carries the connectors of the slim [Docker agent](docker-agent.md): HTTP, trust store, file, OS, S7, OPC UA client and server, MQTT client and Modbus.

## Where to get it

A `.tar` archive from the public download server, one per architecture:

* **ARMv7** (most MRX, MRO and SCR gateways): `heisenware-insys-v93-armv7.tar`
* **ARM64**: `heisenware-insys-v93-arm64.tar`

```bash
wget "https://downloads.heisenware.cloud/public/heisenware-insys-v93-armv7.tar"
```

{% hint style="info" %}
Check your INSYS router's datasheet if you are unsure which architecture it uses, and take the file whose version matches the platform you connect to.
{% endhint %}

## How to set it up

The LXC agent runs on a hardware appliance, so you configure it in the INSYS icom web interface rather than on a command line.

{% stepper %}
{% step %}
#### Upload the update packet

Log into the router's web interface, open the Container menu and upload the `.tar` file. Give the container a name, for example `heisenware-agent`.
{% endstep %}

{% step %}
#### Configure networking

In the container's network settings, map it to an internal network bridge (`net2` or `lan`, for example) and give it an IPv4 address, subnet mask and gateway of its own.

{% hint style="warning" %}
#### Outbound 8883 required

Like every agent, the container needs outbound internet access on TCP 8883 to reach the platform. Make sure the router's firewall allows that for the container's address. Nothing inbound is needed.
{% endhint %}
{% endstep %}

{% step %}
#### Activate the profile

Click **Activate Profile**. The router boots the container for the first time, unpacks the application payload and creates the persistent directories.
{% endstep %}

{% step %}
#### Write `config.env`

An INSYS LXC container behaves like a small virtual machine, so the web interface cannot pass environment variables in. The agent reads them from a file instead.

1. Reach the container's file system over SSH or SFTP, at the address you gave it.
2. Create a file `config.env` in the persistent `/data/` folder.
3. Put the credentials of a **VRPC client** [integration](../integrations.md#integration-types) of your workspace into it:

```
HW_DOMAIN=<account>.<workspace>
HW_BROKER=mqtts://<account>.heisenware.cloud:8883
HW_USERNAME=<name>@<account>.<workspace>
HW_PASSWORD=<password>
HW_AGENT_ID=<a unique id for this gateway>
```

`HW_AGENT_ID` names this gateway on the platform. Give every router an id of its own; without one the agent takes a random one at every start and shows up as a new agent each time.
{% endstep %}

{% step %}
#### Restart the container

Restart the container in the INSYS web interface. On its next start the agent reads `/data/config.env`, connects, and appears in the Agents panel and in the [Functions explorer](../../app-builder/explorers/functions.md).
{% endstep %}
{% endstepper %}

{% hint style="info" %}
The agent announces itself as `Docker Agent - <HW_AGENT_ID>`: the LXC packet carries the Docker agent's software. That is the name you see in the Agents panel and in the Functions explorer.
{% endhint %}

## Persisting data

The agent links its internal `/shared` directory to the router's persistent `/data` partition, so nothing has to be mounted by hand.

* Configuration and instances lie in the router's flash memory.
* Uploading a newer `.tar` into the same container keeps that data and re-attaches it to the new version.
* A backup of the router's profile through the INSYS web interface includes the agent's state.
