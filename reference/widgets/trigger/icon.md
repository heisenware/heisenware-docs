---
description: >-
  Font Awesome icon in any fill color, optionally on a background; clicks trigger or switch pages
---

# Icon

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/icon. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Emits

| Property | Linked to | What it does |
|---|---|---|
| `onClick` | trigger | Triggers the linked executor when the icon is clicked. |
| `onClick` | page | Switches to the linked page when the icon is clicked. |
| `onClick` | App action | Runs the linked app action (logout, reload, back) when the icon is clicked. |

## Settings

Double-click the widget in the Page editor to open its settings.

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Icon style | Font Awesome weight of the icon's strokes, from solid to thin, or the two-tone duotone; brand icons ignore it. Choices: Solid, Regular, Light, Thin, Duotone. | Thin |
| Icon color | Color of the icon; auto keeps the theme's accent color, empty paints it black. | automatic |
| Enable background | Draws a colored surface behind the icon and shrinks the icon to the icon size fraction; off, the icon fills its box. | off |
| Surface style | Elevation raises the surface with a shadow (see elevation); outlined draws a border instead (see border). Choices: `elevation`, `outlined`. Only when Enable background is on. | `elevation` |
| Background color | Leave empty to auto-calculate from Icon Color. Only when Enable background is on. | automatic |
| Background lightening | The fraction (0.1–1) by which to lighten the background color. Range 0.1 to 1. Only when Enable background is on. | `0.7` |
| Corner radius | Rounding of the surface's corners, from square to circle; theme keeps the theme's radius. Choices: Theme, Square, Low, Medium, Circle. Only when Enable background is on. | Theme |
| Icon size | Size of the icon as a fraction of its box, 0.1 to 1. Range 0.1 to 1. Only when Enable background is on. | `0.6` |

## Good to know

* Drag a page or an App action from the Pages and actions explorer onto it to run it on click.

<!-- /generated -->
