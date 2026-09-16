---
description: >-
  Read, write, browse and subscribe to the Data Layer of a Bosch Rexroth ctrlX
  CORE over its REST API.
---

# ctrlX Data Layer

The ctrlX Data Layer connector (`CtrlX`) talks to a Bosch Rexroth ctrlX CORE, or a ctrlX COREvirtual, through the REST API of ctrlX OS. It reads and writes nodes of the Data Layer, browses the tree, describes nodes and subscribes to value changes.

This connector requires [instance creation](./#instance-creation). The connector runs where it can reach the device over the network: on the platform, or in a [Native or Docker Agent](../../agents/) next to the machine.

## ctrlX in a nutshell

A ctrlX CORE is a small industrial computer that runs **ctrlX OS**, a Linux made for controllers. Everything that does work on it is an **app**: the PLC runtime, motion control, fieldbus masters, OPC UA, MQTT, an HMI, and software from other vendors, installed from the ctrlX Store or by hand. Other makers ship ctrlX OS on their own controllers too. A **ctrlX COREvirtual** is the same operating system as a virtual machine on a PC, with the same apps and the same interfaces, and a good place to try this connector before a real device is at hand.

### The Data Layer

Every app on the device publishes what it has into one shared tree, the **Data Layer**, and reads from it what the others publish. There is no hidden memory map: if an app has it, it is in the tree. This connector is a **client** of that tree.

* A **node** is one entry of the tree, addressed by a path: `framework/metrics/system/cpu-utilisation-percent` for the operating system, `plc/app/Application/sym/GVL/counter` for a PLC variable, `motion/axs/Axis_1/...` for an axis. `browse` lists the children of an address; the Data Layer page on the device shows the whole tree.
* A node has a **value** and a **type**: `bool8`, `int32`, `double`, `string` and so on, with `ar` in front for lists, or `object` for a structured value. `metadata` tells what a node is and which operations it allows.
* A **subscription** is a rule set the device keeps: which nodes, how often to deliver (`publishInterval`), how often to look at the value (`samplingInterval`), which small changes to swallow (`deadBandValue`). The device pushes the changes; nobody polls.

### Words you will meet

| Word | Meaning |
| --- | --- |
| ctrlX CORE | The controller hardware, in the sizes X3, X5 and X7. |
| ctrlX COREvirtual | The same operating system as a virtual machine on a PC. |
| ctrlX OS | The operating system of the device, with a web page for settings, users, certificates, apps and the Data Layer. |
| ctrlX WORKS | The Windows suite that manages devices and virtual controls and holds the PLC editor. |
| App | Software installed on the device. The PLC runtime is one, the OPC UA server another. |
| Data Layer | The shared tree of nodes on the device. |
| Address | The path of a node in the tree, what this connector calls `address`. |
| Provider, client | An app that owns nodes, and anyone who reads, writes or subscribes to them. This connector is a client. |
| Subscription | A named rule set on the device that pushes changes of chosen nodes. |
| Solution | A saved set of app configurations, the project on the device. |
| Scheduler | The real-time task system in which apps run their cyclic code. |
| User, permissions | Managed on the device. The user this connector logs in with decides what it may read and write. |

## Before you start

* **A ctrlX user.** The connector logs in with a name and password. The user's permissions on the device decide which nodes you may read and write.
* **Trust the device once.** A ctrlX CORE shows a certificate it made itself, so the first connection is refused. Run `TrustStore.trustServer` with the device's address, see [Trusted certificates](trusted-certificates.md). From then on the connector accepts the device.
* **Addresses** are Data Layer node paths as the ctrlX Data Layer app shows them, for example `framework/metrics/system/cpu-utilisation-percent` or `plc/app/Application/sym/GVL/counter`.

## Instance creation

### `create`

Creates a ctrlX Data Layer client for one device. The connector logs in right away and keeps the session: an expired session is renewed on the next call, a lost subscription stream is reopened by itself.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="160">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The device's address, for example <code>https://192.168.1.1</code>. A ctrlX COREvirtual in port-forwarding mode: <code>https://localhost:8443</code>.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>username</code></td><td>The ctrlX user to log in with.</td><td>string</td></tr><tr><td></td><td><code>password</code></td><td>That user's password.</td><td>string</td></tr><tr><td></td><td><code>timeout</code></td><td>Milliseconds a call may take before it gives up. Default: 30000.</td><td>integer</td></tr><tr><td></td><td><code>tls</code></td><td>TLS settings for this client only, on top of what the workspace trusts: <code>rejectUnauthorized</code> (<code>false</code> accepts any certificate), <code>ca</code>, <code>cert</code>, <code>key</code>, <code>passphrase</code>, as for <a href="http-rest.md#self-signed-and-internal-certificates">HTTP / REST</a>.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# url
https://192.168.1.1
# options
username: boschrexroth
password: <password>
```

#### Output

Returns the name of the created instance.

## Reading

### `read`

Reads the value of a node.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td>The node to read.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# address
framework/metrics/system/cpu-utilisation-percent
```

#### Output

The node's value, for example `3.9`.

### `bulkRead`

Reads many nodes with one request.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>addresses</code></td><td>The nodes to read.</td><td>string[]</td></tr></tbody></table>

#### Example

```yaml
# addresses
- framework/metrics/system/cpu-utilisation-percent
- framework/metrics/system/memavailable-mb
```

#### Output

One entry per address, in the same order. `result` is `DL_OK` when the read worked, otherwise the Data Layer's reason, for example `DL_UNAVAILABLE` for a node that does not exist.

```yaml
- address: framework/metrics/system/cpu-utilisation-percent
  value: 3.9
  type: double
  timestamp: '2026-09-16T08:15:02.117Z'
  result: DL_OK
- address: framework/metrics/system/memavailable-mb
  value: 1024
  type: uint32
  timestamp: '2026-09-16T08:15:02.117Z'
  result: DL_OK
```

### `browse`

Lists the child nodes of an address.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td>The node whose children to list. Optional, the Data Layer root when omitted.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# address
framework/metrics/system
```

#### Output

The child node names, for example `[cpu-utilisation-percent, memavailable-mb]`.

### `metadata`

Describes a node: what it is and what it allows.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td>The node to describe.</td><td>string</td></tr></tbody></table>

#### Output

The node's metadata as the device reports it, among it `nodeClass`, `operations` (`read`, `write`, `create`, `delete`, `browse` as booleans), `description`, `displayName` and `unit`.

## Writing

### `write`

Writes the value of a node. The Data Layer wants to know the value's type. Leave `type` out and the connector reads the node first to learn it; give it when you know it and save that round trip.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td>The node to write.</td><td>string</td></tr><tr><td><code>value</code></td><td>The new value.</td><td>any</td></tr><tr><td><code>type</code></td><td>The Data Layer type of the value, see <a href="ctrlx-data-layer.md#value-types">value types</a>. Optional, learned from the node when omitted.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# address
plc/app/Application/sym/GVL/setpoint
# value
42.5
# type
double
```

#### Output

Returns `true` when the device accepted the value. A value that does not fit the node's type is refused by the device, and the error says why.

### `bulkWrite`

Writes many nodes with one request. Items without a `type` are read first, together, to learn it.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>items</code></td><td>The writes as <code>{ address, value, type }</code>.</td><td>object[]</td></tr></tbody></table>

#### Example

```yaml
# items
- address: plc/app/Application/sym/GVL/setpoint
  value: 42.5
  type: double
- address: plc/app/Application/sym/GVL/enabled
  value: true
```

#### Output

One entry per item, in the same order, as for `bulkRead`. `result` is `DL_OK` when the write worked.

## Subscribing

### `subscribe`

Subscribes to one or many nodes. The listener is called with the current value right away and then on every change. The subscription is all or nothing: an address that does not exist fails the call, nothing is left on the device.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="160">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>addresses</code></td><td></td><td>One node or a list of nodes.</td><td>string | string[]</td></tr><tr><td><code>listener</code></td><td></td><td>Receives every change as <code>{ address, value, type, timestamp }</code>.</td><td>function</td></tr><tr><td><code>properties</code></td><td><code>id</code></td><td>A name for the subscription. Optional, generated when omitted, returned either way.</td><td>string</td></tr><tr><td></td><td><code>publishInterval</code></td><td>Milliseconds between deliveries: changes are collected and sent at most this often. Default: 1000.</td><td>integer</td></tr><tr><td></td><td><code>keepaliveInterval</code></td><td>Milliseconds between keep-alive signs of life when nothing changes. Default: 60000.</td><td>integer</td></tr><tr><td></td><td><code>errorInterval</code></td><td>Milliseconds after which a node in error is tried again. Default: 10000.</td><td>integer</td></tr><tr><td></td><td><code>samplingInterval</code></td><td>Milliseconds between two looks at the value on the device. Optional, the device's default when omitted.</td><td>integer</td></tr><tr><td></td><td><code>queueSize</code></td><td>How many changes the device keeps for you between deliveries. Optional, the device's default when omitted.</td><td>integer</td></tr><tr><td></td><td><code>deadBandValue</code></td><td>Changes smaller than this are not reported. Optional, every change when omitted.</td><td>number</td></tr></tbody></table>

#### Example

```yaml
# addresses
- framework/metrics/system/cpu-utilisation-percent
- plc/app/Application/sym/GVL/counter
# properties
publishInterval: 500
```

#### Output

Returns the subscription id, for `unsubscribe`. The listener receives, per change:

```yaml
address: plc/app/Application/sym/GVL/counter
value: 42
type: int32
timestamp: '2026-09-16T08:15:02.117Z'
```

### `unsubscribe`

Ends a subscription, or takes nodes out of subscriptions. Give the id `subscribe` returned to end that subscription. Give one or many addresses to stop receiving those nodes; a subscription left without nodes ends.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>target</code></td><td>A subscription id, or one or many addresses.</td><td>string | string[]</td></tr></tbody></table>

#### Output

Returns `true`.

## Connection

### `isConnected`

Returns `true` when logged in and the device answered the last call.

### `disconnect`

Ends all subscriptions and logs out. Returns `true`.

## Tips and tricks

### Value types

The Data Layer names its types like this: `bool8`, `int8`, `uint8`, `int16`, `uint16`, `int32`, `uint32`, `int64`, `uint64`, `float`, `double`, `string`, `timestamp`, `raw`, `object`, and for lists the same with `ar` in front (`arint32`, `ardouble`, `arstring`, ...). `bulkRead` and the listener tell you the type of every node, so you rarely have to look it up.

### Timestamps

The device counts time in steps of 100 nanoseconds since the year 1601. The connector turns that into ISO time (`2026-09-16T08:15:02.117Z`) everywhere: in `bulkRead`, `bulkWrite` and the listener's changes.

### Subscriptions in practice

* One `subscribe` call is one subscription on the device. Put the nodes that belong together into one call, and tune `publishInterval` to the pace the flow needs: `500` for a live gauge, `5000` for a dashboard that refreshes calmly.
* The device drops a subscription nobody listens to after a minute. The connector keeps the stream open, and when the network hiccups it recreates the subscription and reopens the stream by itself, backing off from one second up to thirty.
* `unsubscribe` with the id is the clean end of a subscription. Deleting the instance or calling `disconnect` ends all of them.

### Errors

Every error names what was tried and what the device said, for example `CtrlX: GET /automation/api/v2/nodes/plc/app/x failed: 404 Not Found - Node not found`. A login failure with `401` means name or password are wrong. A `self-signed certificate` error means the device is not trusted yet, see [Before you start](ctrlx-data-layer.md#before-you-start).
