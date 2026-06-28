# LXC Agent (Insys)

The LXC Agent is a specialized version of the Heisenware Agent designed specifically for edge computing on **INSYS icom** industrial routers and gateways (such as the MRX, MRO, ECR, and SCR series). It runs as an isolated Linux System Container (LXC) directly within the router's icom SmartBox environment.

**Key Differences**

* **Native Edge Integration**: It runs directly on the router's firmware, providing deep edge connectivity without needing a separate Industrial PC or Raspberry Pi.
* **Pre-packaged format**: Unlike Docker images, this agent is distributed as a self-contained `.tar` "update packet" that the INSYS router natively understands.
* **Resource Optimized**: The container is strictly optimized for edge hardware, automatically capping memory usage (128 MB heap) to ensure the router's core networking functions are never interrupted.
* **Automatic Persistence**: It seamlessly maps standard container volumes to the router's internal flash memory, ensuring configurations survive firmware updates.

**Where to get it?**

Our LXC agent is available as a downloadable `.tar` archive from our public release server. You will need to select the correct architecture for your specific INSYS gateway:

* **ARMv7** (Standard for most MRX/MRO/SCR gateways): `heisenware-insys-<version>-armv7.tar`
* **ARM64**: `heisenware-insys-<version>-arm64.tar`

You can for example use `wget` to directly download the required file:

```bash
wget "https://downloads.heisenware.cloud/public/heisenware-insys-v92-beta0-armv7.tar"
```

_(Note: Check your INSYS router's datasheet if you are unsure which architecture it uses)._

**How to use it**

Because the LXC Agent runs on a hardware appliance, you do not use command-line tools to deploy it. Instead, you configure it directly through the INSYS icom web interface.

{% stepper %}
{% step %}
**Upload the Update Packet**

Log into your INSYS router's web interface and navigate to the **Container** menu. Upload the `.tar` file you downloaded. Assign the container an **Instance Name** (e.g., `heisenware-agent`).
{% endstep %}

{% step %}
**Configure Networking**

In the container's network settings, map it to an internal network bridge (e.g., `net2` or `lan`). Assign it a dedicated IPv4 address, subnet mask, and gateway.

{% hint style="warning" %}
**Port 8883 Required** Just like the Native Agent, the LXC container requires outbound internet access on port 8883 to connect to the Heisenware Cloud. Ensure the router's firewall allows this traffic for the container's IP address.
{% endhint %}
{% endstep %}

{% step %}
**Activate Profile (Initial Boot)**

Click **Activate Profile** in the INSYS UI. The router will boot the LXC container for the first time, extracting the application payload and generating the persistent data directories.
{% endstep %}

{% step %}
**Provide Environment Variables (`config.env`)**

Unlike standard Docker containers, INSYS LXC containers behave like full lightweight virtual machines, meaning environment variables cannot be passed directly through the router's web interface. Instead, you provide them via a configuration file:

1. Access the container's file system via SSH or SFTP (using the container's newly assigned IP address).
2. Create a standard text file named `config.env` inside the persistent `/data/` folder.
3. Add the following keys to connect the agent to your workspace:

```
HW_DOMAIN=<account>.<workspace>
HW_BROKER=mqtts://<account>.heisenware.cloud
HW_USERNAME=<your-vrpc-username>
HW_PASSWORD=<your-vrpc-password>
HW_AGENT_ID=<a-unique-id-for-this-gateway>
```

_(Note: You can generate the username and password by creating a_ [_VRPC Integration_](../../../../app-manager/integrations-inbound-connections.md#vrpc-client) _in the App Manager)._
{% endstep %}

{% step %}
**Restart the Container**

Restart the container via the INSYS web interface. Upon reboot, the agent will automatically detect and parse the `/data/config.env` file. Once the connection is successfully established, the agent will appear in your Functions Library!
{% endstep %}
{% endstepper %}

**Persisting Data**

To ensure your data and configurations persist across container restarts or router reboots, the agent needs a safe place to write files.

**This is handled automatically.** Behind the scenes, the LXC Agent automatically symlinks its internal `/shared` directory directly to the INSYS router's persistent `/data` partition.

* Any configurations or instances created by the agent are safely stored in the router's flash memory.
* If you ever update the agent by uploading a newer `.tar` file to the same instance, your data will remain completely intact and automatically re-attach to the new version.
* Backing up the router's profile via the INSYS web interface will automatically include the agent's configuration state.
