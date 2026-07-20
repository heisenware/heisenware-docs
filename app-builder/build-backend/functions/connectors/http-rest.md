# HTTP / REST

The HTTP / REST connector executes HTTP requests and interacts with REST APIs. It supports standard HTTP methods and works in two modes: as standalone static utilities for immediate, one-off calls, or as a persistent instance client configured with uniform base URLs, shared header contexts, and automated authentication handlers.

This connector supports mixed execution options, meaning you can call static functions directly or use [instance creation](./#instance-creation). See [Tips and tricks](http-rest.md#tips-and-tricks) for the error behavior and a shortcut for passing query parameters.

## Static functions

### `get`

Performs an HTTP GET request to fetch a resource from a remote server.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The full destination URL of the endpoint.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>params</code></td><td>URL query parameters sent as key-value pairs.</td><td>object</td></tr><tr><td></td><td><code>headers</code></td><td>Custom HTTP headers included with the request.</td><td>object</td></tr><tr><td></td><td><code>timeout</code></td><td>Request timeout in milliseconds.</td><td>integer</td></tr><tr><td></td><td><code>auth</code></td><td>Basic authentication payload containing <code>username</code> and <code>password</code> strings.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# url
https://api.open-meteo.com/v1/forecast
# options
params:
  latitude: 53.5507
  longitude: 9.993
  hourly:
    - temperature_2m
    - rain
    - cloud_cover
  forecast_days: 1
```

#### Output

Returns the parsed data payload from the server, typically as a JSON object, array, or raw string.

### `post`

Performs an HTTP POST request to submit data payloads to a remote host.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The full destination URL of the endpoint.</td><td>string</td></tr><tr><td><code>data</code></td><td></td><td>The payload body to deliver to the server. Accepts text, objects, or arrays.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>params</code></td><td>URL query parameters sent as key-value pairs.</td><td>object</td></tr><tr><td></td><td><code>headers</code></td><td>Custom HTTP headers included with the request.</td><td>object</td></tr><tr><td></td><td><code>timeout</code></td><td>Request timeout in milliseconds.</td><td>integer</td></tr><tr><td></td><td><code>auth</code></td><td>Basic authentication configuration.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# url
https://api.example.com/blogs
# data
title: New blog post
content: This is the verified body text payload.
```

#### Output

Returns the full response object from the server, including `data`, `status`, and `headers`.

### `put`

Performs an HTTP PUT request to update or completely replace a target resource.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The full destination URL of the endpoint.</td><td>string</td></tr><tr><td><code>data</code></td><td></td><td>The payload body to deliver to the server.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>params</code></td><td>URL query parameters.</td><td>object</td></tr><tr><td></td><td><code>headers</code></td><td>Custom HTTP headers.</td><td>object</td></tr><tr><td></td><td><code>timeout</code></td><td>Request timeout in milliseconds.</td><td>integer</td></tr><tr><td></td><td><code>auth</code></td><td>Basic authentication configuration.</td><td>object</td></tr></tbody></table>

#### Output

Returns the full response object from the server, including `data`, `status`, and `headers`.

### `patch`

Performs an HTTP PATCH request to apply partial modifications to a resource.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The full destination URL of the endpoint.</td><td>string</td></tr><tr><td><code>data</code></td><td></td><td>The partial update data applied to the resource.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>params</code></td><td>URL query parameters.</td><td>object</td></tr><tr><td></td><td><code>headers</code></td><td>Custom HTTP headers.</td><td>object</td></tr><tr><td></td><td><code>timeout</code></td><td>Request timeout in milliseconds.</td><td>integer</td></tr><tr><td></td><td><code>auth</code></td><td>Basic authentication configuration.</td><td>object</td></tr></tbody></table>

#### Output

Returns the full response object from the server, including `data`, `status`, and `headers`.

### `delete`

Performs an HTTP DELETE request to remove a specific resource from the server.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The full destination URL of the resource to delete.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>params</code></td><td>URL query parameters.</td><td>object</td></tr><tr><td></td><td><code>headers</code></td><td>Custom HTTP headers.</td><td>object</td></tr><tr><td></td><td><code>timeout</code></td><td>Request timeout in milliseconds.</td><td>integer</td></tr><tr><td></td><td><code>auth</code></td><td>Basic authentication configuration.</td><td>object</td></tr></tbody></table>

#### Output

Returns the full response object from the server, including `data`, `status`, and `headers`.

### `head`

Performs an HTTP HEAD request to fetch meta headers without reading the document response body.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The full destination URL of the endpoint.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>params</code></td><td>URL query parameters.</td><td>object</td></tr><tr><td></td><td><code>headers</code></td><td>Custom HTTP headers.</td><td>object</td></tr><tr><td></td><td><code>timeout</code></td><td>Request timeout in milliseconds.</td><td>integer</td></tr><tr><td></td><td><code>auth</code></td><td>Basic authentication configuration.</td><td>object</td></tr></tbody></table>

#### Output

Returns the full response object. For HEAD requests, the `data` body is empty and the relevant information sits in `headers`.

### `options`

Performs an HTTP OPTIONS request to query the permissible communication methods allowed by the server.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The full destination URL of the endpoint.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>params</code></td><td>URL query parameters.</td><td>object</td></tr><tr><td></td><td><code>headers</code></td><td>Custom HTTP headers.</td><td>object</td></tr><tr><td></td><td><code>timeout</code></td><td>Request timeout in milliseconds.</td><td>integer</td></tr><tr><td></td><td><code>auth</code></td><td>Basic authentication configuration.</td><td>object</td></tr></tbody></table>

#### Output

Returns the full response object. The allowed communication options typically sit in the `headers` (such as `Allow`).

## Instance client

### `create`

Constructs a reusable, persistent HTTP client instance configured with shared authentication schemes, automated token management, and standardized relative path routing.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>baseUrl</code></td><td></td><td>The base URL string prepended automatically to all subsequent partial relative paths.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>headers</code></td><td>Default headers sent with every request.</td><td>object</td></tr><tr><td></td><td><code>timeout</code></td><td>The default request timeout in milliseconds for all requests.</td><td>integer</td></tr><tr><td></td><td><code>username</code></td><td>The username for default HTTP basic authentication.</td><td>string</td></tr><tr><td></td><td><code>password</code></td><td>The password for default HTTP basic authentication.</td><td>string</td></tr><tr><td></td><td><code>token</code></td><td>The authentication token.</td><td>string</td></tr><tr><td></td><td><code>isBearer</code></td><td>If true, sends the token as a bearer token in the <code>Authorization</code> header. Takes precedence over <code>authHeader</code>.</td><td>boolean</td></tr><tr><td></td><td><code>authHeader</code></td><td>Sends the token in a custom HTTP header with this name.</td><td>string</td></tr><tr><td></td><td><code>authParameter</code></td><td>Sends the token as a URL query parameter with this name on every request.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# baseUrl
https://api.my-fake-rest-server.com
# options
username: gerhard@gmx.de
password: Waltraud_1957
token: '194307'
authHeader: X-Access-Id
```

#### Output

Returns the name of the created instance.

### `get`

Performs an HTTP GET request utilizing the pre-configured settings of the instance client.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The relative path string (such as <code>/blogs</code>) appended to the base URL, or an absolute link.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>params</code></td><td>URL query parameters sent as key-value pairs.</td><td>object</td></tr><tr><td></td><td><code>headers</code></td><td>Custom HTTP header elements overriding instance defaults.</td><td>object</td></tr><tr><td></td><td><code>timeout</code></td><td>Request timeout in milliseconds.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# url
/blogs
# options
params:
  category: tech
```

#### Output

Returns the parsed data payload from the server, typically as a JSON object, array, or raw string.

### `post`

Performs an HTTP POST request utilizing the pre-configured settings of the instance client.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The relative path string or absolute endpoint link.</td><td>string</td></tr><tr><td><code>data</code></td><td></td><td>The structured body data block submitted to the remote server.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>params</code></td><td>URL query parameters.</td><td>object</td></tr><tr><td></td><td><code>headers</code></td><td>Custom HTTP headers overriding defaults.</td><td>object</td></tr><tr><td></td><td><code>timeout</code></td><td>Request timeout in milliseconds.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# url
/blogs
# data
title: New post
```

#### Output

Returns the full response object from the server, including `data`, `status`, and `headers`.

### `put`

Performs an HTTP PUT request utilizing the pre-configured settings of the instance client.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The relative path string or absolute link.</td><td>string</td></tr><tr><td><code>data</code></td><td></td><td>The data payload transferred to the server destination.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>params</code></td><td>URL query parameters.</td><td>object</td></tr><tr><td></td><td><code>headers</code></td><td>Custom HTTP headers.</td><td>object</td></tr><tr><td></td><td><code>timeout</code></td><td>Request timeout in milliseconds.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the full response object from the server, including `data`, `status`, and `headers`.

### `patch`

Performs an HTTP PATCH request utilizing the pre-configured settings of the instance client.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The relative path string or absolute link.</td><td>string</td></tr><tr><td><code>data</code></td><td></td><td>The partial modification payload.</td><td>any</td></tr><tr><td><code>options</code></td><td><code>params</code></td><td>URL query parameters.</td><td>object</td></tr><tr><td></td><td><code>headers</code></td><td>Custom HTTP headers.</td><td>object</td></tr><tr><td></td><td><code>timeout</code></td><td>Request timeout in milliseconds.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the full response object from the server, including `data`, `status`, and `headers`.

### `delete`

Performs an HTTP DELETE request utilizing the pre-configured settings of the instance client.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The relative path string or absolute link targeting a resource.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>params</code></td><td>URL query parameters.</td><td>object</td></tr><tr><td></td><td><code>headers</code></td><td>Custom HTTP headers.</td><td>object</td></tr><tr><td></td><td><code>timeout</code></td><td>Request timeout in milliseconds.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the full response object from the server, including `data`, `status`, and `headers`.

### `head`

Performs an HTTP HEAD request utilizing the pre-configured settings of the instance client.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The relative path string or absolute link.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>params</code></td><td>URL query parameters.</td><td>object</td></tr><tr><td></td><td><code>headers</code></td><td>Custom HTTP headers.</td><td>object</td></tr><tr><td></td><td><code>timeout</code></td><td>Request timeout in milliseconds.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the full response object. For HEAD requests, the `data` body is empty and the relevant information sits in `headers`.

### `options`

Performs an HTTP OPTIONS request utilizing the pre-configured settings of the instance client.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The relative path string or absolute link.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>params</code></td><td>URL query parameters.</td><td>object</td></tr><tr><td></td><td><code>headers</code></td><td>Custom HTTP headers.</td><td>object</td></tr><tr><td></td><td><code>timeout</code></td><td>Request timeout in milliseconds.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the full response object. The allowed communication options typically sit in the `headers` (such as `Allow`).

## Tips and tricks

### Passing query parameters directly

You can pass a flat object straight into `options`. When it contains none of the keys `params`, `headers`, `timeout`, or `auth`, the connector interprets the entire object as the `params` query parameters.

### Error behavior

Failed requests throw an error. When the server responds with an error status, the error message contains the status code and status text (such as `404 Not Found`), and the response body is attached as the error cause. Network-level failures (such as an unreachable host or a timeout) throw the original error.
