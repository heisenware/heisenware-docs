---
description: >-
  The five screens an App can serve, which one a device gets, and how a widget's position and settings travel between them.
---

# Screens and layouts

A page is not drawn by a browser's rules. Every widget sits at a position you chose, on a **screen**: a design area of a fixed size that stands for a group of devices. An App serves the screens its users have, and you design a page on each of them.

## The five screens

| Screen | Size | The devices it stands for |
| --- | --- | --- |
| **Phone** | 414 × 850 | phones, upright |
| **Tablet** | 800 × 1280 | a tablet carried around, upright |
| **Tablet rotated** | 1280 × 800 | a panel mounted at a machine, landscape |
| **Laptop** | 1500 × 750 | a browser window on a laptop |
| **Desktop** | 1920 × 1080 | a browser window on a monitor |

Enable the screens your App is really used on, in the App's settings. A new App starts with Tablet rotated and Desktop switched off. A screen that is switched off is never drawn and is not yours to design.

## Which screen a user gets

* **A phone or a tablet** chooses by what it is and how it is held: a phone upright draws Phone and turned sideways Laptop; a tablet upright draws Tablet and sideways Tablet rotated.
* **Every other browser**, such as a PC or the panel at a machine, chooses by size: among the screens that fill enough of the window, the one that needs the least scaling.
* A screen that is switched off hands over to the next one that is on.

**Upright scrolls, landscape fits.** Phone and Tablet fill the width of the window and the page scrolls under the thumb. Tablet rotated, Laptop and Desktop are fitted into the window as a whole, so a page meant as one screen stays one screen, which is what a panel at a machine needs.

## One design per screen

**Geometry belongs to the screen.** Where a widget sits and how large it is, is kept per screen. Moving a widget on the desktop does not move it on the phone.

The screen a widget is first placed on is its **reference screen**. Until you arrange the widget on another screen, that screen follows the reference: the widget is where the reference puts it. Once you move or resize it there, that screen is **authored** and keeps its own layout from then on.

A derived screen is a draft, not a result. A phone deserves its own reading order, its own headline number and fewer columns, not a shrunken desktop. Design every screen you serve.

{% hint style="info" %}
The App's reference screen is the one most of its widgets are referenced from. Nothing stores it: it follows your widgets.
{% endhint %}

## Settings and pins

**Settings are shared across screens unless pinned.** Change a chart's colour, and it changes everywhere. That is what you want for most settings.

A **pin** gives one screen its own value for one setting. Pin the font size on the phone, and the phone keeps its own size while every other screen follows the shared one.

Some settings are **pinned by nature**, because their right value depends on the screen: how many columns a grid shows, a font size, where a legend sits. These always belong to one screen.

**Visibility** is pinned by nature on every widget. A widget hidden on the phone takes no space there, and hiding a group hides its children with it. That is how to drop a widget from the phone without deleting it.

A child of a [group](groups-and-tiles.md) has no pins: inside a tile, everything is the same on every screen.

Pages and the navigation menu pin the same way. A page's height is pinned by nature. The menu pins nothing by nature, so bottom tabs on the phone and a drawer on the desktop is one shared menu type plus one pin.

## How tall a page is

A page is as tall as one screen unless you say otherwise. Scroll only where the content cannot fit, such as a long form or a list of days, and then the page ends where its content ends.

A **left menu** shares the width with the page: a 240 pixel menu on the desktop leaves the page about 1680 pixels, and a widget placed past that edge is cut off. A **drawer** takes no width: it adds a burger button in the top corner, and the page keeps the full width underneath.

## Sticky widgets

A **sticky** widget stays where the screen puts it while the page scrolls beneath it: a header band, a footer, a button in a corner. Group a band of widgets and make the group sticky, and you have the App's title bar. There is no built-in top bar; a title bar is widgets you place.

Content that starts underneath a sticky header never comes out from under it, so leave it room.
