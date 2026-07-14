# Utilities

Utilities provide core data processing, timing, and asset generation features without requiring external systems. Use these classes to manage internal App logic and behavior.

## Available utility classes

<table><thead><tr><th width="220">Class</th><th>Description</th></tr></thead><tbody><tr><td><a href="barcode-generation.md">Barcode generation</a></td><td>Generates 1D and 2D barcodes or QR codes as images or binary data.</td></tr><tr><td><a href="counter.md">Counter</a></td><td>Manages numerical values, such as production counts or sequence numbers.</td></tr><tr><td><a href="cron.md">Cron</a></td><td>Schedules automated tasks using standard cron expressions.</td></tr><tr><td><a href="data-processing.md">Data processing</a></td><td>Manipulates data by merging objects, filtering arrays, or mapping value ranges.</td></tr><tr><td><a href="data-simulation.md">Data simulation</a></td><td>Generates synthetic data points to test logic before connecting physical hardware.</td></tr><tr><td><a href="event-simulation.md">Event simulation</a></td><td>Triggers mock events to verify that reactive flows respond correctly.</td></tr><tr><td><a href="pdf-processing.md">PDF processing</a></td><td>Splits, merges, or modifies existing PDF documents.</td></tr><tr><td><a href="pdf-templates.md">PDF templates</a></td><td>Generates PDF documents by merging App data with pre-designed layouts.</td></tr><tr><td><a href="stopwatch.md">Stopwatch</a></td><td>Measures time intervals using a high-resolution timer.</td></tr><tr><td><a href="timer.md">Timer</a></td><td>Runs countdowns, maps progress to custom ranges, and introduces delays into flows.</td></tr><tr><td><a href="users.md">Users</a></td><td>Manages users and App access programmatically.</td></tr></tbody></table>

{% hint style="info" %}
#### Testing with simulated data

Use data and event simulation nodes to test logic during the initial development phase. This verifies that dashboards and databases work correctly before connecting to a physical PLC or sensor. Once the logic works, replace the simulation classes with actual [connectors](../connectors/).
{% endhint %}
