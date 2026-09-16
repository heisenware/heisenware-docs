---
description: >-
  Trust the machines and servers on your own network once, for every connector.
---

# Trusted certificates

When a connector opens a secure connection (`https://`, `mqtts://` and the like), the server shows a certificate: its ID card. Public web servers carry certificates every computer already trusts. A machine, a PLC or a server on your own network usually does not. It shows a certificate it made itself, or one your company made, and the connector refuses to connect:

```
GET https://192.168.1.10/api failed: self-signed certificate
```

The Trusted certificates functions (`TrustStore`) fix this once for the whole workspace. Every connector that opens a secure connection consults the same list: [HTTP / REST](http-rest.md), the [ctrlX Data Layer](ctrlx-data-layer.md) and the [OPC UA client](opc-ua-client.md) today. No instance is needed, call the functions directly.

## Which function do I need?

| Situation                                                                           | Function                                    |
| ----------------------------------------------------------------------------------- | ------------------------------------------- |
| One device or server on my network refuses to connect.                              | `trustServer` with the server's address     |
| My IT gave me a company certificate (a "root CA" file) that vouches for many servers. | `addCertificateAuthority` with that file    |
| I downloaded the server's certificate file from its web page.                       | `addServerCertificate` with that file       |
| What is trusted right now?                                                          | `list`                                      |
| Stop trusting something.                                                            | `remove`                                    |
| Look at a server's certificate before trusting it.                                  | `fetchServerCertificate`                    |

## Static functions

### `trustServer`

Looks at the certificate the server shows right now and stores it. From then on every connector accepts this server, also when the certificate is self-made or carries a different name than the address you use.

Do this from a network you trust. Then compare the returned `fingerprint` with what the device shows in its own settings, so you know you trusted the right machine. When the server gets a new certificate later, call `trustServer` again: the stored one is replaced.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td>The server's address, for example <code>https://192.168.1.10</code>, <code>192.168.1.10:8443</code> or <code>mqtts://broker.local:8883</code>. The port defaults to 443.</td><td>string</td></tr><tr><td><code>name</code></td><td>A name for the stored certificate. Optional, the server's host name when omitted.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# url
https://192.168.1.10
```

#### Output

What is trusted now:

```yaml
name: 192.168.1.10
kind: server
subject: CN=ctrlx-core
issuer: CN=ctrlx-core
selfSigned: true
validFrom: '2026-01-01T00:00:00.000Z'
validTo: '2036-01-01T00:00:00.000Z'
fingerprint: 'AB:12:C3:...'
```

### `fetchServerCertificate`

Shows the certificate a server presents, without trusting it. Use it to check a device before `trustServer`, or to see why a connection fails.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td>The server's address, as for <code>trustServer</code>.</td><td>string</td></tr></tbody></table>

#### Output

The same fields as `trustServer` returns, plus `trusted` (whether the workspace accepts this server already) and `pem` (the certificate as text, should you want to keep it).

### `addServerCertificate`

Trusts one server by its certificate, when you have it as a file or as text, for example downloaded from the device's web page. Same effect as `trustServer`, without contacting the server.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>certificate</code></td><td>The certificate as text (<code>-----BEGIN CERTIFICATE-----</code> ...) or the path to a certificate file (PEM or DER).</td><td>string</td></tr><tr><td><code>name</code></td><td>A name for the stored certificate. Optional, taken from the file name or the certificate itself when omitted.</td><td>string</td></tr></tbody></table>

#### Example

Upload the file with the File Explorer, drag it to the parameter, and delete it from the uploads folder afterwards.

```yaml
# certificate
/shared/uploads/plc-gateway.pem
# name
plc-gateway
```

#### Output

What is trusted now, as for `trustServer`.

### `addCertificateAuthority`

Trusts every server whose certificate was issued by this authority. Use it when your IT hands you the company's certificate (a "root CA" or "issuing CA" file): one call, and all servers it vouches for are accepted. A file that holds several certificates is fine.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>certificate</code></td><td>The authority's certificate as text or the path to its file (PEM or DER).</td><td>string</td></tr><tr><td><code>name</code></td><td>A name for the stored certificate. Optional, taken from the file name or the certificate itself when omitted.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# certificate
/shared/uploads/company-root-ca.pem
```

#### Output

What is trusted now, as for `trustServer`, with `kind: authority`.

### `list`

Lists everything the workspace trusts.

#### Output

One entry per stored certificate, with the fields `trustServer` returns. `kind` is `server` (one server) or `authority` (every server it vouches for). A file in the store that is not a certificate is listed with an `error` instead.

### `remove`

Stops trusting a stored certificate.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The name as shown by <code>list</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true`. An unknown name is an error that lists the names that exist.

## Good to know

### The words

* **Certificate**: the ID a server shows when a secure connection opens. It names the server and who issued the ID.
* **Self-signed**: the server issued its own ID. Normal for machines and PLCs.
* **Authority** (CA): whoever issued IDs for many servers. Trusting the authority trusts all of them.
* **Fingerprint**: the certificate's unique number. Two certificates with the same fingerprint are the same certificate, so it is safe to compare by eye with what the device shows.

### What trusting does, and does not do

Trusting a server does not switch security off. The connection stays encrypted, and any other certificate is still refused. `trustServer` accepts the server even when its certificate names another host than the address you dial, which is the usual case for a device reached by IP address.

The `tls` setting of a single call or client (HTTP / REST, ctrlX) rides on top of the list. Setting `rejectUnauthorized: false` there accepts any certificate for that call, trusted or not.

### Where the list lives

* **Platform**: under `/shared/certificates/pki`. Trusted servers sit in `trusted/certs`, authorities in `issuers/certs`, one `.pem` file each. A file placed there by hand counts as well.
* **Native Agent**: in the `pki` folder next to the executable. Every agent keeps its own list.

The [OPC UA client](opc-ua-client.md) uses the same folders for its own certificates, and its `addServerCertificate` writes the same list. OPC UA servers do not speak TLS on `opc.tcp://`, so `trustServer` cannot fetch their certificate: use the certificate file the server offers.
