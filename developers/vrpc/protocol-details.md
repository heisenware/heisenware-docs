# Protocol details

What VRPC puts on the wire. You need this only to write a VRPC implementation of your own, or to read a broker trace. Writing an agent or a client needs none of it: see [VRPC](README.md).

VRPC agents and clients are MQTT clients of one logical broker, speaking MQTT 3.1.1. VRPC is not message oriented: it fixes both the topic and the payload, and does RPC on top. This page describes **protocol version 4**, which VRPC 3.18 speaks. Every message carries it as `v`.

## Topics

```
<domain>/<agent>/<class>/<instance>/<function>
```

{% hint style="info" %}
* A **static** function has `__static__` in place of `<instance>`.
* A **global** function has `__global__` in place of `<class>` and `__static__` in place of `<instance>`.
{% endhint %}

## Payloads

A **request**:

```json
{
  "c": "<context>",
  "f": "<function>",
  "a": ["<arguments>"],
  "i": "<correlationId>",
  "s": "<sender>",
  "v": 4
}
```

A **response**:

```json
{
  "a": ["<arguments>"],
  "r": "<return value>",
  "e": "<error message>",
  "i": "<correlationId>",
  "v": 4
}
```

{% hint style="info" %}
**The context `c`**

* an instance function: the **instance name**
* a static function: the **class name**
* a global function: `__global__`
{% endhint %}

{% hint style="info" %}
**Other rules**

* A successful call MUST NOT carry `e` in its response.
* Used for language embedding rather than remotely, a call omits `i` (correlationId) and `s` (sender).
*   In a language with function overloading, the function carries its full signature:

    ```
    <functionName>[-<typename arg1>:[<typename arg2>:][...]]]
    ```

    where `typename` is one of `null`, `object`, `array`, `string`, `boolean`, `number`.
{% endhint %}

## The agent

### At start

1. The user configures `<domain>` and `<agent>`.
2.  VRPC generates an MQTT client id:

    ```
    va3<agentInstance>
    ```

    where `<agentInstance>` is a 20-character hash of the domain and the agent name.
3.  It **publishes** the agent info, retained:

    ```
    <domain>/<agent>/__agentInfo__

    { "status": "online", "hostname": "<hostname>", "version": "<userAgentVersion>", "v": 4 }
    ```
4.  It walks the registered classes and **subscribes** to their static functions:

    ```
    <domain>/<agent>/<class>/__static__/<function>
    ```

    and, on any class, to the three functions of the subscription protocol: `__unsubscribe__`, `__registrations__` and `__end__`.
5.  It **publishes** two retained info messages per class. The full one carries the reflected documentation:

    ```
    <domain>/<agent>/<class>/__classInfo__

    {
      "className": "<className>",
      "instances": ["<instance1>", "..."],
      "staticFunctions": ["<function1>", "..."],
      "memberFunctions": ["<function1>", "..."],
      "meta": { "<function1>": { "description": "...", "params": [], "ret": {} } },
      "v": 4
    }
    ```

    and the concise one leaves `meta` out:

    ```
    <domain>/<agent>/<class>/__classInfoConcise__
    ```

    A client that does not need the documentation subscribes to the concise topic only.

{% hint style="info" %}
`memberFunctions` is the wire's name for what the platform calls an **instance function**: a function that acts on one instance. `meta` is optional and exists only where the adapted code carries documentation (JSDoc comments, a Python docstring); functions without any are left out of it.
{% endhint %}

### At run time

*   Receiving a message on

    ```
    <domain>/<agent>/<class>/__static__/__createShared__
    ```

    the agent creates and names an instance that every client may reach, walks its instance functions and **subscribes** to each:

    ```
    <domain>/<agent>/<class>/<instance>/<function>
    ```

    `__createIsolated__` does the same for an instance only its creator knows: no class info lists it.
*   Receiving a message on

    ```
    <domain>/<agent>/<class>/<instance>/<function>
    ```

    the agent runs the call and **publishes** the answer to the topic the request's `s` names.

### At the end

By `end()` or by MQTT last will, the agent **publishes** the retained agent info again:

```
<domain>/<agent>/__agentInfo__

{ "status": "offline", "hostname": "<hostname>", "version": "<userAgentVersion>", "v": 4 }
```

## The client

### At start

1. The user optionally configures `<domain>` and `<agent>`; those become the defaults for later remote instances.
2.  VRPC generates an MQTT client id:

    ```
    vc3<instance><hostHash>
    ```

    where `<instance>` is 8 random characters and `<hostHash>` is a 12-character hash of host properties, so it stays the same on the same host. Together: 23 characters, the MQTT maximum.
3.  It builds its **connection id**, which is what goes into `s`:

    ```
    <domain>/<mqttClientId>/<secret>
    ```

    Always three segments: agents recognize a presence message by `__clientInfo__` arriving as the fourth topic token.
4.  It listens for agents and classes by **subscribing** to

    ```
    <domain>/<agent>/__agentInfo__
    <domain>/<agent>/+/__classInfoConcise__
    ```

    (`__classInfo__` instead, when it needs the documentation; `+` in place of `<agent>` when it was given none).
5.  It listens for answers and events by **subscribing** to its own two topics:

    ```
    <domain>/<mqttClientId>/<secret>
    <domain>/<mqttClientId>/<secret>/+
    ```

    Answers arrive on the first, every event subscription on one topic below it.

### At run time

*   One message per request, to

    ```
    <domain>/<agent>/<class>/<instance>/<function>
    ```

    with `__static__` in place of `<instance>` for a static call and `__global__` in place of `<class>` for a global one.
*   An argument of *function* type travels as a string that names where its calls go back to. A one-shot callback:

    ```
    __f__<agent>-<class>-<function>-<index>-<invokeId>
    ```

    An event handler instead names the topic its events arrive on, one level below the client's own:

    ```
    __e__<domain>/<mqttClientId>/<secret>/s<n>
    ```

### At the end

By `end()` or by MQTT last will, the client **publishes** its client info, not retained:

```
<domain>/<mqttClientId>/<secret>/__clientInfo__

{ "status": "offline", "clientId": "<domain>/<hostname>/<identity>", "v": 4 }
```

## The adapter

For the calls themselves the adapter is passive: besides registering the functions to be made remote, nothing talks to it directly. It does step into the traffic twice.

### The internal functions

The functions that manage the life of remote objects and of subscriptions. All of them carry double underscores as prefix and postfix:

| Function | What it does |
| --- | --- |
| `__createShared__` | creates an instance every client may reach |
| `__createIsolated__` | creates an instance only its creator knows |
| `__callAll__` | calls one function on every instance of a class |
| `__callMatching__` | calls one function on the instances a selection names |
| `__delete__` | deletes an instance |
| `__unsubscribe__` | withdraws an event subscription by its id |
| `__registrations__` | lists the registrations an agent holds |
| `__end__` | ends a registration, with every subscription on it |

### Promises

The adapter intercepts every remote function that returns a *promise*. The return value becomes a string:

```
__p__<function>-<nonce>-<correlationId>
```

When the promise settles, the adapter sends a second response carrying the real value, with that string as its `i`.
