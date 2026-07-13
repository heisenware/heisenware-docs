# Connectors

Connectors are [functions](../) that handle the translation between Heisenware and the outside world. They let your flows communicate natively with third-party systems, industrial protocols, and external databases.

## Connection scenarios

Where a connector executes depends on whether the platform can reach the target system over the network.

### Direct connection

If the platform can reach the target system directly, use the connector in your application backend. The platform manages the connection and execution for you. This applies to:

* the Heisenware cloud reaching systems on the public internet (e.g. a cloud API, a web service, or a public MQTT broker)
* an [on-premise installation](../../../../tutorials/on-premise-installation.md) reaching systems within the same network

### Local connection (via Agent)

If the target system sits in a network segment the platform cannot reach (such as a PLC in an isolated machine network with no inbound access), use an Agent, available as a [Native Agent](../../agents/native-agent.md) (binary) or [Docker Agent](../../agents/docker-agent.md) (container).

{% stepper %}
{% step %}
### Build

Compile a Native Agent directly inside the [App Builder](../../../overview.md). You decide which connectors and credentials to include in the package.
{% endstep %}

{% step %}
### Deploy

Install the binary on a target system within the local network.
{% endstep %}

{% step %}
### Use

Once the Agent is online, it automatically appears in the [Function Explorer](../function-explorer.md). Inside the Agent representation you find the connector classes you selected during the build. Functions from this Agent-specific category execute directly at the edge, next to your local devices.
{% endstep %}
{% endstepper %}

{% hint style="info" %}
For a deep dive into the build process and deployment options, see the [Agent](../../agents/) article.
{% endhint %}

## Available connectors

The following connectors are available, most of them in both connection scenarios. Each link leads to a detailed guide on configuring and using that integration.

<table><thead><tr><th width="220">Connector</th><th>Description</th></tr></thead><tbody><tr><td><a href="allen-bradley.md">Allen-Bradley</a></td><td>Connects directly to Allen-Bradley PLCs for machine data acquisition and control.</td></tr><tr><td><a href="email.md">Email</a></td><td>Sends emails via SMTP.</td></tr><tr><td><a href="file-i-o.md">File I/O</a></td><td>Reads from and writes to files on a connected file system.</td></tr><tr><td><a href="graphql.md">GraphQL</a></td><td>Interacts with any GraphQL API for flexible data queries.</td></tr><tr><td><a href="gpio-counter.md">GPIO counter</a></td><td>Counts digital pulses on Raspberry Pi GPIO pins, e.g. from proximity sensors or light barriers, with automatic run/stop detection.</td></tr><tr><td><a href="heidenhain-dnc.md">Heidenhain DNC</a></td><td>Connects to Heidenhain DNC systems. Always requires a <a href="./#local-connection-via-agent">local connection scenario</a>.</td></tr><tr><td><a href="heidenhain-opc-ua.md">Heidenhain OPC UA</a></td><td>Connects to Heidenhain controllers using the OPC UA protocol.</td></tr><tr><td><a href="http-rest.md">HTTP REST</a></td><td>Makes requests to standard web APIs and HTTP endpoints.</td></tr><tr><td><a href="hydra-mip.md">Hydra MIP</a></td><td>Integrates natively with the Manufacturing Integration Platform (MIP) and the corresponding MES Hydra from MPDV.</td></tr><tr><td><a href="kuando-busylight.md">Kuando Busylight</a></td><td>Controls Kuando Busylight status indicators.</td></tr><tr><td><a href="label-printer.md">Label printer</a></td><td>Sends print commands to ZPL-compatible label printers.</td></tr><tr><td><a href="modbus.md">Modbus</a></td><td>Communicates with industrial devices using the Modbus protocol.</td></tr><tr><td><a href="mqtt-client.md">MQTT client</a></td><td>Connects to an MQTT broker to publish and subscribe to topics.</td></tr><tr><td><a href="opc-ua-client.md">OPC UA client</a></td><td>Connects to an OPC UA server for industrial automation data exchange.</td></tr><tr><td><a href="opc-ua-server.md">OPC UA server</a></td><td>Deploys an OPC UA server to expose data from your application.</td></tr><tr><td><a href="operating-system-os.md">Operating system (OS)</a></td><td>Accesses stats and info from the host operating system.</td></tr><tr><td><a href="/broken/pages/GoyYK9mvJLsWmbTmzpyp">Raspberry Pi GPIO</a></td><td>Reads and controls GPIO pins on a Raspberry Pi 5.</td></tr><tr><td><a href="../storage/relational-database.md">Relational database</a></td><td>Connects to external SQL databases. Only needed for your own servers, since Heisenware includes a production-ready internal PostgreSQL database by default.</td></tr><tr><td><a href="rs-232-485.md">RS-232/485</a></td><td>Communicates with devices over a serial port.</td></tr><tr><td><a href="sap-digital-manufacturing.md">SAP Digital Manufacturing</a></td><td>Integrates natively with SAP Digital Manufacturing.</td></tr><tr><td><a href="siemens-s7.md">Siemens S7</a></td><td>Connects directly to Siemens S7 PLCs for data acquisition and control.</td></tr><tr><td><a href="../storage/timeseries-database.md">Timeseries database</a></td><td>Connects to external InfluxDB databases. Only needed for your own servers, since Heisenware includes a production-ready internal InfluxDB database by default.</td></tr><tr><td><a href="zebra-rfid-iot.md">Zebra RFID IoT</a></td><td>Interacts with Zebra RFID readers and devices.</td></tr></tbody></table>
