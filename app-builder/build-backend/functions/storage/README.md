# Storage

The storage category contains the classes that persist and manage your App data. Heisenware includes two internal databases (PostgreSQL and InfluxDB) to store data automatically. These same classes also connect to external database servers.

## Relational storage

Use the [Relational database](relational-database.md) class for structured data such as user profiles, orders, or inventory.

Every account includes a pre-configured instance named `internal-postgres`. It runs a managed PostgreSQL database, letting you drag database functions onto the canvas to store data immediately.

To connect an existing SQL server instead (PostgreSQL, MySQL, MariaDB, MSSQL, or SQLite), open the Function Explorer, select the relational database class, and call its `create` function. Enter your connection details to generate a new, standalone database instance.

## Timeseries storage

Use the [Timeseries database](timeseries-database.md) class for high-frequency data such as sensor readings or machine telemetry.

Every account includes a managed InfluxDB instance named `internal-influx`. To populate it, attach a [recorder extension node](../../extension-nodes/recorder.md) to any function output to store every value with no configuration. Use the timeseries database functions to read and query this recorded data.

To connect an external InfluxDB server instead, open the Function Explorer, select the timeseries database class, and call its `create` function to generate a new instance.

## In-memory storage

For temporary data that lives only during a session and does not save to disk, use these lightweight classes:

* [Data store](data-store.md): Simple state management.
* [Circular buffer](circular-buffer.md): Rolling data, such as the last 100 values for a live chart.
