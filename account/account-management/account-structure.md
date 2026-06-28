# Account Structure

The Heisenware platform is organized in a clear hierarchy. Understanding this structure is key to managing your projects effectively.

An Account holds all your organization's [Members](https://www.google.com/search?q=../app-manager/members) (users) and contains at least one Workspace. It can, however, have [multiple workspaces](/broken/pages/x2eB0zfDuhUxnsn8Dhov) to separate apps, data, and resources of different teams or locations.

By default, every new account has a single `Default Workspace`. This Workspace acts as a container for your applications and all their shared resources.

Within this Workspace, you can build an unlimited number of Apps. All apps built inside a Workspace share access to that Workspace's resources, which include:

* **Databases**: An [InfluxDB](/broken/pages/WbN12C0jrmgbmfoePmC2) for time-series data and a [PostgreSQL](/broken/pages/KnP2ytrxx6Z18AeLCpks) database for relational data.
* [**File Server**](../../app-builder/build-backend/file-explorer.md): For storing and managing files used in your apps.
* [**Integrations**](../../app-manager/integrations-inbound-connections.md): Shared connections to external systems.

This structure is illustrated below:

<figure><img src="../../.gitbook/assets/Account Structure (1).png" alt=""><figcaption></figcaption></figure>

## Multiple Workspaces

For organizations with complex needs, such as managing projects for multiple clients or separating distinct departments, Heisenware supports multiple Workspaces within a single account. Each Workspace provides a completely separate environment with its own set of resources, ensuring data and apps are fully isolated from one another.

{% hint style="info" %}
This is an advanced feature that is not enabled by default. If you have a use case for multiple Workspaces, please [contact us](mailto:hello@heisenware.com) to discuss your requirements.
{% endhint %}
