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

Click a page's number and drag it into a new position. The new order is reflected in the App's navigation menu.

### Per-page settings

Click the small pencil icon inside a page's representation to open its settings. Here you can set:

* The page name shown in the menu
* The menu icon
* The app bar title shown at the top of the screen

Subpages automatically inherit the app bar title from their parent page, so users always know which section they are in.

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

Enable **different navigation menus per screen** in the App menu settings to give each activated screen size its menu type. Fixed left menu is often a good choice for large screens, while Bottom tabs only or Expandable menu drawer works well on smaller screens. Switch to the screen size you want to configure in the [Frontend Builder](./), then set the menu type.

<figure><img src="../../.gitbook/assets/image (20).png" alt=""><figcaption><p>Different menu per screen</p></figcaption></figure>

## Other ways to switch pages

### Widget links

You can turn any [button](widgets/trigger-widgets/button.md) or [icon](text-icons-and-images.md) into a page switch trigger.

* **How to link**: Drag a page from the Page Explorer and drop it directly onto a button or icon on your UI canvas.
* **Use case**: The primary way to let users open subpages (e.g., a "Machine Details" button opening the corresponding detail view) or to navigate in Apps that have no main menu.

### Logic-driven navigation

Page switching can also be triggered automatically by your backend logic.

* **How to link**: Drag a page from the Page Explorer onto a function's output.
* **Use case**: If a function detects an error or a successful form submission, the backend pushes the user to an error or success page automatically.

<figure><img src="../../.gitbook/assets/image (32).png" alt=""><figcaption><p>Switch page link</p></figcaption></figure>

{% hint style="info" %}
If you need more vertical space on a page, use the page height setting in the [Frontend Builder toolbar](./#the-toolbar).
{% endhint %}
