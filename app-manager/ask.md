# Ask

Ask lets the invited users of an App question the workspace's data with an AI, in their own words: _"How long did line 2 stand still last week, and why?"_ They ask in the App itself, or from their own AI client such as ChatGPT or Claude. Ask answers from the databases, files, logs and Apps of the workspace, draws charts, runs the App's endpoints for them and makes reports to download.

{% hint style="info" %}
Ask is in **beta**. It is marked so in the App Manager, in the App and in the App Builder.
{% endhint %}

## Switch it on

Ask holds only for an App that invited users alone can open: every user is a person with an account, never an anonymous visitor.

1. In the App Manager, open **Apps** and the App's **Access Settings**.
2. As **Access Mode**, choose _Only previously invited users can login_.
3. Switch **Ask** on.

The settings then show the App's [Ask address](#from-your-own-ai). Switching Ask off, or choosing another access mode, ends Ask for every user of the App at once, in the App and in every connected AI client. The App Manager asks before an access mode turns Ask off.

## What Ask reaches

Ask works as the user who asks, in one App:

* **Reads, workspace-wide:** every database and InfluxDB a flow of the workspace connected, the [files](#files) their rows point to, the logs of its containers and native agents, what each App is made of, and how a released App's executors are doing.
* **Computes, workspace-wide:** one query over the tables it has read, for what a single read cannot shape: two reads side by side, one column per machine, differences, shares, moving averages, statistics. The numbers come from the data, never from the AI's reckoning.
* **Runs, this App only:** its endpoints, as the user, on the released App, and it looks at the App's pages as the user sees them.
* **Shows and makes, this App only:** charts beside its answer, and reports to download.
* **Nothing else.** Ask changes data only through an endpoint. It cannot change an App, a file or a setting; it says so and names who can, a member of the workspace.

Everything Ask reads to answer travels with the conversation to the AI provider: in the App, the provider of the platform's assistant; from the user's own AI client, that client's provider. Tell your users so before you switch Ask on, and connect to a flow only the data they may see.

### Read-only, per database

Ask's reads change nothing. The database itself holds every read to reading, not only the platform:

| Source | How a read stays a read |
| --- | --- |
| **PostgreSQL**, **MySQL** | One query in a read-only transaction, with the login the flow's database instance connects with. |
| **The workspace's own database** | As above, with a login of its own that may only select. |
| **SQLite** | The file opened read-only, writes switched off. |
| **InfluxDB** | The platform writes the query from the parameters Ask names; Ask never sends query text. |
| **SQL Server**, **Snowflake** | Not read: neither has a read-only transaction. |
| **MariaDB**, **Oracle** | Not read yet: no test proves yet that a read there cannot write. |

A query is a single `SELECT`, `WITH`, `VALUES` or `TABLE` statement; a second statement, `INTO` and locking clauses are refused before anything goes out. A large answer is cut and comes with the true number of rows and a summary of each column.

### Files

A table row keeps a file, a photo, a PDF, a signature, as a small entry ([Files in a table](../reference/functions/storage/relational-database.md#files-in-a-table)). Ask opens the file behind it, whichever App of the workspace uploaded it:

| File | What Ask does with it |
| --- | --- |
| **Picture** (PNG, JPEG, GIF, WebP, AVIF, BMP, SVG) | Looks at it. |
| **PDF** | Reads its text. A scan or a drawing has none: Ask looks at it page by page. |
| **Excel** (XLSX), **Word** (DOCX), **text**, **CSV** | Reads the rows or the text. |
| **Video**, **sound**, **archives**, other formats | Cannot look at it. It says so, and what the file is: its name, type and size, who uploaded it and from which App. |

Ask opens a file of up to 15 MB. A file it opens travels to the AI provider like everything else it reads, a photo of a person included.

## In the App

A signed-in user of the App finds **Ask** at the bottom right of every page. It opens a panel beside the page, on a phone over the whole screen. Its left edge can be dragged wider, and that width stays with the user's browser for this App.

* The user asks; Ask shows what it is doing (_Reading the data…_) and answers in the user's language.
* **Charts** are drawn live beside the answer, by the App's own widgets, in its look, language and time zone. The user asks for them otherwise and Ask draws them again, so a chart is right before it goes into a report.
* Before it runs an endpoint that needs the user's go, a card names the endpoint and its values: **Allow** or **Deny**.
* A report comes as a card with **Download**.
* A file Ask speaks of shows in its answer: a picture as a picture, any other file by its name. A click opens it.
* With **Add a file** the user hands Ask files of their own, a photo of a part, a delivery note, up to five with a question. They go into the workspace's file store like a file from an upload widget; one that no row takes up is removed with the store's clean-up.
* **Stop** ends a running question; what was done so far is kept. **New conversation** starts afresh.

The conversation stays with the user and the App, also when the tab closes during a question, until they start a new one. When a user is removed from the App or deleted, their conversation goes with them.

Ask in the App spends the workspace's credits, each run booked to its App. When none are left, Ask says so and a member tops them up. A self-hosted installation without an AI key for the assistant offers only the user's own AI client.

## From your own AI

Every App open to Ask has an address of its own on the workspace's [MCP server](ai-clients.md):

```
https://<your platform host>/<account>.<workspace>/mcp/app/<app id>
```

Members copy it in the App's access settings; users find it in the App, in the Ask panel under **Your own AI**. The user adds it to their AI client as a custom connector, as for [any AI client](ai-clients.md#connect-your-ai-client). When the client signs in, the browser opens the App's own **Connect your AI** page: the user signs in with their account of the App, and a card names the AI client, what it reaches and where the browser returns. **Allow** connects it, **Deny** sends it back.

The client then has the user's Ask, with the same reach as in the App, except that no panel draws charts there: for something to look at, Ask makes a report. A file Ask speaks of comes as a link that the App's own page opens after sign-in. It spends the user's own AI subscription, not the workspace's credits. An endpoint that needs the user's go runs only after they agree in the chat. Not every plan of every AI client can add a custom connector (see [Your AI plan decides](ai-clients.md#your-ai-plan-decides)).

The connections show in **AI clients** in the App Manager for the workspace's owners, as _Ask in app &lt;app id&gt;_; **Disconnect** ends one at once. A connection unused for 90 days ends by itself, and a user holds at most 20.

## Endpoints: ask the user first

Each endpoint says whether Ask needs the user's go before it runs it: **Ask the user first** in the endpoint's dialog (Explorer, **Endpoints**). It is ticked by default. Untick it for an endpoint that changes nothing that matters, such as opening a page.

An endpoint's description is what Ask reads to decide whether to run it, so say what it does and what it changes. A value no user should read belongs in a secret variable: Ask sees every other variable of the App.

Where it runs: in the App, an endpoint runs in the user's open App, and a page it opens is the one they see. From the user's own AI client no page of theirs is open; a page it opens is seen by nobody, and Ask says so.

## Reports

Asked for a report, Ask writes one: **PDF**, **Word** (DOCX), **Excel** (XLSX) or **CSV**, in the App's look and language. Its header carries the App's name and icon, the title, who asked and when. Its tables are read straight from the databases into the file, never retyped by the AI: up to 1000 rows a table in PDF and Word, every row in Excel (a sheet per table, real numbers and dates, plus a Sources sheet with the queries) and CSV (exactly one table and nothing else). Around them go headings, text and lists, charts, and pictures: the App's pages, and files from its rows such as an inspection's photos or a signature. The small print says in words where every number came from.

A chart is one of the App's own widgets, Chart, Pie Chart, Polar Chart, Sankey Chart, Sparkline, Timeline, Circular Gauge or Linear Gauge, drawn from a table of the report in the App's theme and language and the user's time zone, so its numbers never pass through the AI either. Settings Ask leaves out the widget picks from the data, as it does in the App Builder. In PDF a chart stays a sharp vector drawing, in Word it is a picture, and Excel carries its table instead. A series too long to draw (more than 5000 points) is aggregated in its table first, and Ask says how. For what no widget covers, Ask can still draw a simple figure.

A report lands in the workspace's shared files, under `reports/<app id>/`, with who asked and which tables it holds. The user downloads it from the panel's card, or opens the link Ask gives: the App's own page offers the download after sign-in. The link is the key, and any user of an App of the workspace that is open to Ask can open it, so pass it only to people who should read the report. Reports stay until a member deletes them in the App Builder's [Files](../app-builder/explorers/files.md) explorer.
