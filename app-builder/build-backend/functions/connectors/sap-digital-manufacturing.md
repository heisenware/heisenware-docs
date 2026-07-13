# SAP Digital Manufacturing

{% hint style="info" %}
This connector is a beta feature.
{% endhint %}

The SAP Digital Manufacturing connector (`SapDigitalManufacturing`) communicates with the SAP Digital Manufacturing Cloud API. It manages the OAuth2 authentication flow and lets you read data from REST endpoints or query Managed Data Objects (MDO) via OData.

This connector requires [instance creation](./#instance-creation) before you can manage connection states and execute data transactions.

## Connection and lifecycle

### `create`

Creates an instance configured to communicate with a specific SAP Digital Manufacturing tenant API.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>publicApiEndpoint</code></td><td>The base URL of the target digital manufacturing API, such as <code>https://api.eu20.dmc.cloud.sap</code>.</td><td>string</td></tr><tr><td></td><td><code>authUrl</code></td><td>The URL of the OAuth token endpoint.</td><td>string</td></tr><tr><td></td><td><code>clientId</code></td><td>The OAuth client ID.</td><td>string</td></tr><tr><td></td><td><code>clientSecret</code></td><td>The OAuth client secret.</td><td>string</td></tr></tbody></table>

#### Output

Returns the SAP Digital Manufacturing client instance.

#### Example

```yaml
# options
publicApiEndpoint: [https://api.eu20.dmc.cloud.sap](https://api.eu20.dmc.cloud.sap)
authUrl: [https://my-subaccount.authentication.eu20.hana.ondemand.com/oauth/token](https://my-subaccount.authentication.eu20.hana.ondemand.com/oauth/token)
clientId: sb-abc123def456!xyz
clientSecret: my-very-secret-key-!@#$
```

### `canCommunicate`

Checks whether communication with the cloud API is operational and authenticated.

#### Parameters

None.

#### Output

Returns `true` if communication succeeds, or `false` if it fails.

## Data operations

### `read`

Executes a GET request against standard SAP Digital Manufacturing REST endpoints.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>path</code></td><td>The relative API path of the endpoint, such as <code>/order/v1/orders</code>.</td><td>string</td></tr><tr><td><code>params</code></td><td>Query parameters specified as key-value pairs appended to the URL.</td><td>object</td></tr></tbody></table>

#### Output

Returns a parsed JSON object containing the API response. Throws an error on failure.

#### Examples

**Example 1: Read work centers**

```yaml
# path
/resource/v1/workcenters
# params
plant: 1710
```

**Example 2: Read production order details**

```yaml
# path
/order/v1/orders
# params
plant: 1710
order: '1000456'
```

### `readMdo`

Queries a Managed Data Object (MDO) via OData to read custom master data tables.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>entityPath</code></td><td>The OData entity path for the target object, such as <code>/ToolMDOs</code>.</td><td>string</td></tr><tr><td><code>query</code></td><td>An OData query string to filter, sort, or select fields, such as <code>?$top=10</code>. Default empty string.</td><td>string</td></tr></tbody></table>

#### Output

Returns a parsed JSON object containing the OData response. Throws an error on failure.

#### Examples

**Example 1: Read entries with a top limit**

```yaml
# entityPath
/ToolMDOs
# query
?$top=5
```

**Example 2: Read a specific entry by identifier**

```yaml
# entityPath
/ToolMDOs('TOOL-001')
```

**Example 3: Filter entries and select specific fields**

```yaml
# entityPath
/ToolMDOs
# query
?$filter=toolType eq 'DRILL'&select=toolId,description,wear
```
