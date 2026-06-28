# API

## Adpater

Generates an adapter layer for existing code and enables further VRPC-based communication.

### Events

#### "create"

Emitted on creation of shared instance

**Properties**

| Name      | Type          | Description                           |
| --------- | ------------- | ------------------------------------- |
| className | `String`      | The class name of the create instance |
| instance  | `String`      | The instance name                     |
| args      | `Array.<Any>` | The constructor arguments             |

#### "delete"

Emitted on deletion of shared instance

**Properties**

| Name      | Type     | Description                            |
| --------- | -------- | -------------------------------------- |
| className | `String` | The class name of the deleted instance |
| instance  | `String` | The instance name                      |

***

### Static functions

#### addPluginPath (dirPath, \[maxLevel])

{% hint style="danger" %}
Not recommended to use. Node.js package loading is undergoing changes, so this function may not work as you expect.
{% endhint %}

Automatically requires .js files for auto-registration.

**Params**

* dirPath `String` - Relative path to start the auto-registration from
* \[maxLevel] `Number` - Maximum search depth (default: unlimited)

#### register (code, \[options])

Registers existing code and makes it (remotely) callable

**Params**

* code `Any` - Existing code to be registered, can be a class or function object or a relative path to a module
* \[options] `Object`
  * \[.onlyPublic] `Boolean` `= true` - If true, only registers functions that do not begin with an underscore
  * \[.withNew] `Boolean` `= true` - If true, class will be constructed using the `new` operator
  * \[.schema] `Object` `=` - If provided is used to validate ctor parameters (only works if registered code reflects a single class)
  * .jsdocPath `String` - if provided, parses documentation and provides it as meta information

{% hint style="info" %}
**NOTE**

This function currently only supports registration of classes (either when provided as object or when exported on the provided module path)
{% endhint %}

#### registerInstance (obj, options)

Registers an existing instance and make it (remotely) callable

**Params**

* obj `Object` - The instance to be registered
* options `Object`
  * .className `String` - Class name of the instance
  * .instance `String` - Name of the instance
  * \[.onlyPublic] `Boolean` `= true` - If true, only registers functions that do not begin with an underscore
  * \[.jsdocPath] `String` - if provided, parses documentation and provides it as meta information

#### create (options)

Creates a new instance

**Params**

* options `Object`
  * .className `String` - Name of the class which should be instantiated
  * \[.instance] `String` - Name of the created instance. If not provided an id will be generated
  * \[.args] `Array` - Positional arguments for the constructor call
  * \[.isIsolated] `bool` `= false` - If true the created instance will be visible only to the client who created it

**Returns**: `Object` - The real instance (not a proxy!)

#### delete (instance)

Deletes an instance

**Params**

* instance `String` | `Object` - Instance (name or object itself) to be deleted

**Returns**: `Boolean` - True in case of success, false otherwise&#x20;

#### getInstance (instance)

Retrieves an existing instance by name

**Params**

* instance `String` - Name of the instance to be acquired

**Returns**: `Object` - The real instance (not a proxy!)

#### getAvailableClasses ()

Retrieves an array of all available classes (names only)

**Returns**: `Array.<String>` - Array of class names

#### getAvailableInstances (className)

Provides the names of all currently running instances.

**Params**

* className `String` - Name of class to retrieve the instances for

**Returns**: `Array.<String>` - Array of instance names

***

## Agent

Agent capable of making existing code available to remote control by clients.

#### new VrpcAgent (obj)

Constructs an agent instance

**Params**

* obj `Object`
  * \[.username] `String` - MQTT username
  * \[.password] `String` - MQTT password (if no token is provided)
  * \[.token] `String` - Access token
  * \[.domain] `String` `= 'vrpc'` - The domain under which the agent-provided code is reachable
  * \[.agent] `String` `= '<user>-<pathId>@<hostname>-<platform>-js'` - This agent's name
  * \[.broker] `String` `= 'mqtts://vrpc.io:8883'` - Broker url in form: `<scheme>://<host>:<port>`
  * \[.log] `Object` `= console` - Log object (must support debug, info, warn, and error level)
  * \[.bestEffort] `String` `= true` - If true, message will be sent with best effort, i.e. no caching if offline
  * \[.version] `String` `= ''` - The (user-defined) version of this agent
  * \[.mqttClientId] `String` `= '<generated()>'` - Explicitly set the mqtt client id.

**Example**

```javascript
const agent = new Agent({
  domain: 'vrpc'
  agent: 'myAgent'
})
```

***

### Instance Functions

#### serve ()

Starts the agent

The returned promise will only resolve once the agent is connected to the broker. If the connection can't be established it will try connecting forever. You may want to listen to the 'offline' (initial connect attempt failed) or 'reconnect' (any further fail) event and call `agent.end()` to stop trying to connect and resolve the returned promise.

If the connection could not be established because of authorization failure, the 'error' event will be emitted.

**Returns**: `Promise` - Resolves once connected or explicitly ended, never rejects

#### end (\[obj], \[unregister])

Stops the agent

**Params**

* \[obj] `Object`
* \[unregister] `Boolean` `= false` - If true, fully un-registers agent from broker

**Returns**: `Promise` - Resolves when disconnected and ended&#x20;

#### create (options)

Creates a new instance locally

{% hint style="info" %}
**NOTE**

The instance must previously be registered by the local VrpcAdapter
{% endhint %}

**Returns**: `Object` - The real instance (not a proxy!)&#x20;

**Params**

* options `Object`
  * .className `String` - Name of the class which should be instantiated
  * \[.instance] `String` - Name of the created instance. If not provided an id will be generated
  * \[.args] `Array` - Positional arguments for the constructor call
  * \[.isIsolated] `bool` `= false` - If true the created instance will be visible only to the client who created it

***

### Events

#### "connect"

Emitted on successful (re)connection (i.e. connack rc=0).

**Properties**

| Name           | Type      | Description                                             |
| -------------- | --------- | ------------------------------------------------------- |
| sessionPresent | `Boolean` | A session from a previous connection is already present |

#### "reconnect"

Emitted when a reconnect starts.

#### "close"

Emitted after a disconnection.

#### "offline"

Emitted when the client goes offline.[`t`](https://github.com/heisenware/vrpc-js/blob/master/docs/api.md#VrpcAgent)

#### "error"

Emitted when the client cannot connect (i.e. connack rc != 0) or when a parsing error occurs. The following TLS errors will be emitted as an error event:

* ECONNREFUSED
* ECONNRESET
* EADDRINUSE
* ENOTFOUND

#### "end"

Emitted when `mqtt.Client#end()` is called. If a callback was passed to `mqtt.Client#end()`, this event is emitted once the callback returns.

#### "clientGone"

Emitted when a tracked VRPC client exited.

***

### Static Functions

#### VrpcAgent.fromCommandline (defaults)

Constructs an agent by parsing command line arguments

**Params**

* defaults `Object` - Allows to specify defaults for the various command line options
  * .domain `String` - The domain under which the agent-provided code is reachable
  * .agent `String` - This agent's name
  * .username `String` - MQTT username (if no token is used)
  * .password `String` - MQTT password (if no token is provided)
  * .token `String` - Access token as generated by: [https://app.vrpc.io](https://app.vrpc.io/)
  * .broker `String` - Broker url in form: `<scheme>://<host>:<port>`
  * .version `String` - The (user-defined) version of this agent

**Example**

```javascript
const agent = VrpcAgent.fromCommandline()
```

## Client

#### new VrpcClient(options)

Constructs a remote client, able to communicate with any distributed agents

NOTE: Each instance creates its own physical connection to the broker.

**Params**

* options `Object`
  * \[.username] `String` - MQTT username
  * \[.password] `String` - MQTT password (if no token is provided)
  * \[.token] `String` - Access token
  * .domain `String` - Sets the domain
  * \[.agent] `String` `= "*"` - Sets default agent
  * \[.broker] `String` `= "mqtts://vrpc.io:8883"` - Broker url in form: `<scheme>://<host>:<port>`
  * \[.timeout] `Number` `= 12000` - Maximum time in ms to wait for a RPC answer
  * \[.log] `Object` `= console` - Log object (must support debug, info, warn, and error level)
  * \[.bestEffort] `Boolean` `= true` - If true, message will be sent with best effort, i.e. no caching if offline
  * \[.mqttClientId] `String` `= '<generated()>'` - Explicitly sets the mqtt client id
  * \[.identity] `String` - Explicitly sets a vrpc client identity
  * \[.keepalive] `String` - Sets the MQTT keepalive interval (in seconds)
  * \[.requiresSchema] `Boolean` `= false` - If true, any available schema information is shipped

**Example**

```js
const client = new VrpcClient({
  domain: 'vrpc',
  broker: 'mqtt://vrpc.io'
})
```

***

### Instance Functions

#### getClientId ()

Provides a unique id for this client instance

**Returns**: `String` - clientId

#### connect ()

Actually connects to the MQTT broker.

**Returns**: `Promise` - Resolves once connected within \[timeout], rejects otherwise

**Emits**: `event:connected`

**Example**

```js
try {
  await client.connect()
} catch (err) {
  console.error(`Could not connect because: ${err.message}`)
}
```

#### create (options)

Creates a new remote instance and provides a proxy to it.

Remote instances can be "shared" or "isolated". Shared instances are visible and re-attachable across clients as long as they are not explicitly deleted. Life-cycle changes of shared instances are available under the `class`, `instanceNew`, and `instanceGone` events. A shared instance is created by default (`isIsolated: false`).

When the `isIsolated` option is true, the remote instance stays invisible to other clients and the corresponding proxy object is the only way to issue commands.

{% hint style="info" %}
**NOTE**&#x20;

When creating an instance that already exists, the new proxy will simply attach to (and not re-create) it - just like `getInstance()` was called.
{% endhint %}

**Params**

* options `Object`
  * .className `String` - Name of the class which should be instantiated
  * \[.instance] `String` - Name of the created instance. If not provided an id will be generated
  * \[.args] `Array` - Positional arguments for the constructor call
  * \[.agent] `String` - Agent name. If not provided class default is used
  * \[.cacheProxy] `bool` `= false` - If true the proxy object for a given instance is cached and (re-)used in subsequent calls
  * \[.isIsolated] `bool` `= false` - If true the created proxy will be visible only to the client who created it

**Returns**: `Promise.<Proxy>` - Object reflecting a proxy to the original object which is handled by the agent&#x20;

**Example**

```js
// create isolated instance
const proxy1 = await client.create({
  className: 'Foo',
  instance: 'myPersonalInstance',
  isIsolated: true
})
// create shared instance
const proxy2 = await client.create({
  className: 'Foo',
  instance: 'aSharedFooInstance'
})
// create shared instance providing three constructor arguments
const proxy3 = await client.create({
  className: 'Bar',
  instance: 'mySharedBarInstance',
  args: [42, "second argument", { some: 'option' }]
})
```

***

#### getInstance (instance, \[options])

Get a remotely existing instance.

Either provide a string only, then VRPC tries to find the instance using client information, or additionally provide an object with explicit meta data.

**Params**

* instance `String` - The instance to be retrieved
* \[options] `Object` - Explicitly define agent and class
  * \[.className] `String` - Name of the instance's class
  * \[.agent] `String` - Agent name. If not provided class default is used as priority hit
  * \[.noWait] `bool` `= false` - If true immediately fail if instance could not be found in local cache

**Returns**: `Promise.<Proxy>` - Proxy object reflecting the remotely existing instance

#### delete (instance, \[options])

Delete a remotely existing instance

Either provide a string only, then VRPC tries to find the instance using client information, or provide an object with explicit meta data.

**Params**

* instance `String` - The instance to be deleted
* \[options] `Object` - Explicitly define agent and class
  * .className `String` - Name of the instance's class
  * .agent `String` - Agent name. If not provided class default is used as priority hit

**Returns**: `Promise.<Boolean>` - true if successful, false otherwise&#x20;

#### callStatic (options)

Calls a static function on a remote class

**Params**

* options `Object`
  * .className `String` - Name of the static function's class
  * .functionName `String` - Name of the static function to be called
  * \[.args] `Array` - Positional arguments of the static function call
  * \[.agent] `String` - Agent name. If not provided class default is used

**Returns**: `Promise.<Any>` - Return value of the remotely called function

#### callAll (options)

Calls the same function on all instances of a given class and returns an aggregated result. It as well allows for batch event and callback registrations. In this case the instanceId of the emitter is injected as first argument of any event callback.

{% hint style="info" %}
**NOTE**

When no agent was specified as class default and no agent is specified when calling this function, callAll will act on the requested class across all available agents. The same is true when explicitly using a wildcard (\*) as agent value.
{% endhint %}

**Params**

* options `Object`
  * .className `String` - Name of the static function's class
  * \[.args] `Array` - Positional arguments of the static function call
  * \[.agent] `String` - Agent name. If not provided class default is used

**Returns**: `Promise.<Array.<Object>>` - An array of objects `{ id, val, err }` carrying the instance id, the return value and potential errors&#x20;

#### getSystemInformation ()

Retrieves all information about the currently available components.

```ts
type SystemInformation = {
  [agent].status: string, // 'offline' or 'online'
  [agent].hostname: string,
  [agent].version: string,
  [agent].classes[className].instances: string[],
  [agent].classes[className].memberFunctions: string[],
  [agent].classes[className].staticFunctions: string[],
  [agent].classes[className].meta?: MetaData
}
```

**Returns**: `Object` - SystemInformation

#### getAvailableAgents (\[options])

Retrieves all available agents.

**Params**

* \[options] `Object`
  * \[.mustBeOnline] `Boolean` `= true` - Only retrieve currently online agents

**Returns**: `Array` - Array of agent names.&#x20;

#### getAvailableClasses(\[options])

Retrieves all available classes on specific agent.

**Params**

* \[options] `Object`
  * \[.agent] `String` - Agent name. If not provided class default is used.
  * \[.mustBeOnline] `Boolean` `= true` - Only retrieve currently online classes

**Returns**: `Array` - Array of class names.&#x20;

#### getAvailableInstances (\[options])

Retrieves all (shared) instances on specific class and agent.

**Params**

* \[options] `Object`
  * .className `String` - Class name
  * \[.agent] `String` - Agent name. If not provided class default is used
  * \[.mustBeOnline] `Boolean` `= true` - Only retrieve currently online classe

**Returns**: `Array` - Array of instance names&#x20;

#### getAvailableMemberFunctions (\[options])

Retrieves all member functions of specific class and agent.

**Params**

* \[options] `Object`
  * .className `String` - Class name
  * \[.agent] `String` - Agent name. If not provided class default is used
  * \[.mustBeOnline] `Boolean` `= true` - Only retrieve currently online classes

**Returns**: `Array` - Array of member function names&#x20;

#### getAvailableStaticFunctions (\[options])

Retrieves all static functions of specific class and agent.

**Params**

* \[options] `Object`
  * .className `String` - Class name
  * \[.agent] `String` - Agent name. If not provided class default is used
  * \[.mustBeOnline] `Boolean` `= true` - Only retrieve currently online classes

**Returns**: `Array` - Array of static function names&#x20;

#### reconnectWithToken (token, \[options])

Reconnects to the broker by using a different token

**Params**

* token `String` - Access token as generated by: https://app.vrpc.io
* \[options] `Object`
  * .agent `String` - Agent name. If not provided class default is used

**Returns**: `Promise` - Promise that resolves once re-connected&#x20;

#### unregisterAgent (agent)

Unregisters (= removal of persisted information) an offline agent

**Params**

* agent - The agent to be unregistered

**Returns**: `Promise.<Boolean>` - Resolves to true in case of success, false otherwise&#x20;

#### end()

Ends the connection to the broker

**Returns**: `Promise` - Resolves when ended

### Events

#### "agent"

This event is fired whenever an agent is added or removed, or whenever an agent changes its status (switches between online or offline).

**Params**

* info `Object`
  * .domain `String` - Domain name
  * .agent `String` - Agent name
  * .status `String` - Agent status, can be 'offline' or 'online'
  * .hostname `String` - Name of the host running the agent
  * .version `String` - User-defined version of the agent

#### "class"

Emitted whenever a class is added or removed, or when instances or functions of this class have changed.

**Params**

* info `Object`
  * .domain `String` - Domain name
  * .agent `String` - Agent name
  * .className `String` - Class name
  * .instances `Array.<String>` - Array of instances
  * .memberFunctions `Array.<String>` - Array of member functions
  * .staticFunctions `Array.<String>` - Array of static functions
  * .meta `MetaData` - Object associating further information to functions

#### "instanceNew"

Emitted whenever a new instance was created.

**Params**

* addedInstances `Array.<String>` - An array of newly added instances
* info `Object`
  * .domain `String` - Domain name
  * .agent `String` - Agent name
  * .className `String` - Class name

#### "instanceGone"

Emitted whenever a new instance was removed.

**Params**

* removedInstances `Array.<String>` - An array of removed instances
* info `Object`
  * .domain `String` - Domain name
  * .agent `String` - Agent name
  * .className `String` - Class name

#### "connect"

Event 'connect'

Emitted on successful (re)connection (i.e. connack rc=0).

**Properties**

| Name           | Type      | Description                                             |
| -------------- | --------- | ------------------------------------------------------- |
| sessionPresent | `Boolean` | A session from a previous connection is already present |

#### "reconnect"

Emitted when a reconnect starts.

#### "close"

Emitted after a disconnection.

#### "offline"

Emitted when the client goes offline.

#### "error"

Emitted when the client cannot connect (i.e. connack rc != 0) or when a parsing error occurs. The following TLS errors will be emitted as an error event:

* ECONNREFUSED
* ECONNRESET
* EADDRINUSE
* ENOTFOUND

#### "end"

Emitted when `end()` is called. If a callback was passed to `end()`, this event is emitted once the callback returns.

***
