# SAP Digital Manufacturing

{% hint style="info" %}
This connector is currently a beta feature.
{% endhint %}

The SAP Digital Manufacturing connector provides a client wrapper for the SAP Digital Manufacturing cloud API. It handles the OAuth2 authentication flow and provides methods to interact with the API, such as reading data from standard endpoints and querying Managed Data Objects (MDO) via OData. Managing these interactions requires creating an instance for each specific SAP Digital Manufacturing tenant.

### create
Instantiates a configuration instance for the SAP Digital Manufacturing client to connect to a specific tenant API.

#### Parameters
<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>publicApiEndpoint</code></td><td>The base URL endpoint for the target digital manufacturing API, such as <code>https://api.eu20.dmc.cloud.sap</code>. Required.</td><td>string</td></tr><tr><td></td><td><code>authUrl</code></td><td>The full URL of the OAuth token endpoint provided by the authentication service. Required.</td><td>string</td></tr><tr><td></td><td><code>clientId</code></td><td>The OAuth client ID used for application authentication. Required.</td><td>string</td></tr><tr><td></td><td><code>clientSecret</code></td><td>The OAuth client secret used for application authentication. Required.</td><td>string</td></tr></tbody></table>

#### Output
Instantiates the client configuration profile.

#### Example
```yaml
# options
publicApiEndpoint: [https://api.eu20.dmc.cloud.sap](https://api.eu20.dmc.cloud.sap)
authUrl: [https://my-subaccount.authentication.eu20.hana.ondemand.com/oauth/token](https://my-subaccount.authentication.eu20.hana.ondemand.com/oauth/token)
clientId: sb-abc123def456!xyz
clientSecret: my-very-secret-key-!@#$
```

---

### `canCommunicate`
Verifies communication with the cloud API endpoint using the configured credentials.

#### Parameters
None.

#### Output
Returns `true` if the authentication flow and a test request to the root API endpoint succeed, otherwise `false`.

---

### `read`
Performs a generic GET request against standard REST API endpoints within the digital manufacturing suite.

#### Parameters
<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>path</code></td><td>The relative API path of the destination endpoint, such as <code>/order/v1/orders</code>. Required.</td><td>string</td></tr><tr><td><code>params</code></td><td>Optional query parameters specified as key-value pairs appended to the generated URL.</td><td>object</td></tr></tbody></table>

#### Output
Returns the parsed JSON response object from the API endpoint, or throws an error if the request fails.

#### Examples

##### Example 1: Read work centers
```yaml
# path
/resource/v1/workcenters
# params
plant: 1710
```

##### Example 2: Read production order details
```yaml
# path
/order/v1/orders
# params
plant: 1710
order: '1000456'
```

---

### `readMdo`
Queries a Managed Data Object (MDO) using the OData protocol to read custom master data tables.

#### Parameters
<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>entityPath</code></td><td>The OData entity path for the targeted object, such as <code>/ToolMDOs</code>. Required.</td><td>string</td></tr><tr><td><code>query</code></td><td>An optional OData query string used to filter, sort, or select specific data fields, such as <code>?$top=10</code>. Default empty string.</td><td>string</td></tr></tbody></table>

#### Output
Returns the parsed JSON response object from the OData service, or throws an error if the read operation fails.

#### Examples

##### Example 1: Read entries with a top limit
```yaml
# entityPath
/ToolMDOs
# query
?$top=5
```

##### Example 2: Read a specific entry by identifier
```yaml
# entityPath
/ToolMDOs('TOOL-001')
```

##### Example 3: Filter entries and select specific fields
```yaml
# entityPath
/ToolMDOs
# query
?$filter=toolType eq 'DRILL'&select=toolId,description,wear
```
