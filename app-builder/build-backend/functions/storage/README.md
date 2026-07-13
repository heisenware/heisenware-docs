# Storage

The storage category holds the classes that persist and manage your App's data. Heisenware includes two production-ready internal databases (PostgreSQL and InfluxDB), so you can store data without setting anything up. The same classes also connect to your own external database servers.

## Relational storage

Use the [relational database](relational-database.md) class for structured data like user profiles, orders, or inventory.

Every account includes a pre-configured instance called `internal-postgres`. It runs a managed PostgreSQL database, so you can drag CRUD functions onto the canvas and store data right away.

To connect an existing SQL server instead (PostgreSQL, MySQL, MariaDB, MSSQL, SQLite, and more), create a new instance with the `create` function and enter your connection details.

## Timeseries storage

Use the [timeseries database](timeseries-database.md) class for high-frequency data like sensor readings or machine telemetry.

Every account includes a managed InfluxDB instance called `internal-influx`. The easiest way to fill it: Attach a [recorder](../../extension-nodes/recorder.md) to any function output and it stores every value with zero configuration. Use the timeseries database functions to read and query the recorded data.

To connect your own InfluxDB server instead, create a new instance with the `create` function.

## In-memory storage

For temporary data that only lives during a session and does not need to be saved to disk, use these lightweight classes:

* [Data store](data-store.md): Simple state management.
* [Circular buffer](circular-buffer.md): Rolling data, e.g. the last 100 values for a live chart.
