---
description: >-
  Form-styled list of records with search, inline editing and per-field editor configuration
---

# Data List

<figure><img src="../../../.gitbook/assets/widget-data-list.png" alt="Data list of four machines on line 2 with a search box, each item showing machine, status, speed and next service date" width="1048"><figcaption></figcaption></figure>

A data list shows records as a list of small forms: each item lays out its fields with labels, in as many columns as you like. Users search the list, select items, and, when you allow it, edit or delete them in place; every change goes to your logic. Each field chooses its editor, from text and numbers to dates, dropdowns and switches.

**Dates** in edited records leave as `2026-10-01` (a date), `08:30:00` (a time of day) or `2026-10-01T06:30:00Z` (date and time, in UTC), the same forms the form writes. A date stored as midnight UTC shows as that day everywhere.

**Good for:** machine and device lists, maintenance and inspection records, lists users work through on a tablet.

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/data-list. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties under Receives and Emits. Drop an executor's output, input or trigger onto a row to link it. An example also fills an unlinked widget as demo data in the App Builder.

{% tabs %}
{% tab title="Receives" %}
**`data`** (from an output, `Array<object>`): The items to display. Field configuration is scanned from the first items at design time and refined via the Content settings.

<details>

<summary>Example</summary>

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

**`options`** (from an output, `object`): Provides dropdown and tag options per field at runtime, replacing the statically configured options of that field.

<details>

<summary>Example</summary>

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

**`searchValue`** (from an output, `string`): Sets the search box content programmatically.

<details>

<summary>Example</summary>

```json
"pump"
```

</details>

**`editable`** (from an output, `any`): Truthy switches inline editing on, falsy off.

<details>

<summary>Example</summary>

```json
true
```

</details>

{% endtab %}

{% tab title="Emits" %}
**`onChange`** (into an input, `object`): Writes the edited item after an inline edit.

**`onDelete`** (into an input, `string | number`): Writes the removed item's key when a user deletes it.

**`onItemClick`** (into an input, `object`): Writes the clicked item.

**`onSelectionChange`** (into an input, `object | Array<object>`): Writes the selection: the selected item in `single` selection mode, an array in `multiple` mode.

{% endtab %}

{% endtabs %}

## Settings

Double-click the widget in the Page editor to open its settings, grouped in these tabs. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

<details>

<summary>Content</summary>

* **Data fields**: The fields every item shows, in this order.
  * **Data field**: Key of the record field.
  * **Label**: Label shown for the field; empty shows the key.
  * **Column span**: Columns the field spans inside the item (see column count).
  * **Visible**: Shows the field in the item.
  * **Editor widget**: How the field is shown and edited. Choices: Text, Text area, Number, Slider, Date/Time, Date range, Calendar, Dropdown, Tags, Checkbox, Switch, Color, Media.
  * **Minimum**: Lowest value the editor accepts; empty sets no limit. Only when Editor widget is Number.
  * **Maximum**: Highest value the editor accepts; empty sets no limit. Only when Editor widget is Number.
  * **Precision**: Decimal places shown for the value. Only when Editor widget is Number.
  * **Currency**: ISO currency code (EUR, USD) that formats the value as money; empty shows a plain number. Only when Editor widget is Number.
  * **Handle large numbers**: Abbreviates large numbers (12K, 3M). Only when Editor widget is Number.
  * **Date type**: Kind of value the picker edits: a date, a time of day or both. Choices: Date only, Time only, Date & time. Only when Editor widget is Date/Time.
  * **Format description**: How the display format is chosen: preset picks a named format, explicit composes one from its parts. Choices: Use preset, Explicit. Only when Editor widget is Date/Time.
  * **Discover options**: Adds the values the bound records already carry in this field to the options. Only when Editor widget is Dropdown.
  * **Options**: Options offered by the dropdown or tag picker, comma separated; label:value shows the label and writes the value. The options output of the widget replaces them at runtime. Only when Editor widget is Dropdown.
  * **Switched on text**: Text shown on the switch while it is on. Only when Editor widget is Switch.
  * **Switched off text**: Text shown on the switch while it is off. Only when Editor widget is Switch.
  * **Thumbnail size**: Height of the preview in px. Range 20 to 400. Only when Editor widget is Media.

</details>

<details>

<summary>Look &amp; feel</summary>

* **Appearance**: Layout and typography of the items.
  * **Column count**: Columns for the fields inside one item: 1 stacks them, auto fits as many as the width allows. Choices: `auto`, `1`, `2`, `3`, `4`, `5`, `6`. *Set per screen.*
  * **Label location**: Where a field's label sits: left of, right of or above its value. Choices: `left`, `right`, `top`. *Set per screen.*
  * **Label mode**: Static: label beside the value. Floating: label inside the editor, rising once it holds a value. Hidden: no label. Outside: label outside the editor box. Choices: Static, Floating, Hidden, Outside. *Set per screen.*
  * **Custom content size**: Font size of the values in px; empty keeps the theme's. Range 6 to 50. *Set per screen.*
  * **Custom label size**: Font size of the labels in px; empty keeps the theme's. Range 6 to 50. *Set per screen.*
  * **Custom vertical spacing**: Space below each field in px; empty keeps 10 px. *Set per screen.*
  * **Show colon**: Puts a colon after every label.
* **Data handling**: Selection, search, editing and deletion of items.
  * **Selection mode**: none, single or multiple; a change emits onSelectionChange with the clicked item (single) or the items just added (multiple). Choices: None, Single, Multiple.
  * **Allow searching**: Adds a search box above the list that matches text in the visible fields.
  * **Allow updating**: Lets members edit the fields of an item; every edit emits the change.
  * **Allow deleting**: Lets members delete items; deleting emits onDelete with the item's index.

</details>

<!-- /generated -->
