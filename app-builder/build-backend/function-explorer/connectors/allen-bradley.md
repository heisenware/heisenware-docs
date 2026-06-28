# Allen-Bradley

This class provides a powerful way to connect and interact with **Allen-Bradley Programmable Logic Controllers (PLCs)** using the EtherNet/IP protocol. It's designed to make communication simple and reliable.

After connecting to a PLC, the class automatically discovers all available **tags** (variables) at the controller and program scope. You can then read or write to these tags individually or in groups, and even subscribe to them for real-time updates. This is perfect for monitoring machine status, sending commands, or collecting data for analysis.

There are no static functions available for this class. You must first create an instance to interact with a PLC.

## Constructor and Member Functions

### create

This function creates a new controller instance that represents a connection to a specific Allen-Bradley PLC. All other actions, like reading or writing tags, require this instance.

#### Parameters

1. **ipAddress**: The IP address of the target PLC on the network. This is a required text string.
2. **options**: An optional object to configure advanced settings.
   * `port`: The EtherNet/IP port number. The default is `44818`.
   * `slot`: The slot number of the CPU in the PLC chassis. The default is `0`.

#### Example: Basic Configuration

This example creates a controller instance for a PLC at a specific IP address, using the default port and slot.

```yaml
# ipAddress
192.168.1.10
```

#### Example: Advanced Configuration

This example specifies a custom port and slot number for the PLC.

```yaml
# ipAddress
192.168.1.10
# options
port: 44818
slot: 2
```

#### Output

The function creates a new `AllenBradley` controller instance, which can be used with other functions.

### connect

Establishes a connection to the PLC using the details provided in the `create` function. As part of the connection process, it automatically discovers all available controller-scoped and program-scoped tags, making them available for reading, writing, and subscribing.

#### Output

If the connection is successful, the function returns `true`.

### disconnect

Safely disconnects from the PLC and clears all subscriptions and cached tag information. It's good practice to call this when you are finished interacting with the PLC.

#### Output

If the disconnection is successful, the function returns `true`.

### onData

Registers a listener (a callback function or flow) that will be executed whenever new data arrives from a subscribed tag. You must call `subscribe` on one or more tags for this to have any effect.

#### Parameters

1. **listener**: A reference to the function or flow that should be executed when data is received. This function will receive an object containing the `tagName` and its new `value`.

#### Output

Returns the string `subscribed` to confirm the listener is registered.

### onError

Registers a listener (a callback function or flow) that will be executed if an error occurs with a subscription (e.g., the PLC connection is lost).

#### Parameters

1. **listener**: A reference to the function or flow that should be executed when an error occurs.

#### Output

Returns the string `subscribed` to confirm the listener is registered.

### subscribe

Subscribes to one or more tags to receive their values in real-time. 📡 When a tag's value changes on the PLC, the new value will be automatically pushed to your application. This is much more efficient than repeatedly reading the tag.

To handle the incoming data, you must also use the `onData` function to register a listener.

#### Parameters

1. **tagNames**: A single tag name (as a string) or a list of multiple tag names (as an array) to subscribe to.
2. **rate**: An optional number specifying how often (in milliseconds) the PLC should send updates. The default is `500` ms.

#### Example: Subscribing to a Single Tag

```yaml
# tagNames
Machine_Status
# rate
1000
```

#### Example: Subscribing to Multiple Tags

```yaml
# tagNames
[Machine_Status, Production_Count, Pressure_Sensor_1]
# rate
250
```

#### Output

This function does not have a direct output. It configures the subscription, and data will be emitted through the listener configured with `onData`.

### readTag

Reads the current value of a single, specified tag from the PLC. You must be connected before you can read a tag.

#### Parameters

1. **tagName**: The exact name of the tag you want to read (e.g., `MyMotorSpeed` or `Program:MainProgram.MyData.Status`).

#### Example

```yaml
# tagName
MyTemperature
```

#### Output

The function returns the current value of the tag. The data type will match the tag's type in the PLC.

```json
{
  "value": 72.5,
  "type": "REAL"
}
```

### readTagGroup

Reads the values of multiple tags from the PLC in a single, optimized request. This is more efficient than calling `readTag` multiple times in a row.

#### Parameters

1. **tagNames**: An array of tag names to read.

#### Example

```yaml
# tagNames
[MotorSpeed, Machine_Status, MyTemperature]
```

#### Output

The function returns an object where keys are the tag names and values are their corresponding current values.

```json
{
  "MotorSpeed": 1750,
  "Machine_Status": 3,
  "MyTemperature": 72.5
}
```

### writeTag

Writes a new value to a specified tag in the PLC. The function is smart enough to handle both simple tags (like a number or boolean) and complex, structured tags (known as UDTs or User-Defined Types).

#### Parameters

1. **tagName**: The name of the tag you want to write to.
2. **value**: The value to write. This should be a primitive value (number, boolean, string) for simple tags, or an object for complex (UDT) tags.

#### Example: Writing to a Simple Tag

This example writes the numeric value `150` to a tag named `MotorSpeedSP`.

```yaml
# tagName
MotorSpeedSP
# value
150
```

#### Example: Writing to a Complex (UDT) Tag

Imagine you have a structured tag named `Recipe` with members `Name` and `TempSetPoint`. This example writes values to both members in a single operation by providing an object.

```yaml
# tagName
Recipe
# value
Name: "Batch 2A"
TempSetPoint: 95.5
```

#### Output

If the write operation is successful, the function returns `true`.

### writeTagGroup

Writes values to multiple tags in a single, optimized network request. This is much more efficient than calling `writeTag` for each tag individually.

#### Parameters

1. **tags**: An object where each key is a tag name and its corresponding value is what you want to write to that tag.

#### Example

```yaml
# tags
MotorSpeedSP: 1800
Valve_1_Open: true
RecipeName: "Batch 3C"
```

#### Output

If the write operation is successful, the function returns `true`.

### isConnected

Checks the current connection status of the PLC controller instance.

#### Output

Returns `true` if currently connected, otherwise `false`.

### getDiscoveredTags

Returns a complete list of all tags that were discovered when the `connect` function was successfully executed. This is useful for debugging or dynamically exploring the tags available on a PLC.

#### Output

The function returns an array of tag objects, where each object contains detailed information about a tag.

```json
[
  {
    "id": 1234,
    "name": "MotorSpeed",
    "type": { "code": 195, "sint": null, "string": "DINT" },
    "structure": false
  },
  {
    "id": 5678,
    "name": "Recipe",
    "type": { "code": 160, "sint": 4321, "string": "MyRecipeUDT" },
    "structure": true
  }
]

```

## Technical Deep Dive: Allen-Bradley & EtherNet/IP

To effectively use this class, it's helpful to understand a few core concepts from the world of industrial automation.

#### PLC (Programmable Logic Controller)

A PLC is a ruggedized industrial computer that forms the brain of most automation processes. It reads inputs from sensors (like temperature, pressure, or switch positions) and makes decisions based on its programmed logic to control outputs (like motors, valves, and lights). Allen-Bradley, a brand of Rockwell Automation, is one of the leading manufacturers of PLCs.

#### EtherNet/IP

EtherNet/IP is an industrial communication protocol used for communication between devices like PLCs, robots, and sensors. It's built on standard Ethernet and TCP/IP technologies, but it uses the **Common Industrial Protocol (CIP)** on top to format data in a way that automation devices understand. This class handles all the complexities of EtherNet/IP for you.

#### Tags

In the PLC world, a **tag** is simply a variable. It's a named piece of memory that stores a value, such as the current speed of a motor or the number of products counted. Tags have specific data types (e.g., `DINT` for a 32-bit integer, `REAL` for a floating-point number, `BOOL` for a boolean). This class automatically discovers these tags and their types.

#### UDT (User-Defined Type)

A UDT is a complex data structure, similar to an `object` in programming. It allows you to group related tags into a single, logical unit. For example, you could create a `Motor` UDT that contains members like `Speed`, `Amps`, and `IsRunning`. When you read a UDT, you get an object with key-value pairs corresponding to its members. The `writeTag` function allows you to update a UDT by providing a similar object.

#### Communication Models

This class supports three primary ways of getting data from a PLC:

1. **Polling (Read/Write)**: You explicitly ask the PLC for a tag's value (`readTag`) or tell it to change a value (`writeTag`). This is a request-response model, great for actions that happen on demand.
2. **Subscription (Real-Time)**: You tell the PLC you're interested in one or more tags (`subscribe`), and the PLC will automatically send you updates whenever their values change. This is far more efficient than polling repeatedly and is the best method for real-time monitoring and dashboards.
3. **Group Operations (Bulk Read/Write)**: For scenarios where you need to read or write many tags at once, the `readTagGroup` and `writeTagGroup` functions are the most efficient choice. They bundle multiple requests into a single network packet, significantly reducing network traffic and the time it takes to complete the operations compared to handling each tag individually.

