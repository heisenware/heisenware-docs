# Data Tiles

The **DataTiles** widget is designed to display a collection of items in a responsive, tiled layout. Each tile acts as a miniature, read-only or editable form, making it an excellent choice for creating dashboards, galleries, or any interface where data needs to be presented in a visually distinct and organized manner.

It supports inline editing and automatic configuration, providing a flexible way to build dynamic and interactive displays.

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-06-10 at 14.06.37.png" alt="" width="563"><figcaption><p>A Data Tiles widget displaying 6 objects with multiple data fields each</p></figcaption></figure>

## Data Binding

Connect the widget to your application's logic by dragging the corresponding items from the Flow Builder.

### Input

| **Property**   | **Type** | **Description**                                                                                             |
| -------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| **`onUpdate`** | `Object` | Fired when a field within a tile is updated. The payload contains the updated field and the item's ID.      |
| **`onChange`** | `Object` | Fired when a field within a tile is updated. The payload is the complete data object for the modified item. |

### Output

| **Property**    | **Type**  | **Description**                                                                              |
| --------------- | --------- | -------------------------------------------------------------------------------------------- |
| **`data`**      | `Array`   | An array of data objects, where each object is rendered as a separate tile.                  |
| **`isLoading`** | `Boolean` | When `true`, displays a loading indicator, useful for showing progress during data fetching. |

#### Automatic Configuration

If you provide data to the widget without pre-defining any data fields, the widget will automatically inspect the first data record. It will generate a field for each property, infer the data type (`text`, `number`, `dateTime`, etc.), and apply default settings. These automatically generated fields will then appear in the configuration panel for you to customize further.

## Configuration

### Tile Settings

#### Appearance

These properties control the layout and styling of the tiles and the fields within them.

| **Label**          | **Description**                                                               | **Type** | **Property**          |
| ------------------ | ----------------------------------------------------------------------------- | -------- | --------------------- |
| **Justification**  | Aligns the tiles within the widget's container.                               | String   | `justification`       |
| **Tile Width**     | Sets a fixed width for each tile in pixels.                                   | Number   | `tileWidth`           |
| **Tile Height**    | Sets a fixed height for each tile in pixels.                                  | Number   | `tileHeight`          |
| **Column Count**   | Sets the number of columns used to arrange fields within each tile.           | String   | `colCount`            |
| **Label Location** | Specifies where to display field labels relative to the editors.              | String   | `labelLocation`       |
| **Label Mode**     | Defines how labels are displayed (`Static`, `Floating`, `Hidden`, `Outside`). | String   | `labelMode`           |
| **Show Colon**     | If `true`, adds a colon after each field label text.                          | Boolean  | `showColonAfterLabel` |

#### Data Handling

These properties control the interactive features of the tiles.

| **Label**                   | **Description**                                                                                                 | **Type** | **Property**          |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- | -------- | --------------------- |
| **Allow Updating**          | Allows users to edit the fields within each tile.                                                               | Boolean  | `allowUpdating`       |
| **Show All Fields On Edit** | If `true`, the data payload for update events will include all fields from the item, not just the modified one. | Boolean  | `showAllFieldsOnEdit` |

### Data Fields

This is where you define the title and fields that make up the content of each tile.

| **Label**       | **Description**                                                               | **Type** | **Property** |
| --------------- | ----------------------------------------------------------------------------- | -------- | ------------ |
| **Title Field** | The field from your data source to be used as the main title for each tile.   | String   | `titleField` |
| **Data Fields** | An array of field objects that define the content displayed within each tile. | Array    | `dataFields` |

#### Field Properties

Each object in the `dataFields` array can have the following properties:

| **Label**         | **Description**                                                         | **Type** | **Property** |
| ----------------- | ----------------------------------------------------------------------- | -------- | ------------ |
| **Data Field**    | The field from your data source that this item is bound to.             | String   | `dataField`  |
| **Label**         | The user-friendly text displayed as the field's label.                  | String   | `label`      |
| **Column Span**   | The number of columns the field should occupy within the tile's layout. | Integer  | `colSpan`    |
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

| **Label**          | **Description**                                                       | **Type** | **Property**    |
| ------------------ | --------------------------------------------------------------------- | -------- | --------------- |
| **Justification**  | Aligns the media within its display area (`Left`, `Center`, `Right`). | String   | `justification` |
| **Thumbnail Size** | The height (in pixels) of the media thumbnail.                        | Integer  | `thumbnailSize` |

{% embed url="https://youtu.be/p9-NG_BB6hU" %}
Data tiles explained
{% endembed %}
