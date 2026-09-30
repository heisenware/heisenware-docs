# Open and install an App

The App Player runs the deployed version of your App for its users. Heisenware Apps are built on web standards, so they run on any device without an app store.

## Progressive Web App (PWA) technology

Every Heisenware App is a Progressive Web App. It opens like a website and installs like a native mobile or desktop app.

* **Installable**: Users add the App to their home screen or desktop.
* **Cross-platform**: A single URL works on iOS, Android, and desktop.
* **Live updates**: Deploy a new version, and users get it instantly.
* **Responsive**: Layouts scale to fit any screen size.

{% hint style="info" %}
#### App store ready

You don't need it, but you can package a PWA for the Apple App Store or Google Play Store. [Contact us](mailto:support@heisenware.com) if you want this service.
{% endhint %}

## Accessing and sharing your App

### The unique App URL

Every App has a permanent, unique URL. Find it in the App Builder's version display or in the [App Manager's distribution settings](../app-manager/README.md#distribution).

The URL follows this format:

`https://[account-name].heisenware.cloud/app/[workspace-name]/[app-identifier]`

### Single-page architecture (SPA)

Heisenware Apps are single-page applications (SPA). The whole App loads once, and navigation between pages happens internally. Because the URL stays constant, you can also embed any App in another website or internal portal with a standard HTML `<iframe>`.

{% hint style="info" %}
The URL in the address bar doesn't change when you switch pages, so you can't link directly to a specific subpage. You always share the main App link.
{% endhint %}

### Responsive experience

The [Page editor](../app-builder/page-editor.md) lets you design for five screens (XS to XL).

* **Automatic scaling**: When a user opens the App on a screen you didn't enable, Heisenware scales the closest layout to fit.
* **Optimization**: Check your layout in all five screen previews before deploying, so it fits phones, tablets, and desktops.

## Installing the App

Installing a PWA removes the browser address bar and gives the user a dedicated icon on their home screen or taskbar, so the App feels native.

### The install prompt

Most modern browsers show a prompt on the first visit (a toast message or an address-bar icon) asking the user to install the App. From there they can install, mute, or dismiss it.

<figure><img src="../.gitbook/assets/image (523).png" alt=""><figcaption></figcaption></figure>

### Manual installation steps

If a user misses the automatic prompt, they can install the App manually by device:

<table data-header-hidden><thead><tr><th width="132.83837890625"></th><th width="174.0032958984375"></th><th></th></tr></thead><tbody><tr><td><strong>Platform</strong></td><td><strong>Browser</strong></td><td><strong>Steps</strong></td></tr><tr><td>Desktop</td><td>Chrome / Edge</td><td>Click the Install icon in the address bar. <a href="https://support.google.com/chrome/answer/9658361">Learn more</a>.</td></tr><tr><td>Desktop</td><td>Safari (macOS)</td><td>Go to File > Add to Dock. <a href="https://support.apple.com/en-us/104996">Learn more</a>.</td></tr><tr><td>Android</td><td>Any browser</td><td>Open the browser menu (⋮) and select Add to Home Screen.</td></tr><tr><td>iOS</td><td>Any browser</td><td>Tap the Share icon → Add to Home Screen.</td></tr></tbody></table>
