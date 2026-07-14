# LXC Agent (Insys)

The LXC Agent is a specialized version of the Heisenware Agent for edge computing on INSYS icom industrial routers and gateways (such as the MRX, MRO, ECR, and SCR series). It runs as an isolated Linux system container (LXC) directly within the router's icom SmartBox environment.

## Key differences

* **Native edge integration**: Runs directly on the router's firmware. No separate industrial PC or Raspberry Pi needed.
* **Pre-packaged format**: Distributed as a self-contained `.tar` update packet that the INSYS router natively understands.
* **Resource optimized**: The container caps its memory usage (128 MB heap) automatically so the router's core networking functions are never interrupted.
* **Automatic persistence**: Maps standard container volumes to the router's internal flash memory, so configurations survive firmware updates.

## Where to get it

The LXC Agent is available as a downloadable `.tar` archive from the public release server. Select the correct architecture for your INSYS gateway:

* **ARMv7** (standard for most MRX/MRO/SCR gateways): `heisenware-insys-<version>-armv7.tar`
* **ARM64**: `heisenware-insys-<version>-arm64.tar`

For example, download the required file directly with `wget`:

```bash
wget "https://downloads.heisenware.cloud/public/heisenware-insys-v92-beta0-armv7.tar"
```

{% hint style="info" %}
Check your INSYS router's datasheet if you are unsure which architecture it uses.
{% endhint %}

## How to use it

The LXC Agent runs on a hardware appliance, so you configure it through the INSYS icom web interface instead of command-line tools.

{% stepper %}
{% step %}
#### Upload the update packet

Log into your INSYS router's web interface and navigate to the Container menu. Upload the `.tar` file you downloaded. Assign the container an instance name (e.g., `heisenware-agent`).
{% endstep %}

{% step %}
#### Configure networking

In the container's network settings, map it to an internal network bridge (e.g., `net2` or `lan`). Assign it a dedicated IPv4 address, subnet mask, and gateway.

{% hint style="warning" %}
#### Port 8883 required

Like every Agent, the LXC container needs outbound internet access on port 8883 to connect to the Heisenware Cloud. Make sure the router's firewall allows this traffic for the container's IP address.
{% endhint %}
{% endstep %}

{% step %}
#### Activate the profile (initial boot)

Click Activate Profile in the INSYS UI. The router boots the LXC container for the first time, extracting the application payload and generating the persistent data directories.
{% endstep %}

{% step %}
#### Provide environment variables (`config.env`)

INSYS LXC containers behave like full lightweight virtual machines, so environment variables cannot be passed through the router's web interface. Provide them via a configuration file instead:

1. Access the container's file system via SSH or SFTP (using the container's newly assigned IP address).
2. Create a text file named `config.env` inside the persistent `/data/` folder.
3. Add the following keys to connect the Agent to your workspace:

```
HW_DOMAIN=<account>.<workspace>
HW_BROKER=mqtts://<account>.heisenware.cloud
HW_USERNAME=<your-vrpc-username>
HW_PASSWORD=<your-vrpc-password>
HW_AGENT_ID=<a-unique-id-for-this-gateway>
```

Generate the username and password by creating a [VRPC integration](../../../app-manager/inbound-integrations.md) in the App Manager.
{% endstep %}

{% step %}
#### Restart the container

Restart the container via the INSYS web interface. On reboot, the Agent automatically detects and parses the `/data/config.env` file. Once the connection is established, the Agent appears in your [Function Explorer](../functions/function-explorer.md).
{% endstep %}
{% endstepper %}

## Persisting data

The LXC Agent handles persistence automatically. The LXC Agent symlinks its internal `/shared` directory to the INSYS router's persistent `/data` partition.

* The router safely stores configurations and instances in its flash memory.
* If you update the Agent by uploading a newer `.tar` file to the same instance, your data stays intact and re-attaches to the new version.
* Backing up the router's profile via the INSYS web interface includes the Agent's configuration state.
