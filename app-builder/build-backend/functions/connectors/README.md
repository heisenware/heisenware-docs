# Connectors

Connectors are [functions](/app-builder/build-backend/functions.md) that handle translation between Heisenware and external systems. They let flows communicate natively with third-party systems, industrial protocols, and external databases.

## Connection scenarios

The network location of the target system determines where a connector executes.

### Direct connection

When the platform can reach the target system directly, execute the connector in the application backend. The platform automatically manages the connection and execution. This scenario applies to:

* The Heisenware cloud reaching systems on the public internet, such as a cloud API, a web service, or a public MQTT broker.
* An [on-premise installation](/tutorials/on-premise-installation.md) reaching systems within the same network.

### Local connection (via Agent)

If the target system resides in an isolated network segment without inbound access (such as a PLC in a machine network), deploy an Agent. Agents are available as a [Native Agent](/app-builder/build-backend/agents/native-agent.md) or a [Docker Agent](/app-builder/build-backend/agents/docker-agent.md).

{% stepper %}
{% step %}

### Build

Compile a Native Agent directly inside the [App Builder](/app-builder/overview.md) and select which connectors to include in the package.
{% endstep %}

{% step %}

### Deploy

Install the binary on a target system within the local network.
{% endstep %}

{% step %}

### Use

Once the Agent comes online, it appears automatically in the [Function Explorer](/app-builder/build-backend/functions/function-explorer.md). The Agent displays the connectors selected during the build. These functions execute directly at the edge, next to local devices.
{% endstep %}
{% endstepper %}

{% hint style="info" %}
For a deep dive into the build process and deployment options, see the [Agents](/app-builder/build-backend/agents.md) article.
{% endhint %}

## Instance creation

Most connectors require an instance configuration before they can interact with a target system. Create an instance using the `create` function. The instance preserves configuration schemas, tracks credentials, and manages the connection lifecycle.

Certain connectors provide purely static utilities (such as [File I/O](/app-builder/build-backend/functions/connectors/file-i-o.md) or the [Operating System (OS)](/app-builder/build-backend/functions/connectors/operating-system-os.md)) and execute calls immediately without an instance configuration.

## Available connectors

The following table lists the available connectors and their required configuration types. Each link leads to a detailed configuration guide.

| Connector | Description | Type |
| :--- | :--- | :--- |
| [Allen-Bradley](/app-builder/build-backend/functions/connectors/allen-bradley.md) | Connects directly to Allen-Bradley PLCs for machine data acquisition and control. | Instance creation required|
| [Email](/app-builder/build-backend/functions/connectors/email.md) | Sends emails via SMTP. | Instance creation required|
| [File I/O](/app-builder/build-backend/functions/connectors/file-i-o.md) | Reads from and writes to files on a connected file system. | Static functions only |
| [GraphQL](/app-builder/build-backend/functions/connectors/graphql.md) | Interacts with any GraphQL API for flexible data queries. | Static functions only |
| [GPIO Counter](/app-builder/build-backend/functions/connectors/gpio-counter.md) | Counts digital pulses on Raspberry Pi GPIO pins, with automatic run/stop detection. | Instance creation required|
| [Heidenhain DNC](/app-builder/build-backend/functions/connectors/heidenhain-dnc.md) | Connects to Heidenhain DNC systems and requires a local connection scenario. | Instance creation required|
| [Heidenhain OPC UA](/app-builder/build-backend/functions/connectors/heidenhain-opc-ua.md) | Connects to Heidenhain controllers using the OPC UA protocol. | Instance creation required|
| [HTTP / REST](/app-builder/build-backend/functions/connectors/http-rest.md) | Makes requests to standard web APIs and HTTP endpoints. | Mixed (Static and instance options) |
| [Hydra MIP](/app-builder/build-backend/functions/connectors/hydra-mip.md) | Integrates natively with the Manufacturing Integration Platform (MIP). | Instance creation required|
| [Kuando Busylight](/app-builder/build-backend/functions/connectors/kuando-busylight.md) | Controls Kuando Busylight status indicators. | Instance creation required|
| [Label Printer](/app-builder/build-backend/functions/connectors/label-printer.md) | Sends print commands to ZPL-compatible label printers. | Instance creation required|
| [Modbus](/app-builder/build-backend/functions/connectors/modbus.md) | Communicates with industrial devices using the Modbus protocol. | Instance creation required|
| [MQTT Client](/app-builder/build-backend/functions/connectors/mqtt-client.md) | Connects to an MQTT broker to publish and subscribe to topics. | Instance creation required|
| [OPC UA Client](/app-builder/build-backend/functions/connectors/opc-ua-client.md) | Connects to an OPC UA server for industrial automation data exchange. | Instance creation required|
| [OPC UA Server](/app-builder/build-backend/functions/connectors/opc-ua-server.md) | Deploys an OPC UA server to expose data from the application. | Instance creation required|
| [Operating System (OS)](/app-builder/build-backend/functions/connectors/operating-system-os.md) | Accesses statistics and information from the host operating system. | Static functions only |
| [Relational database](/app-builder/build-backend/functions/storage/relational-database.md) | Connects to external SQL databases. | Instance creation required|
| [RS-232/485](/app-builder/build-backend/functions/connectors/rs-232-485.md) | Communicates with devices over a serial port. | Instance creation required|
| [SAP Digital Manufacturing](/app-builder/build-backend/functions/connectors/sap-digital-manufacturing.md) | Integrates natively with SAP Digital Manufacturing. | Instance creation required|
| [Siemens S7](/app-builder/build-backend/functions/connectors/siemens-s7.md) | Connects directly to Siemens S7 PLCs for data acquisition and control. | Instance creation required|
| [Timeseries database](/app-builder/build-backend/functions/storage/timeseries-database.md) | Connects to external InfluxDB databases. | Instance creation required|
| [Zebra RFID IoT](/app-builder/build-backend/functions/connectors/zebra-rfid-iot.md) | Interacts with Zebra RFID readers and devices. | Instance creation required|
