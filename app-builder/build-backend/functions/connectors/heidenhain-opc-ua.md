# Heidenhain OPC UA

The Heidenhain OPC UA connector interacts with Heidenhain CNC machine controls via OPC UA. It covers the whole workflow, from the initial secure certificate exchange to reading machine data and managing files on the control's `TNC:` file system.

The class wraps the generic [OPC UA client](opc-ua-client.md) and pre-configures it for Heidenhain's requirements (a `SignAndEncrypt` connection with `Basic256Sha256` and certificate-based user authentication). Create one instance per machine.

See the [step-by-step guide](../../../../tutorials/integration-guides/connect-heidenhain-cnc-with-opc-ua-support.md) for connecting your Heidenhain CNC machine to Heisenware.

## One-time secure setup

Heidenhain machines require a certificate exchange before the first connection. The connector automates it in three steps:

{% stepper %}
{% step %}
### Prepare

Trigger `prepareOpcUaAssistant`. It creates the local client certificates and transfers them to the machine via SSH.
{% endstep %}

{% step %}
### Run the OPC UA Assistant

On the machine's control panel, run the OPC UA Assistant. Import the client certificates from `tnc://heisenware/import` and export the server certificates to `tnc://heisenware/export`.
{% endstep %}

{% step %}
### Finalize

Trigger `finalizeOpcUaAssistant`. It retrieves the server certificates from the machine via SSH and installs them into the local trust store. The client is now ready to `connect`.
{% endstep %}
{% endstepper %}

## Setup and connection

### `showDefaultMappings`

A static function that returns the default internal mappings of common Heidenhain data points to their OPC UA nodeIds or browse paths. Useful for understanding which nodes the high-level functions like `getOperatingMode` access.

#### Parameters

None.

#### Output

A JSON object mapping human-readable names to OPC UA addresses:

```json
{
  "operatingMode": "/0:Objects/1:HEIDENHAIN NC/1:Machine/2:Channels/1:0/2:OperatingMode",
  "feedOverride": "/0:Objects/1:HEIDENHAIN NC/1:Machine/2:Channels/1:0/2:FeedOverride",
  "manufacturer": "ns=1;i=52004"
}
```

### `create`

Creates a connection instance for one specific Heidenhain machine. The credentials are the machine's SSH login, used for the certificate exchange.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>machineIpAddress</code></td><td>The IP address or hostname of the Heidenhain machine. Required.</td><td>string</td></tr><tr><td></td><td><code>machineUser</code></td><td>The SSH username for the machine. Default <code>user</code>.</td><td>string</td></tr><tr><td></td><td><code>machinePassword</code></td><td>The SSH password for the machine. Default <code>user</code>.</td><td>string</td></tr><tr><td></td><td><code>mappings</code></td><td>Optional overrides for the default OPC UA mappings.</td><td>object</td></tr></tbody></table>

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

### `prepareOpcUaAssistant`

The first step of the one-time setup. Creates the local client certificates and transfers them to the machine via SSH (into `tnc://heisenware/import`). Afterwards, complete the setup with the OPC UA Assistant on the machine's control panel.

#### Parameters

None.

#### Output

A string with instructions and the folder paths to use in the Heidenhain OPC UA Assistant.

### `finalizeOpcUaAssistant`

The second and final step of the one-time setup. Call it after the OPC UA Assistant exported the server's certificates. It retrieves them from the machine via SSH and installs them into the local trust store, completing the secure channel setup.

#### Parameters

None.

#### Output

A confirmation string that the certificate exchange is complete and the client is ready to connect.

### `connect`

Establishes the secure OPC UA connection to the machine using the exchanged certificates. The endpoint (`opc.tcp://<machine>:4840/HEIDENHAIN/NC`) and user identity are derived automatically from the instance configuration.

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

Checks whether the client has a valid and active connection to the machine.

#### Parameters

None.

#### Output

Returns `true` if connected, otherwise `false`.

### `showMappings`

Returns the mappings in use for this instance, including any custom overrides provided in `create`.

#### Parameters

None.

#### Output

A JSON object in the same format as `showDefaultMappings`.

### `getMachineIpAddress`

Returns the IP address or hostname the instance was created with.

#### Parameters

None.

#### Output

The machine address as a string.

### `delete`

Removes the instance and its connection.

{% hint style="danger" %}
Deleting an instance removes its configuration. To interact with the machine again, trigger `create` and `connect` anew.
{% endhint %}

## Machine data

These functions read common Heidenhain data points directly. None of them take parameters.

### `getOperatingMode`

Receives the current NC operating mode.

#### Output

A string representing the mode (e.g. `Manual`, `Automatic`, `Handwheel`).

### `getFeedOverride`

Receives the current feed override value.

#### Output

A number with the feed override percentage.

### `getSpeedOverride`

Receives the current spindle speed override value.

#### Output

A number with the speed override percentage.

### `getRapidOverride`

Receives the current rapid speed override value.

#### Output

A number with the rapid override percentage.

### `getCutterLocation`

Receives the current X, Y, and Z coordinates of the tool tip.

#### Output

An array of numbers `[X, Y, Z]`.

### `getToolInfo`

Provides information about the currently active tool.

#### Output

An object containing the tool's `databaseId`, `identifier`, and `name`.

### `getProgramInfo`

Provides information about the currently running NC program.

#### Output

An object containing `currentCall`, `executionStack`, `name`, `fileNodeId`, `currentState`, and `lastTransition`.

### `getControlInfo`

Provides general information about the machine's control unit.

#### Output

An object containing `manufacturer`, `model`, `ncVersion`, and `ncKernel`.

### `getOperatingTimeInfo`

Provides machine and control operating times.

#### Output

An object containing `controlUpTime`, `machineUpTime`, and `programExecutionTime`.

### `getStateInfo`

Provides the machine's current state.

#### Output

An object containing the `currentState` and `lastTransition` of the machine's state machine.

### `getActiveErrors`

Retrieves a detailed list of all currently active errors on the machine.

#### Output

An object where each key is an error ID and each value contains the error details: `action`, `cause`, `channel`, `class`, `group`, `internals`, `location`, `number`, `numberAsText`, and `text`.

## TNC file system

These functions interact with the machine's `TNC:` file system.

### `browseTncDirectory`

Browses the root of the `TNC:` file system non-recursively.

#### Parameters

None.

#### Output

An array of objects, each with the `name` and `nodeId` of a file or folder.

### `readTncFile`

Reads a file from the `TNC:` directory.

#### Parameters

<table><thead><tr><th width="120">Input</th><th width="130">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>filePath</code></td><td></td><td>Path to the file using forward slashes (e.g. <code>programs/main.h</code>).</td><td>string</td></tr><tr><td><code>options</code></td><td><code>encoding</code></td><td>The encoding of the returned content, e.g. <code>ascii</code>, <code>base64</code>. Default <code>utf8</code>.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# filePath
programs/main.h
```

#### Output

The file content as a string in the requested encoding.

### `writeTncFile`

Writes a new file to the `TNC:` directory.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>newFileName</code></td><td>The name of the file to create, including its path (e.g. <code>setups/tool_list.txt</code>).</td><td>string</td></tr><tr><td><code>content</code></td><td>The data to write, either as a local file path or a base64 encoded string.</td><td>string</td></tr></tbody></table>

#### Output

The `nodeId` of the newly created file.

### `deleteTncFile`

Deletes a file from the `TNC:` directory.

{% hint style="danger" %}
This permanently removes the file on the machine. The action cannot be undone.
{% endhint %}

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>fileName</code></td><td>The name of the file to delete, including its path.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` on success.

## Generic OPC UA functions

These functions pass through to the underlying [OPC UA client](opc-ua-client.md) for generic operations when the specialized Heidenhain functions are not sufficient. Parameters and output are identical to the OPC UA client documentation: `browseObjects`, `callMethod`, `readNode`, `readVariable`, `writeVariable`, `readFile`, `writeFile`, and `deleteFile`.

One difference: `readFile` here returns `utf8` encoded content by default (the generic client defaults to `base64`). Set `options.encoding` to change it.
