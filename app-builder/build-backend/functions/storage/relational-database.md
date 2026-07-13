# Relational database

The relational database class interacts with SQL databases (PostgreSQL, MySQL, MariaDB, MSSQL, SQLite, and more) without writing raw SQL. You define tables, insert and query rows, model relationships, and track changes with a consistent set of functions.

## Quick start: The internal PostgreSQL instance

Heisenware provides a pre-initialized instance called `internal-postgres`. It is globally available and ready for use. Select `internal-postgres` in your function's instance field to start creating tables and managing data.

<div align="center"><img src="../../../../.gitbook/assets/image (50).png" alt=""></div>

## Connecting an external database

To connect your own database, use the `create` function. How you configure it depends on where the database is located:

* Cloud or public database: If your database is accessible over the internet, create the instance directly in your application backend.
* Local database (via Agent): If your database sits inside a private network (e.g. on a shopfloor server), deploy an [Agent](../../agents/) in that network first and create the database instance within that Agent.

{% hint style="info" %}
Whether you use the internal database or an external connection, the functions for querying, inserting, and managing data are identical.
{% endhint %}

## Connection and database management

### `create`

Initializes the connection to an external database.

{% hint style="info" %}
Skip this step for `internal-postgres`. It is already instantiated for you.
{% endhint %}

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="130">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>dialect</code></td><td>The database dialect (e.g. <code>postgres</code>, <code>mysql</code>).</td><td>string</td></tr><tr><td></td><td><code>database</code></td><td>The name of the database.</td><td>string</td></tr><tr><td></td><td><code>username</code></td><td>The username for authentication.</td><td>string</td></tr><tr><td></td><td><code>password</code></td><td>The password for authentication.</td><td>string</td></tr><tr><td></td><td><code>host</code></td><td>The hostname or IP address of the database server.</td><td>string</td></tr><tr><td></td><td><code>port</code></td><td>The port number. Default: The standard port of the dialect.</td><td>integer</td></tr><tr><td></td><td><code>ssl</code></td><td>Whether to use SSL for the connection. Default <code>true</code>.</td><td>boolean</td></tr><tr><td></td><td><code>sqlLogging</code></td><td>Whether to log all SQL statements. Default <code>true</code>.</td><td>boolean</td></tr><tr><td></td><td><code>rawOnly</code></td><td>If <code>true</code>, skips the database introspection for instant startup. Use when you only need <code>executeSql</code>.</td><td>boolean</td></tr></tbody></table>

{% hint style="info" %}
Right-click the `options` input and mark it as a secret to mask the password.
{% endhint %}

#### Example

```yaml
# options
dialect: 'postgres'   # postgres, mysql, mariadb, mssql, sqlite, oracle, snowflake
database: 'mydb'
username: 'user'
password: 'pass'
host: 'localhost'
ssl: true
```

### `isConnected`

Checks whether the database connection is currently active.

#### Parameters

None.

#### Output

Returns `true` if connected, otherwise `false`.

### `getAllTables`

Retrieves all tables that currently exist in the database.

#### Parameters

None.

#### Output

An array of table name strings.

### `reset`

Drops and recreates the entire database.

{% hint style="danger" %}
This deletes ALL tables and ALL data. The action cannot be undone.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` if the reset was successful.

### `delete`

Removes the instance and its connection configuration. The database itself is not touched.

## Schema and table definition

### `defineTable`

Defines a table's schema. If the table does not exist, it is created. If it exists, the function attempts to alter it by adding any new fields.

Unless you explicitly define a primary key yourself, several fields are added automatically:

* `id`: The table's primary key. A UUID on PostgreSQL, an auto-incrementing integer on other dialects.
* `createdAt`: A timestamp recording when the row was created.
* `updatedAt`: A timestamp tracking the last modification of the row.

{% hint style="info" %}
When the class runs inside an Agent, the automatic `createdAt` and `updatedAt` timestamps are disabled.
{% endhint %}

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td></td><td>The name of the table (e.g. <code>users</code>).</td><td>string</td></tr><tr><td><code>fields</code></td><td></td><td>The table's columns. Keys are the field names (camelCase). Values are either a data type string or a configuration object (see below). Supported types: <code>string</code>, <code>text</code>, <code>integer</code>, <code>bigint</code>, <code>float</code>, <code>double</code>, <code>number</code>, <code>boolean</code>, <code>date</code>, <code>uuid</code>, <code>json</code>, <code>jsonb</code>, <code>file</code>, <code>uniquestring</code>, <code>uniqueinteger</code>, <code>uniquebiginteger</code>. Unknown types fall back to <code>string</code>.</td><td>object</td></tr><tr><td><code>options</code></td><td><code>auditLog</code></td><td>If <code>true</code>, all changes to this table are recorded, see <a href="relational-database.md#audit-logging">audit logging</a>. Replaces the deprecated <code>trackHistory</code>.</td><td>boolean</td></tr></tbody></table>

{% hint style="info" %}
Use English and camelCase for table and field names (e.g. `firstName`, `dateOfBirth`). Avoid spaces, dashes, and other special characters. When using PostgreSQL, prefer the `jsonb` type for JSON data: It is more efficient and allows nested properties in filter expressions.
{% endhint %}

#### Examples

Example 1: Simple table

```yaml
# name
users
# fields
name: string
email: uniquestring
age: integer
```

Example 2: Table with custom primary key and JSONB

```yaml
# name
products
# fields
id: { type: string, primaryKey: true }
name: string
price: number
specs: jsonb
```

{% hint style="warning" %}
Always use `id` as the name of the primary key, even when overriding the default. Other names may cause unexpected behavior.
{% endhint %}

### Advanced field configuration

For more control, provide an object as a field's value with these properties:

<table><thead><tr><th width="160">Property</th><th>Description</th><th width="150">Type</th></tr></thead><tbody><tr><td><code>type</code></td><td>The data type string (e.g. <code>string</code>, <code>integer</code>). Required.</td><td>string</td></tr><tr><td><code>primaryKey</code></td><td>Sets this field as the primary key, overriding the default <code>id</code> field.</td><td>boolean</td></tr><tr><td><code>unique</code></td><td>Ensures all values in this column are unique (<code>uniquestring</code>/<code>uniqueinteger</code> are shorthands). Assign the same arbitrary string to several fields to make their combination unique.</td><td>boolean or string</td></tr><tr><td><code>allowNull</code></td><td>If <code>false</code>, the field must have a value.</td><td>boolean</td></tr><tr><td><code>defaultValue</code></td><td>A default value if none is provided: A literal (<code>active</code>, <code>0</code>) or a special value like <code>NOW</code> for the current time.</td><td>any</td></tr><tr><td><code>autoIncrement</code></td><td>Automatically increments an integer primary key for each new row.</td><td>boolean</td></tr><tr><td><code>validate</code></td><td>Adds model-level validations, e.g. <code>{ isEmail: true, max: 23 }</code>.</td><td>object</td></tr></tbody></table>

Example 1: Advanced table with constraints

```yaml
# name
employees
# fields
employeeId: { type: integer, primaryKey: true, autoIncrement: true }
email: { type: string, allowNull: false, unique: true }
status: { type: string, defaultValue: active }
hireDate: { type: date, defaultValue: NOW }
```

Example 2: Unique constraint across multiple columns

To make a combination of fields unique, assign an arbitrary string (here `timeAndId`) to the corresponding fields.

```yaml
# name
machineHistory
# fields
machineId: { unique: timeAndId, type: string }
timestamp: { unique: timeAndId, type: date }
data: jsonb
```

### `getTableSchema`

Retrieves the schema definition of a given table.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The name of the table.</td><td>string</td></tr></tbody></table>

#### Output

An object with one entry per field, each describing `type`, `primaryKey`, `allowNull`, `sqlType`, `defaultValue`, `unique`, `autoIncrement`, and, for foreign keys, the referenced table and field.

### `deleteTable`

Deletes an entire table.

{% hint style="danger" %}
This permanently deletes the table with all its data. The action cannot be undone.
{% endhint %}

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The name of the table to delete.</td><td>string</td></tr></tbody></table>

### `enforceUniqueField`

Retroactively enforces a UNIQUE and NOT NULL constraint on an existing field: It removes duplicate rows, removes rows with NULL values, and then applies both constraints.

{% hint style="danger" %}
This permanently deletes duplicate and NULL rows. The action cannot be undone.
{% endhint %}

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="100">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>table</code></td><td></td><td>The name of the table.</td><td>string</td></tr><tr><td><code>field</code></td><td></td><td>The field to deduplicate and make unique (e.g. <code>barcode</code>).</td><td>string</td></tr><tr><td><code>options</code></td><td><code>keep</code></td><td>Which duplicate to keep: <code>newest</code> (latest <code>createdAt</code>/id) or <code>oldest</code>. Default <code>newest</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` on success. Throws an error on failure (all changes are rolled back).

## Querying and filtering data

### `getTableData`

Fetches rows from one or more tables, with options for filtering, joining, sorting, and selecting specific fields. This is the primary function for reading data.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="120">Key</th><th>Description</th><th width="130">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td></td><td>The name of the table, or an array of table names for a multi-table join query.</td><td>string or array</td></tr><tr><td><code>options</code></td><td><code>filter</code></td><td>The conditions rows must meet. For multi-table queries, this must include the join conditions. See <a href="relational-database.md#filtering-explained">filtering explained</a>.</td><td>array</td></tr><tr><td></td><td><code>fields</code></td><td>Selects specific columns. For multi-table queries, use dot notation (e.g. <code>users.name</code>).</td><td>array</td></tr><tr><td></td><td><code>order</code></td><td>The sort order as <code>['fieldName', 'DIRECTION']</code>, where direction is <code>ASC</code> or <code>DESC</code>.</td><td>array</td></tr><tr><td></td><td><code>limit</code></td><td>The maximum number of rows to return.</td><td>integer</td></tr><tr><td></td><td><code>offset</code></td><td>The number of rows to skip, useful for pagination.</td><td>integer</td></tr><tr><td></td><td><code>autoJoin</code></td><td>For single-table queries, automatically includes data from related tables. Default <code>true</code>.</td><td>boolean</td></tr><tr><td></td><td><code>locale</code></td><td>A locale string (e.g. <code>en-US</code>) to format date/time values in the output.</td><td>string</td></tr><tr><td></td><td><code>dateStyle</code></td><td>Verbosity of formatted dates: <code>full</code>, <code>long</code>, <code>medium</code>, <code>short</code>, or <code>hidden</code>.</td><td>string</td></tr><tr><td></td><td><code>timeStyle</code></td><td>Verbosity of formatted times, same values as <code>dateStyle</code>.</td><td>string</td></tr></tbody></table>

### Filtering explained

The `filter` option uses an array syntax to build precise queries.

Simple conditions are an array of three elements: `[fieldName, operator, value]`.

* `fieldName`: The column name. For `jsonb` fields, use dot notation to access nested keys (e.g. `specs.dimensions.width`). For multi-table queries, always prefix with the table name (e.g. `users.name`).
* `operator`: A comparison string, see the table below.
* `value`: The value to compare against.

Compound conditions combine conditions with `'and'` or `'or'`:

* AND: `[ [condition1], 'and', [condition2] ]`, both must be true.
* OR: `[ [condition1], 'or', [condition2] ]`, at least one must be true.

Available operators:

<table><thead><tr><th width="190">Operator(s)</th><th>Description</th><th width="200">Example value</th></tr></thead><tbody><tr><td><code>=</code>, <code>eq</code>, <code>is</code></td><td>Equals</td><td><code>'John'</code> or <code>100</code></td></tr><tr><td><code>&#x3C;></code>, <code>ne</code>, <code>isnot</code></td><td>Not equals</td><td><code>'John'</code> or <code>100</code></td></tr><tr><td><code>></code>, <code>gt</code></td><td>Greater than</td><td><code>99</code></td></tr><tr><td><code>>=</code>, <code>gte</code></td><td>Greater than or equal to</td><td><code>100</code></td></tr><tr><td><code>&#x3C;</code>, <code>lt</code></td><td>Less than</td><td><code>100</code></td></tr><tr><td><code>&#x3C;=</code>, <code>lte</code></td><td>Less than or equal to</td><td><code>100</code></td></tr><tr><td><code>contains</code></td><td>String field contains the value (case-insensitive)</td><td><code>'oh'</code> (matches 'John')</td></tr><tr><td><code>notcontains</code></td><td>String field does not contain the value</td><td><code>'Peter'</code></td></tr><tr><td><code>startswith</code></td><td>String field starts with the value</td><td><code>'J'</code></td></tr><tr><td><code>endswith</code></td><td>String field ends with the value</td><td><code>'oe'</code> (matches 'Doe')</td></tr><tr><td><code>between</code></td><td>Value is between two values in an array</td><td><code>[18, 30]</code> or <code>['A', 'D']</code></td></tr><tr><td><code>in</code></td><td>Value is one of several possibilities in an array</td><td><code>['active', 'pending']</code></td></tr></tbody></table>

#### Examples

Example 1: Simple filter and field selection

Get the `name` and `email` of all active users:

```yaml
# name
users
# options
filter: ['status', '=', 'active']
fields: ['name', 'email']
```

Example 2: Date range filter

Find all orders placed in January 2025:

```yaml
# name
orders
# options
filter: ['createdAt', 'between', ['2025-01-01', '2025-01-31T23:59:59Z']]
```

Example 3: Compound 'and' filter

Find products that are in stock and cost more than 50:

```yaml
# name
products
# options
filter: [ ['quantity', '>', 0], 'and', ['price', '>', 50] ]
```

Example 4: Sorting and limiting

Get the 5 most recent high-priority tickets:

```yaml
# name
tickets
# options
filter: ['priority', 'in', ['high', 'critical']]
order: ['createdAt', 'DESC']
limit: 5
```

Example 5: Multi-table join

Retrieve the names of users and the titles of their posts. The first filter condition defines the join:

```yaml
# name
- users
- posts
# options
filter: [ ['users.id', '=', 'posts.userId'] ]
fields: ['users.name', 'posts.title']
```

Example 6: Join with a where clause

Retrieve the post titles of a specific user named Alice:

```yaml
# name
- users
- posts
# options
filter: [
  ['users.id', '=', 'posts.userId'],
  'and',
  ['users.name', '=', 'Alice']
]
fields: ['posts.title']
```

Example 7: Join with a nested JSONB filter

Find all orders of Alice where the shipment was marked as high priority in its `details` JSON field:

```yaml
# name
- users
- orders
- shipments
# options
fields: ['users.name', 'orders.product', 'shipments.trackingNumber']
filter: [
  ['users.id', '=', 'orders.userId'],
  'and',
  ['orders.shipmentId', '=', 'shipments.id'],
  'and',
  ['users.name', '=', 'Alice'],
  'and',
  ['shipments.details.priority', '=', true]
]
```

#### Output

An array of objects, one per row matching the criteria.

### `findRows`

Works exactly like `getTableData`, with one difference: Without a filter it returns nothing, while `getTableData` returns all rows. Use it when the filter comes from user input (like a search field) and an empty input should not load the whole table.

#### Parameters

The same as [`getTableData`](relational-database.md#gettabledata), but `filter` is effectively required.

#### Output

An array of matching rows, or nothing when no filter is provided.

### `findRow`

Finds and returns the first row matching the provided filter. Without a filter it returns nothing.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="110">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>table</code></td><td></td><td>The name of the table.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>filter</code></td><td>The filter conditions, see <a href="relational-database.md#filtering-explained">filtering explained</a>.</td><td>array</td></tr><tr><td></td><td><code>fields</code></td><td>Optional array of fields to return.</td><td>array</td></tr></tbody></table>

#### Output

The first matching row object, or `null` if no match is found.

### `getRow`

Retrieves a single row by its primary key.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="110">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>table</code></td><td></td><td>The name of the table.</td><td>string</td></tr><tr><td><code>id</code></td><td></td><td>The primary key of the row.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>fields</code></td><td>Optional array of fields to return.</td><td>array</td></tr><tr><td></td><td><code>autoJoin</code></td><td>Whether to automatically include related data. Default <code>true</code>.</td><td>boolean</td></tr></tbody></table>

#### Output

The row object, or `null` if the id was not found.

## Data manipulation

### `addRow`

Adds a single new row to a table.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>table</code></td><td>The name of the table.</td><td>string</td></tr><tr><td><code>data</code></td><td>An object where keys are column names and values are the data to insert.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# table
users
# data
name: Jane Doe
email: jane.doe@example.com
age: 34
```

#### Output

The created row as saved in the database (including the generated <code>id</code>).

### `addRows`

Adds multiple rows to a table in a single, efficient bulk operation.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>table</code></td><td>The name of the table.</td><td>string</td></tr><tr><td><code>data</code></td><td>An array of data objects to insert.</td><td>array</td></tr></tbody></table>

#### Example

```yaml
# table
products
# data
- name: 'Thingamajig'
  price: 19.99
  stock: 100
- name: 'Widget'
  price: 25.50
  stock: 250
```

#### Output

The number of rows added.

### `upsertRow`

Atomically updates or inserts a row: It checks whether the row exists and either updates it or creates a new one. By default the check uses the primary key (`id`). The optional `uniqueKey` parameter lets you check against another business key (like an email) instead.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>table</code></td><td>The name of the table.</td><td>string</td></tr><tr><td><code>data</code></td><td>The data object to upsert.</td><td>object</td></tr><tr><td><code>uniqueKey</code></td><td>Optional object specifying a unique key for the existence check.</td><td>object</td></tr></tbody></table>

#### Examples

Example 1: Upsert using the default primary key

Update the user with a specific ID, or create them if they do not exist:

```yaml
# table
users
# data
id: 'a1b2c3d4-e5f6-4a3b-8c2d-1f2e3d4c5b6a'
name: Jane Smith
age: 36
```

Example 2: Upsert using a custom unique key

Find a user by email. If they exist, update their age; if not, create them:

```yaml
# table
users
# data
name: Jane Doe
age: 35
# uniqueKey
email: 'jane.doe@example.com'
```

#### Output

An array with the created/updated state and the primary key of the affected row.

### `changeRow`

Changes the content of a specific row identified by its primary key.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="100">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>table</code></td><td></td><td>The name of the table.</td><td>string</td></tr><tr><td><code>id</code></td><td></td><td>The primary key of the row to change.</td><td>string</td></tr><tr><td><code>data</code></td><td></td><td>The fields and their new values.</td><td>object</td></tr><tr><td><code>options</code></td><td><code>patch</code></td><td>If <code>true</code>, partially updates nested JSON objects instead of replacing them.</td><td>boolean</td></tr><tr><td></td><td><code>fieldDelimiter</code></td><td>Unflattens the provided data using the given delimiter (e.g. flat keys like <code>settings.theme</code> become nested objects).</td><td>string</td></tr></tbody></table>

#### Example

Update a user's age and status:

```yaml
# table
users
# id
'a1b2c3d4-e5f6-4a3b-8c2d-1f2e3d4c5b6a'
# data
age: 37
status: 'active'
```

#### Output

The changed row as now saved in the database. Throws an error if the row is not found.

### `updateRow`

Updates specific fields of an existing row, identified by the `id` inside the `data` object or by a `uniqueKey`. Behaves like a standard SQL UPDATE: Fields not included in `data` stay untouched, but JSON columns are replaced entirely with the provided value. To merge data into an existing JSON object, use `patchRow` instead.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>table</code></td><td>The name of the table.</td><td>string</td></tr><tr><td><code>data</code></td><td>The new values. Contains the <code>id</code> property to identify the row, unless <code>uniqueKey</code> is used.</td><td>object</td></tr><tr><td><code>uniqueKey</code></td><td>Optional object identifying the row by a business key instead of the id (e.g. <code>email: jane@example.com</code>).</td><td>object</td></tr></tbody></table>

#### Example

Before, a row in the `settings` table:

```json
{
  "id": 1,
  "name": "Config A",
  "settings": { "theme": "dark", "notifications": true }
}
```

Call `updateRow` with:

```yaml
# table
settings
# data
id: 1
settings: {
  notifications: false,
  timezone: UTC
}
```

After:

```json
{
  "id": 1,
  "name": "Config A",
  "settings": { "notifications": false, "timezone": "UTC" }
}
```

The `name` field stayed untouched, but the `theme` key in the JSON is gone.

#### Output

The updated row as now saved in the database. Throws an error if the row is not found.

### `patchRow`

Patches a row with new data, merging nested JSON objects instead of replacing them. Ideal for partial updates: Original JSON keys that are not part of the patch are preserved.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>table</code></td><td>The name of the table.</td><td>string</td></tr><tr><td><code>data</code></td><td>The new values. Contains the <code>id</code> property to identify the row, unless <code>uniqueKey</code> is used.</td><td>object</td></tr><tr><td><code>uniqueKey</code></td><td>Optional object identifying the row by a business key instead of the id.</td><td>object</td></tr></tbody></table>

#### Example

Before, a row in the `settings` table:

```json
{
  "id": 1,
  "name": "Config A",
  "settings": { "theme": "dark", "notifications": true }
}
```

Call `patchRow` with:

```yaml
# table
settings
# data
id: 1
settings: {
  notifications: false,
  timezone: UTC
}
```

After:

```json
{
  "id": 1,
  "name": "Config A",
  "settings": { "theme": "dark", "notifications": false, "timezone": "UTC" }
}
```

The original `theme` key is preserved and the new data is merged in.

#### Output

The patched row as now saved in the database. Throws an error if the row is not found.

### `deleteRow`

Deletes a single row from a table, identified by its primary key.

{% hint style="danger" %}
This permanently deletes the row. The action cannot be undone (unless <a href="relational-database.md#audit-logging">audit logging</a> is enabled, which stores a final snapshot).
{% endhint %}

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>table</code></td><td>The name of the table.</td><td>string</td></tr><tr><td><code>id</code></td><td>The primary key of the row to delete.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# table
users
# id
'a1b2c3d4-e5f6-4a3b-8c2d-1f2e3d4c5b6a'
```

#### Output

Returns `true` if the row was deleted, or `false` if no row with that id exists.

### `clearTable`

Deletes all rows from a table, leaving the table structure intact.

{% hint style="danger" %}
This permanently deletes all data in the table. The action cannot be undone.
{% endhint %}

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="190">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td></td><td>The name of the table to clear.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>nullifyLinkedRecords</code></td><td>If <code>true</code>, sets foreign keys in other tables pointing to this table to <code>NULL</code> before clearing. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

#### Example

```yaml
# name
logs
```

#### Output

Returns `true` on success.

## Relationships and associations

These functions define the logical connections between tables, creating a relational data model. Relationships ensure data integrity and enable cross-table queries. The typical workflow has three steps:

1. Define tables: Create your tables using `defineTable`.
2. Define the relationship: Use one of the association functions to declare how the tables connect.
3. Link records: Use the foreign key fields created in step 2 to connect specific rows. For many-to-many relationships, use `associateRow`.

### `optionallyHasOne`

Creates a one-to-many relationship where the child record can exist without a parent. This adds a nullable foreign key column to the child table. In short: A child has zero or one parent, a parent may have many children.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>childTable</code></td><td>The table that receives the foreign key (e.g. <code>posts</code>).</td><td>string</td></tr><tr><td><code>parentTable</code></td><td>The table being referenced (e.g. <code>users</code>).</td><td>string</td></tr><tr><td><code>role</code></td><td>Optional PascalCase string (e.g. <code>Owner</code>) to create a distinct relationship when the same two tables connect multiple times.</td><td>string</td></tr></tbody></table>

### `mandatorilyHasOne`

Creates a one-to-many relationship where the child record cannot exist without a parent. This adds a non-nullable foreign key column to the child table. In short: A child must have exactly one parent, a parent may have many children.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>childTable</code></td><td>The table that receives the foreign key (e.g. <code>employees</code>).</td><td>string</td></tr><tr><td><code>parentTable</code></td><td>The table being referenced (e.g. <code>companies</code>).</td><td>string</td></tr><tr><td><code>role</code></td><td>Optional PascalCase string (e.g. <code>Manager</code>) to create a distinct relationship.</td><td>string</td></tr></tbody></table>

### `optionallyHasMany`

Creates a many-to-many relationship between two tables. This automatically generates a hidden junction table managing the associations. In short: A child can have many parents, a parent can have many children.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>childTable</code></td><td>The first table in the relationship.</td><td>string</td></tr><tr><td><code>parentTable</code></td><td>The second table in the relationship.</td><td>string</td></tr></tbody></table>

### `associateRow`

Links existing records together. Primarily used to create the links of a many-to-many relationship after it has been defined.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="130">Type</th></tr></thead><tbody><tr><td><code>sourceTable</code></td><td>The name of the source table.</td><td>string</td></tr><tr><td><code>sourceId</code></td><td>The ID of the row in the source table.</td><td>string</td></tr><tr><td><code>targetTable</code></td><td>The name of the target table.</td><td>string</td></tr><tr><td><code>targetId</code></td><td>The ID or an array of IDs of the row(s) in the target table.</td><td>string or array</td></tr></tbody></table>

### Relationship strategies and examples

A practical guide to choosing and implementing the right relationship for your data model.

#### One-to-many (mandatory)

The most common relationship. Use it when a child record would be meaningless without its parent. Scenario: An employee must belong to a company.

{% stepper %}
{% step %}
### Define tables

Create the `companies` and `employees` tables.

```yaml
# (call defineTable)
# name
companies
# fields
name: string

# (call defineTable)
# name
employees
# fields
firstName: string
lastName: string
```
{% endstep %}

{% step %}
### Define the relationship

Declare that an employee mandatorily has one company.

```yaml
# (call mandatorilyHasOne)
# childTable
employees
# parentTable
companies
```

{% hint style="info" %}
This adds a non-nullable `companyId` foreign key column to the `employees` table.
{% endhint %}
{% endstep %}

{% step %}
### Link records

Because `companyId` is mandatory, provide it when creating a new employee record.

```yaml
# (call addRow)
# table
employees
# data
firstName: Ada
lastName: Lovelace
companyId: 'a1b2c3d4-e5f6-4a3b-8c2d-1f2e3d4c5b6a'
```
{% endstep %}
{% endstepper %}

#### One-to-many (optional)

Use this when the link between child and parent is optional. The child can be created first and linked later. Scenario: A blog post can optionally be assigned to a category.

{% stepper %}
{% step %}
### Define tables

```yaml
# (call defineTable)
# name
posts
# fields
title: string
content: text

# (call defineTable)
# name
categories
# fields
name: string
```
{% endstep %}

{% step %}
### Define the relationship

Declare that a post optionally has one category.

```yaml
# (call optionallyHasOne)
# childTable
posts
# parentTable
categories
```

{% hint style="info" %}
This adds a nullable `categoryId` foreign key column to the `posts` table.
{% endhint %}
{% endstep %}

{% step %}
### Link records

Create a post without a category, and link it later by patching the record.

```yaml
# (call addRow to create the post initially)
# table
posts
# data
title: 'My First Post'
content: '...'

# (call patchRow later to link it to a category)
# table
posts
# data
id: 'f1e2d3c4-b5a6-4a3b-8c2d-1f2e3d4c5b6a'
categoryId: 'c1b2a3d4-e5f6-4a3b-8c2d-1f2e3d4c5b6a'
```
{% endstep %}
{% endstepper %}

#### Many-to-many

Use this when records in two tables can have multiple links to each other. Scenario: An order can contain many products, and a product can be part of many orders.

{% stepper %}
{% step %}
### Define tables

```yaml
# (call defineTable)
# name
orders
# fields
orderDate: date

# (call defineTable)
# name
products
# fields
name: string
price: number
```
{% endstep %}

{% step %}
### Define the relationship

Declare the many-to-many relationship between orders and products.

```yaml
# (call optionallyHasMany)
# childTable
orders
# parentTable
products
```

{% hint style="info" %}
This automatically creates a hidden junction table (e.g. `__orders2products`) storing the links between order IDs and product IDs.
{% endhint %}
{% endstep %}

{% step %}
### Link records

Connect the records with `associateRow`. Link one order to multiple products by providing an array of product IDs.

```yaml
# (call associateRow)
# sourceTable
orders
# sourceId
'o1d2e3r4-b5a6-4a3b-8c2d-1f2e3d4c5b6a'
# targetTable
products
# targetId
- 'p1r2o3d4-b5a6-4a3b-8c2d-1f2e3d4c5b6a'
- 'p5r6o7d8-b5a6-4a3b-8c2d-1f2e3d4c5b6a'
```
{% endstep %}
{% endstepper %}

#### Advanced: Multiple relationships with roles

Use the `role` parameter to define more than one distinct relationship between the same two tables. Scenario: A document has both an owner and an editor, both records in the `users` table.

{% stepper %}
{% step %}
### Define tables

```yaml
# (call defineTable)
# name
users
# fields
name: string

# (call defineTable)
# name
documents
# fields
title: string
```
{% endstep %}

{% step %}
### Define the relationships with roles

Create two distinct one-to-many relationships, specifying a role for each.

```yaml
# (call optionallyHasOne for the owner)
# childTable
documents
# parentTable
users
# role
Owner

# (call optionallyHasOne for the editor)
# childTable
documents
# parentTable
users
# role
Editor
```

{% hint style="info" %}
This adds two separate foreign keys to the `documents` table: `ownerId` and `editorId`. The role name directly determines the name of the foreign key.
{% endhint %}
{% endstep %}

{% step %}
### Link records

When creating a document, provide IDs for both the owner and the editor using the specific foreign key fields.

```yaml
# (call addRow)
# table
documents
# data
title: 'Q4 Financial Report'
ownerId: 'u1s2e3r4-b5a6-4a3b-8c2d-1f2e3d4c5b6a'
editorId: 'u5s6e7r8-b5a6-4a3b-8c2d-1f2e3d4c5b6a'
```
{% endstep %}
{% endstepper %}

## Audit logging

The class features a built-in audit logging system that creates a secure, detailed, and queryable trail of all data changes. It tracks what changed, when, and who changed it: It automatically calculates the differences (diff) between old and new values for updates, and stores full snapshots for creations and deletions.

{% hint style="warning" %}
#### Deprecation notice

The `trackHistory` option in `defineTable` and the `getHistoricalData` function are deprecated as of February 2025. Use `auditLog` and `getAuditLog` instead.
{% endhint %}

### Enabling audit logs

Set the `auditLog` option to `true` when defining the table schema:

```yaml
# name
orders
# fields
orderNumber: string
status: string
total: number
# options
auditLog: true
```

The database then automatically creates a hidden, parallel table (e.g. `ordersAuditLog`) recording all CREATE, UPDATE, and DELETE actions on the main table.

### Tracking the actor

To record who made a change, all data manipulation functions (`addRow`, `updateRow`, `patchRow`, `upsertRow`, `deleteRow`, ...) accept an optional `actorId` within their options. In a typical App, bind this to the currently authenticated user via the `$USER` variable or their user ID.

```yaml
# table
orders
# data
id: 'order-123'
status: 'shipped'
# options
actorId: 'admin-alice'
```

### `getAuditLog`

Retrieves and filters the recorded history, including natural language time parsing and field-level tracking.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="130">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>table</code></td><td></td><td>The name of the table to query (e.g. <code>orders</code>).</td><td>string</td></tr><tr><td><code>options</code></td><td><code>id</code></td><td>Filters logs for a specific record's primary key.</td><td>string</td></tr><tr><td></td><td><code>actorId</code></td><td>Filters logs by the user who made the change.</td><td>string</td></tr><tr><td></td><td><code>action</code></td><td>Filters by action type: <code>CREATE</code>, <code>UPDATE</code>, or <code>DELETE</code>.</td><td>string</td></tr><tr><td></td><td><code>changedField</code></td><td>Only returns logs where a specific field was modified.</td><td>string</td></tr><tr><td></td><td><code>start</code></td><td>Earliest time to include, also as natural language (e.g. <code>yesterday</code>, <code>-1h</code>).</td><td>string</td></tr><tr><td></td><td><code>stop</code></td><td>Latest time to include. Default <code>now</code>.</td><td>string</td></tr></tbody></table>

#### Examples

Example 1: View all changes to a specific record

```yaml
# table
orders
# options
id: 'order-999'
```

Example 2: Track specific field modifications

Find out who changed the `status` field of an order, and when:

```yaml
# table
orders
# options
id: 'order-999'
changedField: status
```

Example 3: Monitor user activity

See all deletions performed by a specific admin in the last 24 hours:

```yaml
# table
products
# options
action: DELETE
actorId: admin-alice
start: -24h
```

#### Output

An array of log entries, ordered from newest to oldest. The `diff` object varies by action:

CREATE: There is no old state, `new` contains the complete inserted record.

```json
{
  "action": "CREATE",
  "actorId": "admin-alice",
  "diff": {
    "old": null,
    "new": { "id": "order-123", "status": "pending", "total": 150.00 }
  },
  "createdAt": "2025-08-20T10:00:00.000Z"
}
```

UPDATE: The `diff` contains only the fields that actually changed, with their old and new values.

```json
{
  "action": "UPDATE",
  "actorId": "admin-alice",
  "diff": {
    "status": {
      "old": "pending",
      "new": "shipped"
    }
  },
  "createdAt": "2025-08-21T14:30:00.000Z"
}
```

DELETE: There is no new state, `old` contains the final snapshot of the record, allowing potential data recovery.

```json
{
  "action": "DELETE",
  "actorId": "admin-alice",
  "diff": {
    "old": { "id": "order-123", "status": "shipped", "total": 150.00 },
    "new": null
  },
  "createdAt": "2025-08-25T09:15:00.000Z"
}
```

## Auto-schema functions

These functions create and alter tables on the fly. Use them for rapid prototyping or unpredictable data structures.

### `autoUpsertRow`

Upserts a row. If the table or columns do not exist, they are created automatically based on the provided data.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>table</code></td><td>The name of the table.</td><td>string</td></tr><tr><td><code>data</code></td><td>The data object to upsert.</td><td>object</td></tr><tr><td><code>uniqueKey</code></td><td>Optional unique key for the existence check.</td><td>object</td></tr></tbody></table>

#### Output

Returns `true` on success, otherwise `false` (errors are logged, not thrown).

### `autoAddRows`

Bulk-inserts data. Like `autoUpsertRow`, it creates or alters the table schema as needed, based on the first data object in the array.

#### Parameters

<table><thead><tr><th width="130">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>table</code></td><td>The name of the table.</td><td>string</td></tr><tr><td><code>data</code></td><td>An array of data objects to insert. The schema is derived from the first object.</td><td>array</td></tr><tr><td><code>uniqueKey</code></td><td>Optional unique key for the existence check.</td><td>object</td></tr></tbody></table>

#### Output

Returns `true` on success, otherwise `false` (errors are logged, not thrown).

## Raw SQL and templates

### `executeSql`

Executes a raw SQL statement with template variable substitution. Placeholders like `{{customer.id}}` are safely replaced with the corresponding values from the `variables` object (parameterized, not string-concatenated). For SELECT statements, the result is a plain array of row objects.

{% hint style="danger" %}
Raw SQL can modify or delete any data in the database. Use with care.
{% endhint %}

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="110">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>template</code></td><td></td><td>The SQL string containing <code>{{double.curly.braces}}</code> placeholders.</td><td>string</td></tr><tr><td><code>variables</code></td><td></td><td>The object containing the data for the placeholders. Nested values are addressed with dot notation.</td><td>object</td></tr><tr><td><code>options</code></td><td><code>type</code></td><td>Forces a specific query type (e.g. <code>SELECT</code>, <code>UPDATE</code>, <code>INSERT</code>). If omitted, it is guessed from the SQL.</td><td>string</td></tr><tr><td></td><td><code>locale</code></td><td>If set, dates and times in the result are formatted in local representation (e.g. <code>de-DE</code>).</td><td>string</td></tr><tr><td></td><td><code>dateStyle</code></td><td>Verbosity of formatted dates: <code>full</code>, <code>long</code>, <code>medium</code>, <code>short</code>, or <code>hidden</code>.</td><td>string</td></tr><tr><td></td><td><code>timeStyle</code></td><td>Verbosity of formatted times, same values as <code>dateStyle</code>.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# template
SELECT name, email FROM users WHERE "companyId" = {{company.id}} AND age > {{minAge}}
# variables
company: { id: 'a1b2c3d4' }
minAge: 30
```

#### Output

The result of the query. For SELECT statements, an array of row objects.

### `fillTemplate`

Fills a template string with data from the first record matching a given condition per table. Placeholders use double curly braces like `{{table.field}}`; for JSON fields, nested keys work as `{{table.jsonField.nestedKey}}`. With a `locale`, ISO date-time values are formatted automatically. Unresolved placeholders are removed from the result.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="110">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>template</code></td><td></td><td>The template string containing the placeholders.</td><td>string</td></tr><tr><td><code>condition</code></td><td></td><td>An object mapping table names to their filter conditions (see <a href="relational-database.md#filtering-explained">filtering explained</a>). The first matching record per table fills the placeholders.</td><td>object</td></tr><tr><td><code>options</code></td><td><code>locale</code></td><td>The locale for date/time formatting (e.g. <code>en-US</code>, <code>de-DE</code>).</td><td>string</td></tr><tr><td></td><td><code>dateStyle</code></td><td>One of <code>full</code>, <code>long</code>, <code>medium</code>, <code>short</code>. Default <code>medium</code>.</td><td>string</td></tr><tr><td></td><td><code>timeStyle</code></td><td>One of <code>full</code>, <code>long</code>, <code>medium</code>, <code>short</code>. Default <code>medium</code>.</td><td>string</td></tr></tbody></table>

#### Example

Create a notification string for a specific user and their latest order:

```yaml
# template
"Hello {{users.name}}! Your order #{{orders.orderNumber}} will ship on {{orders.details.shippingDate}}."
# condition
users: ['id', '=', 'user-123']
orders: ['userId', '=', 'user-123']
# options
locale: en-GB
dateStyle: long
```

Result (example): "Hello Jane Doe! Your order #98765 will ship on 18 August 2025."

#### Output

The template string with all placeholders filled.

## Change notifications

### `onChange`

Registers a callback that fires whenever the given table changes (insert, update, or delete). Use it to refresh dashboards or trigger follow-up logic automatically.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>name</code></td><td>The name of the table to subscribe to.</td><td>string</td></tr><tr><td><code>handler</code></td><td>Callback that fires on every change to the table.</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed` to confirm the listener is registered.

## Deprecated functions

The following functions still exist for backwards compatibility. Use their replacements in new flows.

<table><thead><tr><th width="250">Deprecated function</th><th>Use instead</th></tr></thead><tbody><tr><td><code>getHistoricalData</code> (with <code>trackHistory</code>)</td><td><code>getAuditLog</code> (with <code>auditLog</code>)</td></tr><tr><td><code>findOne</code></td><td><code>findRow</code></td></tr></tbody></table>

## Tips and tricks

### Referencing the current user with $USER

The `$USER` variable references the currently logged-in user of your App, particularly useful for Apps requiring authentication. A recommended practice: Define the username as a unique key (data type `uniquestring`) when creating the table. This enables the `upsertRow` function to both update and insert rows based on the existence of that unique key.

<div align="center"><figure><img src="../../../../.gitbook/assets/relationdat.png" alt=""><figcaption><p>$USER in combination with the upsertRow function</p></figcaption></figure></div>
