# Utilities

Utilities are the foundational building blocks for data processing, timing, and asset generation. These classes work without external systems and provide the core logic and helper tools to manage your App's behavior.

## Available utility classes

<table><thead><tr><th width="220">Class</th><th>Description</th></tr></thead><tbody><tr><td><a href="barcode-generation.md">Barcode generation</a></td><td>Dynamically generates barcodes and QR codes as images or binary data for labels and UI display.</td></tr><tr><td><a href="counter.md">Counter</a></td><td>Manages incremental values, for example production counts or sequence numbers.</td></tr><tr><td><a href="cron.md">Cron</a></td><td>Schedules automated tasks (like daily reports or backups) using the standard cron expression format.</td></tr><tr><td><a href="data-processing.md">Data processing</a></td><td>Functions for manipulating data, such as merging objects, filtering arrays, or mapping value ranges.</td></tr><tr><td><a href="data-simulation.md">Data simulation</a></td><td>Generates synthetic data points to test your logic before connecting to real hardware.</td></tr><tr><td><a href="event-simulation.md">Event simulation</a></td><td>Triggers mock events to verify that your reactive flows (like alarms or UI changes) respond correctly.</td></tr><tr><td><a href="pdf-processing.md">PDF processing</a></td><td>Splits, merges, or modifies existing PDF documents.</td></tr><tr><td><a href="pdf-templates.md">PDF templates</a></td><td>Generates dynamic PDF documents (like invoices or delivery notes) using HTML/CSS templates.</td></tr><tr><td><a href="stopwatch.md">Stopwatch</a></td><td>A high-resolution timer for accurately measuring intervals.</td></tr><tr><td><a href="timer.md">Timer</a></td><td>Introduces delays or wait periods into your flows.</td></tr><tr><td><a href="users.md">Users</a></td><td>Manages users and App access programmatically. Lists available Apps and registered users, and generates dynamic invitation links.</td></tr></tbody></table>

{% hint style="info" %}
#### Testing with simulated data

When building complex industrial logic, use data and event simulation during the initial build phase. This lets you verify that your dashboards and databases work correctly before you touch a physical PLC or sensor. Once your logic is proven, swap the simulation blocks for your actual [connectors](../connectors/).
{% endhint %}
