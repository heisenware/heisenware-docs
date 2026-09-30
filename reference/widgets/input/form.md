---
description: >-
  Collects structured input in grouped or tabbed fields — validation, autofill, dynamic field control
---

# Form

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/form. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `autoFill` | output | `object` | Merges the received object into the form data (writes `formData` back when `triggerFormDataOnAutoFill` is set). |
| `options` | output | `object` | Provides select-box options per field at runtime, overriding the statically configured options. |
| `clear` | output | `any` | Truthy values clear the form (and write back an empty `formData`). |
| `validate` | output | `any` | Truthy values run validation and write the outcome to `validationResult`. |
| `readOnly` | output | `any` | Truthy makes the whole form read-only, falsy editable again. |
| `addFields` | output | `Array<object>\|object` | Appends dynamic fields: an array of field configurations (same shape as the Content settings' fields), or an object of `{ <dataField>: <field config> }`. |
| `setFields` | output | `Array<object>` | Replaces the dynamic fields with the received array of field configurations (same shape as the Content settings' fields). |

### Emits

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `formData` | input | `object` | Writes the complete form data on every edit (and `{}` after clear). Nested field paths become nested objects. |
| `validationResult` | input | `object` | Writes the outcome after the `validate` command ran. |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>autoFill</code></summary>

```json
{
  "operator": "J. Smith",
  "shift": "night"
}
```

</details>

<details>

<summary><code>options</code></summary>

```json
{
  "line": [
    "Line 1",
    "Line 2",
    "Line 3"
  ]
}
```

</details>

<details>

<summary><code>clear</code></summary>

```json
true
```

</details>

<details>

<summary><code>validate</code></summary>

```json
true
```

</details>

<details>

<summary><code>readOnly</code></summary>

```json
true
```

</details>

<details>

<summary><code>addFields</code></summary>

```json
[
  {
    "dataField": "notes",
    "label": "Notes",
    "widget": "text"
  }
]
```

</details>

<details>

<summary><code>setFields</code></summary>

```json
[
  {
    "dataField": "batchId",
    "label": "Batch",
    "widget": "text"
  }
]
```

</details>

## Settings

Double-click the widget in the Page editor to open its settings. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

### Content

| Setting | What it does | Default |
|---|---|---|
| Forms | Field groups of the form: one group renders flat, several render as captioned sections, or as tabs when they share a tab label. |  |
| Forms › Fields | Fields of the group, in this order. |  |
| Forms › Fields › Data field | Key of the value in formData. |  |
| Forms › Fields › Label | Label shown for the field; empty shows none. |  |
| Forms › Fields › Help text | Hint shown under the field; empty shows none. |  |
| Forms › Fields › Column span | Columns the field spans (see column count); a text area always spans 2. |  |
| Forms › Fields › Required | Marks the field required (asterisk on the label); validation fails while it is empty. |  |
| Forms › Fields › Disabled | Greys the editor out; members cannot change it. |  |
| Forms › Fields › Read only | Shows the value without letting members change it. |  |
| Forms › Fields › Editor type | Kind of input shown for the field. Choices: Text box, Select box, Number box, Check box, Password, Tag box, Date/Time select, Date range select, Color select, Location select, Radio group, Text area, Slider, Switch, Calendar, Native agent. | Text box |
| Forms › Fields › Use accent color | Colors the value with the theme's primary color while the form is read-only. Only when Editor type is Text box. |  |
| Forms › Fields › Minimum | Lowest value the editor accepts; empty sets no limit. Only when Editor type is Number box. |  |
| Forms › Fields › Maximum | Highest value the editor accepts; empty sets no limit. Only when Editor type is Number box. |  |
| Forms › Fields › Default value | Value the field starts with, also after clear, until formData or the user sets it; empty starts blank. Only when Editor type is Number box. |  |
| Forms › Fields › Prefix | Text placed before the number, such as a currency sign; empty adds none. Only when Editor type is Number box. |  |
| Forms › Fields › Suffix | Text placed after the number, such as a unit; empty adds none. Only when Editor type is Number box. |  |
| Forms › Fields › Show separator | Groups thousands with a separator (1,234,567). Only when Editor type is Number box. | off |
| Forms › Fields › Precision | Decimal places allowed in the number; empty shows whole numbers when a prefix, suffix or separator is set, else the number as typed. Only when Editor type is Number box. |  |
| Forms › Fields › Step | Distance between two slider positions. Only when Editor type is Slider. | `1` |
| Forms › Fields › Date type | Kind of value the picker edits: a date, a time of day or both. Choices: Date only, Time only, Date & time. Only when Editor type is Date/Time select. | Date only |
| Forms › Fields › Options | Options offered by the picker, comma separated. Only when Editor type is Select box. |  |
| Forms › Fields › Enable searching | Lets members type to filter the options. Only when Editor type is Select box. | off |
| Forms › Fields › Show clear button | Adds a button that clears the selection. Only when Editor type is Select box. | off |
| Forms › Fields › Show drop down button | Shows the arrow that opens the list. Only when Editor type is Select box. | on |
| Forms › Fields › Switched on text | Text shown on the switch while it is on. Only when Editor type is Switch. | `ON` |
| Forms › Fields › Switched off text | Text shown on the switch while it is off. Only when Editor type is Switch. | `OFF` |
| Forms › Fields › layout | Stacks the options vertically or lays them out in a row. Choices: Vertical, Horizontal. Only when Editor type is Radio group. | Vertical |
| Forms › Fields › Location type | What the Google Places lookup completes: address a street address, establishment a named place with its address. Choices: Full address, Place. Only when Editor type is Location select. |  |

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Column count | Columns the fields are laid out in: 1 stacks them, auto fits as many as the width allows. Choices: `auto`, `1`, `2`, `3`, `4`, `5`, `6`. *Set per screen.* | `1` |
| Label location | Where a field's label sits: left of, right of or above its editor. Choices: `left`, `right`, `top`. *Set per screen.* | `top` |
| Label mode | Static: label beside the value. Floating: label inside the editor, rising once it holds a value. Hidden: no label. Outside: label outside the editor box. Choices: Static, Floating, Hidden, Outside. *Set per screen.* | Floating |
| Custom content size | Font size of the values in px; empty keeps the theme's. Range 6 to 50. *Set per screen.* |  |
| Custom label size | Font size of the labels in px; empty keeps the theme's. Range 6 to 50. *Set per screen.* |  |
| Show colon | Puts a colon after every label. | off |
| Initially readonly | Starts the form read-only until the readOnly input switches it. | off |
| Trigger formData event on autofill | Emits formData after an autofill and lets a linked formData apply while autoFill is linked; off, an autofill only fills the editors. | on |

<!-- /generated -->
