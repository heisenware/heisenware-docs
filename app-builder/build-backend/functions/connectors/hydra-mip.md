# Hydra MIP

The Hydra MIP connector communicates with the MPDV Hydra Manufacturing Integration Platform (MIP). It abstracts the underlying API into a unified layer, supporting both legacy Hydra 8 dialog transactions and modern MIP 2.0 Shop Floor Connectivity Services (SCS). The connector automatically detects the backend version at runtime and routes requests dynamically.

This connector requires [instance creation](./#instance-creation) before you can manage sessions or execute transactions against a specific MIP server.

## Connection and lifecycle

### `create`

Creates a client instance configured to communicate with a specific MIP server.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>url</code></td><td>The endpoint URL of the target MIP server.</td><td>string</td></tr><tr><td></td><td><code>username</code></td><td>The username used for authentication.</td><td>string</td></tr><tr><td></td><td><code>password</code></td><td>The password used for authentication.</td><td>string</td></tr><tr><td></td><td><code>accessId</code></td><td>The access tracking credential string.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# options
url: [https://mpdv-mip-test05.mpdv.cloud:8080](https://mpdv-mip-test05.mpdv.cloud:8080)
username: heisenware
password: Samx1ngSeeCrt
accessId: '302127'
```

#### Output

Returns the MIP client instance. Throws an error if configuration fails.

### `canCommunicate`

Checks whether communication with the MIP server is operational and authenticated.

#### Parameters

None.

#### Output

Returns `true` if communication succeeds, or `false` if it fails.

### `getMipVersion`

Retrieves the runtime strategy description of the connected backend.

#### Parameters

None.

#### Output

Returns `'Hydra X / MIP 2.0 (SCS)'` or `'Hydra 8 / MIP 1.x (Legacy)'`.

### `isMip2`

Determines if the current backend supports modern MIP 2.0 architectures.

#### Parameters

None.

#### Output

Returns `true` if the backend supports MIP 2.0, or `false` if it does not.

### `logout`

Terminates the open session on the MIP server and clears active cookies.

#### Parameters

None.

#### Output

Returns `true` upon successful session termination, or `false` if it fails.

## Low-level service CRUD

### `getAllServices`

Lists all data-layer services registered on the connected server.

#### Parameters

None.

#### Output

Returns an array of service name strings.

### `create`

Creates a new instance record for a given service type.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name (such as <code>MDUnits</code>, <code>BOOperation</code>, or <code>BOPerson</code>).</td><td>string</td></tr><tr><td><code>data</code></td><td>The data payload for the creation transaction. Use <code>getCreateParameters</code> to look up mandatory attributes.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# serviceName
MDUnits
# data
unitsUnit: T
unitsClassification: Test
unitsDesignation: A fake test unit
```

#### Output

Returns `true` on success. Throws an error if the transaction fails.

### `read`

Queries records from a given service with options for filtering and field selection.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td></td><td>The service name.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>filter</code></td><td>Filters records based on specific criteria. Accepts a simple array like <code>['field', '=', 'val']</code>, an object like <code>{ field: 'val' }</code>, or nested arrays. MIP does not support OR logic.</td><td>any</td></tr><tr><td></td><td><code>fields</code></td><td>Restricts the evaluation to specific columns.</td><td>array</td></tr><tr><td></td><td><code>skipNull</code></td><td>When true, omits null attributes from the return value. Default false.</td><td>boolean</td></tr></tbody></table>

#### Example

```yaml
# serviceName
MDUnits
# options
filter: [unitsDigits, '>', 1]
fields: [unitsUnit, unitsDesignation]
skipNull: true
```

#### Output

Returns an array of parsed data objects matching the query.

### `update`

Modifies an existing service instance record.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr><tr><td><code>data</code></td><td>The data update block. This block must include the mandatory primary keys required to identify the row.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# serviceName
MDUnits
# data
unitsUnit: C
unitsClassification: Temp
unitsDesignation: Degree Celsius
```

#### Output

Returns `true` on a successful update. Throws an error if the operation fails.

### `delete`

Removes an existing service instance record.

{% hint style="danger" %}
#### Destructive action

This permanently deletes the service instance record from the server. You cannot undo this action.
{% endhint %}

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr><tr><td><code>data</code></td><td>Mandatory identification payload required to resolve the specific instance.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# serviceName
MDUnits
# data
unitsUnit: T
unitsClassification: Test
```

#### Output

Returns `true` on a successful deletion. Throws an error if the operation fails.

### `execute`

Invokes a specific processing action on a target service.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr><tr><td><code>data</code></td><td>The parameters required for execution. Keys must match the service definition.</td><td>object</td></tr></tbody></table>

#### Output

Returns `true` on a successful execution. Throws an error if the action fails.

## Metadata inspection

### `getCreateParameters`

Queries the parameters needed to create records for a specified service.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr></tbody></table>

#### Output

Returns an object mapping camelCase attributes to their lowercase data types. Mandatory parameters include a `*` suffix.

### `getReadParameters`

Queries the schema parameters available for retrieval from a service.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr></tbody></table>

#### Output

Returns an object mapping readable camelCase fields to their lowercase data types.

### `getUpdateParameters`

Queries the schema guidelines for updating records inside a service.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr></tbody></table>

#### Output

Returns an object mapping updatable attributes to data types, with mandatory lookup attributes marked with a `*` suffix.

### `getExecuteParameters`

Queries the validation constraints needed for executing functions on a service.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr></tbody></table>

#### Output

Returns an object mapping functional input tags to data types.

### `getDeleteParameters`

Queries the minimal mandatory parameter requirements to delete a service instance.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr></tbody></table>

#### Output

Returns an object highlighting mandatory row identification fields.

### `getReadableFields`

Lists all column elements explicitly exposed as selectable output fields.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of objects mapping selectable keys to their lowercase types.

## Order management (MIP-WO)

### `getOrders`

Fetches production orders and enriches them with active operations, BOM components, and allocated tools.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>filter</code></td><td>Filters the orders to retrieve. Evaluates an array or object expression.</td><td>any</td></tr><tr><td></td><td><code>fields</code></td><td>Appends custom attributes to the default return payload.</td><td>array</td></tr><tr><td></td><td><code>includeOperations</code></td><td>Includes corresponding operations. Default true.</td><td>boolean</td></tr><tr><td></td><td><code>includeComponents</code></td><td>Includes related component requirements. Default true.</td><td>boolean</td></tr><tr><td></td><td><code>includeProductionResources</code></td><td>Includes related tool records. Default true.</td><td>boolean</td></tr></tbody></table>

#### Example

```yaml
# options
filter: { orderId: JR150702 }
includeOperations: false
fields: [ordertypeActive]
```

#### Output

Returns an array of complex order structures.

### `getOrder`

Fetches details for an isolated order instance.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>orderId</code></td><td></td><td>The unique order ID string.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>fields</code></td><td>Specifies explicit fields to fetch. If empty, all available fields return.</td><td>array</td></tr></tbody></table>

#### Example

```yaml
# orderId
'4711'
# options
fields: [orderId, orderDesignation, orderPlanStartTimestamp]
```

#### Output

Returns an order object, or `null` if the order is not found.

### `startOperation`

Registers an operation log-on transaction (Arbeitsgang anmelden).

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>orderId</code></td><td>The order identifier. Legacy acronym fallback: <code>anr</code>.</td><td>string</td></tr><tr><td></td><td><code>operationId</code></td><td>The operation identifier. Legacy acronym fallback: <code>avnr</code>.</td><td>string</td></tr><tr><td></td><td><code>workplaceId</code></td><td>The workplace or machine identifier. Legacy acronym fallback: <code>mnr</code>.</td><td>string</td></tr><tr><td></td><td><code>personId</code></td><td>The person identifier. Legacy acronym fallback: <code>pnr</code> or <code>usr</code>.</td><td>string</td></tr><tr><td></td><td><code>cardId</code></td><td>The card identifier. Legacy acronym fallback: <code>knr</code>.</td><td>string</td></tr><tr><td></td><td><code>batchId</code></td><td>The batch identifier. Legacy acronym fallback: <code>cnr</code>.</td><td>string</td></tr><tr><td></td><td><code>mst</code></td><td>The target machine status code (Legacy specific).</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# options
orderId: '0004990701'
operationId: '10'
workplaceId: '4560'
personId: '2998'
```

#### Output

Returns `true` on successful registration. Throws an error if the transaction fails.
