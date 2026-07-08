# Page Explorer

Pages are the individual screens that organize your App's functionality. Heisenware uses a hierarchy of Pages and Subpages to keep your App structured and easy to navigate. The Page Explorer is also where you configure the App's navigation menu.

Open the Page Explorer by clicking the navigator icon (<i class="fa-location-arrow-up">:location-arrow-up:</i>) on the left panel.

<figure><img src="../../.gitbook/assets/image (2).png" alt=""><figcaption></figcaption></figure>

## Managing your App structure

### Page types

* **Pages**: Your top-level screens. By default, they appear in the App's main navigation menu.
* **Subpages**: Nested under a Page. They do not appear in the main menu automatically, and are typically used for detail views, settings, or pop-up style content that you link to manually.

### Creating and deleting Pages

* **Add/duplicate**: Right-click any Page in the panel to create a new Page, a Subpage, or to duplicate an existing Page.
* **Delete**: Right-click any Page and click delete. The first Page in your App cannot be deleted.

### Reordering Pages

Click a Page's number and drag it into a new position. The new order is reflected in the App's navigation menu.

### Per-Page settings

Click the small pencil icon inside a Page's representation to open its settings. Here you can set:

* The Page name shown in the menu
* The menu Icon
* The `App Bar Title` shown at the top of the screen

Subpages automatically inherit the `App Bar Title` from their parent Page, so Users always know which section they are in.

## App menu

The App menu is the navigation Users see across all Pages and Subpages. To configure it, click the pencil icon next to the `PAGES` label at the top of the Page Explorer.

### Menu types

* **None**: No navigation menu.
* **Top Bar**: A bar at the top showing the `App Bar Title` and menu Icons.
* **Top Bar and Bottom Tabs**: Combines a top bar with a fixed tab bar at the bottom, for a standard mobile App feel.
* **Bottom Tabs Only**: A fixed tab bar at the bottom of the screen.
* **Expandable Menu Drawer**: A classic burger menu that opens and closes.
* **Fixed Left Menu**: A permanent side menu on the left.

<figure><img src="../../.gitbook/assets/Screenshot 2026-07-08 212421.png" alt=""><figcaption></figcaption></figure>

### Per-screen menu type

Enable **Different navigation menus per screen** in the App menu settings to give each activated screen size its own menu type. Fixed Left Menu is often a good choice for large screens, while Bottom Tabs Only or Expandable Menu Drawer works well on smaller screens. Switch to the screen size you want to configure in the Frontend Builder, then set the menu type.

<figure><img src="../../.gitbook/assets/image (20).png" alt=""><figcaption><p>Different menu per screen</p></figcaption></figure>

## Other ways to switch Pages

### Widget links

You can turn any [Button](widgets/trigger-widgets/button.md) or [Icon](text-icons-and-images.md) into a Page switch trigger.

* **How to link**: Drag a Page from the Page Explorer and drop it directly onto a Button or Icon on your UI Canvas.
* **Use case**: The primary way to let Users open Subpages (e.g., a "Machine Details" Button opening the corresponding detail view) or to navigate in Apps that have no main menu.

### Logic-driven navigation

Page switching can also be triggered automatically by your backend logic.

* **How to link**: Drag a Page from the Page Explorer onto a Function's Output.
* **Use case**: If a Function detects an error or a successful form submission, the backend pushes the User to an error or success Page automatically.

<figure><img src="../../.gitbook/assets/image (32).png" alt=""><figcaption><p>Switch page link</p></figcaption></figure>

{% hint style="info" %}
If you need more vertical space on a Page, use the page height setting in the [Frontend Builder Toolbar](./#the-toolbar).
{% endhint %}
