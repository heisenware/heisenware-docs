# Overview

Production Apps are the live, deployed versions of your work that your users interact with. Because Heisenware Apps run on modern web standards, they feel seamless across all devices, with no app store required.

## Progressive Web App (PWA) technology

Every Heisenware App is a Progressive Web App. It combines the reach of a website with the performance and feel of a native mobile or desktop app.

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

Every App has a permanent, unique URL. Find it in the App Builder's version display or in the [App Manager's distribution settings](../app-manager/overview.md#distribution).

The URL follows this format:

`https://[account-name].heisenware.cloud/app/[workspace-name]/[app-identifier]`

### Single-page architecture (SPA)

Heisenware Apps are single-page applications (SPA). The whole App loads once, and navigation between pages happens internally. Because the URL stays constant, you can also embed any App in another website or internal portal with a standard HTML `<iframe>`.

{% hint style="info" %}
The URL in the address bar doesn't change when you switch pages, so you can't link directly to a specific subpage. You always share the main App link.
{% endhint %}

### Responsive experience

The [Frontend Builder](../app-builder/build-frontend/) lets you design for five screen sizes (XS to XL).

* **Automatic scaling**: When a user opens the App on a size you didn't design for, Heisenware scales the closest layout to fit the screen.
* **Optimization**: For the best result, check your layout in all five previews before deploying, so it fits phones, tablets, and desktops down to the pixel.

## Installing the App

Installing a PWA removes the browser address bar and gives the user a dedicated icon on their home screen or taskbar, so the App feels native.

### The install prompt

Most modern browsers show a prompt on the first visit (a toast message or an address-bar icon) asking the user to install the App. From there they can install, mute, or dismiss it.

<figure><img src="../.gitbook/assets/image (523).png" alt=""><figcaption></figcaption></figure>

### Manual installation steps

If a user misses the automatic prompt, they can install the App manually by device:

<table data-header-hidden><thead><tr><th width="132.83837890625"></th><th width="174.0032958984375"></th><th></th></tr></thead><tbody><tr><td><strong>Platform</strong></td><td><strong>Browser</strong></td><td><strong>Steps</strong></td></tr><tr><td>Desktop</td><td>Chrome / Edge</td><td>Click the Install icon in the address bar. <a href="https://support.google.com/chrome/answer/9658361">Learn more</a>.</td></tr><tr><td>Desktop</td><td>Safari (macOS)</td><td>Go to File > Add to Dock. <a href="https://support.apple.com/en-us/104996">Learn more</a>.</td></tr><tr><td>Android</td><td>Any browser</td><td>Open the browser menu (⋮) and select Add to Home Screen.</td></tr><tr><td>iOS</td><td>Any browser</td><td>Tap the Share icon → Add to Home Screen.</td></tr></tbody></table>
