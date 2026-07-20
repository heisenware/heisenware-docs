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

#### Output

Returns the name of the created instance.

### `prepareOpcUaAssistant`

The first step of the one-time secure setup. Creates the necessary local client certificates and transfers them to the Heidenhain machine via SSH. Afterwards, complete the exchange using the OPC UA Assistant on the machine's control panel.

#### Parameters

None.

#### Output

Returns a string containing instructions and the folder paths to use in the Heidenhain OPC UA Assistant on the machine control.

### `finalizeOpcUaAssistant`

The final step of the one-time secure setup. After the OPC UA Assistant on the machine has exported the server certificates, this function retrieves them via SSH and installs them into the local trust store.

#### Parameters

None.

#### Output

Returns a confirmation string indicating that the certificate exchange is complete and the client is ready to connect.

### `connect`

Establishes a secure OPC UA connection to the Heidenhain machine using the previously exchanged certificates.

#### Parameters

None.

#### Output

Returns `true` on a successful connection.

### `disconnect`

Closes the OPC UA session and disconnects from the machine.

#### Parameters

None.

#### Output

Returns `true` on a successful disconnection.

### `isConnected`

Checks whether the client has an active connection to the machine.

#### Parameters

None.

#### Output

Returns `true` if connected, or `false` if disconnected.

### `getMachineIpAddress`

Returns the IP address of the machine the instance was configured with.

#### Parameters

None.

#### Output

Returns the configured machine IP address string.

### `showMappings`

Returns the OPC UA mappings the instance currently uses, including any overrides provided at creation. Compare with the static `showDefaultMappings`, which shows the built-in defaults.

#### Parameters

None.

#### Output

Returns a JSON object mapping human-readable names to OPC UA addresses.

### `delete`

Removes the instance and closes the connection.

{% hint style="danger" %}
#### Irreversible action

Deleting an instance removes its configuration, but not the exchanged certificates. To communicate with the machine again, you must trigger `create` and `connect` anew.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` upon removal.

## Machine data

These functions read common Heidenhain data points. None of them take parameters. `showDefaultMappings` reveals which OPC UA nodes they access.

### `getOperatingMode`

Reads the current NC operating mode.

#### Output

Returns a string representing the mode (such as `Manual`, `Automatic`, or `Handwheel`).

### `getFeedOverride`

Reads the current feed override value.

#### Output

Returns a number representing the feed override percentage.

### `getSpeedOverride`

Reads the current spindle speed override value.

#### Output

Returns a number representing the speed override percentage.

### `getRapidOverride`

Reads the current rapid speed override value.

#### Output

Returns a number representing the rapid override percentage.

### `getCutterLocation`

Reads the current X, Y, and Z coordinates of the tool tip.

#### Output

Returns an array of numbers `[X, Y, Z]`.

### `getToolInfo`

Provides information about the currently active tool.

#### Output

Returns an object containing the tool's `databaseId`, `identifier`, and `name`.

### `getProgramInfo`

Provides information about the currently running NC program.

#### Output

Returns an object containing details such as `currentCall`, `executionStack`, `name`, `fileNodeId`, and the program `currentState`.

### `getControlInfo`

Provides general information about the machine's control unit.

#### Output

Returns an object containing the `manufacturer`, `model`, `ncVersion`, and `ncKernel`.

### `getOperatingTimeInfo`

Provides information about machine and control operating times.

#### Output

Returns an object containing `controlUpTime`, `machineUpTime`, and `programExecutionTime`.

### `getStateInfo`

Provides information about the machine's current state.

#### Output

Returns an object containing the `currentState` and `lastTransition` of the machine's state machine.

### `getActiveErrors`

Retrieves a detailed list of all currently active errors on the machine.

#### Output

Returns an object where each key is an error ID and each value contains detailed information about that error (such as `action`, `cause`, and `text`).

## TNC file system

These functions interact with the machine's `TNC:` file system.

### `browseTncDirectory`

Browses the root of the machine's `TNC:` file system non-recursively.

#### Parameters

None.

#### Output

Returns an array of objects, each containing a `name` and `nodeId` for a file or folder.

### `readTncFile`

Reads a file from the `TNC:` directory.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>filePath</code></td><td></td><td>The path to the file using forward slashes (such as <code>programs/main.h</code>).</td><td>string</td></tr><tr><td><code>options</code></td><td><code>encoding</code></td><td>The encoding of the returned content (such as <code>ascii</code> or <code>base64</code>). Default <code>utf8</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns the file content as a string in the requested encoding, utf8 by default. Note that this differs from the generic [OPC UA client](opc-ua-client.md#readfile), whose `readFile` defaults to base64, because NC programs are text files.

#### Example

```yaml
# filePath
programs/main.h
```

### `writeTncFile`

Writes a new file to the `TNC:` directory.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>newFileName</code></td><td>The name of the file to create, including its path (such as <code>setups/tool_list.txt</code>).</td><td>string</td></tr><tr><td><code>content</code></td><td>The data to write, either as a local file path or a base64 string.</td><td>string</td></tr></tbody></table>

#### Output

Returns the `nodeId` of the newly created file.

### `deleteTncFile`

Deletes a file from the `TNC:` directory.

{% hint style="danger" %}
#### Irreversible action

Deleting a file permanently removes it from the machine's control. This action cannot be undone.
{% endhint %}

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>fileName</code></td><td>The name of the file to delete, including its path.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` when the file is successfully deleted, or `false` if the deletion fails.

## Generic OPC UA functions

These functions pass directly through to the underlying [OPC UA client](opc-ua-client.md) for generic OPC UA operations when the specialized Heidenhain functions are not sufficient. Parameters and outputs are identical to the OPC UA client documentation: `browseObjects`, `callMethod`, `deleteFile`, `readFile`, `readNode`, `readVariable`, `writeFile`, and `writeVariable`. One difference: `readFile` defaults to `utf8` encoding here instead of base64.
