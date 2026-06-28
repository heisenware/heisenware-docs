# Hydra MIP

Heisenware is a partner company of [MPDV](https://www.mpdv.com/). The `Mip` class provides a high-level connector for interacting with an MPDV Hydra Manufacturing Integration Platform (MIP). It simplifies communication by abstracting the underlying API into a consistent set of functions.

There are two primary ways to interact with the MIP using this class:

1. Service Calls: For performing Create, Read, Update, and Delete (CRUD) operations on data objects known as "services" (e.g., reading an order, creating a new material).
2. Dialog Calls: For executing predefined business transactions and workflows (e.g., logging on to an operation, posting part quantities, changing machine status).

You must create an instance of this class to connect to a specific MIP server.

### create

Creates a Mip instance and configures the connection to a specific MIP server.

Parameters

* `options`: An object containing the connection credentials.
  * `url`: The base URL of the MIP server.
  * `username`: The username for authentication.
  * `password`: The password for authentication.
  * `accessId`: An 8-digit ID (left-padded with zeros if necessary) that identifies the client application.

Example

```yaml
# options
url: https://my-mip-server.com:8080
username: myuser
password: mysecretpassword
accessId: 00123456
```

## Connection and API Discovery

These functions are used to manage the connection and discover the capabilities of the connected MIP server.

### canCommunicate

Checks if a connection to the MIP server can be established and authenticated.

Output

Returns true if communication is possible, false otherwise.

### logout

Explicitly terminates the current session on the MIP server. If not called, sessions will time out automatically.

### getAllServices

Retrieves a list of all available (but not necessarily licensed) services on the server.

Output

An array of service name strings (e.g., MDUnits, BOOrder, BOPerson).

### getCreateParameters

Retrieves the parameters required to create a new record for a given service.

Parameters

* `serviceName`: The name of the service (e.g., `MDUnits`).

Output

An object where keys are the parameter names (in camelCase) and values are their data types. Mandatory parameters are marked with a \* suffix.

### getReadParameters

Retrieves all readable parameters (fields) for a given service.

Parameters

* `serviceName`: The name of the service.

Output

An object where keys are the parameter names (in camelCase) and values are their data types.

### getUpdateParameters

Retrieves the parameters needed to update a record. This includes mandatory parameters to identify the record and optional parameters that can be changed.

Parameters

* `serviceName`: The name of the service.

### getDeleteParameters

Retrieves the mandatory parameters needed to identify and delete a record for a given service.

Parameters

* `serviceName`: The name of the service.

## High-Level Service Functions (CRUD)

These functions provide a simplified way to perform Create, Read, Update, and Delete operations. Note that all data object keys must be in camelCase.

### create

Creates a new record for the given service type. Use `getCreateParameters` to find out which fields are mandatory.

Parameters

* `serviceName`: The name of the service (e.g., `MDUnits`).
* `data`: An object containing the data for the new record.

Example: Create a new unit

```yaml
# serviceName
MDUnits
# data
unitsUnit: T
unitsClassification: Test
unitsDesignation: A fake test unit
```

### read

Reads records from the given service, with options to filter and select specific fields.

Parameters

* `serviceName`: The name of the service.
* `options`: An optional object.
  * `filter`: An object or array to filter results.
  * `fields`: An array of strings to limit the returned fields.

Example: Read units with more than one digit

```yaml
# serviceName
MDUnits
# options
filter: [unitsDigits, '>', 1]
fields: [unitsUnit, unitsDesignation]
```

### update

Updates an existing record. The `data` object must include the mandatory parameters (found via `getUpdateParameters`) to identify the record.

Parameters

* `serviceName`: The name of the service.
* `data`: An object containing the identifying fields and the new data to be set.

### delete

Deletes an existing record. The `data` object must contain the mandatory parameters (found via `getDeleteParameters`) to identify the record.

Parameters

* `serviceName`: The name of the service.
* `data`: An object containing the identifying fields.

### execute

Runs the special "execute" command on a service.

Parameters

* `serviceName`: The name of the service.
* `data`: The payload data for the execution command.

## Dialog Functions

These functions execute predefined business transactions. All keys in the `options` object must be in camelCase.

### runDialog

A generic function to run any named dialog with a set of key-value pairs.

Parameters

* `dialogName`: The name of the dialog (e.g., `A_AN`).
* `options`: An object containing the parameters for the dialog. You can add `dryRun: true` to the options to get the generated dialog string without sending it.

### logOperationOn (Arbeitsgang anmelden)

Logs an operation on to a workplace or machine.

Parameters

* `options`: An object containing the transaction data.
  * `anr`: Order number (MES-Auftragsnummer).
  * `mnr`: Workplace or machine number (Arbeitsplatz-/Maschinennummer).
  * `pnr`: Person number (Personalnummer).
  * `knr`: Person-card number (Personalkartennummer).
  * `cnr`: Batch number (Chargen-Nummer).
  * `mst`: New machine status (Maschinenstatus).

Example

```yaml
# options
anr: '0004990701'
mnr: '4560'
knr: '999999'
```

### logOperationAndPersonOn (Arbeitsgang und Person anmelden)

Logs both an operation and a person on to a workplace or machine simultaneously.

Parameters

* `options`: An object containing the transaction data.
  * `anr`: Order number (MES-Auftragsnummer).
  * `mnr`: Workplace or machine number (Arbeitsplatz-/Maschinennummer).
  * `pnr`: Person number (Personalnummer).
  * `knr`: Person-card number (Personalkartennummer).
  * `cnr`: Batch number (Chargen-Nummer).
  * `mst`: New machine status (Maschinenstatus).

Example

```yaml
# options
anr: '0004990701'
mnr: '4560'
pnr: '2998'
```

### postPartQuantity (Teilrückmeldung)

Posts produced part quantities, including good parts and scrap, for an active operation.

Parameters

* `options`: An object containing the transaction data.
  * `anr`: Order number (MES-Auftragsnummer).
  * `mnr`: Workplace or machine number (Arbeitsplatz-/Maschinennummer).
  * `pnr`: Person number (Personalnummer).
  * `knr`: Person-card number (Personalkartennummer).
  * `egrGut`: Registered yield (Erfasste Gutmenge).
  * `egrAus`: Registered scrap (Erfasste Ausschussmenge).
  * `eggGut`: Yield Cause code (Grund).
  * `eggAus`: Scrap Cause code (Ausschussgrund).
  * `egeGut`: Yield unit (e.g., ST for pieces).
  * `egeAus`: Scrap unit.

Example

```yaml
# options
anr: 'AAA2100473100200'
mnr: '60610'
knr: '11111'
egrGut: 1
egrAus: 2
eggAus: 1
```

### interruptOperation (Arbeitsgang unterbrechen)

Interrupts a currently active operation. You can optionally post part quantities at the same time.

Parameters

* `options`: An object containing the transaction data.
  * `anr`: Order number (MES-Auftragsnummer).
  * `mnr`: Workplace or machine number (Arbeitsplatz-/Maschinennummer).
  * `pnr`, `knr`: Person identifiers.
  * `egrGut`, `egrAus`, `eggGut`, `eggAus`, `egeGut`, `egeAus`: Optional part quantity details.

Example

```yaml
# options
anr: 'AAA2100451210200'
mnr: '60610'
egrGut: 1
egeGut: ST
```

### logOperationOff (Arbeitsgang abmelden)

Logs an operation off, typically without finishing it (leaving it in an interrupted state). Part quantities can be posted simultaneously.

Parameters

* `options`: An object containing the transaction data.
  * `anr`: Order number (MES-Auftragsnummer).
  * `mnr`: Workplace or machine number (Arbeitsplatz-/Maschinennummer).
  * `pnr`, `knr`: Person identifiers.
  * `egrGut`, `egrAus`, `eggGut`, `eggAus`, `egeGut`, `egeAus`: Optional part quantity details.

### finishOperation (Arbeitsgang beenden)

Finishes an operation that was previously started or interrupted, concluding the work step. Part quantities can be posted at the same time.

Parameters

* `options`: An object containing the transaction data.
  * `anr`: Order number (MES-Auftragsnummer).
  * `mnr`: Workplace or machine number (Arbeitsplatz-/Maschinennummer).
  * `pnr`, `knr`: Person identifiers.
  * `egrGut`, `egrAus`, `eggGut`, `eggAus`, `egeGut`, `egeAus`: Optional part quantity details.

### changeMachineStatus (Maschinenstatus ändern)

Changes the status of a machine, for example, to indicate a malfunction or setup time.

Parameters

* `options`: An object containing the transaction data.
  * `mst`: The new machine status code.
  * `mnr`: Workplace or machine number (Arbeitsplatz-/Maschinennummer).
  * `pnr`, `knr`: Optional person identifiers.
  * `bem`: A free text comment.

Example

```yaml
# options
mst: 3
mnr: '60510'
knr: '11111'
bem: 'Tool change required'
```

## Specialized and Raw Functions

### readOrders

A specialized, high-level function to conveniently read production orders and their related data.

Parameters

* `options`: An object to configure the read operation.
  * `filter`: Filters the orders to be received.
  * `fields`: An array of additional `order` or `ordertype` fields to include.
  * `includeOperations`: If `true`, related operations are included. Defaults to `true`.
  * `includeComponents`: If `true`, Bill of Material (BOM) components are included. Defaults to `true`.
  * `includeProductionResources`: If `true`, related production resources (tools) are included. Defaults to `true`.

### rawServiceCall

Executes a raw service call for advanced use cases. The parameters directly map to the MIP Service Interface specification.

### rawDialogCall

Executes a raw dialog call by sending the complete dialog string.
