# Pages explorer

Pages are the individual screens that organize your App's functionality. Heisenware uses a hierarchy of pages and subpages to keep your App structured and easy to navigate. The Pages and actions explorer is also where you configure the App's navigation menu.

Open the Pages and actions explorer by clicking the navigator icon (<i class="fa-location-arrow-up">:location-arrow-up:</i>) on the left panel.

<figure><img src="../../.gitbook/assets/image (2).png" alt=""><figcaption></figcaption></figure>

## Managing your App structure

### Page types

* **Pages**: Your top-level pages. By default, they appear in the App's main navigation menu.
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

Both are shared across screen sizes until you pin one: hover the field and click the pin to give the selected screen its own value. A page has no title of its own: a page heading is a text box on the page.

## App menu

The App menu is the navigation users see across all pages and subpages. To configure it, click the pencil icon next to the `PAGES` label at the top of the Pages and actions explorer.

### Menu types

* **None**: No navigation menu.
* **Bottom tabs**: A fixed tab bar at the bottom of the screen, for a standard mobile App feel.
* **Burger menu**: A burger button in a top corner of every page; the menu slides in over the page and dims it (or pushes the page aside, from the left or the right, as wide as you like). There is no bar: the page keeps its full height, so a title bar is your own band of widgets laid under the burger.
* **Fixed left menu**: A permanent side menu on the left.

There is no top bar menu type. A title bar of your own, with a logo, a title, or a logout button, is built from widgets on each page: a [card](../../reference/widgets/display/card.md) as the band, an [image](../../reference/widgets/trigger/image.md) for the logo, a text box for the title, and a [button](../../reference/widgets/trigger/button.md) carrying the Logout [App action](#app-actions). Group them to move them as one, switch the group's *Sticky* on (General tab) so the band stays on screen while the page scrolls beneath it, then copy the group to the other pages.

**Sticky widgets.** Every widget on a page has a *Sticky* switch on its General tab. A sticky widget stays where the screen puts it while the page scrolls: a band at the top is a header, a bar at the bottom of the screen a footer, a small button in a corner a "back to top". Sticky widgets draw above the page's content, and the page scrolls under them. The Page editor marks a sticky widget with a badge and keeps it in place on the page, which is where it will sit on the screen; the test run and the deployed App are where it sticks. Like other settings, *Sticky* is shared across screens until you pin it on one. A widget inside a group follows its group, so the group is what you make sticky.

<figure><img src="../../.gitbook/assets/Screenshot 2026-07-08 212421.png" alt=""><figcaption></figcaption></figure>

### Per-screen menu type

The menu settings are shared across all activated screen sizes until you pin one. Switch to the screen size you want to configure in the [Page editor](../page-editor.md), open the menu settings, hover a field and click the pin to give that screen its own value for the field alone: a fixed left menu on large screens and bottom tabs on the phone is one shared menu type plus one pin. A faded pin shows the field is pinned on another screen; click a solid pin to share the field again. This is the same pin you know from widget settings and page settings.

## App actions

Some things a user wants are not pages, functions, or widgets: leave the App, start it over, go back a step. Heisenware calls these **App actions**. They act on the App itself in the browser, they carry no data, and they are linked exactly like pages: you drag them and drop them.

The App actions sit in a row at the foot of the Pages and actions explorer:

* **Back**: returns to the page shown before the current one. Does nothing at the start of the visit history.
* **Reload**: restarts the App in this tab with cleared caches.
* **Logout**: forgets this device's credentials for the App and starts the App afresh. Apps with [individual registration](../../app-manager/users-and-access.md) land on the sign-in screen, Apps with a master password ask for it again, public Apps continue as a new anonymous user. Use it for shared devices and shift changes.
* **Open link**: opens a URL fixed when you drop the chip: the same App in another language (`/app/<domain>/<appId>`), a manual, an external site. In this tab the App is left; with "Open in a new tab" the App stays open next to the link.

Switching pages is an App action too. Its chip is the page itself.

### On a widget

Turn any [button](../../reference/widgets/trigger/button.md), [icon](../page-editor.md), or image into a page-switch or action trigger.

* **How to link**: Drag a page or an App action from the Pages and actions explorer and drop it directly onto a button, icon, or image on your page.
* **Use case**: The primary way to let users open subpages (e.g., a "Machine Details" button opening the corresponding detail view), to navigate in Apps that have no main menu, or to offer a Logout button wherever you like. No top bar is required.
* **Order**: A click fires the executors linked to the button first. Logout and Reload wait for them, so a button that saves and logs out saves first.

### From your logic

Your backend logic can also switch pages and run actions on its own.

* **How to link**: Drag a page or an App action from the Pages and actions explorer onto an executor's output, modifier, filter, or error handler.
* **Use case**: If an executor detects an error or a successful form submission, the backend pushes the user to an error or success page automatically. A Timer output with Logout ends a session after a fixed time; a filter that detects an alarm switches to the alarm page.
* **What fires it**: Every truthy value the output produces after the App has loaded. Falsy values, such as a filter that blocks, never fire.
* **Who is reached**: The action reaches the users the value reaches. When a user's click started the flow, only that user: a Timer that the user started ticks for that user alone, so "logout after ten minutes" is per user with nothing to configure. When no user started the flow, a poll or a listener fired by the backend, every connected user: an alarm switches every screen, a backend-fired Logout ends every session.
* **Back** cannot be dropped on an output. Walking every user's history at once makes no sense, so it lives on widgets only.

<figure><img src="../../.gitbook/assets/image (32).png" alt=""><figcaption><p>Switch page link</p></figcaption></figure>

The browser's back and forward buttons, and the back gesture of a phone, walk your App's pages the same way the Back action does. The App's URL never changes.

{% hint style="info" %}
Need more vertical space on a page? Use the page height setting in the [Page editor toolbar](../page-editor.md#the-toolbar).
{% endhint %}
