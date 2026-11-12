# Database editor

The Database editor lets you look into the workspace's databases: the rows of every table and the measurements of the timeseries database. For the workspace's own database, `internal-postgres`, it also shows and shapes the **data model**: the tables, their fields and keys, their audit logs and the relations between them.

Open it from the App Builder's top bar. Choose the database on the left; its tables are listed below it.

## Model and Rows

For the workspace's own database, a switch heads the editor:

* **Model**: every table as a card, with its fields and their types, and a line for every relation between two tables.
* **Rows**: the rows of the table selected on the left, to filter, sort, edit and export.

The data model belongs to the workspace, not to an App. Every App of the workspace reads and writes the same tables, so the model is kept inside the database itself, with a history of who changed what and when. Going back to an earlier version of an App never changes a table.

What changes a table's structure happens in the Model tab: making a table, duplicating it, deleting it. The Rows tab works with the rows: **Export** (CSV or SQL) and **Clear table**. Other databases have no Model tab and keep all of it in the list on the left.

{% hint style="info" %}
An external database (an ERP, a customer's SQL server) belongs to someone else. The Database editor shows its rows; its structure is shaped where it lives.
{% endhint %}

## The board

The Model tab moves like the [Flowboard](flowboard/README.md), under the same App Builder settings: the viewport controls, the grid, the WASD keys and the mini map.

* **F** fits the board, or the cards you selected. The toolbar at the top left zooms, fits and auto-formats; the mini map sits at the bottom right.
* A card you move stays where you put it, in this browser.
* A table without a place yet is placed for you: it stands right of the tables it links to, in an order where as few lines as possible cross, and the tables fill the shape of the board, so that as much as possible is visible without scrolling.
* **Auto-Format** places the selected cards anew, or every card when none is selected.

## Reading the model

* A card lists a table's fields. A key marks the primary key, `*` a field that must not stay empty. A table without a key of its own gets an `id` by itself, and every table records when a row was created and last changed; these fields are not listed.
* A line runs from the table that has the relation to the table it links to:
  * a solid line: **must have one** (`mandatorilyHasOne`): a row of orders must have one customer. Deleting the customer deletes its orders.
  * a dashed line: **may have one** (`optionallyHasOne`).
  * arrows at both ends: **may have many** (`optionallyHasMany`): a post may have many tags, a tag many posts.
* An icon on the card marks a table that keeps an audit log.

Click a card to open the table's panel.

## Shaping a table

To make a new table, use **New table** at the head of the Model tab. In a table's panel:

* **Add a field**: enter its name and choose its type. A new field is added to every row, empty.
* **Change a type**: click the field's type and choose the new one. Before anything changes, the editor tells what the change does to the values: which values the new type cannot take, with the rows that hold them (correct them first), and which values it changes on the way (`12.5` as an integer is `12`).
* **Relate to another table**: choose the sentence that is true, such as *A row of orders must have one row of customers*. A role (such as `payer`) names a second relation to the same table; a row of orders then carries its customer as `payer`.
* **Keep an audit log**: every change of a row is kept, with who made it. Once on, it stays on.
* **Duplicate the table**: a new table with the same fields and every row, under a name you choose. The copy keeps no relations: their columns come along as plain fields.
* **Used by**: the Apps whose functions name the table.
* **History**: every change of the table's shape, with who made it and when, and the statement when SQL made it.

## Removing

Removing a field, a relation or a table is for good: there is no bin. Before anything is removed, the editor tells what goes:

* a field: how many rows hold a value in it;
* a relation: how many rows it links;
* a table: its rows, its audit log, the relations of other tables that end, and the Apps that name the table.

Confirm only when that is what you want. **Delete the table** in its panel, or select its card and press Delete (Backspace on a Mac), opens the same question.

## Differences from the database

The model records every change made through Heisenware, SQL included: a statement through `executeSql` that makes, changes or drops a table goes into the model as *by SQL*, with the statement. A table, field or relation made another way, by SQL from elsewhere (another system, a database console), by an import or by an App built before the model was kept, is not in the model; one dropped that way is still in it. The Model tab marks these differences in copper and counts the tables that differ on its switch:

* a dashed copper card: a table the database holds and the model does not know, or one gone from the database;
* a copper dot: a field that differs.

**Adopt** makes the model take what the database holds: one table from its panel, or every differing table at once with the copper button at the head of the Model tab. The database stays as it is. This is also how the tables of an App built before the model was kept come into it.

## The whole database in and out

At the head of the Model tab, **Import** reads an SQL dump into the database, and **Export** saves every table as CSV or the whole database as an SQL dump.

## Tables travel with an App

When you export an App, its bundle (`.hwt`) carries the tables the App's functions name, with the tables they relate to. Importing the bundle into another workspace adds what is missing there: tables, fields and relations. It never removes or changes anything: where the workspace holds a field with another type, it keeps its own, and the import report says so.

## The assistant

The assistant reads and shapes the data model with the same steps: it reads the model before it designs tables, tells you what a removal or a type change would lose, and asks for your go before it removes anything.
