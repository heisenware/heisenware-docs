# Industrial Blockchain

The Industrial Blockchain add-on talks to a SafeUrChain node: a ledger whose entries cannot be changed afterwards, for audit trails and proof of origin across a production or supply chain network. You write a value, the ledger timestamps it into a block, and anyone can later show that the value is the one that was written.

Install it from the Functions explorer (see [Add-ons](README.md)); it then appears there as the agent **Industrial Blockchain** with the class `SafeUrChain`. Static functions start and stop the node; writing and reading go through an instance.

## Recording to the ledger without wiring

With the add-on installed, the [recorder](../../../app-builder/flowboard/recorder.md) extension offers one more retention policy: **Blockchain**, shown as `BC` on the recorder. A point recorded under it goes into the ledger as well as into the time-series database, and the platform starts the node and keeps its instance for you. Use the functions below when you need more than that: your own measurement and tags, a query, or a look at the chain itself.

If the badge turns red, the add-on is no longer installed and nothing is written to the ledger.

## Node management

Use these static functions to control the local blockchain node process.

### `startNode`

Starts a SafeUrChain node on the local system.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>network</code></td><td>The name of the network to join. Default <code>'hsmw'</code>.</td><td>string</td></tr><tr><td></td><td><code>index</code></td><td>A unique identification index for this node in the network. Default 0.</td><td>integer</td></tr><tr><td></td><td><code>validator</code></td><td>Enables participation in block validation and creation. Default <code>true</code>.</td><td>boolean</td></tr><tr><td></td><td><code>validators</code></td><td>An array of trusted validator node IDs.</td><td>array</td></tr><tr><td></td><td><code>storeTransactionsFrom</code></td><td>An array of node ID patterns from which to store transactions.</td><td>array</td></tr><tr><td></td><td><code>singleNode</code></td><td>Runs the node in standalone isolation mode. Default <code>true</code>.</td><td>boolean</td></tr><tr><td></td><td><code>blockTimeInMs</code></td><td>The target duration between block creations in milliseconds. Default 5000.</td><td>integer</td></tr></tbody></table>

#### Output

Returns nothing.

#### Examples

**Start a single validator node**

Configures and starts a standalone test network node.

```yaml
# options
network: local-test
index: 0
validator: true
validators: ['local-test-0']
singleNode: true
```

### `stopNode`

Stops the currently running node process.

#### Parameters

None.

#### Output

Returns nothing.

### `isNodeRunning`

Checks whether the node process is active on the system.

#### Parameters

None.

#### Output

Returns `true` if the node runs, or `false` if it is stopped.

## Writing and reading data

An instance is the client that talks to one node. Create it once, then wire its functions.

### `create`

Creates a client for a node, connected to that node's API.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>apiUrl</code></td><td>The endpoint URL of the SafeUrChain node API. Without it, the add-on's own environment decides.</td><td>string</td></tr></tbody></table>

#### Output

Returns the name of the created instance.

#### Examples

```yaml
# apiUrl
http://localhost:7878
```

### `write`

Writes a data point as a new transaction to the blockchain. The ledger timestamps the entry and indexes it under a designated measurement string.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td>The category identifier for the recorded data.</td><td>string</td></tr><tr><td><code>data</code></td><td>The data payload to record. Accepts any JSON-serializable value.</td><td>any</td></tr><tr><td><code>tags</code></td><td>Optional key-value metadata pairs used for filtering queries.</td><td>object</td></tr></tbody></table>

#### Output

Returns a string containing the unique transaction hash.

#### Examples

**Record a temperature reading**

```yaml
# measurement
temperature
# data
25.5
# tags
machineId: M-500
unit: celsius
```

### `read`

Queries data from the blockchain by measurement category and filters the results using metadata tags.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td></td><td>The name of the measurement category to query.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>tags</code></td><td>Key-value pairs to filter records. Matches entries containing all specified tags.</td><td>object</td></tr></tbody></table>

#### Output

Returns an array of data point objects sorted chronologically by date. Each object includes the value, timestamp, transaction hash, and block height.

#### Examples

**Query machine logs**

```yaml
# measurement
temperature
# options
tags:
  machineId: M-500
```

### `getDataPoint`

Retrieves a single data point directly using its unique transaction hash.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>transactionHash</code></td><td>The targeted unique transaction hash identifier.</td><td>string</td></tr></tbody></table>

#### Output

Returns an object containing the stored payload value, timestamp, block hash, and block height.

## Blockchain inspection

Use these functions to monitor blockchain structure and health status.

### `getTopBlock`

Retrieves the latest block added to the chain.

#### Parameters

None.

#### Output

Returns an object containing the block digest hash and header info (including height, timestamp, and previous digest hash).

### `getBlockAtHeight`

Retrieves a specific block using its sequential block height number.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>height</code></td><td>The block sequence number.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the block object details.

### `getBlocks`

Retrieves a sequence range of blocks.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>from</code></td><td>The starting sequential block height.</td><td>integer</td></tr><tr><td><code>to</code></td><td>The ending sequential block height.</td><td>integer</td></tr></tbody></table>

#### Output

Returns an array of block objects.

### `getHashesInBlock`

Retrieves all transaction hashes wrapped inside a specific block.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>block</code></td><td>The target block digest hash string.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of transaction hash strings.

### `getTelemetry`

Retrieves network health information, node connection statuses, and active peer details.

#### Parameters

None.

#### Output

Returns a network telemetry status object.
