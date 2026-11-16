# Connectors

Connectors are the [functions](../../../concepts/executors-and-instances.md) that speak to the world outside Heisenware: machines, industrial protocols, web APIs, mail servers, databases and devices. They come with the platform, on the agent named **Connectors**.

## Where a connector runs

Every executor carries an address, and its agent decides which network the call goes out from. So the question is always: can the platform reach that system itself?

### Direct connection

When it can, the connector runs on the platform's own Connectors agent and you choose nothing. This holds for:

* The Heisenware Cloud reaching systems on the public internet, such as a cloud API, a web service, or a public MQTT broker.
* An [on-premise installation](../../../self-hosting/install.md) reaching systems within the same network.

### Local connection (via an agent)

If the target system sits in an isolated network segment the platform cannot reach, such as a PLC in a machine network, an agent inside that network runs the connector. It comes as a [native agent](../../../app-manager/agents/native-agent.md), a [Docker agent](../../../app-manager/agents/docker-agent.md) or an [LXC agent](../../../app-manager/agents/lxc-agent.md).

{% stepper %}
{% step %}
#### Build

The App Manager's **Agents** panel builds one. **Build agent** asks for a name, the target platform and the connectors to include, and says what each of them can do on the host. The finished build appears under **Builds**, with the installer to download and the requirements for your IT.
{% endstep %}

{% step %}
#### Install

Your IT installs it on a host inside that network. The agent dials out to the platform, so no inbound hole is needed.
{% endstep %}

{% step %}
#### Use

Once the agent is online it appears by its name in the [Functions explorer](../../../app-builder/explorers/functions.md), with the connectors it was built with. An executor on that agent runs next to the devices.
{% endstep %}
{% endstepper %}

{% hint style="info" %}
Which network a function runs in is the executor's address. See [Agents and where code runs](../../../concepts/agents-and-where-code-runs.md).
{% endhint %}

## Instance creation

Most connectors need an instance before they can reach a target system: a living object inside the agent that holds the connection and its credentials. The `create` function is the constructor; `delete` ends it.

An instance has a name, unique on its agent, and every App of the workspace reaches it by that name. It is created once and then outlives deployments and platform restarts: the agent remembers how it was born and re-creates it when it starts. Trigger the constructor with `onAppStart`, and creating an instance that already exists does nothing.

{% hint style="warning" %}
An instance is constructed, never reconfigured. Changing a `create` executor's inputs and triggering it again does not re-apply them. Use the class's setter functions for what can change at runtime; otherwise delete the instance, set the new inputs and create it again.
{% endhint %}

Some connectors need no instance and work right away. [File I/O](file-i-o.md), [GraphQL](graphql.md), [Operating system (OS)](operating-system-os.md) and [Trusted certificates](trusted-certificates.md) offer static functions only, and [HTTP / REST](http-rest.md) has both: static functions for a single call, an instance where many calls share a base URL and credentials.

## Available connectors

The following table lists the available connectors and their required configuration types. Each link leads to a detailed configuration guide.

| Connector                                                 | Description                                                                         | Type                                |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------- |
| [Allen-Bradley](allen-bradley.md)                         | Connects directly to Allen-Bradley PLCs for machine data acquisition and control.   | Instance creation required          |
| [ctrlX Data Layer](ctrlx-data-layer.md)                   | Reads, writes and subscribes to the Data Layer of a Bosch Rexroth ctrlX CORE.       | Instance creation required          |
| [Email](email.md)                                         | Sends emails via SMTP.                                                              | Instance creation required          |
| [File I/O](file-i-o.md)                                   | Reads from and writes to files on a connected file system.                          | Static functions only               |
| [GraphQL](graphql.md)                                     | Interacts with any GraphQL API for flexible data queries.                           | Static functions only               |
| [GPIO counter](gpio-counter.md)                           | Counts digital pulses on Raspberry Pi GPIO pins, with automatic run/stop detection. | Instance creation required          |
| [Heidenhain DNC](heidenhain-dnc.md)                       | Reaches Heidenhain controls without OPC UA, over Heidenhain's DNC interface.        | On request, as its own agent         |
| [Heidenhain OPC UA](heidenhain-opc-ua.md)                 | Connects to Heidenhain controllers using the OPC UA protocol.                       | Instance creation required          |
| [HTTP / REST](http-rest.md)                               | Makes requests to standard web APIs and HTTP endpoints.                             | Mixed (Static and instance options) |
| [Hydra MIP](hydra-mip.md)                                 | Integrates natively with the Manufacturing Integration Platform (MIP).              | Instance creation required          |
| [Kuando Busylight](kuando-busylight.md)                   | Controls Kuando Busylight status indicators.                                        | Instance creation required          |
| [Label printer](label-printer.md)                         | Sends print commands to ZPL-compatible label printers.                              | Instance creation required          |
| [Modbus](modbus.md)                                       | Communicates with industrial devices using the Modbus protocol.                     | Instance creation required          |
| [MQTT Client](mqtt-client.md)                             | Connects to an MQTT broker to publish and subscribe to topics.                      | Instance creation required          |
| [OPC UA Client](opc-ua-client.md)                         | Connects to an OPC UA server for industrial automation data exchange.               | Instance creation required          |
| [OPC UA Server](opc-ua-server.md)                         | Deploys an OPC UA server to expose data from the application.                       | Instance creation required          |
| [Operating system (OS)](operating-system-os.md)           | Accesses statistics and information from the host operating system.                 | Static functions only               |
| [Relational database](../storage/relational-database.md)  | Connects to external SQL databases.                                                 | Instance creation required          |
| [RS-232/485](rs-232-485.md)                               | Communicates with devices over a serial port.                                       | Instance creation required          |
| [SAP Digital Manufacturing](sap-digital-manufacturing.md) | Integrates natively with SAP Digital Manufacturing.                                 | Instance creation required          |
| [Siemens S7](siemens-s7.md)                               | Connects directly to Siemens S7 PLCs for data acquisition and control.              | Instance creation required          |
| [Timeseries database](../storage/timeseries-database.md)  | Connects to external InfluxDB databases.                                            | Instance creation required          |
| [Trusted certificates](trusted-certificates.md)           | Trusts the machines and servers on your own network once, for every connector.      | Static functions only               |
| [Zebra RFID IoT](zebra-rfid-iot.md)                       | Interacts with Zebra RFID readers and devices.                                      | Instance creation required          |
