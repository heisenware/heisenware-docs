# Production Apps Overview

Production apps are the live, deployed versions of your work that your end-users interact with. Because Heisenware apps are built on modern web standards, they offer a seamless experience across all devices without the need for traditional app stores.

## Progressive Web App (PWA) Technology

All Heisenware applications are Progressive Web Apps. This means they combine the accessibility of a website with the performance and feel of a native mobile or desktop app.

* **Installable**: Users can add the app to their home screen or desktop.
* **Cross-Platform**: A single URL works on iOS, Android, and Desktop.
* **Live Updates**: When you deploy a new version, users receive the update instantly.
* **Responsive**: Layouts scale to fit any screen size.

{% hint style="success" %}
**App Store Ready**: While not required, PWAs can be packaged for the Apple App Store or Google Play Store. [Contact us](mailto:support@heisenware.com) if you require this service.
{% endhint %}

## Accessing and Sharing Your App

### The Unique App URL

Every application has a permanent, unique URL. You can find this link in the App Builder's version display or within the [App Manager distribution settings](https://app.gitbook.com/s/E5Ketpww1s7TauSAJrJ8/app-manager).

The URL structure follows this format:

`https://[account-name].heisenware.cloud/app/[workspace-name]/[app-identifier]`

### Single-Page Architecture (SPA)

Heisenware apps are Single-Page Applications (SPA). The entire app loads once, and navigating between pages happens internally.

{% hint style="info" %}
Because the URL in the address bar does not change when you switch pages, you cannot share a direct link to a specific subpage. You always share the main application link.
{% endhint %}

### Embedding with iFrames

Because the URL is consistent, you can easily embed any Heisenware app into another website or internal software portal using a standard HTML `<iframe>`.

### Responsive Experience

The [Frontend Builder](../app-builder/build-frontend/) allows you to design for five different screen sizes (XS to XL).

* **Automatic Scaling**: If a user opens the app on a device size you haven't specifically designed, Heisenware will scale the closest available layout to fit the screen.
* **Optimization**: For the best user experience, we recommend checking your layout in all five previews before deployment to ensure a "pixel-perfect" fit for phones, tablets, and desktops.

## Installing the Application

Installing a PWA removes the browser address bar and gives the user a dedicated icon on their home screen or taskbar, making the experience feel like a native application.

### The Install Prompt

Most modern browsers will automatically show a prompt (a toast message or an icon in the address bar) asking the user if they would like to install the app when they first visit the URL. Here you can choose to install the app, mute, and dismiss the prompt.

<figure><img src="../.gitbook/assets/image (523).png" alt=""><figcaption></figcaption></figure>

### Manual Installation Steps

If the automatic prompt is missed, users can install the app manually based on their device:

<table data-header-hidden><thead><tr><th width="132.83837890625"></th><th width="174.0032958984375"></th><th></th></tr></thead><tbody><tr><td><strong>Platform</strong></td><td><strong>Browser</strong></td><td><strong>Steps</strong></td></tr><tr><td>Desktop</td><td>Chrome / Edge</td><td>Click the Install icon in the address bar. <a href="https://support.google.com/chrome/answer/9658361">Learn more</a>.</td></tr><tr><td>Desktop</td><td>Safari (macOS)</td><td>Go to File > Add to Dock. <a href="https://support.apple.com/en-us/104996">Learn more</a>.</td></tr><tr><td>Android</td><td>Any Browser</td><td>Open the browser menu (⋮) and select Add to Home Screen.</td></tr><tr><td>iOS</td><td>Any Browser</td><td>Tap the Share icon → Add to Home Screen.</td></tr></tbody></table>
