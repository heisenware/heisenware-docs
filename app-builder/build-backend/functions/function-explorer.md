# Function Explorer

The Function Explorer is the panel on the left that holds all functions available to your App. It organizes them into categories and hierarchies (classes and instances) and lets you drag them directly onto the Backend Builder canvas.

<figure><img src="../../../.gitbook/assets/image (45).png" alt=""><figcaption></figcaption></figure>

## Categories

* [**Connectors**](connectors/): Integration functions for industrial protocols and external systems. Connectors in this category require the target system to be reachable over the network or internet.
* [**Storage**](storage/): The relational database and timeseries database classes to connect to databases, including the built-in internal PostgreSQL and InfluxDB. Also holds lightweight stores like the data store and circular buffer.
* [**Utilities**](utilities/): Data processing, timers, cron jobs, barcode generation, PDF processing, and more.
* **Custom**: Your own building blocks, including [subflows](subflows.md) and functions loaded via Custom Extensions.

In addition to the categories, every installed and started [Agent](../agents/) appears as its own entry, listed by its name and holding the connector classes selected when building it.

## Toolbar

The icons at the top of the panel extend your function library:

* **Create Agent** (<i class="fa-cloud">:cloud:</i>): Build and download a new [Agent](../agents/).
* **Install extension** (<i class="fa-puzzle-piece">:puzzle-piece:</i>): Add official or Custom [Extensions](extensions/) to your library.
* **Smart onboarding** (<i class="fa-screencast">:screencast:</i>): Pair external clients, such as IoT devices, with your account. See [smart onboarding](connectors/#smart-onboarding).
* **Collapse** (<i class="fa-chevrons-up">:chevrons-up:</i>): Collapse all open entries.
