# Native agent

The native agent is a package the platform compiles for one host. It installs as a background service, a Windows service or a Linux daemon, so it runs around the clock without anyone logged in, and it carries its own credentials. After the first installation the platform restarts it and brings new builds to it remotely from the [Agents panel](README.md).

## What it is

* **A service**: the operating system keeps it alive. It starts with the machine and restarts after a failure.
* **Outbound only**: it dials the platform over MQTTS on port 8883 and downloads updates over HTTPS on port 443, both to the same host. No inbound rule, no port forwarding, no VPN. It verifies the platform's certificate, and it takes a build only when the platform signed it.
* **Built for its target**: Windows, macOS, Linux, Alpine and ARM 64 (industrial PCs and the ctrlX CORE). A Linux or ARM 64 build is wrapped either as a Debian package or as an app for ctrlX OS, see [Running on a ctrlX CORE](#running-on-a-ctrlx-core).

## Installing a native agent

{% stepper %}
{% step %}
#### Build it

In the App Manager's [Agents panel](README.md), click **Build agent**.

* **Connectors**: what this agent carries, S7 and SQL for example. The dialog says what each one can do on the host.
* **Target OS**: the operating system of the machine it will run on.
* **Package** (Linux and ARM 64 only): a Debian package for a host with systemd, or a **ctrlX OS app** (`.snap`) for a ctrlX CORE.
* **Note**: what this build is for. It shows with the build and in every rollout of it.
* **Fleet name** (optional): a [fleet name](#fleets-one-build-for-many-hosts) if the same build goes onto several hosts, `milling` for example. Lowercase letters and digits only. Each installation then joins the fleet under its own id, `milling-native-agent-abc12`.

**Create and build** starts the compilation. It takes a minute or two and goes on when you close the dialog. The build then appears under **Builds** with its requirements for IT and its installer. The App Builder's Functions explorer has an **Add agent** button that opens the same dialog.
{% endstep %}

{% step %}
#### Hand the requirements to IT

Every build comes with a **Requirements for IT** sheet: host name, ports, service, paths, disk space, and what the agent and its connectors can do on the host. The same text is inside the installer archive as `REQUIREMENTS.md`. Give it to the people who run the hosts and the network before the first installation.
{% endstep %}

{% step %}
#### Run the installer

**Installer** on the build gives you a download link, valid for twelve hours, and for a Debian package the three lines that fetch, unpack and install it from a shell on the host, which is what a machine without a browser needs. For a fleet the dialog also offers a **Machine name**: fill it in and the lines write that name into the agent's work directory, so the host joins the fleet as `milling-native-agent-m700` instead of under a random id.

This is the one installation by hand; every later build reaches the host remotely.

{% tabs %}
{% tab title="Linux" %}
Install the Debian package with `sudo dpkg -i`, as the lines in the installer dialog and the archive's README say. It registers the daemon and starts the agent.
{% endtab %}

{% tab title="Windows" %}
Unpack the `.zip` and run the `.exe` installer. It registers the service and starts the agent.
{% endtab %}

{% tab title="ctrlX OS" %}
Install the `.snap` on the device under **Apps**, see [Running on a ctrlX CORE](#running-on-a-ctrlx-core).
{% endtab %}
{% endtabs %}
{% endstep %}

{% step %}
#### Use it

The agent connects as soon as the service starts. It appears in the Agents panel and, with its connectors, in the [Functions explorer](../../app-builder/explorers/functions.md). Drag those functions onto the Flowboard: in a deployed App they run on that machine, inside its network.
{% endstep %}
{% endstepper %}

{% hint style="warning" %}
#### Troubleshooting: ports 8883 and 443

The agent needs outbound TCP 8883 to the platform host for its data channel and TCP 443 to the same host for updates, with direct egress: an HTTP proxy in the path stops both. If the agent runs but never appears in the Agents panel, ask your IT administrator whether a firewall blocks 8883. If it appears but is reported as not ready for updates, 443 is the usual reason. Both ports are named in the build's requirements sheet.
{% endhint %}

## Updating the agent

From the second build on, the agent updates itself when the platform tells it to: select it in the Agents panel and click **Update to current**, or roll the build out to the whole fleet. The agent downloads the build from the platform, verifies its size, its checksum and the platform's signature, swaps its executable and restarts through the service manager. Counters and connector state survive that: they live in the agent's work directory, which an update never touches. If the new build does not connect within five minutes, the host swaps the previous executable back by itself.

Agents built before this feature existed show as **legacy**: they carry no update channel. Install the current build on their hosts by hand once; from then on they update remotely.

An agent installed as a ctrlX OS app is the other exception: its executable is read-only inside the app, so it takes no remote update. Install the next build on the device the same way as the first; the Agents panel shows which build every device runs.

## Managing the agent service

The App Manager restarts the agent and shows its log. On the host itself the standard tools work too. The service is named after the fleet or the agent and the workspace: `heisenware-<fleet>-<account>-<workspace>`, for example `heisenware-milling-acme-default`.

{% tabs %}
{% tab title="Linux" %}
```bash
sudo systemctl status heisenware-<fleet>-<account>-<workspace>
sudo systemctl restart heisenware-<fleet>-<account>-<workspace>
```

The executable lives in the work directory, `/var/lib/heisenware/<service>/bin/heisenware-agent`, the log under `/var/log/heisenware/<service>.log`.
{% endtab %}

{% tab title="Windows" %}
Open the Services app (`services.msc`) and find `<service>Service`. Start, Stop and Restart work as for any service. The executable and the work directory are the installation folder, by default `Program Files\<service>`; the log is `<install folder>\logs\service.log`.
{% endtab %}

{% tab title="ctrlX OS" %}
The app is managed under **Apps** on the device, its log under **Diagnostics** or on the device's shell:

```bash
sudo snap logs ctrlx-heisenware-<fleet> -f
```
{% endtab %}
{% endtabs %}

## Running on a ctrlX CORE

A ctrlX CORE runs apps, and an app is a snap. The platform builds the agent as one: choose the target **ARM 64** for a ctrlX CORE (X3, X5, X7) or **Linux** for a ctrlX COREvirtual, and **ctrlX OS app** as the package. Put the [ctrlX Data Layer](../../reference/functions/connectors/ctrlx-data-layer.md) connector into the build, plus whatever the App needs on the device, an MQTT client for example. The archive holds the `.snap` and a README with the steps below.

On the device:

1. **Apps → Settings**: enable **Allow installation from unknown source**. The app is built by your platform, not signed by Bosch Rexroth.
2. Switch the device to **Service mode**.
3. **Apps → Install from file** and choose the `.snap`.
4. Switch back to **Operating mode**. The agent starts, connects to the platform and appears in the Agents panel. From then on it starts with the device and restarts after every exit.

Inside the device the ctrlX connector reaches the Data Layer at `https://localhost`; trust the device's certificate once with `TrustStore.trustServer('https://localhost')`. The agent keeps its identity, cache and trusted certificates in `/var/snap/ctrlx-heisenware-<fleet>/common`, so a newer build installed the same way carries on as the same agent. The App Manager restarts it and reads its log as for any other agent; a remote update is the one thing it does not do.

{% hint style="info" %}
The app is named `ctrlx-heisenware-<fleet name>` (or the agent's id without a fleet), so a fleet name for a ctrlX build has at most 23 characters. It is built on the snap base `core24`, the base of the current ctrlX SDK; a device on an older ctrlX OS that carries only `core22` cannot install it.
{% endhint %}

## Fleets: one build for many hosts

A fleet name changes how an agent identifies itself, so that one build can serve many similar machines.

* **Without a fleet name**: the build carries one fixed id. Install it on a second machine and both connect as the same agent.
* **With a fleet name**: the build carries the fleet's template account. At its first start each installation takes an id of its own and joins the fleet under it, `milling-native-agent-abc12`, `milling-native-agent-xyz78`. Name the machine in the installer dialog instead and it joins as `milling-native-agent-m700`. A fleet has one build line: a rollout brings a build to all of its agents.

{% hint style="danger" %}
#### Do not move a fleet agent's folder

An agent of a fleet writes its id into `.hw-agent-id` in its work directory at its first start and reads it at every later one. Copy or move that folder and the platform sees one agent in two places.
{% endhint %}
