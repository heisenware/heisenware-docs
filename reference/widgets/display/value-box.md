---
description: >-
  Displays a single live value with number/date formatting and JSON tree rendering for objects
---

# Value Box

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/value-box. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `value` | output | `any` | Accepts various data for display. Handles strings, numbers, objects and images. |
| `clear` | output | `any` | Truthy values clear the displayed value. |
| `textColor` | output | `string` | CSS color for the displayed text (overrides the configured color). |

### Emits

| Property | Linked to | What it does |
|---|---|---|
| `onClick` | input | Writes the currently displayed value when the box is clicked. Exceptional use only - click semantics belong to buttons; a click that must carry a value is a button firing an executor whose input holds it. |
| `onClick` | trigger | Triggers the linked executor when the box is clicked. |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>value</code></summary>

```json
42.7
```

</details>

<details>

<summary><code>clear</code></summary>

```json
true
```

</details>

<details>

<summary><code>textColor</code></summary>

```json
"#62a378"
```

</details>

## Settings

Double-click the widget in the Page editor to open its settings. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Font size | Font size of the shown value in px. Range 6 to 42. *Set per screen.* | `14` |
| Font weight | Weight of the value text. Choices: Normal, Bold, Bolder. | Normal |
| Horizontal alignment | Horizontal position of the value inside the box. Choices: Left, Center, Right. | Center |
| Vertical alignment | Vertical position of the value inside the box. Choices: Top, Middle, Bottom. | Middle |
| Text color | Color of the value text; empty or auto keeps the theme's, a bound textColor overrides it. | automatic |
| Format | Formats numbers and dates for display, with a number or a date format; empty shows the value as it is. Choices: Fixed point, Decimal, Currency, Percent, Large number, Thousands, Millions, Billions, Trillions, Exponential, Short date, Long date, Short time, Long time, Short date & time, Long date & time, Month & day, Month & year, Quarter & year, Day, Day of week, Month, Year, Quarter, Hour, Minute, Second, Millisecond. |  |
| Prefix | Text put in front of the shown value; objects and images ignore it. |  |
| Suffix | Text put after the shown value; objects and images ignore it. |  |
| Placeholder | Text shown in gray italics while no value has arrived or after clear; an empty string from the backend shows an empty box. | `No value available` |

<!-- /generated -->
