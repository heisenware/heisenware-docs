# Build Frontend

The UI is what Users of your Apps see and interact with. It can range from simple data visualizations and dashboards to interactive Apps for user input, file management, and more.

{% hint style="info" %}
The UI is optional. You can build headless Apps that consist entirely of backend logic, like a data bridge between a PLC and a SQL database, running silently without a visual frontend.
{% endhint %}

## Core UI components

* [**Widgets**](widgets/): The functional components of your App. They display live data, capture user input, or trigger logic.
* [**Pages**](page-explorer.md): The individual screens of your App. Create multiple pages and subpages to structure your App logically, then configure navigation elements so Users can move between them.
* [**Text, icons, and images**](text-icons-and-images.md): Mostly static elements used for branding, instructions, and non-interactive content.
* [**PDF templates**](pdf-template-editor.md): Visual layouts used to generate dynamic documents. Map variables onto a document background, then populate them from your backend logic.
* [**Theme**](theme-editor.md): The global visual DNA of your App. Ensures a consistent look across all Widgets and pages.

## Frontend Builder

The Frontend Builder is where you turn backend logic into a functional, user-facing App. On your pages, you place static elements for context and dynamic Widgets that are controlled and configured by your backend logic.

You can build Apps for any screen size and switch the preview during the build process to make sure your layout works on everything from a smartphone to a large desktop monitor.

### The toolbar

The toolbar is your primary toolkit for composing the interface. It holds buttons and icons to:

* Add a text box, icon, or Widget (input, trigger, display).
* Switch the screen preview.
* Extend page height (enable scrolling) and scale the view.
* Edit or delete the selected Widget. These icons (pen and trash) are only active when a Widget or UI element is selected.

<figure><img src="../../.gitbook/assets/image (515).png" alt=""><figcaption></figcaption></figure>

### Placing and moving elements

To add an element, select it from the toolbar and click anywhere on the UI canvas to place it. Once placed, you can:

* **Move**: Drag the element to a new position on the canvas.
* **Resize or rotate**: Use the grab markers on the corners and edges to change the element's dimensions or orientation.
* **Open settings**: Double-click the Widget, or select it and click the pen icon in the toolbar.
* **Align with snaplines**: Snaplines appear automatically to help you align Widgets and other UI elements with each other.
* **Pixel-perfect positioning**: For precise placement, hold the Shift key while moving an element. This temporarily disables the snaplines.
* **Adjust layers and layout**: Right-click any element to adjust the Z-order of overlapping items, stretch it to full width, or toggle tile view.

<figure><img src="../../.gitbook/assets/Widgets.gif" alt="" width="563"><figcaption><p>Frontend Builder basics</p></figcaption></figure>

{% hint style="warning" %}
Changes to an element's position or size are saved per device size. Always check your other screen previews to make sure the layout stays clean across all hardware.
{% endhint %}

### Context menu tools

Right-click any element to open a menu for quick layout actions and layer management.

* **Order**: Adjust the stacking of overlapping elements to control which item appears in the foreground or background.
* **Full width**: Instantly stretches the element to fill the entire horizontal space of your current screen preview.
* **Toggle tile view**: Switches the element into a tiled display mode.

### Screen preview and responsive behavior

[Production Apps](../../production-apps/production-apps-overview.md) are inherently responsive and adapt automatically to different screen sizes. To control exactly how your App behaves on different hardware, use these tools in the toolbar:

* **Switching previews**: Click the screens icon (<i class="fa-laptop-mobile">:laptop-mobile:</i>) and then click a device icon to switch to the corresponding UI editor and adapt your layout.

<figure><img src="../../.gitbook/assets/image (516).png" alt=""><figcaption></figcaption></figure>

* **Enable or disable screens**: Right-click any device icon to enable or disable specific screen sizes. By default, only the phone, tablet, and laptop are active. If a User opens your App on a disabled screen size, the system automatically scales the layout from the nearest activated device size.
* **Content alignment (L and XL)**: On large monitors, decide how the overall content sits on the screen. Right-click the L or XL icons to choose between left-aligned or centered layouts.

<figure><img src="../../.gitbook/assets/image (517).png" alt=""><figcaption></figcaption></figure>

* **Scaling**: Use the scaling bar via the scaling icon to zoom in or out of the current preview. This is a design-time aid only and does not change the actual size of the App for the User.
* **Extend height**: Use the page height icon (<i class="fa-arrows-up-down">:arrows-up-down:</i>) in the toolbar to add vertical space and enable scrolling for the selected device size. Useful for scrolling on mobile while keeping a fixed dashboard on desktop. If you try to reduce a page height and it doesn't change, a Widget is likely positioned outside the valid area. Move or delete that Widget first.

{% hint style="info" %}
#### Best practice: mobile-first workflow

By default, Heisenware uses an inheritance system where changes made on smaller screens often propagate to larger ones.

1. **Start with phone**: Design your layout for the phone first. This ensures your basic structure is solid.
2. **Scale up**: Once the mobile view is set, switch to tablet or laptop. You only need to spread out the Widgets to take advantage of the extra horizontal space.
3. **Fine-tuning**: Any adjustment you make on a larger screen stays local to that view. This allows for pixel-perfect optimization for control room monitors without breaking the mobile experience.
{% endhint %}
