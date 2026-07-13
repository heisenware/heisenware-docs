# OPC UA client

The OPC UA client communicates with OPC UA servers. It handles secure connections, browses the server's address space, reads and writes variables, calls methods, monitors data for changes, and transfers files.

Create an instance to manage the connection and session with a server. For secure connections, generate certificates first using `createCertificates`.

{% hint style="info" %}
Find a [video tutorial](opc-ua-client.md#video-demo) covering the basics at the bottom of this page.
{% endhint %}

## Security and certificates

{% hint style="info" %}
#### Skip this section for unsecured connections

If you use unencrypted communication between client and server (not recommended in production) and no certificate-based authentication, jump directly to [certificate management](opc-ua-client.md#certificate-management) or [instance and connection](opc-ua-client.md#instance-and-connection). Otherwise, read on to understand the OPC UA security concepts and our implementation.
{% endhint %}

Secure OPC UA communication (`Sign` or `SignAndEncrypt`) requires a Public Key Infrastructure (PKI): a system of folders and files that manages digital certificates to establish trust between client and server. You only need a PKI store if you connect with a `securityMode` of `Sign` or `SignAndEncrypt`. For unsecured connections (`securityMode: None`), ignore the certificate management functions.

### Self-signed versus CA-signed certificates

The `createCertificates` function prepares your client for secure connections in one of two modes:

1. Self-signed (default): the client creates its own certificate, not signed by a higher authority. This is the simplest approach and recommended for most scenarios.
2. CA-signed (set `useCA: true`): the client first creates its own mini Certificate Authority (CA) and uses it to sign its application and user certificates. Use this when a server is configured to trust a single CA instead of many individual client certificates.

### Establishing trust

OPC UA security uses a two-way trust model:

* The server must trust your client: a server administrator configures the server to accept your client's public certificate.
* Your client must trust the server: to prevent man-in-the-middle attacks, your client needs the server's public certificate in its own trust list.

The `createCertificates` and `addServerCertificate` functions manage this process from the client's side.

### The client's PKI folder structure

Running `createCertificates` generates a standard folder structure named `pki`. The key folders are:

* `pki/own/certs/`: your client's public certificates (e.g. `heisenware_opcua_client.pem`). Give this file to the server administrator.
* `pki/own/private/`: your client's private keys. Keep these secret. The code automatically restricts their file permissions to the owner.
* `pki/trusted/certs/`: the client's trust list. Place the public certificates of all OPC UA servers you want to connect to securely in this folder. The `addServerCertificate` function automates this.
* `pki/issuers/certs/`: in CA mode, the public certificate of the CA that issues certificates. When an external CA signed the server certificate, add the server's public CA certificate here using `addCertificateAuthority`.

{% hint style="info" %}
#### Location of the PKI store

The location of the `pki` store depends on where the OPC UA client runs.

**Agent**: the folder sits in the same directory as your Agent executable.\
**Platform**: you find it under `(/shared/)certificates` (may need a refresh button click in the UI).
{% endhint %}

## Certificate management

These static functions handle the one-time setup of a secure connection.

### `createCertificates`

Initializes the local PKI store and creates a client certificate (for the application) and a user certificate (for user authentication). By default the certificates are self-signed. Run this once.

#### Parameters

<table><thead><tr><th width="130">Input</th><th width="170">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>useCA</code></td><td>If <code>true</code>, creates a local Certificate Authority and uses it to sign the certificates. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns `true` on successful creation of the PKI structure and certificates.

### `addServerCertificate`

Adds a server's public certificate to your client's trust list, allowing your client to establish a secure connection with it.

#### Parameters

<table><thead><tr><th width="190">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>certificateInput</code></td><td>The server's public certificate, either as a file path or as the PEM content string itself.</td><td>string</td></tr><tr><td><code>certificateName</code></td><td>Optional filename for the certificate. Required if you provide the certificate as a PEM string. With a file path, the original name is kept.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` if the certificate was saved successfully.

#### Examples

Example 1: adding a certificate from a file

{% hint style="info" %}
When the OPC UA client runs on-premises and not in Agent mode, upload the server certificate using the [File Explorer](../../file-explorer.md) first. Then drag the file from there to the input of this function. Afterwards you can delete the file from the `uploads` folder.
{% endhint %}

```yaml
# certificateInput
'/path/to/downloaded/server_cert.pem'
```

Example 2: adding a certificate from a string

```yaml
# certificateInput
'-----BEGIN CERTIFICATE-----\nMIIC...etc...\n-----END CERTIFICATE-----'
# certificateName
'my_trusted_server.pem'
```

### `addCertificateAuthority`

Adds a server's public CA certificate to the `issuers` section of the PKI store. Use this when an explicit Certificate Authority signed the server's certificates (the file often has "CA" in its name). Works like `addServerCertificate`.

#### Parameters

<table><thead><tr><th width="190">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>certificateInput</code></td><td>The server's public CA certificate, either as a file path or as the PEM content string itself.</td><td>string</td></tr><tr><td><code>certificateName</code></td><td>Optional filename for the CA certificate. Required if you provide the certificate as a PEM string. With a file path, the original name is kept.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` if the certificate was saved successfully.

## Instance and connection

### `create`

Constructs an OPC UA client instance. The security settings you provide here determine how the client attempts to connect.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="260">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>securityMode</code></td><td><code>None</code>, <code>Sign</code>, or <code>SignAndEncrypt</code>. Default <code>None</code>.</td><td>string</td></tr><tr><td></td><td><code>securityPolicy</code></td><td>The encryption algorithm to use (e.g. <code>Basic256Sha256</code>). Default <code>None</code>.</td><td>string</td></tr><tr><td></td><td><code>automaticallyAcceptUnknownCertificate</code></td><td>Disables server trust checking. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

{% hint style="danger" %}
#### Never disable server validation in production

Never set `automaticallyAcceptUnknownCertificate: true` in a production environment. This disables server validation and exposes you to man-in-the-middle attacks. Use it for debugging only.
{% endhint %}

#### Examples

Example 1: create a client for an unsecured connection

```yaml
# (No arguments needed)
```

Example 2: create a client for a secure connection

```yaml
# options
securityMode: SignAndEncrypt
securityPolicy: Basic256Sha256
```

### `connect`

Connects to an OPC UA server using the security settings defined in `create` and the user identity provided here.

#### Parameters

<table><thead><tr><th width="140">Input</th><th width="240">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>endpointUrl</code></td><td></td><td>The full URL of the server endpoint (e.g. <code>opc.tcp://my-server.com:4840</code>).</td><td>string</td></tr><tr><td><code>userIdentity</code></td><td><code>username</code></td><td>Username for username/password authentication.</td><td>string</td></tr><tr><td></td><td><code>password</code></td><td>Password for username/password authentication.</td><td>string</td></tr><tr><td></td><td><code>userCertificate</code></td><td>A user certificate for certificate-based user authentication.</td><td>string</td></tr><tr><td></td><td><code>userPrivateKey</code></td><td>The private key belonging to the user certificate.</td><td>string</td></tr><tr><td></td><td><code>useDefaultUserCertificate</code></td><td>Set to <code>true</code> to authenticate with the user certificate created by <code>createCertificates</code>. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

The entire `userIdentity` input is optional. Leave it empty for an anonymous connection.

#### Output

Returns `true` if the connection was established successfully.

#### Examples

Example 1: unsecured, anonymous connection

Requires no PKI setup and no user identity.

```yaml
# (In `create` function)
# (No arguments)

# (In `connect` function)
# endpointUrl
opc.tcp://my-server.com:4840
```

Example 2: secure, anonymous connection

Requires the PKI setup (`createCertificates` and `addServerCertificate`) but no user identity.

```yaml
# (In `create` function)
# options
securityMode: SignAndEncrypt
securityPolicy: Basic256Sha256

# (In `connect` function)
# endpointUrl
opc.tcp://my-secure-server.com:4840
```

Example 3: secure connection with username and password

Requires the PKI setup for a secure channel, plus username and password for user authentication.

```yaml
# (In `create` function)
# options
securityMode: SignAndEncrypt
securityPolicy: Basic256Sha256

# (In `connect` function)
# endpointUrl
opc.tcp://my-secure-server.com:4840
# userIdentity
username: myuser
password: mysecretpassword
```

Example 4: secure connection with a user certificate

The most secure method, using certificates for both channel security and user authentication.

```yaml
# (In `create` function)
# options
securityMode: SignAndEncrypt
securityPolicy: Basic256Sha256

# (In `connect` function)
# endpointUrl
opc.tcp://my-secure-server.com:4840
# userIdentity
useDefaultUserCertificate: true
```

### `disconnect`

Closes the active session and disconnects from the OPC UA server.

#### Parameters

None.

#### Output

Returns `true` on a successful disconnection.

### `isConnected`

Checks if the client has a valid and active channel with the server.

#### Parameters

None.

#### Output

Returns `true` if the client is connected, otherwise `false`.

### `delete`

Removes the instance and frees its resources, including the connection to the server.

{% hint style="danger" %}
Deleting an instance removes its configuration. To connect again, trigger `create` and `connect` anew.
{% endhint %}

## Browsing

### `browse`

The generic, non-recursive browse function. It starts from any node address on the server. The more specific functions like `browseObjects` are convenience wrappers around this one.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td>The <code>nodeId</code> or a full browse path (e.g. <code>/0:Objects/2:Demo</code>) from which to start.</td><td>string</td></tr></tbody></table>

#### Output

An array of objects, one per found node, each containing its `browseName`, `nodeId`, and `nodeClass`.

#### Example

```yaml
# address
/0:Objects/2:Demo
```

### `browseObjects`

Performs a non-recursive browse of the server's `Objects` folder. You can specify a deeper path to start from.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>path</code></td><td>The browse path, starting inside the <code>Objects</code> folder. Separate path items with <code>/</code>, each in <code>namespaceIndex:BrowseName</code> format (e.g. <code>2:Demo/2:Dynamic</code>).</td><td>string</td></tr></tbody></table>

#### Output

An array of objects, one per found node, each containing its `browseName`, `nodeId`, and `nodeClass`.

#### Example

```yaml
# path
2:Demo/2:Dynamic/2:Scalar
```

### `browseTypes`

Performs a non-recursive browse of the server's `Types` folder. Useful for exploring the server's data type hierarchy.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>path</code></td><td>Optional browse path to start from within the <code>Types</code> folder. If omitted, browses from the folder root.</td><td>string</td></tr></tbody></table>

#### Output

An array of objects, one per found data type node.

#### Example

```yaml
# path
0:BaseObjectType/0:FolderType
```

### `browseViews`

Performs a non-recursive browse of the server's `Views` folder. Views are predefined, filtered collections of nodes.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>path</code></td><td>Optional browse path to start from within the <code>Views</code> folder. If omitted, browses from the folder root.</td><td>string</td></tr></tbody></table>

#### Output

An array of objects, one per found node within the specified view.

#### Example

```yaml
# path
0:Server
```

## Reading and writing

### `readNode`

Reads all attributes of a specific OPC UA node and returns a detailed data structure. This is more comprehensive than `readVariable`, which only fetches the node's value.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td>The <code>nodeId</code> or a valid browse path of the node to read.</td><td>string</td></tr></tbody></table>

#### Output

A JSON object representing the node's `DataValue`, including the value, status code, and server/source timestamps. For example:

```json
{
  "value": {
    "dataType": "Int32",
    "value": 12345
  },
  "statusCode": {
    "name": "Good",
    "value": 0
  },
  "serverTimestamp": "2025-07-11T08:52:34.000Z",
  "sourceTimestamp": "2025-07-11T08:52:34.000Z"
}
```

#### Examples

Example 1: read using a `nodeId`

```yaml
# address
ns=2;s=Demo.Dynamic.Int32
```

Example 2: read using a browse path

```yaml
# address
/0:Objects/2:Demo/2:Dynamic/2:Int32
```

### `readVariable`

Reads the value of a single variable from the server. A convenience function that extracts just the value from the node's data.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td>The address of the variable, either its <code>nodeId</code> (recommended) or a full browse path.</td><td>string</td></tr></tbody></table>

#### Output

The raw value of the variable (e.g. a number, string, boolean, or array).

#### Examples

Example 1: read using a `nodeId`

```yaml
# address
ns=2;s=Demo.Dynamic.Int32
```

Example 2: read using a browse path

The leading `/0:Objects` is required for objects. Other (less common) starts are `/0:Views` or `/0:Types`. The number before the colon is the namespace index.

```yaml
# address
/0:Objects/2:Demo/2:Dynamic/2:Int32
```

### `writeVariable`

Writes a new value to a variable on the server. Before writing, the function reads the variable's data type and access level from the server, checks that the variable is writable, and converts the value to the required OPC UA data type. If the variable is not writable, it throws an error.

#### Parameters

<table><thead><tr><th width="120">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td></td><td>The <code>nodeId</code> or browse path of the variable to write to.</td><td>string</td></tr><tr><td><code>value</code></td><td></td><td>The new value to set.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>skipTypeChecking</code></td><td>If <code>true</code>, skips reading metadata and permissions from the server before writing. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns `null` on a successful write or throws an error on failure.

#### Example

```yaml
# address
ns=2;s=Demo.Dynamic.Int32
# value
42
```

### `callMethod`

Invokes a method on an OPC UA object on the server. Input arguments are automatically converted to the data types the method defines.

#### Parameters

<table><thead><tr><th width="170">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>methodAddress</code></td><td>The <code>nodeId</code> or browse path of the method to call.</td><td>string</td></tr><tr><td><code>inputValues</code></td><td>An array of values to pass as input arguments. Default <code>[]</code>.</td><td>array</td></tr></tbody></table>

#### Output

An array containing the output arguments returned by the method call.

#### Example

This example calls a method that takes two input arguments.

```yaml
# methodAddress
ns=2;s=Demo.Methods.Multiply
# inputValues
[ 5, 10 ]
```

## Monitoring

### `monitorNode`

Subscribes to changes of an entire OPC UA node. The callback fires with the full node data object (value, status, and timestamps) whenever the server detects a change.

#### Parameters

<table><thead><tr><th width="120">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td></td><td>The <code>nodeId</code> or browse path of the node to monitor.</td><td>string</td></tr><tr><td><code>listener</code></td><td></td><td>Callback that receives the full data object on every change.</td><td>callback</td></tr><tr><td><code>options</code></td><td><code>samplingInterval</code></td><td>How often (in milliseconds) the server checks for changes. Default <code>1000</code>.</td><td>integer</td></tr><tr><td></td><td><code>queueSize</code></td><td>Maximum number of queued notifications on the server. Default <code>100</code>.</td><td>integer</td></tr><tr><td></td><td><code>discardOldest</code></td><td>If <code>true</code>, drops the oldest notification when the queue is full. Default <code>true</code>.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns a unique `nodeId` string that identifies this monitored item. Use it to stop the monitoring with `stopMonitor`.

#### Example

```yaml
# address
ns=2;s=Demo.Dynamic.UInt16
# listener
<callback>
# options
samplingInterval: 5000
```

### `monitorVariable`

Subscribes to value changes of a specific variable. The callback fires with the new value every time the server reports one.

#### Parameters

<table><thead><tr><th width="120">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td></td><td>The <code>nodeId</code> or browse path of the variable to monitor.</td><td>string</td></tr><tr><td><code>listener</code></td><td></td><td>Callback that receives the new value on every change.</td><td>callback</td></tr><tr><td><code>options</code></td><td><code>samplingInterval</code></td><td>How often (in milliseconds) the server checks for changes. Default <code>1000</code>.</td><td>integer</td></tr><tr><td></td><td><code>queueSize</code></td><td>Maximum number of queued notifications on the server. Default <code>100</code>.</td><td>integer</td></tr><tr><td></td><td><code>discardOldest</code></td><td>If <code>true</code>, drops the oldest notification when the queue is full. Default <code>true</code>.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns a unique `nodeId` string that identifies this monitored item. Use it to stop the monitoring with `stopMonitor`.

#### Example

```yaml
# address
ns=2;s=Demo.Dynamic.UInt16
# listener
<callback>
# options
samplingInterval: 5000
```

### `stopMonitor`

Terminates an active subscription for a monitored item.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>nodeId</code></td><td>The identifier string returned by a previous <code>monitorNode</code> or <code>monitorVariable</code> call.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` if the subscription was terminated successfully.

#### Example

```yaml
# nodeId
ns=2;s=Demo.Dynamic.UInt16
```

## File transfer

### `browseDirectory`

Recursively browses a file-system-like directory structure exposed by an OPC UA server.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td>The <code>nodeId</code> or browse path of the starting directory node.</td><td>string</td></tr></tbody></table>

#### Output

A nested array of objects representing the directory structure.

### `readFile`

Reads the entire content of a file exposed by the OPC UA server's file transfer feature.

#### Parameters

<table><thead><tr><th width="120">Input</th><th width="150">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td></td><td>The <code>nodeId</code> or browse path of the file node on the server.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>encoding</code></td><td>The encoding of the returned content, e.g. <code>ascii</code>, <code>utf8</code>. Default <code>base64</code>.</td><td>string</td></tr></tbody></table>

#### Output

The complete content of the file as a string in the requested encoding.

#### Example

```yaml
# address
ns=2;s=Demo.Files.TextFile
```

### `writeFile`

Creates a new file in a specified folder on the server and uploads content to it.

#### Parameters

<table><thead><tr><th width="170">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>folderAddress</code></td><td>The <code>nodeId</code> or browse path of the folder where the file will be created.</td><td>string</td></tr><tr><td><code>newFileName</code></td><td>The name for the new file.</td><td>string</td></tr><tr><td><code>pathOrBase64</code></td><td>The content to upload, either as a base64 string or a local file system path.</td><td>string</td></tr></tbody></table>

#### Output

The `nodeId` of the newly created file on the server.

#### Example

```yaml
# folderAddress
ns=2;s=Demo.Files
# newFileName
report.txt
# pathOrBase64
SGVsbG8sIFdvcmxkIQ==
```

### `deleteFile`

Deletes a file from a folder on the OPC UA server.

{% hint style="danger" %}
This permanently removes the file on the server. The action cannot be undone.
{% endhint %}

#### Parameters

<table><thead><tr><th width="170">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>folderAddress</code></td><td>The <code>nodeId</code> or browse path of the folder containing the file.</td><td>string</td></tr><tr><td><code>fileName</code></td><td>The name of the file to delete.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` if the file was deleted successfully.

#### Example

```yaml
# folderAddress
ns=2;s=Demo.Files
# fileName
report.txt
```

## Events

### `listenToEvents`

Registers a callback that receives lifecycle events from the client, such as `Connected`, `Connection Lost`, or `Session Closed`. Useful for monitoring the health of the connection.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>Callback that receives the event strings.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `true`.

## Deprecated functions

The following functions still appear in the Function Explorer for backwards compatibility. Use their replacements in new flows.

<table><thead><tr><th width="250">Deprecated function</th><th>Use instead</th></tr></thead><tbody><tr><td><code>readVariableValue</code></td><td><code>readVariable</code></td></tr><tr><td><code>writeVariableValue</code></td><td><code>writeVariable</code></td></tr></tbody></table>

## Tips and tricks

Establishing a secure certificate-based connection is the most common point of failure in OPC UA. An error almost always means a broken link in the chain of trust. This section covers the most common pitfalls.

### Switching an existing instance to a secure connection

Security settings are part of the `create` function. If you created an instance with an unsecured configuration and now want a secure connection, re-create the instance: right-click the existing instance (green if alive) and click `REMOVE`. It turns yellow (not yet available). Changes to the `create` function input apply when you trigger it again.

### Server rejects the client certificate

The client attempts to connect and the server immediately closes the connection, often with a generic error like `"The connection has been disconnected by third party"`. The server does not trust your client's application certificate.

How to fix (Prosys example):

1. Attempt to connect your client to the Prosys server. This fails but makes Prosys aware of your client's certificate.
2. In the Prosys Simulation Server UI, open the Certificates tab.
3. Your client's certificate (`HeisenwareOPCUAClient`) appears in the Rejected Certificates list.
4. Right-click your certificate and select Trust. It moves to the Trusted Certificates list.
5. Connect again. It now succeeds.

In CA mode, instead of trusting the client certificate directly, place your CA's public certificate (`heisenware_ca_cert.pem`) into the Prosys PKI folder at `pki/CA/issuers/certs/`.

### Client rejects the server certificate

The reverse problem: your client does not trust the server. You get a clear error message: `"server Certificate verification failed"`. For security, the client only connects to servers it knows.

How to fix: add the server's public certificate to your client's trust store.

1. Obtain the server's public certificate file (e.g. export it from the Prosys Certificates tab).
2. Use `addServerCertificate` to add it to your client's `pki/trusted/certs` folder.

### SAN mismatch

A very common reason for a `"server Certificate verification failed"` error, even when trust is established. A certificate's Subject Alternative Name (SAN) field lists all hostnames and IP addresses for which it is valid. On connection, the client strictly checks that the hostname in your endpoint URL (e.g. `opc.tcp://lenovo:4840`) appears in the server certificate's SAN list. If not, it rejects the connection.

How to fix (Prosys example):

1. Diagnose: connecting to `opc.tcp://localhost:53530` fails. Checking the Prosys certificate's SAN field with `openssl` shows it only lists `DNS:lenovo`.
2. Fix: change your endpoint URL to match the certificate, e.g. `opc.tcp://lenovo:53530/OPCUA/SimulationServer`. The connection now succeeds.

### Certificate revocation list failures

An advanced and subtle issue. A certificate may contain a URL pointing to a Certificate Revocation List (CRL). A secure client tries to download this list to verify the server's certificate has not been revoked. In an isolated network without internet access, the download fails and so does validation.

How to fix: manually download the CRL file and place it in the client's `pki/issuers/crl` or `pki/trusted/crl` folder. If you created the server's certificate with your own CA, you can generate an empty CRL file to satisfy the check.

### Application versus user authentication

Two different certificate types are in play:

1. Application certificate (`heisenware_opcua_client.pem`): identifies your application. It creates the secure, encrypted channel between client and server. Mandatory for a secure connection.
2. User certificate (`heisenware_opcua_user.pem`): identifies a human user. It handles login and permissions after the secure channel is established. Optional.

User certificate authentication requires extra configuration on the server. For Prosys, this feature is only available in the Professional Edition. The server administrator must create a user and explicitly map that user account to the user's public certificate.

### Server and client clocks out of sync

When the internal clocks of server and client differ substantially (e.g. by an hour), OPC UA's internal security requirements may deny the connection. In that case the client's logs show a clear warning stating this fact.

## Video demo

Watch the video to learn how to connect to an OPC UA server and read, record, and visualize OPC UA data within Heisenware.

{% embed url="https://www.youtube.com/watch?t=15s&v=7TNHk2eqRWc" %}
