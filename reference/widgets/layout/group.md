---
description: >-
  Holds other widgets as one unit and repeats them as one tile per data row, binding row fields to member properties by member name; formed from placed widgets (group_widgets in the tools, Group in the builder), never created empty; groups nest
---

# Group

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/group. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties under Receives and Emits. Drop an executor's output, input or trigger onto a row to link it. An example also fills an unlinked widget as demo data in the App Builder.

{% tabs %}
{% tab title="Receives" %}
**`data`** (from an output, `Array<object> | object`): The rows to render: one tile (with the full set of child widgets) per row. A single object becomes one tile; the binding editor maps row fields to child properties. A row field may itself hold an **array of points** — bind it to a chart, sparkline or timeline child.

<details>

<summary>Example</summary>

```json
[
  {
    "name": "Pump A",
    "pressure": 2.4,
    "running": true,
    "status": "running",
    "history": [
      {
        "timestamp": "2026-08-12T10:00:00Z",
        "pressure": 2.2
      },
      {
        "timestamp": "2026-08-12T10:05:00Z",
        "pressure": 2.6
      },
      {
        "timestamp": "2026-08-12T10:10:00Z",
        "pressure": 2.4
      }
    ]
  },
  {
    "name": "Pump B",
    "pressure": 3.1,
    "running": false,
    "status": "idle",
    "history": [
      {
        "timestamp": "2026-08-12T10:00:00Z",
        "pressure": 3.4
      },
      {
        "timestamp": "2026-08-12T10:05:00Z",
        "pressure": 3
      },
      {
        "timestamp": "2026-08-12T10:10:00Z",
        "pressure": 2.9
      }
    ]
  }
]
```

</details>

{% endtab %}

{% tab title="Emits" %}
**`onChange`** (into an input, `object`): Writes the tile's row augmented with the changed child value whenever an input child changes.

<details>

<summary>Example</summary>

```json
{
  "index": 0,
  "name": "Pump A",
  "pressure": 2.4,
  "form1": {
    "value": 42
  }
}
```

</details>

**`onButtonClick`** (into an input, `object`): Writes an event envelope when a button child is clicked. Pending child input values of the same tile are merged in.

<details>

<summary>Example</summary>

```json
{
  "index": 0,
  "clickedBy": "button1",
  "buttonText": "Go",
  "name": "Pump A",
  "pressure": 2.4
}
```

</details>

**`onGroupClick`** (into an input, `object`): Writes the tile's row (plus pending child input values) when the tile is clicked.

<details>

<summary>Example</summary>

```json
{
  "index": 0,
  "name": "Pump A",
  "pressure": 2.4
}
```

</details>

{% endtab %}

{% endtabs %}

## Settings

Double-click the widget in the Page editor to open its settings, grouped in these tabs. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

<details>

<summary>Data binding</summary>

* **null**: Per member (by id), the row fields that feed its properties; set through the binding editor or set_group_bindings.

</details>

<details>

<summary>Look &amp; feel</summary>

* **Horizontal axis**: How the tiles line up left to right.
  * **Justification**: Where the tiles of a row sit across the width; left, center and right keep the spacing, the space variants spread the tiles over the width. Choices: Left, Center, Right, Space between, Space around, Space evenly. *Set per screen.*
  * **Spacing**: Margin in px on both sides of every tile, so neighbours sit twice this apart. Range 0 to 80. Only when Justification is Left, Center or Right.
* **Vertical axis**: How the rows of tiles stack top to bottom.
  * **Justification**: Where the rows of tiles sit down the height; top, center and bottom keep the spacing, the space variants spread the rows over the height. Choices: Top, Center, Bottom, Space between, Space around, Space evenly. *Set per screen.*
  * **Spacing**: Margin in px below every tile. Range 0 to 80. Only when Justification is Top, Center or Bottom.

</details>

## Good to know

* It holds other widgets and repeats them, one tile per data row.

<!-- /generated -->
