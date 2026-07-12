# Form

The form widget lets you build dynamic, data-driven forms with a wide variety of input types. Configure the layout, create complex field groups, and connect it to your backend logic to handle submission, validation, and live updates.

<figure><img src="../../../../.gitbook/assets/Screenshot 2025-05-20 at 15.42.53.png" alt="" width="332"><figcaption><p>A form with different editor types</p></figcaption></figure>

## Data binding

### Widget to function input

| Property               | Description                                                                                                     | Type     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- | -------- |
| `formData`         | Fires whenever any field's value changes. The payload is an object holding all current form data.               | object |
| `validationResult` | Fires after a `validate` command. Contains `{ isValid, status, brokenRules }` describing the validation outcome. | object |

### Function output to widget

| Property        | Description                                                                                                                                                                  | Type                |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `autoFill`  | Pre-fills the form with the provided data object. The structure should match the `dataField` names. Can be set not to trigger an outgoing `formData` event.                 | object            |
| `clear`     | When `true`, clears all data from the form.                                                                                                                                  | boolean           |
| `validate`  | When `true`, triggers the form's validation.                                                                                                                                 | boolean           |
| `readOnly`  | Sets the entire form's read-only state.                                                                                                                                      | boolean           |
| `options`   | Provides options for `select`, `tags`, or `radioGroup` editors at runtime. The object keys should match the `dataField` of the target editor.                                | object            |
| `addFields` | Adds new fields to the form. An array of field objects for a single group, or an object whose keys are group `dataField`s and values are arrays of fields.                   | array or object |
| `setFields` | Replaces all existing fields with a new set. An array of field objects for a single group, or a full group-structure object.                                                 | array or object |

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

### Style settings

These properties control the overall appearance and layout of the form.

| Property                    | Label                                  | Description                                                                                     | Type    |
|---|---|---|---|
| `colCount`                  | Column count                       | number of columns arranging the form items.                                          | string  |
| `labelLocation`             | Label location                     | Where field labels sit relative to the editors.                                | string  |
| `labelMode`                 | Label mode                         | How labels display (`static`, `floating`, `hidden`, `outside`). | string  |
| `showColonAfterLabel`       | Show colon                         | If `true`, adds a colon after each field label.                                      | boolean |
| `initiallyReadOnly`         | Initially readonly                 | Renders the whole form read-only when it first loads.                               | boolean |
| `triggerFormDataOnAutoFill` | Trigger formData event on autofill | If enabled, an `autoFill` command will also trigger a `formData` event.                         | boolean |

{% hint style="info" %}
The column count can be modified for each screen type separately, so different screens can have a different number of columns.

The other style settings are automatically set on all screens at once for consistency.
{% endhint %}

### Data settings

Define the structure and content of your form here: the fields, groups, and tabs.

**Form groups**

Organize your form into one or more groups. With multiple groups, you can optionally show them as tabs.

| Property    | Label                | Description                                                                                                       | Type   |
|---|---|---|---|
| `dataField` | Group field name | A unique name for the group. On submit, every field in this group nests under this name. | string |
| `label`     | Group label      | A visible title displayed above the group of fields.                                                              | string |
| `tabView`   | Tab label        | Groups that share a `tabView` label render as tabs within a tab panel.              | string |
| `fields`    | Fields           | An array of field objects that belong to this group.                                                              | array  |

**Form fields**

Each item in the `fields` array defines an input editor in your form.

| Property     | Label           | Description                                                                                   | Type    |
|---|---|---|---|
| `dataField`  | Field name  | A unique name for the field, used as the key in the form's data object. Required. | string  |
| `label`      | Label       | The text label displayed for the field editor.                                                | string  |
| `helpText`   | Help text   | Hint text to guide the user.                                             | string  |
| `colSpan` | Column span | number of columns the field occupies in the layout.                         | integer |
| `isRequired` | Required    | Marks the field as mandatory.                                                                 | boolean |
| `disabled`   | Disabled    | Disables the field, preventing user interaction.                                              | boolean |
| `readOnly`   | Read only   | Makes the field read-only.                                                                    | boolean |
| `editor` | Editor type | The input editor to render. See the editor types below.           | string  |

#### Editor types and options

The `editor` property sets the input control the user sees. Thirteen types are available:

<table><thead><tr><th width="267">Editor type</th><th>Type</th></tr></thead><tbody><tr><td>Text box</td><td>string</td></tr><tr><td>Select box</td><td>string</td></tr><tr><td>Number box</td><td>number</td></tr><tr><td>Check box</td><td>bool</td></tr><tr><td>Password</td><td>string</td></tr><tr><td>Tag box</td><td>array</td></tr><tr><td>Date/time select</td><td>date</td></tr><tr><td>Color select</td><td>number (hexadecimal)</td></tr><tr><td>Location select</td><td>geojson</td></tr><tr><td>Radio group</td><td>string</td></tr><tr><td>Text area</td><td>string</td></tr><tr><td>Slider</td><td>number</td></tr><tr><td>Switch</td><td>bool</td></tr></tbody></table>

Each editor has its own set of specific configuration options.

**Text box (`text`)**

| Property      | Label                | Description                                                        | Type    |
|---|---|---|---|
| `accentColor` | Use accent color | If `true`, applies the theme's accent color to the editor's style. | boolean |

**Number box (`number`)**

| Property        | Label              | Description                                | Type    |
|---|---|---|---|
| `min`           | Minimum        | The minimum allowed value.                 | number  |
| `max`           | Maximum        | The maximum allowed value.                 | number  |
| `defaultValue`  | Default value  | The initial value of the editor.           | number  |
| `prefix`        | Prefix         | A string to display before the number.     | string  |
| `suffix`        | Suffix         | A string to display after the number.      | string  |
| `showSeparator` | Show separator | If `true`, displays a thousands separator. | boolean |
| `precision`     | Precision      | The number of decimal places to allow.     | number  |

**Slider (`slider`)**

| Property       | Label             | Description                            | Type   |
|---|---|---|---|
| `min`          | Minimum       | The minimum value of the slider range. | number |
| `max`          | Maximum       | The maximum value of the slider range. | number |
| `defaultValue` | Default value | The initial value of the slider.       | number |
| `step`         | Step          | The increment value for the slider.    | number |

**Select box (`select`), tag box (`tags`), radio group (`radioGroup`)**

| Property             | Label                     | Description                                                                             | Type    |
|---|---|---|---|
| `options`            | Options               | A comma-separated list of options. For key-value pairs, use the format `display:value`. | string  |
| `defaultValue`       | Default value         | The initial selected value.                                                             | string  |
| `searchEnabled`      | Enable searching      | (`select` only) Allows users to search through the options.                             | boolean |
| `showClearButton`    | Show clear button     | (`select` only) Shows a button to clear the selection.                                  | boolean |
| `showDropDownButton` | Show drop down button | (`select` only) Shows the dropdown arrow button.                                        | boolean |
| `layout`             | Layout                | (`radioGroup` only) Arranges radio buttons `vertically` or `horizontally`.              | string  |

**Switch (`switch`)**

| Property          | Label                 | Description                            | Type                |
|---|---|---|---|
| `switchedOnText`  | Switched on text  | Text displayed when the switch is on.  | string              |
| `switchedOffText` | Switched off text | Text displayed when the switch is off. | string              |
| `defaultValue`    | Default value     | The initial state of the switch.       | string (`on`/`off`) |

**Date/time (`dateTime`)**

| Property   | Label         | Description                                                   | Type   |
|---|---|---|---|
| `dateType` | date type | The type of picker to display: `date`, `time`, or `datetime`. | string |

**Location (`location`)**

This editor uses the Google Maps Places API to provide address autocompletion.

| Property           | Description                                                                                               | Type   |
| ------------------ | --------------------------------------------------------------------------------------------------------- | ------ |
| `locationType` | The type of search to perform: `address` (for full addresses) or `establishment` (for places/businesses). | string |
