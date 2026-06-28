# Native Agent

The Native Agent is a fully installable package. When installed, it registers itself as a background service (a Windows Service or Linux Daemon), ensuring 24/7 availability without requiring a user to be logged in.

### How It works

* **Persistence**: The Agent is managed by the OS (Systemd on Linux, Service Manager on Windows). If the machine reboots, the Agent starts automatically.
* **Security**: Established via an outbound-only MQTTS connection (Port 8883). No inbound firewall rules or VPNs are required.
* **Compatibility**: Available for Windows, macOS, Linux (Standard & Alpine), and ARM64 (for Industrial PCs).

### Installing the Native Agent

{% stepper %}
{% step %}
#### Configure and build

In the [Functions Library](../), click the create Agent icon (<i class="fa-cloud-arrow-down">:cloud-arrow-down:</i>).&#x20;

* **Connectors**: Select the specific tools (e.g., S7, SQL) you want this Agent to carry.
* **Target OS**: Choose the operating system of the machine where the Agent will live.
* **Prefix (optional)**: Enter a [prefix](native-agent.md#using-a-prefix-for-fleet-deployment-1) if you plan to deploy this exact file to multiple machines (e.g., `milling-machine-`). Each instance will then automatically generate its own unique ID (e.g., `milling-machine-abc123`).
* Click Prepare for Download to compile and download your installer package.

<figure><img src="../../../../.gitbook/assets/native_agent_connecters_looped.gif" alt="" width="375"><figcaption></figcaption></figure>

{% hint style="info" %}
**Lost your file?**&#x20;

All agents you've built are backed up in the [file server](../../file-explorer.md) under the `native-agents` folder.
{% endhint %}
{% endstep %}

{% step %}
#### Run the installer

Move the package to the target machine, unzip, and run the installer.

* **Windows**: Run the `.exe` installer. It handles service registration and starts the Agent automatically.
* **Linux/macOS**: Run the provided install script. You will likely need `sudo` privileges to allow the Agent to register as a system daemon.
{% endstep %}

{% step %}
#### Automatic discovery

Once installed, the service starts immediately. The Agent and its selected connectors will appear in your library. You can now drag these functions onto the Flow Builder canvas. When using the production apps, they will execute locally on the computer the Agent is running (edge device).
{% endstep %}
{% endstepper %}

{% hint style="warning" %}
**Troubleshooting: Check Port 8883**&#x20;

The Agent requires port 8883 to be open for outbound traffic. If the Agent runs but does not appear in your Library, speak with your IT administrator to ensure this port is not blocked by a firewall.
{% endhint %}

### Managing the Agent Service

Since the Agent runs as a service, it does not have a user interface window. To manage its state, use the standard OS tools:

* **Windows**: Open the Services app (`services.msc`), find the Heisenware Agent, and use the Start, Stop, or Restart controls.
* **Linux**: Use the command line to manage the daemon:
  * `sudo systemctl status heisenware-agent`
  * `sudo systemctl restart heisenware-agent`

### Using a prefix for fleet deployment

The prefix option changes how an Agent identifies itself, which is extremely useful for managing a fleet of similar machines or devices.

* **Without a prefix (default)**: The Agent has a built-in, unique ID. This means you can only run one instance of this installer at a time. You can move the installer to different computers, but they will all be recognized as the same single Agent in your library.
* **With a prefix**: The Agent generates a new, unique ID upon its first launch in a specific directory. This allows you to deploy the exact same installer on multiple machines. Each one will run simultaneously, connecting as a separate entity in your Functions Library (e.g., `milling-machine-abc123`, `milling-machine-xyz789`), making it easy to manage entire fleets of identical endpoints.

{% hint style="danger" %}
Do not move an Agent folder that was created with a prefix after it has been run for the first time. It relies on a hidden ID file in its directory to maintain its unique identity.
{% endhint %}
