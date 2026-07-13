# Heidenhain OPC UA

The Heidenhain OPC UA connector interacts with Heidenhain CNC machine controls via OPC UA. It covers the entire workflow, from the initial secure certificate exchange to reading machine data and managing files on the control's `TNC:` file system.

This connector wraps the generic [OPC UA Client](/app-builder/build-backend/functions/connectors/opc-ua-client.md) and pre-configures it for Heidenhain requirements, utilizing a `SignAndEncrypt` connection with `Basic256Sha256` and certificate-based user authentication.

This connector requires [instance creation](/app-builder/build-backend/functions/connectors.md#instance-creation) before you can interact with a machine.

See the [Connect Heidenhain CNC with OPC UA Support tutorial](/tutorials/integration-guides/connect-heidenhain-cnc-with-opc-ua-support.md) for step-by-step instructions.

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

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>options</code></td>
      <td><code>machineIpAddress</code></td>
      <td>The IP address or hostname of the Heidenhain machine.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>machineUser</code></td>
      <td>The SSH username for the machine. Default <code>user</code>.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>machinePassword</code></td>
      <td>The SSH password for the machine. Default <code>user</code>.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>mappings</code></td>
      <td>Optional overrides for the default OPC UA mappings.</td>
      <td>object</td>
    </tr>
  </tbody>
</table>

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

Returns the connection instance. Throws an error if configuration fails.

### `prepareOpcUaAssistant`

Executes the first step of the one-time setup. This function creates the local client certificates and transfers them to the machine via SSH into `tnc://heisenware/import`. Complete the setup using the OPC UA Assistant on the machine's control panel afterwards.

#### Parameters

None.

#### Output

Returns a string containing instructions and the folder paths for the Heidenhain OPC UA Assistant.

### `finalizeOpcUaAssistant`

Executes the final step of the one-time setup. Call this after the OPC UA Assistant exports the server certificates. It retrieves the certificates from the machine via SSH and installs them into the local trust store to complete the secure channel setup.

#### Parameters

None.

#### Output

Returns a confirmation string indicating the certificate exchange is complete.

### `connect`

Establishes a secure OPC UA connection to the machine using the exchanged certificates. The function derives the endpoint (`opc.tcp://<machine>:4840/HEIDENHAIN/NC`) and user identity automatically from the instance configuration.

#### Parameters

None.

#### Output

Returns `true` on a successful connection. Throws an error if the connection fails.

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

### `showMappings`

Returns the mappings currently in use for the instance, including any custom overrides provided during `create`.

#### Parameters

None.

#### Output

Returns a JSON object matching the format of `showDefaultMappings`.

### `getMachineIpAddress`

Retrieves the IP address or hostname configured for the instance.

#### Parameters

None.

#### Output

Returns the machine address as a string.

### `delete`

Removes the instance and its connection.

{% hint style="danger" %}
#### Irreversible action
Deleting an instance removes its configuration. To interact with the machine again, you must trigger `create` and `connect` anew.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` upon removal.

## Machine data

These functions read common Heidenhain data points directly. None of these functions accept parameters.

### `getOperatingMode`

Retrieves the current NC operating mode.

#### Parameters

None.

#### Output

Returns a string representing the mode (such as `Manual`, `Automatic`, or `Handwheel`).

### `getFeedOverride`

Retrieves the current feed override percentage.

#### Parameters

None.

#### Output

Returns a number representing the feed override percentage.

### `getSpeedOverride`

Retrieves the current spindle speed override percentage.

#### Parameters

None.

#### Output

Returns a number representing the speed override percentage.

### `getRapidOverride`

Retrieves the current rapid speed override percentage.

#### Parameters

None.

#### Output

Returns a number representing the rapid override percentage.

### `getCutterLocation`

Retrieves the current X, Y, and Z coordinates of the tool tip.

#### Parameters

None.

#### Output

Returns an array of numbers formatted as `[X, Y, Z]`.

### `getToolInfo`

Retrieves schema information for the currently active tool.

#### Parameters

None.

#### Output

Returns an object containing the tool's `databaseId`, `identifier`, and `name`.

### `getProgramInfo`

Retrieves details regarding the currently running NC program.

#### Parameters

None.

#### Output

Returns an object containing `currentCall`, `executionStack`, `name`, `fileNodeId`, `currentState`, and `lastTransition`.

### `getControlInfo`

Retrieves general identification details from the machine's control unit.

#### Parameters

None.

#### Output

Returns an object containing `manufacturer`, `model`, `ncVersion`, and `ncKernel`.

### `getOperatingTimeInfo`

Retrieves operating metrics for the machine and control unit.

#### Parameters

None.

#### Output

Returns an object containing `controlUpTime`, `machineUpTime`, and `programExecutionTime`.

### `getStateInfo`

Retrieves the current machine state indicators.

#### Parameters

None.

#### Output

Returns an object containing the `currentState` and `lastTransition` fields of the machine's state machine.

### `getActiveErrors`

Retrieves a list of all currently active errors on the machine.

#### Parameters

None.

#### Output

Returns an object where each key represents an error ID and each value contains details such as `action`, `cause`, `channel`, `class`, `group`, `internals`, `location`, `number`, `numberAsText`, and `text`.

## TNC file system

These functions interact with the machine's `TNC:` file system.

### `browseTncDirectory`

Browses the root of the `TNC:` file system non-recursively.

#### Parameters

None.

#### Output

Returns an array of objects containing the `name` and `nodeId` of each file or folder.

### `readTncFile`

Reads a file from the `TNC:` directory.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>filePath</code></td>
      <td></td>
      <td>The path to the target file using forward slashes (such as <code>programs/main.h</code>).</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>encoding</code></td>
      <td>The encoding of the returned content, such as <code>ascii</code> or <code>base64</code>. Default <code>utf8</code>.</td>
      <td>string</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# filePath
programs/main.h
```

#### Output

Returns the file content as a string in the requested encoding. Throws an error if the file cannot be read.

### `writeTncFile`

Writes a new file to the `TNC:` directory.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>newFileName</code></td>
      <td>The name of the file to create, including its path (such as <code>setups/tool_list.txt</code>).</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>content</code></td>
      <td>The data to write, provided either as a local file path or a base64 encoded string.</td>
      <td>string</td>
    </tr>
  </tbody>
</table>

#### Output

Returns the `nodeId` of the newly created file. Throws an error if the write fails.

### `deleteTncFile`

Deletes a file from the `TNC:` directory.

{% hint style="danger" %}
#### Permanent deletion
This permanently removes the file on the machine. You cannot undo this action.
{% endhint %}

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>fileName</code></td>
      <td>The name of the file to delete, including its path.</td>
      <td>string</td>
    </tr>
  </tbody>
</table>

#### Output

Returns `true` on success. Throws an error if deletion fails.

## Generic OPC UA functions

These functions pass through to the underlying [OPC UA Client](/app-builder/build-backend/functions/connectors/opc-ua-client.md) for generic operations when specialized Heidenhain functions are insufficient. Parameters and outputs match the client documentation for `browseObjects`, `callMethod`, `readNode`, `readVariable`, `writeVariable`, `readFile`, `writeFile`, and `deleteFile`.

Unlike the generic client which defaults to `base64`, `readFile` in this connector returns `utf8` encoded content by default. Configure `options.encoding` to alter this behavior.
