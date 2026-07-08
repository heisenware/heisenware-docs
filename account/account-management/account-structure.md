# Account Structure

The Heisenware platform is organized in a clear hierarchy. Understanding this structure is key to managing your Apps effectively.

An Account holds all your organization's [Members](../../app-manager/members.md) and contains at least one Workspace. It can, however, have [multiple Workspaces](#multiple-workspaces) to separate Apps, data, and resources across different teams or locations.

By default, every new Account has a single `Default Workspace`. This Workspace acts as a container for your Apps and all their shared resources.

Within this Workspace, you can build an unlimited number of Apps. All Apps built inside a Workspace share access to that Workspace's resources, which include:

* **Databases**: A [Timeseries Database](../../app-builder/build-backend/function-explorer/storage/timeseries-database.md) (InfluxDB) for high-frequency sensor data, and a [Relational Database](../../app-builder/build-backend/function-explorer/storage/relational-database.md) (PostgreSQL) for structured data.
* [**File Explorer**](../../app-builder/build-backend/file-explorer.md): For storing and managing files used in your Apps.
* [**Inbound Integrations**](../../app-manager/integrations-inbound-connections.md): Shared connections to external systems.

This structure is illustrated below:

<figure><img src="../../.gitbook/assets/Account Structure (1).png" alt=""><figcaption></figcaption></figure>

## Multiple Workspaces

For organizations with complex needs, such as running separate Apps for multiple clients or separating distinct departments, Heisenware supports multiple Workspaces within a single Account. Each Workspace provides a completely separate environment with its own resources, keeping data and Apps fully isolated from one another.

{% hint style="info" %}
This is an advanced feature and not enabled by default. If you have a use case for multiple Workspaces, [contact us](mailto:hello@heisenware.com) to discuss your requirements.
{% endhint %}
