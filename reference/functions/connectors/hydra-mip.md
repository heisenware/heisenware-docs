# Hydra MIP

The Hydra MIP connector reads and books data in MPDV's MES Hydra over its service interface: orders, operations, workplaces, persons, and the bookings of the shop floor. Two generations of Hydra meet it, Hydra 8 and Hydra X on MIP 2.0. The connector finds out which one it talks to at the first login, and the same functions work on both: bookings travel as Shop Floor Connectivity Services on MIP 2.0 and as dialogs on Hydra 8.

This connector requires [instance creation](README.md#instance-creation) before you can manage sessions or execute transactions against a specific MIP server. MIP runs inside the plant, so the instance belongs on an [agent](../../../concepts/agents-and-where-code-runs.md) in that network. One instance per MIP server is enough: share it and create it when the App starts.

## Conventions worth knowing

* **Names**: MIP's dotted names come back in camelCase (`operation.act.status` reads as `operationActStatus`). Both spellings are accepted as input.
* **Ids are text**: order, operation, workplace, person and badge numbers keep leading zeros. Store them as strings.
* **`fields`**: it replaces the columns in `read`, `getOrder` and `getResources`, and it adds to the default columns in `getOrders`, `getWorkplaces` and `getPersons`.
* **Filters**: `{ orderId: 'JR150702' }` for equality, `['field', 'in', ['V', 'L']]` for anything else, or a list of conditions joined by `'and'`. Operators are `=` `<>` `>` `>=` `<` `<=` `in` `between` `contains` `startswith` `endswith`, or MIP's own names (`EQUAL`, `GT`, `LIKE`, `EQUAL_OR_NULL`). MIP has no OR: read twice and merge.
* **Silent gaps**: MIP answers a column it does not know with empty values and ignores a filter on a name that is no filter parameter, both without an error. `getReadableFields` and `getReadParameters` tell you the names that work. The rows a user may see are limited by the responsibility areas of the MIP user, also without an error.

## Connection and lifecycle

### `create` (instance)

Creates a client instance configured to communicate with a specific MIP server. Not to be confused with [`create` (record)](hydra-mip.md#create-record), which takes a `serviceName` and `data` and writes a record on the MIP server.

MIP on the plant network usually shows a certificate of the company's own authority. Trust it once for the whole workspace with the [Trusted certificates](trusted-certificates.md) function `trustServer`, for example `https://mip.plant.local:8080`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>url</code></td><td>The endpoint URL of the target MIP server.</td><td>string</td></tr><tr><td></td><td><code>username</code></td><td>The username used for authentication.</td><td>string</td></tr><tr><td></td><td><code>password</code></td><td>The password used for authentication.</td><td>string</td></tr><tr><td></td><td><code>accessId</code></td><td>An 8-digit ID identifying the client application, left-padded with zeros if necessary.</td><td>string</td></tr><tr><td></td><td><code>timeout</code></td><td>Milliseconds a call may take before it gives up. Default 30000.</td><td>integer</td></tr><tr><td></td><td><code>rejectUnauthorized</code></td><td>Set to false to temporarily disable rejection of untrusted server certificates. Default true.</td><td>boolean</td></tr><tr><td></td><td><code>tls</code></td><td>TLS settings for this client only, on top of what the workspace trusts: <code>rejectUnauthorized</code> (false accepts any certificate), <code>ca</code>, <code>cert</code>, <code>key</code>, <code>passphrase</code>.</td><td>object</td></tr><tr><td><code>caPath</code></td><td></td><td>An optional absolute path to a root CA <code>.pem</code> file for internal TLS. The older way: trusting the server in the workspace does the same for every connector.</td><td>string</td></tr></tbody></table>

{% hint style="info" %}
Right-click the `options` input and choose **Secret Input** to mask the password.
{% endhint %}

#### Example

```yaml
# options
url: https://mip.plant.local:8080
username: heisenware
password: mysecretpassword
accessId: '00123456'
```

#### Output

Returns the name of the created instance.

{% hint style="warning" %}
Three things trip up a first connection:

* **The host must be fully qualified.** A short host name breaks the session cookie, and every call then loses its session.
* **`accessId` is text, not a number.** It is the plant's installation ID padded to eight digits: as a number it loses its leading zeros.
* **The MIP user needs a right per service** your App calls, and the user name is lower case.
{% endhint %}

The connector logs in by itself and keeps the session. A session MIP drops after 30 idle minutes is replaced on the next call. A login MIP refuses is not retried for a minute, so that a wrong password does not lock the account: correct the credentials and create the instance anew.

### `canCommunicate`

Asks MIP whether a session opens and the server answers.

#### Parameters

None.

#### Output

Returns `true` when MIP answered, `false` when it could not be reached or refused the login. It never says why: the reason stands in the agent's log, and in the error of any call that fails.

### `isConnected`

Tells whether the last contact with MIP succeeded. It asks nothing of the server, so use it to show a connection state cheaply and `canCommunicate` to test the connection.

#### Parameters

None.

#### Output

Returns `true` when the instance is logged in and MIP answered the last call, `false` otherwise.

### `disconnect`

Logs out. The next call logs in again, which makes this the way to pick up rights or responsibility areas an administrator has just changed.

#### Parameters

None.

#### Output

Returns `true`.

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

Ends the open session on the MIP server. Without it, an open session ends by itself after 30 idle minutes. Either way the next call logs in again.

#### Parameters

None.

#### Output

Returns `true` when the session ended or none was open, `false` when MIP refused the logout. The instance forgets the session either way.

### `delete` (instance)

Removes the MIP client instance: it logs out and its configuration is gone. Not to be confused with [`delete` (record)](hydra-mip.md#delete-record), which takes a `serviceName` and `data` and removes a record on the MIP server.

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

Lists the services the connected server knows. A service in the list may still be unlicensed in that plant: a call then fails with `lkServiceUnavailable`.

#### Parameters

None.

#### Output

Returns the service names as an array of strings.

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

Queries records from a given service with options for filtering and field selection. `<Service>` reads the service's own list; `<Service>.<method>` reads another of its list methods, such as `MaterialMovement.listStock`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td></td><td>The service name, or <code>&#x3C;Service>.&#x3C;method></code>.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>filter</code></td><td>Filters records based on specific criteria. Accepts an object like <code>{ field: 'val' }</code>, an array like <code>['field', '=', 'val']</code>, or a list of those joined by <code>'and'</code>. MIP does not support OR logic.</td><td>any</td></tr><tr><td></td><td><code>fields</code></td><td>Restricts the evaluation to specific columns.</td><td>array</td></tr><tr><td></td><td><code>skipNull</code></td><td>When true, omits null attributes from the return value. Default false.</td><td>boolean</td></tr></tbody></table>

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

Returns the rows, one object per record, with its fields in camelCase.

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

Runs a booking or another action service. `<Service>` runs that service's own `execute`; `<Service>.<method>` runs any other method of it, such as `Mail.send`. The bookings below are this function with the parameters filled in for you.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>serviceName</code></td><td>The service name, or <code>&#x3C;Service>.&#x3C;method></code>.</td><td>string</td></tr><tr><td><code>data</code></td><td>The payload. <code>getExecuteParameters</code> tells you which keys the service takes and which are mandatory.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# serviceName
ChangeWorkplaceStatus
# data
workplaceId: '4560'
workplaceStatusId: 2
serviceLoggingTs: '2026-09-29T10:00:00Z'
serviceExecutionSync: true
```

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

Returns one `{ <camelCase name>: <type> }` object per field a read can return.

## Order management (MIP-WO)

### `getOrders`

Fetches production orders and enriches them with active operations, BOM components, and allocated tools. The same is possible with `read`, which this function saves you the joins and default fields for.

{% hint style="warning" %}
Without a `filter` this reads every order of the plant, with its operations, components and tools. Always filter.
{% endhint %}

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

Returns one object per order: its own fields, the fields of its order type, and, when included, its `operations`, each with its `components` and `productionResources`.

{% hint style="info" %}
An order carries no name: its designation is reserved and stays empty. Show the article (`orderArticle`) instead.
{% endhint %}

### `getOrder`

Reads one order by its number.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>orderId</code></td><td></td><td>The order number, as text.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>fields</code></td><td>The fields to read. Empty, every field of the order returns.</td><td>array</td></tr></tbody></table>

#### Example

```yaml
# orderId
'4711'
# options
fields: [orderId, orderArticle, orderScheduledStartTs]
```

#### Output

Returns the order object, or `null` when no order has that number. Operations are not joined: use `getOrders` for those.

## Bookings

A booking names the operation, the workplace, the person and the moment. The four operation bookings take the same `options`; `changeWorkplaceStatus` books a machine status instead.

{% hint style="warning" %}
#### The operation key

`operationId` is the operation's full key: the order number and the operation number together, such as `CIOYM0010040`. Read it from the operation (`BOOperation`), never glue it together yourself. The bare operation number (`0040`) is not a key and the booking fails with it.

`orderId` is accepted here as the older spelling of that same key, on Hydra 8 only. In reads, `orderId` means the order number. Use `operationId` for bookings.
{% endhint %}

Quantities are deltas: what was produced since the last report, in the operation's primary unit, never a running total. MIP adds them up.

<table><thead><tr><th width="150">Input</th><th width="140">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>operationId</code></td><td>The operation's full key. Legacy spelling: <code>anr</code>.</td><td>string</td></tr><tr><td></td><td><code>orderId</code></td><td>Hydra 8 only: the full key, as the connector took it before.</td><td>string</td></tr><tr><td></td><td><code>workplaceId</code></td><td>The workplace or machine ID. Legacy spelling: <code>mnr</code>.</td><td>string</td></tr><tr><td></td><td><code>personId</code></td><td>The person ID. Legacy spelling: <code>pnr</code>.</td><td>string</td></tr><tr><td></td><td><code>cardId</code></td><td>The badge number, in place of the person ID. Legacy spelling: <code>knr</code>. <code>startOperation</code> and <code>reportPartialQuantity</code>.</td><td>string</td></tr><tr><td></td><td><code>batchId</code></td><td>Hydra 8 only: the output batch. Legacy spelling: <code>cnr</code>. <code>startOperation</code>.</td><td>string</td></tr><tr><td></td><td><code>yield</code></td><td>Good quantity produced since the last report. Legacy spelling: <code>egrGut</code>. Not on <code>startOperation</code>.</td><td>integer</td></tr><tr><td></td><td><code>scrap</code></td><td>Scrap quantity produced since the last report. Legacy spelling: <code>egrAus</code>. Not on <code>startOperation</code>.</td><td>integer</td></tr><tr><td></td><td><code>scrapReason</code></td><td>The reason code for the scrap, from the plant's reason table. Legacy spelling: <code>eggAus</code>.</td><td>integer</td></tr><tr><td></td><td><code>timestamp</code></td><td>When it happened, as an ISO timestamp. Default: now. Use it to book after the fact, and book in chronological order.</td><td>string</td></tr></tbody></table>

Each of these returns `true` once MIP took the booking, and throws with MIP's own reason when MIP refuses it (on Hydra 8 the dialog's `RET` code and texts).

### `startOperation`

Logs an operation on (Arbeitsgang anmelden): work starts.

#### Parameters

The booking `options` above, without quantities: `operationId` (or `orderId` on Hydra 8), `workplaceId`, `personId` or `cardId`, `batchId` and `timestamp`.

#### Example

```yaml
# options
operationId: 'CIOYM0010040'
workplaceId: '4560'
personId: 2998
```

#### Output

Returns `true` when MIP took the booking.

### `reportPartialQuantity`

Posts part quantities (Teilrückmeldung) while the work goes on.

#### Parameters

The booking `options` above: `operationId` (or `orderId` on Hydra 8), `workplaceId`, `personId` or `cardId`, `yield`, `scrap`, `scrapReason` and `timestamp`.

#### Example

```yaml
# options
operationId: 'AAA2100473100200'
workplaceId: '60610'
personId: 11111
yield: 100
scrap: 2
scrapReason: 1
```

#### Output

Returns `true` when MIP took the booking.

### `interruptOperation`

Interrupts a registered operation (Arbeitsgang unterbrechen): a break or a shift end, with the job not yet complete.

#### Parameters

The booking `options` above: `operationId` (or `orderId` on Hydra 8), `workplaceId`, `personId`, `yield`, `scrap`, `scrapReason` and `timestamp`. Quantities given here are booked first, as a partial report.

#### Example

```yaml
# options
operationId: 'CIOYM0010040'
workplaceId: '4560'
yield: 50
```

#### Output

Returns `true` when MIP took the booking.

### `finishOperation`

Logs an operation off (Arbeitsgang abmelden): the normal end of the work on it.

#### Parameters

The booking `options` above: `operationId` (or `orderId` on Hydra 8), `workplaceId`, `personId`, `yield`, `scrap`, `scrapReason` and `timestamp`. Quantities given here are booked first, as a partial report, because MIP 2.0 takes quantities only that way.

#### Example

```yaml
# options
operationId: 'CIOYM0010040'
workplaceId: '4560'
yield: 100
scrap: 5
scrapReason: 1
```

#### Output

Returns `true` when MIP took the booking.

### `changeWorkplaceStatus`

Sets a workplace's machine status (Maschinenstatus setzen), for example to report a disturbance or a repair.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="140">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>workplaceId</code></td><td>The workplace ID. Legacy spelling: <code>mnr</code>.</td><td>string</td></tr><tr><td></td><td><code>machineStatus</code></td><td>The new status, a number from that workplace's own status table. Legacy spelling: <code>mst</code>.</td><td>integer</td></tr><tr><td></td><td><code>personId</code></td><td>The person ID. Legacy spelling: <code>pnr</code>.</td><td>string</td></tr><tr><td></td><td><code>cardId</code></td><td>The badge number. Legacy spelling: <code>knr</code>.</td><td>string</td></tr><tr><td></td><td><code>comment</code></td><td>A comment, up to 40 characters. Legacy spelling: <code>bem</code>.</td><td>string</td></tr><tr><td></td><td><code>estimatedDowntime</code></td><td>How long the status is expected to last. Legacy spelling: <code>progndauer</code>.</td><td>integer</td></tr><tr><td></td><td><code>timestamp</code></td><td>When it happened. Default: now.</td><td>string</td></tr></tbody></table>

{% hint style="warning" %}
Every workplace has its own status table. Offer only the statuses of that workplace, from `getWorkplaces` with `includeStatusAssignments`. Setting a status may interrupt the running operations or log persons off, as the plant configured it.
{% endhint %}

#### Example

```yaml
# options
workplaceId: '4560'
machineStatus: 2
comment: Spindle replaced
```

#### Output

Returns `true` when MIP took the booking.

## Workplaces, resources, and personnel

### `getWorkplaces`

Reads workplaces and machines. This high-level convenience function applies default fields, associations, and filtering on top of the generic `read` function.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="200">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>filter</code></td><td>Additional user-defined filters.</td><td>any</td></tr><tr><td></td><td><code>fields</code></td><td>Restricts the evaluation to specific columns.</td><td>array</td></tr><tr><td></td><td><code>includeStatusAssignments</code></td><td>Includes corresponding status assignments. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>includeGroups</code></td><td>Includes corresponding capacity groups. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>skipNull</code></td><td>When true, omits null attributes from the return value. Default false.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns one object per workplace, with its `validStatuses` and `assignedGroups` when those are included. The valid statuses carry each status's text and colour, which is what a status board needs.

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

Returns one object per person, with its `qualifications`, `assignments` and `currentStatus` when those are included. MIP keeps a person once per validity period; this function returns the version valid today, so a person appears once.

## Dialogs and raw calls

Dialogs are Hydra 8's booking records: `KEY=value|` pairs sent as text. They do not exist on Hydra X. The raw calls below reach services and dialogs the functions above do not cover.

### `runDialog`

Runs a named dialog with a set of key-value pairs. The fields are upper-cased on the wire, and `|` and `\` in a value are escaped for you.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>dialogName</code></td><td></td><td>The dialog, such as <code>A_TR</code>, <code>M_MST</code> or <code>SCMD;44</code>.</td><td>string</td></tr><tr><td><code>options</code></td><td></td><td>The fields of the dialog. Add <code>dryRun: true</code> to receive the record that would be sent, without sending it.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# dialogName
M_MST
# options
mnr: '4560'
mst: 2
```

#### Output

Returns Hydra's answer record as text, which starts with `RET=0` when the booking was posted. A dialog Hydra refuses throws with its return code and texts. With `dryRun`, returns the record that would have been sent.

### `rawServiceCall`

Calls any method of any service, with the body sent to MIP as it is. For what the functions above do not cover.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The URL to call: <code>/data/&#x3C;Service>/&#x3C;method></code> or <code>/meta/&#x3C;Service>/&#x3C;method></code>.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>params</code></td><td>The filter parameters, each <code>{ acronym, operator, value }</code>, in MIP's own spelling.</td><td>array</td></tr><tr><td></td><td><code>columns</code></td><td>The selected columns.</td><td>array</td></tr><tr><td></td><td><code>requestId</code></td><td>A request ID of your own.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# url
/data/MDUnits/list
# options
params: [{ acronym: units.unit, operator: EQUAL, value: C }]
columns: [units.unit]
```

#### Output

Returns MIP's answer as MIP sends it, with MIP's own names rather than camelCase. The first row of a list (`__rowType: META`) names the columns.

### `rawDialogCall`

Sends a complete dialog record to Hydra 8, unchanged.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>dialogString</code></td><td>The record, as <code>KEY=value|</code> pairs.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# dialogString
DLG=A_TR|ANR=CIOYM0010040|MNR=4560|EGR:GUT=12|
```

#### Output

Returns Hydra's answer record as text. `RET=0` means the record was posted.
