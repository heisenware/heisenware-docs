---
description: >-
  Fires the linked executor, switches pages or runs an app action on click, with optional confirm dialog and busy spinner
---

# Button

<!-- generated -->
<!-- Source: heisenware-cloud/packages/widgets/button. Regenerate with scripts/reference/widgets.mjs; edit outside this block only. -->

## Properties

The widget's General tab lists these properties. Drop an executor's output, input or trigger onto a row to link it.

### Receives

| Property | Linked to | Value | What it does |
|---|---|---|---|
| `disable` | output | `any` | When truthy, the button gets disabled. Falsy values are ignored. |
| `enable` | output | `any` | When truthy, the button gets enabled. Falsy values are ignored. |
| `toggle` | output | `any` | When truthy, the button is enabled, when falsy it is disabled. |
| `disabled` | output | `any` | When truthy, the button is disabled, when falsy it is enabled. |
| `done` | output | `any` | When linked, the button plays a loading animation until a value update is received. |
| `text` | output | `string` | The button's text. |
| `fontSize` | output | `integer` | The size of the button's text. |
| `iconSize` | output | `integer` | The size of the button's icon. |
| `type` | output | `'default'\|'normal'\|'success'\|'danger'` | The type of the button. |
| `stylingMode` | output | `'text'\|'contained'\|'outlined'` | The styling mode of the button. |
| `color` | output | `string` | Any valid CSS color for the button (overrides the configured color); `auto` restores the color the type gives. |

### Emits

| Property | Linked to | What it does |
|---|---|---|
| `onClick` | input | Fires the linked executor when the button is clicked (no value is written). |
| `onClick` | trigger | Triggers the linked executor when the button is clicked. |
| `onClick` | page | Switches to the linked page when the button is clicked. |
| `onClick` | App action | Runs the linked app action (logout, reload, back) when the button is clicked. |

### Example values

The same values fill an unlinked widget as demo data in the App Builder.

<details>

<summary><code>disable</code></summary>

```json
true
```

</details>

<details>

<summary><code>enable</code></summary>

```json
true
```

</details>

<details>

<summary><code>toggle</code></summary>

```json
true
```

</details>

<details>

<summary><code>disabled</code></summary>

```json
true
```

</details>

<details>

<summary><code>done</code></summary>

```json
true
```

</details>

<details>

<summary><code>text</code></summary>

```json
"Start pump"
```

</details>

<details>

<summary><code>fontSize</code></summary>

```json
16
```

</details>

<details>

<summary><code>iconSize</code></summary>

```json
22
```

</details>

<details>

<summary><code>type</code></summary>

```json
"success"
```

</details>

<details>

<summary><code>stylingMode</code></summary>

```json
"outlined"
```

</details>

<details>

<summary><code>color</code></summary>

```json
"#dc2828"
```

</details>

## Settings

Double-click the widget in the Page editor to open its settings. Settings marked *set per screen* are pinned by nature: every screen keeps its own value.

### Look & feel

| Setting | What it does | Default |
|---|---|---|
| Button text | Label shown on the button; empty shows only the icon. An input link receives it on click. | `Trigger` |
| Icon | Font Awesome class of an icon shown left of the label, e.g. fa-light fa-play; empty shows none. |  |
| Font size | Font size of the label in px. Range 14 to 100. *Set per screen.* | `14` |
| Icon size | Size of the icon in px. Range 20 to 100. *Set per screen.* | `20` |
| Type | Color scheme: default accent, normal neutral, success green, danger red; transparent makes it an invisible click area. Choices: `default`, `normal`, `success`, `danger`, `transparent`. | `default` |
| Styling mode | Contained fills the button with its color, outlined draws only a border, text shows the label alone; transparent ignores it. Choices: `text`, `contained`, `outlined`. | `contained` |
| Color | Custom button color; auto keeps the color the type gives. | automatic |
| Hover text | Tooltip shown while the pointer rests on the button; empty shows none. |  |
| Initially disabled | Starts the button greyed out and unclickable until a bound enable, toggle or disabled value changes it. | off |
| Requires confirmation | Asks for confirmation in a dialog before the click fires; cancelling does nothing. | off |
| Confirmation title | Heading of the confirmation dialog; empty shows none. Only when Requires confirmation is on. |  |
| Confirmation text | Question shown in the confirmation dialog. Only when Requires confirmation is on. |  |

## Good to know

* Drag a page or an App action from the Pages and actions explorer onto it to run it on click.

<!-- /generated -->
