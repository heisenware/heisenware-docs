# Build frontend

The UI is what users of your Apps see and interact with. It ranges from simple dashboards and data visualizations to interactive Apps for user input, file management, and more.

{% hint style="info" %}
The UI is optional. You can build headless Apps that are pure backend logic, like a data bridge between a PLC and a SQL database, running silently with no visual frontend.
{% endhint %}

## Core UI components

* [**Widgets**](widgets/): The functional components of your App. They display live data, capture user input, or trigger logic.
* [**Pages**](page-explorer.md): The individual screens of your App. Create multiple pages and subpages to structure your App logically, then configure navigation elements so users can move between them.
* [**Text, icons, and images**](text-icons-and-images.md): Mostly static elements used for branding, instructions, and non-interactive content.
* [**PDF templates**](pdf-template-editor.md): Visual layouts for generating dynamic documents. Map variables onto a document background, then populate them from your backend logic.
* [**Theme**](theme-editor.md): The global visual DNA of your App. Ensures a consistent look across all widgets and pages.

## Frontend Builder

The Frontend Builder is where you turn backend logic into a functional, user-facing App. On each page, you place static elements for context and dynamic widgets that your backend logic controls and configures.

Build Apps for any screen size, and switch the preview as you go to check that your layout holds up on everything from a smartphone to a large desktop monitor.

### The toolbar

The toolbar is your main kit for composing the interface. It holds buttons and icons to:

* Add a text box, icon, or widget (input, trigger, display).
* Switch the screen preview.
* Extend page height (enable scrolling) and scale the view.
* Edit or delete the selected widget. These icons (pen and trash) turn active only when you select a widget or UI element.

<figure><img src="../../.gitbook/assets/image (27).png" alt=""><figcaption></figcaption></figure>

### Placing and moving elements

To add an element, select it from the toolbar and click anywhere on the UI canvas. Once it is placed, you can:

* **Move**: Drag the element to a new position on the canvas.
* **Resize or rotate**: Use the grab markers on the corners and edges to change the element's dimensions or orientation.
* **Open settings**: Double-click the widget, or select it and click the pen icon in the toolbar.
* **Align with snaplines**: Snaplines appear automatically to help you align widgets and other UI elements with each other.
* **Pixel-perfect positioning**: For precise placement, hold the Shift key while moving an element. This temporarily disables the snaplines.
* **Adjust layers and layout**: Right-click any element to adjust the Z-order of overlapping items, stretch it to full width, or toggle tile view.

<figure><img src="../../.gitbook/assets/Widgets.gif" alt="" width="563"><figcaption><p>Frontend Builder basics</p></figcaption></figure>

{% hint style="warning" %}
Heisenware saves changes to an element's position or size per device size. Always check your other screen previews so the layout stays clean across all hardware.
{% endhint %}

### Context menu tools

Right-click any element to open a menu for quick layout actions and layer management.

* **Order**: Adjust the stacking of overlapping elements to control which item appears in the foreground or background.
* **Full width**: Instantly stretches the element to fill the entire horizontal space of your current screen preview.
* **Toggle tile view**: Switches the element into a tiled display mode.

### Screen preview and responsive behavior

[Production Apps](../../production-apps/production-apps-overview.md) are responsive by nature and adapt to different screen sizes on their own. To control exactly how your App behaves on different hardware, use these toolbar tools:

* **Switching previews**: Click the screens icon (<i class="fa-laptop-mobile">:laptop-mobile:</i>) and then click a device icon to switch to the corresponding UI editor and adapt your layout.

<figure><img src="../../.gitbook/assets/image (516).png" alt=""><figcaption></figcaption></figure>

* **Enable or disable screens**: Right-click any device icon to enable or disable specific screen sizes. By default, only the phone, tablet, and laptop are active. When a user opens your App on a disabled screen size, Heisenware scales the layout from the nearest active device size.
* **Content alignment (L and XL)**: On large monitors, decide how the overall content sits on the screen. Right-click the L or XL icons to choose between left-aligned or centered layouts.

<figure><img src="../../.gitbook/assets/image (517).png" alt=""><figcaption></figcaption></figure>

* **Scaling**: Use the scaling bar (via the scaling icon) to zoom the current preview in or out. This is a design-time aid only and does not change the App's actual size for the user.
* **Extend height**: Use the page height icon (<i class="fa-arrows-up-down">:arrows-up-down:</i>) in the toolbar to add vertical space and enable scrolling for the selected device size. Useful for scrolling on mobile while keeping a fixed dashboard on desktop. If you try to reduce a page height and it doesn't change, a widget is likely positioned outside the valid area. Move or delete that widget first.

{% hint style="info" %}
#### Best practice: Mobile-first workflow

By default, Heisenware inherits changes upward: what you set on a smaller screen often propagates to larger ones.

1. **Start with phone**: Design your layout for the phone first. This ensures your basic structure is solid.
2. **Scale up**: With the mobile view set, switch to tablet or laptop and spread the widgets out to use the extra horizontal space.
3. **Fine-tuning**: Any adjustment on a larger screen stays local to that view, so you can optimize control-room monitors down to the pixel without breaking the mobile experience.
{% endhint %}
