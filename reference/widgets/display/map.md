---
description: >-
  Google map plotting bound lat/lng markers with custom icons and labels, auto-centering on them
---

# Map

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/map. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `markers` | output | `Array<object>` | The markers to display. The map auto-fits to them when `centerOnMarkers` is enabled. |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>markers</code></summary>

```json
[
  {
    "lat": 52.52,
    "lng": 13.405,
    "text": "Berlin plant"
  },
  {
    "lat": 48.137,
    "lng": 11.575,
    "text": "Munich plant",
    "iconColor": "#dc2828"
  }
]
```

</details>

## Settings

Double-click the widget in the Page editor to open its settings. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Default center | Point the map shows at start as [latitude, longitude]; markers recenter it while center on markers is on. | `[53.5584898,9.787398]` |
| Default zoom | Zoom level at start, from 1 (world) to about 20 (buildings); 10 shows a city, 15 streets. *Set per screen.* | `8` |
| Default icon | Font Awesome class drawn for a marker that names no icon of its own, e.g. fas fa-map-marker-alt. | `fas fa-map-marker-alt` |
| Default icon size | Size in px of a marker icon that names no size of its own. | `30` |
| Default icon color | Color of a marker icon that names no color of its own; auto keeps the theme's temperate color. | automatic |
| Center on markers | Re-centers the map whenever a marker moves. | on |
| Show map type selectors | Shows the map/satellite switch in the top right corner. *Set per screen.* | on |
| Show traffic information | Overlays Google's live traffic on the roads. | off |
| Show transit information | Overlays Google's public transport lines and stops. | off |

<!-- /generated -->
