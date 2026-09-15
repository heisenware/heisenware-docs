# HTTP / REST

The HTTP / REST connector executes HTTP requests and interacts with REST APIs. It works in two modes: as standalone static functions for one-off calls, or as a client instance that shares a base URL, headers, credentials and TLS settings across many calls.

This connector supports mixed execution options, meaning you can call static functions directly or use [instance creation](./#instance-creation). All functions take the same [request options](http-rest.md#request-options). See [Tips and tricks](http-rest.md#tips-and-tricks) for the error behavior, the query-parameter shortcut, file uploads, binary downloads and self-signed certificates.

## Request options

Every request function accepts an optional `options` object with these keys. Unknown keys are refused with a hint, because they are almost always query parameters that belong under `params`.

<table><thead><tr><th width="180">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>params</code></td><td>URL query parameters as key-value pairs. Arrays are sent comma-separated (<code>hourly=a,b,c</code>), objects as JSON, <code>null</code> values are left out.</td><td>object</td></tr><tr><td><code>headers</code></td><td>Request headers. On an instance they are merged over the instance's default headers.</td><td>object</td></tr><tr><td><code>timeout</code></td><td>Request timeout in milliseconds. Default: 30000.</td><td>integer</td></tr><tr><td><code>auth</code></td><td>HTTP Basic authentication: an object with <code>username</code> and <code>password</code>.</td><td>object</td></tr><tr><td><code>token</code></td><td>Bearer token, sent as <code>Authorization: Bearer &#x3C;token></code>. Cannot be combined with <code>auth</code>.</td><td>string</td></tr><tr><td><code>requestType</code></td><td>How <code>data</code> is sent: <code>json</code> (default), <code>form</code> (URL-encoded fields), or <code>multipart</code> (form fields and file uploads, see <a href="http-rest.md#uploading-files">uploading files</a>).</td><td>string</td></tr><tr><td><code>responseType</code></td><td>How the body is returned: <code>json</code> (default: parsed when the server sends JSON, text otherwise), <code>text</code> (always a string), or <code>binary</code> (a base64 encoded string).</td><td>string</td></tr><tr><td><code>tls</code></td><td>TLS settings for <code>https</code> URLs, see <a href="http-rest.md#self-signed-and-internal-certificates">self-signed and internal certificates</a>.</td><td>object</td></tr><tr><td><code>maxRedirects</code></td><td>Maximum number of redirects to follow. Default: 5, <code>0</code> disables following.</td><td>integer</td></tr><tr><td><code>retries</code></td><td>How often to retry after a network error, a timeout or a 5xx answer. 4xx answers are never retried. Default: 0.</td><td>integer</td></tr><tr><td><code>retryDelay</code></td><td>Milliseconds to wait before each retry. Default: 1000.</td><td>integer</td></tr><tr><td><code>data</code></td><td>Request body for <code>delete</code>, for servers that expect one.</td><td>any</td></tr></tbody></table>

### Response shape

`get` returns the response body only. All other functions, `request` included, return the response as an object:

```yaml
status: 200
statusText: OK
headers:
  content-type: application/json
data: <the response body>
```

## Static functions

### `get`

Performs an HTTP GET request and returns the response body.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td>The full destination URL of the endpoint.</td><td>string</td></tr><tr><td><code>options</code></td><td>The <a href="http-rest.md#request-options">request options</a>.</td><td>object</td></tr></tbody></table>

#### Example

Retrieve the weather forecast for Hamburg (API documentation: [https://open-meteo.com/en/docs](https://open-meteo.com/en/docs)).

```yaml
# url
https://api.open-meteo.com/v1/forecast
# options
params:
  latitude: 53.5507
  longitude: 9.993
  hourly: [temperature_2m, rain, cloud_cover]
  forecast_days: 1
```

Generated URL:

```
https://api.open-meteo.com/v1/forecast?latitude=53.5507&longitude=9.993&hourly=temperature_2m,rain,cloud_cover&forecast_days=1
```

#### Output

Returns the response body, typically a JSON object or array, or a string.

### `post`

Performs an HTTP POST request to submit data to a server. Objects and arrays are sent as JSON, strings as they are.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td>The full destination URL of the endpoint.</td><td>string</td></tr><tr><td><code>data</code></td><td>The request body. Accepts text, objects, or arrays.</td><td>any</td></tr><tr><td><code>options</code></td><td>The <a href="http-rest.md#request-options">request options</a>.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# url
https://api.example.com/blogs
# data
title: New blog post
content: The body text
# options
token: <your access token>
```

#### Output

Returns the [response object](http-rest.md#response-shape).

### `put`

Performs an HTTP PUT request to update or replace a resource.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td>The full destination URL of the endpoint.</td><td>string</td></tr><tr><td><code>data</code></td><td>The request body.</td><td>any</td></tr><tr><td><code>options</code></td><td>The <a href="http-rest.md#request-options">request options</a>.</td><td>object</td></tr></tbody></table>

#### Output

Returns the [response object](http-rest.md#response-shape).

### `patch`

Performs an HTTP PATCH request to apply partial modifications to a resource.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td>The full destination URL of the endpoint.</td><td>string</td></tr><tr><td><code>data</code></td><td>The partial update applied to the resource.</td><td>any</td></tr><tr><td><code>options</code></td><td>The <a href="http-rest.md#request-options">request options</a>.</td><td>object</td></tr></tbody></table>

#### Output

Returns the [response object](http-rest.md#response-shape).

### `delete`

Performs an HTTP DELETE request to remove a resource.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td>The full destination URL of the resource to delete.</td><td>string</td></tr><tr><td><code>options</code></td><td>The <a href="http-rest.md#request-options">request options</a>. Use <code>data</code> for servers that expect a body.</td><td>object</td></tr></tbody></table>

#### Output

Returns the [response object](http-rest.md#response-shape).

### `head`

Performs an HTTP HEAD request to fetch the headers of a resource without its body.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td>The full destination URL of the endpoint.</td><td>string</td></tr><tr><td><code>options</code></td><td>The <a href="http-rest.md#request-options">request options</a>.</td><td>object</td></tr></tbody></table>

#### Output

Returns the [response object](http-rest.md#response-shape). The `data` body is empty, the information sits in `headers`.

### `options`

Performs an HTTP OPTIONS request to query the communication options a server allows.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td>The full destination URL of the endpoint.</td><td>string</td></tr><tr><td><code>options</code></td><td>The <a href="http-rest.md#request-options">request options</a>.</td><td>object</td></tr></tbody></table>

#### Output

Returns the [response object](http-rest.md#response-shape). The allowed methods typically sit in the `allow` header.

### `request`

Performs an HTTP request with any method and returns the full response. Use this for a GET whose response headers matter (pagination links, ETags, rate limits) or for methods without a function of their own, such as WebDAV's `PROPFIND`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>method</code></td><td>The HTTP method, for example <code>GET</code> or <code>PROPFIND</code>.</td><td>string</td></tr><tr><td><code>url</code></td><td>The full destination URL of the endpoint.</td><td>string</td></tr><tr><td><code>data</code></td><td>The request body, if the method takes one.</td><td>any</td></tr><tr><td><code>options</code></td><td>The <a href="http-rest.md#request-options">request options</a>.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# method
GET
# url
https://api.example.com/items
# options
params:
  page: 2
```

#### Output

Returns the [response object](http-rest.md#response-shape), headers included.

## Instance client

### `create`

Creates a reusable HTTP client that shares a base URL, default headers, credentials and TLS settings across all its calls. The instance functions take a path relative to the base URL (`/blogs` instead of the full URL) and never leave that server: an absolute URL is accepted only when it points to the same origin as the base URL. Use the static functions for other hosts.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="160">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>baseUrl</code></td><td></td><td>The absolute URL prepended to the path of every call.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>headers</code></td><td>Default headers sent with every request.</td><td>object</td></tr><tr><td></td><td><code>timeout</code></td><td>The default request timeout in milliseconds. Default: 30000.</td><td>integer</td></tr><tr><td></td><td><code>username</code></td><td>The username for HTTP Basic authentication.</td><td>string</td></tr><tr><td></td><td><code>password</code></td><td>The password for HTTP Basic authentication.</td><td>string</td></tr><tr><td></td><td><code>token</code></td><td>The access token. Needs exactly one carrier: <code>isBearer</code>, <code>authHeader</code> or <code>authParameter</code>.</td><td>string</td></tr><tr><td></td><td><code>isBearer</code></td><td>If true, sends the token as <code>Authorization: Bearer &#x3C;token></code>. Cannot be combined with basic authentication, which uses the same header.</td><td>boolean</td></tr><tr><td></td><td><code>authHeader</code></td><td>Sends the token in a custom header of this name.</td><td>string</td></tr><tr><td></td><td><code>authParameter</code></td><td>Sends the token as a URL query parameter of this name on every request.</td><td>string</td></tr><tr><td></td><td><code>tls</code></td><td>TLS settings for <code>https</code> base URLs, see <a href="http-rest.md#self-signed-and-internal-certificates">self-signed and internal certificates</a>.</td><td>object</td></tr><tr><td></td><td><code>maxRedirects</code></td><td>Maximum number of redirects to follow. Default: 5.</td><td>integer</td></tr></tbody></table>

Inconsistent settings are refused at creation: a token without a carrier, a carrier without a token, more than one carrier, or basic authentication together with `isBearer`.

#### Example

REST API with basic authentication and an `X-Access-Id` header:

```yaml
# baseUrl
https://api.example.com/v2
# options
username: api-user
password: <password>
token: <access id>
authHeader: X-Access-Id
```

Internal API with a self-signed certificate:

```yaml
# baseUrl
https://plc-gateway.plant.local
# options
token: <bearer token>
isBearer: true
tls:
  rejectUnauthorized: false
```

#### Output

Returns the name of the created instance.

### `setToken`

Replaces the access token of the client. Use this when a token expires and a new one was obtained, for example by an earlier `post` to the API's login endpoint. The new token ships the way the instance was created (`isBearer`, `authHeader` or `authParameter`).

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>token</code></td><td>The new token.</td><td>string</td></tr></tbody></table>

### `get`

Performs an HTTP GET request with the settings of the instance and returns the response body.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td>The path appended to the base URL (such as <code>/blogs</code>), or an absolute URL on the same origin.</td><td>string</td></tr><tr><td><code>options</code></td><td>The <a href="http-rest.md#request-options">request options</a>; they win over the instance settings.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# url
/blogs
# options
params:
  category: tech
```

#### Output

Returns the response body, typically a JSON object or array, or a string.

### `post`

Performs an HTTP POST request with the settings of the instance.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td>The path appended to the base URL, or an absolute URL on the same origin.</td><td>string</td></tr><tr><td><code>data</code></td><td>The request body.</td><td>any</td></tr><tr><td><code>options</code></td><td>The <a href="http-rest.md#request-options">request options</a>.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# url
/blogs
# data
title: New post
```

#### Output

Returns the [response object](http-rest.md#response-shape).

### `put`, `patch`, `delete`, `head`, `options`, `request`

Behave exactly like their [static counterparts](http-rest.md#static-functions), with `url` being the path appended to the base URL and the instance settings applied.

## Tips and tricks

### Passing query parameters directly

You can pass a flat object straight into `options`. When it contains none of the request option keys, the connector interprets the entire object as `params`:

```yaml
# options
latitude: 53.5507
longitude: 9.993
```

Mixing query parameters with option keys (`timeout: 1000` next to `latitude: 53.5`) is refused with a hint, because it would silently send no parameters otherwise.

### Self-signed and internal certificates

Servers in internal networks often use self-signed certificates or certificates signed by a company CA. By default such a certificate is refused (`... failed: self-signed certificate`). The `tls` option, per call or per instance, controls this:

<table><thead><tr><th width="200">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>rejectUnauthorized</code></td><td>Set to <code>false</code> to accept any server certificate. Default: <code>true</code>.</td><td>boolean</td></tr><tr><td><code>ca</code></td><td>Certificate(s) to trust instead of the system's, as PEM text or a path to a PEM file. Pass the server's own certificate or its issuing CA.</td><td>string</td></tr><tr><td><code>cert</code></td><td>Client certificate for mutual TLS, as PEM text or a path to a PEM file.</td><td>string</td></tr><tr><td><code>key</code></td><td>Private key of the client certificate, as PEM text or a path to a PEM file.</td><td>string</td></tr><tr><td><code>passphrase</code></td><td>Passphrase of the private key.</td><td>string</td></tr></tbody></table>

Prefer trusting the certificate over switching the check off:

```yaml
# options
tls:
  ca: |
    -----BEGIN CERTIFICATE-----
    MIIDazCCAlOgAwIBAgIUX...
    -----END CERTIFICATE-----
```

### Uploading files

With `requestType: multipart` every key of `data` becomes a form field. A file is an object with `base64` (as the File connector's `readFileToBuffer` returns it) or `path`, plus an optional `name` and `contentType`. An array of files under one key sends one part per file. Other values become text fields, objects as JSON.

```yaml
# url
https://api.example.com/documents
# data
title: Shift report
file:
  name: report.pdf
  contentType: application/pdf
  base64: JVBERi0xLjQK...
# options
requestType: multipart
```

For classic HTML forms use `requestType: form`, which sends the fields URL-encoded.

### Binary downloads

Use `responseType: binary` to receive a file as a base64 encoded string, which the File connector's `writeBufferToFile` accepts as it is:

```yaml
# url
https://example.com/report.pdf
# options
responseType: binary
```

### Retrying flaky calls

Set `retries` to repeat a call that failed with a network error, a timeout or a 5xx answer; `retryDelay` is the pause before each attempt. Client errors (4xx) are never retried. The final error names the count: `GET https://host/path failed after 3 retries: 503 Service Unavailable`.

```yaml
# options
retries: 3
retryDelay: 2000
```

### Error behavior

Failed requests throw an error whose message names the method, the URL and the reason, for example `GET https://api.example.com/items failed: 404 Not Found` or `POST https://host/path failed: timeout of 30000ms exceeded`. When the server responds with an error status, the response body is attached as the error cause. A request never hangs forever: without a `timeout` it gives up after 30 seconds.
