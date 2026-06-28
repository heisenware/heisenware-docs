# Heidenhain OPC UA

The `Heidenhain` class provides a specialized, high-level interface for connecting to and interacting with Heidenhain CNC machine controls via OPC UA. It simplifies the entire workflow, from the initial secure certificate exchange to reading machine data and managing files on the control's file system.

This class acts as a wrapper around the more generic `OpcuaClient`, pre-configuring it for Heidenhain's specific requirements and providing easy-to-use functions for common tasks. An instance of this class must be created for each machine you want to control.

Please also see the [step-by-step guide](../../../../tutorials/integration-guides/connect-heidenhain-cnc-with-opc-ua-support.md) of how to connect your Heidenhain based CNC machine to Heisenware.

***

### showDefaultMappings

This is a static function that returns the default internal mappings of common Heidenhain data points to their corresponding OPC UA nodeIds or browse paths. This is useful for understanding which OPC UA nodes are being accessed by the high-level functions like `getOperatingMode()` or `getProgramInfo()`.

Parameters

None.

Output

A JSON object showing the mapping between human-readable names and their OPC UA addresses. For example:

JSON

```yaml
{
  "operatingMode": "/0:Objects/1:HEIDENHAIN NC/1:Machine/2:Channels/1:0/2:OperatingMode",
  "feedOverride": "/0:Objects/1:HEIDENHAIN NC/1:Machine/2:Channels/1:0/2:FeedOverride",
  "manufacturer": "ns=1;i=52004",
  "...": "..."
}
```

***

### create

Creates a new connection instance for a specific Heidenhain machine. This function requires the machine's network details and credentials.

Parameters

* options: An object containing the connection details.
  * machineIpAddress: The IP address or hostname of the Heidenhain machine.
  * machineUser: The SSH username for the machine. Defaults to `user`.
  * machinePassword: The SSH password for the machine. Defaults to `user`.
  * mappings: An optional object to override the default OPC UA mappings.

Example

```yaml
# options
machineIpAddress: 192.168.1.50
machineUser: heidenhain_user
machinePassword: my_secret_password
```

***

### prepareOpcUaAssistant

This is the first step in the one-time setup process for establishing a secure connection. This function creates the necessary local client certificates and then uses SSH to transfer them to the Heidenhain machine. After running this, you must complete the setup using the "OPC UA Assistant" on the machine's control panel.

Parameters

None.

Output

A string containing instructions and the folder paths to use in the Heidenhain OPC UA Assistant on the machine control.

***

### finalizeOpcUaAssistant

This is the second and final step of the one-time setup process. After you have run the OPC UA Assistant on the machine (which exports the server's certificates), call this function. It uses SSH to retrieve the server certificates from the machine and installs them into the local trust store, completing the secure channel setup.

Parameters

None.

Output

A confirmation string indicating that the certificate exchange is complete and the client is ready to connect.

***

### connect

Establishes a secure OPC UA connection to the Heidenhain machine using the previously exchanged certificates.

Parameters

None.

Output

Returns `true` on a successful connection.

***

### disconnect

Closes the OPC UA session and disconnects from the machine.

Parameters

None.

Output

Returns `true` on a successful disconnection.

***

### isConnected

Checks if the client has a valid and active connection to the machine.

Parameters

None.

Output

Returns `true` if connected, otherwise `false`.

***

### Heidenhain Data Functions

These functions provide direct access to common Heidenhain machine data points.

#### getOperatingMode

Receives the current NC operating mode.

* Output: A string representing the mode (e.g., `Manual`, `Automatic`, `Handwheel`).

#### getFeedOverride

Receives the current feed override value.

* Output: A number representing the feed override percentage.

#### getSpeedOverride

Receives the current spindle speed override value.

* Output: A number representing the speed override percentage.

#### getRapidOverride

Receives the current rapid speed override value.

* Output: A number representing the rapid override percentage.

#### getCutterLocation

Receives the current X, Y, and Z coordinates of the tool tip.

* Output: An array of numbers `[X, Y, Z]`.

#### getToolInfo

Provides information about the currently active tool.

* Output: An object containing the tool's `databaseId`, `identifier`, and `name`.

#### getProgramInfo

Provides information about the currently running NC program.

* Output: An object containing details like `currentCall`, `executionStack`, `name`, `fileNodeId`, and program `currentState`.

#### getControlInfo

Provides general information about the machine's control unit.

* Output: An object containing the `manufacturer`, `model`, `ncVersion`, and `ncKernel`.

#### getOperatingTimeInfo

Provides information about machine and control operating times.

* Output: An object containing `controlUpTime`, `machineUpTime`, and `programExecutionTime`.

#### getStateInfo

Provides information about the machine's current state.

* Output: An object containing the `currentState` and `lastTransition` of the machine's state machine.

#### getActiveErrors

Retrieves a detailed list of all currently active errors on the machine.

* Output: An object where each key is an error ID and the value is another object containing detailed information about that error (e.g., `action`, `cause`, `text`).

***

### TNC File System Functions

These functions are for interacting with the machine's `TNC:` file system.

#### browseTncDirectory

Browses the root of the machine's `TNC:` file system non-recursively.

* Output: An array of objects, where each object has a `name` and `nodeId` for a file or folder.

#### readTncFile

Reads a file from the `TNC:` directory.

* Parameters:
  * `filePath`: Path to the file using forward slashes (e.g., `programs/main.h`).
* Output: The file content as a base64 encoded string.

#### writeTncFile

Writes a new file to the `TNC:` directory.

* Parameters:
  * `newFileName`: The name of the file to create, including its path (e.g., `setups/tool_list.txt`).
  * `content`: The data to write, either as a local file path or a base64 string.
* Output: The `nodeId` of the newly created file.

#### deleteTncFile

Deletes a file from the `TNC:` directory.

* Parameters:
  * `fileName`: The name of the file to delete, including its path.
* Output: `true` on success.

***

### Generic OPC UA Functions

These methods are direct pass-throughs to the underlying `OpcuaClient`, allowing for generic OPC UA operations if the specialized Heidenhain functions are not sufficient. The parameters and output for these functions are identical to those described in the OpcuaClient documentation.

* `browseObjects(path)`: Browses OPC UA objects.
* `callMethod(methodAddress, inputValues)`: Calls an OPC UA method.
* `deleteFile(folderAddress, fileName)`: Deletes a file from any OPC UA file system.
* `readFile(address)`: Reads a file from any OPC UA file system.
* `readNode(address)`: Reads all attributes of any OPC UA node.
* `readVariable(address)`: Reads the value of any OPC UA variable.
* `writeFile(folderAddress, newFileName, pathOrBase64)`: Writes a file to any OPC UA file system.
* `writeVariable(address, value)`: Writes a value to any OPC UA variable.
