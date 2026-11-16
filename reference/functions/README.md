# Functions

A function is one piece of code your logic can call: `read` of the OPC UA client, `increment` of the counter. Functions come in classes, and agents offer them: the platform's internal agents, the add-ons you install, and the agents you run in your own network. Drag a function from the [Functions explorer](../../app-builder/explorers/functions.md) onto the Flowboard and it becomes an executor.

The pages here are the reference: for every class its functions, their parameters, what they return and what they do.

* [Connectors](connectors/README.md): machines, protocols and business systems. OPC UA, Modbus, S7, MQTT, HTTP, email, SAP and the rest.
* [Storage](storage/README.md): the relational and the timeseries database, the [file store](storage/files.md), and the in-memory stores (buffer, data store, accumulator).
* [Utilities](utilities/README.md): data processing, timers, counters, cron, simulation, barcodes, PDFs, users.
* [Add-ons](add-ons/README.md): extra classes that arrive with a container of their own.

The explorer groups the same classes under **Connectors**, **Storage**, **Utilities** and **Custom**, which holds your [subflows](../../concepts/subflows.md). An add-on and an agent of your own appear under their own name.

## How to read a function page

A class offers its functions in a few kinds, and the page says which one each is:

* **static function**: it needs no instance. Call it and it answers.
* **constructor** (`create`) and **destructor** (`delete`): they bring an instance into being and end it.
* **instance function**: it acts on one instance, the one the executor's address names.
* **event function**: it is called once and then delivers values as they happen, on the executor's event outputs. See [Backend events](../../concepts/backend-events.md).

Most connectors stand for something that lives on: a connection, a server, a port. That is the **instance**, created once with `create` and reached by its name from every App of the workspace. [Executors and instances](../../concepts/executors-and-instances.md) explains what that means for your flows, and [Triggers and wires](../../concepts/triggers-and-wires.md) when an executor runs.

A function's own documentation also sits in the Builder: hover an executor to read it, and the assistant reads the same text before it wires anything.
