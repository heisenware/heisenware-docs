---
description: >-
  A table users read, edit, extend and clear from the App, with a toast on every write.
---

# CRUD with the data grid

A [data grid](../reference/widgets/display/data-grid.md) is the shortest way to let users work on a table. This lab wires one to a table of the workspace's own database so that a user can create, read, update and delete rows, and gets told each time whether the write worked.

The lab uses `maintenanceTasks` on the internal PostgreSQL database. Any table does, in the internal database or in an external SQL server you have connected.

## Make the table first

A table belongs to the workspace, not to an App, so it is not made by a function on the Flowboard. Open the [Database editor](../app-builder/database-editor.md) from the Builder's top bar, choose `internal-postgres`, and in the **Model** tab use **New table**:

| Field | Type |
| --- | --- |
| `title` | string |
| `machine` | string |
| `dueAt` | dateonly |
| `done` | boolean |

`id`, `createdAt` and `updatedAt` are added for you. Switch **Keep an audit log** on if you want every change recorded with who made it; once on it stays on.

{% hint style="info" %}
Do not build a `defineTable` executor for the internal database. The model then records the change with whatever the executor passes instead of with a login, and the Database editor is where the shape belongs. An external database belongs to someone else: read it, and shape it where it lives.
{% endhint %}

## The flow

Five executors of the [relational database](../reference/functions/storage/relational-database.md) class, on the instance `internal-postgres`, plus one widget.

{% stepper %}
{% step %}
#### Read the rows

Drag [`getTableData`](../reference/functions/storage/relational-database.md#gettabledata) onto the Flowboard and set its inputs:

```yaml
# name
maintenanceTasks
# options
order: [dueAt, ASC]
```

Click the trigger once so the executor holds rows while you build: the grid scans its columns from them.

Then give it a real impulse: right-click its trigger, **App Start** > **once on (re-)load**. A display that must show something the moment a user opens the App needs a source of its own. Nothing your Builder test produced reaches the deployed App. See [Reading data when the App opens](../concepts/triggers-and-wires.md#reading-data-when-the-app-opens).
{% endstep %}

{% step %}
#### Show them

Place a [data grid](../reference/widgets/display/data-grid.md) on the page, select it, and drag the output of `getTableData` onto it. The grid fills and its columns appear.

In the grid's settings, open **Data editing** and switch on what users may do: **Allow adding**, **Allow updating** and **Allow deleting**. **Mode** decides when an edit counts: `cell` saves each cell as it is left, `batch` collects the edits until the user saves them. A grid that allows nothing emits nothing.
{% endstep %}

{% step %}
#### Write what they change

The grid writes three values, one per kind of change. Link each to the input of the function that does the write, in the grid's **General** tab or by dragging the input onto the grid:

| Grid writes | Carries | Goes to |
| --- | --- | --- |
| `onInsert` | the new row | [`addRow`](../reference/functions/storage/relational-database.md#addrow), input `data` |
| `onChange` | the whole edited row, merged with the changed fields | [`updateRow`](../reference/functions/storage/relational-database.md#updaterow), input `data` |
| `onDelete` | the removed row's `id` | [`deleteRow`](../reference/functions/storage/relational-database.md#deleterow), input `id` |

Set the `table` input of all three to `maintenanceTasks`. `updateRow` finds its row by the primary key inside `data`, so it needs nothing else.

A widget that writes an input runs nothing by itself. Make each of those inputs hot: drag it onto its executor's trigger and leave the mode at *update*. Now every change a user makes runs its write.
{% endstep %}

{% step %}
#### Read again after a write

Wire the output of `addRow`, `updateRow` and `deleteRow` to the trigger of `getTableData`. The grid then shows what the database actually holds, with the server's defaults and `updatedAt` filled in, rather than what the user typed.
{% endstep %}

{% step %}
#### Tell the user

A toast is an [App action](../app-builder/explorers/pages.md#app-actions), not a widget. Drag the **Toast** chip from the foot of the Pages and actions explorer onto an output:

* **On the output of each write**, with the message you want (*Task saved*) and the type **Success**. Every truthy value the output produces pops one toast.
* **On an error handler**, for the failures. Add one to each write's output (**+** > **Error handler**), drop **Toast** on it, switch **Take message from the live value** on and set the type to **Error**. The toast then reads the failure as `message, because: cause`.

A failing call produces no output, so the success toast never fires on a failure, and the error handler is the only thing that hears about it. See [Error handler](../app-builder/flowboard/error-handler.md).
{% endstep %}
{% endstepper %}

Click **Test**, then work in the grid as a user would: add a row, edit a cell, delete a row. Check the result in the Database editor's **Rows** tab.

## What to change next

* **Fewer columns on the phone**: how many columns a grid shows and its font sizes are pinned per screen. See [Screens and layouts](../concepts/screens-and-layouts.md).
* **Only the rows that matter**: put a filter into `getTableData`'s `options`, fed by a widget, and make that input hot.
* **Who changed what**: with an audit log on, [`getAuditLog`](../reference/functions/storage/relational-database.md#getauditlog) answers the history of a row. Pass `$USER` as `actorId` on every write so the log names the person.

