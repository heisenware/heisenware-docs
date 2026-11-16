# Utilities

Utilities are the classes that need no machine and no external system: they process data, keep state, measure and schedule time, generate documents and barcodes, and stand in for sources that are not connected yet. You find them under **Utilities** in the Functions explorer; the internal agent **Utility Functions** serves all of them except PDF templates, which comes from the **Templates** agent.

## Available utility classes

<table><thead><tr><th width="220">Class</th><th>Description</th></tr></thead><tbody><tr><td><a href="barcode-generation.md">Barcode Generation</a></td><td>Encodes text as a 1D or 2D barcode and answers the image.</td></tr><tr><td><a href="counter.md">Counter</a></td><td>A numerical value you increment, decrement, set and reset, with <code>onChange</code>.</td></tr><tr><td><a href="cron.md">Cron</a></td><td>A calendar schedule set at birth, firing <code>onTick</code>.</td></tr><tr><td><a href="data-processing.md">Data Processing</a></td><td>Merges, filters, reshapes and maps values: echo, memory, combine and the rest of the everyday toolbox.</td></tr><tr><td><a href="data-simulation.md">Data Simulation</a></td><td>Random values, random records and fixed demo datasets for laying out a page.</td></tr><tr><td><a href="signal-simulation.md">Signal Simulator</a></td><td>The time series of a source that is not connected yet: seeded signals, or a preset for a silo, tank, pump, conveyor, machine, energy meter or production orders.</td></tr><tr><td><a href="event-simulation.md">Event Simulation</a></td><td>Impulses: manual with a payload, periodic, one-shot and debounced.</td></tr><tr><td><a href="pdf-processing.md">PDF Processing</a></td><td>Builds PDFs from JSON or HTML and merges documents and pictures into one.</td></tr><tr><td><a href="pdf-templates.md">PDF Templates</a></td><td>Fills a layout designed in the Template editor with your data.</td></tr><tr><td><a href="stopwatch.md">Stopwatch</a></td><td>Elapsed milliseconds and laps.</td></tr><tr><td><a href="timer.md">Timer</a></td><td>A countdown with <code>onTick</code> and <code>onTimeup</code>, and delays in a flow.</td></tr><tr><td><a href="users.md">Users</a></td><td>Lists an App's users and hands out access links.</td></tr></tbody></table>

Three more Utility Functions classes keep data rather than process it, and the Functions explorer lists them under **Storage**: [Buffer](../storage/buffer.md), [Accumulator](../storage/accumulator.md) and [Data Store](../storage/data-store.md).

{% hint style="info" %}
#### Building with simulated data

Simulated data belongs at the source, not in the middle of a flow. Give the [Signal Simulator](signal-simulation.md) the shape of the real signal and let it feed the real sink: the OPC UA server, the publish, the widget. The flow then reads its source as it will read the machine, and connecting the machine later changes one address, not the logic.

[Data Simulation](data-simulation.md) is for the other job: filling a page with plausible records and fixed demo datasets while you lay it out.
{% endhint %}
