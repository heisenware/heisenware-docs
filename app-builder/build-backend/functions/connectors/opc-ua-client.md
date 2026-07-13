# OPC UA client

The OPC UA client connector (`OpcuaClient`) communicates with OPC UA servers. It manages secure connections, browses the server's address space, reads and writes variables, calls methods, monitors data for changes, and transfers files. 

This connector requires [instance creation](./#instance-creation) before you can manage the connection and session with a server. For secure connections, generate certificates using `createCertificates`.

{% hint style="info" %}
See the [Video demo](#video-demo) at the bottom of this page.
{% endhint %}

## Security and certificates

{% hint style="info" %}
For unencrypted connections, skip directly to [Connection and lifecycle](#connection-and-lifecycle).
{% endhint %}

Secure OPC UA communication (`Sign` or `SignAndEncrypt`) requires a Public Key Infrastructure (PKI) to manage digital certificates and establish trust between the client and the server. Only create a PKI store when connecting with a `securityMode` of `Sign` or `SignAndEncrypt`. For unsecured connections, you can ignore certificate management.

### Self-signed and CA-signed certificates

`createCertificates` prepares the client for secure connections in one of two modes:

* **Self-signed (default)**: The client creates its own certificate without a signature from a certificate authority. This is the simplest approach and works best for most scenarios.
* **CA-signed (set `useCA` to `true`)**: The client creates its own Certificate Authority (CA) to sign the application and user certificates. Use this if the server trusts a single CA instead of multiple individual client certificates.

### Establishing trust

OPC UA security requires a two-way trust model:

* **The server trusts the client**: Configure the server to accept the client's public certificate.
* **The client trusts the server**: Add the server's public certificate to the client's trust list to prevent man-in-the-middle attacks.

Manage this process using `createCertificates` and `addServerCertificate`.

### Client PKI folder structure

`createCertificates` generates a standard `pki` folder structure:

* `pki/own/certs/`: The client's public certificates (for example, `heisenware_opcua_client.pem`). Provide this file to the server administrator.
* `pki/own/private/`: The client's private keys. Keep these keys secret. The client automatically restricts access permissions.
* `pki/trusted/certs/`: The client's trust list. Place the public certificates of trusted OPC UA servers in this folder. Use `addServerCertificate` to automate this.
* `pki/issuers/certs/`: In CA mode, this folder holds the public certificate of the CA that issues certificates. If an external CA signed the server certificate, add the server's public CA certificate here using `addCertificateAuthority`.

{% hint style="info" %}
#### PKI store location

The location of the `pki` folder depends on where the client runs:

* **Agent**: The folder resides in the same directory as your Agent executable.
* **Platform**: The folder resides under `/shared/certificates`. Click the refresh icon in the File Explorer to view it.
{% endhint %}

## Certificate management

These static functions manage secure connection setup.

### `createCertificates`

Initializes the local PKI store and creates a client certificate for the application and a user certificate for authentication. By default, this function creates self-signed certificates. Run this function once.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>useCA</code></td><td>Creates a local Certificate Authority to sign the certificates. Default false.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns `true` when the PKI structure and certificates are successfully created.

### `addServerCertificate`

Adds a server's public certificate to the client's trust list to establish a secure connection.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>certificateInput</code></td><td>The server's public certificate, specified as a file path or PEM string.</td><td>string</td></tr><tr><td><code>certificateName</code></td><td>An optional filename for the certificate. Required if providing a PEM string.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` when the certificate is saved successfully.

#### Examples

**Example 1: Add a certificate from a file**

{% hint style="info" %}
If the client runs on the platform (not in Agent mode), upload the server certificate using the File Explorer, drag the file to this parameter, and then delete it from the uploads folder.
{% endhint %}

```yaml
# certificateInput
/path/to/downloaded/server_cert.pem
```

**Example 2: Add a certificate from a string**

```yaml
# certificateInput
'-----BEGIN CERTIFICATE-----\nMIIC...etc...\n-----END CERTIFICATE-----'
# certificateName
my_trusted_server.pem
```

### `addCertificateAuthority`

Adds a server's public CA certificate to the `issuers` directory of the PKI store. Use this if a Certificate Authority signed the server certificate.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>certificateInput</code></td><td>The CA's public certificate, specified as a file path or PEM string.</td><td>string</td></tr><tr><td><code>certificateName</code></td><td>An optional filename for the CA certificate. Required if providing a PEM string.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` when the certificate is saved successfully.

## Connection and lifecycle

### `create`

Creates an OPC UA client instance. The security settings determine how the client connects.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>securityMode</code></td><td>The security mode to use (<code>None</code>, <code>Sign</code>, or <code>SignAndEncrypt</code>). Default <code>None</code>.</td><td>string</td></tr><tr><td></td><td><code>securityPolicy</code></td><td>The encryption algorithm to use (such as <code>Basic256Sha256</code>). Default <code>None</code>.</td><td>string</td></tr><tr><td></td><td><code>automaticallyAcceptUnknownCertificate</code></td><td>Disables server validation. Default false.</td><td>boolean</td></tr></tbody></table>

{% hint style="danger" %}
#### Destructive action

Never set <code>automaticallyAcceptUnknownCertificate</code> to <code>true</code> in production. This disables server validation and exposes the system to man-in-the-middle attacks.
{% endhint %}

#### Examples

**Example 1: Create a client for an unsecured connection**

```yaml
# (No arguments needed)
```

**Example 2: Create a client for a secure connection**

```yaml
# options
securityMode: SignAndEncrypt
securityPolicy: Basic256Sha256
```

### `connect`

Connects to an OPC UA server.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>endpointUrl</code></td><td></td><td>The full URL of the server endpoint (such as <code>opc.tcp://my-server.com:4840</code>).</td><td>string</td></tr><tr><td><code>userIdentity</code></td><td><code>username</code></td><td>The username for authentication.</td><td>string</td></tr><tr><td></td><td><code>password</code></td><td>The password for authentication.</td><td>string</td></tr><tr><td></td><td><code>userCertificate</code></td><td>The user certificate for certificate-based authentication.</td><td>string</td></tr><tr><td></td><td><code>userPrivateKey</code></td><td>The private key belonging to the user certificate.</td><td>string</td></tr><tr><td></td><td><code>useDefaultUserCertificate</code></td><td>Set to <code>true</code> to authenticate with the user certificate created by <code>createCertificates</code>. Default false.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns `true` when the connection succeeds. Throws an error on failure.

#### Examples

**Example 1: Unsecured, anonymous connection**

```yaml
# endpointUrl
opc.tcp://my-server.com:4840
```

**Example 2: Secure, anonymous connection**

```yaml
# endpointUrl
opc.tcp://my-secure-server.com:4840
```

**Example 3: Secure connection with username and password**

```yaml
# endpointUrl
opc.tcp://my-secure-server.com:4840
# userIdentity
username: myuser
password: mysecretpassword
```

**Example 4: Secure connection with a user certificate**

```yaml
# endpointUrl
opc.tcp://my-secure-server.com:4840
# userIdentity
useDefaultUserCertificate: true
```

### `disconnect`

Disconnects from the OPC UA server and closes the active session.

#### Parameters

None.

#### Output

Returns `true` on successful disconnection.

### `isConnected`

Checks whether the client is connected to the server.

#### Parameters

None.

#### Output

Returns `true` if connected, or `false` if disconnected.

### `delete`

Removes the client instance and closes the connection.

{% hint style="danger" %}
#### Destructive action

Deleting an instance removes its configuration. To communicate with the server again, you must create a new instance.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` on successful deletion. Throws an error if the operation fails.

## Browsing

### `browse`

Browses a node address on the server.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td>The <code>nodeId</code> or browse path (such as <code>/0:Objects/2:Demo</code>) where browsing starts.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of objects representing each node found, including its name, ID, and class.

#### Example

```yaml
# address
/0:Objects/2:Demo
```

### `browseObjects`

Browses the server's Objects folder.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>path</code></td><td>The browse path starting inside the Objects folder.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of objects representing each node found.

#### Example

```yaml
# path
2:Demo/2:Dynamic/2:Scalar
```

### `browseTypes`

Browses the server's Types folder to explore the data type hierarchy.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>path</code></td><td>An optional browse path starting inside the Types folder.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of objects representing each node found.

#### Example

```yaml
# path
0:BaseObjectType/0:FolderType
```

### `browseViews`

Browses the server's Views folder.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>path</code></td><td>An optional browse path starting inside the Views folder.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of objects representing each node found.

#### Example

```yaml
# path
0:Server
```

## Reading and writing

### `readNode`

Reads all attributes of an OPC UA node.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td>The <code>nodeId</code> or browse path of the node to read.</td><td>string</td></tr></tbody></table>

#### Output

Returns a JSON object containing the node's attributes, status code, and timestamps.

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

**Example 1: Read using a nodeId**

```yaml
# address
ns=2;s=Demo.Dynamic.Int32
```

**Example 2: Read using a browse path**

```yaml
# address
/0:Objects/2:Demo/2:Dynamic/2:Int32
```

### `readVariable`

Reads the value of a single variable from the server.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td>The <code>nodeId</code> or browse path of the variable to read.</td><td>string</td></tr></tbody></table>

#### Output

Returns the raw value of the variable.

#### Examples

**Example 1: Read using a nodeId**

```yaml
# address
ns=2;s=Demo.Dynamic.Int32
```

**Example 2: Read using a browse path**

```yaml
# address
/0:Objects/2:Demo/2:Dynamic/2:Int32
```

### `writeVariable`

Writes a new value to a server variable. Converts the value to the required OPC UA data type before writing. If the variable is read-only, this function throws an error.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td></td><td>The <code>nodeId</code> or browse path of the variable.</td><td>string</td></tr><tr><td><code>value</code></td><td></td><td>The new value to set.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>skipTypeChecking</code></td><td>If <code>true</code>, the client skips reading metadata and permissions before writing. Default false.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns `null` on a successful write. Throws an error on failure.

#### Example

```yaml
# address
ns=2;s=Demo.Dynamic.Int32
# value
42
```

### `callMethod`

Invokes a method on an OPC UA object.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>methodAddress</code></td><td>The <code>nodeId</code> or browse path of the method to call.</td><td>string</td></tr><tr><td><code>inputValues</code></td><td>An array of input arguments. Default [].</td><td>array</td></tr></tbody></table>

#### Output

Returns an array containing the output arguments from the method call.

#### Example

```yaml
# methodAddress
ns=2;s=Demo.Methods.Multiply
# inputValues
  - 5
  - 10
```

## Monitoring

### `monitorNode`

Subscribes to changes of an OPC UA node. Triggers the callback on every change.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td></td><td>The <code>nodeId</code> or browse path of the node.</td><td>string</td></tr><tr><td><code>listener</code></td><td></td><td>Callback evaluated on every change. Receives a JSON object representing the node's <code>DataValue</code>.</td><td>callback</td></tr><tr><td><code>options</code></td><td><code>samplingInterval</code></td><td>How often the server checks for changes, in milliseconds. Default 1000.</td><td>integer</td></tr><tr><td></td><td><code>queueSize</code></td><td>Maximum number of queued notifications on the server. Default 100.</td><td>integer</td></tr><tr><td></td><td><code>discardOldest</code></td><td>If <code>true</code>, drops the oldest notification when the queue is full. Default true.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns a unique monitored item ID string. Use this ID with `stopMonitor` to terminate the subscription.

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

Subscribes to value changes of a variable. Triggers the callback with the new value on every change.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td></td><td>The <code>nodeId</code> or browse path of the variable.</td><td>string</td></tr><tr><td><code>listener</code></td><td></td><td>Callback evaluated on every change. Receives the raw value of the variable.</td><td>callback</td></tr><tr><td><code>options</code></td><td><code>samplingInterval</code></td><td>How often the server checks for changes, in milliseconds. Default 1000.</td><td>integer</td></tr><tr><td></td><td><code>queueSize</code></td><td>Maximum number of queued notifications on the server. Default 100.</td><td>integer</td></tr><tr><td></td><td><code>discardOldest</code></td><td>If <code>true</code>, drops the oldest notification when the queue is full. Default true.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns a unique monitored item ID string. Use this ID with `stopMonitor` to terminate the subscription.

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

Stops an active subscription for a monitored item.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>nodeId</code></td><td>The monitored item ID string returned by the monitoring function.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` when the subscription terminates successfully. Throws an error on failure.

#### Example

```yaml
# nodeId
ns=2;s=Demo.Dynamic.UInt16
```

## File transfer

### `browseDirectory`

Recursively browses a directory structure on the server.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td>The <code>nodeId</code> or browse path of the directory node.</td><td>string</td></tr></tbody></table>

#### Output

Returns a nested array of objects representing the directory structure.

### `readFile`

Reads the contents of a file on the server.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td></td><td>The <code>nodeId</code> or browse path of the file.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>encoding</code></td><td>The encoding of the returned content (such as <code>ascii</code> or <code>utf8</code>). Default <code>base64</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns the file content as a string in the requested encoding.

#### Example

```yaml
# address
ns=2;s=Demo.Files.TextFile
```

### `writeFile`

Creates a file on the server and uploads content to it.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>folderAddress</code></td><td>The <code>nodeId</code> or browse path of the target folder.</td><td>string</td></tr><tr><td><code>newFileName</code></td><td>The name of the new file.</td><td>string</td></tr><tr><td><code>pathOrBase64</code></td><td>The file content, specified as a base64 string or local file path.</td><td>string</td></tr></tbody></table>

#### Output

Returns the <code>nodeId</code> of the newly created file on the server.

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

Deletes a file on the server.

{% hint style="danger" %}
#### Destructive action

Deleting a file permanently removes it from the server. This action cannot be undone.
{% endhint %}

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>folderAddress</code></td><td>The <code>nodeId</code> or browse path of the folder containing the file.</td><td>string</td></tr><tr><td><code>fileName</code></td><td>The name of the file to delete.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` when the file is successfully deleted. Throws an error on failure.

#### Example

```yaml
# folderAddress
ns=2;s=Demo.Files
# fileName
report.txt
```

## Event listeners

### `listenToEvents`

Registers a callback to receive client lifecycle events (such as `Connected`, `Connection Lost`, or `Session Closed`).

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>Callback evaluated on client lifecycle events. Receives a string representing the event type.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `true` on successful registration.

## Deprecated functions

The following functions are maintained for backward compatibility. Update your App logic to use the recommended replacements.

| Deprecated function | Use instead |
| :--- | :--- |
| `readVariableValue` | `readVariable` |
| `writeVariableValue` | `writeVariable` |

## Tips and tricks

Establishing a secure certificate-based connection is the primary point of failure in OPC UA. An error usually indicates a broken link in the chain of trust. Use these troubleshooting steps to resolve common issues.

### Switch an existing instance to a secure connection

To switch an unsecured instance to a secure connection, remove the instance and create it again. Right-click the existing active instance (green in the UI), click **Remove**, and then trigger the `create` function with your new security configuration.

### Server rejects the client certificate

If the client attempts to connect and the server immediately closes the connection (often showing an error such as `The connection has been disconnected by third party`), the server does not trust the client's application certificate.

To resolve this (using Prosys Simulation Server as an example):

1. Attempt to connect the client to the Prosys server. This fails but registers the client's certificate with the server.
2. Open the **Certificates** tab in the Prosys Simulation Server UI.
3. Locate the client certificate (`HeisenwareOPCUAClient`) in the **Rejected Certificates** list.
4. Right-click the certificate and select **Trust** to move it to the **Trusted Certificates** list.
5. Connect again.

In CA mode, add the CA's public certificate (`heisenware_ca_cert.pem`) to the server's PKI issuers directory (`pki/CA/issuers/certs/`) instead of trusting individual certificates.

### Client rejects the server certificate

If the client does not trust the server, it throws a certificate verification error.

To resolve this, add the server's public certificate to the client's trust store:

1. Export the server's public certificate file (such as exporting from the Prosys **Certificates** tab).
2. Use `addServerCertificate` to save the file to the client's `pki/trusted/certs` folder.

### SAN mismatch

Even with established trust, the client rejects the connection if the hostname in the endpoint URL does not match any address in the server certificate's Subject Alternative Name (SAN) field.

To resolve this (using Prosys as an example):

1. If connecting to `opc.tcp://localhost:53530` fails, inspect the certificate. If the SAN field only lists `DNS:lenovo`, you must match that hostname.
2. Update the endpoint URL to use the correct hostname, such as `opc.tcp://lenovo:53530/OPCUA/SimulationServer`.

### Certificate revocation list failures

If a server certificate points to a Certificate Revocation List (CRL), the client attempts to download this list to verify validity. In isolated networks without internet access, this lookup fails and blocks the connection.

To resolve this, download the CRL file manually and place it in the client's `pki/issuers/crl` or `pki/trusted/crl` folder. If you generated the server certificate with a custom CA, you can create an empty CRL file to satisfy this check.

### Application and user authentication

These two certificate types serve distinct purposes:

1. **Application certificate (`heisenware_opcua_client.pem`)**: Identifies the application to establish the secure, encrypted channel between client and server. This is mandatory for secure connections.
2. **User certificate (`heisenware_opcua_user.pem`)**: Identifies the user to handle authentication and permissions after the secure channel is established. This is optional.

User certificate authentication requires server-side configuration. The server administrator must create the user account and map it explicitly to the user's public certificate.

### Server and client clocks out of sync

OPC UA blocks secure connections if the clocks of the client and server differ substantially (for example, by an hour). When this occurs, the client logs a warning.

## Video demo

Watch the video to learn how to connect to an OPC UA server, read, record, and visualize data.

{% embed url="https://www.youtube.com/watch?t=15s&v=7TNHk2eqRWc" %}
