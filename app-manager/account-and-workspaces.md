# Account and workspaces

A Heisenware account is the top-level container for your organization's members and workspaces. All work happens within an account.

## Create a new account

1. Go to the [Heisenware sign-up page](https://heisenware.cloud/manager/authentication/sign-up).
2. Follow the on-screen instructions to choose an account name and sign up with your email or Google account.

## Log in to an existing account

1. Go to your account's unique URL, which follows the format `[your-account-name].heisenware.cloud`.
2. Log in with your credentials.

{% hint style="info" %}
#### Note on URLs

On request, we can also make Heisenware available under your own domain (full white-label). [Contact us](mailto:support@heisenware.com) to discuss.

The URL format above applies to accounts on the Heisenware cloud. If your organization [self-hosts](../self-hosting/README.md#self-hosted-on-premises) its own instance, the login URL may differ. Ask your internal administrator for the correct address.
{% endhint %}

## Deleting your account

To permanently delete your Heisenware account and all associated data, send a deletion request to our [support team](mailto:support@heisenware.com).

## Managing members

Members are the developers and admins who build and manage Apps in your account. To invite, manage, or remove members, see the [Members](members.md) article.

## Account structure

The Heisenware platform follows a clear hierarchy, and understanding it is key to managing your Apps effectively.

An account holds all your organization's [members](members.md) and contains at least one workspace. It can also have [multiple workspaces](account-and-workspaces.md#multiple-workspaces) to separate Apps, data, and resources across different teams or locations.

By default, every new account has a single `Default Workspace`. This workspace is a container for your Apps and all their shared resources.

Inside it, you can build an unlimited number of Apps. Every App in a workspace shares access to that workspace's resources:

* **Databases**: A [timeseries database](../reference/functions/storage/timeseries-database.md) (InfluxDB) for high-frequency sensor data, and a [relational database](../reference/functions/storage/relational-database.md) (PostgreSQL) for structured data.
* [**File Explorer**](../app-builder/explorers/files.md): Stores and manages the files your Apps use.
* [**Integrations (inbound)**](integrations.md): Shared connections to external systems.

The diagram below illustrates this structure:

<figure><img src="../.gitbook/assets/Account Structure (1).png" alt=""><figcaption></figcaption></figure>

### Multiple workspaces

For organizations with more complex needs, such as running separate Apps for multiple clients or separating distinct departments, Heisenware supports multiple workspaces in a single account. Each workspace is a completely separate environment with its own resources, keeping data and Apps fully isolated from one another.

{% hint style="info" %}
This is an advanced feature, off by default. If you have a use case for multiple workspaces, [contact us](mailto:hello@heisenware.com) to discuss your requirements.
{% endhint %}
