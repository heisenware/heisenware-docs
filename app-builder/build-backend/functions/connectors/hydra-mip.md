# Hydra MIP

The Hydra MIP connector communicates with the MPDV Hydra Manufacturing Integration Platform (MIP)[cite: 5]. It abstracts the underlying API into a unified layer, supporting both legacy Hydra 8 dialog transactions and modern MIP 2.0 Shop Floor Connectivity Services (SCS)[cite: 4, 5]. The connector automatically detects the backend version at runtime and routes requests dynamically[cite: 4].

Create an instance of the `Mip` class to manage sessions and execute transactions against a specific MIP server[cite: 4, 5].

```yaml
# name
mipClient1
# options
url: [https://mpdv-mip-test05.mpdv.cloud:8080](https://mpdv-mip-test05.mpdv.cloud:8080)
username: heisenware
password: Samx1ngSeeCrt
accessId: '302127'
```

## Connection and lifecycle

### `canCommunicate`

Checks whether communication with the MIP server is operational and authenticated[cite: 4, 5].

#### Parameters

None[cite: 1].

#### Output

Returns `true` if communication succeeds, otherwise `false`[cite: 4, 5].

### `getMipVersion`

Retrieves the runtime strategy description of the connected backend[cite: 4].

#### Parameters

None[cite: 1].

#### Output

Returns `'Hydra X / MIP 2.0 (SCS)'` or `'Hydra 8 / MIP 1.x (Legacy)'`[cite: 4].

### `isMip2`

Determines if the current backend supports modern MIP 2.0 architectures[cite: 4].

#### Parameters

None[cite: 1].

#### Output

Returns `true` if MIP 2.0 is supported, otherwise `false`[cite: 4].

### `logout`

Explicitly terminates the open session on the MIP server and clears active cookies[cite: 4, 5].

#### Parameters

None[cite: 1].

#### Output

Returns `true` upon successful session termination, otherwise `false`[cite: 4].

## Low-level service CRUD

### `getAllServices`

Lists all data-layer services registered on the connected server[cite: 4, 5].

#### Parameters

None[cite: 1].

#### Output

An array of service name strings[cite: 4, 5].

### `create`

Creates a new instance record for a given service type[cite: 4, 5].

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

Returns `true` on success or throws an error on failure[cite: 4].

### `read`

Queries records from a given service with options for filtering and field selection[cite: 4, 5].

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

An array of parsed data objects[cite: 4].

### `update`

Modifies an existing service instance record[cite: 4, 5].

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

Returns `true` on success[cite: 4].

### `delete`

Removes an existing service instance record[cite: 4, 5].

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

Returns `true` on success[cite: 4].

### `execute`

Invokes a specific processing action on a target service[cite: 4, 5].

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr><tr><td><code>data</code></td><td>The parameters required for execution. Keys must match the service definition.</td><td>object</td></tr></tbody></table>

#### Output

Returns `true` on success[cite: 4].

## Metadata inspection

### `getCreateParameters`

Queries the parameters needed to create records for a specified service[cite: 4, 5].

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr></tbody></table>

#### Output

An object mapping camelCase attributes to their lowercase data types[cite: 4, 5]. Mandatory parameters have a `*` suffix[cite: 4, 5].

### `getReadParameters`

Queries the schema parameters available for retrieval from a service[cite: 4, 5].

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr></tbody></table>

#### Output

An object mapping readable camelCase fields to their lowercase data types[cite: 4, 5].

### `getUpdateParameters`

Queries the schema guidelines for updating records inside a service[cite: 4, 5].

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr></tbody></table>

#### Output

An object mapping updatable attributes to data types, with mandatory lookup attributes marked with a `*` suffix[cite: 4].

### `getExecuteParameters`

Queries the validation constraints needed for executing functions on a service[cite: 4].

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr></tbody></table>

#### Output

An object mapping functional input tags to data types[cite: 4].

### `getDeleteParameters`

Queries the minimal mandatory parameter requirements to delete a service instance[cite: 4, 5].

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr></tbody></table>

#### Output

An object highlighting mandatory row identification fields[cite: 4].

### `getReadableFields`

Lists all column elements explicitly exposed as selectable output fields[cite: 4].

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name.</td><td>string</td></tr></tbody></table>

#### Output

An array of objects mapping selectable keys to their lowercase types[cite: 4].

## Order management (MIP-WO)

### `getOrders`

Fetches production orders and enriches them with active operations, BOM components, and allocated tools[cite: 4].

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

An array of complex order structures[cite: 4].

### `getOrder`

Fetches details for an isolated order instance[cite: 4].

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

An order object, or `null` if not found[cite: 4].

### `startOperation`

Registers an operation log-on transaction (Arbeitsgang anmelden)[cite: 4, 5].

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

Returns a promise that resolves when the logon transaction is completed[cite: 4].

### `finishOperation`

Registers an operation log-off transaction that finishes the step (Arbeitsgang beenden)[cite: 4, 5].

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

Executes the close-out request and confirms completion[cite: 4].

### `interruptOperation`

Pauses an active operation without completing the entire work step (Arbeitsgang unterbrechen)[cite: 4, 5].

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

Concludes the pause registration workflow[cite: 4].

### `reportPartialQuantity`

Posts runtime performance counts and quantities without altering the operation status (Teilrückmeldung)[cite: 4, 5].

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

Submits quantity records into the runtime database tracking engine[cite: 4].

## Workplaces and resources

### `getWorkplaces`

Retrieves machine and workplace resource profiles matching type code `MNR`[cite: 4].

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>filter</code></td><td>User-defined filters applied alongside the primary type constraint.</td><td>any</td></tr><tr><td></td><td><code>fields</code></td><td>Custom columns to retrieve.</td><td>array</td></tr><tr><td></td><td><code>includeStatusAssignments</code></td><td>Enriches results with machine status lists. Default <code>false</code>.</td><td>boolean</td></tr><tr><td></td><td><code>includeGroups</code></td><td>Enriches results with capacity group strings. Default <code>false</code>.</td><td>boolean</td></tr><tr><td></td><td><code>skipNull</code></td><td>Omits parameters containing null values. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

#### Output

An array of enriched workplace resource records[cite: 4].

### `getResources`

Queries active assets and production utilities other than workplaces[cite: 4].

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>type</code></td><td>Targets explicit types (such as <code>TOOL</code>, <code>GAGE</code>). If blank, all resources excluding workplaces match.</td><td>string</td></tr><tr><td></td><td><code>filter</code></td><td>User-defined filters.</td><td>any</td></tr><tr><td></td><td><code>fields</code></td><td>Columns to select.</td><td>array</td></tr><tr><td></td><td><code>skipNull</code></td><td>Omits null fields. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

#### Output

An array of filtered resource asset objects[cite: 4].

## Human resources (MIP-HR)

### `getPersons`

Retrieves personnel records enhanced with assigned qualifications, structural shifts, and live attendance tracking metrics[cite: 4].

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>filter</code></td><td>Filters applied against the base personnel list.</td><td>any</td></tr><tr><td></td><td><code>fields</code></td><td>Custom fields to return.</td><td>array</td></tr><tr><td></td><td><code>includeQualifications</code></td><td>Fetches assigned qualifications. Default <code>true</code>.</td><td>boolean</td></tr><tr><td></td><td><code>includeAssignments</code></td><td>Fetches planned workplace assignments. Default <code>true</code>.</td><td>boolean</td></tr><tr><td></td><td><code>includeClockingStatus</code></td><td>Fetches live attendance data for the current date. Default <code>false</code>.</td><td>boolean</td></tr><tr><td></td><td><code>skipNull</code></td><td>Omits null fields from results. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

#### Example

```yaml
# options
filter: { personLastname: Smith }
includeQualifications: true
includeAssignments: false
```

#### Output

An array of enriched person objects[cite: 4].

## Raw API communication

### `rawServiceCall`

Executes unparsed network tracking queries mapped against endpoint paths[cite: 4, 5].

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

Returns unmapped API data elements[cite: 4].

### `rawDialogCall`

Directly executes raw textual legacy dialog command strings[cite: 4, 5].

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>dialogString</code></td><td>The complete mapped dialog message string payload.</td><td>string</td></tr></tbody></table>

#### Output

Returns the unparsed string response[cite: 4].

### `runDialog`

Assembles and issues custom transitional dialog parameters[cite: 4, 5].

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>dialogName</code></td><td></td><td>The name string code of the dialog (such as <code>A_AN</code>).</td><td>string</td></tr><tr><td><code>options</code></td><td><code>dryRun</code></td><td>If <code>true</code>, returns the compiled dialog string without submitting a network request.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns the evaluated confirmation data or the raw string block text if `dryRun` is active[cite: 4, 5].

## Tips and tricks

### Implicit AND logic constraints
The data filtering interpreter processes logical parameters sequentially as implicit `AND` rules[cite: 4]. Attempting to introduce explicit `OR` keywords or nesting logic arrays containing disjunction blocks triggers a `FILTER_ERR` runtime rejection[cite: 4]. 

### Service execution payloads vs CRUD boundaries
When calling `execute`, input payload arrays must not pass an explicit `operator` key attribute inside parameter objects[cite: 4]. Doing so breaks the parameter validation rules applied by MIP 2.0 connectivity strategies[cite: 4]. 

### Automated session tracking timeouts
Open communication channels that are not explicitly cleared using the `logout` function remain active in an authenticated state on the remote server[cite: 4, 5]. These resources are cleared by automated server sweeps after a rolling 30-minute window of inactivity[cite: 4].
```
