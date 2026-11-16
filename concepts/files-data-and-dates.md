---
description: >-
  Where an App's data lives, how a row keeps a photo or a PDF, what the shared volume holds, and the three forms a date travels in.
---

# Files, data and dates

## Where data lives

| Where | What belongs there |
| --- | --- |
| **The workspace's database** | rows that matter: orders, measurements, faults. Shared by every App of the workspace. |
| **The timeseries database** | values over time: a signal recorded every few seconds. |
| **A named instance** (`DataStore`, `Buffer`, `Counter`) | state the logic needs while it runs. It lives in memory and does not survive a restart. |
| **A variable** | one named value of the App. Its shared value survives restarts. |
| **The shared volume** | files: uploads, pictures, project notes. |

The tables belong to the workspace, not to an App. Every App reads and writes the same tables, and going back to an earlier version of an App never changes a table. The shape of the tables is the [data model](../app-builder/database-editor.md), kept inside the database with a history of who changed what.

{% hint style="warning" %}
Shape tables in the Database editor, or let the assistant do it. Building an executor that defines a table works, but the model then records the change without a name behind it.
{% endhint %}

## Files a row keeps

A row never holds a file's bytes and never a path. It holds an **entry**: a reference `{ id, name, type, size }` into the workspace's file store, or, for something small, the content inside the row itself.

* **One file is an entry, a list is a list**, at every step. An upload or photo widget set to one file delivers one entry, or nothing when it is empty. Set to several, it delivers a list. A signature is one entry with its picture inside it.
* **A field has a shape.** A `file` field takes one entry, a `files` field a list. The other shape is refused, and so is a path.
* Files that need a caption, an author or a record of who added them each deserve a row of their own, in a table related to the row they belong to.
* The media view, the data grid and a form show an entry as a picture; a gallery shows several to look through.
* **From a flow**, a file your logic produced, such as a generated PDF or a download, is handed to the file store, and the row keeps the reference the store answers. Everywhere a function takes a path, it also takes a reference: an email attachment, an HTTP upload, a file read, a PDF merge.
* No function deletes a file. What nothing points to any more is cleaned up by the platform.

## The shared volume

Beside the file store, the workspace has a volume with folders for different purposes: files you upload for an App to use, the **project notes** your team and the assistant write, files a flow produced at run time, and folders that belong to the platform itself and are read-only.

A picture on a page comes from an uploaded file; an image widget fits it into its box, so size the box to the layout and not to the file.

Where a flow builds file names itself, give those files a folder of their own. An exported [bundle](../app-builder/test-and-deploy.md) carries the files an App refers to and a referenced folder as a whole, but never the loose files at the top of a zone.

## Reading data while you build

Looking at what an App has written, such as a fault's history, is a job for the data tools of the assistant or the Database editor, not for an executor built to look. A deployment can switch the reading of live values off altogether, because what an App holds may be personal data; the tools then refuse, and no executor should be built around that.

Small files, such as a configuration or a short CSV, can be read into a conversation. Large or growing data never is: build a pipeline that reads the file into a store, and work against the store.

## Dates

A date travels in one of three forms, never as the text a person reads:

| Form | Example | Column type | Meaning |
| --- | --- | --- | --- |
| **A calendar date** | `2026-10-01` | `dateonly` | the same day everywhere |
| **An instant** | `2026-10-01T06:30:00Z` | `date` | one moment, in UTC |
| **A time of day** | `08:30:00` | `time` | a wall clock, no day |

Forms, grids, lists and tiles write these forms, and database reads return them unchanged. A date field shows anything else as empty, and a date range holds a start and an end.

**Never format a date in a flow for a widget.** Widgets format dates in the viewer's own time zone and the App's language. Where your logic produces text for people, such as a message or a document, format it with the App's language and the viewer's time zone explicitly. See [Languages and time zones](languages-and-time-zones.md).
