# Hydra MIP

The Hydra MIP connector communicates with the MPDV Hydra Manufacturing Integration Platform (MIP). It abstracts the underlying API into a unified layer, supporting both legacy Hydra 8 dialog transactions and modern MIP 2.0 Shop Floor Connectivity Services (SCS). The connector automatically detects the backend capability at runtime and routes requests dynamically.

Create an instance of the `Mip` class to manage sessions and execute transactions against a specific MIP server.

## Connection and lifecycle

### `create`

Constructs a Mip instance and initializes communication with the designated MIP server. The constructor establishes session lifecycle triggers and configures TLS security mappings.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>credentials</code></td><td><code>url</code></td><td>The base URL of the target MIP server.</td><td>string</td></tr><tr><td></td><td><code>username</code></td><td>The username for authentication.</td><td>string</td></tr><tr><td></td><td><code>password</code></td><td>The password for authentication.</td><td>string</td></tr><tr><td></td><td><code>accessId</code></td><td>An 8-digit client identifier, left-padded with zeros if necessary.</td><td>string</td></tr><tr><td></td><td><code>rejectUnauthorized</code></td><td>Enables or disables strict TLS server certificate verification. Default <code>true</code>.</td><td>boolean</td></tr><tr><td><code>caPath</code></td><td></td><td>Optional absolute file path to a root CA certificate (.pem file) for internal TLS resolution.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# credentials
url: [https://mpdv-mip-test05.mpdv.cloud:8080](https://mpdv-mip-test05.mpdv.cloud:8080)
username: heisenware
password: Samx1ngSeeCrt
accessId: '302127'
rejectUnauthorized: true
# caPath
'/shared/certificates/rootCA.pem'
```

### `canCommunicate`

Checks whether communication with the MIP server is operational and authenticated.

#### Parameters

None.

#### Output

Returns `true` if communication succeeds, otherwise `false`.

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

Returns `true` if MIP 2.0 is supported, otherwise `false`.

### `logout`

Explicitly terminates the open session on the MIP server and clears active cookies.

#### Parameters

None.

#### Output

Returns `true` upon successful session termination, otherwise `false`.

## Low-level service CRUD

### `getAllServices`

Lists all data-layer services registered on the connected server.

#### Parameters

None.

#### Output

An array of service name strings.

### `create`

Creates a new instance record for a given service type.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name (such as <code>MDUnits</code>, <code>BOOperation</code>, <code>BOPerson</code>).</td><td>string</td></tr><tr><td><code>data</code></td><td>The data payload for the creation transaction. Use <code>getCreateParameters</code> to look up mandatory attributes.</td><td>object</td></tr></tbody></table>

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

Returns `true` on success or throws an error on failure.

### `read`

Queries records from a given service with options for filtering and field selection.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td></td><td>The service name.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>filter</code></td><td>Filters records based on specific criteria. Accepts a simple array <code>['field', '=', 'val']</code>, an object <code>{ field: 'val' }</code>, or nested arrays. MIP does not support OR logic.</td><td>any</td></tr><tr><td></td><td><code>fields</code></td><td>Restricts the evaluation to specific columns.</td><td>array</td></tr><tr><td></td><td><code>skipNull</code></td><td>When <code>true</code>, omits null attributes from the return value. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

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

An array of parsed data objects.

### `update`

Modifies an existing service instance record.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr><tr><td><code>data</code></td><td>The data update block. Must include the mandatory primary keys required to identify the row.</td><td>object</td></tr></tbody></table>

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

Returns `true` on success.

### `delete`

Removes an existing service instance record.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr><tr><td><code>data</code></td><td>Mandatory identification payload required to resolve the specific instance.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# serviceName
MDUnits
# data
unitsUnit: T
unitsClassification: Test
```

#### Output

Returns `true` on success.

### `execute`

Invokes a specific processing action on a target service.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr><tr><td><code>data</code></td><td>The parameters required for execution. Keys must match the service definition.</td><td>object</td></tr></tbody></table>

#### Output

Returns `true` on success.

## Metadata inspection

### `getCreateParameters`

Queries the parameters needed to create records for a specified service.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr></tbody></table>

#### Output

An object mapping camelCase attributes to their lowercase data types. Mandatory parameters have a `*` suffix.

### `getReadParameters`

Queries the schema parameters available for retrieval from a service.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr></tbody></table>

#### Output

An object mapping readable camelCase fields to their lowercase data types.

### `getUpdateParameters`

Queries the schema guidelines for updating records inside a service.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr></tbody></table>

#### Output

An object mapping updatable attributes to data types, with mandatory lookup attributes marked with a `*` suffix.

### `getExecuteParameters`

Queries the validation constraints needed for executing functions on a service.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr></tbody></table>

#### Output

An object mapping functional input tags to data types.

### `getDeleteParameters`

Queries the minimal mandatory parameter requirements to delete a service instance.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr></tbody></table>

#### Output

An object highlighting mandatory row identification fields.

### `getReadableFields`

Lists all column elements explicitly exposed as selectable output fields.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr></tbody></table>

#### Output

An array of objects mapping selectable keys to their lowercase types.

## Order management (MIP-WO)

### `getOrders`

Fetches production orders and enriches them with active operations, BOM components, and allocated tools.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>filter</code></td><td>Filters the orders to retrieve. Evaluates an array or object expression.</td><td>any</td></tr><tr><td></td><td><code>fields</code></td><td>Appends custom attributes to the default return payload.</td><td>array</td></tr><tr><td></td><td><code>includeOperations</code></td><td>Includes corresponding operations. Default <code>true</code>.</td><td>boolean</td></tr><tr><td></td><td><code>includeComponents</code></td><td>Includes related component requirements. Default <code>true</code>.</td><td>boolean</td></tr><tr><td></td><td><code>includeProductionResources</code></td><td>Includes related tool records. Default <code>true</code>.</td><td>boolean</td></tr></tbody></table>

#### Example

```yaml
# options
filter: { orderId: JR150702 }
includeOperations: false
fields: [ordertypeActive]
```

#### Output

An array of complex order structures.

### `getOrder`

Fetches details for an isolated order instance.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>orderId</code></td><td></td><td>The unique order ID string.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>fields</code></td><td>Specifies explicit fields to fetch. If empty, all available fields return.</td><td>array</td></tr></tbody></table>

#### Example

```yaml
# orderId
'4711'
# options
fields: [orderId, orderDesignation, orderPlanStartTimestamp]
```

#### Output

An order object, or `null` if not found.

### `startOperation`

Registers an operation log-on transaction (Arbeitsgang anmelden).

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>orderId</code></td><td>The order identifier. Legacy acronym fallback: <code>anr</code>.</td><td>string</td></tr><tr><td></td><td><code>operationId</code></td><td>The operation identifier. Legacy acronym fallback: <code>avnr</code>.</td><td>string</td></tr><tr><td></td><td><code>workplaceId</code></td><td>The workplace or machine identifier. Legacy acronym fallback: <code>mnr</code>.</td><td>string</td></tr><tr><td></td><td><code>personId</code></td><td>The person identifier. Legacy acronym fallback: <code>pnr</code> or <code>usr</code>.</td><td>string</td></tr><tr><td></td><td><code>cardId</code></td><td>The card identifier. Legacy acronym fallback: <code>knr</code>.</td><td>string</td></tr><tr><td></td><td><code>batchId</code></td><td>The batch identifier. Legacy acronym fallback: <code>cnr</code>.</td><td>string</td></tr><tr><td></td><td><code>mst</code></td><td>The target machine status code (Legacy specific).</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# options
orderId: '0004990701'
operationId: '10'
workplaceId: '4560'
personId: '2998'
```

#### Output

Returns a promise that resolves when the logon transaction is completed.

### `finishOperation`

Registers an operation log-off transaction that finishes the step (Arbeitsgang beenden).

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>orderId</code></td><td>The order identifier. Legacy acronym fallback: <code>anr</code>.</td><td>string</td></tr><tr><td></td><td><code>operationId</code></td><td>The operation identifier. Legacy acronym fallback: <code>avnr</code>.</td><td>string</td></tr><tr><td></td><td><code>workplaceId</code></td><td>The workplace identifier. Legacy acronym fallback: <code>mnr</code>.</td><td>string</td></tr><tr><td></td><td><code>personId</code></td><td>The person identifier. Legacy acronym fallback: <code>pnr</code>.</td><td>string</td></tr><tr><td></td><td><code>yield</code></td><td>Produced good quantity. Legacy acronym fallback: <code>egrGut</code>.</td><td>integer</td></tr><tr><td></td><td><code>scrap</code></td><td>Produced scrap quantity. Legacy acronym fallback: <code>egrAus</code>.</td><td>integer</td></tr><tr><td></td><td><code>scrapReason</code></td><td>Reason code for scrap logs. Legacy acronym fallback: <code>eggAus</code>.</td><td>integer</td></tr></tbody></table>

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

Executes the close-out request and confirms completion.

### `interruptOperation`

Pauses an active operation without completing the entire work step (Arbeitsgang unterbrechen).

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>orderId</code></td><td>The order identifier (Legacy acronym: <code>anr</code>).</td><td>string</td></tr><tr><td></td><td><code>operationId</code></td><td>The operation identifier (Legacy acronym: <code>avnr</code>).</td><td>string</td></tr><tr><td></td><td><code>workplaceId</code></td><td>The workplace identifier (Legacy acronym: <code>mnr</code>).</td><td>string</td></tr><tr><td></td><td><code>personId</code></td><td>The person identifier (Legacy acronym: <code>pnr</code>).</td><td>string</td></tr><tr><td></td><td><code>yield</code></td><td>Partial good quantity achieved prior to pause (Legacy acronym: <code>egrGut</code>).</td><td>integer</td></tr><tr><td></td><td><code>scrap</code></td><td>Partial scrap quantity achieved prior to pause (Legacy acronym: <code>egrAus</code>).</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# options
orderId: '0004990701'
workplaceId: '4560'
yield: 50
```

#### Output

Concludes the pause registration workflow.

### `reportPartialQuantity`

Posts runtime performance counts and quantities without altering the operation status (Teilrückmeldung).

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>orderId</code></td><td>The order identifier (Legacy acronym: <code>anr</code>).</td><td>string</td></tr><tr><td></td><td><code>operationId</code></td><td>The operation identifier (Legacy acronym: <code>avnr</code>).</td><td>string</td></tr><tr><td></td><td><code>workplaceId</code></td><td>The workplace identifier (Legacy acronym: <code>mnr</code>).</td><td>string</td></tr><tr><td></td><td><code>personId</code></td><td>The person identifier (Legacy acronym: <code>pnr</code>).</td><td>string</td></tr><tr><td></td><td><code>cardId</code></td><td>The card identifier (Legacy acronym: <code>knr</code>).</td><td>string</td></tr><tr><td></td><td><code>yield</code></td><td>Produced good quantity (Legacy acronym: <code>egrGut</code>).</td><td>integer</td></tr><tr><td></td><td><code>scrap</code></td><td>Produced scrap quantity (Legacy acronym: `egrAus`).</td><td>integer</td></tr><tr><td></td><td><code>scrapReason</code></td><td>Scrap reason code (Legacy acronym: <code>eggAus</code>).</td><td>integer</td></tr></tbody></table>

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

Submits quantity records into the runtime database tracking engine.

### `__getOperationStatus`

Queries the live status indicators and performance progress of an active operation.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>operationId</code></td><td>The unique operation tracking identifier.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# operationId
CIOYM0010040
```

#### Output

An object detailing current counts, tracked performance duration, and normalized `statusDescription` attributes (`PREPARED`, `RUNNING`, `INTERRUPTED`, `FINISHED`, `ARCHIVED`, `DELETED`).

### `__getOperationTimeline`

Retrieves the event history logs recorded against a specified operation.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>operationId</code></td><td>The unique operation tracking identifier.</td><td>string</td></tr></tbody></table>

#### Output

A sorted timeline array of transaction event objects, with the newest records listed first.

### `__updateOrderStatus`

Updates the operational workflow flag assigned to an order.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>orderId</code></td><td>The order identifier.</td><td>string</td></tr><tr><td><code>newStatus</code></td><td>Target workflow status constraint: <code>ANG</code> (Created), <code>FREI</code> (Released), <code>SPER</code> (Locked), <code>BEEN</code> (Finished), <code>ABGS</code> (Closed), <code>STOR</code> (Cancelled).</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# orderId
'4711'
# newStatus
FREI
```

#### Output

Returns `true` on a successful change registration.

### `__setOrderPriority`

Adjusts the scheduling priority value recorded against an order.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>orderId</code></td><td>The order identifier.</td><td>string</td></tr><tr><td><code>newPriority</code></td><td>The numeric or string priority designation. Lower values map to higher urgency.</td><td>number or string</td></tr></tbody></table>

#### Output

Returns `true` on a successful change registration.

### `__rescheduleOrder`

Alters the target planning times assigned to an order.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>orderId</code></td><td>The order identifier.</td><td>string</td></tr><tr><td><code>startDate</code></td><td>Target start window timestamp formatted as an ISO 8601 string or Date object.</td><td>string or any</td></tr><tr><td><code>endDate</code></td><td>Optional target closure window timestamp formatted as an ISO 8601 string or Date object.</td><td>string or any</td></tr></tbody></table>

#### Example

```yaml
# orderId
'4711'
# startDate
2023-10-27T06:00:00
# endDate
2023-10-27T14:00:00
```

#### Output

Returns `true` on a successful change registration.

## Workplaces and resources

### `getWorkplaces`

Retrieves machine and workplace resource profiles matching type code `MNR`.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>filter</code></td><td>User-defined filters applied alongside the primary type constraint.</td><td>any</td></tr><tr><td></td><td><code>fields</code></td><td>Custom columns to retrieve.</td><td>array</td></tr><tr><td></td><td><code>includeStatusAssignments</code></td><td>Enriches results with machine status lists. Default <code>false</code>.</td><td>boolean</td></tr><tr><td></td><td><code>includeGroups</code></td><td>Enriches results with capacity group strings. Default <code>false</code>.</td><td>boolean</td></tr><tr><td></td><td><code>skipNull</code></td><td>Omits parameters containing null values. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

#### Output

An array of enriched workplace resource records.

### `getResources`

Queries active assets and production utilities other than workplaces.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>type</code></td><td>Targets explicit types (such as <code>TOOL</code>, <code>GAGE</code>). If blank, all resources excluding workplaces match.</td><td>string</td></tr><tr><td></td><td><code>filter</code></td><td>User-defined filters.</td><td>any</td></tr><tr><td></td><td><code>fields</code></td><td>Columns to select.</td><td>array</td></tr><tr><td></td><td><code>skipNull</code></td><td>Omits null fields. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

#### Output

An array of filtered resource asset objects.

### `__changeWorkplaceStatus`

Directly updates the technical status code recorded against a machine (Maschinenstatus ändern).

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>workplaceId</code></td><td>The workplace identifier (Legacy acronym: <code>mnr</code>).</td><td>string</td></tr><tr><td></td><td><code>machineStatus</code></td><td>The target status tracking identifier (Legacy acronym: <code>mst</code>).</td><td>integer</td></tr><tr><td></td><td><code>personId</code></td><td>Optional personnel number context (Legacy acronym: <code>pnr</code>).</td><td>string</td></tr><tr><td></td><td><code>cardId</code></td><td>Optional person-card tracking indicator (Legacy acronym: <code>knr</code>).</td><td>string</td></tr><tr><td></td><td><code>comment</code></td><td>Optional text comment payload (Legacy acronym: <code>bem</code>).</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# options
workplaceId: '60510'
machineStatus: 3
comment: Tool change required
```

#### Output

Pushes the status alteration and confirms execution.

## Human resources (MIP-HR)

### `getPersons`

Retrieves personnel records enhanced with assigned qualifications, structural shifts, and live attendance tracking metrics.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>filter</code></td><td>Filters applied against the base personnel list.</td><td>any</td></tr><tr><td></td><td><code>fields</code></td><td>Custom fields to return.</td><td>array</td></tr><tr><td></td><td><code>includeQualifications</code></td><td>Fetches assigned qualifications. Default <code>true</code>.</td><td>boolean</td></tr><tr><td></td><td><code>includeAssignments</code></td><td>Fetches planned workplace assignments. Default <code>true</code>.</td><td>boolean</td></tr><tr><td></td><td><code>includeClockingStatus</code></td><td>Fetches live attendance data for the current date. Default <code>false</code>.</td><td>boolean</td></tr><tr><td></td><td><code>skipNull</code></td><td>Omits null fields from results. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

#### Example

```yaml
# options
filter: { personLastname: Smith }
includeQualifications: true
includeAssignments: false
```

#### Output reply

An array of enriched person objects.

### `__getClockingStatus`

Retrieves the current Time and Attendance (PZE) state recorded for a person on the current calendar date.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>personId</code></td><td>The unique personnel tracking number.</td><td>string</td></tr></tbody></table>

#### Output

Returns a status tracking object containing state tags and chronologies:

```json
{
  "status": "PRESENT",
  "type": "K",
  "time": "2026-07-13"
}
```

{% hint style="danger" %}
#### MIP 2.0 limitation
This function is exclusively supported on MIP 2.0 strategies and throws a `MipError` if run against a legacy infrastructure.
{% endhint %}

### `__clockPerson`

Submits a Time and Attendance booking transaction (such as Clock In, Clock Out, or Break).

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>personId</code></td><td>The personnel identification number.</td><td>string</td></tr><tr><td></td><td><code>type</code></td><td>Booking type: <code>in</code>, <code>out</code>, or <code>break</code>.</td><td>string</td></tr><tr><td></td><td><code>timestamp</code></td><td>Optional specific booking time. Defaults to now.</td><td>string</td></tr><tr><td></td><td><code>cardId</code></td><td>Optional employee card identifier.</td><td>string</td></tr></tbody></table>

#### Output

Executes the transaction and confirms success. Throws an evaluation error on legacy strategies.

## Material management (MIP-MAT)

### `__bookMaterialConsumption`

Books material consumption quantities against an operational machine, order, or line operation.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>data</code></td><td><code>workplace</code></td><td>The workplace identifier where material usage occurs.</td><td>string</td></tr><tr><td></td><td><code>material</code></td><td>The material identifier.</td><td>string</td></tr><tr><td></td><td><code>quantity</code></td><td>Numeric consumption quantity value.</td><td>number</td></tr><tr><td></td><td><code>unit</code></td><td>Unit of measure.</td><td>string</td></tr><tr><td></td><td><code>orderId</code></td><td>Optional order context.</td><td>string</td></tr><tr><td></td><td><code>operationId</code></td><td>Optional operation context.</td><td>string</td></tr><tr><td></td><td><code>batchId</code></td><td>Optional batch identifier for batch-managed items.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# data
workplace: '4711'
material: RAW_STEEL_01
quantity: 15.5
unit: KG
orderId: PROD-2023-001
```

#### Output

Submits usage records via the MIP 2.0 service block or routes back to the legacy `A_MAT` dialog string on old architectures.

### `__getMaterialStock`

Aggregates inventory quantities across stock locations, buffers, and material masters.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>materialId</code></td><td>Optional identifier to isolate a specific material.</td><td>string</td></tr><tr><td></td><td><code>storageLocation</code></td><td>Optional buffer identifier to isolate a specific storage location.</td><td>string</td></tr><tr><td></td><td><code>includeZeroStock</code></td><td>Includes records showing 0 quantity if set to <code>true</code>. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

#### Example

```yaml
# options
materialId: RAW_STEEL_01
includeZeroStock: false
```

#### Output

An array of stock tracking snapshots mapped with location details:

```json
[
  {
    "material": "RAW_STEEL_01",
    "description": "Premium Grade Steel",
    "quantity": 250,
    "unit": "KG",
    "batch": "B29312",
    "location": {
      "id": "BUF_01",
      "name": "Main Production Buffer",
      "type": "STORAGE"
    }
  }
]
```

{% hint style="danger" %}
#### strategy incompatibility
This execution path is unsupported under Legacy configurations and throws an error.
{% endhint %}

## Quality management (MIP-QP)

### `__recordMeasurement`

Records an individual inspection metric value against a characteristic.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>taskId</code></td><td>The active inspection task identifier.</td><td>string</td></tr><tr><td><code>characteristicId</code></td><td>The characteristic identifier being evaluated.</td><td>string</td></tr><tr><td><code>value</code></td><td>The numeric value measured.</td><td>number</td></tr></tbody></table>

#### Example

```yaml
# taskId
IT-2023-998877
# characteristicId
DIAMETER_01
# value
15.05
```

#### Output

Submits single measurement acquisitions into the validation engine under MIP 2.0. Throws an exception on legacy backends.

### `__completeInspectionTask`

Finalizes an active inspection task to trigger usage evaluation workflows.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>taskId</code></td><td>The target inspection task identifier.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` on success. Throws an error on old strategies.

## Core services (MIP-CORE)

### `__triggerEscalation`

Dispatches generic system escalation events and formats message key elements.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>eventId</code></td><td>The escalation identifier string (such as <code>DB.FILL_LEVEL_EXCEEDED</code>).</td><td>string</td></tr><tr><td><code>variables</code></td><td>Key/value data pairs incorporated into the alert template text (maximum 30 keys).</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# eventId
DB.FILL_LEVEL_EXCEEDED
# variables
DB.FREE: '62'
DB.USED: '962'
```

#### Output

Returns `true` if processed successfully under MIP 2.0. Throws an error on legacy platforms.

### `__sendEmail`

Sends email notifications using internal MIP mail distribution modules.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>to</code></td><td>The destination email address.</td><td>string</td></tr><tr><td></td><td><code>subject</code></td><td>The email subject line.</td><td>string</td></tr><tr><td></td><td><code>message</code></td><td>The text body payload. Use <code>\n</code> for line breaks.</td><td>string</td></tr><tr><td></td><td><code>attachment</code></td><td>Optional base64 encoded document string.</td><td>string</td></tr><tr><td></td><td><code>attachmentName</code></td><td>Optional attachment file name definition.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# options
to: maintenance@example.com
subject: Machine Alert
message: Machine 4711 is down.
```

#### Output

Returns `true` if sent successfully under MIP 2.0. Throws an error on old platforms.

### `__getShopfloorServiceLogs`

Retrieves processing logs generated by Shop Floor Connectivity Services (SCS).

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>start</code></td><td>Evaluation window start parameter. Accepts ISO strings or negative relative durations (such as <code>'-15m'</code>, <code>'-2h'</code>, <code>'-1d'</code>).</td><td>string or any</td></tr><tr><td></td><td><code>stop</code></td><td>Evaluation window end parameter. Accepts ISO strings or <code>'now'</code>. Default <code>now</code>.</td><td>string or any</td></tr><tr><td></td><td><code>user</code></td><td>Optional identifier to filter tracking logs to a single user or device.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# options
start: -2h
stop: now
```

#### Output

An array of raw service log entries. Throws an error on legacy architectures.

## Raw API communication

### `rawServiceCall`

Executes unparsed network tracking queries mapped against endpoint paths.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The explicit relative target path string.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>params</code></td><td>An array of raw filters containing acronym, operator, and value definitions.</td><td>array</td></tr><tr><td></td><td><code>columns</code></td><td>Specific data column selection parameters.</td><td>array</td></tr><tr><td></td><td><code>requestId</code></td><td>Optional tracking tracking identifier.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# url
/data/MDUnits/list
# options
params:
  - acronym: units.unit
    operator: EQUAL
    value: C
```

#### Output

Returns unmapped API data elements.

### `rawDialogCall`

Directly executes raw textual legacy dialog command strings.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>dialogString</code></td><td>The complete mapped dialog message string payload.</td><td>string</td></tr></tbody></table>

#### Output

Returns the unparsed string response.

### `runDialog`

Assembles and issues custom transactional dialog parameters.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>dialogName</code></td><td></td><td>The name string code of the dialog (such as <code>A_AN</code>).</td><td>string</td></tr><tr><td><code>options</code></td><td><code>dryRun</code></td><td>If <code>true</code>, returns the compiled dialog string without submitting a network request.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns the evaluated confirmation data or the raw string block text if `dryRun` is active.

## Tips and tricks

### Implicit AND logic constraints
The data filtering interpreter processes logical parameters sequentially as implicit `AND` rules. Attempting to introduce explicit `OR` keywords or nesting logic arrays containing disjunction blocks triggers a `FILTER_ERR` runtime rejection.

### Service execution payloads vs CRUD boundaries
When calling `execute`, input payload arrays must not pass an explicit `operator` key attribute inside parameter objects. Doing so breaks the parameter validation rules applied by MIP 2.0 connectivity strategies.

### Automated session tracking timeouts
Open communication channels that are not explicitly cleared using the `logout` function remain active in an authenticated state on the remote server. These resources are cleared by automated server sweeps after a rolling 30-minute window of inactivity.
```
