# Heidenhain OPC UA

The Heidenhain OPC UA connector interacts with Heidenhain CNC machine controls via OPC UA. It covers the entire workflow, from the initial secure certificate exchange to reading machine data and managing files on the control's `TNC:` file system.

This connector wraps the generic [OPC UA Client](opc-ua-client.md) and pre-configures it for Heidenhain requirements, utilizing a `SignAndEncrypt` connection with `Basic256Sha256` and certificate-based user authentication.

This connector requires [instance creation](./#instance-creation) before you can interact with a machine.

See the [Connect Heidenhain CNC with OPC UA Support tutorial](../../../../tutorials/integration-guides/connect-heidenhain-cnc-with-opc-ua-support.md) for step-by-step instructions.

## One-time secure setup

Heidenhain machines require a certificate exchange before the first connection. The connector automates this process in three steps:

{% stepper %}
{% step %}
### Prepare

Trigger `prepareOpcUaAssistant`. This creates the local client certificates and transfers them to the machine via SSH.
{% endstep %}

{% step %}
### Run the OPC UA Assistant

Run the OPC UA Assistant on the machine's control panel. Import the client certificates from `tnc://heisenware/import` and export the server certificates to `tnc://heisenware/export`.
{% endstep %}

{% step %}
### Finalize

Trigger `finalizeOpcUaAssistant`. This retrieves the server certificates from the machine via SSH and installs them into the local trust store. The client is now ready to connect.
{% endstep %}
{% endstepper %}

## Setup and connection

### `showDefaultMappings`

Returns the default internal mappings of common Heidenhain data points to their OPC UA `nodeId` values or browse paths. This helps identify which nodes high-level functions like `getOperatingMode` access.

#### Parameters

None.

#### Output

Returns a JSON object mapping human-readable names to OPC UA addresses:

```json
{
  "operatingMode": "/0:Objects/1:HEIDENHAIN NC/1:Machine/2:Channels/1:0/2:OperatingMode",
  "feedOverride": "/0:Objects/1:HEIDENHAIN NC/1:Machine/2:Channels/1:0/2:FeedOverride",
  "manufacturer": "ns=1;i=52004"
}
```

### `create`

Creates a connection instance for a specific Heidenhain machine. Use the machine's SSH credentials for the certificate exchange.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>machineIpAddress</code></td><td>The IP address or hostname of the Heidenhain machine.</td><td>string</td></tr><tr><td></td><td><code>machineUser</code></td><td>The SSH username for the machine. Default <code>user</code>.</td><td>string</td></tr><tr><td></td><td><code>machinePassword</code></td><td>The SSH password for the machine. Default <code>user</code>.</td><td>string</td></tr><tr><td></td><td><code>mappings</code></td><td>Optional overrides for the default OPC UA mappings.</td><td>object</td></tr></tbody></table>

{% hint style="info" %}
Right-click the `options` input and mark it as a secret to mask the password.
{% endhint %}

#### Example

```yaml
# options
machineIpAddress: 192.168.1.50
machineUser: heidenhain_user
machinePassword: my_secret_password
```
