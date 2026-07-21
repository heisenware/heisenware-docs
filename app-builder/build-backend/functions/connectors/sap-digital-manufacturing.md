---
description: Beta Feature
---

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

{% hint style="info" %}
Right-click the `options` input and mark it as a secret to mask the credentials.
{% endhint %}

#### Output

Returns the name of the created instance.

#### Example

```yaml
# options
publicApiEndpoint: https://api.eu20.dmc.cloud.sap
authUrl: https://my-subaccount.authentication.eu20.hana.ondemand.com/oauth/token
clientId: sb-abc123def456!xyz
clientSecret: my-very-secret-key-!@#$
```

### `canCommunicate`

Checks whether communication with the cloud API is operational and authenticated.

#### Parameters

None.

#### Output

Returns `true` if communication succeeds, or `false` if it fails.

### `delete`

Removes the instance and its connection configuration.

{% hint style="danger" %}
#### Irreversible action

Deleting an instance removes its configuration. To communicate with the API again, you must trigger `create` anew.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` upon removal.

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

_Generated URL: `.../resource/v1/workcenters?plant=1710`_

**Example 2: Read production order details**

```yaml
# path
/order/v1/orders
# params
plant: 1710
order: '1000456'
```

_Generated URL: `.../order/v1/orders?plant=1710&order=1000456`_

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

_Generated URL: `.../ToolMDOs?$top=5`_

**Example 2: Read a specific entry by identifier**

```yaml
# entityPath
/ToolMDOs('TOOL-001')
```

_Generated URL: `.../ToolMDOs('TOOL-001')`_

**Example 3: Filter entries and select specific fields**

```yaml
# entityPath
/ToolMDOs
# query
?$filter=toolType eq 'DRILL'&$select=toolId,description,wear
```

_Generated URL: `.../ToolMDOs?$filter=toolType%20eq%20'DRILL'&$select=toolId,description,wear`_
