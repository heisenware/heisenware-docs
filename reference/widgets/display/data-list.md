---
description: >-
  Form-styled list of records with search, inline editing and per-field editor configuration
---

# Data List

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/data-list. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `data` | output | `Array<object>` | The items to display. Field configuration is scanned from the first items at design time and refined via the Content settings. |
| `options` | output | `object` | Provides dropdown and tag options per field at runtime, replacing the statically configured options of that field. |
| `searchValue` | output | `string` | Sets the search box content programmatically. |
| `editable` | output | `any` | Truthy switches inline editing on, falsy off. |

### Emits

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `onChange` | input | `object` | Writes the edited item after an inline edit. |
| `onDelete` | input | `string\|number` | Writes the removed item's key when a user deletes it. |
| `onItemClick` | input | `object` | Writes the clicked item. |
| `onSelectionChange` | input | `object\|Array<object>` | Writes the selection: the selected item in `single` selection mode, an array in `multiple` mode. |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>data</code></summary>

```json
[
  {
    "id": 1,
    "device": "Pump A",
    "pressure": 2.4,
    "status": "running"
  },
  {
    "id": 2,
    "device": "Pump B",
    "pressure": 3.1,
    "status": "idle"
  },
  {
    "id": 3,
    "device": "Compressor",
    "pressure": 5.8,
    "status": "running"
  }
]
```

</details>

<details>

<summary><code>options</code></summary>

```json
{
  "status": [
    "running",
    "idle",
    [
      "Under maintenance",
      "maintenance"
    ]
  ]
}
```

</details>

<details>

<summary><code>searchValue</code></summary>

```json
"pump"
```

</details>

<details>

<summary><code>editable</code></summary>

```json
true
```

</details>

## Settings

Double-click the widget in the Page editor to open its settings. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

### Content

| Setting | What it does | Default |
|---|---|---|
| Data fields | The fields every item shows, in this order. |  |
| Data fields › Data field | Key of the record field. |  |
| Data fields › Label | Label shown for the field; empty shows the key. |  |
| Data fields › Column span | Columns the field spans inside the item (see column count). |  |
| Data fields › Visible | Shows the field in the item. | on |
| Data fields › Editor widget | How the field is shown and edited. Choices: Text, Text area, Number, Slider, Date/Time, Date range, Calendar, Dropdown, Tags, Checkbox, Switch, Color, Media. | Text |
| Data fields › Minimum | Lowest value the editor accepts; empty sets no limit. Only when Editor widget is Number. |  |
| Data fields › Maximum | Highest value the editor accepts; empty sets no limit. Only when Editor widget is Number. |  |
| Data fields › Precision | Decimal places shown for the value. Only when Editor widget is Number. |  |
| Data fields › Currency | ISO currency code (EUR, USD) that formats the value as money; empty shows a plain number. Only when Editor widget is Number. |  |
| Data fields › Handle large numbers | Abbreviates large numbers (12K, 3M). Only when Editor widget is Number. | off |
| Data fields › Date type | Kind of value the picker edits: a date, a time of day or both. Choices: Date only, Time only, Date & time. Only when Editor widget is Date/Time. |  |
| Data fields › Format description | How the display format is chosen: preset picks a named format, explicit composes one from its parts. Choices: Use preset, Explicit. Only when Editor widget is Date/Time. |  |
| Data fields › Discover options | Adds the values the bound records already carry in this field to the options. Only when Editor widget is Dropdown. |  |
| Data fields › Options | Options offered by the dropdown or tag picker, comma separated; label:value shows the label and writes the value. The options output of the widget replaces them at runtime. Only when Editor widget is Dropdown. |  |
| Data fields › Switched on text | Text shown on the switch while it is on. Only when Editor widget is Switch. | `ON` |
| Data fields › Switched off text | Text shown on the switch while it is off. Only when Editor widget is Switch. | `OFF` |
| Data fields › Thumbnail size | Height of the preview in px. Range 20 to 400. Only when Editor widget is Media. | `50` |

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Appearance › Column count | Columns for the fields inside one item: 1 stacks them, auto fits as many as the width allows. Choices: `auto`, `1`, `2`, `3`, `4`, `5`, `6`. *Set per screen.* | automatic |
| Appearance › Label location | Where a field's label sits: left of, right of or above its value. Choices: `left`, `right`, `top`. *Set per screen.* | `top` |
| Appearance › Label mode | Static: label beside the value. Floating: label inside the editor, rising once it holds a value. Hidden: no label. Outside: label outside the editor box. Choices: Static, Floating, Hidden, Outside. *Set per screen.* | Floating |
| Appearance › Custom content size | Font size of the values in px; empty keeps the theme's. Range 6 to 50. *Set per screen.* |  |
| Appearance › Custom label size | Font size of the labels in px; empty keeps the theme's. Range 6 to 50. *Set per screen.* |  |
| Appearance › Custom vertical spacing | Space below each field in px; empty keeps 10 px. *Set per screen.* |  |
| Appearance › Show colon | Puts a colon after every label. | off |
| Data handling › Selection mode | none, single or multiple; a change emits onSelectionChange with the clicked item (single) or the items just added (multiple). Choices: None, Single, Multiple. | None |
| Data handling › Allow searching | Adds a search box above the list that matches text in the visible fields. | off |
| Data handling › Allow updating | Lets members edit the fields of an item; every edit emits the change. | off |
| Data handling › Allow deleting | Lets members delete items; deleting emits onDelete with the item's index. | off |

<!-- /generated -->
