# Overview

Production Apps are the live, deployed versions of your work that your users interact with. Because Heisenware Apps are built on modern web standards, they offer a seamless experience across all devices, without the need for traditional app stores.

## Progressive Web App (PWA) technology

All Heisenware Apps are Progressive Web Apps. They combine the accessibility of a website with the performance and feel of a native mobile or desktop app.

* **Installable**: Users can add the App to their home screen or desktop.
* **Cross-platform**: A single URL works on iOS, Android, and desktop.
* **Live updates**: When you deploy a new version, users receive the update instantly.
* **Responsive**: Layouts scale to fit any screen size.

{% hint style="info" %}
#### App Store ready

While not required, PWAs can be packaged for the Apple App Store or Google Play Store. [Contact us](mailto:support@heisenware.com) if you need this service.
{% endhint %}

## Accessing and sharing your App

### The unique App URL

Every App has a permanent, unique URL. You can find this link in the App Builder's version display or within the [App Manager's distribution settings](../app-manager/overview.md#distribution).

The URL structure follows this format:

`https://[account-name].heisenware.cloud/app/[workspace-name]/[app-identifier]`

### Single-page architecture (SPA)

Heisenware Apps are Single-Page Applications (SPA). The entire App loads once, and navigating between pages happens internally. Because the URL stays consistent, you can also embed any App into another website or internal software portal using a standard HTML `<iframe>`.

{% hint style="info" %}
The URL in the address bar doesn't change when you switch pages, so you can't share a direct link to a specific subpage. You always share the main App link.
{% endhint %}

### Responsive experience

The [Frontend Builder](../app-builder/build-frontend/) lets you design for five different screen sizes (XS to XL).

* **Automatic scaling**: If a user opens the App on a device size you haven't specifically designed for, Heisenware scales the closest available layout to fit the screen.
* **Optimization**: For the best experience, check your layout in all five previews before deployment to ensure a pixel-perfect fit for phones, tablets, and desktops.

## Installing the App

Installing a PWA removes the browser address bar and gives the user a dedicated icon on their home screen or taskbar, making the experience feel like a native app.

### The install prompt

Most modern browsers automatically show a prompt (a toast message or an icon in the address bar) asking the user to install the App on first visit. From there they can choose to install, mute, or dismiss the prompt.

<figure><img src="../.gitbook/assets/image (523).png" alt=""><figcaption></figcaption></figure>

### Manual installation steps

If the automatic prompt is missed, users can install the App manually based on their device:

<table data-header-hidden><thead><tr><th width="132.83837890625"></th><th width="174.0032958984375"></th><th></th></tr></thead><tbody><tr><td><strong>Platform</strong></td><td><strong>Browser</strong></td><td><strong>Steps</strong></td></tr><tr><td>Desktop</td><td>Chrome / Edge</td><td>Click the Install icon in the address bar. <a href="https://support.google.com/chrome/answer/9658361">Learn more</a>.</td></tr><tr><td>Desktop</td><td>Safari (macOS)</td><td>Go to File > Add to Dock. <a href="https://support.apple.com/en-us/104996">Learn more</a>.</td></tr><tr><td>Android</td><td>Any browser</td><td>Open the browser menu (⋮) and select Add to Home Screen.</td></tr><tr><td>iOS</td><td>Any browser</td><td>Tap the Share icon → Add to Home Screen.</td></tr></tbody></table>
