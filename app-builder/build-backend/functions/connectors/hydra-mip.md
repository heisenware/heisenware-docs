# Hydra MIP

The Hydra MIP connector communicates with the MPDV Hydra Manufacturing Integration Platform (MIP). It abstracts the underlying API into a unified layer, supporting both legacy Hydra 8 dialog transactions and modern MIP 2.0 Shop Floor Connectivity Services (SCS). The connector automatically detects the backend version at runtime and routes requests dynamically.

This connector requires [instance creation](./#instance-creation) before you can manage sessions or execute transactions against a specific MIP server.

## Connection and lifecycle

### `create` (instance)

Creates a client instance configured to communicate with a specific MIP server.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>url</code></td><td>The endpoint URL of the target MIP server.</td><td>string</td></tr><tr><td></td><td><code>username</code></td><td>The username used for authentication.</td><td>string</td></tr><tr><td></td><td><code>password</code></td><td>The password used for authentication.</td><td>string</td></tr><tr><td></td><td><code>accessId</code></td><td>An 8-digit ID identifying the client application, left-padded with zeros if necessary.</td><td>string</td></tr><tr><td></td><td><code>rejectUnauthorized</code></td><td>Set to false to temporarily disable rejection of untrusted server certificates. Default true.</td><td>boolean</td></tr><tr><td><code>caPath</code></td><td></td><td>An optional absolute path to a root CA <code>.pem</code> file for internal TLS.</td><td>string</td></tr></tbody></table>

{% hint style="info" %}
Right-click the `options` input and mark it as a secret to mask the password.
{% endhint %}

#### Example

```yaml
# options
url: https://my-mip-server.com:8080
username: myuser
password: mysecretpassword
accessId: '00123456'
```

#### Output

Returns the name of the created instance.

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

Terminates the open session on the MIP server and clears active cookies. Without an explicit logout, open sessions terminate automatically after 30 minutes.

#### Parameters

None.

#### Output

Returns `true` upon successful session termination, or `false` if it fails.

### `delete` (instance)

Removes the MIP client instance and its connection configuration. Not to be confused with [`delete` (record)](hydra-mip.md#delete-record), which removes a service record on the MIP server.

{% hint style="danger" %}
#### Irreversible action

Deleting an instance removes its configuration. To communicate with the server again, you must trigger `create` anew.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` upon removal.

## Low-level service CRUD

### `getAllServices`

Lists all data-layer services registered on the connected server.

#### Parameters

None.

#### Output

Returns an array of service name strings.

### `create` (record)

Creates a new instance record for a given service type. Not to be confused with [`create` (instance)](hydra-mip.md#create-instance), which creates the connector instance.

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

### `delete` (record)

Removes an existing service instance record.

{% hint style="danger" %}
#### Irreversible action

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

### `finishOperation`

Finishes an operation (Arbeitsgang beenden/abmelden) and optionally posts produced quantities.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>orderId</code></td><td>The order identifier. Legacy acronym fallback: <code>anr</code>.</td><td>string</td></tr><tr><td></td><td><code>operationId</code></td><td>The operation identifier. Legacy acronym fallback: <code>avnr</code>.</td><td>string</td></tr><tr><td></td><td><code>workplaceId</code></td><td>The workplace or machine identifier. Legacy acronym fallback: <code>mnr</code>.</td><td>string</td></tr><tr><td></td><td><code>personId</code></td><td>The person identifier. Legacy acronym fallback: <code>pnr</code>.</td><td>string</td></tr><tr><td></td><td><code>yield</code></td><td>The produced good quantity. Legacy acronym fallback: <code>egrGut</code>.</td><td>integer</td></tr><tr><td></td><td><code>scrap</code></td><td>The produced scrap quantity. Legacy acronym fallback: <code>egrAus</code>.</td><td>integer</td></tr><tr><td></td><td><code>scrapReason</code></td><td>The reason code for scrap. Legacy acronym fallback: <code>eggAus</code>.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# options
orderId: '0004990701'
operationId: '10'
workplaceId: '4560'
yield: 100
scrap: 5
scrapReason: 1
```

#### Output

Returns `true` on success. Throws an error if the transaction fails.

### `interruptOperation`

Interrupts a registered operation (Arbeitsgang unterbrechen), for example for breaks or shift ends where the job is not yet complete. Optionally posts partial quantities.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>orderId</code></td><td>The order identifier. Legacy acronym fallback: <code>anr</code>.</td><td>string</td></tr><tr><td></td><td><code>operationId</code></td><td>The operation identifier. Legacy acronym fallback: <code>avnr</code>.</td><td>string</td></tr><tr><td></td><td><code>workplaceId</code></td><td>The workplace or machine identifier. Legacy acronym fallback: <code>mnr</code>.</td><td>string</td></tr><tr><td></td><td><code>personId</code></td><td>The person identifier. Legacy acronym fallback: <code>pnr</code>.</td><td>string</td></tr><tr><td></td><td><code>yield</code></td><td>The partial yield quantity. Legacy acronym fallback: <code>egrGut</code>.</td><td>integer</td></tr><tr><td></td><td><code>scrap</code></td><td>The partial scrap quantity. Legacy acronym fallback: <code>egrAus</code>.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# options
orderId: '0004990701'
workplaceId: '4560'
yield: 50
```

#### Output

Returns `true` on success. Throws an error if the transaction fails.

### `reportPartialQuantity`

Posts produced part quantities (Teilrückmeldung), including good parts and scrap, for an active operation.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>orderId</code></td><td>The order identifier. Legacy acronym fallback: <code>anr</code>.</td><td>string</td></tr><tr><td></td><td><code>operationId</code></td><td>The operation identifier. Legacy acronym fallback: <code>avnr</code>.</td><td>string</td></tr><tr><td></td><td><code>workplaceId</code></td><td>The workplace or machine identifier. Legacy acronym fallback: <code>mnr</code>.</td><td>string</td></tr><tr><td></td><td><code>personId</code></td><td>The person identifier. Legacy acronym fallback: <code>pnr</code>.</td><td>string</td></tr><tr><td></td><td><code>cardId</code></td><td>The card identifier. Legacy acronym fallback: <code>knr</code>.</td><td>string</td></tr><tr><td></td><td><code>yield</code></td><td>The produced good quantity. Legacy acronym fallback: <code>egrGut</code>.</td><td>integer</td></tr><tr><td></td><td><code>scrap</code></td><td>The produced scrap quantity. Legacy acronym fallback: <code>egrAus</code>.</td><td>integer</td></tr><tr><td></td><td><code>scrapReason</code></td><td>The reason code for scrap. Legacy acronym fallback: <code>eggAus</code>.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# options
orderId: 'AAA2100473100200'
workplaceId: '60610'
personId: '11111'
yield: 100
scrap: 2
scrapReason: 1
```

#### Output

Returns `true` on success. Throws an error if the transaction fails.

## Workplaces, resources, and personnel

### `getWorkplaces`

Reads workplaces and machines. This high-level convenience function applies default fields, associations, and filtering on top of the generic `read` function.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="200">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>filter</code></td><td>Additional user-defined filters.</td><td>any</td></tr><tr><td></td><td><code>fields</code></td><td>Restricts the evaluation to specific columns.</td><td>array</td></tr><tr><td></td><td><code>includeStatusAssignments</code></td><td>Includes corresponding status assignments. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>includeGroups</code></td><td>Includes corresponding capacity groups. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>skipNull</code></td><td>When true, omits null attributes from the return value. Default false.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns an array of workplace objects including identifiers, designations, and current status information.

### `getResources`

Reads resources such as tools, equipment, and gages. Without a `type`, the function returns all resources that are not workplaces.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>type</code></td><td>An optional specific resource type (such as <code>TOOL</code> or <code>GAGE</code>).</td><td>string</td></tr><tr><td></td><td><code>filter</code></td><td>Additional user-defined filters.</td><td>any</td></tr><tr><td></td><td><code>fields</code></td><td>Restricts the evaluation to specific columns.</td><td>array</td></tr><tr><td></td><td><code>skipNull</code></td><td>When true, omits null attributes from the return value. Default false.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns an array of resource objects matching the query.

### `getPersons`

Retrieves personnel details and aggregates data from multiple MIP-HR services into a single object per person, optionally enriched with qualifications and workplace assignments.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="200">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>filter</code></td><td>Filters for the person list.</td><td>any</td></tr><tr><td></td><td><code>fields</code></td><td>Specific fields to retrieve for the person.</td><td>array</td></tr><tr><td></td><td><code>includeQualifications</code></td><td>Includes assigned qualifications. Default true.</td><td>boolean</td></tr><tr><td></td><td><code>includeAssignments</code></td><td>Includes current workplace assignments. Default true.</td><td>boolean</td></tr><tr><td></td><td><code>includeClockingStatus</code></td><td>Includes live attendance data. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>skipNull</code></td><td>When true, omits null attributes from the return value. Default false.</td><td>boolean</td></tr></tbody></table>

#### Example

```yaml
# options
filter: { personLastname: Smith }
includeQualifications: true
includeAssignments: false
```

#### Output

Returns an array of person objects, or an empty array if no person matches.

## Dialogs and raw calls

### `runDialog`

Runs a named dialog with a set of key-value pairs.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>dialogName</code></td><td></td><td>The name of the dialog (such as <code>A_AN</code>).</td><td>string</td></tr><tr><td><code>options</code></td><td></td><td>The key-value parameters for the dialog. Add <code>dryRun: true</code> to receive the generated dialog string without sending it.</td><td>object</td></tr></tbody></table>

#### Output

Returns the raw dialog response of the MIP server, or the generated dialog string when `dryRun` is set.

### `rawServiceCall`

Executes a raw service call for advanced use cases. The parameters map directly to the MIP Service Interface specification.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The service URL to call (such as <code>/data/MDUnits/list</code>).</td><td>string</td></tr><tr><td><code>options</code></td><td><code>params</code></td><td>A list of filter parameter objects with <code>acronym</code>, <code>operator</code>, and <code>value</code>.</td><td>array</td></tr><tr><td></td><td><code>columns</code></td><td>The selected columns.</td><td>array</td></tr><tr><td></td><td><code>requestId</code></td><td>The request ID.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# url
/data/MDUnits/list
# options
params: [{ acronym: units.unit, operator: EQUAL, value: C }]
```

#### Output

Returns the raw response of the MIP server.

### `rawDialogCall`

Executes a raw dialog call by sending the complete dialog string.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>dialogString</code></td><td>The complete dialog string to send.</td><td>string</td></tr></tbody></table>

#### Output

Returns the raw response of the MIP server.
