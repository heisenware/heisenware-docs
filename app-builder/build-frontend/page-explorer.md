# Page Explorer

Pages are the individual screens that organize your App's functionality. Heisenware uses a hierarchy of pages and subpages to keep your App structured and easy to navigate. The Page Explorer is also where you configure the App's navigation menu.

Open the Page Explorer by clicking the navigator icon (<i class="fa-location-arrow-up">:location-arrow-up:</i>) on the left panel.

<figure><img src="../../.gitbook/assets/image (2).png" alt=""><figcaption></figcaption></figure>

## Managing your App structure

### Page types

* **Pages**: Your top-level screens. By default, they appear in the App's main navigation menu.
* **Subpages**: Nested under a page. They do not appear in the main menu automatically, and are typically used for detail views, settings, or pop-up style content that you link to manually.

### Creating and deleting pages

* **Add/duplicate**: Right-click any page in the panel to create a new page, a subpage, or to duplicate an existing page.
* **Delete**: Right-click any page and click delete. The first page in your App cannot be deleted.

### Reordering pages

Click a page's number and drag it into a new position. The new order carries over to the App's navigation menu.

### Per-page settings

Click the small pencil icon inside a page's representation to open its settings, where you set:

* The page name shown in the menu
* The menu icon
* The app bar title shown at the top of the screen

Subpages inherit the app bar title from their parent page, so users always know which section they are in.

## App menu

The App menu is the navigation users see across all pages and subpages. To configure it, click the pencil icon next to the `PAGES` label at the top of the Page Explorer.

### Menu types

* **None**: No navigation menu.
* **Top bar**: A bar at the top showing the app bar title and menu icons.
* **Top bar and bottom tabs**: Combines a top bar with a fixed tab bar at the bottom, for a standard mobile App feel.
* **Bottom tabs only**: A fixed tab bar at the bottom of the screen.
* **Expandable menu drawer**: A classic burger menu that opens and closes.
* **Fixed left menu**: A permanent side menu on the left.

<figure><img src="../../.gitbook/assets/Screenshot 2026-07-08 212421.png" alt=""><figcaption></figcaption></figure>

### Per-screen menu type

Enable **Different navigation menus per screen** in the App menu settings to give each activated screen size its own menu type. Fixed left menu is often a good choice for large screens, while Bottom tabs only or Expandable menu drawer works well on smaller screens. Switch to the screen size you want to configure in the [Frontend Builder](./), then set the menu type.

<figure><img src="../../.gitbook/assets/image (20).png" alt=""><figcaption><p>Different menu per screen</p></figcaption></figure>

## App actions

Some things a user wants are not pages, functions, or widgets: leave the App, start it over, go back a step. Heisenware calls these **App actions**. They act on the App itself in the browser, they carry no data, and they are wired exactly like pages: you drag them and drop them.

The App actions sit in a row at the foot of the Page Explorer:

* **Back**: returns to the page shown before the current one. Does nothing at the start of the visit history.
* **Reload**: restarts the App in this tab with cleared caches.
* **Logout**: forgets this device's credentials for the App and starts the App afresh. Apps with [individual registration](../../app-manager/users-and-access.md) land on the sign-in screen, Apps with a master password ask for it again, public Apps continue as a new anonymous user. Use it for shared devices and shift changes.

Switching pages is an App action too. Its chip is the page itself.

### On a widget

Turn any [button](widgets/trigger-widgets/button.md), [icon](text-icons-and-images.md), or image into a page-switch or action trigger.

* **How to link**: Drag a page or an App action from the Page Explorer and drop it directly onto a button, icon, or image on your UI canvas.
* **Use case**: The primary way to let users open subpages (e.g., a "Machine Details" button opening the corresponding detail view), to navigate in Apps that have no main menu, or to offer a Logout button wherever you like. No top bar is required.
* **Order**: A click fires the functions linked to the button first. Logout and Reload wait for them, so a button that saves and logs out saves first.

### From your logic

Your backend logic can also switch pages and run actions on its own.

* **How to link**: Drag a page or an App action from the Page Explorer onto a function's output, modifier, filter, or error handler.
* **Use case**: If a function detects an error or a successful form submission, the backend pushes the user to an error or success page automatically. A Timer output with Logout ends a session after a fixed time; a filter that detects an alarm switches to the alarm page.
* **What fires it**: Every truthy value the output produces after the App has loaded. Falsy values, such as a filter that blocks, never fire.
* **Who is reached**: The action reaches the users the value reaches. When a user's click started the flow, only that user: a Timer that the user started ticks for that user alone, so "logout after ten minutes" is per user with nothing to configure. When no user started the flow, a poll or a listener fired by the backend, every connected user: an alarm switches every screen, a backend-fired Logout ends every session.
* **Back** cannot be dropped on an output. Walking every user's history at once makes no sense, so it lives on widgets only.

<figure><img src="../../.gitbook/assets/image (32).png" alt=""><figcaption><p>Switch page link</p></figcaption></figure>

The browser's back and forward buttons, and the back gesture of a phone, walk your App's pages the same way the Back action does. The App's URL never changes.

{% hint style="info" %}
Need more vertical space on a page? Use the page height setting in the [Frontend Builder toolbar](./#the-toolbar).
{% endhint %}
