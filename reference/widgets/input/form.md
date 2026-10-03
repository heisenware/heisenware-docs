---
description: >-
  Collects structured input in grouped or tabbed fields: nested form data by dot paths, validation rules, submit/reset buttons, autofill, dynamic fields
---

# Form

<figure><img src="../../../.gitbook/assets/widget-form.png" alt="Fault report form with line and machine dropdowns, fault time, downtime, a description, a line stopped switch and a Send report button" width="688"><figcaption></figcaption></figure>

A form collects structured input: text, numbers, dates, dropdowns, tags, switches, sliders and more, laid out in columns, sections or tabs. Every edit goes to your logic as one object, the form data. Typed text follows a moment after the last keystroke, a picked value at once. Your logic can prefill the form, fill its dropdowns, add fields on the fly or lock the whole form.

**Nested data.** A field's data field is a path: `customer.name` writes `{ "customer": { "name": … } }`. A section with its own data field puts its fields under that name. Values the form has no field for stay in the form data, so a record you load into the form keeps its id when it comes back.

**Dates** leave the form as `2026-10-01` (a date), `08:30:00` (a time of day) or `2026-10-01T06:30:00Z` (date and time, in UTC). They mean the same everywhere and go into a database unchanged.

**Validation.** Besides *Required*, each field takes rules with their own message: email address, pattern, text length, number range, number, or equal to another field (repeat a password). A submit button validates and sends the form data only when every field is valid.

**Good for:** fault and quality reports, order entry, settings and recipes, checklists.

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/form. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties under Receives and Emits. Drop an executor's output, input or trigger onto a row to link it. An example also fills an unlinked widget as demo data in the App Builder.

{% tabs %}
{% tab title="Receives" %}
**`autoFill`** (from an output, `object`): Merges the received object into the form data by path (writes `formData` back when `triggerFormDataOnAutoFill` is set).

<details>

<summary>Example</summary>

```json
{
  "operator": "J. Smith",
  "shift": "night"
}
```

</details>

**`options`** (from an output, `object`): Provides select, tag box and radio group options per field at runtime, replacing the configured options.

<details>

<summary>Example</summary>

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

**`clear`** (from an output, `any`): Truthy values return the fields to their default values and write that `formData`.

<details>

<summary>Example</summary>

```json
true
```

</details>

**`validate`** (from an output, `any`): Truthy values run validation and write the outcome to `validationResult`.

<details>

<summary>Example</summary>

```json
true
```

</details>

**`readOnly`** (from an output, `any`): Truthy makes the whole form read-only, falsy editable again.

<details>

<summary>Example</summary>

```json
true
```

</details>

**`disabled`** (from an output, `any`): Truthy disables the whole form, falsy enables it again.

<details>

<summary>Example</summary>

```json
true
```

</details>

**`addFields`** (from an output, `Array<object> | object`): Adds runtime fields: an array of field configurations (same shape as the Content settings' fields) is appended to the last group; an object `{ <group dataField>: [<fields>] }` appends per group, an unknown key adds a group with that dataField. A field arriving again replaces its earlier configuration.

<details>

<summary>Example</summary>

```json
[
  {
    "dataField": "notes",
    "label": "Notes",
    "editor": "text"
  }
]
```

</details>

**`setFields`** (from an output, `Array<object> | object`): Replaces runtime fields: an array of field configurations becomes all fields of the form (one group); an object `{ <group dataField>: [<fields>] }` replaces the fields of those groups, an unknown key adds a group.

<details>

<summary>Example</summary>

```json
[
  {
    "dataField": "batchId",
    "label": "Batch",
    "editor": "text"
  }
]
```

</details>

{% endtab %}

{% tab title="Emits" %}
**`formData`** (into an input, `object`): Writes the form data: at once for pickers, one second after the last keystroke for typed text, at once when a field is left or another field changes (carrying the typed text along). A hot input that should run once per entry belongs on `submitted`. Field paths nest by dots (`customer.name` -> `{ customer: { name } }`), a group's dataField prefixes its fields' paths. Keys without a field pass through an edit unchanged. Dates: a date `2026-10-01`, a time `08:30:00`, date and time `2026-10-01T06:30:00Z` (UTC). A linked formData fills the form; the form's own echo is ignored.

**`validationResult`** (into an input, `object`): Writes the outcome after the `validate` command or a click on the submit button.

**`submitted`** (into an input, `object`): Writes the form data when the submit button is clicked and the form is valid.

{% endtab %}

{% endtabs %}

## Settings

Double-click the widget in the Page editor to open its settings, grouped in these tabs. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

<details>

<summary>Content</summary>

* **Forms**: Field groups of the form, stacked; groups sharing a tab label become the tabs of one panel.
  * **Data field**: Path the group's fields nest under in formData (dots nest further); empty keeps them at the top level.
  * **Label**: Caption shown above the group, or the tab title of a tab; empty shows none.
  * **Tab label**: Groups sharing the same tab label become the tabs of one panel, captioned with it.
  * **Column count**: Columns this group's fields are laid out in; empty uses the form's. Choices: `auto`, `1`, `2`, `3`, `4`, `5`, `6`.
  * **Tab icon**: DevExtreme icon name shown on the tab (home, user, money); empty shows none.
  * **Tab badge**: Short text shown in a badge on the tab; empty shows none.
  * **Fields**: Fields of the group, in this order.
    * **Data field**: Path of the value in formData; dots nest (customer.name writes { customer: { name } }), inside a group with a data field the path continues the group's.
    * **Label**: Label shown for the field; empty shows none.
    * **Help text**: Hint shown under the field; empty shows none.
    * **Column span**: Columns the field spans (see column count); empty spans one.
    * **Required**: Marks the field required; validation fails while it is empty.
    * **Disabled**: Greys the editor out; members cannot change it.
    * **Read only**: Shows the value without letting members change it.
    * **Editor type**: Kind of input shown for the field; a spacer leaves its cell empty. Choices: Text box, Select box, Number box, Check box, Password, Tag box, Date/Time select, Date range select, Color select, Location select, Radio group, Text area, Slider, Range slider, Switch, Calendar, Native agent, Spacer.
    * **Validation rules**: Rules the value must keep, checked in order; the first broken one shows its message. Required is the field's own setting.
      * **Rule**: What the rule checks. Choices: Email address, Pattern, Text length, Number range, Number, Compare with field.
      * **Message**: Message shown while the rule is broken; empty shows the default.
      * **Pattern**: Regular expression the whole value must match: ^[A-Z]{3}$. Only when Rule is Pattern.
      * **Fewest characters**: Fewest characters; empty sets none. Only when Rule is Text length.
      * **Most characters**: Most characters; empty sets none. Only when Rule is Text length.
      * **Other field**: Full path of the field to compare with (account.password). Only when Rule is Compare with field.
      * **Comparison**: How the value must relate to the other field. Choices: `==`, `!=`, `<`, `<=`, `>`, `>=`. Only when Rule is Compare with field.
    * **Use accent color**: Colors the value with the theme's primary color while the form is read-only. Only when Editor type is Text box.
    * **Default value**: Value the field starts with, also after clear, until formData or the user sets it; empty starts blank. Only when Editor type is Text box.
    * **Placeholder**: Text shown in the empty editor; empty shows none. Only when Editor type is Text box.
    * **Show clear button**: Adds a button that empties the editor. Only when Editor type is Text box.
    * **Input mode**: Kind of text: email, tel and url bring the matching phone keyboard; search adds a search field look. Choices: Text, Email, Phone number, URL, Search. Only when Editor type is Text box.
    * **Maximum length**: Most characters the editor accepts; empty sets no limit. Only when Editor type is Text box.
    * **Input mask**: Pattern the input must follow: 0 a digit, 9 a digit or space, L a letter, A a letter or digit, C any character but space, other characters stay as typed (+49 000 0000000); empty sets none. Only when Editor type is Text box.
    * **Mask rules**: Extra mask characters: { "<character>": "<regular expression one character must match>" }. Only when Editor type is Text box.
    * **Mask message**: Message shown while the input does not fill the mask; empty shows the default. Only when Editor type is Text box.
    * **Show reveal button**: Adds a button that shows or hides the typed password. Only when Editor type is Password.
    * **Minimum**: Lowest value the editor accepts; empty sets no limit. Only when Editor type is Number box.
    * **Maximum**: Highest value the editor accepts; empty sets no limit. Only when Editor type is Number box.
    * **Step**: Amount the arrow keys, the mouse wheel and the spin buttons add or take away; empty steps by 1. Only when Editor type is Number box.
    * **Show spin buttons**: Adds up and down buttons that step the value. Only when Editor type is Number box.
    * **Prefix**: Text placed before the number, such as a currency sign; empty adds none. Only when Editor type is Number box.
    * **Suffix**: Text placed after the number, such as a unit; empty adds none. Only when Editor type is Number box.
    * **Show separator**: Groups thousands with a separator (1,234,567). Only when Editor type is Number box.
    * **Precision**: Decimal places allowed in the number; empty shows whole numbers when a prefix, suffix or separator is set, else the number as typed. Only when Editor type is Number box.
    * **Text**: Text shown beside the box; empty shows none. Only when Editor type is Check box.
    * **Three states**: Adds a third, undetermined state (null) between unchecked and checked. Only when Editor type is Check box.
    * **Options**: Options offered, comma separated; an entry label:value shows label and writes value. A linked options value replaces them. Only when Editor type is Select box.
    * **Enable searching**: Lets members type to filter the options. Only when Editor type is Select box.
    * **Search mode**: Whether the typed text matches anywhere in an option or at its start. Choices: Contains, Starts with. Only when Editor type is Select box.
    * **Accept custom value**: Lets members enter a value that is not among the options. Only when Editor type is Select box.
    * **Show drop down button**: Shows the arrow that opens the list. Only when Editor type is Select box.
    * **Show check boxes**: Shows a check box per option and a Select All entry. Only when Editor type is Tag box.
    * **Select All takes**: Whether Select All takes the options on the current page or all options. Choices: Current page, All options. Only when Editor type is Tag box.
    * **Select All text**: Text of the Select All entry; empty shows the default. Only when Editor type is Tag box.
    * **Most tags shown**: Tags shown before they collapse into one "n selected" tag; empty shows all. Only when Editor type is Tag box.
    * **Apply value**: Whether a selection applies at once or after the OK button. Choices: Instantly, With OK button. Only when Editor type is Tag box.
    * **Hide selected options**: Removes selected options from the list. Only when Editor type is Tag box.
    * **Wrap tags**: Wraps the tags onto several lines instead of scrolling them in one. Only when Editor type is Tag box.
    * **Date type**: Kind of value: a date writes 2026-10-01, a time of day 08:30:00, date and time an instant in UTC (2026-10-01T06:30:00Z). Choices: Date only, Time only, Date & time. Only when Editor type is Date/Time select.
    * **Display format**: How the value is shown: a named format (shortDate, longDateLongTime) or a pattern (dd.MM.yyyy HH:mm); empty follows the app's language. Only when Editor type is Date/Time select.
    * **Picker**: How the value is picked; empty uses DevExtreme's choice for the device. Choices: `calendar`, `rollers`, `list`, `native`, `null`. Only when Editor type is Date/Time select.
    * **Time interval**: Minutes between two entries of the time list picker; empty uses 30. Only when Editor type is Date/Time select.
    * **Show analog clock**: Shows a clock face beside the time fields of the date & time picker. Only when Editor type is Date/Time select.
    * **Start label**: Label of the start date; empty shows the default. Only when Editor type is Date range select.
    * **End label**: Label of the end date; empty shows the default. Only when Editor type is Date range select.
    * **Start placeholder**: Text shown in the empty start date; empty shows none. Only when Editor type is Date range select.
    * **End placeholder**: Text shown in the empty end date; empty shows none. Only when Editor type is Date range select.
    * **Two months**: Shows two months side by side in the picker. Only when Editor type is Date range select.
    * **Edit transparency**: Lets members set the transparency (alpha) of the color too. Only when Editor type is Color select.
    * **Location type**: What the Google Places lookup completes: address a street address, establishment a named place with its address. Choices: Full address, Place. Only when Editor type is Location select.
    * **layout**: Stacks the options vertically or lays them out in a row. Choices: Vertical, Horizontal. Only when Editor type is Radio group.
    * **Grow with the text**: Grows the text area with its content, between the minimum and maximum height. Only when Editor type is Text area.
    * **Minimum height**: Lowest height in px; empty sets none. Only when Editor type is Text area.
    * **Maximum height**: Highest height in px; empty sets none. Only when Editor type is Text area.
    * **Check spelling**: Underlines misspelled words with the browser's spell checker. Only when Editor type is Text area.
    * **Key step**: Positions one press of an arrow key moves; empty moves one step. Only when Editor type is Slider.
    * **Show range**: Colors the track between the start and the handle (a range slider: between its handles). Only when Editor type is Slider.
    * **Show value tooltip**: Shows the value in a tooltip at the handle. Only when Editor type is Slider.
    * **Tooltip shows**: Whether the value tooltip shows always or only while the pointer is on the handle. Choices: On hover, Always. Only when Editor type is Slider.
    * **Show minimum and maximum**: Labels the ends of the track with the minimum and maximum. Only when Editor type is Slider.
    * **Write the value**: When a drag writes formData: once when the handle is released, or on every step it passes (a hot input then runs per step). Choices: When released, While moving. Only when Editor type is Slider.
    * **Switched on text**: Text shown on the switch while it is on. Only when Editor type is Switch.
    * **Switched off text**: Text shown on the switch while it is off. Only when Editor type is Switch.
    * **First day of the week**: 0 Sunday to 6 Saturday; empty follows the app's language. Range 0 to 6. Only when Editor type is Calendar.
    * **Show week numbers**: Shows the week of the year beside each row. Only when Editor type is Calendar.
    * **Show today button**: Adds a button that jumps to today. Only when Editor type is Calendar.
    * **Selection**: One date, several dates (a list) or a range (start and end) the calendar writes. Choices: One date, Several dates, Range. Only when Editor type is Calendar.

</details>

<details>

<summary>Look &amp; feel</summary>

* **Column count**: Columns every group's fields are laid out in: 1 stacks them, auto fits as many as the width allows at the minimum column width. Choices: `auto`, `1`, `2`, `3`, `4`, `5`, `6`. *Set per screen.*
* **Minimum column width**: Narrowest column in px when the column count is auto; empty uses 200. *Set per screen.*
* **Label location**: Where a field's label sits: left of, right of or above its editor. Choices: `left`, `right`, `top`. *Set per screen.*
* **Label mode**: Static: label beside the value. Floating: label inside the editor, rising once it holds a value. Hidden: no label. Outside: label outside the editor box. Choices: Static, Floating, Hidden, Outside. *Set per screen.*
* **Align labels**: Gives the labels beside the fields of one group the same width.
* **Align labels across groups**: Gives the labels beside the fields the same width in all groups.
* **Show colon**: Puts a colon after every label.
* **Editor style**: Look of the editors: outlined a box, filled a shaded field, underlined a line; empty keeps the theme's. Choices: `outlined`, `filled`, `underlined`, `null`.
* **Custom content size**: Font size of the values in px; empty keeps the theme's. Range 6 to 50. *Set per screen.*
* **Custom label size**: Font size of the labels in px; empty keeps the theme's. Range 6 to 50. *Set per screen.*
* **Initially read-only**: Starts the form read-only until the readOnly input switches it.
* **Initially disabled**: Starts the form disabled until the disabled input switches it.
* **Trigger formData event on autofill**: Emits formData after an autofill and lets a linked formData apply while autoFill is linked; off, an autofill only fills the editors.

</details>

<details>

<summary>Validation &amp; buttons</summary>

* **Mark required fields**: Shows the required mark after the label of a required field.
* **Required mark**: Mark shown after a required field; empty shows *.
* **Mark optional fields**: Shows the optional mark after the label of a field that is not required.
* **Optional mark**: Mark shown after an optional field; empty shows "optional".
* **Required message**: Message of an empty required field, {0} standing for its label ({0} is required); empty shows the default.
* **Show validation summary**: Lists every broken rule under the form after a validation.
* **Show submit button**: Adds a button that validates the form and writes submitted with the form data when it is valid.
* **Submit button text**: Text of the submit button.
* **Submit button type**: Color role of the submit button. Choices: Primary, Success, Danger, Normal.
* **Show reset button**: Adds a button that returns the fields to their default values and writes formData.
* **Reset button text**: Text of the reset button.
* **Button alignment**: Where the buttons sit in their row. Choices: Left, Center, Right.

</details>

<!-- /generated -->
