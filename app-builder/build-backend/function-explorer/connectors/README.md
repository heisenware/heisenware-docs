# Connectors

Connectors are an integral part of your application logic that handle the translation between Heisenware and the outside world. They allow your flows to communicate natively with third-party systems, industrial protocols, and external databases.

## Connection scenarios

Where a connector executes depends on whether the target system is accessible over the public internet.

### Direct cloud connection

If the system is accessible from the public internet (e.g., a cloud API, a web service, or a public MQTT broker), you can use the connector directly in your application backend. The Heisenware platform manages the connection and execution for you in the cloud.

### Local connection (via Edge Agent)

If the target system is on a private, isolated network with no inbound internet access (such as a PLC on a factory shop floor), it cannot be reached directly from the cloud.

In this scenario, you must use an Edge Agent (available as a native binary or Docker container).

* **Customized Native Agent**: You can compile a Native Agent directly inside the App Builder. You decide exactly which connectors and credentials you want to include in the package.
* **Deployment**: Once you have built your custom binary, you install it on a target system within the local network.
* **Visibility in library**: Once the agent is online, it automatically appears in your [library](../). Inside the visual Agent representation, you will find the specific connector classes you selected during the build process.
* **Edge execution**: Using functions from this agent-specific category ensures that the logic is executed directly at the edge, allowing you to integrate local devices seamlessly.

{% hint style="info" %}
For a deep dive into the build process and deployment options, please refer to the [Edge Agent](../agents/) article.
{% endhint %}

## Available Connectors

The following connectors are available. Most of them in both connection scenarios. Each link leads to a detailed guide on configuring and using that specific integration.

<table><thead><tr><th width="213.8148193359375">Connector</th><th>Description</th></tr></thead><tbody><tr><td><a href="allen-bradley.md">Allen-Bradley</a></td><td>Connects directly to Allen-Bradley PLCs for machine data acquisition and control.</td></tr><tr><td><a href="email.md">Email</a></td><td>Sends and receives emails via SMTP and IMAP.</td></tr><tr><td><a href="file-i-o.md">File I/O</a></td><td>Reads from and writes to files on a connected file system.</td></tr><tr><td><a href="graphql.md">GraphQL</a></td><td>Interacts with any GraphQL API for flexible data queries.</td></tr><tr><td><a data-mention href="heidenhain-dnc.md">heidenhain-dnc.md</a></td><td>Connects to Heidenhain DNC systems. Always requires a <a href="./#local-connection-via-edge-agent">local connection scenario</a>.</td></tr><tr><td><a data-mention href="heidenhain-opc-ua.md">heidenhain-opc-ua.md</a></td><td>Connects to Heidenhain controllers using the OPC UA protocol.</td></tr><tr><td><a data-mention href="http-rest.md">http-rest.md</a></td><td>Makes requests to standard web APIs and HTTP endpoints.</td></tr><tr><td><a data-mention href="hydra-mip.md">hydra-mip.md</a></td><td>Integrates natively with the Manufacturing Integration Platform (MIP) and the corresponding MES Hydra from MPDV.</td></tr><tr><td><a data-mention href="kuando-busylight.md">kuando-busylight.md</a></td><td>Controls Kuando Busylight status indicators.</td></tr><tr><td><a data-mention href="label-printer.md">label-printer.md</a></td><td>Sends print commands to ZPL-compatible label printers.</td></tr><tr><td><a href="modbus.md">Modbus</a></td><td>Communicates with industrial devices using the Modbus protocol.</td></tr><tr><td><a data-mention href="mqtt-client.md">mqtt-client.md</a></td><td>Connects to an MQTT broker to publish and subscribe to topics.</td></tr><tr><td><a data-mention href="opc-ua-client.md">opc-ua-client.md</a></td><td>Connects to an OPC UA server for industrial automation data exchange.</td></tr><tr><td><a data-mention href="opc-ua-server.md">opc-ua-server.md</a></td><td>Deploys an OPC UA server to expose data from your application.</td></tr><tr><td><a data-mention href="operating-system-os.md">operating-system-os.md</a></td><td>Accesses stats and info from the host operating system.</td></tr><tr><td><a data-mention href="../storage/relational-database.md">relational-database.md</a></td><td>Connects to external SQL databases.</td></tr><tr><td><a data-mention href="rs-232-485.md">rs-232-485.md</a></td><td>Communicates with devices over a serial port.</td></tr><tr><td><a data-mention href="sap-digital-manufacturing.md">sap-digital-manufacturing.md</a></td><td>Integrates natively with SAP Digital Manufacturing.</td></tr><tr><td><a data-mention href="siemens-s7.md">siemens-s7.md</a></td><td>Connects directly to Siemens S7 PLCs for data acquisition and control.</td></tr><tr><td><a data-mention href="../storage/timeseries-database.md">timeseries-database.md</a></td><td>Connects to an external InfluxDB database.</td></tr><tr><td><a data-mention href="zebra-rfid-iot.md">zebra-rfid-iot.md</a></td><td>Interacts with Zebra RFID readers and devices.</td></tr></tbody></table>

{% hint style="success" %}
#### Internal Storage

Heisenware includes production-ready internal [PostgreSQL](../storage/relational-database.md) and internal [InfluxDB](../storage/timeseries-database.md) databases by default. You only need the connectors above if you are linking to your own _external_ database servers.
{% endhint %}
