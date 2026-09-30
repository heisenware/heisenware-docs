---
description: >-
  Displays a single live value with number/date formatting and JSON tree rendering for objects
---

# Value Box

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/value-box. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties under Receives and Emits. Drop an executor's output, input or trigger onto a row to link it. An example also fills an unlinked widget as demo data in the App Builder.

{% tabs %}
{% tab title="Receives" %}
**`value`** (from an output, `any`): Accepts various data for display. Handles strings, numbers, objects and images.

<details>

<summary>Example</summary>

```json
42.7
```

</details>

**`clear`** (from an output, `any`): Truthy values clear the displayed value.

<details>

<summary>Example</summary>

```json
true
```

</details>

**`textColor`** (from an output, `string`): CSS color for the displayed text (overrides the configured color).

<details>

<summary>Example</summary>

```json
"#62a378"
```

</details>

{% endtab %}

{% tab title="Emits" %}
**`onClick`** (into an input): Writes the currently displayed value when the box is clicked. Exceptional use only - click semantics belong to buttons; a click that must carry a value is a button firing an executor whose input holds it.

**`onClick`** (fires a trigger): Triggers the linked executor when the box is clicked.

{% endtab %}

{% endtabs %}

## Settings

Double-click the widget in the Page editor to open its settings, grouped in these tabs. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

<details>

<summary>Look &amp; feel</summary>

* **Font size**: Font size of the shown value in px. Range 6 to 42. *Set per screen.*
* **Font weight**: Weight of the value text. Choices: Normal, Bold, Bolder.
* **Horizontal alignment**: Horizontal position of the value inside the box. Choices: Left, Center, Right.
* **Vertical alignment**: Vertical position of the value inside the box. Choices: Top, Middle, Bottom.
* **Text color**: Color of the value text; empty or auto keeps the theme's, a bound textColor overrides it.
* **Format**: Formats numbers and dates for display, with a number or a date format; empty shows the value as it is. Choices: Fixed point, Decimal, Currency, Percent, Large number, Thousands, Millions, Billions, Trillions, Exponential, Short date, Long date, Short time, Long time, Short date & time, Long date & time, Month & day, Month & year, Quarter & year, Day, Day of week, Month, Year, Quarter, Hour, Minute, Second, Millisecond.
* **Prefix**: Text put in front of the shown value; objects and images ignore it.
* **Suffix**: Text put after the shown value; objects and images ignore it.
* **Placeholder**: Text shown in gray italics while no value has arrived or after clear; an empty string from the backend shows an empty box.

</details>

<!-- /generated -->
