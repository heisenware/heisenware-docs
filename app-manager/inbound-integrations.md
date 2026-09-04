# Integrations (inbound)

The Integrations panel gives you a central overview of every inbound data connection from external systems. Whatever sends data to Heisenware, an IoT sensor, a custom Python script, or a Heisenware Agent, shows up here.

<figure><img src="../.gitbook/assets/Integrations.png" alt=""><figcaption><p>Integrations panel</p></figcaption></figure>

## Integration types

Heisenware connects external data three ways:

### Native or Docker Agent

[Agents](../app-builder/build-backend/agents/) securely bridge data from private networks (on-premises servers, local databases) to the cloud.

* **Setup**: You create and deploy Native Agents directly in the App Builder. You download and deploy Docker Agents via Docker.
* **Management**: Once deployed, an Agent entry appears in the Integrations panel for monitoring. No manual credentials required.

### MQTT client

The standard choice for general IoT use cases. Use this for sensors or devices that push data to Heisenware's MQTT broker. Inside your Apps, the [MQTT client connector](../app-builder/build-backend/functions/connectors/mqtt-client.md) handles these messages. For a full walkthrough, see [Connect an external MQTT client](../tutorials/integration-guides/connect-an-external-mqtt-client.md).

### [VRPC](../advanced/vrpc/) client

An advanced method for connecting custom code and proprietary libraries, the most powerful option for specialized software integrations.

### Native agent

An [Agent](../app-builder/build-backend/agents/README.md) built for your machines: choose the connectors it should carry, the target operating system and, for a fleet, a prefix. Compiling takes a minute or two; the archive appears next to the integration as soon as it is ready. The same builder is available in the App Builder's Function Explorer.

A fleet built with a prefix has no row of its own: every machine that starts the executable is onboarded on its first login and appears as its own integration, named `<prefix>-edge-connect-<id>`. The executable itself is listed under **Executables**.

### MCP connector

Lets your own AI agent — Claude Code, Claude Desktop, any MCP client — drive the platform; see [MCP Server](../app-builder/build-backend/agents/mcp-server.md). The panel builds a package with the integration's credentials inside and hands you the lines to paste. Tick _read-only_ for a production-support connector that cannot change anything.

## The integration and its executable

Native agents and MCP connectors are integrations with an executable attached. The **Executable** column shows the file the platform built; click it to see its size and build time, download it, or copy a link with a twelve-hour access ticket — an MCP connector also shows the lines to paste into the client.

The **Executables** list below the integrations shows every file the platform serves from its download zones, `native-agents` and `mcp`, whether or not an integration claims it: agents built from the App Builder's Function Explorer, or archives whose integration has since been deleted. Each can be shown and downloaded from there. Changing the password rebuilds an MCP connector (a native agent asks for a manual rebuild), deleting the integration deletes its MCP package, and deactivating the integration stops the executable at its next login. Every integration holds one authority, shown in the **Access** column: full access to its workspace.

## Connecting MQTT and VRPC clients

Agents connect automatically, but MQTT and VRPC clients need authorization one of two ways:

### Method 1: Manual credential creation

Use this method to pre-configure your external client with a fixed username and password.

{% stepper %}
{% step %}
#### Create

Click Create in the Integrations panel.
{% endstep %}

{% step %}
#### Select type

Select if you need an MQTT or VRPC client.
{% endstep %}

{% step %}
#### Edit/copy credentials

Copy the generated credentials or edit them to your needs.
{% endstep %}

{% step %}
#### Connect

Paste these credentials into your external client's configuration.
{% endstep %}
{% endstepper %}

### Method 2: Smart onboarding

The preferred, passwordless method. The external client sends a request, and you approve it in the App Builder. For a detailed guide, see the [smart onboarding section](../app-builder/build-backend/functions/function-explorer.md#smart-onboarding).

## Integrate custom code via VRPC

To integrate your code, write a [Code Adapter](../account/hosting-and-architecture.md#custom-code-adapters) around your existing functions, then load it as a Custom Extension.

* **Supported languages**: Arduino (ESP32), C++, Node.js, and Python.
* **Use cases**: Integrating legacy systems, running complex algorithms, or using specialized software libraries.

{% hint style="info" %}
#### Technical implementation

For details, examples, and adapter setup, visit our [VRPC developer section](../advanced/vrpc/).
{% endhint %}
