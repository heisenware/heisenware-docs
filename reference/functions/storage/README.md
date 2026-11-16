# Storage

The storage classes keep an App's data. Every workspace comes with a relational database, a timeseries database and a file store of its own, and the same classes also connect to database servers of your own.

## Which store do I need?

| What you have | Where it belongs |
| --- | --- |
| Rows that matter: orders, faults, inspections | the [relational database](relational-database.md) |
| Values over time: a signal recorded every few seconds | the [timeseries database](timeseries-database.md) |
| Photos, PDFs and other files a row points to | the [file store](files.md) |
| A bounded stream: the last 100 values, a window, a queue | a [buffer](buffer.md) |
| A list of items the logic works on | a [data store](data-store.md) |
| One record assembled from values that arrive separately | an [accumulator](accumulator.md) |

## Databases

The [relational database](relational-database.md) class holds structured data in tables with relations between them. The workspace's own instance is called `internal-postgres`: a managed PostgreSQL that is there from the start, so you can drag its functions onto the Flowboard and store data at once. Its tables are the workspace's, shared by every App, and their shape is the **data model**, which you shape in the [Database editor](../../../app-builder/database-editor.md) or let the assistant shape.

The [timeseries database](timeseries-database.md) class holds values over time. The workspace's own instance is called `internal-influx`. The quickest way to fill it is a [recorder](../../../app-builder/flowboard/recorder.md) on any output: it writes every value with no further configuration, and the timeseries functions read it back.

To use a server of your own instead, open the Functions explorer, pick the class and call its `create` function with your connection details. That makes a new instance beside the internal one. A database inside a private network needs an [agent](../../../concepts/agents-and-where-code-runs.md) in that network, and the instance is created there.

{% hint style="info" %}
Whether you use the internal instance or your own server, the functions are the same.
{% endhint %}

## The file store

A row never holds a file's bytes and never a path. The bytes lie in the workspace's [file store](files.md), and the row keeps an entry that says which file is meant. Upload and photo widgets deliver such entries by themselves; a flow hands over a file it produced with `Files.store`.

## In memory

For the working memory of your flows, data that lives in the running App and does not survive a restart, use these lightweight classes. Each holds one shape of memory and announces every change as an event, so a widget or a flow reacts the moment a value arrives, with no query and no polling:

* [Buffer](buffer.md): a bounded stream, such as the last 100 values of a live chart, sliding and tumbling windows, queues.
* [Data store](data-store.md): a list of items, addressable by index or by condition, shared between Apps by instance name.
* [Accumulator](accumulator.md): one record assembled from values that arrive separately.

When data must survive a restart or be queried later, it belongs in a database. The in-memory classes are the step before it.
