# Users and access

Heisenware gives you granular control over who can access your Apps. Each App can have its own security settings, even when several sit in the same workspace.

{% hint style="info" %}
#### Users vs. members

This article covers the users of your Apps. For managing your members, the people who build and manage your Apps, see [Members](members.md).
{% endhint %}

## Access modes

In the Apps panel, choose from five access options to match your security requirements.

<figure><img src="../.gitbook/assets/image (524).png" alt=""><figcaption></figcaption></figure>

{% hint style="warning" %}
You can change these settings at any time, but each change instantly affects all active sessions. Frequent changes may confuse your users.
{% endhint %}

### Public access

* **Option**: _Anyone can use the app_
* **Details**: The App is open. Anyone with the URL or QR code can access the interface immediately. No login is required.

### Shared security

* **Option**: _Users must provide a master password_
* **Details**: You must define a master password in the settings.
* **Session**: The browser stores the authentication in local storage. Users re-enter the password only on a different device, in an incognito window, or after clearing their browser data.

### Individual registration

* **Option**: _Users have to sign up_
* **Details**: Heisenware manages user accounts automatically. Users can register with an email/password or their Google account.
* **Session**: Like the master password, the browser keeps the login state in local storage. Users stay logged in until they log out or clear their browser cache.

### Dual authentication

* **Option**: _Users have to sign up and provide a master password_
* **Details**: Combines the previous two methods. Users must have a personal account and know the shared master password to gain entry.

### Private whitelist

* **Option**: _Only previously invited users can log in_
* **Details**: This opens an email invite form. Only the specific email addresses you invite can register and access the App.
* **Programmatic invite:** With the [`users` class](../app-builder/build-backend/function-explorer/utilities/users.md) in the backend, you can also invite users programmatically from another App.

## User management

The Users card in each App gives you a real-time view of who is accessing your software.

{% hint style="info" %}
#### Managing users programmatically

You can also manage users from within an App using the [`users` class](../app-builder/build-backend/function-explorer/utilities/users.md).
{% endhint %}

### Anonymized sessions

For Apps using [Public access](#public-access) or [Shared security](#shared-security), the table shows anonymized strings, IP addresses, and session data so you can track unique device usage.

<figure><img src="../.gitbook/assets/image (114).png" alt=""><figcaption></figcaption></figure>

### Registered profiles

For Apps using [Individual registration](#individual-registration) or [Dual authentication](#dual-authentication), the table shows names and usernames (email addresses). Heisenware recognizes a user logging in from different devices with the same email as the same person.

<figure><img src="../.gitbook/assets/image (452).png" alt=""><figcaption></figcaption></figure>

### Deleting users

To remove a user, registered account or anonymous session alike, click the trash icon in the list. Deleting a user removes their record and ends their current session.

{% hint style="info" %}
#### Leveraging user data in logic

Once a user is authenticated, the Backend Builder exposes their information through the `$USER` system variable. Use it to personalize the UI (e.g. "Welcome, \[Name]"), filter database queries so users see only their own data, or log exactly who performed an action in your backend.

For example, if a table stores each row's owner in an `email` field, a `getTableData` function can filter for the logged-in user's own rows:

```yaml
# name
orders
# options
filter: ['email', '=', $USER]
```
{% endhint %}
