# Access and User Management

Heisenware provides granular control over who can access your apps. Each application can have distinct security settings, even if they reside within the same workspace.

{% hint style="info" %}
#### App Users vs. Member

This article covers the end-users of your created apps. For managing your development team (the people building and managing the apps), refer to [members](members.md).
{% endhint %}

## Access Modes

In the Apps panel, you can choose from five distinct access options to match your security requirements.

<figure><img src="../.gitbook/assets/image (524).png" alt=""><figcaption></figcaption></figure>

{% hint style="warning" %}
While you can change these settings at any time, doing so will instantly affect all active sessions. Frequent changes may confuse your users.
{% endhint %}

### Public Access

* **Option**: _Anyone can use the app_
* **Details**: The app is open. Anyone with the URL or QR code can access the interface immediately. No login is required.

### Shared Security

* **Option**: _Users must provide a master password_
* **Details**: You must define a master password in the settings.
* **Session**: Authentication is stored in the browser's local storage. Users are only prompted to re-enter the password if they use a different device, an incognito window, or clear their browser data.

#### Individual Registration

* **Option**: _Users have to sign up_
* **Details**: Heisenware manages user accounts automatically. Users can register with an email/password or their Google account.
* **Session**: Like the master password, login state is persistent in local storage. Users remain logged in until they manually log out or clear their browser cache.

#### Dual Authentication

* **Option**: _Users have to sign up and provide a master password_
* **Details**: Combines the previous two methods. Users must have a personal account and know the shared master password to gain entry.

#### Private Whitelist

* **Option**: _Only previously invited users can log in_
* **Details**: This opens an email invite form. Only the specific email addresses you invite can register and access the app.
* **Programmatic Invite:** Using the [`users` class](../app-builder/build-backend/function-explorer/utilities/users.md) in the backend, you can also invite users programmatically from another application.

## User Management

The App Users card within each app provides a real-time view of who is accessing your software.

* **Anonymized Sessions**: For apps without registration (public or master password only), the table displays anonymized strings, IP addresses, and session data to help you track unique device usage.

<figure><img src="../.gitbook/assets/image (451).png" alt=""><figcaption></figcaption></figure>

* **Registered Profiles**: For apps requiring registration, the table displays names and usernames (email addresses). Users who log in from different devices with the same email are correctly recognized as the same individual.

<figure><img src="../.gitbook/assets/image (452).png" alt=""><figcaption></figcaption></figure>

* **Deleting Users**: You can manually remove users, both registered accounts and anonymous sessions, directly from the list by clicking the trash icon. Deleting a user removes their record and terminates their current session.

{% hint style="success" %}
### Leveraging user data in logic

Once a user is authenticated, their information is automatically available in the Backend Builder via the `$USER` system variable. You can use this variable to personalize the UI (e.g., "Welcome, \[Name]"), filter database queries so users only see their own data, or log exactly who performed a specific action in your backend.
{% endhint %}
