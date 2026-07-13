# OPC UA client

The OPC UA client communicates with OPC UA servers. It handles secure connections, browses the server's address space, reads and writes variables, calls methods, monitors data for changes, and transfers files. The code class name is `OpcuaClient`. 

Create an instance of the OPC UA client to manage the connection and session with a server. For secure connections, generate certificates first using `createCertificates`.

{% hint style="info" %}
See the [Video demo](#video-demo) at the bottom of this page.
{% endhint %}

## Security and certificates

{% hint style="info" %}
For unencrypted connections, skip directly to [Certificate management](#certificate-management) or [Instance and connection](#instance-and-connection).
{% endhint %}

Secure OPC UA communication (`Sign` or `SignAndEncrypt`) requires a Public Key Infrastructure (PKI): a system of folders and files that manages digital certificates to establish trust between client and server. Create a PKI store only if you connect with a `securityMode` of `Sign` or `SignAndEncrypt`. For unsecured connections (`securityMode: None`), ignore the certificate management functions.

### Self-signed versus CA-signed certificates

The `createCertificates` function prepares the client for secure connections in one of two modes:

1. Self-signed (default): The client creates its own certificate, which a higher authority does not sign. This is the simplest approach and the recommendation for most scenarios.
2. CA-signed (set `useCA` to `true`): The client first creates its own Certificate Authority (CA) and uses it to sign the application and user certificates. Use this when a server is configured to trust a single CA instead of multiple individual client certificates.

### Establishing trust

OPC UA security uses a two-way trust model:

* The server must trust the client: A server administrator configures the server to accept the client's public certificate.
* The client must trust the server: To prevent man-in-the-middle attacks, the client needs the server's public certificate in its trust list.

The `createCertificates` and `addServerCertificate` functions manage this process from the client side.

### The client's PKI folder structure

Running `createCertificates` generates a standard folder structure named `pki`. The key folders are:

* `pki/own/certs/`: The client's public certificates (for example, `heisenware_opcua_client.pem`). Give this file to the server administrator.
* `pki/own/private/`: The client's private keys. Keep these secret. The client automatically restricts file permissions to the owner.
* `pki/trusted/certs/`: The client's trust list. Place the public certificates of all securely connected OPC UA servers in this folder. The `addServerCertificate` function automates this.
* `pki/issuers/certs/`: In CA mode, the public certificate of the CA that issues certificates. If an external CA signed the server certificate, add the server's public CA certificate here using `addCertificateAuthority`.

{% hint style="info" %}
#### PKI store location

The location of the `pki` store depends on where the OPC UA client runs:

* **Agent**: The folder resides in the same directory as your Agent executable.
* **Platform**: The folder resides under `/shared/certificates`. Click the refresh button in the File Explorer to view it.
{% endhint %}

## Certificate management

These static functions handle the setup of a secure connection.

### `createCertificates`

Initializes the local PKI store and creates a client certificate for the application and a user certificate for user authentication. By default, the function creates self-signed certificates. Run this once.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>useCA</code></td><td>Creates a local Certificate Authority to sign the certificates. Default false.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns `true` when the client successfully creates the PKI structure and certificates.

### `addServerCertificate`

Adds a server's public certificate to the client's trust list, letting the client establish a secure connection with it.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>certificateInput</code></td><td>The server's public certificate, as a file path or PEM content string.</td><td>string</td></tr><tr><td><code>certificateName</code></td><td>Optional filename for the certificate. Required if providing a PEM string. If empty, the function keeps the original filename.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` if the client successfully saves the certificate.

#### Examples

Example 1: Adding a certificate from a file

{% hint style="info" %}
When the OPC UA client runs on-premises and not in Agent mode, upload the server certificate using the [File Explorer](../../file-explorer.md) first. Drag the file from there to the input of this function. You can then delete the file from the `uploads` folder.
{% endhint %}

```yaml
# certificateInput
/path/to/downloaded/server_cert.pem
```

Example 2: Adding a certificate from a string

```yaml
# certificateInput
'-----BEGIN CERTIFICATE-----\nMIIC...etc...\n-----END CERTIFICATE-----'
# certificateName
my_trusted_server.pem
```

### `addCertificateAuthority`

Adds a server's public CA certificate to the `issuers` directory of the PKI store. Use this when a Certificate Authority signed the server certificate. This function works like `addServerCertificate`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>certificateInput</code></td><td>The CA's public certificate, as a file path or PEM content string.</td><td>string</td></tr><tr><td><code>certificateName</code></td><td>Optional filename for the certificate. Required if providing a PEM string. If empty, the function keeps the original filename.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` if the client successfully saves the certificate.

## Instance and connection

### `create`

Constructs an OPC UA client instance. The security settings determine how the client connects.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>securityMode</code></td><td>The security mode to use: <code>None</code>, <code>Sign</code>, or <code>SignAndEncrypt</code>. Default <code>None</code>.</td><td>string</td></tr><tr><td></td><td><code>securityPolicy</code></td><td>The encryption algorithm to use (such as <code>Basic256Sha256</code>). Default <code>None</code>.</td><td>string</td></tr><tr><td></td><td><code>automaticallyAcceptUnknownCertificate</code></td><td>Disables server trust checking. Default false.</td><td>boolean</td></tr></tbody></table>

{% hint style="danger" %}
#### Never disable server validation in production

Never set `automaticallyAcceptUnknownCertificate` to `true` in a production environment. This disables server validation and exposes the system to man-in-the-middle attacks. Use this setting for debugging only.
{% endhint %}

#### Examples

Example 1: Create a client for an unsecured connection

```yaml
# (No arguments needed)
```

Example 2: Create a client for a secure connection

```yaml
# options
securityMode: SignAndEncrypt
securityPolicy: Basic256Sha256
```

### `connect`

Connects to an OPC UA server using the security settings defined in `create` and the user identity.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>endpointUrl</code></td><td></td><td>The full URL of the server endpoint (such as <code>opc.tcp://my-server.com:4840</code>).</td><td>string</td></tr><tr><td><code>userIdentity</code></td><td><code>username</code></td><td>Username for authentication.</td><td>string</td></tr><tr><td></td><td><code>password</code></td><td>Password for authentication.</td><td>string</td></tr><tr><td></td><td><code>userCertificate</code></td><td>User certificate for certificate-based authentication.</td><td>string</td></tr><tr><td></td><td><code>userPrivateKey</code></td><td>The private key belonging to the user certificate.</td><td>string</td></tr><tr><td></td><td><code>useDefaultUserCertificate</code></td><td>Set to <code>true</code> to authenticate with the user certificate created by <code>createCertificates</code>. Default false.</td><td>boolean</td></tr></tbody></table>

Leave `userIdentity` empty for an anonymous connection.

#### Output

Returns `true` if the client connects successfully.

#### Examples

Example 1: Unsecured, anonymous connection

```yaml
# endpointUrl
opc.tcp://my-server.com:4840
```

Example 2: Secure, anonymous connection

```yaml
# endpointUrl
opc.tcp://my-secure-server.com:4840
```

Example 3: Secure connection with username and password

```yaml
# endpointUrl
opc.tcp://my-secure-server.com:4840
# userIdentity
username: myuser
password: mysecretpassword
```

Example 4: Secure connection with a user certificate

```yaml
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

Returns `true` if the client disconnects successfully.

### `isConnected`

Checks if the client has an active connection to the server.

#### Parameters

None.

#### Output

Returns `true` if the client is connected, or `false` if disconnected.

### `delete`

Removes the instance and closes the server connection.

{% hint style="danger" %}
#### Irreversible action

Deleting an instance removes its configuration. To connect again, you must trigger `create` and `connect` anew.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` after deletion.

## Browsing

### `browse`

Browses any node address on the server. More specific functions, such as `browseObjects`, act as wrappers around this function.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td>The <code>nodeId</code> or browse path (such as <code>/0:Objects/2:Demo</code>) where browsing starts.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of objects representing each found node, including its `browseName`, `nodeId`, and `nodeClass`.

#### Example

```yaml
# address
/0:Objects/2:Demo
```

### `browseObjects`

Browses the server's `Objects` folder. You can specify a deeper starting path.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>path</code></td><td>The browse path starting inside the <code>Objects</code> folder (such as <code>2:Demo/2:Dynamic</code>).</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of objects representing each found node inside the `Objects` folder.

#### Example

```yaml
# path
2:Demo/2:Dynamic/2:Scalar
```

### `browseTypes`

Browses the server's `Types` folder to explore the data type hierarchy.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>path</code></td><td>Optional browse path starting inside the <code>Types</code> folder.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of objects representing each found node inside the `Types` folder.

#### Example

```yaml
# path
0:BaseObjectType/0:FolderType
```

### `browseViews`

Browses the server's `Views` folder.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>path</code></td><td>Optional browse path starting inside the <code>Views</code> folder.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of objects representing each found node inside the `Views` folder.

#### Example

```yaml
# path
0:Server
```

## Reading and writing

### `readNode`

Reads all attributes of an OPC UA node. This returns more details than `readVariable`, which only fetches the node's value.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td>The <code>nodeId</code> or browse path of the node to read.</td><td>string</td></tr></tbody></table>

#### Output

Returns a JSON object representing the node's `DataValue`, including the value, status code, and timestamps.

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

Example 1: Read using a `nodeId`

```yaml
# address
ns=2;s=Demo.Dynamic.Int32
```

Example 2: Read using a browse path

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

Example 1: Read using a `nodeId`

```yaml
# address
ns=2;s=Demo.Dynamic.Int32
```

Example 2: Read using a browse path

```yaml
# address
/0:Objects/2:Demo/2:Dynamic/2:Int32
```

### `writeVariable`

Writes a new value to a server variable. The function checks the data type and write permissions, converts the value to the required OPC UA data type, and writes it. If the variable is read-only, the function throws an error.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td></td><td>The <code>nodeId</code> or browse path of the variable.</td><td>string</td></tr><tr><td><code>value</code></td><td></td><td>The new value to set.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>skipTypeChecking</code></td><td>If <code>true</code>, the client skips reading metadata and permissions before writing. Default false.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns `null` on a successful write, or throws an error on failure.

#### Example

```yaml
# address
ns=2;s=Demo.Dynamic.Int32
# value
42
```

### `callMethod`

Invokes a method on an OPC UA object. The function automatically converts input arguments to the required data types.

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

Subscribes to changes of an entire OPC UA node. The listener fires with the node data on every change.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td></td><td>The <code>nodeId</code> or browse path of the node.</td><td>string</td></tr><tr><td><code>listener</code></td><td></td><td>Callback that receives the node data on every change. Payload: a JSON object representing the node's <code>DataValue</code>.</td><td>callback</td></tr><tr><td><code>options</code></td><td><code>samplingInterval</code></td><td>How often the server checks for changes, in milliseconds. Default 1000.</td><td>integer</td></tr><tr><td></td><td><code>queueSize</code></td><td>Maximum number of queued notifications on the server. Default 100.</td><td>integer</td></tr><tr><td></td><td><code>discardOldest</code></td><td>If <code>true</code>, drops the oldest notification when the queue is full. Default true.</td><td>boolean</td></tr></tbody></table>

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

Subscribes to value changes of a specific variable. The listener fires with the new value on every change.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>address</code></td><td></td><td>The <code>nodeId</code> or browse path of the variable.</td><td>string</td></tr><tr><td><code>listener</code></td><td></td><td>Callback that receives the new value on every change. Payload: the raw value of the variable.</td><td>callback</td></tr><tr><td><code>options</code></td><td><code>samplingInterval</code></td><td>How often the server checks for changes, in milliseconds. Default 1000.</td><td>integer</td></tr><tr><td></td><td><code>queueSize</code></td><td>Maximum number of queued notifications on the server. Default 100.</td><td>integer</td></tr><tr><td></td><td><code>discardOldest</code></td><td>If <code>true</code>, drops the oldest notification when the queue is full. Default true.</td><td>boolean</td></tr></tbody></table>

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

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>nodeId</code></td><td>The identifier string returned by a previous monitoring function.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` if the client successfully terminates the subscription.

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

Reads the content of a server file.

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

Creates a file in a server folder and uploads content to it.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>folderAddress</code></td><td>The <code>nodeId</code> or browse path of the target folder.</td><td>string</td></tr><tr><td><code>newFileName</code></td><td>The name for the new file.</td><td>string</td></tr><tr><td><code>pathOrBase64</code></td><td>The file content to upload, as a base64 string or local path.</td><td>string</td></tr></tbody></table>

#### Output

Returns the `nodeId` of the newly created file on the server.

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

Deletes a file from a folder on the server.

{% hint style="danger" %}
#### Destructive action

Deleting a file permanently removes it from the server. This action cannot be undone.
{% endhint %}

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>folderAddress</code></td><td>The <code>nodeId</code> or browse path of the folder containing the file.</td><td>string</td></tr><tr><td><code>fileName</code></td><td>The name of the file to delete.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` if the server successfully deletes the file.

#### Example

```yaml
# folderAddress
ns=2;s=Demo.Files
# fileName
report.txt
```

## Events

### `listenToEvents`

Registers a listener to receive client lifecycle events (such as `Connected`, `Connection Lost`, or `Session Closed`).

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>Callback that receives client lifecycle events. Payload: a string representing the event type.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `true` on successful registration.

## Deprecated functions

The following functions still appear in the Function Explorer for backward compatibility. Use their replacements in new flows.

<table><thead><tr><th width="250">Deprecated function</th><th>Use instead</th></tr></thead><tbody><tr><td><code>readVariableValue</code></td><td><code>readVariable</code></td></tr><tr><td><code>writeVariableValue</code></td><td><code>writeVariable</code></td></tr></tbody></table>

## Tips and tricks

Establishing a secure certificate-based connection is the most common point of failure in OPC UA. An error almost always means a broken link in the chain of trust. This section covers the most common pitfalls.

### Switch an existing instance to a secure connection

Security settings are part of the `create` function. To switch an unsecured instance to a secure connection, remove the instance and create it again. Right-click the existing active instance (green in the UI), click **Remove**, then trigger the `create` function with your new security configuration.

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

### Application versus user authentication

These two certificate types serve distinct purposes:

1. Application certificate (`heisenware_opcua_client.pem`): Identifies the application to establish the secure, encrypted channel between client and server. This is mandatory for secure connections.
2. User certificate (`heisenware_opcua_user.pem`): Identifies the user to handle authentication and permissions after the secure channel is established. This is optional.

User certificate authentication requires server-side configuration. The server administrator must create the user account and map it explicitly to the user's public certificate.

### Server and client clocks out of sync

OPC UA blocks secure connections if the clocks of the client and server differ substantially (for example, by an hour). When this occurs, the client logs a warning.

## Video demo

Watch the video to learn how to connect to an OPC UA server, then read, record, and visualize data.

{% embed url="https://www.youtube.com/watch?t=15s&v=7TNHk2eqRWc" %}
