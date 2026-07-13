# HTTP / REST

The HTTP / REST connector executes HTTP requests and interacts with REST APIs. It supports standard HTTP methods and works in two modes: as standalone static utilities for immediate, one-off calls, or as a persistent instance client configured with uniform base URLs, shared header contexts, and automated authentication handlers.

This connector supports mixed execution options, meaning you can call static functions directly or use [instance creation](/app-builder/build-backend/functions/connectors.md#instance-creation).

## Static functions

### `get`

Performs an HTTP GET request to fetch a resource from a remote server.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>url</code></td>
      <td></td>
      <td>The full destination URL of the endpoint.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>params</code></td>
      <td>URL query parameters sent as key-value pairs.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>headers</code></td>
      <td>Custom HTTP headers included with the request.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>timeout</code></td>
      <td>Connection threshold timeout in milliseconds.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>auth</code></td>
      <td>Basic authentication payload containing <code>username</code> and <code>password</code> strings.</td>
      <td>object</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# url
[https://api.open-meteo.com/v1/forecast](https://api.open-meteo.com/v1/forecast)
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

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>url</code></td>
      <td></td>
      <td>The full destination URL of the endpoint.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>data</code></td>
      <td></td>
      <td>The payload body to deliver to the server. Accepts text, objects, or arrays.</td>
      <td>any</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>params</code></td>
      <td>URL query parameters sent as key-value pairs.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>headers</code></td>
      <td>Custom HTTP headers included with the request.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>timeout</code></td>
      <td>Connection threshold timeout in milliseconds.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>auth</code></td>
      <td>Basic authentication configuration.</td>
      <td>object</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# url
[https://api.example.com/blogs](https://api.example.com/blogs)
# data
title: New blog post
content: This is the verified body text payload.
```

#### Output

Returns the complete response metadata structure and data returned by the server.

### `put`

Performs an HTTP PUT request to update or completely replace a target resource.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>url</code></td>
      <td></td>
      <td>The full destination URL of the endpoint.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>data</code></td>
      <td></td>
      <td>The payload body to deliver to the server.</td>
      <td>any</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>params</code></td>
      <td>URL query parameters.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>headers</code></td>
      <td>Custom HTTP headers.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>timeout</code></td>
      <td>Connection threshold timeout in milliseconds.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>auth</code></td>
      <td>Basic authentication configuration.</td>
      <td>object</td>
    </tr>
  </tbody>
</table>

#### Output

Returns the complete response payload dispatched from the server.

### `patch`

Performs an HTTP PATCH request to apply partial modifications to a resource.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>url</code></td>
      <td></td>
      <td>The full destination URL of the endpoint.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>data</code></td>
      <td></td>
      <td>The fractional update data applied to the resource.</td>
      <td>any</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>params</code></td>
      <td>URL query parameters.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>headers</code></td>
      <td>Custom HTTP headers.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>timeout</code></td>
      <td>Connection threshold timeout in milliseconds.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>auth</code></td>
      <td>Basic authentication configuration.</td>
      <td>object</td>
    </tr>
  </tbody>
</table>

#### Output

Returns the modified resource profile payload from the server.

### `delete`

Performs an HTTP DELETE request to remove a specific resource from the server.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>url</code></td>
      <td></td>
      <td>The full destination URL of the resource to delete.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>params</code></td>
      <td>URL query parameters.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>headers</code></td>
      <td>Custom HTTP headers.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>timeout</code></td>
      <td>Connection threshold timeout in milliseconds.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>auth</code></td>
      <td>Basic authentication configuration.</td>
      <td>object</td>
    </tr>
  </tbody>
</table>

#### Output

Returns the status confirmation data delivered by the host server.

### `head`

Performs an HTTP HEAD request to fetch meta headers without reading the document response body.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>url</code></td>
      <td></td>
      <td>The full destination URL of the endpoint.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>params</code></td>
      <td>URL query parameters.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>headers</code></td>
      <td>Custom HTTP headers.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>timeout</code></td>
      <td>Connection threshold timeout in milliseconds.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>auth</code></td>
      <td>Basic authentication configuration.</td>
      <td>object</td>
    </tr>
  </tbody>
</table>

#### Output

Returns the response headers context without body attributes.

### `options`

Performs an HTTP OPTIONS request to query the permissible communication methods allowed by the server.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>url</code></td>
      <td></td>
      <td>The full destination URL of the endpoint.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>params</code></td>
      <td>URL query parameters.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>headers</code></td>
      <td>Custom HTTP headers.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>timeout</code></td>
      <td>Connection threshold timeout in milliseconds.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>auth</code></td>
      <td>Basic authentication configuration.</td>
      <td>object</td>
    </tr>
  </tbody>
</table>

#### Output

Returns the operational configuration schema rules allowed by the host endpoint.

## Instance client

### `create`

Constructs a reusable, persistent HTTP client instance configured with shared authentication schemes, automated token management, and standardized relative path routing.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>baseUrl</code></td>
      <td></td>
      <td>The base URL string prepended automatically to all subsequent partial relative paths.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>headers</code></td>
      <td>Default custom headers shipped automatically with every request execution.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>timeout</code></td>
      <td>Default request cancellation timeout threshold in milliseconds.</td>
      <td>integer</td>
    </tr>
    <tr>
      <td></td>
      <td><code>username</code></td>
      <td>The username used for default HTTP basic authentication actions.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>password</code></td>
      <td>The password used for default HTTP basic authentication actions.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>token</code></td>
      <td>An authorization credential tracking string.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>isBearer</code></td>
      <td>If true, transmits the token formatted as a bearer string inside the authorization header.</td>
      <td>boolean</td>
    </tr>
    <tr>
      <td></td>
      <td><code>authHeader</code></td>
      <td>Enables custom transmission of the token inside an HTTP header matching this string name.</td>
      <td>string</td>
    </tr>
    <tr>
      <td></td>
      <td><code>authParameter</code></td>
      <td>Enables automatic injection of the token into a URL query parameter using this parameter name.</td>
      <td>string</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# baseUrl
[https://api.my-fake-rest-server.com](https://api.my-fake-rest-server.com)
# options
username: gerhard@gmx.de
password: Waltraud_1957
token: '194307'
authHeader: X-Access-Id
```

#### Output

Returns the client instance. Throws an error if creation fails.

### `get`

Performs an HTTP GET request utilizing the pre-configured settings of the instance client.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>url</code></td>
      <td></td>
      <td>The relative path string (such as <code>/blogs</code>) appended to the base URL, or an absolute link.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>params</code></td>
      <td>URL query parameters sent as key-value pairs.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>headers</code></td>
      <td>Custom HTTP header elements overriding instance defaults.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>timeout</code></td>
      <td>Connection execution limit threshold in milliseconds.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# url
/blogs
# options
params:
  category: tech
```

#### Output

Returns the targeted server response payload body data.

### `post`

Performs an HTTP POST request utilizing the pre-configured settings of the instance client.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>url</code></td>
      <td></td>
      <td>The relative path string or absolute endpoint link.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>data</code></td>
      <td></td>
      <td>The structured body data block submitted to the remote server.</td>
      <td>any</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>params</code></td>
      <td>URL query parameters.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>headers</code></td>
      <td>Custom HTTP headers overriding defaults.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>timeout</code></td>
      <td>Request execution timeout in milliseconds.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

#### Example

```yaml
# url
/blogs
# data
title: New post
```

#### Output

Returns the complete validation response distributed from the host.

### `put`

Performs an HTTP PUT request utilizing the pre-configured settings of the instance client.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>url</code></td>
      <td></td>
      <td>The relative path string or absolute link.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>data</code></td>
      <td></td>
      <td>The data payload transferred to the server destination.</td>
      <td>any</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>params</code></td>
      <td>URL query parameters.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>headers</code></td>
      <td>Custom HTTP headers.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>timeout</code></td>
      <td>Request execution timeout in milliseconds.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

#### Output

Returns the status verification data delivered from the endpoint.

### `patch`

Performs an HTTP PATCH request utilizing the pre-configured settings of the instance client.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>url</code></td>
      <td></td>
      <td>The relative path string or absolute link.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>data</code></td>
      <td></td>
      <td>The partial modification payload.</td>
      <td>any</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>params</code></td>
      <td>URL query parameters.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>headers</code></td>
      <td>Custom HTTP headers.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>timeout</code></td>
      <td>Request execution timeout in milliseconds.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

#### Output

Returns the modified data block confirmed by the remote system.

### `delete`

Performs an HTTP DELETE request utilizing the pre-configured settings of the instance client.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>url</code></td>
      <td></td>
      <td>The relative path string or absolute link targeting a resource.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>params</code></td>
      <td>URL query parameters.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>headers</code></td>
      <td>Custom HTTP headers.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>timeout</code></td>
      <td>Request execution timeout in milliseconds.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

#### Output

Returns the action log execution confirmation metrics from the host server.

### `head`

Performs an HTTP HEAD request utilizing the pre-configured settings of the instance client.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>url</code></td>
      <td></td>
      <td>The relative path string or absolute link.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>params</code></td>
      <td>URL query parameters.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>headers</code></td>
      <td>Custom HTTP headers.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>timeout</code></td>
      <td>Request execution timeout in milliseconds.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

#### Output

Returns the standalone collection of tracking headers dispatched by the host server.

### `options`

Performs an HTTP OPTIONS request utilizing the pre-configured settings of the instance client.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th width="120">Key</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>url</code></td>
      <td></td>
      <td>The relative path string or absolute link.</td>
      <td>string</td>
    </tr>
    <tr>
      <td><code>options</code></td>
      <td><code>params</code></td>
      <td>URL query parameters.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>headers</code></td>
      <td>Custom HTTP headers.</td>
      <td>object</td>
    </tr>
    <tr>
      <td></td>
      <td><code>timeout</code></td>
      <td>Request execution timeout in milliseconds.</td>
      <td>integer</td>
    </tr>
  </tbody>
</table>

#### Output

Returns the communication rule matrix supported by the resource server.

## Tips and tricks

### Automatic parameter formatting fallback

When executing functions using either the static utilities or the instance methods, passing a flat object straight into the `options` field without defining specific top-level routing namespaces like `params` or `headers` triggers a backward compatibility handler. The processor automatically intercepts this block and remaps the flat object into a nested query object assigned directly to `params`.

### Intercepted error mappings

If a remote service triggers a network fault or issues an evaluation code matching an HTTP error range (such as `404` or `500`), the adapter aggregates the context details. It throws an error compiling the technical status code value and matching text strings, while attaching the original payload response inside the execution error cause.
