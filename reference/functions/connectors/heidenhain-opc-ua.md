# Heidenhain OPC UA

The Heidenhain OPC UA connector interacts with Heidenhain CNC machine controls via OPC UA. It covers the entire workflow, from the initial secure certificate exchange to reading machine data and managing files on the control's `TNC:` file system.

This connector wraps the generic [OPC UA Client](opc-ua-client.md) and pre-configures it for Heidenhain requirements, utilizing a `SignAndEncrypt` connection with `Basic256Sha256` and certificate-based user authentication.

This connector requires [instance creation](README.md#instance-creation) before you can interact with a machine.

See the [Connect Heidenhain CNC with OPC UA Support tutorial](../../../labs/connect-a-heidenhain-cnc.md) for step-by-step instructions.

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
Right-click the `options` input and choose **Secret Input** to mask the password.
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

Establishes a secure OPC UA connection to the Heidenhain machine using the previously exchanged certificates. The endpoint is the control's own: `opc.tcp://<machine>:4840/HEIDENHAIN/NC`.

#### Parameters

None.

#### Output

Returns `true` once connected, or `reconnect ongoing` when the client is already reconnecting by itself. A lost connection is re-established without your doing anything.

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

These functions read common Heidenhain data points. None of them take parameters. `showMappings` tells you which OPC UA nodes they read, and `mappings` in `create` replaces an address for a control that keeps a value elsewhere.

A function that reads several nodes reads them one after the other, a few milliseconds apart, so that the control is not flooded. A node a control does not offer leaves its field in the answer empty instead of failing the whole call: an object with an empty `ncKernel` means that control has no such node, not that the read went wrong.

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

Reads the current position of the tool tip.

#### Output

Returns the position as the control reports it, on most controls an array of coordinates `[X, Y, Z]`.

### `getToolInfo`

Provides information about the currently active tool.

#### Output

Returns an object containing the tool's `databaseId`, `identifier`, and `name`.

### `getProgramInfo`

Provides information about the currently running NC program.

#### Output

Returns an object with `currentCall`, `executionStack`, `name`, `fileNodeId`, `currentState` and `lastTransition`.

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

Returns an object with one entry per active error, keyed by the error's browse name on the control. Each entry holds `action`, `cause`, `channel`, `class`, `group`, `internals`, `location`, `number`, `numberAsText` and `text`. An empty object means no error is active.

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

When the Heidenhain functions above are not enough, these reach any address of the control's OPC UA server. They pass through to the underlying [OPC UA client](opc-ua-client.md), so its page holds the longer examples. An address is always a `nodeId` (`ns=1;i=52004`) or a browse path (`/0:Objects/1:HEIDENHAIN NC/...`), as `showMappings` prints them.

{% hint style="info" %}
This connector does not subscribe: it has no `monitorNode`, `monitorVariable` or `listenToEvents`. Read on a [trigger](../../../concepts/triggers-and-wires.md) at the interval you need, and read many addresses in one call instead of one executor per value.
{% endhint %}

### `readVariable`

Reads the value of a variable, or of a list of them.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td>A <code>nodeId</code> or browse path, or a list of them.</td><td>string or array</td></tr></tbody></table>

#### Output

Returns the value. For a list, one `{ address, nodeId, value }` per address, in the order given. The list goes to the control in as few requests as it allows. An address the control answers with a bad status code fails the whole read, naming that address; use `readNode` to get a status per address instead.

### `writeVariable`

Sets the value of a variable.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td>The <code>nodeId</code> or browse path of the variable to set.</td><td>string</td></tr><tr><td><code>value</code></td><td>The value to write. The connector takes the data type from the node.</td><td>any</td></tr></tbody></table>

#### Output

Returns nothing. Throws an error when the control refuses the write.

### `readNode`

Reads a whole node, or a list of them: the value with its status code and timestamps.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td>A <code>nodeId</code> or browse path, or a list of them.</td><td>string or array</td></tr></tbody></table>

#### Output

Returns the node object. For a list, one `{ address, nodeId, value }` per address, where `value` is the node object. A node that cannot be read carries its status code and fails nothing else.

### `browseObjects`

Browses the objects below an address, one level deep. Use it to find the nodes of a control whose paths differ from the defaults.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>path</code></td><td>The browse path to look below, such as <code>/0:Objects/1:HEIDENHAIN NC</code>. Omitted, browsing starts at the server's root.</td><td>string</td></tr></tbody></table>

#### Output

Returns one entry per child: `{ browseName, nodeId, nodeClass }`.

### `callMethod`

Calls a method the control's server offers. The connector reads the method's declared argument types from the server and converts the values you pass.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>methodAddress</code></td><td>The <code>nodeId</code> or browse path of the method.</td><td>string</td></tr><tr><td><code>inputValues</code></td><td>The input arguments, in the order the method declares them.</td><td>array</td></tr></tbody></table>

#### Output

Returns the method's output arguments.

### `readFile`

Reads any file the control's OPC UA server offers, addressed directly. For a file under `TNC:` use `readTncFile`, which builds the address for you.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td></td><td>The <code>nodeId</code> or browse path of the file.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>encoding</code></td><td>The encoding of the returned content, such as <code>ascii</code> or <code>base64</code>. Default <code>utf8</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns the file content as a string in the requested encoding. The default is `utf8` here, where the generic [OPC UA client](opc-ua-client.md#readfile) defaults to base64, because the files of a control are text.

### `writeFile`

Creates a file in a folder of the control's server and uploads content into it.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>folderAddress</code></td><td>The <code>nodeId</code> or browse path of the folder.</td><td>string</td></tr><tr><td><code>newFileName</code></td><td>The name of the file to create.</td><td>string</td></tr><tr><td><code>pathOrBase64</code></td><td>The content: a file path the agent can read, or a base64 encoded string.</td><td>string</td></tr></tbody></table>

#### Output

Returns the `nodeId` of the written file.

### `deleteFile`

Deletes a file from a folder of the control's server.

{% hint style="danger" %}
#### Irreversible action

Deleting a file permanently removes it from the machine's control. This action cannot be undone.
{% endhint %}

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>folderAddress</code></td><td>The <code>nodeId</code> or browse path of the folder.</td><td>string</td></tr><tr><td><code>fileName</code></td><td>The name of the file to delete.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` when the file is deleted, `false` when it is not.
