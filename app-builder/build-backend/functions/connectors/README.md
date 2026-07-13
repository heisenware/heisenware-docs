# Connectors

Connectors are [functions](/app-builder/build-backend/functions.md) that handle the translation between Heisenware and the outside world[cite: 2]. They let your flows communicate natively with third-party systems, industrial protocols, and external databases[cite: 2].

## Connection scenarios

Where a connector executes depends on whether the platform can reach the target system over the network[cite: 2].

### Direct connection

If the platform can reach the target system directly, use the connector in your application backend[cite: 1, 2]. The platform manages the connection and execution for you[cite: 2]. This applies to:

* The Heisenware cloud reaching systems on the public internet, such as a cloud API, a web service, or a public MQTT broker[cite: 1, 2].
* An [on-premise installation](/tutorials/on-premise-installation.md) reaching systems within the same network[cite: 2].

### Local connection (via Agent)

If the target system sits in a network segment the platform cannot reach (such as a PLC in an isolated machine network with no inbound access), use an Agent, available as a [Native Agent](/app-builder/build-backend/agents/native-agent.md) (binary) or [Docker Agent](/app-builder/build-backend/agents/docker-agent.md) (container)[cite: 1, 2].

{% stepper %}
{% step %}

### Build

Compile a Native Agent directly inside the [App Builder](/app-builder/overview.md)[cite: 1, 2]. You decide which connectors to include in the package[cite: 1, 2].
{% endstep %}

{% step %}

### Deploy

Install the binary on a target system within the local network[cite: 2].
{% endstep %}

{% step %}

### Use

Once the Agent is online, it automatically appears in the [Function Explorer](/app-builder/build-backend/functions/function-explorer.md)[cite: 1, 2]. Inside the Agent representation you find the connectors you selected during the build[cite: 2]. Functions from this Agent-specific category execute directly at the edge, next to your local devices[cite: 2].
{% endstep %}
{% endstepper %}

{% hint style="info" %}
For a deep dive into the build process and deployment options, see the [Agents](/app-builder/build-backend/agents.md) article[cite: 2].
{% endhint %}

## Instance creation

Most connectors, regardless of where they execute, require you to create an instance using the `create` function before you can interact with the target system[cite: 1, 2]. An instance preserves configuration schemas, tracks authentication credentials, and manages the lifecycle of an active connection channel[cite: 2]. 

Certain connectors provide purely static utilities (such as [File I/O](/app-builder/build-backend/functions/connectors/file-i-o.md) or the [operating system (OS)](/app-builder/build-backend/functions/connectors/operating-system-os.md)) and execute calls immediately without requiring an instance configuration[cite: 1, 2].

## Available connectors

The following connectors are available, most of them in both connection scenarios[cite: 2]. Each link leads to a detailed guide on configuring and using that integration[cite: 2].

| Connector | Description | Type |
| :--- | :--- | :--- |
| [Allen-Bradley](/app-builder/build-backend/functions/connectors/allen-bradley.md) | Connects directly to Allen-Bradley PLCs for machine data acquisition and control[cite: 2]. | [Instance creation required](#instance-creation) |
| [Email](/app-builder/build-backend/functions/connectors/email.md) | Sends emails via SMTP[cite: 2]. | [Instance creation required](#instance-creation) |
| [File I/O](/app-builder/build-backend/functions/connectors/file-i-o.md) | Reads from and writes to files on a connected file system[cite: 2]. | Static functions only |
| [GraphQL](/app-builder/build-backend/functions/connectors/graphql.md) | Interacts with any GraphQL API for flexible data queries[cite: 2]. | Static functions only |
| [GPIO counter](/app-builder/build-backend/functions/connectors/gpio-counter.md) | Counts digital pulses on Raspberry Pi GPIO pins, with automatic run/stop detection[cite: 2]. | [Instance creation required](#instance-creation) |
| [Heidenhain DNC](/app-builder/build-backend/functions/connectors/heidenhain-dnc.md) | Connects to Heidenhain DNC systems and requires a local connection scenario[cite: 2]. | [Instance creation required](#instance-creation) |
| [Heidenhain OPC UA](/app-builder/build-backend/functions/connectors/heidenhain-opc-ua.md) | Connects to Heidenhain controllers using the OPC UA protocol[cite: 2]. | [Instance creation required](#instance-creation) |
| [HTTP / REST](/app-builder/build-backend/functions/connectors/http-rest.md) | Makes requests to standard web APIs and HTTP endpoints[cite: 2]. | Mixed (Static and instance options) |
| [Hydra MIP](/app-builder/build-backend/functions/connectors/hydra-mip.md) | Integrates natively with the Manufacturing Integration Platform (MIP)[cite: 2]. | [Instance creation required](#instance-creation) |
| [Kuando Busylight](/app-builder/build-backend/functions/connectors/kuando-busylight.md) | Controls Kuando Busylight status indicators[cite: 2]. | [Instance creation required](#instance-creation) |
| [Label printer](/app-builder/build-backend/functions/connectors/label-printer.md) | Sends print commands to ZPL-compatible label printers[cite: 2]. | [Instance creation required](#instance-creation) |
| [Modbus](/app-builder/build-backend/functions/connectors/modbus.md) | Communicates with industrial devices using the Modbus protocol[cite: 2]. | [Instance creation required](#instance-creation) |
| [MQTT client](/app-builder/build-backend/functions/connectors/mqtt-client.md) | Connects to an MQTT broker to publish and subscribe to topics[cite: 2]. | [Instance creation required](#instance-creation) |
| [OPC UA client](/app-builder/build-backend/functions/connectors/opc-ua-client.md) | Connects to an OPC UA server for industrial automation data exchange[cite: 2]. | [Instance creation required](#instance-creation) |
| [OPC UA server](/app-builder/build-backend/functions/connectors/opc-ua-server.md) | Deploys an OPC UA server to expose data from your application[cite: 2]. | [Instance creation required](#instance-creation) |
| [Operating system (OS)](/app-builder/build-backend/functions/connectors/operating-system-os.md) | Accesses stats and info from the host operating system[cite: 2]. | Static functions only |
| [Raspberry Pi GPIO](/app-builder/build-backend/functions/connectors/raspberry-pi-gpio.md) | Reads and controls GPIO pins on a Raspberry Pi 5[cite: 2]. | Static functions only |
| [Relational database](/app-builder/build-backend/functions/storage/relational-database.md) | Connects to external SQL databases[cite: 2]. | [Instance creation required](#instance-creation) |
| [RS-232/485](/app-builder/build-backend/functions/connectors/rs-232-485.md) | Communicates with devices over a serial port[cite: 2]. | [Instance creation required](#instance-creation) |
| [SAP Digital Manufacturing](/app-builder/build-backend/functions/connectors/sap-digital-manufacturing.md) | Integrates natively with SAP Digital Manufacturing[cite: 2]. | [Instance creation required](#instance-creation) |
| [Siemens S7](/app-builder/build-backend/functions/connectors/siemens-s7.md) | Connects directly to Siemens S7 PLCs for data acquisition and control[cite: 2]. | [Instance creation required](#instance-creation) |
| [Timeseries database](/app-builder/build-backend/functions/storage/timeseries-database.md) | Connects to external InfluxDB databases[cite: 2]. | [Instance creation required](#instance-creation) |
| [Zebra RFID IoT](/app-builder/build-backend/functions/connectors/zebra-rfid-iot.md) | Interacts with Zebra RFID readers and devices[cite: 2]. | [Instance creation required](#instance-creation) |
