# OPC UA Server

The `OpcuaServer` class allows you to create and run a custom OPC UA server. Its primary feature is the ability to define a server's "information model" (the structure of folders, objects, and variables) declaratively. You can then add dynamic behavior by listening and responding to read/write requests from OPC UA clients using event handlers.

## Important Concepts

To use this class effectively, it's crucial to understand how variables are defined and how to interact with them. Variables are defined within an `object` in the information model and can be one of three types, determined by which property they are defined under: `getters`, `setters`, or `requestors`.

### Variable Interaction Types

* `getters` (Read-Only from a Client's Perspective)
  * These variables are managed _internally_ by your logic. An OPC UA client can read their value, but cannot write to it.
  * Your platform logic is responsible for updating the value of a "getter" variable by calling the `setValue()` function whenever its state changes.
  * Use Case: Displaying a machine's current temperature or speed that is read periodically from a sensor.
* `setters` (Write-Only from a Client's Perspective)
  * These variables are designed to receive data _from_ an OPC UA client. When a client writes a new value to a "setter" variable, the `onSet` event is triggered for that variable's path.
  * Your `onSet` event handler contains the logic to process this new value (e.g., send a command to a machine).
  * Crucially, after handling the input, you must call `setValue()` to acknowledge the change and update the server's internal state.
  * Use Case: Allowing a client to set a target temperature or a production recipe.
* `requestors` (Read-On-Demand)
  * These variables do not have their value stored continuously on the server. Instead, when a client tries to read a "requestor" variable, the `onRequest` event is triggered.
  * Your `onRequest` event handler must then fetch or calculate the value from its source and provide it back to the server by calling `setValue()`.
  * Use Case: Querying a database or another API for a value only when a client explicitly asks for it.

## Current Limitations

* Security: The server currently operates with `SecurityPolicy.None` and `MessageSecurityMode.None`. This means the communication is unencrypted. Certificate-based security is not supported at this time.
* Authentication: The primary mechanism for access control is the `allowAnonymous` flag in the constructor.&#x20;
* Data Types: Only a predefined set of data types is supported for variables (e.g., `boolean`, `integer`, `string`, `arrayInteger`, etc.).

## Creating OPC UA Server Instance

### create

Creates a new OPC UA server instance. The structure of the server is defined by the `objects` array.

Parameters

* `options`: An object for configuring the server.
  * `objects`: An array of objects defining the server's information model. Each object must have:
    * `path`: A `/` separated path for the folder or object (e.g., `MyMachine/Data`).
    * `type`: Can be `folder` or `object`.
    * `getters`, `setters`, `requestors`: Objects where each key is a variable name and the value is its data type (e.g., `{ myVariable: 'integer' }`).
  * `port`: The TCP port for the server to listen on. Defaults to `4840`.
  * `allowAnonymous`: If `true`, clients can connect without authentication. Defaults to `true`.

Example: Defining an information model

```yaml
# options
port: 4841
allowAnonymous: true
objects: [
  {
    path: 'Machine1',
    type: 'folder'
  },
  {
    path: 'Machine1/Status',
    type: 'object',
    getters: {
      currentSpeed: 'integer',
      isHot: 'boolean'
    },
    setters: {
      targetSpeed: 'integer'
    },
    requestors: {
      uptime: 'string'
    }
  }
]
```

## Functions

### onSet

Registers a handler that is triggered when a client writes a value to a `setter` variable.

Parameters

* `variablePath`: The full path to the variable (e.g., `Machine1/Status:targetSpeed`).
* `listener`: The callback function that will be executed. It receives one argument: the `value` written by the client.

Example

```yaml
# variablePath
Machine1/Status:targetSpeed
# listener
<callback>
```

### onRequest

Registers a handler that is triggered when a client reads a `requestor` variable.

Parameters

* `variablePath`: The full path to the variable (e.g., `Machine1/Status:uptime`).
* `listener`: The callback function that will be executed.

Example

```yaml
# variablePath
Machine1/Status:uptime
# listener
<callback>
```

### setValue

Sets a new value for a specific variable on the server. This is the essential function used to update `getters` and to respond within `onSet` and `onRequest` handlers.

Parameters

* `variablePath`: The full path to the variable (e.g., `Machine1/Status:currentSpeed`).
* `value`: The new value to set for the variable.

Example

```yaml
# variablePath
Machine1/Status:currentSpeed
# value
1500
```

### onServerUpdate

Registers a handler that is triggered whenever a variable's value is updated on the server via `setValue()`. This event is throttled to fire at most once per second.

Parameters

* `listener`: The callback function, which receives `timestamp` and `variablePath` as arguments.

Example

```yaml
# listener
<callback>
```

### start

Initializes and starts the OPC UA server, making it available for clients to connect.

Output

The endpoint URL of the running server (e.g., opc.tcp://my-pc:4841/UA/HeisenwareOPCUAServer).

### stop

Shuts down the OPC UA server.

### isStarted

Checks if the server is currently running.

Output

Returns true if the server is started, false otherwise.

## Complete Usage Example

Here’s a step-by-step example showing how to create, configure, and run the server based on the model defined in the `create` example.

{% stepper %}
{% step %}
#### Create the Server (as shown above)

First, create the server instance with the desired information model.
{% endstep %}

{% step %}
#### Handle Client Writes (onSet)

When a client sets a new targetSpeed, we process it and then confirm the change by calling setValue.

```yaml
# variablePath
Machine1/Status:targetSpeed
# listener
<callback that receives the new speed>
  // Logic to send the new speed to the actual machine...
  // After processing, confirm the value back to the OPC UA server:
  // this.setValue('Machine1/Status:targetSpeed', newSpeed)
```
{% endstep %}

{% step %}
#### Handle On-Demand Reads (onRequest)

When a client requests the uptime, we calculate it and provide it back via setValue.

```yaml
# variablePath
Machine1/Status:uptime
# listener
<callback>
  // Logic to get the current machine uptime...
  // const currentUptime = '2 days, 4 hours';
  // this.setValue('Machine1/Status:uptime', currentUptime)
```
{% endstep %}

{% step %}
#### Update Internal State (setValue)

Imagine your platform has a separate loop that checks the machine's actual speed every 5 seconds. You would use setValue to update the currentSpeed getter.

```yaml
# variablePath
Machine1/Status:currentSpeed
# value
1498 // The speed read from the machine sensor
```
{% endstep %}

{% step %}
#### Start the Server

After all handlers are configured, start the server.

```yaml
# (Call the start() function)
```
{% endstep %}
{% endstepper %}
