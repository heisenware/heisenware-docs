# Storage

Heisenware provides a unified approach to data. Whether you use our built-in storage or connect your own, you use the same Functional blocks to manage your data.

## Relational storage (SQL)

For structured data like user profiles, orders, or inventory, we use the [relational database](relational-database.md) class.

* **Internal (managed)**: Every account comes with a pre-configured instance called `internal-postgres`. You can start dragging CRUD Functions onto the canvas immediately. No further setup is required.
* **External (connect)**: If you have an existing SQL database (PostgreSQL, MySQL, SQLite, MSSQL), you simply use the `create` Function of the same class to establish a connection.

## Time series storage (IoT)

For high-frequency data like sensor readings or machine telemetry, we use the [time series database](timeseries-database.md) class.

* **Internal (managed)**: Use the [recorder](../../recorder.md) right in your flow to store millions of data points with zero configuration and the `internal-influxdb` to read and query that data.
* **External (connect)**: Use the `create` Function to point the logic toward your own InfluxDB server.

## In-memory storage

For temporary data that only needs to live during a session (and doesn't need to be saved to a disk), use our specialized utility classes:

* [**Data store**](data-store.md): For simple state management.
* [**Circular buffer**](circular-buffer.md): For "rolling" data (e.g., the last 100 values for a live chart).
