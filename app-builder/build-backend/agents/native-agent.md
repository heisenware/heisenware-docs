# Native Agent

The Native Agent is a fully installable package. It registers itself as a background service (a Windows service or Linux daemon), so it runs around the clock without a logged-in user. Once installed, the platform restarts it and brings new builds to it remotely from the [Agents panel](../../../app-manager/agents.md) of the App Manager.

## How it works

* **Persistence**: The operating system manages the Agent (systemd on Linux, Service Manager on Windows). If the machine reboots, the Agent starts automatically.
* **Security**: The Agent connects through an outbound-only MQTTS connection on port 8883, and downloads its updates over HTTPS on port 443 from the same platform host. No inbound firewall rules or VPNs are required. It verifies the platform's certificate, and it takes a build only when the platform signed it.
* **Compatibility**: Available for Windows, macOS, Linux (standard and Alpine), and ARM64 (for industrial PCs).

## Installing the Native Agent

{% stepper %}
{% step %}
#### Build

In the App Manager's [Agents panel](../../../app-manager/agents.md), click **Build agent**.

* **Connectors**: Select the connectors (e.g., S7, SQL) this Agent should carry. The dialog says what each one can do on the host.
* **Target OS**: Choose the operating system of the machine where the Agent will run.
* **Fleet name (optional)**: Enter a [fleet name](native-agent.md#fleets-one-build-for-many-hosts) if you plan to install the same build on several hosts (e.g., `milling`). Lowercase letters and digits only. Each installation then joins the fleet under its own ID (e.g., `milling-native-agent-abc12`).
* **Note**: What this build is for. It shows with the build and in every rollout of it.

Compiling takes a minute or two. The build then appears under **Builds** with its requirements for IT and the installer to download. The App Builder's Function Explorer has an *Add agent* button that opens the same dialog.
{% endstep %}

{% step %}
#### Hand the requirements to IT

Every build comes with a **Requirements for IT** sheet: host name, ports, service, paths, disk space, and what the Agent and its connectors can do on the host. The same text is inside the installer archive as `REQUIREMENTS.md`. Give it to the people who run the hosts and the network before the first installation.
{% endstep %}

{% step %}
#### Run the installer

Move the package to the target machine, unzip, and run the installer. This is the one installation by hand; every later build reaches the host remotely.

* **Windows**: Run the `.exe` installer. It registers the service and starts the Agent automatically.
* **Linux**: Install the package with `sudo dpkg -i` as the archive's README says. It registers the daemon and starts the Agent.
{% endstep %}

{% step %}
#### Automatic discovery

The service starts immediately after installation. The Agent appears in the App Manager's Agents panel and, with its connectors, in the [Function Explorer](../functions/function-explorer.md). Drag these functions onto the Backend Builder canvas. In production Apps, they execute locally on the machine running the Agent.
{% endstep %}
{% endstepper %}

{% hint style="warning" %}
#### Troubleshooting: check ports 8883 and 443

The Agent requires port 8883 to be open for outbound traffic to the platform host, and port 443 to the same host for updates. If the Agent runs but does not appear in the Agents panel, ask your IT administrator to check whether a firewall blocks port 8883. If it appears but is reported as not ready for updates, port 443 is the usual reason. Both ports are named in the requirements sheet of the build.
{% endhint %}

## Updating the Agent

From the second build on, the Agent updates itself when the platform tells it to: select it in the Agents panel and click **Update to current**, or roll the build out to the whole fleet. The Agent downloads the build from the platform, verifies its checksum and the platform's signature, swaps its executable, and restarts through the service manager. Counters and connector state survive the restart; they live in the Agent's work directory, which an update never touches. If the new build does not connect within five minutes, the host swaps the previous executable back by itself.

Agents built before this feature existed are shown as **legacy**: they carry no update channel. Install the current build on their hosts by hand once; from then on they update remotely.

## Managing the Agent service

The App Manager restarts the Agent and shows its log. On the host itself, the standard OS tools work as well:

* **Windows**: Open the Services app (`services.msc`), find the Heisenware Agent, and use the Start, Stop, or Restart controls.
* **Linux**: Manage the daemon on the command line:
  * `sudo systemctl status heisenware-<agent>`
  * `sudo systemctl restart heisenware-<agent>`

On Linux the Agent's executable lives in its work directory under `/var/lib/heisenware/<service>/bin/`, its log under `/var/log/heisenware/`. On Windows both are in the installation folder.

## Fleets: one build for many hosts

The fleet name changes how an Agent identifies itself. Use it to manage a fleet of similar machines or devices.

* **Without a fleet name (default)**: The Agent has a built-in, unique ID. You can move the installer to different computers, but they are all recognized as the same single Agent.
* **With a fleet name**: The Agent generates a new, unique ID on its first launch in a specific directory and joins the fleet under it. Install the exact same build on several hosts and each one connects as a separate entry, the fleet name first (e.g., `milling-native-agent-abc12`, `milling-native-agent-xyz78`). A fleet has one build line: a rollout brings a build to all of its Agents.

{% hint style="danger" %}
**Irreversible action**

Do not move an Agent folder that was created with a prefix after it has run for the first time. It relies on a hidden ID file in its directory to maintain its unique identity.
{% endhint %}
