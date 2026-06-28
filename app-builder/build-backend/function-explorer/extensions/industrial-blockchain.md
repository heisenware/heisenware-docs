# Industrial Blockchain

The `SafeUrChain` class provides an interface for interacting with a **SafeUrChain blockchain node**. This specialized blockchain is designed to create a secure, immutable ledger for tracking data across manufacturing and supply chain networks.

This class provides methods for managing the lifecycle of a node (starting and stopping it) and for performing the two fundamental blockchain operations: writing new data as transactions and reading existing data from the chain.

## Static Node Management

These functions are used to control the blockchain node process itself.

### **startNode**

Starts a SafeUrChain node on the local system with a specified configuration.

**Parameters**

* `options`: An object for configuring the node's behavior.
  * `network`: The name of the network to connect to. Defaults to `'hsmw'`.
  * `index`: A unique index number for this node within the network. Defaults to `0`.
  * `validator`: If `true`, this node will participate in validating and creating new blocks. Defaults to `true`.
  * `validators`: An array of node IDs that are trusted validators in the network.
  * `storeTransactionsFrom`: An array of node ID patterns from which to store transactions.
  * `singleNode`: If `true`, configures the node to run in a standalone mode. Defaults to `true`.
  * `blockTimeInMs`: The target time, in milliseconds, between new blocks. Defaults to `5000`.

**Example: Start a single validator node for a local test network**

```
# options
network: local-test
index: 0
validator: true
validators: ['local-test-0']
singleNode: true

```

### **stopNode**

Stops the currently running `suc-node` process.

### **isNodeRunning**

Checks if a `suc-node` process is currently running on the system.

Output

Returns true if the node is running, false otherwise.

### create

Creates a new instance of the SafeUrChain API client, connecting it to a specific node's GraphQL API endpoint.

**Parameters**

* `apiUrl`: The URL of the SafeUrChain node's API. If not provided, it defaults to an internal address based on environment variables.

**Example**

```
# apiUrl
http://localhost:7878

```

## Writing and Reading Data

These are the primary functions for interacting with the blockchain's data ledger.

**write**

Writes a single data point as a new transaction to the blockchain. The data is timestamped and associated with a "measurement" and optional tags for easy retrieval.

**Parameters**

* `measurement`: A string name for the category of data being recorded (e.g., `'temperature_sensor'`).
* `data`: The data to be written. This can be any JSON-serializable value (number, string, object, array).
* `tags`: An optional object of key-value pairs to add metadata for filtering (e.g., `{ machineId: 'M-500', location: 'hall_B' }`).

**Example: Write a temperature reading from a specific machine**

```
# measurement
'temperature'
# data
25.5
# tags
{
  "machineId": "M-500",
  "unit": "celsius"
}

```

Output

A string representing the unique hash of the new transaction.

### **read**

Reads data from the blockchain by querying for a measurement and optionally filtering by tags.

**Parameters**

* `measurement`: The name of the measurement to read.
* `options`: An object for filtering the data.
  * `tags`: An object of key-value pairs to filter by. The query will return only data points that match all specified tags.

**Example: Read all temperature readings from machine M-500**

```
# measurement
'temperature'
# options
tags: {
  "machineId": "M-500"
}

```

Output

An array of data point objects, sorted by date. Each object includes the original value, the date, and blockchain-specific information like its transactionHash and blockHeight.

### **getDataPoint**

Retrieves a single, specific data point directly using its unique transaction hash.

**Parameters**

* `transactionHash`: The hash of the transaction, returned by the `write` function.

Output

An object containing the stored value, the date of the transaction, and its blockHash and blockHeight.

## Blockchain Inspection

These functions allow you to inspect the structure and status of the blockchain itself.

### **getTopBlock**

Retrieves the most recently added block (the "top" of the chain).

Output

An object containing the block's digest (its hash) and header information like timestamp, height, and the hash of the previousDigest.

### **getBlockAtHeight**

Retrieves a specific block by its height (its sequential number in the chain).

**Parameters**

* `height`: The block number to retrieve.

### **getBlocks**

Retrieves a range of blocks.

**Parameters**

* `from`: The starting block height.
* `to`: The ending block height.

### **getHashesInBlock**

Retrieves a list of all transaction hashes contained within a specific block.

**Parameters**

* `block`: The hash (digest) of the block to inspect.

### **getTelemetry**

Retrieves network telemetry information about the node, such as its connection status and information about its peers.

## Understanding Blockchain and SafeUrChain

At its core, a blockchain is a decentralized, distributed, and immutable digital ledger. Let's break that down:

* Decentralized/Distributed: Instead of being stored in one central location (like a traditional database), the ledger is copied and spread across a network of computers (called nodes).
* Immutable: Once a record (a "block") is added to the chain, it is cryptographically linked to the previous one. This makes it extremely difficult to alter or tamper with past transactions without being detected, creating a secure and trustworthy record of events.

The SafeUrChain project leverages this technology to enhance security and traceability in manufacturing and supply chain networks. In modern production, a single product relies on many suppliers. A security breach or a manipulated component at any point in this chain can have significant consequences. SafeUrChain aims to solve this by creating a secure, shared ledger where production and product data can be recorded and exchanged between different participants (suppliers, logistics, manufacturers) in a way that is tamper-proof and verifiable by all.

Please read [here](https://edocs.tib.eu/files/e01fb24/1881568261.pdf) for more details.
