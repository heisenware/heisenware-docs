# HTTP / REST

The `Http` class is a versatile client for making HTTP requests to web servers and APIs. It can be used in two distinct ways:

1. Static Functions: For making simple, one-off requests without any pre-configuration. You can call functions like `Http.get()` directly.
2. Instance-Based Client: For interacting with a specific API that requires common settings like a base URL or authentication headers. You first create a client instance and then call methods on it.

## Static Functions

Use these functions for quick, single requests. You do not need to create an instance of the `Http` class.

### get

Performs an HTTP GET request.

Parameters

* `url`: The full URL to request.
* `options`: An optional object for configuration.
  * `params`: An object of URL query parameters.
  * `headers`: An object of custom request headers.
  * `timeout`: Request timeout in milliseconds.
  * `auth`: An object with `username` and `password` for Basic Authentication.

Example: Get weather data with URL parameters

```yaml
# url
https://api.open-meteo.com/v1/forecast
# options
params: {
  latitude: 53.55,
  longitude: 9.99,
  hourly: [temperature_2m, rain],
  forecast_days: 1
}
```

Output

The data payload from the server's response, typically a JSON object or array.

### post

Performs an HTTP POST request.

Parameters

* `url`: The full URL to request.
* `data`: The payload to send in the request body (e.g., a JSON object).
* `options`: An optional configuration object (see `get` for details).

Example: Post a new blog entry

```yaml
# url
https://api.example.com/blogs
# data
title: New Blog Post
content: This is the content.
```

Output

The full response object from the server.

### put

Performs an HTTP PUT request.

Parameters

* `url`: The full URL to request.
* `data`: The payload to send in the request body.
* `options`: An optional configuration object.

### patch

Performs an HTTP PATCH request.

Parameters

* `url`: The full URL to request.
* `data`: The payload to send in the request body.
* `options`: An optional configuration object.

### delete

Performs an HTTP DELETE request.

Parameters

* `url`: The full URL to request.
* `options`: An optional configuration object.

### head

Performs an HTTP HEAD request.

Output

The response object from the server, containing headers but no body.

### options

Performs an HTTP OPTIONS request.

Output

The response object from the server, typically containing information about the communication options available.

## Instance-Based Client

Use this approach when you need to make several calls to the same API, especially if it requires authentication. Creating an instance allows you to define a base URL and default headers that will be used for all subsequent requests.

### create

Creates a reusable HTTP client instance with pre-configured settings.

Parameters

* `baseUrl`: The base URL that will be prepended to all requests made with this instance.
* `options`: An object for configuring default settings.
  * `headers`: An object of custom headers to be sent with every request.
  * `timeout`: A default timeout for all requests.
  * `username` / `password`: For default HTTP Basic Authentication.
  * `token`: An authentication token.
  * `isBearer`: If `true`, the token is sent as a `Bearer` token in the `Authorization` header.
  * `authHeader`: If provided, the token is sent in a custom header with this name.
  * `authParameter`: If provided, the token is sent as a URL query parameter with this name on every request.

Example: Create a client for an API requiring auth

```yaml
# baseUrl
https://api.my-rest-server.com
# options
username: myuser
password: mypassword
authHeader: X-Api-Key
token: abc123def456
```

### Instance Methods

Once you have created an instance, you can call methods like `get`, `post`, etc., on it. These methods behave similarly to their static counterparts but use the instance's pre-configured settings.

Note: The `url` for instance methods should be a relative path (e.g., `/users/123`), which will be appended to the `baseUrl`.

Example: Using an instance to make requests

Assuming an instance was created with baseUrl: 'https://api.my-rest-server.com':

*   GET Request

    ```yaml
    # url
    /blogs
    # options
    params: {
      category: 'tech'
    }
    ```

    This would make a GET request to `https://api.my-rest-server.com/blogs?category=tech`.
*   POST Request

    ```yaml
    # url
    /blogs
    # data
    title: New Post
    ```

    This would make a POST request to `https://api.my-rest-server.com/blogs`.

The instance methods `put`, `patch`, `delete`, `head`, and `options` follow the same pattern.
