# Connectors

Connectors are [functions](../functions.md) that handle the translation between Heisenware and external systems. They let flows communicate natively with third-party systems, industrial protocols, and external databases.

## Connection scenarios

The network location of the target system determines where a connector executes.

### Direct connection

When the platform can reach the target system directly, execute the connector in the application backend. The platform automatically manages the connection and execution. This scenario applies to:

* The Heisenware cloud reaching systems on the public internet, such as a cloud API, a web service, or a public MQTT broker.
* An [on-premise installation](../../../tutorials/on-premise-installation.md) reaching systems within the same network.

### Local connection (via Agent)

If the target system resides in an isolated network segment without inbound access (such as a PLC in a machine network), deploy an Agent. Agents are available as a [Native Agent](../agents/native-agent.md) or a [Docker Agent](../agents/docker-agent.md).

{% stepper %}
{% step %}

### Build

Compile a Native Agent directly inside the [App Builder](../../overview.md) and select which connectors to include in the package.
{% endstep %}

{% step %}

### Deploy

Install the binary on a target system within the local network.
{% endstep %}

{% step %}

### Use

Once the Agent comes online, it appears automatically in the [Function Explorer](function-explorer.md). The Agent displays the connectors selected during the build. These functions execute directly at the edge, next to local devices.
{% endstep %}
{% endstepper %}

{% hint style="info" %}
For a deep dive into the build process and deployment options, see the [Agents](../agents.md) article.
{% endhint %}

## Instance creation

Most connectors require an instance configuration before they can interact with a target system. Create an instance using the `create` function. The instance preserves configuration schemas, tracks credentials, and manages the connection lifecycle.

Certain connectors provide purely static utilities (such as [File I/O](connectors/file-i-o.md) or the [operating system (OS)](connectors/operating-system-os.md)) and execute calls immediately without an instance configuration.

## Available connectors

The following table lists the available connectors and their required configuration types. Each link leads to a detailed configuration guide.

| Connector | Description | Type |
| :--- | :--- | :--- |
| [Allen-Bradley](connectors/allen-bradley.md) | Connects directly to Allen-Bradley PLCs for machine data acquisition and control. | [Instance creation required](#instance-creation) |
| [Email](connectors/email.md) | Sends emails via SMTP. | [Instance creation required](#instance-creation) |
| [File I/O](connectors/file-i-o.md) | Reads from and writes to files on a connected file system. | Static functions only |
| [GraphQL](connectors/graphql.md) | Interacts with any GraphQL API for flexible data queries. | Static functions only |
| [GPIO Counter](connectors/gpio-counter.md) | Counts digital pulses on Raspberry Pi GPIO pins, with automatic run/stop detection. | [Instance creation required](#instance-creation) |
| [Heidenhain DNC](connectors/heidenhain-dnc.md) | Connects to Heidenhain DNC systems and requires a local connection scenario. | [Instance creation required](#instance-creation) |
| [Heidenhain OPC UA](connectors/heidenhain-opc-ua.md) | Connects to Heidenhain controllers using the OPC UA protocol. | [Instance creation required](#instance-creation) |
| [HTTP / REST](connectors/http-rest.md) | Makes requests to standard web APIs and HTTP endpoints. | Mixed (Static and instance options) |
| [Hydra MIP](connectors/hydra-mip.md) | Integrates natively with the Manufacturing Integration Platform (MIP). | [Instance creation required](#instance-creation) |
| [Kuando Busylight](connectors/kuando-busylight.md) | Controls Kuando Busylight status indicators. | [Instance creation required](#instance-creation) |
| [Label Printer](connectors/label-printer.md) | Sends print commands to ZPL-compatible label printers. | [Instance creation required](#instance-creation) |
| [Modbus](connectors/modbus.md) | Communicates with industrial devices using the Modbus protocol. | [Instance creation required](#instance-creation) |
| [MQTT Client](connectors/mqtt-client.md) | Connects to an MQTT broker to publish and subscribe to topics. | [Instance creation required](#instance-creation) |
| [OPC UA Client](connectors/opc-ua-client.md) | Connects to an OPC UA server for industrial automation data exchange. | [Instance creation required](#instance-creation) |
| [OPC UA Server](connectors/opc-ua-server.md) | Deploys an OPC UA server to expose data from the application. | [Instance creation required](#instance-creation) |
| [Operating System (OS)](connectors/operating-system-os.md) | Accesses statistics and information from the host operating system. | Static functions only |
| [Raspberry Pi GPIO](connectors/raspberry-pi-gpio.md) | Reads and controls GPIO pins on a Raspberry Pi 5. | Static functions only |
| [Relational database](../storage/relational-database.md) | Connects to external SQL databases. | [Instance creation required](#instance-creation) |
| [RS-232/485](connectors/rs-232-485.md) | Communicates with devices over a serial port. | [Instance creation required](#instance-creation) |
| [SAP Digital Manufacturing](connectors/sap-digital-manufacturing.md) | Integrates natively with SAP Digital Manufacturing. | [Instance creation required](#instance-creation) |
| [Siemens S7](connectors/siemens-s7.md) | Connects directly to Siemens S7 PLCs for data acquisition and control. | [Instance creation required](#instance-creation) |
| [Timeseries database](../storage/timeseries-database.md) | Connects to external InfluxDB databases. | [Instance creation required](#instance-creation) |
| [Zebra RFID IoT](connectors/zebra-rfid-iot.md) | Interacts with Zebra RFID readers and devices. | [Instance creation required](#instance-creation) |
