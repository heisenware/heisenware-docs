---
description: >-
  Learn how to connect to an OPC UA server using the Heisenware OPC UA
  integration.
---

# OPC UA Client

The `OpcuaClient` class provides a high-level interface for communicating with OPC UA servers. It simplifies complex operations like establishing secure connections, browse the server's address space, reading and writing variables, calling methods, monitoring data for changes, and handling file transfers.

An instance of the client must be created to manage the connection state and session with a server. For secure connections, certificates must be generated first using the `createCertificates` function.

{% hint style="info" %}
Find a [video tutorial](opc-ua-client.md#video-tutorial) covering the basics at the bottom of this page.
{% endhint %}

## Security & Certificates

{% hint style="info" %}
In case you are using an un-encrypted communication between client and server  (not recommended in production settings) and also do not deal with certificate based authentication (advanced feature) you can directly jump [here](opc-ua-client.md#client-instantiation-and-connection).&#x20;

Otherwise we strongly advise to make yourself confident with the OPC UA security concepts and our corresponding implementation by continuing to read below.
{% endhint %}

For secure OPC UA communication (`Sign` or `SignAndEncrypt`), a Public Key Infrastructure (PKI) is essential. This is a system of folders and files that manages digital certificates to establish trust between the client and server.

#### When is Security Needed?

You only need to manage a PKI store if you intend to connect to a server using a `securityMode` of `Sign` or `SignAndEncrypt`. For unsecured connections (`securityMode: 'None'`), you can ignore the certificate management functions.

#### Certificate Generation: Self-Signed vs. CA-Signed

The `createCertificates` static method prepares your client for secure connections. It can operate in two modes:

1. Self-Signed (Default): This is the simplest method. The client creates its own unique certificate that is not signed by a higher authority. This is the recommended approach for most scenarios as it's easier to manage.
2. CA-Signed (Optional): The client first creates its own mini Certificate Authority (CA) and then uses that CA to sign its application and user certificates. This is useful for scenarios where a server is configured to trust a single CA instead of many individual client certificates.

#### Establishing Trust

OPC UA security is built on a two-way trust model:

* The Server Must Trust Your Client: A server administrator must configure the server to accept your client's public certificate.
* Your Client Must Trust the Server: To prevent man-in-the-middle attacks, your client must have the server's public certificate in its own trust list.

The `createCertificates` and `addServerCertificate` functions are designed to manage this process from the client's side.

#### The Client's PKI Folder Structure

{% hint style="info" %}
The location of the `pki` store differs depending on whether you run the OPC UA client in agent mode, or within the platform itself (e.g. in on-premises setup). \
\
**Agent**: The folder will be placed in the same directory as your agent executable\
**Platform**: You will find it under `(/shared/)certificates` (may need a refresh button click in the UI)
{% endhint %}

Running `createCertificates` generates a standard folder structure named `pki`. The key folders are:

* `pki/own/certs/`: Contains your client's public certificates (e.g., `heisenware_opcua_client.pem`). This is the file you give to the server administrator.
* `pki/own/private/`: Contains your client's private keys. Keep these secret! The code automatically sets their file permissions to be readable only by the owner.
* `pki/trusted/certs/`: This is the client's trust list. You must place the public certificates of any OPC UA servers you want to connect to securely in this folder. The `addServerCertificate` function automates this.
* `pki/issuers/certs/`: In CA-mode, this contains the public certificate of the CA that can issue certificates. When a server certificate was signed by an external CA, you have to add the server's public CA certificate here.

### A Guide to Certificate-Based Connections: Pitfalls & Troubleshooting

Establishing a secure certificate-based connection is the most common point of failure in OPC UA. An error almost always means there is a broken link in the chain of trust. This guide covers the most common pitfalls.

{% hint style="warning" %}
If you created an instance before and failed to connect using an un-secure connection, you have to re-create this instance in order to switch to a secure connection now (as security settings are part of the `create` function). For that right-click the existing instance (should be green if alive) and click `REMOVE` . It should turn yellow (indicating it is not yet available). Now, changes to the `create` Function Input will be applied when you trigger it again.
{% endhint %}

#### Pitfall 1: Server Rejects the Client Certificate

This happens when your client attempts to connect, and the server immediately closes the connection. The error message is often generic, like `"The connection has been disconnected by third party"`. This means the server does not trust your client's application certificate.

**How to Fix (Prosys Example):**

1. Attempt to connect your client to the Prosys server. This will fail, but it makes Prosys aware of your client's certificate.
2. In the Prosys Simulation Server UI, go to the Certificates tab.
3. Your client's certificate (`HeisenwareOPCUAClient`) will appear in the Rejected Certificates list.
4. Right-click on your certificate and select Trust. This moves it to the Trusted Certificates list.
5. Try connecting your client again. It should now succeed.

* If using CA-mode: Instead of trusting the client certificate directly, you would place your CA's public certificate (`heisenware_ca_cert.pem`) into the Prosys PKI folder at `pki/CA/issuers/certs/`.

#### Pitfall 2: Client Rejects the Server Certificate

This is the reverse problem. Your client does not trust the server it's connecting to. You will receive a very clear error message: `"server Certificate verification failed"`.

This happens because, for security, the client will only connect to servers it knows.

**How to Fix:**

You must add the server's public certificate to your client's trust store.

1. Obtain the server's public certificate file (e.g., by exporting it from the Prosys Certificates tab).
2. Use the `addServerCertificate` static method to add it to your client's `pki/trusted/certs` folder.

{% hint style="danger" %}
CRITICAL: Never set `automaticallyAcceptUnknownCertificate: true` in a production environment. This disables server validation and exposes you to man-in-the-middle attacks.
{% endhint %}

#### Pitfall 3: The SAN Mismatch

This is a very common reason for a `"server Certificate verification failed"` error, even when trust has been established.

* What it is: A certificate's Subject Alternative Name (SAN) field lists all the hostnames and IP addresses for which it is valid.
* The Problem: When you connect, the client strictly checks if the hostname in your endpoint URL (e.g., `opc.tcp://lenovo:4840`) is present in the server certificate's SAN list. If it's not, the connection is rejected.

**How to Fix (Prosys Example):**

1. Diagnose: You try to connect to `opc.tcp://localhost:53530`, but it fails. You check the Prosys certificate's SAN field using `openssl` and see it only lists `DNS:lenovo`.
2. The Fix: Change your endpoint URL to match what's in the certificate: `await client.connect("opc.tcp://lenovo:53530/OPCUA/SimulationServer")`. The connection will now succeed.

#### Pitfall 4: Certificate Revocation List (CRL) Failures

This is an advanced and subtle issue. A certificate may contain a URL pointing to a Certificate Revocation List (CRL). A secure client will try to download this list to ensure the server's certificate hasn't been revoked. If the client is in an isolated network without internet access, it cannot download the CRL, and the validation fails.

**How to Fix:**

The proper solution is to manually download the CRL file and place it in the client's `pki/issuers/crl` or `pki/trusted/crl` folder. If you created the server's certificate with your own CA, you can generate an empty CRL file to satisfy the check.

#### Pitfall 5: Application vs. User Authentication

It's crucial to understand the two different types of certificates used:

1. Application Certificate (`heisenware_opcua_client.pem`): Identifies your _application_. It is used to create the secure, encrypted channel between the client and server. This is mandatory for a secure connection.
2. User Certificate (`heisenware_opcua_user.pem`): Identifies a _human user_. It is used to log in and acquire permissions after the secure channel is already established. This is optional.

The Pitfall: Setting up user certificate authentication requires extra configuration on the server. For Prosys, this feature is only available in the Professional Edition. The server administrator must create a user and explicitly map that user account to the user's public certificate.

#### Pitfall 6: Server's and Client's internal clocks are out of sync

When the internal clocks of server and client are out of sync by some substantial time (e.g. 1 hour), OPC UA's internal security requirements may deny to establish the connection. If that's the case you will see a clear warning stating this fact in the client's logs.

### Setup & Certificate Management

These static functions are used for the one-time setup of a secure connection.

#### createCertificates

Initializes the entire local PKI store. It creates a new Certificate Authority (CA) and uses it to issue a client certificate (for the application) and a user certificate (for user authentication). This only needs to be run once.

Output

Returns true on successful creation of the PKI structure and certificates.

#### addServerCertificate

Adds a server's public certificate to your client's trust list, allowing your client to establish a secure connection with it.

Parameters

* `certificateInput`: The server's public certificate, provided either as a file path or as the PEM content string itself.
* `certificateName`: An optional filename for the certificate. This is required if you provide the certificate content as a string.

Example 1: Adding a certificate from a file

{% hint style="info" %}
When you are running the OPC UA client on-premises and not in agent mode, you will typically upload the server certificate using the [Resources](../../file-explorer.md) panel first. Once, done you can simply drag the file from there to the input of this function. After that, there is no need to keep the file in the `uploads` folder and you can simply delete it.
{% endhint %}

```yaml
# certificateInput
'/path/to/downloaded/server_cert.pem'
```

Example 2: Adding a certificate from a string variable

```yaml
# certificateInput
'-----BEGIN CERTIFICATE-----\nMIIC...etc...\n-----END CERTIFICATE-----'
# certificateName
'my_trusted_server.pem'
```

Output

Returns true if the certificate was saved successfully.

#### addCertificateAuthority

Sometimes the server's public certificates are signed using an explicit Certficiate Authority (CA). If this is the case, you have to add this certificate (often has a CA in the name) to the PKI structure as well (to the `issuers` section). This function will do that for you and works analog to the `addServerCertificate` as described above.

Parameters

* `certificateInput`: The server's public certificate, provided either as a file path or as the PEM content string itself.
* `certificateName`: An optional filename for the certificate. This is required if you provide the certificate content as a string.

## Client Instantiation and Connection

#### create

Constructs an OPC UA client instance. The security settings you provide here determine how the client will attempt to connect.

Parameters

* `options`: An object for configuring the connection's security.
  * `securityMode`: Can be `None`, `Sign`, or `SignAndEncrypt`. Defaults to `None`.
  * `securityPolicy`: The encryption algorithm to use (e.g., `Basic256Sha256`). Defaults to `None`.
  * `automaticallyAcceptUnknownCertificate:` Turns of server trust checking. Defaults to `false`.

Example: Create a client for an unsecured connection

```yaml
# (No arguments needed)
```

Example: Create a client for a secure connection

```yaml
# options
securityMode: SignAndEncrypt
securityPolicy: Basic256Sha256
```

#### connect

Connects to an OPC UA server using the security settings defined in `create` and the user identity provided here.

Parameters

* `endpointUrl`: The full URL of the server endpoint.
* `userIdentity`: An optional object specifying how to authenticate as a user.
  * `username` & `password`: For username/password authentication.
  * `useDefaultUserCertificate`: Set to `true` to authenticate with the user certificate created by `createCertificates`.

### Connection and Authentication Examples

Here are examples for various connection scenarios.

Example 1: Unsecured, Anonymous Connection

This requires no PKI setup and no user identity.

```yaml
# (In `create` Function)
# (No arguments)

# (In `connect` Function)
# endpointUrl
opc.tcp://my-server.com:4840
```

Example 2: Secure, Anonymous Connection

This requires the PKI setup (createCertificates and addServerCertificate) but no user identity.

```yaml
# (In `create` Function)
# options
securityMode: SignAndEncrypt
securityPolicy: Basic256Sha256

# (In `connect` Function)
# endpointUrl
opc.tcp://my-secure-server.com:4840
```

Example 3: Secure Connection with Username/Password

This requires the PKI setup for a secure channel, plus username/password credentials for user authentication.

```yaml
# (In `create` Function)
# options
securityMode: SignAndEncrypt
securityPolicy: Basic256Sha256

# (In `connect` Function)
# endpointUrl
opc.tcp://my-secure-server.com:4840
# userIdentity
username: myuser
password: mysecretpassword
```

Example 4: Secure Connection with a User Certificate

This is the most secure method, using certificates for both channel security and user authentication.

```yaml
# (In `create` Function)
# options
securityMode: SignAndEncrypt
securityPolicy: Basic256Sha256

# (In `connect` Function)
# endpointUrl
opc.tcp://my-secure-server.com:4840
# userIdentity
useDefaultUserCertificate: true
```

## Standard OPC UA Functions

Once connected, you can use these functions to interact with the server.

### disconnect

Closes the active session and disconnects from the OPC UA server.

Parameters

None.

Output

Returns `true` on a successful disconnection.

### isConnected

Checks if the client has a valid and active channel with the server.

Parameters

None.

Output

Returns `true` if the client is connected, otherwise `false`.

### browse

This is the generic, non-recursive browse function. It can start from any node address on the server. The more specific functions like `browseObjects` are convenience wrappers around this one.

Parameters

* address: The `nodeId` or a full browse path (e.g., `/0:Objects/2:Demo`) from which to start Browse.

Example

```yaml
# address
/0:Objects/2:Demo
```

Output

An array of objects, where each object represents a found node and contains its `browseName`, `nodeId`, and `nodeClass`.

### browseObjects

Performs a non-recursive browse of the server's `Objects` folder. You can specify a deeper path to start from.

Parameters

* path: The browse path, starting from within the `Objects` folder. Path items are separated by `/`, and each item uses `namespaceIndex:BrowseName` format (e.g., `2:Demo/2:Dynamic`).

Example

```yaml
# path
2:Demo/2:Dynamic/2:Scalar
```

Output

An array of objects, where each object represents a found node and contains its `browseName`, `nodeId`, and `nodeClass`.

### browseTypes

Performs a non-recursive browse of the server's `Types` folder. This is useful for exploring the server's data type hierarchy.

Parameters

* path: An optional browse path to start from within the `Types` folder. If omitted, it browses from the root of the `Types` folder.

Example

```yaml
# path
0:BaseObjectType/0:FolderType
```

Output

An array of objects, where each object represents a found data type node.

### browseViews

Performs a non-recursive browse of the server's `Views` folder. Views are predefined, filtered collections of nodes.

Parameters

* path: An optional browse path to start from within the `Views` folder. If omitted, it browses from the root of the `Views` folder.

Example

```yaml
# path
0:Server
```

Output

An array of objects, where each object represents a found node within the specified view.

### readNode

Reads all attributes of a specific OPC UA node, returning a detailed data structure. This is more comprehensive than `readVariable`, which only fetches the node's value.

Parameters

* address: The `nodeId` or a valid browse path of the node to read.

Example: Read using nodeId

```yaml
# address
ns=2;s=Demo.Dynamic.Int32
```

Example: Read using Browse Path

```yaml
# address
/0:Objects/2:Demo/2:Dynamic/2:Int32
```

Output

A JSON object representing the node's `DataValue`. This includes the value, status code, and server/source timestamps. For example:

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

### readVariable

Reads the value of a single variable from the server. This is a convenience function that extracts just the value from the node's data.

Parameters

* address: The address of the variable, which can be its `nodeId` (recommended) or a full browse path.

Example: Read using nodeId

```yaml
# address
ns=2;s=Demo.Dynamic.Int32
```

Example: Read using Browse Path

```yaml
# address
/0:Objects/2:Demo/2:Dynamic/2:Int32
```

Output

The raw value of the variable (e.g., a number, a string, a boolean, or an array).

### writeVariable

Writes a new value to a variable on the server. The function automatically handles the conversion from a standard JavaScript type to the required OPC UA data type.

Parameters

* address: The `nodeId` or browse path of the variable to write to.
* value: The new value to set.

Example

```yaml
# address
ns=2;s=Demo.Dynamic.Int32
# value
42
```

Output

The function returns `null` on a successful write or throws an error on failure.

***

### callMethod

Invokes a method on an OPC UA object on the server. Input arguments are automatically converted to the correct data types as defined by the method on the server.

Parameters

* methodAddress: The `nodeId` or browse path of the method to call.
* inputValues: An array of values to pass as input arguments to the method.

Example

This example calls a method that takes two input arguments.

```yaml
# methodAddress
ns=2;s=Demo.Methods.Multiply
# inputValues
[ 5, 10 ]
```

Output

An array containing the output arguments returned by the method call.

### monitorNode

Subscribes to changes for an entire OPC UA node. The provided callback function is triggered with the full node data object (including value, status, and timestamps) whenever a change is detected by the server.

Parameters

* address: The `nodeId` or browse path of the node to monitor.
* listener: The callback function that will receive the full data object on change.
* options: An object to configure the subscription.
  * samplingInterval: How often (in milliseconds) the server should check for changes. Default is `1000`.

Example

```yaml
# address
ns=2;s=Demo.Dynamic.UInt16
# listener
<callback>
# options
samplingInterval: 5000
```

Output

Returns a unique `nodeId` string that acts as an identifier for this monitored item, which is needed for `stopMonitor`.

### monitorVariable

Subscribes to value changes for a specific variable. A callback function is triggered every time the server reports a new value.

Parameters

* address: The `nodeId` or browse path of the variable to monitor.
* listener: The callback function that will receive the new value.
* options: An object to configure the subscription.
  * samplingInterval: How often (in milliseconds) the server should check the variable for changes. Default is `1000`.

Example

```yaml
# address
ns=2;s=Demo.Dynamic.UInt16
# listener
<callback>
# options
samplingInterval: 5000
```

Output

Returns a unique `nodeId` string that acts as an identifier for this monitored item. This ID is used to stop the monitoring later.

### stopMonitor

Terminates an active subscription for a monitored item.

Parameters

* nodeId: The identifier string that was returned by a previous call to `monitorNode` or `monitorVariable`.

Example

```yaml
# nodeId
ns=2;s=Demo.Dynamic.UInt16
```

Output

Returns `true` if the subscription was terminated successfully.

### browseDirectory

Recursively browses a file-system-like directory structure exposed by an OPC UA server.

Parameters

* address: The `nodeId` or browse path of the starting directory node.

Output

A nested array of objects representing the directory structure.

### readFile

Reads the entire content of a file exposed by the OPC UA server's file transfer feature.

Parameters

* address: The `nodeId` or browse path of the file node on the server.

Example

```yaml
# address
ns=2;s=Demo.Files.TextFile
```

Output

The complete content of the file, encoded as a base64 string.

### writeFile

Creates a new file in a specified folder on the server and uploads content to it.

Parameters

* folderAddress: The `nodeId` or browse path of the folder where the file will be created.
* newFileName: The name for the new file.
* pathOrBase64: The content to upload, either as a base64 string or a local file system path.

Example

```yaml
# folderAddress
ns=2;s=Demo.Files
# newFileName
report.txt
# pathOrBase64
SGVsbG8sIFdvcmxkIQ==
```

Output

The `nodeId` of the newly created file on the server.

### deleteFile

Deletes a file from a folder on the OPC UA server.

Parameters

* folderAddress: The `nodeId` or browse path of the folder containing the file.
* fileName: The name of the file to delete.

Example

```yaml
# folderAddress
ns=2;s=Demo.Files
# fileName
report.txt
```

Output

Returns `true` if the file was deleted successfully.

### listenToEvents

Registers a callback function to receive important lifecycle events from the client, such as `Connected`, `Connection Lost`, `Session Closed`, etc. This is useful for monitoring the health of the connection.

Parameters

* listener: The callback function to receive event strings.

Output

Returns `true`.

## Video tutorial

Watch the video to learn how to connect to an OPC UA Server and read, record and visualize OPC UA data from that server within Heisenware.

{% embed url="https://www.youtube.com/watch?t=15s&v=7TNHk2eqRWc" %}
