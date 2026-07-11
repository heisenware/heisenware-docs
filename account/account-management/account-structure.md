# Account structure

The Heisenware platform follows a clear hierarchy, and understanding it is key to managing your Apps effectively.

An account holds all your organization's [members](../../app-manager/members.md) and contains at least one workspace. It can also have [multiple workspaces](#multiple-workspaces) to separate Apps, data, and resources across different teams or locations.

By default, every new account has a single `Default Workspace`. This workspace is a container for your Apps and all their shared resources.

Inside it, you can build an unlimited number of Apps. Every App in a workspace shares access to that workspace's resources:

* **Databases**: A [timeseries database](../../app-builder/build-backend/function-explorer/storage/timeseries-database.md) (InfluxDB) for high-frequency sensor data, and a [relational database](../../app-builder/build-backend/function-explorer/storage/relational-database.md) (PostgreSQL) for structured data.
* [**File Explorer**](../../app-builder/build-backend/file-explorer.md): Stores and manages the files your Apps use.
* [**Integrations (inbound)**](../../app-manager/inbound-integrations.md): Shared connections to external systems.

The diagram below illustrates this structure:

<figure><img src="../../.gitbook/assets/Account Structure (1).png" alt=""><figcaption></figcaption></figure>

## Multiple workspaces

For organizations with more complex needs, such as running separate Apps for multiple clients or separating distinct departments, Heisenware supports multiple workspaces in a single account. Each workspace is a completely separate environment with its own resources, keeping data and Apps fully isolated from one another.

{% hint style="info" %}
This is an advanced feature, off by default. If you have a use case for multiple workspaces, [contact us](mailto:hello@heisenware.com) to discuss your requirements.
{% endhint %}
