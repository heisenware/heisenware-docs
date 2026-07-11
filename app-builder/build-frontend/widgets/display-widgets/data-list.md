# Data list

The data list displays a collection of items in a scrollable list. It renders each item as a miniature, configurable form, which makes it ideal for viewing and editing detailed records in a compact space.

It supports searching, selection, and inline editing, a rich, interactive way to manage lists of complex data.

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-06-10 at 15.25.25.png" alt=""><figcaption></figcaption></figure>

## Data binding

Link this widget to your logic by dragging items from the [Backend Builder](../../../build-backend/) onto it.

### Input

| **Property**            | **Type**             | **Description**                                                                                                                         |
| ----------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **`onChange`**          | `Object`             | Fires when a field within a list item is updated. The payload is the complete data object for the modified item.                        |
| **`onSelectionChange`** | `Object` or `Array`  | Fires when a user selects an item. The payload is the selected item's data object, or an array of objects if multi-selection is enabled. |
| **`onDelete`**          | `Object` or `String` | Fires when an item is deleted. The payload is the key of the deleted item.                                                              |

### Output

| **Property**      | **Type**  | **Description**                                                     |
| ----------------- | --------- | ------------------------------------------------------------------- |
| **`data`**        | `Array`   | An array of data objects to display in the list.                    |
| **`searchValue`** | `String`  | Sets the search value to filter the list.                           |
| **`editable`**    | `Boolean` | Enables or disables editing for all items in the list.              |

#### Automatic configuration

Feed data to the widget without defining any data fields, and it inspects the first record. It generates a field for each property, infers the data type (`text`, `number`, `dateTime`, and so on), and applies default settings. The generated fields then appear in the configuration panel, ready for you to customize further.

## Configuration

### Settings

#### Appearance

These properties control the layout and styling of the fields within each list item.

| **Label**          | **Description**                                                               | **Type** | **Property**          |
| ------------------ | ----------------------------------------------------------------------------- | -------- | --------------------- |
| **Column count**   | Sets the number of columns arranging fields within each list item.            | String   | `colCount`            |
| **Label location** | Where to display field labels relative to the editors.                        | String   | `labelLocation`       |
| **Label mode**     | How labels are displayed (`Static`, `Floating`, `Hidden`, `Outside`).         | String   | `labelMode`           |
| **Show colon**     | If `true`, adds a colon after each field label.                               | Boolean  | `showColonAfterLabel` |

#### Data handling

These properties control the list's interactive features.

| **Label**                   | **Description**                                                                                                 | **Type** | **Property**          |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- | -------- | --------------------- |
| **Selection mode**          | Allows `single` or `multiple` item selection.                                                                   | String   | `selectionMode`       |
| **Allow searching**         | Adds a search box to filter the list.                                                                           | Boolean  | `allowSearching`      |
| **Allow updating**          | Lets users edit the fields within each list item.                                                              | Boolean  | `allowUpdating`       |
| **Allow deleting**          | Lets users delete items from the list.                                                                         | Boolean  | `allowDeleting`       |
| **Show all fields on edit** | If `true`, the update event payload includes all of the item's fields, not just the modified one.              | Boolean  | `showAllFieldsOnEdit` |

### Data fields

Define the fields that make up each item in your list here.

| **Label**         | **Description**                                                         | **Type** | **Property** |
| ----------------- | ----------------------------------------------------------------------- | -------- | ------------ |
| **Data field**    | The field from your data source that this item binds to.                | String   | `dataField`  |
| **Label**         | The friendly text shown as the field's label.                           | String   | `label`      |
| **Column span**   | The number of columns the field occupies within the item's layout.      | Integer  | `colSpan`    |
| **Visible**       | Toggles the field's visibility.                                         | Boolean  | `visible`    |
| **Editor widget** | The editor for displaying and editing this field.                       | String   | `widget`     |

#### Editor widget options

Each `widget` type has its own configuration options.

**Number (`number`) / slider (`slider`)**

| **Label**                | **Description**                                                                          | **Type** | **Property**        |
| ------------------------ | ---------------------------------------------------------------------------------------- | -------- | ------------------- |
| **Minimum**              | The minimum allowed value.                                                               | Number   | `min`               |
| **Maximum**              | The maximum allowed value.                                                               | Number   | `max`               |
| **Default value**        | The initial value of the editor.                                                         | Number   | `defaultValue`      |
| **Precision**            | (`number` only) The number of decimal places to allow.                                   | Number   | `precision`         |
| **Currency**             | (`number` only) A currency symbol or code to display (e.g. $, €, EUR).                   | String   | `currency`          |
| **Handle large numbers** | (`number` only) Formats large numbers with abbreviations (e.g. 1,200,000 becomes 1.2M).  | Boolean  | `handleLargeNumber` |

**Dropdown (`dropdown`) / tags (`tags`)**

| **Label**            | **Description**                                                                                       | **Type** | **Property**   |
| -------------------- | ----------------------------------------------------------------------------------------------------- | -------- | -------------- |
| **Discover options** | If `true`, populates the dropdown options from the unique values in this column's data.               | Boolean  | `discover`     |
| **Options**          | A comma-separated list of predefined options.                                                         | String   | `options`      |
| **Default value**    | The initial selected value.                                                                           | String   | `defaultValue` |

**Switch (`switch`)**

| **Label**             | **Description**                        | **Type** | **Property**      |
| --------------------- | -------------------------------------- | -------- | ----------------- |
| **Switched on text**  | Text displayed when the switch is ON.  | String   | `switchedOnText`  |
| **Switched off text** | Text displayed when the switch is OFF. | String   | `switchedOffText` |

**Date/time (`dateTime`)**

| **Label**              | **Description**                                                            | **Type** | **Property**        |
| ---------------------- | -------------------------------------------------------------------------- | -------- | ------------------- |
| **Date type**          | The type of picker to display: `Date Only`, `Time Only`, or `Date & Time`. | String   | `dateType`          |
| **Format description** | Choose a `Preset` format or an `Explicit`, custom one.                     | String   | `formatDescription` |

**Media (`media`)**

| **Label**              | **Description**                                                                 | **Type** | **Property**       |
| ---------------------- | ------------------------------------------------------------------------------- | -------- | ------------------ |
| **Is central element** | If `true`, displays the media as a large, central element in the edit form.     | Boolean  | `isCentralElement` |
| **Thumbnail size**     | The height (in pixels) of the media thumbnail shown in the list item.           | Integer  | `thumbnailSize`    |
