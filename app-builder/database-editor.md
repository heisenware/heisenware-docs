# Database editor

The Database editor lets you look into the workspace's databases: the rows of every table and the measurements of the time-series database. For the workspace's own database, `internal-postgres`, it also shows and shapes the **data model**: the tables, their fields and keys, their audit logs and the relations between them.

It belongs to the workspace, not to an App. Open it from the App Builder's top bar inside any App, or from the App Manager's **Databases** screen, which lists the workspace's databases and opens the editor on the one you pick - in a new browser tab, with no App, a slim bar naming the workspace and a way back to the Manager.

## Choosing a database

The **Databases** panel on the left picks the database, from the top down:

* **Source**: **Storage**, the databases of the platform, or **Native agents**, a database on an agent in your own network.
* **Storage type**: **Relational database** or **Timeseries database**.
* **Instance**: which one. `internal-postgres` and `internal-influx` are the workspace's own.

Below the selectors stand the tables, or the measurements of a time-series database. Each carries a menu of its own, for its info, a duplicate, an export, clearing it or deleting it. A table the platform keeps itself, an audit log or the record of the data model, is read only. Drag the panel's edge to widen it.

## Model and Rows

For a database that keeps a data model, a switch heads the editor, which opens on **Model**:

* **Model**: every table as a card, with its fields and their types, and a line for every relation between two tables.
* **Rows**: the rows of the table selected on the left, to filter, sort, edit and export.

The data model belongs to the workspace, not to an App. Every App of the workspace reads and writes the same tables, so the model is kept inside the database itself, with a history of who changed what and when. Going back to an earlier version of an App never changes a table.

What changes a table's structure happens in the Model tab: making a table, duplicating it, deleting it. The Rows tab works with the rows: **Export data** (CSV or SQL) and **Clear table**. A relational database that keeps no model, such as one on a native agent, has no Model tab and keeps all of it in the list on the left.

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

The icons beside the **Databases** title work on the database as a whole: **Download all tables as CSV**, **Export SQL dump** and **Import SQL dump**.

## A time-series database

A time-series database has the same two views, with its own content.

**Model** shows the shape of the database, which you do not edit here:

* **How downsampled points are kept**: the storage tiers, one per resolution. A recorder set to *Downsampled* writes every point into the first tier; each tier after it keeps the mean, minimum, maximum and count of a window, and keeps them longer. The other recorder settings keep every point for the time they name. A database that is only read shows **Its buckets** instead, with what each one keeps.
* **Measurements**: one card per measurement, with how many rows it holds, where it is kept, its fields and its tags, and the Apps that use it. Click a card for the full picture: the field types, the tag values, the span its points cover and who writes it. Nothing there is edited: a field's type is fixed by its first point, and a tag changes only by writing every point again.

**Rows** reads the points of the selected measurement: a **Time range** from the last five minutes to the last year, or a **From** and **To** of your own, and a toggle between the table and a chart of the series. **Write point** adds one by hand, **Edit row** and **Delete row** work on what you selected.

The reads are deliberately small, so that a look into a database never takes the server down: the editor opens on the last hour, stops a query after 30 seconds or 10,000 rows, and thins a chart to about 2,000 points.

The icons beside the **Databases** title export the selected measurement as CSV, back up all time-series data, or restore it.

{% hint style="info" %}
A database that does not hold Heisenware's storage tiers is read as it is, and nothing is written into it. **Use Heisenware's storage tiers here…** at the head of the Model view creates them, after a question.
{% endhint %}

## Tables travel with an App

When you export an App, its bundle (`.hwt`) carries the tables the App's functions name, with the tables they relate to. Importing the bundle into another workspace adds what is missing there: tables, fields and relations. It never removes or changes anything: where the workspace holds a field with another type, it keeps its own, and the import report says so.

## The assistant

The assistant reads and shapes the data model with the same steps: it reads the model before it designs tables, tells you what a removal or a type change would lose, and asks for your go before it removes anything.
