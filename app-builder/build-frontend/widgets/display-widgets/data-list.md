# Data List

The **DataList** widget is designed to display a collection of items in a scrollable list format. Each item in the list is rendered as a miniature, configurable form, making it an ideal choice for displaying and editing detailed records in a compact space.

It supports searching, selection, and inline editing, providing a rich, interactive experience for managing lists of complex data.

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-06-10 at 15.25.25.png" alt=""><figcaption></figcaption></figure>

## Data Binding

Connect the widget to your application's logic by dragging the corresponding items from the Flow Builder.

### Input

| **Property**            | **Type**             | **Description**                                                                                                                         |
| ----------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **`onChange`**          | `Object`             | Fired when a field within a list item is updated. The payload is the complete data object for the modified item.                        |
| **`onSelectionChange`** | `Object` or `Array`  | Fired when a user selects an item. The payload is the selected item's data object or an array of objects if multi-selection is enabled. |
| **`onDelete`**          | `Object` or `String` | Fired when an item is deleted. The payload is the key of the deleted item.                                                              |

### Output

| **Property**      | **Type**  | **Description**                                                                        |
| ----------------- | --------- | -------------------------------------------------------------------------------------- |
| **`data`**        | `Array`   | An array of data objects to be displayed in the list.                                  |
| **`searchValue`** | `String`  | Programmatically sets the search value to filter the list.                             |
| **`editable`**    | `Boolean` | Programmatically enables or disables the editing capability for all items in the list. |

#### Automatic Configuration

If you provide data to the widget without pre-defining any data fields, the widget will automatically inspect the first data record. It will generate a field for each property, infer the data type (`text`, `number`, `dateTime`, etc.), and apply default settings. These automatically generated fields will then appear in the configuration panel for you to customize further.

## Configuration

### Settings

#### Appearance

These properties control the layout and styling of the fields within each list item.

| **Label**          | **Description**                                                               | **Type** | **Property**          |
| ------------------ | ----------------------------------------------------------------------------- | -------- | --------------------- |
| **Column Count**   | Sets the number of columns used to arrange fields within each list item.      | String   | `colCount`            |
| **Label Location** | Specifies where to display field labels relative to the editors.              | String   | `labelLocation`       |
| **Label Mode**     | Defines how labels are displayed (`Static`, `Floating`, `Hidden`, `Outside`). | String   | `labelMode`           |
| **Show Colon**     | If `true`, adds a colon after each field label text.                          | Boolean  | `showColonAfterLabel` |

#### Data Handling

These properties control the interactive features of the list.

| **Label**                   | **Description**                                                                                                 | **Type** | **Property**          |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- | -------- | --------------------- |
| **Selection Mode**          | Allows `single` or `multiple` item selection.                                                                   | String   | `selectionMode`       |
| **Allow Searching**         | Adds a search box to filter the list based on user input.                                                       | Boolean  | `allowSearching`      |
| **Allow Updating**          | Allows users to edit the fields within each list item.                                                          | Boolean  | `allowUpdating`       |
| **Allow Deleting**          | Allows users to delete items from the list.                                                                     | Boolean  | `allowDeleting`       |
| **Show All Fields On Edit** | If `true`, the data payload for update events will include all fields from the item, not just the modified one. | Boolean  | `showAllFieldsOnEdit` |

### Data Fields

This is where you define the fields that make up the content of each item in your list.

| **Label**         | **Description**                                                         | **Type** | **Property** |
| ----------------- | ----------------------------------------------------------------------- | -------- | ------------ |
| **Data Field**    | The field from your data source that this item is bound to.             | String   | `dataField`  |
| **Label**         | The user-friendly text displayed as the field's label.                  | String   | `label`      |
| **Column Span**   | The number of columns the field should occupy within the item's layout. | Integer  | `colSpan`    |
| **Visible**       | Toggles the visibility of the field.                                    | Boolean  | `visible`    |
| **Editor Widget** | The editor to use for displaying and editing this field.                | String   | `widget`     |

#### Editor Widget Options

Each `widget` type has its own set of specific configuration options.

**Number (`number`) / Slider (`slider`)**

| **Label**                | **Description**                                                                          | **Type** | **Property**        |
| ------------------------ | ---------------------------------------------------------------------------------------- | -------- | ------------------- |
| **Minimum**              | The minimum allowed value.                                                               | Number   | `min`               |
| **Maximum**              | The maximum allowed value.                                                               | Number   | `max`               |
| **Default Value**        | The initial value of the editor.                                                         | Number   | `defaultValue`      |
| **Precision**            | (`number` only) The number of decimal places to allow.                                   | Number   | `precision`         |
| **Currency**             | (`number` only) A currency symbol or code to display (e.g., $, €, EUR).                  | String   | `currency`          |
| **Handle Large Numbers** | (`number` only) Formats large numbers with abbreviations (e.g., 1,200,000 becomes 1.2M). | Boolean  | `handleLargeNumber` |

**Dropdown (`dropdown`) / Tags (`tags`)**

| **Label**            | **Description**                                                                                       | **Type** | **Property**   |
| -------------------- | ----------------------------------------------------------------------------------------------------- | -------- | -------------- |
| **Discover Options** | If `true`, automatically populates the dropdown options from the unique values in this column's data. | Boolean  | `discover`     |
| **Options**          | A comma-separated list of predefined options.                                                         | String   | `options`      |
| **Default Value**    | The initial selected value.                                                                           | String   | `defaultValue` |

**Switch (`switch`)**

| **Label**             | **Description**                        | **Type** | **Property**      |
| --------------------- | -------------------------------------- | -------- | ----------------- |
| **Switched On Text**  | Text displayed when the switch is ON.  | String   | `switchedOnText`  |
| **Switched Off Text** | Text displayed when the switch is OFF. | String   | `switchedOffText` |

**Date/Time (`dateTime`)**

| **Label**              | **Description**                                                            | **Type** | **Property**        |
| ---------------------- | -------------------------------------------------------------------------- | -------- | ------------------- |
| **Date Type**          | The type of picker to display: `Date Only`, `Time Only`, or `Date & Time`. | String   | `dateType`          |
| **Format Description** | Choose between a `Preset` format or an `Explicit`, custom format.          | String   | `formatDescription` |

**Media (`media`)**

| **Label**              | **Description**                                                                 | **Type** | **Property**       |
| ---------------------- | ------------------------------------------------------------------------------- | -------- | ------------------ |
| **Is Central Element** | If `true`, the media is displayed as a large, central element in the edit form. | Boolean  | `isCentralElement` |
| **Thumbnail Size**     | The height (in pixels) of the media thumbnail displayed in the grid cell.       | Integer  | `thumbnailSize`    |
