# Build frontend

The UI is what users of your Apps see and interact with. It ranges from simple dashboards and data visualizations to interactive Apps for user input, file management, and more.

{% hint style="info" %}
#### Optional user interface
The UI is optional. You can build headless Apps that use pure backend logic, like a data bridge between a PLC and a SQL database, running silently with no visual frontend.
{% endhint %}

## Core UI components

* [**Widgets**](widgets/): The functional components of your App. They display live data, capture user input, or trigger logic.
* [**Pages**](page-explorer.md): The individual screens of your App. Create multiple pages and subpages to structure your App logically, then configure navigation elements so users can move between them.
* [**Text, icons, and images**](text-icons-and-images.md): Mostly static elements used for branding, instructions, and non-interactive content.
* [**PDF templates**](pdf-template-editor.md): Visual layouts for generating dynamic documents. Map variables onto a document background, then populate them from your backend logic.
* [**Theme**](theme-editor.md): The global visual DNA of your App. Ensures a consistent look across all widgets and pages.

## Frontend Builder

Turn backend logic into a functional, user-facing App inside the Frontend Builder. Place static elements for context and dynamic widgets on each page, then configure them using backend logic.

Build Apps for any screen size and switch the preview as you go to verify that your layout holds up on everything from a smartphone to a large desktop monitor.

### The toolbar

The toolbar serves as your main kit for composing the interface. It holds buttons and icons to:
* Add a text box, icon, or widget.
* Switch the screen preview.
* Extend page height to enable scrolling and scale the view.
* Edit or delete the selected widget. These icons (pen and trash) activate only when you select a widget or UI element.

<figure><img src="../../.gitbook/assets/image (27).png" alt=""><figcaption></figcaption></figure>

### Placing and moving elements

Add an element by selecting it from the toolbar and clicking anywhere on the canvas. Once placed, you can:
* **Move**: Drag the element to a new position on the canvas.
* **Resize or rotate**: Use the grab markers on the corners and edges to change the element's dimensions or orientation.
* **Open settings**: Double-click the widget, or select it and click the pen icon in the toolbar.
* **Align with snaplines**: Snaplines appear automatically to help align widgets and other UI elements with each other.
* **Pixel-perfect positioning**: Hold the Shift key while moving an element to temporarily disable snaplines for precise placement.
* **Adjust layers and layout**: Right-click any element to adjust the stacking order of overlapping items, stretch it to full width, or toggle tile view.

<figure><img src="../../.gitbook/assets/Widgets.gif" alt="" width="563"><figcaption><p>Frontend Builder basics</p></figcaption></figure>

{% hint style="warning" %}
#### Screen-specific layout saving
Heisenware saves changes to an element's position or size per device size. Always check other screen previews to ensure the layout stays clean across all hardware.
{% endhint %}

### Context menu tools

Right-click any element to open a menu for quick layout actions and layer management.
* *Order*: Adjust the stacking of overlapping elements to control which item appears in the foreground or background.
* *Full width*: Instantly stretches the element to fill the entire horizontal space of your current screen preview.
* *Toggle tile view*: Switches the element into a tiled display mode.

### Screen preview and responsive behavior

Production Apps are responsive by nature and adapt to different screen sizes automatically. Control exactly how your App behaves on different hardware using these toolbar tools:
* **Switching previews**: Click the screens icon (<i class="fa-laptop-mobile">:laptop-mobile:</i>) and click a device icon to switch to the corresponding UI editor and adapt your layout.

<figure><img src="../../.gitbook/assets/image (516).png" alt=""><figcaption></figcaption></figure>

* **Enable or disable screens**: Right-click any device icon to enable or disable specific screen sizes. By default, only the phone, tablet, and laptop are active. When a user opens your App on a disabled screen size, Heisenware scales the layout from the nearest active device size.
* **Content alignment (L and XL)**: On large monitors, decide how the overall content sits on the screen. Right-click the L or XL icons to choose between left-aligned or centered layouts.

<figure><img src="../../.gitbook/assets/image (517).png" alt=""><figcaption></figcaption></figure>

* **Scaling**: Use the scaling bar to zoom the current preview in or out. This serves as a design-time aid only and does not change the App's actual size for the user.
* **Extend height**: Use the page height icon (<i class="fa-arrows-up-down">:arrows-up-down:</i>) in the toolbar to add vertical space and enable scrolling for the selected device size. This lets you scroll on mobile while keeping a fixed dashboard on desktop. If a page height does not change when you reduce it, a widget is likely positioned outside the valid area. Move or delete that widget first.

{% hint style="info" %}
#### Mobile-first workflow best practices
By default, Heisenware inherits changes upward: changes configured on a smaller screen propagate to larger ones.

1. **Start with phone**: Design your layout for the phone first to ensure your basic structure is solid.
2. **Scale up**: Switch to tablet or laptop views and arrange the widgets to utilize the extra horizontal space.
3. **Fine-tune**: Adjustments on a larger screen stay local to that view, letting you optimize control-room monitors down to the pixel without breaking the mobile experience.
{% endhint %}
