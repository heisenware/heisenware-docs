# Form

The form widget lets you build dynamic, data-driven forms with a wide variety of input types. Configure the layout, create complex field groups, and connect it to your backend logic to handle submission, validation, and live updates.

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-05-20 at 15.42.53.png" alt="" width="332"><figcaption><p>A form with different editor types</p></figcaption></figure>

## Data binding

Link this widget to your logic by dragging items from the [Backend Builder](../../../build-backend/) onto it.

### Input

_Drag a function input onto the widget._

| Property               | Type     | Description                                                                                                     |
| ---------------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| **`formData`**         | `Object` | Fired whenever any field's value changes. The payload is an object containing all current form data.            |
| **`validationResult`** | `Object` | Fired after a `validate` command. Contains `{ isValid, status, brokenRules }` detailing the validation outcome. |

### Output

_Drag a function output or a modifier onto the widget._

| Property        | Type                | Description                                                                                                                                                                  |
| --------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`autoFill`**  | `Object`            | Pre-fills the form with the provided data object. The object structure should match the `dataField` names. Can be configured to not trigger an outgoing `formData` event.    |
| **`clear`**     | `Boolean`           | When `true`, clears all data from the form.                                                                                                                                  |
| **`validate`**  | `Boolean`           | When `true`, triggers the form's validation process.                                                                                                                         |
| **`readOnly`**  | `Boolean`           | Dynamically sets the entire form's read-only state.                                                                                                                          |
| **`options`**   | `Object`            | Dynamically provides options for `select`, `tags`, or `radioGroup` editors at runtime. The object keys should match the `dataField` of the target editor.                    |
| **`addFields`** | `Array` or `Object` | Dynamically adds new fields to the form. Can be an array of field objects for a single group or an object where keys are group `dataField`s and values are arrays of fields. |
| **`setFields`** | `Array` or `Object` | Replaces all existing fields with a new set. Can be an array of field objects for a single group or a full group structure object.                                           |

#### Autofilling the form (`autoFill`)

To pre-fill the form, pass a JSON object to the `autoFill` property. Its structure must mirror your form's configuration.

* **Keys**: The keys in your JSON object must match the `dataField` names you defined for each field in the configuration.
* **Nesting**: If you use form groups and gave a group a `dataField`, nest your JSON object to match. The group's `dataField` becomes a key for a nested object holding that group's fields.

**Example:**

Let's say you have a form with two groups, `personalInfo` and `addressInfo`.

**Configuration:**

* Group 1 `dataField`: `personalInfo`
  * Field `dataField`: `firstName`
  * Field `dataField`: `lastName`
* Group 2 `dataField`: `addressInfo`
  * Field `dataField`: `street`
  * Field `dataField`: `city`

The JSON object you pass to `autoFill` or `formData` looks like this:

```json
{
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "addressInfo": {
    "street": "123 Main St",
    "city": "Anytown"
  }
}
```

If your form uses no groups with `dataField`s, the object stays flat: `{ "firstName": "John", "lastName": "Doe" }`.

#### Setting options at runtime (`options`)

To populate a `select`, `tags`, or `radioGroup` editor at runtime, pass a JSON object to the `options` property.

* **Keys**: The keys of this object must match the `dataField` of the specific editor you want to update.
* **Values**: The value for each key must be an array of options.

The options in the array can be in two formats:

1. **Simple array of strings**: Use this when the display text and the value are the same. `["Apple", "Banana", "Cherry"]`
2. **Array of key-value pairs**: Use this when you need different text for display and for the submitted value. The format is `[ "Display Text", "value" ]`. `[ [ "New York", "NY" ], [ "California", "CA" ], [ "Texas", "TX" ] ]`

**Example:**

Imagine a form with a `state` selector and a `productTags` tag box.

**Configuration:**

* Field `dataField`: `state` (a `select` editor)
* Field `dataField`: `productTags` (a `tags` editor)

The JSON object you pass to the `options` property to populate both:

```json
{
  "state": [
    [ "New York", "NY" ],
    [ "California", "CA" ],
    [ "Texas", "TX" ]
  ],
  "productTags": [
    "New",
    "Best Seller",
    "Clearance"
  ]
}
```

{% hint style="info" %}
#### Special case: location field data

When using a `location` editor, a successful place selection adds an extended object to the `formData` payload. The standard field (`dataField`) contains the formatted address string, while a second field with an `Ext` suffix (`dataFieldExt`) contains a detailed object with properties like `name`, `address`, `city`, `postcode`, `country`, and `geoJson`.

**Example `formData` payload for a location field named `officeAddress`:**

```json
{
  "officeAddress": "One Heisenware Way, Silicon Valley, CA 94043, USA",
  "officeAddressExt": {
    "name": "Heisenware HQ",
    "address": "One Heisenware Way, Silicon Valley, CA 94043, USA",
    "streetName": "Heisenware Way",
    "streetNumber": "1",
    "city": "Silicon Valley",
    "state": "California",
    "country": "United States",
    "postcode": "94043",
    "placeId": "ChIJ...",
    "geoJson": {
      "type": "Point",
      "coordinates": [37.422, -122.084]
    }
  }
}
```
{% endhint %}

## Configuration

Configure the form's structure and appearance in the settings panel. Some of these properties can also be set dynamically at runtime through [data binding](./#configuration-and-data-binding).

### Style settings

These properties control the overall appearance and layout of the form.

| Label                                  | Description                                                                                     | Type    | Property                    |
| -------------------------------------- | ----------------------------------------------------------------------------------------------- | ------- | --------------------------- |
| **Column count**                       | Sets the number of columns used to arrange form items.                                          | String  | `colCount`                  |
| **Label location**                     | Specifies where to display field labels relative to the editors.                                | String  | `labelLocation`             |
| **Label mode**                         | Defines how labels are displayed. Options include `static`, `floating`, `hidden`, or `outside`. | String  | `labelMode`                 |
| **Show colon**                         | Adds a colon after each field label text if set to `true`.                                      | Boolean | `showColonAfterLabel`       |
| **Initially readonly**                 | Renders the entire form in a read-only state when it first loads.                               | Boolean | `initiallyReadOnly`         |
| **Trigger formData event on autofill** | If enabled, an `autoFill` command will also trigger a `formData` event.                         | Boolean | `triggerFormDataOnAutoFill` |

{% hint style="info" %}
The column count can be modified for each screen type separately, so different screens can have a different number of columns.

The other style settings are automatically set on all screens at once for consistency.
{% endhint %}

### Data settings

Define the structure and content of your form here: the fields, groups, and tabs.

**Form groups**

Organize your form into one or more groups. With multiple groups, you can optionally show them as tabs.

| Label                | Description                                                                                                       | Type   | Property    |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- | ------ | ----------- |
| **Group field name** | A unique name for the group. On submit, every field in this group nests under this name. | String | `dataField` |
| **Group label**      | A visible title displayed above the group of fields.                                                              | String | `label`     |
| **Tab label**        | Groups that share a `tabView` label render as tabs within a tab panel.              | String | `tabView`   |
| **Fields**           | An array of field objects that belong to this group.                                                              | Array  | `fields`    |

**Form fields**

Each item in the `fields` array defines an input editor in your form.

| Label           | Description                                                                                   | Type    | Property     |
| --------------- | --------------------------------------------------------------------------------------------- | ------- | ------------ |
| **Field name**  | A unique name for the field, used as the key in the form's data object. **Required**. | String  | `dataField`  |
| **Label**       | The text label displayed for the field editor.                                                | String  | `label`      |
| **Help text**   | Additional hint text displayed to guide the user.                                             | String  | `helpText`   |
| **Column span** | The number of columns the field should occupy within the form layout.                         | Integer | `colSpan`    |
| **Required**    | Marks the field as mandatory.                                                                 | Boolean | `isRequired` |
| **Disabled**    | Disables the field, preventing user interaction.                                              | Boolean | `disabled`   |
| **Read only**   | Makes the field read-only.                                                                    | Boolean | `readOnly`   |
| **Editor type** | The type of input editor to render. See the editor types section below for details.           | String  | `editor`     |

#### Editor types and options

The `editor` property sets the input control the user sees. Thirteen types are available:

<table><thead><tr><th width="267">Editor type</th><th>Data type</th></tr></thead><tbody><tr><td>Text box</td><td>string</td></tr><tr><td>Select box</td><td>string</td></tr><tr><td>Number box</td><td>number</td></tr><tr><td>Check box</td><td>bool</td></tr><tr><td>Password</td><td>string</td></tr><tr><td>Tag box</td><td>array</td></tr><tr><td>Date/time select</td><td>date</td></tr><tr><td>Color select</td><td>number (hexadecimal)</td></tr><tr><td>Location select</td><td>geojson</td></tr><tr><td>Radio group</td><td>string</td></tr><tr><td>Text area</td><td>string</td></tr><tr><td>Slider</td><td>number</td></tr><tr><td>Switch</td><td>bool</td></tr></tbody></table>

Each editor has its own set of specific configuration options.

**Text box (`text`)**

| Label                | Description                                                        | Type    | Property      |
| -------------------- | ------------------------------------------------------------------ | ------- | ------------- |
| **Use accent color** | If `true`, applies the theme's accent color to the editor's style. | Boolean | `accentColor` |

**Number box (`number`)**

| Label              | Description                                | Type    | Property        |
| ------------------ | ------------------------------------------ | ------- | --------------- |
| **Minimum**        | The minimum allowed value.                 | Number  | `min`           |
| **Maximum**        | The maximum allowed value.                 | Number  | `max`           |
| **Default value**  | The initial value of the editor.           | Number  | `defaultValue`  |
| **Prefix**         | A string to display before the number.     | String  | `prefix`        |
| **Suffix**         | A string to display after the number.      | String  | `suffix`        |
| **Show separator** | If `true`, displays a thousands separator. | Boolean | `showSeparator` |
| **Precision**      | The number of decimal places to allow.     | Number  | `precision`     |

**Slider (`slider`)**

| Label             | Description                            | Type   | Property       |
| ----------------- | -------------------------------------- | ------ | -------------- |
| **Minimum**       | The minimum value of the slider range. | Number | `min`          |
| **Maximum**       | The maximum value of the slider range. | Number | `max`          |
| **Default value** | The initial value of the slider.       | Number | `defaultValue` |
| **Step**          | The increment value for the slider.    | Number | `step`         |

**Select box (`select`), tag box (`tags`), radio group (`radioGroup`)**

| Label                     | Description                                                                             | Type    | Property             |
| ------------------------- | --------------------------------------------------------------------------------------- | ------- | -------------------- |
| **Options**               | A comma-separated list of options. For key-value pairs, use the format `display:value`. | String  | `options`            |
| **Default value**         | The initial selected value.                                                             | String  | `defaultValue`       |
| **Enable searching**      | (`select` only) Allows users to search through the options.                             | Boolean | `searchEnabled`      |
| **Show clear button**     | (`select` only) Shows a button to clear the selection.                                  | Boolean | `showClearButton`    |
| **Show drop down button** | (`select` only) Shows the dropdown arrow button.                                        | Boolean | `showDropDownButton` |
| **Layout**                | (`radioGroup` only) Arranges radio buttons `vertically` or `horizontally`.              | String  | `layout`             |

**Switch (`switch`)**

| Label                 | Description                            | Type                | Property          |
| --------------------- | -------------------------------------- | ------------------- | ----------------- |
| **Switched on text**  | Text displayed when the switch is ON.  | String              | `switchedOnText`  |
| **Switched off text** | Text displayed when the switch is OFF. | String              | `switchedOffText` |
| **Default value**     | The initial state of the switch.       | String (`on`/`off`) | `defaultValue`    |

**Date/time (`dateTime`)**

| Label         | Description                                                   | Type   | Property   |
| ------------- | ------------------------------------------------------------- | ------ | ---------- |
| **Date type** | The type of picker to display: `date`, `time`, or `datetime`. | String | `dateType` |

**Location (`location`)**

This editor uses the Google Maps Places API to provide address autocompletion.

| Property           | Description                                                                                               | Type   |
| ------------------ | --------------------------------------------------------------------------------------------------------- | ------ |
| **`locationType`** | The type of search to perform: `address` (for full addresses) or `establishment` (for places/businesses). | String |
