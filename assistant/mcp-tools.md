---
description: >-
  Every tool the MCP server serves: what it does, what it changes and what needs your go
---

# MCP tools

Every tool the platform serves to an AI, generated from the code. It is a map, not a manual: you never call these tools yourself. Read it to see what an AI can and cannot do in your workspace, and to name a tool when you tell your AI client what to allow and what to ask you about first.

The [built-in assistant](README.md) works with the same tools. So does your own AI client, through the [MCP server](mcp-server.md), whether it connects by the [workspace's MCP address](../app-manager/ai-clients.md) or runs as a local MCP server. Three differences, all noted in the tables: a read-only connection is served the reading tools only, the tools that hand files over work with local paths on a local MCP server and with the workspace's shared files everywhere else, and the built-in assistant carries the platform law with it instead of reading it through `get_platform_law`.

Each tool describes itself, and that description is what the AI reads: how the platform expects the tool to be used, what it refuses, what its answer holds. The column below is the first sentence or two of it, shortened; the AI gets the whole text and the tool's parameters with it. What no single tool can carry, the rules for building a good App, is the [platform law](README.md#what-it-builds-by).

{% hint style="info" %}
Reading live values, data, logs and screenshots is one family, and an installation can switch it off: the tools then refuse. See [what it reads](README.md#what-it-reads).
{% endhint %}

<!-- generated -->
<!-- Generated from heisenware-cloud/mcp (src/catalog.ts, built to dist/). Regenerate with scripts/reference/mcp-tools.mjs; edit outside this block only. -->

The server serves 119 tools. A read-only connection serves the 38 that only read; the others are not offered at all.

The last column:

* `write`: changes something, so a read-only connection does not offer it.
* `go`: needs your explicit go, as `confirm: true` from your own AI client or the approval card of the built-in assistant.
* `files`: hands paths on the machine the server runs on. The local MCP server does that; the workspace's MCP address serves the same tool with the workspace's shared files instead.
* `ask`: an App user gets this tool too, through [Ask](../app-manager/ask.md).

`go`\* marks a tool that needs the go only for what a rollback cannot restore: `delete_entity` needs it for a whole App, not for an executor, a widget or a page.

## The platform

What is there to build with, and what the machines are doing.

| Tool | What it does | Marks |
| --- | --- | --- |
| `get_platform_law` | The platform law: the rulebook for building Heisenware apps - wiring and triggers, variables vs wires, verification, files. Read it once per session, before the first build action: it carries the rules the tool descriptions only hint at. | `ask` |
| `get_deployment_info` | Where the platform runs (SaaS cloud / on-prem) and every agent on the bus - the platform's own services included - with status and class names. The native agents as a fleet: list_agents. |  |
| `list_capabilities` | Every online agent with its classes, function names and live instances. The catalog of backend functionality available for executors; the platform's control classes (Agent, Agents, Rollouts, Compiler) are left out, list_agents reads them. |  |
| `describe_class` | Full signatures of one class: functions with parameter names, types and descriptions (from JSDoc); a function-typed parameter carries `payload` - the values the backend hands that function… |  |
| `get_connector_guide` | A connector's domain guide - what its JSDoc cannot carry: what the technology is, the member's words, its domain model, how the connector maps it, gathering the data right, recipes… |  |
| `list_agents` | The native agents as a fleet - every agent built on this platform or seen on the bus, the platform's own services left out: alias, host, status, last seen, connectors, its build against the fleet's current build and the state that follows (current, behind… | `ask` |
| `get_agent` | One native agent in full: its row, the timeline of what happened to it (online, offline, restarts, updates, who asked) and, while it is online, what it says about itself - host facts, uptime, the readiness checks an update needs, a pending or last update. | `ask` |
| `get_agent_log` | The tail of a native agent's log, parsed: records with level, time, module, message and fields, plain text as it came, a stack folded under its record. The agent answers it, so it must be online. | `ask` |
| `list_containers` | The containers behind the workspace on its host, as docker knows them: the workspace's own (a released app's backend is app-backend-&lt;appId&gt;-latest, then builder-backend, connectors, databases, media-server, ...) and, except on a host of the shared cloud… | `ask` |
| `get_container_log` | The tail of a container's log as docker keeps it, parsed like get_agent_log: records with level, time, module, message and fields, plain text as it came, a stack folded under its record. | `ask` |

## Apps, versions and releases

An App as a whole: what it is, what it was, and what its users run.

| Tool | What it does | Marks |
| --- | --- | --- |
| `list_apps` | Every application in this workspace with name, page count and access - whether the player can open it: registered, refused (with the reason: the plan's quota, an expired plan) or pending - plus its links: builderUrl (the App Builder on it) and, once deployed… | `ask` |
| `create_app` | Creates a new application with one empty page. Returns appId, pageId, access - the platform's verdict on registering the app for the player (registered \| pending \| unknown) - and builderUrl, the App Builder on it. | `write` |
| `set_app_identity` | Sets an app's identity: name (as members see it in the manager and the builder), description, icon (iconPath = shared-volume image, e.g. an uploaded logo), the SCREENS the app serves (screens: e.g. \['__desktop', '__phone'\] - every other screen is disabled… | `write` |
| `describe_app` | One app in full: access (whether the player can open it - refused names the reason, e.g. the plan's quota), screens (enabled + reference: the screen most page widgets reference, with the counts)… | `ask` |
| `check_migration` | What one App has to change because an older version did it differently: the platform's migration rules applied to the App's records. findings: each rule that matches - was, is, changedIn (the release that changed it) - with its places: at… |  |
| `checkpoint` | Creates a named version snapshot of the app (git-backed) - the state rollback can return to. The name becomes a git tag: unsafe characters (spaces included) fold to "-"; the answer carries the name as stored, which rollback needs. | `write` |
| `list_checkpoints` | Lists an app's saved versions (checkpoints + releases) - the targets rollback can return to. |  |
| `rollback` | Restores the app to a checkpoint created earlier (name + timestamp from checkpoint). | `write` |
| `export_app` | Packs the app's current build into a portable bundle (.hwt) and writes it to the local workspace - the builder's Export: the records, the uploads/ and project/ files they reference, the shape of the tables its executors name (dataModel.tables… | `write` `files` |
| `import_app` | Adds a bundle (.hwt from export_app or a builder export) to an app as a version - the builder's Import: the App changes only when rollback(appId, name, timestamp) applies it. | `write` `files` |
| `list_app_texts` | Every text people read in an app, as ONE table to translate: the app's name and description, page labels and titles, and the widget props the manifests declare as text (button labels and hover texts, column captions, form labels and help texts… |  |
| `translate_app` | Makes an app in another language, or refreshes one (#1667): exports the reference app's current build as a bundle, writes your translations into it by id (from list_app_texts; an unknown id refuses the whole call… | `write` |
| `deploy_app` | Deploys the app - the builder's Deploy button: tags the current state as a new version and asks the platform to bring the production backend up for it (within about a minute). Returns the version and appUrl, the deployed app. | `write` `go` |
| `delete_entity` | Deletes an executor, widget or whole App. A rollback restores an executor or widget. A whole App takes its versions along - irreversible, it needs the user's explicit go. | `write` `go`\* |

## The flow

Executors on the Flowboard, their addresses, their triggers and the wires between them.

| Tool | What it does | Marks |
| --- | --- | --- |
| `create_executor` | Creates an executor: the node that calls one backend function. static: agent+className+functionName. member (an instance function): additionally instanceName, the instance whose method runs… | `write` |
| `get_executor` | One executor's configuration: inputs with positional argIndex and JSDoc meta (a dynamic address part is listed among them as type agentAddress / instanceAddress without argIndex - wired by connect targetItemId)… |  |
| `set_address` | Writes the STATIC address of an executor: the agent it runs on and the instance: for instance functions the target, for a constructor / destructor the name it creates or disposes (the design value of its instance input)… | `write` |
| `set_dynamic_address` | Makes one part of an executor's address DYNAMIC: the part resolves from a VALUE at call time instead of the static address. agent: one agent name, a LIST of agents, or a glob ('*'… | `write` |
| `set_loop` | Arms one-by-one iteration on an executor's trigger: when the argument at argIndex receives an ARRAY, the call unrolls sequentially per element (delayMs pacing before each call) and the results collect into an array. | `write` |
| `set_input_default` | Sets the design-time default of a positional argument. value is the LITERAL JSON value the function will receive - numbers as numbers, objects as objects (an options-object parameter takes the whole object at its argIndex)… | `write` |
| `add_trigger_source` | Edits the executor's trigger sources - the list of reasons it runs, OR'd (get_executor shows every entry with its meaning). | `write` |
| `connect` | Draws one whole edge atomically: source value into the target's positional argument (argIndex), or into a dynamic address part named by targetItemId ('agent' or 'instance', made dynamic by set_dynamic_address… | `write` |
| `disconnect` | Removes the edge drawn by connect: the link and the onProduce coupling. | `write` |
| `connect_trigger` | Draws a PURE IMPULSE edge: the target executor runs whenever the source item produces - no data flows, the target uses its own inputs. | `write` |
| `disconnect_trigger` | Removes the impulse edge drawn by connect_trigger. | `write` |
| `add_extension` | Adds a node to an output item's post-processing pipeline: modifier (transforms: ONE JavaScript expression over x, or jsonata), filter (ONE boolean expression over x - a gate: what passes goes on as it is, children and edges get the payload… | `write` |
| `update_extension` | Edits an existing pipeline node in place: expression, language, recorder settings, variable publication, comment. Pass publishToVariable: null to detach a variable, comment: null to remove the caption. | `write` |
| `delete_extension` | Removes a pipeline node (modifier, filter, recorder, errorHandler) from an executor, INCLUDING its children and its links. Self-cleanup of nodes you added needs no approval; a member's node needs the user's explicit go. | `write` |
| `set_comment` | Updates the note rendered on an executor's node - the why of this node in this flow (null removes it) - the post-hoc edit of create_executor's comment. The hover text is the function's own documentation and has no setter. | `write` |
| `create_section` | Frames executors into a titled section on the Flowboard - purely visual organization: no effect on business logic, excluded from released versions. | `write` |
| `update_section` | Changes an existing section: title, color, members. A stage that grows after its frame exists gets its late executors HERE (addExecutorIds) - a node wired into a section from outside is the same smell as a crossing wire. | `write` |
| `delete_section` | Removes a section frame - the inverse of create_section: its members (executors, annotations) stay on the canvas where the frame showed them, in absolute coordinates again. | `write` |
| `create_annotation` | Places a documentation card on the Flowboard - purely visual, excluded from releases. text is MARKDOWN: headings, lists, GFM tables, links, images by shared path (!\[\]\(/shared/uploads/x.png)) and \`\`\`mermaid fences, which the board draws as diagrams… | `write` |
| `update_annotation` | Rewrites an existing annotation: text (markdown or HTML, replaces the whole note), color (null clears the tint), position, dimensions. Ids come from describe_app. | `write` |
| `delete_annotation` | Removes a documentation card from the Flowboard - the inverse of create_annotation. A card inside a section frame leaves the frame first; the frame stays. | `write` |
| `create_subflow` | Publishes a section's inner graph as a callable subflow - the Flowboard's function definition. | `write` |
| `call_subflow` | Creates a CALLER of a subflow blueprint - wire it like any executor: feed its inputs, fire its trigger, consume its output. | `write` |
| `set_subflow_timeout` | Sets how long every call of a published subflow waits for its return - on the blueprint, callers follow. timeoutMs omitted returns to the default. | `write` |

## Variables, endpoints and events

An App's own values, the doors other callers use, and backend subscriptions.

| Tool | What it does | Marks |
| --- | --- | --- |
| `define_variable` | Declares an app variable: named state, referenced as $name in expressions and templated inputs. isSecret: true makes it a secret - the engine masks every read. | `write` |
| `update_variable` | Updates a variable's defaultValue, description or isSecret by name (or variableId). Type-exact like define_variable; the result echoes storedType. | `write` |
| `delete_variable` | Removes a variable by name (or variableId). Returns danglingReferences - $name references in expressions and static inputs are NOT rewritten; fix any listed usage. | `write` |
| `define_endpoint` | Publishes an executor as a named action in the app's public contract. The description is what a caller - an AI among them - learns of it: say what it does and what it changes. | `write` |
| `update_endpoint` | Updates an endpoint's description or whether it requires approval, or renames it (by current name). | `write` |
| `delete_endpoint` | Removes one endpoint definition by name (the app itself is untouched). | `write` |
| `get_app_contract` | What an app offers to be run and read: every endpoint with its inputs in position order (name, valueType, description, optional, default), whether it has an output, and requiresApproval… | `ask` |
| `trigger_endpoint` | Calls an endpoint through its PUBLIC facade with positional args, exactly as an external caller will - the probe for the endpoint's contract: null leaves an input to the app (its wired value or default)… | `write` `ask` |
| `tap_event` | A handler (an input of type event or callback) hands its values over as output items beside the return - an event executor's return carries only what the function answered. tap_event returns the value item for argument N of the executor's handler… | `write` |
| `stop_listening` | Stop listening: ends an event executor's subscriptions in every scope; its status shows them ended by you. The next trigger declares them again - to stop for good, change what triggers it. | `write` |
| `list_registrations` | Who listens to an instance: the registrations its agent holds, one per event function and arguments, each with state, events, rate (events per second) and subscribers (App, executor, scope). |  |
| `end_registration` | End: releases one registration for all its subscribers; each executor loses that one target (shown ended by you) until it triggers again, its other targets keep listening. functionName and args as list_registrations lists them. | `write` `go` |

## Pages and widgets

What users see: pages, the widgets on them, and the links that carry values.

| Tool | What it does | Marks |
| --- | --- | --- |
| `add_page` | Adds a page: top-level (in the navigation menu) or, with parentId, a subpage of a top-level page - the builder's "add subpage": outside the menu, reached by a page link (link_widget itemType page, link_page). Pages nest one level. | `write` |
| `update_page` | Updates a page's or subpage's display data - text (the navigation label), icon - and its HEIGHT: extendHeight in screen heights (1 = one screen, 1.5, 2.25 ...). | `write` |
| `delete_page` | Deletes a page or subpage INCLUDING every widget on it, and a page's subpages with it. A rollback restores it. Returns a sensible neighbor page to select next. | `write` |
| `reorder_pages` | Reorders one sibling list: the top-level pages (array position IS the navigation order) or, with parentId, that page's subpages. Unlisted siblings keep their relative order after the listed ones. | `write` |
| `move_page` | Moves an existing page in the tree, its widgets and links untouched (ids stay): under parentId as a subpage (out of the navigation menu), or with parentId null to the top level (into the menu), at index among its new siblings (default: last). | `write` |
| `pin_page_props` | Pins page fields on one screen: the value that screen shows becomes its own (the builder's pin icon), and update_page with that screen then writes the pin. paths are the page's fields ('text', 'icon'). | `write` |
| `unpin_page_props` | Unpins page fields on one screen: the screen falls back to the shared value. paths as describe_app lists them under the page's pins. Refuses extendHeight (pinned by nature). | `write` |
| `list_widget_types` | All widget types with label, category and description - the catalog for choosing frontend elements; drawable: true marks the ones create_report draws as charts. | `ask` |
| `get_widget_manifest` | One widget's complete contract: defaults, accepts (bindable properties with value schemas and demo examples), propsSchema (JSON Schema of everything set_widget_props may write - types, enums, nested shapes such as chart seriesData items… | `ask` |
| `create_widget` | Places a widget on a page with authored geometry on one screen; the other screens derive automatically. The screen a widget is first placed on is its reference screen: its other screens derive from it. | `write` |
| `get_widget_props` | One widget's props as they are stored and as they render: the shared base, every enabled screen's pins with their values, and the resolved props per enabled screen (the base with that screen's pins applied). |  |
| `set_widget_props` | Updates widget properties. | `write` |
| `set_widget_geometry` | Places a widget in its container. A page widget: exact geometry on one screen (screen defaults to the app's reference screen, named in the answer; other screens derive). | `write` |
| `restack_widget` | Moves a widget in its page's stacking: 'front' (topmost), 'back' (bottommost, where a surface like a card belongs), 'above' or 'below' another widget (otherWidgetId). | `write` |
| `pin_widget_props` | Pins prop paths on one screen: the value that screen renders becomes its own (the builder's pin icon), and set_widget_props with that screen then writes the pin. paths as get_widget_props lists them ('htmlText', 'appearance.fontSize'). | `write` |
| `unpin_widget_props` | Unpins prop paths on one screen: the screen falls back to the shared value. paths as describe_app lists them under pins ('colCount', 'appearance.fontSize'). | `write` |
| `group_widgets` | Forms a GROUP from two or more widgets that share a container - the page, or one group (then the new group nests inside it). A group is the platform's REPEATER: bind an array to its data and it renders one tile per row (set_group_bindings). | `write` |
| `ungroup_widgets` | Dissolves a group: its children return to where they sat - the page, or the group around it -, visible, in their stacking order; the group is gone. Answers the children's ids. | `write` |
| `set_group_bindings` | How a group's tiles show their data. | `write` |
| `set_widget_value_scope` | Sets where a widget's value-writes land: 'client' (default - every viewer writes their own isolated value) or 'shared' (ALL viewers read and write ONE value: each viewer's edit becomes everyone's state, kiosk and team-board style). | `write` |
| `link_widget` | Binds a widget property to an executor item, to a page, or to an app action. itemType output shows the executor's result; trigger fires the executor from the widget's event… | `write` |
| `unlink_widget` | Removes widget bindings without deleting the widget: with itemId exactly that binding, without it every binding to that executor; a page or action binding by its page id or action id as itemId, no executorId. | `write` |
| `link_page` | Switches pages from backend logic: every TRUTHY value the item produces after the app mounted switches the app to pageId, on a filter every value that passes, a falsy one included. itemId is an output ('output' for the return… | `write` |
| `unlink_page` | Removes a page link from an executor item (link_page's repair verb); the engine removes its hidden actor. Without pageId every page link of the item goes. | `write` |
| `link_action` | Runs an app action from backend logic: every TRUTHY value the item produces after the app mounted runs actionId, on a filter every value that passes, a falsy one included, - logout (forget this device's credentials, revoke the session… | `write` |
| `unlink_action` | Removes an action link from an executor item (link_action's repair verb); the engine removes its hidden actor. Without actionId every action link of the item goes. | `write` |

## Navigation and theme

The App's menu and its look.

| Tool | What it does | Marks |
| --- | --- | --- |
| `pin_navigation_props` | Pins navigation settings on one screen: the value that screen shows becomes its own (the builder's pin icon), and set_app_identity navigation with that screen then writes the pin. paths are the menu's settings ('type', 'position', 'width', 'burgerAt'… | `write` |
| `unpin_navigation_props` | Unpins navigation settings on one screen: the screen follows the shared settings again. paths as describe_app lists them under navigation.pins. | `write` |
| `get_app_theme` | An app's theme as it renders: baseTheme (a DevExtreme id) and its look, every modified variable, and one catalog with current values - the base variables by default ($base-accent, page and component backgrounds, text, border color and radius, font family… |  |
| `set_app_theme` | Changes an app's theme and compiles it; an open builder swaps the stylesheet in place at once (no reload). | `write` |

## The data model

The tables of the workspace's own database.

| Tool | What it does | Marks |
| --- | --- | --- |
| `get_data_model` | The data model of the workspace's own database (the source Connectors/internal-postgres of the data tools) as YAML: per table its fields (defineTable's types and flags), audit log and relations… |  |
| `define_table` | Makes a table of the workspace's own database, or adds to one - additive only: fields not named stay, a field named again keeps its values (its type changes only while it holds none; else reshape_data_model). | `write` |
| `preview_reshape` | What reshape_data_model with the same arguments would do, changing nothing: removing a field (rows holding a value, the unique key it shares), a relation (the links), the whole table (wholeTable: true - its rows, its audit log… |  |
| `reshape_data_model` | Removes a field, a relation or the whole table (wholeTable: true), or changes a field's type (field and type), of the workspace's own database - for good, there is no bin; a type change converts every value. Naming nothing is refused. | `write` `go` |
| `adopt_drift` | The data model takes what the workspace's own database holds where they disagree (get_data_model's drift): what was made outside the platform - by SQL from elsewhere (another system, a console), by a database import… | `write` |

## Reading data

Every database and InfluxDB a flow connected, the files their rows point to, and what an analysis becomes.

| Tool | What it does | Marks |
| --- | --- | --- |
| `list_data_sources` | Every database and Influx that an App's flow connected, on any agent of the workspace - its own database and external ones alike. | `ask` |
| `describe_data_source` | The map of one source before a query, in two levels so a big schema does not come at once. | `ask` |
| `query_database` | One SQL query on a database source, in its dialect (list_data_sources names it), that only reads: it begins with SELECT, WITH, VALUES or TABLE, is one statement, has no INTO and no locking clause… | `ask` |
| `query_timeseries` | Reads a measurement of an Influx source by parameters, never by Flux: start and stop (default: the last day), fields, tags (exact values), every + func to aggregate into windows of that length. | `ask` |
| `compute_table` | Reads tables and answers one SQLite SELECT over them - what one query of a source cannot shape, and what you would otherwise reckon from rows you read: two reads side by side (a window's min and max, plan and actual)… | `ask` |
| `open_file` | Copies a file a row points to into the local workspace and returns the local path: open the returned localPath with a file-reading tool, which renders pictures and PDFs natively. | `files` `ask` |
| `create_report` | Turns an analysis into a file a person keeps - pdf, docx (Word), xlsx (Excel) or csv - in the App's look: its name, its colours, its language, the time zone, who asked, page numbers where the format has them. | `write` `ask` |
| `show_charts` | Shows charts to the user now, beside your answer: drawn live in the App's own panel by the App's widgets, in its look, language and time zone - so the user sees a chart, asks for it otherwise, and you show it again before it goes into a report. | `ask` |

## Files

The workspace's shared files.

| Tool | What it does | Marks |
| --- | --- | --- |
| `list_shared_files` | Files in the accessible zones of the shared volume (uploads, project, runtime-files, native-agents, themes, data-backups). project/ holds the team's project notes. |  |
| `read_shared_file` | Reads a text file from the shared volume (accessible zones only). |  |
| `write_shared_file` | Writes a text file to the shared volume - only uploads/ (assets) and project/ (team knowledge, e.g. project notes every member and session can read). | `write` |
| `fetch_shared_file` | Copies a shared file into the local workspace and returns the local path - the way to read NON-TEXT formats (PDF, images): open the returned localPath with a file-reading tool, which renders them natively. | `files` |
| `upload_shared_file` | Uploads a LOCAL file (a downloaded photo, a generated PDF - any bytes, max 15 MB) to the shared volume, only uploads/ (assets) and project/. The binary twin of write_shared_file: never route a picture through Http/base64/File executors. | `write` `files` |
| `move_shared_files` | Moves files into a folder of uploads/ or project/, server-side, in one call (the folder is created). | `write` |

## Testing and looking

Starting the App, probing one node, and the eyes.

| Tool | What it does | Marks |
| --- | --- | --- |
| `test_app` | Starts the app inside the builder for testing - the builder's Test button pressed on a stopped app: arms lifecycle triggers (onAppStart, polls) and declared event subscriptions for every executor, so read_value, layout_lint and screenshot see live values… | `write` |
| `stop_app` | Stops the app running inside the builder - the builder's Test button pressed on a running app: onAppStop sources fire, polls stop, event subscriptions pause, reactive wiring stays (linked values keep flowing into the stopped app). | `write` |
| `invoke_executor` | Runs an executor and returns the real result, or the real backend error. Answers for this node alone: the executors its outputs trigger have started and may still run - get_executor_status and read_value say running while they do. | `write` |
| `get_executor_status` | Reachability/health of an executor: online, agent-offline, function-offline, error (with message), busy (a run longer than 2 s). running: true while a run of it is in flight, from its trigger to its last output written - its values are not final yet. | `ask` |
| `read_value` | Reads a live cached value from an executor item. A filter answers { value, passed, arrived }: value is the last payload it let through, arrived the latest one that reached it, passed whether that one got through (null: it has not run). |  |
| `layout_lint` | Renders a page of a STARTED app headlessly and returns geometric FACTS as JSON: widget boxes (each with its widget id, type and zIndex; a box without an id is the player's own chrome - the drawer's burger, the bottom tabs bar - keep clear of it… | `write` |
| `screenshot` | Renders a page of a STARTED app to a PNG. By default the first viewport only; covers { y, height, of } says which content rows the image shows (of = the whole page height). | `write` `ask` |
| `use_app` | Uses a STARTED app the way a member does, in one headless player session: runs the steps in order - click a widget by id, type into a widget or pick in it (or in one named field of it), answer the open dialog, wait ms… | `write` |

## Talking to you

The two tools whose result is not a change but a message.

| Tool | What it does | Marks |
| --- | --- | --- |
| `show_user` | Points the user's builder UI at something: pulses an executor, widget or page and optionally attaches a note. Pointing only - the member's canvas already follows every page and screen you write to or render. |  |
| `report_platform_issue` | Reports a suspected platform defect to the member. |  |

## The Ask surface

An App user who asks in the App, or from their own AI client, is served 22 of these tools: the reading ones as they are, and a few in a form of their own, for one App and its data. [Ask](../app-manager/ask.md) says what that reach is.

| Tool | At the user seat |
| --- | --- |
| `get_platform_law` | The Ask law: who you answer for, what you can read and run, how to look and how to answer. Read it once, before your first answer. |
| `list_agents` | The same tool. |
| `get_agent` | The same tool. |
| `get_agent_log` | The same tool. |
| `list_containers` | The same tool. |
| `get_container_log` | The same tool. |
| `list_data_sources` | The same tool. |
| `describe_data_source` | The same tool. |
| `query_database` | The same tool. |
| `query_timeseries` | The same tool. |
| `open_file` | The same tool. |
| `compute_table` | The same tool. |
| `create_report` | The same tool. |
| `show_charts` | The same tool. |
| `describe_app` | What one App of this workspace is made of: its description, pages, executors (what each calls, with its description), widgets, variables, endpoints and theme, and access - whether people can open it. |
| `list_widget_types` | The widgets a report draws as charts, with label and description: pick one for create_report's charts, then read its contract with get_widget_manifest. |
| `get_widget_manifest` | One drawable widget's contract, for a chart of create_report: accepts.output - the values bind maps to tables, each with its valueSchema and an example -, defaults, propsSchema - what props may set… |
| `trigger_endpoint` | Runs an endpoint of this App, as released, as the user: its logic runs with the user's identity ($USER). Asks the user first. |
| `get_app_contract` | What this App offers to be run and read, as released: every endpoint with its inputs in position order (name, valueType, description, optional, default), whether it has an output… |
| `get_executor_status` | Reachability and health of an executor of an App's release - what runs for its users: online, agent-offline, function-offline, error (with message), busy (a run longer than 2 s)… |
| `screenshot` | Renders a page of this App as the user sees it: the released App, signed in as the user - opening it runs its page-load logic as the user's own visit does. |
| `list_apps` | Every App of this workspace with its name, page count, whether it runs (isStarted) and access - whether people can open it: registered, refused (with the reason) or pending - and, once released… |

<!-- /generated -->
