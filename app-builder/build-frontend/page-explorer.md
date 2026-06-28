# Page Explorer

Pages are the individual views or screens that organize your application's functionality. Heisenware uses a hierarchy of pages and sub-pages to keep your app structured and easy to navigate.

## Managing your app structure

You can manage the structure of your app via the pages panel. Click on the navigator icon (<i class="fa-location-arrow-up">:location-arrow-up:</i>) on the left panel to open it.

### Page types

* **Pages**: These are your top-level screens. By default, they are automatically added to the app’s main navigation menu.
* **Subpages**: These are nested under a main page. They do not show up in the main navigation menu automatically. They are typically used for detail views, settings, or pop-up style content that you want to link to manually.

<figure><img src="../../.gitbook/assets/image (10).png" alt=""><figcaption></figcaption></figure>

### Creating, deleting, and organizing pages

* **Add/Duplicate**: Right-click any page in the panel to create a new page, a subpage, or to duplicate an existing page to save time.
* **Delete**: Right-click any page in the panel and click delete. Note that the first page in your app cannot be deleted.

<figure><img src="../../.gitbook/assets/image (11).png" alt=""><figcaption></figcaption></figure>

* **Change order**: To change the order of pages and how they appear in the app's main menu, refer to the [navigation settings](page-explorer.md#main-navigation-menu).

{% hint style="info" %}
If you need more vertical space, refer to page height settings as part of the [Frontend Builder toolbar](./#the-toolbar).
{% endhint %}

## In-app navigation

The app has a navigation menu that users can click. However, page switches can also be triggered by logic and clicks on widgets. By default, apps just have bottom tabs.

<figure><img src="../../.gitbook/assets/image (57).png" alt="Default navigation: Bottom tabs"><figcaption><p>Default navigation: Bottom tabs</p></figcaption></figure>

### Main navigation menu

This is the standard menu that appears across all pages and subpages.

* **Configuration**: Click the navigator icon (<i class="fa-location-arrow-up">:location-arrow-up:</i>) in the top bar to open the settings.
* **Menu types**: You can choose between:
  * **None**: No navigation menu.
  * **Bottom tabs**: (Default) A fixed tab bar at the bottom of the screen.
  * **Menu drawer**: A classic "burger" menu. You can set its position (top or left) and its behavior (push or overlap).
  * **Top bar**: Displays only the `App Bar Title` at the top with no menu icons.
  * **Top bar and bottom tabs**: Combines both for a standard mobile app feel.
* **The "App Bar" behavior**: Subpages automatically inherit the same `App Bar Title` as their parent page, ensuring the user knows which section they are currently in.
* **Customization**: In the settings, you can hide specific pages from the menu, edit their display labels, or assign them unique icons.
* **Page order**: Use the arrow icons (<i class="fa-arrow-up-arrow-down">:arrow-up-arrow-down:</i>) in the routes menu to reorder pages and define how they appear in the navigation.

<figure><img src="../../.gitbook/assets/image (12).png" alt=""><figcaption></figcaption></figure>

### Widget links

You can turn any [button](widgets/trigger-widgets/button.md) or [icon](text-icons-and-images.md) into a page switch trigger.

* **How to link**: Simply drag a page from the pages panel and drop it directly onto a button or icon on your UI canvas.
* **Use case**: This is the primary way to let users open subpages (e.g., clicking a "Machine Details" button to open that specific detail view) or navigate in apps without a main menu.

### Logic-driven navigation

Page switching can also be triggered automatically by your backend logic.

* **How to link**: Drag a page from the pages panel onto a function's output.
* **Use case**: If a function detects an error or a successful form submission, the backend can "push" the user to an error or success page automatically.
