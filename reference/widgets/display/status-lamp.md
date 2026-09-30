---
description: >-
  LED-style indicator mapping bound values or executor status to colors, as circle or rectangle
---

# Status Lamp

<figure><img src="../../../.gitbook/assets/widget-status-lamp.png" alt="Status lamps showing four machine states, and a strip of eight station lamps"><figcaption></figcaption></figure>

A status lamp shows a state at a glance: running, setup, fault, idle, or whatever states your machines know. You decide which value lights which color. Link it to an executor's status and it tells whether that executor can run. Give it a list of states and the rectangle shape turns it into a strip, one bar per state, so a whole line fits in one row. A click can hand a value back to your logic, for example to open the machine's detail page.

**Good for:** machine and line overviews, connection health, alarm boards.

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/status-lamp. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `value` | output | `string\|Array<string>` | A single state, or an array of those. |
| `color` | output | `string\|Array<string>` | The direct color that should be applied to the lamp. |
| `context` | output | `any` | Any context that will be provided back, when clicked. |
| `value` | status | `string` | The linked executor's status drives the lamp state. |

### Emits

| Property | Linked to | What it does |
|---|---|---|
| `onClick` | input | Writes the bound context value when the lamp is clicked. |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>value</code> (output)</summary>

```json
"running"
```

</details>

<details>

<summary><code>color</code></summary>

```json
"#19914b"
```

</details>

<details>

<summary><code>context</code></summary>

```json
{
  "device": "Pump A"
}
```

</details>

<details>

<summary><code>value</code> (status)</summary>

```json
"ok"
```

</details>

## Settings

Double-click the widget in the Page editor to open its settings. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Shape | circle draws round lamps sized to the short side; rectangle splits the long side into rounded bars. Choices: `circle`, `rectangle`. | `circle` |
| Status mappings | Colors by status: a bound value is matched against these entries; no match shows a dim grey lamp. |  |
| Status mappings › Value | Status this entry matches, compared as text; an object is matched by its status field. |  |
| Status mappings › Color | Lamp color for this status; transparent hides the lamp, empty or auto keeps the theme's. |  |
| Context | Value sent with the click to the linked input; a bound context replaces it. |  |
| Spacing | Gap between the bars in px when several states show in rectangle shape. *Set per screen.* | `5` |

<!-- /generated -->
