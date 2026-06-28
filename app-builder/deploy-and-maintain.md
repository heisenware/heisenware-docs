# Deploy & Maintain

[Building logic](build-backend/) and [designing UI](build-frontend/) is only half the battle. Heisenware provides tools to test your work in real-time, save snapshots of your progress, and eventually deploy your [apps to production](https://app.gitbook.com/s/E5Ketpww1s7TauSAJrJ8/production-apps).

## App Testing (Test Mode)

Before you deploy, you can use Test Mode to verify your logic and UI directly inside the App Builder. When active, the UI preview becomes fully interactive, and all backend logic goes "live."

* **How to start**: Click the Test button in the top toolbar.
* **Behavior**: The app will start polling data from connected sources or writing to databases. Form inputs become clickable, and buttons will trigger their connected flows.
* **Manual triggers**: Even in Test Mode, you can still manually click triggers on Function blocks in the Backend Builder to force-start a sequence.

<div align="center"><figure><img src="../.gitbook/assets/deploy_bottom.png" alt=""><figcaption><p>TEST button</p></figcaption></figure></div>

## Versioning Tags (Snapshots)

A versioning tag is a snapshot of your app's entire state, including all backend logic, UI elements, and data bindings.

<figure><img src="../.gitbook/assets/image (521).png" alt=""><figcaption></figcaption></figure>

{% hint style="warning" %}
**What is NOT in a tag?**

Tags do not store external files (from the file server), database table data, or global themes.
{% endhint %}

### Why use tags?

* **Undo/restore**: Create a "Save Point" before trying a risky logic change.
* **Templates**: Export a tag as a `.hwt` file to use it as a starting point for a new app.
* **Sharing**: Share your app configuration with other Heisenware accounts.

### Managing tags

* Manual creation: Click the Tag icon and give your snapshot a name.
* **Auto-Tags**: Heisenware automatically creates a tag every time you deploy an app.
* **Import/export**: Use the Download and Import icons in the tag history to move `.hwt` files between your computer and the platform.

{% hint style="success" %}
**Recommendation**

Before importing, create a new tag of your current app state. This gives you a rollback point if the imported tag isn't what you expected.
{% endhint %}

### **Video demo versioning tags**

{% embed url="https://www.youtube.com/watch?v=3bUe4TnlRQM" %}

## Deployment

Deployment makes your app available to your users. To push your latest changes live, click DEPLOY in the upper-right corner.

<div align="center"><figure><img src="../.gitbook/assets/deploy_bottom.png" alt=""><figcaption><p>DEPLOY button</p></figcaption></figure></div>

* **Downtime**: Depending on the app's complexity, it may be offline for 10 to 30 seconds during a fresh deployment.
* **Distribution**: Click the version number after a successful deploy to find your unique app URL for sharing.

{% hint style="warning" %}
Too frequent deployments are not recommended for live production environments, as users will be prompted to reload the app when a new version is pushed.
{% endhint %}

<figure><img src="../.gitbook/assets/deploy_a_app_looped.gif" alt=""><figcaption></figcaption></figure>
