# Functions explorer

The Functions explorer is the panel on the left that holds all functions available to your App. It organizes them into categories and hierarchies (classes and instances) and lets you drag them directly onto the Flowboard.

<figure><img src="../../.gitbook/assets/image (45).png" alt=""><figcaption></figcaption></figure>

## Categories

* [**Connectors**](../../reference/functions/connectors/README.md): Functions for industrial protocols and external systems. Connectors in this category require the target system to be reachable over the network or internet.
* [**Storage**](../../reference/functions/storage/README.md): The relational database and timeseries database classes to connect to databases, including the built-in internal PostgreSQL and InfluxDB. Also holds lightweight stores like the data store and circular buffer.
* [**Utilities**](../../reference/functions/utilities/README.md): Data processing, timers, cron jobs, barcode generation, PDF processing, and more.
* **Custom**: Your building blocks, including [subflows](../../concepts/subflows.md) and functions loaded via custom add-ons.

In addition to the categories, every installed and started [agent](../../concepts/agents-and-where-code-runs.md) appears as its own entry, listed by its name and holding the connector classes selected when building it.

## Toolbar

The icons at the top of the panel extend your function library:

* **Create Agent** (<i class="fa-cloud-arrow-down">:cloud-arrow-down:</i>): Build and download a new [agent](../../concepts/agents-and-where-code-runs.md).
* **Install extension** (<i class="fa-puzzle-piece">:puzzle-piece:</i>): Add official or custom [add-ons](../../reference/functions/add-ons/README.md) to your library.
* **Smart onboarding** (<i class="fa-screencast">:screencast:</i>): Pair external clients, such as IoT devices, with your workspace. See [smart onboarding](../../app-manager/integrations.md#method-2-smart-onboarding).
* **Collapse** (<i class="fa-chevrons-up">:chevrons-up:</i>): Collapse all open entries.
