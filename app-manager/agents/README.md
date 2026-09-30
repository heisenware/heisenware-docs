# Agents

The Agents panel shows every [agent](../../concepts/agents-and-where-code-runs.md) connected to your workspace: what runs on which host, which build it carries, and the rollouts that update it. Native agents are built here, updated from here, and restarted from here. The App Manager owns the machine; the [App Builder](../../app-builder/explorers/functions.md) uses the agent's functions.

<figure><img src="../../.gitbook/assets/agents-panel.png" alt=""><figcaption><p>Agents panel</p></figcaption></figure>

## What you see

* **Fleets**: Native agents built with a fleet name, grouped. The group line shows the fleet's current build, how many agents run it, how many are behind, and how many are legacy.
* **Single agents**: Native agents built without a fleet name, each with builds of its own.
* **Unmanaged agents**: everything else that connects to the workspace as an agent, for example a [Docker agent](docker-agent.md) or your own [VRPC](../../developers/vrpc/README.md) adapter. The panel shows their status and when they were last seen; their software is not built here, so nothing updates them.

Every row shows the agent's alias or name, whether it is online, its build, its host and the connectors it carries. Click a row for the details: the build it runs, host facts (load, memory, disk), the readiness checks for an update, the connectors, a timeline of what happened to the agent (online, offline, restarts, updates), and the tail of its log.

### Build states

| State | Meaning |
| --- | --- |
| **current** | The agent runs the fleet's current build. |
| **behind** | A newer build is current. Update it, or roll out the build to the fleet. |
| **ahead** | The agent runs a build newer than the one marked current. |
| **legacy** | The agent was built before builds could be updated remotely. Install the current build on its host by hand once; every build after that arrives remotely. |
| **unmanaged** | Not built by this platform. Status and last seen only. |

## Building an agent

Click **Build agent**, choose the connectors, the target operating system, for a Linux target the **package** (a Debian package for a host with systemd, or a **ctrlX OS app** to install on a ctrlX CORE as a snap, see [Running on a ctrlX CORE](native-agent.md#running-on-a-ctrlx-core)) and, for a fleet, its name, and add a note that says what the build is for. Below the connectors the dialog lists what each one can do on the host: these sentences also end up in the requirements for IT. Compiling takes a minute or two; the build appears under **Builds** as soon as it is ready and its requirements sheet opens.

Every build has a number within its fleet, `b1`, `b2`, and so on. The newest build is the fleet's **current** build: the one an update or a rollout installs unless you pick another. Under **Builds** you can make an older build current, download the installer of any build, read its requirements for IT, or delete builds you no longer need. **Rebuild** compiles a fleet again with its connectors on the platform's current version, for example after a platform update.

The first build of a fleet is installed by hand on every host, exactly as before (see [native agent](native-agent.md)). Every build after that reaches the hosts remotely.

## Requirements for IT

Every build comes with a requirements sheet: the host name and the two ports the agent needs (outbound only, nothing inbound), the service it installs, its paths, the disk space an update needs, what the platform can do on the host through the agent, and what the connectors of this build can do there. Every value is specific to your platform and this build. Hand it to the people who run the hosts and the network before the first installation. The same text ships inside the installer archive as `REQUIREMENTS.md`.

{% hint style="info" %}
#### One more port

Agents already need outbound TCP 8883 to the platform host for their data channel. Updates add outbound TCP 443 to the same host, used only while a build downloads.
{% endhint %}

## Updating agents

Select the agents that are behind and click **Update to current**, or click **Update fleet** on a fleet's line. Either way a **rollout** starts: the platform tells each agent which build to take, the agent downloads it from the platform, verifies it, installs it next to the running executable and restarts. An agent that is offline waits in the rollout until it connects.

An agent installed as a ctrlX OS app is the exception: its executable is read-only inside the app, so it takes no remote update and the rollout dialog lists it as not ready. The panel still shows which build it runs; the next build is installed on the device under **Apps**, as the first one was.

Before the rollout starts, the dialog shows each agent's readiness: whether it can reach the update channel, has enough disk, runs as a service, and can write its executable. Agents that are not ready are left out by default, with the reason.

### Rollout strategies

* **All at once**: every online agent updates now. Fine for a handful.
* **Canary first**: a few agents update first; the rest follow once those have been healthy for a while.
* **In batches**: batches of a chosen size, the next after the previous is healthy.

**Pause on the first failure** stops the rollout when an agent fails or rolls back, until you resume or cancel it. Agents that stay offline for longer than the expiry are skipped. A rollout can start now or at a chosen time.

### What happens on the host

1. The agent downloads the build over HTTPS with a link that expires after twelve hours.
2. It verifies the size, the checksum and the platform's signature. Anything else is discarded.
3. It swaps the executable; the previous one stays next to it.
4. It restarts through the service manager, about ten seconds without connection. Identity, cache and connector state stay in the work directory.
5. Once it has been online for a minute, the build is committed. If the new build does not connect within five minutes, or does not stay up, the host swaps the previous executable back by itself.

The **Rollouts** tab shows every rollout with its progress, each agent's phase, and what went wrong where. Pause, resume, cancel, or retry the failed agents from there.

## Restart and log

**Restart** stops the agent process; the service manager starts it again within seconds, and a counter or connector state survives it. **Show log** fetches the last lines of the agent's log from its host. Both also exist in the App Builder's Functions explorer, in the agent's context menu, for a member whose connector hangs.

## Removing an agent

An offline agent can be removed: its credentials, its records and its retained information on the platform go. A host that still runs it cannot connect any more. Deleting a fleet under **Builds** removes every build and the fleet's credentials; agents that run its builds keep running until they are removed.
