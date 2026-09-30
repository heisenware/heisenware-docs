---
description: >-
  Full-featured table of rows — editing, selection, grouping, filtering and PDF/Excel/CSV export
---

# Data Grid

<figure><img src="../../../.gitbook/assets/widget-data-grid.png" alt="Data grid of production orders with search, header filters, footer sums, delayed orders in red and finished orders in green"><figcaption></figcaption></figure>

A data grid shows rows as a table that users work with: they sort and filter by any column, search, group rows by dragging a column header into the group panel, and read totals in the footer. Rules color cells or whole rows by their values. With editing on, users add, change and delete rows, and every change reaches your logic as an event carrying the row. The rows export to PDF, Excel or CSV.

**Good for:** order and stock lists, master data maintenance, logs and reports.

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/data-grid. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `data` | output | `Array<any>` | The rows to display. Column configuration is scanned from the first rows at design time and refined via the Content settings; arrays of primitives get generated `index`/`value` columns. |
| `options` | output | `object` | Provides dropdown and tag options per field at runtime, replacing the statically configured options of that field. |
| `rowFilter` | output | `object` | Pre-sets the row filter: one entry per column. |
| `rowFilterOperation` | output | `object` | The comparison operation per row-filtered column, e.g. `contains`, `=`, `>=`. |
| `headerFilter` | output | `object` | Pre-selects header-filter values: one value or an array of values per column. |

### Emits

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `onInsert` | input | `object` | Writes the newly added row when a user inserts one. |
| `onChange` | input | `object` | Writes the edited row when a user saves an update: the whole row merged with the changed fields. In batch mode one event per changed row. |
| `onDelete` | input | `string\|number` | Writes the removed row's key when a user deletes it: its `id`, or its `index` when the rows carry none. |
| `onSelectionChange` | input | `object\|Array<object>` | Writes the selection: the selected row in `single` selection mode, an array of rows in `multiple` mode. |
| `onRowClick` | input | `object` | Writes the clicked row. |
| `onLinkClick` | input | `object` | Writes the clicked row plus `__origin__` (the clicked column's data field) when a column marked *Is Clickable* is clicked. |

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

<summary><code>rowFilter</code></summary>

```json
{
  "device": "Pump"
}
```

</details>

<details>

<summary><code>rowFilterOperation</code></summary>

```json
{
  "device": "contains"
}
```

</details>

<details>

<summary><code>headerFilter</code></summary>

```json
{
  "status": [
    "running",
    "idle"
  ]
}
```

</details>

## Settings

Double-click the widget in the Page editor to open its settings. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

### Content

| Setting | What it does | Default |
|---|---|---|
| Columns | Columns of the grid, in display order; scanned from the bound rows at design time. |  |
| Columns › Data field | Key of the row field the column shows. |  |
| Columns › Column name | Header text of the column; empty derives it from the data field. |  |
| Columns › Visibility | visible shows the column, detail moves it into the expandable row detail, hidden hides it but keeps it in the column chooser, removed drops it. Choices: Visible, Detail, Hidden, Removed. | Visible |
| Columns › Editing | optional lets members edit the value, required refuses to save without one, disabled locks the value, hidden leaves it out of the edit form and locks it in place. Choices: Optional, Required, Disabled, Hidden. | Optional |
| Columns › Width | Width of the column in px; empty sizes it to its content (or evenly, with column auto width off). |  |
| Columns › Pinned | Pins the column to the left or right edge so it stays while the grid scrolls sideways; the row buttons follow to the right edge. Choices: Not pinned, Left, Right. | Not pinned |
| Columns › Initial sort | Sorts the rows by this column when the grid opens; members can still re-sort. Choices: None, Ascending, Descending. | None |
| Columns › Footer summary | Shows a total for this column in the footer, formatted like the column: sum, average, minimum, maximum or the count of values. Choices: None, Sum, Average, Minimum, Maximum, Count. | None |
| Columns › Editor widget | Editor used for the value; also sets the column format (number, date) or preview (media). Choices: Text, Number, Slider, Date/Time, Date range, Calendar, Dropdown, Tags, Checkbox, Switch, Color, Media. | Text |
| Columns › Is clickable | Shows the cell text as a link; a click emits onLinkClick with the row and __origin__ set to this data field. Only when Editor widget is Text. |  |
| Columns › Minimum | Lowest value the editor accepts; empty sets no limit. Only when Editor widget is Number. |  |
| Columns › Maximum | Highest value the editor accepts; empty sets no limit. Only when Editor widget is Number. |  |
| Columns › Default value | Value a new row starts with in this column. Only when Editor widget is Number. |  |
| Columns › Precision | Decimal places shown in the cell and its editor. Only when Editor widget is Number. |  |
| Columns › Currency | ISO currency code (EUR, USD) that formats the value as money; empty shows a plain number. Only when Editor widget is Number. |  |
| Columns › Handle large numbers | Abbreviates large numbers in the cell (12K, 3M); the editor keeps the full number. Only when Editor widget is Number. | off |
| Columns › Date type | Kind of value in the column: a date, a time of day or both; sets the picker and the column type. Choices: Date only, Time only, Date & time. Only when Editor widget is Date/Time. | Date & time |
| Columns › Format description | How the display format is chosen: preset picks a named format, explicit composes one from its parts. Choices: Use preset, Explicit. Only when Editor widget is Date/Time. | Use preset |
| Columns › Discover options | Adds the values the rows already carry in this column to the options, so every stored value can be picked again. Only when Editor widget is Dropdown. |  |
| Columns › Options | Options offered by the dropdown or tag picker, comma separated; label:value shows the label and writes the value. The options output replaces them at runtime. Only when Editor widget is Dropdown. |  |
| Columns › Switched on text | Text shown on the switch while it is on. Only when Editor widget is Switch. | `ON` |
| Columns › Switched off text | Text shown on the switch while it is off. Only when Editor widget is Switch. | `OFF` |
| Columns › Media type | File kind of the cell (png, jpeg, svg, pdf); set, the cell shows a preview and loses sorting, filtering, search and export. Choices: `png`, `jpeg`, `svg`, `pdf`. Only when Editor widget is Media. |  |
| Columns › Is central element | Shows the media large and full width in the edit form. Only when Editor widget is Media. |  |
| Columns › Thumbnail size | Height of the preview in the cell in px. Range 20 to 400. Only when Editor widget is Media. | `50` |

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Appearance › Paging mode | virtual loads rows as the member scrolls; standard splits them into pages with a pager below. Choices: Infinite scrolling, Paged view. *Set per screen.* | Infinite scrolling |
| Appearance › Detail mode | How detail columns show under an expanded row: horizontal as a nested table, vertical as a card with labels above values. Choices: Table, Card. | Card |
| Appearance › Detail card columns | Columns for the fields of the detail card: 1 stacks them, auto fits as many as the width allows. Choices: `auto`, `1`, `2`, `3`, `4`, `5`, `6`. *Set per screen.* | automatic |
| Appearance › Custom content size | Font size of cell values, filter inputs and editors in px; empty keeps the theme's. Range 6 to 50. *Set per screen.* |  |
| Appearance › Custom label size | Font size of column headers and popup titles in px; empty keeps the theme's. Range 6 to 50. *Set per screen.* |  |
| Appearance › Show borders | Draws a border around the grid. | off |
| Appearance › Show headers | Shows the header row. | on |
| Appearance › Show vertical lines | Draws lines between columns. | on |
| Appearance › Show horizontal lines | Draws lines between rows. | off |
| Appearance › Alternate row color | Shades every second row. | on |
| Appearance › Column auto width | Sizes each column to its content; off, the columns share the width evenly. *Set per screen.* | on |
| Appearance › Wrap long text | Wraps cell text onto several lines instead of cutting it off. | off |
| Appearance › Empty text | Text shown when there are no rows; empty keeps the theme's default. |  |
| Data display › Selection mode | none, single (click selects one row) or multiple (checkboxes); a change emits onSelectionChange with the row or the rows. Choices: None, Single, Multiple. | None |
| Data display › Allow column reordering | Lets members drag column headers to reorder the columns. *Set per screen.* | off |
| Data display › Allow column resizing | Lets members drag header edges to resize the columns. *Set per screen.* | on |
| Data display › Allow column pinning | Lets members pin columns to the left or right edge from the header menu. *Set per screen.* | off |
| Data display › Allow column choosing | Adds a column chooser button to show or hide columns. | off |
| Data display › Allow multiple column sorting | Lets members sort by several columns at once; off, sorting one column replaces the previous sort. | off |
| Data display › Allow grouping | Shows the group panel, so members drag headers into it to group rows, plus an expand/collapse all button. | off |
| Data display › Allow searching | Adds a search box to the toolbar that filters rows by text. | off |
| Data display › Allow row filtering | Adds a filter row under the headers with an input per column. | off |
| Data display › Allow header filtering | Adds a funnel icon to each header that filters by a searchable list of the column's values. | off |
| Data display › Allow filter building | Shows the filter panel below the grid, where members build and edit combined filters. | off |
| Data display › Show item count | Shows the row count in a footer under the first visible column. | off |
| Data editing › Mode | cell saves each cell as it is left, batch collects cell edits until the member saves them all, row edits a whole row inline, form expands the row into a form inside the grid with Save and Cancel under it (give the grid the height for the form, or the member scrolls to the buttons), popup opens a full-screen form. Choices: Cell, Batch, Row, Form, Popup. | Row |
| Data editing › Start editing on | In cell and batch mode: a click or a double click opens the cell editor; double click keeps a click free for selecting the row. Choices: Click, Double click. | Click |
| Data editing › Allow adding | Adds a toolbar button that inserts a row; saving it emits onInsert with the new row. | off |
| Data editing › Allow updating | Lets members edit rows; saving emits onChange with the whole row and the changes applied. | off |
| Data editing › Allow deleting | Adds a delete button to each row; deleting emits onDelete with the row's id (or index). | off |
| Data export › Allow PDF export | Adds a toolbar button that downloads the rows as a PDF; in multiple selection with rows selected, only those. | off |
| Data export › Allow Excel export | Adds a toolbar button that downloads the rows as an Excel file; in multiple selection with rows selected, only those. | off |
| Data export › Allow CSV export | Adds a toolbar button that downloads the rows as a CSV file; in multiple selection with rows selected, only those. | off |
| Data export › Hint text | Label of the export buttons; the format name follows it. | `Export` |
| Data export › File name | Name of the downloaded file, without extension. | `Heisenware-Data` |
| Conditional formatting | Rules that color cells or whole rows by the value in one column; the first matching rule wins. |  |
| Conditional formatting › Column (data field) | Data field of the column the rule reads, as listed under Content. |  |
| Conditional formatting › Format rule | Comparison of the column value with the value to match: text_contains ignores case, text_equals is exact, greater/less compare numbers or dates. Choices: Text contains, Text is equal, Value is greater than, Value is less than. |  |
| Conditional formatting › Apply to whole row | Colors every cell of the row when the chosen column matches; off colors only that cell. | off |
| Conditional formatting › Background color | CSS color applied to the matching cells, e.g. green or #ffa500. |  |
| Conditional formatting › Value to match | Value the column is compared with: text for contains and equals, number or text for greater and less than. Only when Format rule is Text contains, Text is equal, Value is greater than or Value is less than. |  |

<!-- /generated -->
