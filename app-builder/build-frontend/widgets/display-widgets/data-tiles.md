# Data tiles

The data tiles widget displays a collection of data objects inside a responsive, tiled grid layout. Each tile functions as a miniature form template, making it ideal for building visual galleries, summary matrices, or interactive status dashboards.

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-06-10 at 14.06.37.png" alt="" width="563"><figcaption><p>A Data Tiles widget displaying 6 objects with multiple data fields each</p></figcaption></figure>

## Data binding

### Function output to widget

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `data` | An array of data objects, where each discrete object renders as an individual tile. | array |
| `isLoading` | Toggles a visual loading overlay indicator during background data operations. | boolean |

### Widget to function input

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `onChange` | Fires when a user modifies a field inside any tile. Triggers a baseline `onChange` event containing the complete row object, alongside a targeted legacy `onUpdate` event payload. | object |

#### Automatic configuration

Feed raw data to the widget without pre-defining any structural entries in your data fields, and it auto-configures itself. It inspects the properties of the first available record, generates a field entry for each key path, infers matching editor data types (such as `text`, `number`, `dateTime`, or `media`), and loads them into your configuration panel for further design adjustment.

## Configuration

Set the widget's defaults in the settings panel.

### Tile settings

#### Appearance

These settings control the dimensions, alignment, and internal label tracking parameters of the individual tile blocks.

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `justification` | Justification | Aligns row layouts within the parent grid container area (`flex-start`, `flex-end`, or `center`). | string |
| `tileWidth` | Tile width | Enforces a fixed horizontal structural width for every tile item in pixels. | number |
| `tileHeight` | Tile height | Enforces a fixed vertical structural height for every tile item in pixels. | number |
| `colCount` | Column count | Sets the number of layout columns used to arrange inputs inside each tile. Use `auto` for flexible scaling. | integer or string |
| `labelLocation` | Label location | Dictates where to anchor text labels relative to their input editors (`top`, `left`, `right`). | string |
| `labelMode` | Label mode | Selects structural label visualization styles (`static`, `floating`, `hidden`, `outside`). | string |
| `showColonAfterLabel` | Show colon | Appends a typographical colon suffix after each visible field label text when checked. | boolean |
| `fontSizeContent` | Font size content | Adjusts the typography point text size for input content and editor fields. | integer |
| `fontSizeLabel` | Font size label | Adjusts the typography point text size for field labels and tile text elements. | integer |

#### Data handling

These properties manage the interactive features and payload compilation rules for tile modifications.

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `allowUpdating` | Allow updating | Toggles form input controls out of read-only states, letting users modify parameters inline. | boolean |
| `showAllFieldsOnEdit` | Show all fields on edit | Forces update event payloads to return the entire compiled item object instead of transmitting only modified fields. | boolean |

### Data fields

Map text keys and array metrics extracted from your data source into visible tile fields.

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `titleField` | Title field | Selects a specific object property path to display as a prominent, bold header at the top of each tile. | string |
| `titleColor` | Title color | Overrides the global theme template text color for the primary tile title text element. | string |
| `dataFields` | Data fields | An array of field mapping configurations detailing individual inputs nested inside each tile. | array |

#### Field properties

Each individual configuration object nested inside the `dataFields` configuration array supports these properties:

| **Property** | **Description** | **Type** |
| :--- | :--- | :--- |
| `dataField` | The raw object key mapping path extracted out of the item record object. | string |
| `label` | The friendly descriptive text displayed as the field category header label. | string |
| `colSpan` | The total number of layout columns this specific field occupies within the tile template grid. | integer |
| `visible` | Toggles the visual rendering visibility of this field item within the tile container. | boolean |
| `widget` | Dictates the active user interface input control loaded inside the block template layout. | string |

### Editor widget options

Configure sub-properties nested inside your field structures based on your selected `widget` type.

| **Property** | **Label** | **Description** | **Type** |
| :--- | :--- | :--- | :--- |
| `min` | Minimum | (`number` and `slider` only) The lowest numeric value bound allowed for entry. | number |
| `max` | Maximum | (`number` and `slider` only) The highest numeric value bound allowed for entry. | number |
| `defaultValue` | Default value | (`number`, `slider`, `dropdown`, `tags` variants) The initial value used inside empty entries. | string or number |
| `precision` | Precision | (`number` only) Caps the maximum count of fixed decimal fraction places shown. | number |
| `currency` | Currency | (`number` only) Prepends currency identifier tags (such as `EUR` or `$`) ahead of values. | string |
| `handleLargeNumber` | Handle large numbers | (`number` only) Downsamples massive integers into condensed unit string variations (such as `1.2M`). | boolean |
| `discover` | Discover options | (`dropdown` and `tags` only) Automatically extracts unique choices directly from historical dataset values. | boolean |
| `options` | Options | (`dropdown` and `tags` only) A comma-separated list mapping hardcoded selection options. | string |
| `switchedOnText` | Switched on text | (`switch` only) The active label text displayed when the toggle is toggled true. | string |
| `switchedOffText` | Switched off text | (`switch` only) The inactive label text displayed when the toggle is toggled false. | string |
| `dateType` | Date type | (`dateTime` only) Adjusts picker depths, choosing between `date`, `time`, or combining into `datetime`. | string |
| `formatDescription` | Format description | (`dateTime` only) Selects specific formatting options driven by preset properties or explicit tokens. | string |
| `justification` | Justification | (`media` only) Aligns the asset element layout position within its template box area (`left`, `center`, `right`). | string |
| `thumbnailSize` | Thumbnail size | (`media` only) Defines the pixel height dimension for preview imagery loaded inside tile views. | integer |

## Video demo

{% embed url="https://youtu.be/p9-NG_BB6hU" %}
Data tiles explained
{% endembed %}
