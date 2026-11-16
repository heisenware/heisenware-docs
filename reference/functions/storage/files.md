---
description: >-
  The workspace's file store: the entry a row keeps, and how a flow hands over a file it produced.
---

# Files

The workspace keeps the files its rows point to in one **file store**, behind the Media Server. A row never holds a file's bytes and never a path. It holds an **entry**: a reference `{ id, name, type, size }` into the store, or, for something small, the content itself as `{ name, type, size, base64 }`.

The `id` is calculated from the file's content, so the same content is stored once however often it is uploaded, and a file never changes under its id. The [upload](../../widgets/input/upload.md), [photo](../../widgets/input/photo.md) and [signature](../../widgets/input/signature.md) widgets deliver entries by themselves, and every function that takes a path takes an entry too: an [email](../connectors/email.md) attachment, an [HTTP](../connectors/http-rest.md) upload, a [file read](../connectors/file-i-o.md), a [PDF merge](../utilities/pdf-processing.md). A flow needs `store` only for a file it produced itself: a document it downloaded, a PDF it generated, a CSV it wrote on the volume.

These functions need no instance. The class name is `Files`, on the agent **Media Server**. The Media Server is the platform's own agent, so the Functions explorer lists it only when **Debug Backend** is on under the App Builder's developer settings. The usual way to such an executor is to ask the assistant for it.

See [Files, data and dates](../../../concepts/files-data-and-dates.md) for the whole picture, and [Files in a table](relational-database.md#files-in-a-table) for the `file` and `files` field types.

## Handing over a file

### `store`

Takes a file into the file store and answers its reference, which is what a row keeps in a `file` field. Hand over a file that lies on the shared volume by its `path`, and one that lies nowhere as `base64` content.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>file</code></td><td><code>path</code></td><td>Where the file lies on the volume, as <code>/shared/runtime-files/report.pdf</code> or <code>runtime-files/report.pdf</code>. Only the folders a member or an App writes are read: <code>uploads</code>, <code>project</code>, <code>runtime-files</code>, <code>data-backups</code> and <code>reports</code>. The file stays where it is.</td><td>string</td></tr><tr><td></td><td><code>base64</code></td><td>The file's content, for a file that lies nowhere. At most 15 MB, as for everything the bus carries; write a larger file to the volume and name its path.</td><td>string</td></tr><tr><td></td><td><code>name</code></td><td>The file's name. A file on the volume keeps its own by default.</td><td>string</td></tr><tr><td></td><td><code>type</code></td><td>Its type where the content does not show it, such as <code>text/csv</code>.</td><td>string</td></tr><tr><td></td><td><code>app</code></td><td>The App the file comes from, for the file's label.</td><td>string</td></tr><tr><td></td><td><code>by</code></td><td>Who brings it, for the file's label.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# file
path: runtime-files/shift-report.pdf
type: application/pdf
app: Packaging line 2
by: $USER
```

#### Output

Returns the reference. Store it in the row's `file` field as it is.

```json
{
  "id": "9f2c81d0b7a44e63a1c5d2e8f0b3a6c7d9e1f2a3b4c5d6e7f8a9b0c1d2e3e41a",
  "name": "shift-report.pdf",
  "type": "application/pdf",
  "size": 48213
}
```

## Looking at a file

### `describe`

What the store knows about a file: its type and size as the store read them from the content, and its uploads, each with the name it was uploaded under, when, by whom and from which App.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The file's id, as a reference carries it.</td><td>string</td></tr></tbody></table>

#### Output

Returns `{ id, type, size, uploads: [{ name, at, by, app }] }`, or nothing when the store has no file for that id.

### `read`

A file's content, from its beginning. This is how something that has no access to the volume reads a file a row points to: the assistant opens one with it, a report takes its picture.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td></td><td>The file's id, as a reference carries it.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>maxBytes</code></td><td>The bytes to read from the beginning. Default and maximum 15728640 (15 MB).</td><td>integer</td></tr></tbody></table>

#### Output

Returns `{ id, type, size, base64, cut }`, or nothing when the store has no file for that id. A file longer than what was asked for is answered up to there, and `cut` is `true`.

## The clean-up

No function deletes a file. A file is held as long as a row points to it, and what an App keeps outside a table, in a variable, a widget's property or an executor's last value, holds it too.

Every night the store asks each database of the workspace what its rows point to, and removes the files that nobody held for thirty days in a row. A database that does not answer keeps the list it gave last, and while a database has never answered, nothing is removed at all: a mistake keeps a file too long, it never removes one early. A deleted row can therefore come back from a rollback or a restored backup with its file still there.

{% hint style="info" %}
On a self-hosted installation the clean-up only reports what it would remove until it is allowed to remove (`HW_FILES_CLEANUP=remove`).
{% endhint %}

### `report`

The report of the last clean-up: when it ran, which databases told what they hold and which did not and why, how many files the store has, how many are held and how many wait, and what was removed, or, where the clean-up only reports, what would have been.

#### Parameters

None.

#### Output

Returns the report, or nothing before the first clean-up ran.

### `cleanUp`

Runs the clean-up now, as it runs every night.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>remove</code></td><td><code>false</code> only reports what would be removed.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns the same report as `report`: `{ at, graceDays, asked, failed, released, blocked, files, held, waiting, removed, removes }`.

## Files from before the file store

### `convertLegacy`

Converts the files of rows written before the file store existed: a file named by its path on the volume becomes a reference, and content a cell carries becomes one where it is larger than a cell holds. A value keeps its shape, one file stays one file and a list a list, and the file a path named stays on the volume. A cell whose file is gone is left as it is and named in the answer.

The Media Server runs this by itself, ten minutes after it starts. Running it again is safe: what is converted is not found again.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>agent</code></td><td>The agent the database's instance runs on. Without it, every database of the workspace that answers.</td><td>string</td></tr><tr><td></td><td><code>instance</code></td><td>The instance of the relational database class.</td><td>string</td></tr></tbody></table>

#### Output

Returns one entry per database: `{ database, cells, converted, retyped, failed, checks }`. `retyped` names the fields that became `files` fields because a cell held more than one file.
