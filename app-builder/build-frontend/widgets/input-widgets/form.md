# Form

The **Form** widget allows you to build dynamic, data-driven forms with a wide variety of input types.

You can configure the form's layout, create complex field groups, and connect it to your backend logic to handle data submission, validation, and dynamic updates in real-time.

<figure><img src="../../../../.gitbook/assets/add_form_widget_looped.gif" alt=""><figcaption></figcaption></figure>

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-05-20 at 15.42.53.png" alt="" width="332"><figcaption><p>A form with different editor types</p></figcaption></figure>

## Data Binding

Connect the widget to your application's logic by dragging the corresponding items from the Backend Builder.

### Input

_Drag an input element onto the widget_

| Property               | Type     | Description                                                                                                     |
| ---------------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| **`formData`**         | `Object` | Fired whenever any field's value changes. The payload is an object containing all current form data.            |
| **`validationResult`** | `Object` | Fired after a `validate` command. Contains `{ isValid, status, brokenRules }` detailing the validation outcome. |

### Output

_Drag an output or modifier element onto the widget_

| Property        | Type                | Description                                                                                                                                                                  |
| --------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`autoFill`**  | `Object`            | Pre-fills the form with the provided data object. The object structure should match the `dataField` names. Can be configured to not trigger an outgoing `formData` event.    |
| **`clear`**     | `Boolean`           | When `true`, clears all data from the form.                                                                                                                                  |
| **`validate`**  | `Boolean`           | When `true`, triggers the form's validation process.                                                                                                                         |
| **`readOnly`**  | `Boolean`           | Dynamically sets the entire form's read-only state.                                                                                                                          |
| **`options`**   | `Object`            | Dynamically provides options for `select`, `tags`, or `radioGroup` editors at runtime. The object keys should match the `dataField` of the target editor.                    |
| **`addFields`** | `Array` or `Object` | Dynamically adds new fields to the form. Can be an array of field objects for a single group or an object where keys are group `dataField`s and values are arrays of fields. |
| **`setFields`** | `Array` or `Object` | Replaces all existing fields with a new set. Can be an array of field objects for a single group or a full group structure object.                                           |

#### Autofilling the Form (`autoFill`)

To pre-fill or automatically fill the form, you need to provide a JSON object to the `autoFill` property. The structure of this object must mirror the structure of your form's configuration.

* **Keys**: The keys in your JSON object must match the `dataField` names you defined for each field in the configuration.
* **Nesting**: If you are using **Form Groups** and have assigned a `dataField` to a group, your JSON object should be nested accordingly. The group's `dataField` becomes a key for a nested object that contains the fields within that group.

**Example:**

Let's say you have a form with two groups, `personalInfo` and `addressInfo`.

**Configuration:**

* Group 1 `dataField`: `personalInfo`
  * Field `dataField`: `firstName`
  * Field `dataField`: `lastName`
* Group 2 `dataField`: `addressInfo`
  * Field `dataField`: `street`
  * Field `dataField`: `city`

The JSON object you would pass to `autoFill` or `formData` should look like this:

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

If your form doesn't use groups with `dataField`s, the object would be flat: `{ "firstName": "John", "lastName": "Doe" }`.

#### Setting Options at Runtime (`options`)

To dynamically populate a `select`, `tags`, or `radioGroup` editor, you provide a JSON object to the `options` property.

* **Keys**: The keys of this object must match the `dataField` of the specific editor you want to update.
* **Values**: The value for each key must be an **array** of options.

The options in the array can be in two formats:

1. **Simple Array of Strings**: Use this when the display text and the value are the same. `["Apple", "Banana", "Cherry"]`
2. **Array of Key-Value Pairs**: Use this when you need different text for display and for the submitted value. The format is `[ "Display Text", "value" ]`. `[ [ "New York", "NY" ], [ "California", "CA" ], [ "Texas", "TX" ] ]`

**Example:**

Imagine a form with a `state` selector and a `productTags` tag box.

**Configuration:**

* Field `dataField`: `state` (a `select` editor)
* Field `dataField`: `productTags` (a `tags` editor)

The JSON object you would pass to the `options` property to populate both would be:

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
Special Case: **Location Field Data**\
\
When using a `location` editor, a successful place selection will add an extended object to the `formData` payload. The standard field (`dataField`) will contain the formatted address string, while a second field with an `Ext` suffix (`dataFieldExt`) will contain a detailed object with properties like `name`, `address`, `city`, `postcode`, `country`, and `geoJson`.<br>

**Example `formData` payload for a location field named `officeAddress`:**<br>

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

### Style Settings

These properties control the overall appearance and layout of the form.

| Label                                  | Description                                                                                     | Type    | Property                    |
| -------------------------------------- | ----------------------------------------------------------------------------------------------- | ------- | --------------------------- |
| **Column Count**                       | Sets the number of columns used to arrange form items.                                          | String  | `colCount`                  |
| **Label Location**                     | Specifies where to display field labels relative to the editors.                                | String  | `labelLocation`             |
| **Label Mode**                         | Defines how labels are displayed. Options include `static`, `floating`, `hidden`, or `outside`. | String  | `labelMode`                 |
| **Show Colon**                         | Adds a colon after each field label text if set to `true`.                                      | Boolean | `showColonAfterLabel`       |
| **Initially Readonly**                 | Renders the entire form in a read-only state when it first loads.                               | Boolean | `initiallyReadOnly`         |
| **Trigger formData event on autofill** | If enabled, an `autoFill` command will also trigger a `formData` event.                         | Boolean | `triggerFormDataOnAutoFill` |

{% hint style="info" %}
The **Column Count** can be modified for each screen type separately, so different screens can have a different number of columns.

The other style settings are automatically set on all screens at once for consistency.
{% endhint %}

### Data Settings

This is where you define the structure and content of your form, including all the fields, groups, and tabs.

**Form Groups**

You can organize your form into one or more groups. If you define multiple groups, you can optionally display them as tabs.

| Label                | Description                                                                                                       | Type   | Property    |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- | ------ | ----------- |
| **Group Field Name** | A unique name for the group. When data is submitted, all fields within this group will be nested under this name. | String | `dataField` |
| **Group Label**      | A visible title displayed above the group of fields.                                                              | String | `label`     |
| **Tab Label**        | If multiple groups share the same `tabView` label, they will be rendered as tabs within a tab panel.              | String | `tabView`   |
| **Fields**           | An array of field objects that belong to this group.                                                              | Array  | `fields`    |

**Form Fields**

Each item in the `fields` array defines an input editor in your form.

| Label           | Description                                                                                   | Type    | Property     |
| --------------- | --------------------------------------------------------------------------------------------- | ------- | ------------ |
| **Field Name**  | A unique name for the field. This is used as the key in the form's data object. **Required**. | String  | `dataField`  |
| **Label**       | The text label displayed for the field editor.                                                | String  | `label`      |
| **Help Text**   | Additional hint text displayed to guide the user.                                             | String  | `helpText`   |
| **Column Span** | The number of columns the field should occupy within the form layout.                         | Integer | `colSpan`    |
| **Required**    | Marks the field as mandatory.                                                                 | Boolean | `isRequired` |
| **Disabled**    | Disables the field, preventing user interaction.                                              | Boolean | `disabled`   |
| **Read Only**   | Makes the field read-only.                                                                    | Boolean | `readOnly`   |
| **Editor Type** | The type of input editor to render. See the **Editor Types** section below for details.       | String  | `editor`     |

#### Editor Types & Options

The `editor` property determines the input control the user will see. There are 16 different types available:

<table><thead><tr><th width="267">Editor Type</th><th>Data type</th></tr></thead><tbody><tr><td>Text Box</td><td>string</td></tr><tr><td>Select Box</td><td>string</td></tr><tr><td>Number Box</td><td>number</td></tr><tr><td>Check Box</td><td>bool</td></tr><tr><td>Password</td><td>string</td></tr><tr><td>Tag Box</td><td>array</td></tr><tr><td>Date/Time Select</td><td>date</td></tr><tr><td>Color Select</td><td>number (hexadecimal)</td></tr><tr><td>Location Select</td><td>geojson</td></tr><tr><td>Radio Group</td><td>string</td></tr><tr><td>Text Area</td><td>string</td></tr><tr><td>Slider</td><td>number</td></tr><tr><td>Switch</td><td>bool</td></tr></tbody></table>

Each editor has its own set of specific configuration options.

**Text Box (`text`)**

| Label                | Description                                                        | Type    | Property      |
| -------------------- | ------------------------------------------------------------------ | ------- | ------------- |
| **Use Accent Color** | If `true`, applies the theme's accent color to the editor's style. | Boolean | `accentColor` |

**Number Box (`number`)**

| Label              | Description                                | Type    | Property        |
| ------------------ | ------------------------------------------ | ------- | --------------- |
| **Minimum**        | The minimum allowed value.                 | Number  | `min`           |
| **Maximum**        | The maximum allowed value.                 | Number  | `max`           |
| **Default Value**  | The initial value of the editor.           | Number  | `defaultValue`  |
| **Prefix**         | A string to display before the number.     | String  | `prefix`        |
| **Suffix**         | A string to display after the number.      | String  | `suffix`        |
| **Show Separator** | If `true`, displays a thousands separator. | Boolean | `showSeparator` |
| **Precision**      | The number of decimal places to allow.     | Number  | `precision`     |

**Slider (`slider`)**

| Label             | Description                            | Type   | Property       |
| ----------------- | -------------------------------------- | ------ | -------------- |
| **Minimum**       | The minimum value of the slider range. | Number | `min`          |
| **Maximum**       | The maximum value of the slider range. | Number | `max`          |
| **Default Value** | The initial value of the slider.       | Number | `defaultValue` |
| **Step**          | The increment value for the slider.    | Number | `step`         |

**Select Box (`select`), Tag Box (`tags`), Radio Group (`radioGroup`)**

| Label                     | Description                                                                             | Type    | Property             |
| ------------------------- | --------------------------------------------------------------------------------------- | ------- | -------------------- |
| **Options**               | A comma-separated list of options. For key-value pairs, use the format `display:value`. | String  | `options`            |
| **Default Value**         | The initial selected value.                                                             | String  | `defaultValue`       |
| **Enable Searching**      | (`select` only) Allows users to search through the options.                             | Boolean | `searchEnabled`      |
| **Show Clear Button**     | (`select` only) Shows a button to clear the selection.                                  | Boolean | `showClearButton`    |
| **Show Drop Down Button** | (`select` only) Shows the dropdown arrow button.                                        | Boolean | `showDropDownButton` |
| **Layout**                | (`radioGroup` only) Arranges radio buttons `vertically` or `horizontally`.              | String  | `layout`             |

**Switch (`switch`)**

| Label                 | Description                            | Type                | Property          |
| --------------------- | -------------------------------------- | ------------------- | ----------------- |
| **Switched On Text**  | Text displayed when the switch is ON.  | String              | `switchedOnText`  |
| **Switched Off Text** | Text displayed when the switch is OFF. | String              | `switchedOffText` |
| **Default Value**     | The initial state of the switch.       | String (`on`/`off`) | `defaultValue`    |

**Date/Time (`dateTime`)**

| Label         | Description                                                   | Type   | Property   |
| ------------- | ------------------------------------------------------------- | ------ | ---------- |
| **Date Type** | The type of picker to display: `date`, `time`, or `datetime`. | String | `dateType` |

**Location (`location`)**

This editor uses the Google Maps Places API to provide address autocompletion.

| Property           | Description                                                                                               | Type   |
| ------------------ | --------------------------------------------------------------------------------------------------------- | ------ |
| **`locationType`** | The type of search to perform: `address` (for full addresses) or `establishment` (for places/businesses). | String |

