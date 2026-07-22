# Native Agent

The Native Agent is a fully installable package. It registers itself as a background service (a Windows service or Linux daemon), so it runs around the clock without a logged-in user.

## How it works

* **Persistence**: The operating system manages the Agent (systemd on Linux, Service Manager on Windows). If the machine reboots, the Agent starts automatically.
* **Security**: The Agent connects through an outbound-only MQTTS connection on port 8883. No inbound firewall rules or VPNs are required.
* **Compatibility**: Available for Windows, macOS, Linux (standard and Alpine), and ARM64 (for industrial PCs).

## Installing the Native Agent

{% stepper %}
{% step %}
#### Configure and build

In the [Function Explorer](../functions/function-explorer.md), click the create Agent icon (<i class="fa-cloud-arrow-down">:cloud-arrow-down:</i>).

* **Connectors**: Select the connectors (e.g., S7, SQL) this Agent should carry.
* **Target OS**: Choose the operating system of the machine where the Agent will run.
* **Prefix (optional)**: Enter a [prefix](native-agent.md#using-a-prefix-for-fleet-deployment) if you plan to deploy the same file to multiple machines (e.g., `milling-machine`). Each instance then generates its own unique ID (e.g., `milling-machine-abc123`).
* Click _Prepare for download_ to compile and download your installer package.

<figure><img src="../../../.gitbook/assets/native_agent_connecters_looped.gif" alt="" width="375"><figcaption></figcaption></figure>

{% hint style="info" %}
#### Lost your file?

All Agents you have built are backed up on the [file server](../file-explorer.md) in the `native-agents` folder.
{% endhint %}
{% endstep %}

{% step %}
#### Run the installer

Move the package to the target machine, unzip, and run the installer.

* **Windows**: Run the `.exe` installer. It registers the service and starts the Agent automatically.
* **Linux/macOS**: Run the provided install script. You likely need `sudo` privileges so the Agent can register as a system daemon.
{% endstep %}

{% step %}
#### Automatic discovery

The service starts immediately after installation. The Agent and its connectors appear in the [Function Explorer](../functions/function-explorer.md). Drag these functions onto the Backend Builder canvas. In production Apps, they execute locally on the machine running the Agent.
{% endstep %}
{% endstepper %}

{% hint style="warning" %}
#### Troubleshooting: check port 8883

The Agent requires port 8883 to be open for outbound traffic. If the Agent runs but does not appear in your Function Explorer, ask your IT administrator to check whether a firewall blocks this port.
{% endhint %}

## Managing the Agent service

The Agent runs as a service and has no user interface window. Manage its state with the standard OS tools:

* **Windows**: Open the Services app (`services.msc`), find the Heisenware Agent, and use the Start, Stop, or Restart controls.
* **Linux**: Manage the daemon on the command line:
  * `sudo systemctl status heisenware-agent`
  * `sudo systemctl restart heisenware-agent`

## Using a prefix for fleet deployment

The prefix option changes how an Agent identifies itself. Use it to manage a fleet of similar machines or devices.

* **Without a prefix (default)**: The Agent has a built-in, unique ID. You can move the installer to different computers, but they are all recognized as the same single Agent.
* **With a prefix**: The Agent generates a new, unique ID on its first launch in a specific directory. Deploy the exact same installer on multiple machines and each one connects as a separate entry in your Function Explorer (e.g., `milling-machine-abc123`, `milling-machine-xyz789`).

{% hint style="danger" %}
**Irreversible action**

Do not move an Agent folder that was created with a prefix after it has run for the first time. It relies on a hidden ID file in its directory to maintain its unique identity.
{% endhint %}
