# Utilities

The Utilities category contains the foundational building blocks for data processing, timing, and asset generation. Unlike [connectors](../connectors/) or [storage](../storage/), these classes do not require external systems. They provide the core logic and helper tools to manage your application's behavior.

#### Available utility classes

* [**Barcode Generation**](barcode-generation.md): Dynamically generates barcodes and QR codes as images or binary data for labels and UI display.
* [**Counter**](counter.md): Manages incremental values—perfect for tracking production counts or sequence numbers.
* [**Cron**](cron.md): Provides a powerful way to schedule automated tasks (like daily reports or backups) using the standard cron expression format.
* [**Data Processing**](data-processing.md): Essential functions for manipulating data, such as merging objects, filtering arrays, or mapping value ranges.
* [**Data Simulation**](data-simulation.md): Generates synthetic data points to test your logic before connecting to real hardware.
* [**Event Simulation**](event-simulation.md): Triggers mock events to verify that your reactive flows (like alarms or UI changes) respond correctly.
* [**PDF Processing**](pdf-processing.md): Tools to split, merge, or modify existing PDF documents.
* [**PDF Templates**](pdf-templates.md): Generates professional, dynamic PDF documents (like invoices or delivery notes) using HTML/CSS templates.
* [**Stopwatch**](stopwatch.md): A high-resolution timer for accurately measuring intervals.
* [**Timer**](timer.md): Introduces delays or "wait" periods into your flows.
* [**Users**](users.md): A service for programmatically managing users and application access. Use it to list available apps, registered users, and generate dynamic invitation links.

{% hint style="info" %}
#### Pro Tip: Testing with simulated data

When building complex industrial logic, use Data and Event Simulation during the initial build phase. This allows you to verify that your dashboards and databases are working correctly before you ever touch a physical PLC or sensor. Once your logic is proven, simply swap the simulation blocks for your actual [connectors](../connectors/).
{% endhint %}
