---
description: >-
  Everything an App built on an older version has to change in v93, and how to find the places that need it.
---

# What older Apps must change

An App built on v92 keeps running in v93, and the platform converts what it can by itself. What it cannot convert is on this page: one entry per change, what it **was** and what it **is now**.

You do not have to read it. Ask the assistant, or your own AI client, to check the App:

> Check this App for what v93 changed.

It applies the same list to that App's records and names the executors, modifiers, triggers, inputs and widgets that have to change. The App Builder says in one line that an App leans on something older, so you find out without asking.

{% hint style="info" %}
Change a place only where it leans on the old behavior. Most entries describe something that still exists and only behaves differently, so an App built today may use it quite correctly.
{% endhint %}

Some changes cannot be seen in an App's records at all, because nothing in them says which behavior the App expected. Those are marked, and they are the ones worth reading even when the check comes back clean.

The platform side of an upgrade, the installation itself, is in [Upgrading from v92](../self-hosting/upgrading-from-v92.md). What is new in v93, rather than changed, is in the [release note](../release-notes/v93-blue-meth.md).

<!-- generated -->
<!-- Source: heisenware-cloud/mcp/src/core/migrationRules.json.
     Regenerate with scripts/reference/migrations.mjs; edit outside this block only. -->

## Flows, triggers and values

* **Was:** A filter's value was its verdict, true or false.
  **Now:** Its value is what it lets through; the verdict is `passed`.

* **Was:** A trigger source on a filter fired on every evaluation, false included, and `onChange` when the verdict flipped.
  **Now:** It fires on a pass only. An edge that must hear "became false" hangs on a modifier with the same expression.

* **Was:** A user's values were kept for good.
  **Now:** They are dropped 3 hours after the user's browser left, and at a backend restart.
  *The records cannot show this one: check it yourself.*

* **Was:** `onChange` compared a user's first value with the shared one.
  **Now:** It compares per user: a user's first value is a change, the target runs once more per new user.
  *The records cannot show this one: check it yourself.*

* **Was:** `$USER` in a modifier or filter was spliced in as text, so it was written quoted (`x.owner === "$USER"`).
  **Now:** It is a binding: bare `$USER`; the quoted one stays the text.

* **Was:** `$USER` in a static value was replaced wherever the letters stood, object keys included, and stayed as it was without a user.
  **Now:** It is a token only (`$USER`, `${USER}`; `$USERS` stays text), in values only, and `null` without a user.

* **Was:** A trigger's "Delay by 0.1 s ... 2 s".
  **Now:** An import drops it: set the delay on the trigger source that should wait.
  *The records cannot show this one: check it yourself.*

* **Was:** The Trigger node's value reached only the tab that clicked.
  **Now:** It reaches every tab of the user. A page or action meant for the clicking tab goes on the button itself.

* **Was:** An error handler's payload was `{ message, cause }`, `cause` as the function threw it.
  **Now:** It is `{ message, cause, originalPayload }`, `cause` the reason as text: a modifier that read into it (`x.cause.code`) reads `x.originalPayload.cause`.

* **Was:** The tablet screens were 768x1024 and 1024x768.
  **Now:** They are 800x1280 and 1280x800; an import centres a v92 tablet layout on them.
  *The records cannot show this one: check it yourself.*

## Widgets and pages

* **Was:** Data grid, list and tiles sent `onUpdate` beside `onChange` and `onDelete`.
  **Now:** `onChange` carries the whole row, `onDelete` the key; `onUpdate` is gone: bind `onChange`.

* **Was:** A form wrote `formData` on every change.
  **Now:** `formData` goes out 1 s after the last keystroke; once per entry is `submitted`.

* **Was:** Dates came from form, grid, list and tiles as timestamps.
  **Now:** They come as a calendar date `2026-10-01`, an instant `2026-10-01T06:30:00Z` or a time of day `08:30:00`, never a raw timestamp.
  *The records cannot show this one: check it yourself.*

* **Was:** A nested field was named with a dash (`address-street`): a form's and a grid's events, a chart's series.
  **Now:** A nested field is named by dot (`address.street`); a dash is a plain character.

* **Was:** In a timeline a null value carried a block on; tracks were drawn bottom-up.
  **Now:** A null value ends a block; the first track is the top row.

* **Was:** A widget framed itself as a tile (`viewAsTile`).
  **Now:** A Card behind the widget frames it; an import drops the setting.
  *The records cannot show this one: check it yourself.*

* **Was:** The top bar.
  **Now:** A sticky group of a Card, a Text and a Button with the Logout action; an import drops the bar.
  *The records cannot show this one: check it yourself.*

* **Was:** A v92 App carried its icon.
  **Now:** An import leaves it out: set the icon once more (`set_app_identity`).
  *The records cannot show this one: check it yourself.*

* **Was:** `autoTranslate`, `supportedLanguages`, a widget's `translate` list and its props per language.
  **Now:** An import drops them: one App speaks one language (`props.locale`), another language is a translated copy.
  *The records cannot show this one: check it yourself.*

## Databases

* **Was:** `autoUpsertRow` and `autoAddRows` made the table as they wrote.
  **Now:** Declare the table (`define_table`), then `upsertRow` / `addRows`.

* **Was:** `changeRow(table, id, data)`.
  **Now:** `updateRow(table, data, { id })`.

* **Was:** `patchRow`.
  **Now:** `updateRow` with `merge: true`.

* **Was:** `findOne`.
  **Now:** `findRow`.

* **Was:** `getHistoricalData` and the table option `trackHistory` kept and read a history.
  **Now:** A table's `auditLog` keeps it (`define_table`), `getAuditLog` reads it.

* **Was:** `autoJoin` joined related rows.
  **Now:** `include` names what to join. A row carries what it points to by the relation's name (`order.customer`), children only when `include` names them (`customer.orders`); wires reading joined rows take those names.

* **Was:** `getTableData`, `getHistoricalData` and `executeSql` took `locale`, `dateStyle` and `timeStyle` and answered dates as text.
  **Now:** Dates come as data, widgets format them in the viewer's zone; the options are gone (an import removes them from an options object).

* **Was:** `executeSql` answered rows for a statement starting with SELECT and `[results, metadata]` for any other read (WITH ...).
  **Now:** It answers the rows of every read: drop the `[0]`.

* **Was:** A filter, `fields` or `order` went into the SQL as written.
  **Now:** Each names a column, else `Unknown field`.
  *The records cannot show this one: check it yourself.*

* **Was:** The workspace's database was Postgres 11: `EXTRACT(field FROM ...)` answered a floating-point number.
  **Now:** It is Postgres 18: `EXTRACT` answers an exact numeric, which `executeSql` answers as text and `read` as a number up to 15 digits. `date_part('field', ...)` answers the number.

* **Was:** `onChange` heard the writes of the platform's row functions.
  **Now:** On PostgreSQL it calls once per row, for every write: a bulk insert and SQL included.

* **Was:** `ssl: true` did nothing.
  **Now:** `ssl: true` encrypts and wants a certificate the system or the workspace trusts (Trusted Certificates); omitted, the database decides.

* **Was:** A relation without a role named its parent by cutting one `s` (`batches`: `batche`, `batcheId`).
  **Now:** The English singular (`batch`, `batchId`). An App that declares such a relation again gets a second column.

## Time series

* **Was:** A recorder tagged every point with its App (`app`).
  **Now:** Points carry no `app` tag.
  *The records cannot show this one: check it yourself.*

* **Was:** A numeric `timestamp` was read as nanoseconds.
  **Now:** A numeric `timestamp` is epoch milliseconds.
  *The records cannot show this one: check it yourself.*

* **Was:** Connecting an Influx created Heisenware's storage tiers in it.
  **Now:** An Influx the workspace connected is written only with `ladder: true` or after `adoptLadder()`; without them it is read as it is.

## Files

* **Was:** An upload or photo widget that holds one file (`restrictions.maxFiles`, `maxPhotos` 1, the default) wrote a list of one, an empty list when cleared.
  **Now:** It writes the file's entry, nothing once it is empty: drop the `[0]` where its value is read. A widget that holds several writes a list.

* **Was:** A file was `{ name, type, path }`, a path in runtime-files, or carried `base64` of any size.
  **Now:** A file is an entry: a reference `{ id, name, type, size }`, or content up to 64 kB. Stored rows are converted; a flow that read `path` hands the entry on.
  *The records cannot show this one: check it yourself.*

* **Was:** A signature widget wrote a base64 string.
  **Now:** It writes an entry; the string is its `base64`.

* **Was:** A `file` field held any shape, a list included.
  **Now:** A `file` field holds one file, a `files` field a list; `changeFieldType` converts between the two.
  *The records cannot show this one: check it yourself.*

* **Was:** `upsertRow` wrote a row's file content into runtime-files.
  **Now:** It writes no file: a file a flow produced goes to the store with `Files.store`, the row keeps its entry.
  *The records cannot show this one: check it yourself.*

* **Was:** A user of an App read the whole file server, uploaded and deleted on it.
  **Now:** A user reads runtime-files/, uploads into the file store and deletes nothing. A flow that showed a user a file from another folder moves it.
  *The records cannot show this one: check it yourself.*

## Utility functions

* **Was:** `CircularBuffer`.
  **Now:** `Buffer`.

* **Was:** `SiloSimulator`.
  **Now:** `SignalSimulator` with preset `silo`.

* **Was:** DataStore `push`, `pop`, `length`, `update(data, where)`, `indexOf`, `includes`.
  **Now:** `pushBack`, `popBack`, `getSize`, `update(where, fields)`; select by condition (`find`, `filter`) for `indexOf` and `includes`.

* **Was:** `accumulate(value)` took any value.
  **Now:** Accumulator takes an object of fields only.

* **Was:** `offX`, `removeListener`, `removeAllListeners` (`removeListeners`) ended listening.
  **Now:** They are gone: listening ends at the executor.

* **Was:** Timer `start`, Stopwatch `start` and `stop` answered nothing and took any input.
  **Now:** They answer a state or a boolean; invalid input fails.

## Connectors

* **Was:** Http `post`, `put`, `patch`, `delete`, `head`, `options` answered the raw response; unknown options passed.
  **Now:** Every verb but `get` answers `{ status, statusText, headers, data }`; unknown options are refused.

* **Was:** `readVariable` answered nothing for an unknown node.
  **Now:** It fails on an unknown node; a list of addresses answers `[{ address, nodeId, value }]`.

* **Was:** Email `send` answered nothing when the email did not go out - login refused, server not reachable, recipient refused - and its output fired as if sent.
  **Now:** It fails naming why, so its error handler runs and its output does not fire; with one recipient of several refused it fails too, the others got the email. `canCommunicate` checks the login without sending.

* **Was:** `readAllItems` asked the PLC without looking at the connection.
  **Now:** It needs a connection first; a bad item stands as `'BAD 255'`.

* **Was:** A text read handed its options to textract.
  **Now:** It takes four options - `preserveLineBreaks`, `preserveOnlyMultipleLineBreaks`, `includeAltText`, `typeOverride` - and refuses any other.

* **Was:** An unknown `securityMode` or `securityPolicy` (the once documented `'unauthorized'`) was ignored.
  **Now:** It fails at creation: `None`, or a mode and a policy the server offers.

* **Was:** GpioCounter `onCount`, `onStateChange`, `getCount`, `getState`.
  **Now:** `onEvent`, `getEvents`, `getData`.

* **Was:** The OPC UA server of v92.
  **Now:** It changed throughout: rebuild each call from `describe_class OpcuaServer`.

* **Was:** The MIP connector of v92.
  **Now:** It changed throughout: rebuild each call from `describe_class Mip`.

* **Was:** The SensorThings connector.
  **Now:** It is gone.

* **Was:** The Process Simulations extension (`EnergySimulator`, `SiloSimulator`).
  **Now:** It is no longer offered: `SignalSimulator` with a preset (`energyMeter`, `silo`, `cncMachine`).

<!-- /generated -->
