# Connectors

Connectors are [functions](../) that handle translation between Heisenware and external systems. They let flows communicate natively with third-party systems, industrial protocols, and external databases.

## Connection scenarios

The network location of the target system determines where a connector executes.

### Direct connection

When the platform can reach the target system directly, execute the connector in the application backend. The platform automatically manages the connection and execution. This scenario applies to:

* The Heisenware Cloud reaching systems on the public internet, such as a cloud API, a web service, or a public MQTT broker.
* An [on-premise installation](../../../../tutorials/on-premise-installation.md) reaching systems within the same network.

### Local connection (via Agent)

If the target system resides in an isolated network segment without inbound access (such as a PLC in a machine network), deploy an Agent. Agents are available as a [Native Agent](../../agents/native-agent.md) or a [Docker Agent](../../agents/docker-agent.md).

{% stepper %}
{% step %}
#### Build

Compile a Native Agent directly inside the [App Builder](../../../overview.md) and select which connectors to include in the package.
{% endstep %}

{% step %}
#### Deploy

Install the binary on a target system within the local network.
{% endstep %}

{% step %}
#### Use

Once the Agent comes online, it appears automatically in the [Function Explorer](../function-explorer.md). The Agent displays the connectors selected during the build. These functions execute directly at the edge, next to local devices.
{% endstep %}
{% endstepper %}

{% hint style="info" %}
For a deep dive into the build process and deployment options, see the [Agents](../../agents/) article.
{% endhint %}

## Instance creation

Most connectors require an instance configuration before they can interact with a target system. Create an instance using the `create` function. The instance preserves configuration schemas, tracks credentials, and manages the connection lifecycle.

Certain connectors provide purely static utilities (such as [File I/O](file-i-o.md) or the [Operating System (OS)](operating-system-os.md)) and execute calls immediately without an instance configuration.

## Available connectors

The following table lists the available connectors and their required configuration types. Each link leads to a detailed configuration guide.

| Connector                                                 | Description                                                                         | Type                                |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------- |
| [Allen-Bradley](allen-bradley.md)                         | Connects directly to Allen-Bradley PLCs for machine data acquisition and control.   | Instance creation required          |
| [Email](email.md)                                         | Sends emails via SMTP.                                                              | Instance creation required          |
| [File I/O](file-i-o.md)                                   | Reads from and writes to files on a connected file system.                          | Static functions only               |
| [GraphQL](graphql.md)                                     | Interacts with any GraphQL API for flexible data queries.                           | Static functions only               |
| [GPIO counter](gpio-counter.md)                           | Counts digital pulses on Raspberry Pi GPIO pins, with automatic run/stop detection. | Instance creation required          |
| [Heidenhain DNC](heidenhain-dnc.md)                       | Connects to Heidenhain DNC systems and requires a local connection scenario.        | Instance creation required          |
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
| [Zebra RFID IoT](zebra-rfid-iot.md)                       | Interacts with Zebra RFID readers and devices.                                      | Instance creation required          |
