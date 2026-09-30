---
description: >-
  The words Heisenware uses in the App Manager, the App Builder, the App Player, the assistant and these docs
---

# Glossary

These are the words Heisenware uses everywhere: in the App Manager, the App Builder and the App Player, in what the assistant says, and on these pages. Each term has one meaning, and the same thing always has the same name.

<!-- generated -->
<!-- Generated from heisenware-cloud/docs/glossary.md. Regenerate with scripts/reference/glossary.mjs; edit outside this block only. -->

## Product, places, people

**Heisenware**: the platform you build and run industrial Apps with.

**Account**: your organization on Heisenware, reached at its own address, e.g. `acme.heisenware.cloud`. It holds members, workspaces, plan and billing.

**Workspace**: an isolated area inside an account with its own Apps, databases, files, agents and integrations. Every account starts with one: `default`.

**Domain**: a workspace's technical name, `<account>.<workspace>`, e.g. `acme.default`. It appears in App URLs and client credentials.

**Member**: a person who belongs to the account and builds or manages Apps in the Manager and the Builder.

**User**: a person who uses an App in the Player.
*Also called:* App user.

**App**: what you build: pages, executors and widgets, living in a workspace, reachable at its own URL and installable on a device.
*Also called:* application.

**App Manager**: where members create and run Apps and manage the account.
*Also called:* Manager.

**Dashboard**: the App Manager's overview of how the account's Apps are used.

**App Builder**: where members build one App.
*Also called:* Builder.

**App Player**: what runs an App for its users, in the browser or installed on a device. Users see their App's name; members may see "App Player".
*Also called:* Player.

**Assistant**: the AI built into Heisenware. In the Manager it plans Apps with you; in the Builder it builds with you. It follows the platform law.
*Also called:* AI assistant.

**MCP server**: gives your own AI client (Claude Code, Claude Desktop, …) the same tools the assistant uses, through an MCP connector.

**Platform law**: the rulebook for how Heisenware works and how Apps are built well. The assistant follows it, and these docs agree with it.

**Project notes**: the workspace's shared written memory (requirements, decisions, data model), kept as files. Together with the files you upload for the assistant they form the *project knowledge*, listed beside the assistant chat in the Manager.

**Inform Heisenware**: the assistant's report card for a platform defect. Nothing is sent unless you click.

## Builder: its parts

**Explorer**: the Builder's left panel, with five tabs: Functions, Pages and actions, Files, Variables, Endpoints.

**Flowboard**: the Builder surface where you place and wire executors. It holds the logic of the whole App, which runs even when no page is open.

**Page editor**: the Builder surface where you design a page for each screen.

**Console**: the Builder's bottom panel. It holds the assistant.

**Theme editor**, **Template editor**, **Database editor**: the Builder's other editors: for the App's look, for PDF templates, and for looking into and editing the workspace's databases.

**Trace**: highlights what feeds a node (upstream), what it feeds (downstream), or both.

## Logic on the Flowboard

**Node**: anything placed on the Flowboard: an *executor node*, an *extension node*, a *section node* or an *annotation node*. Use the word sparingly, where the element on the board is meant rather than the concept.

**Flow**: a chain of wired executors that carries one piece of logic.

**Function**: one piece of code a class offers, e.g. `read` of the OPC UA client. You find functions in the Functions explorer; dragged onto the Flowboard, a function becomes an executor.

**Class**: a set of functions that belong together, e.g. `OpcuaClient`, `Counter`. A class can describe how to create instances of itself.
*Also called:* blueprint.

**Instance**: a living object of a class, such as a connection, a buffer or a counter, with a name. It exists from its creation until it is deleted, and every App of the workspace reaches it by its name.

**Function kinds**: *static function* (needs no instance), *constructor* (creates an instance), *destructor* (deletes one), *instance function* (acts on one instance), *subflow*.

**Tools**: the everyday functions the Flowboard toolbar offers directly: echo, memory, trigger, combine.

**Agent**: a program that offers classes to the platform. The *internal agents* come with Heisenware (Connectors, Utility Functions, Data Analysis). *Native agents*, *Docker agents* and *LXC agents* you install inside your own network, where they reach machines the platform can't.

**Executor**: calls one function on the Flowboard and manages everything around the call: where it runs (address), what goes in (inputs), when it runs (trigger), and what comes out (outputs).
*Also called:* executor node.

**Address**: where an executor's function lives: agent, class and, for instance functions, instance. Each part is fixed, or dynamic, taken from a value at run time; one executor can so reach many targets.

**Item**: any connection point of an executor: an input, the trigger, an output.

**Input**: a value the function receives, in the order of its arguments. It gets a default, a wire, a widget link or a `$variable`.
*Also called:* argument, parameter.

**Handler**: an input that is itself a function the backend calls back. An *event* is called again and again (`onChange`), a *callback* once.
*Also called:* listener.

**Trigger**: what makes an executor run. It holds a list of trigger sources; any one of them firing runs the executor. A value arriving at an input never runs it by itself.

**Trigger source**: one reason to run:
- *reactive*: an item receives a value, on every update, on change, on true, or when all have updated
- *lifecycle*: App start (with an interval: polling), App stop, browser reload
- *UI*: page load, widget event
- *subflow start*
- *manual*

**Hot input**: an input that also runs its executor whenever it receives a value.
*Also called:* reactive input.

**Polling**: running an executor at a fixed interval from App start.

**Loop**: running an executor once per element of a list, one after the other; results come back as a list. *Zip loop*: several lists together, row by row.
*Also called:* one by one.

**Output**: what an executor gives back: its *return*, and an *event output* for each value an event or callback delivers. Every output can carry wires, links and extensions.

**Wire**: a connection between two executors on the Flowboard, carrying a value from an output to an input or trigger.

**Extension**: a step attached to an output that works on its value: *modifier* (reshapes, JavaScript or JSONata), *filter* (lets it through or stops the branch; the platform's "if"), *recorder* (keeps its history), *error handler* (catches failures). Extensions chain into a pipeline.
*Also called:* extension node.

**Expression**: the single JavaScript expression in a modifier or filter, working on `x`.

**Scope**: where a value lives and a run happens:
- *shared*: one for the whole App
- *user*: one per connected user
- *call*: one per subflow call

Widget events run in the user's scope, while App start, polling and backend events run in the shared scope.

**Variable**: a named value of the App, used as `$name`. A static variable is a constant; a runtime variable is written by an output or extension and keeps its value. Variables never run anything themselves.

**Secret**: a variable or input whose value is masked everywhere, used for credentials.

**`$USER`**: the built-in variable naming the user whose scope a run happens in; empty in the shared scope.

**Endpoint**: an executor published under a stable public name so that other Apps and external systems can run it. Endpoints are the actions; variables are the values.

**Section**: a titled, colored frame around executors that form one stage of the logic. It is purely visual.
*Also called:* section node.

**Annotation**: a documentation card on the Flowboard (text, tables, pictures, diagrams) that explains more than one executor.
*Also called:* card, annotation node.

**Comment**: the short note on one executor or one extension, saying why it is there. It is shown on the node.

**Description**: an executor's function documentation, shown on hover; it comes from the function's code, not from you.

**Subflow**: a section published as a reusable executor. The *blueprint* holds the logic; each *caller* runs it in its own call scope.

**Status**: the colored dot on an executor: whether it is ready, slow, failed, or cannot reach its function.

## Pages and widgets

**Page**: one screen of an App, built from widgets. *Top-level pages* fill the navigation menu; a *subpage* hangs off one of them and is reached by a link.

**Screen**: one device class an App is designed for, such as Phone, Tablet or Desktop. An App enables some of them.

**Reference screen**: the screen you design first; the others follow it automatically until you arrange them yourself (*authored*).

**Pin**: gives one screen its own value for one widget setting; unpinned settings are shared by all screens. Some settings are *pinned by nature* because their right value depends on the screen.

**Widget**: an element on a page that shows data, takes input or starts something. The categories are display, input, trigger and layout.

**Text box**: a widget for static text (Markdown), such as titles, labels and instructions.

**General tab**: the first tab of every widget's settings, listing its properties under *Receives* and *Emits*.

**Property**: something about a widget that can be linked: a value it shows, or a value or event it emits.

**Setting**: something about a widget you configure in its settings, such as color, columns or scale.

**Link**: a connection between a widget property and an executor item, or between a button or output and a page or App action.
*Also called:* binding.

**Widget event**: something a user does to a widget, e.g. a click, that can fire triggers.

**Group**: a widget that holds other widgets (its *children*) and repeats them, one *tile* per data row.

**Tile**: one repetition of a group's children, showing one data row.

**Sticky**: a widget that stays where the screen puts it while the page scrolls beneath it: a header bar, a footer, a back-to-top button.

**Navigation menu**: how users move between top-level pages, e.g. bottom tabs or a drawer.

**App action**: an effect on the App itself: switch page, log out, reload, go back, open a link. Dropped on a button it runs on click; linked to an output it runs on every truthy value.

**Theme**: an App's look: a base theme plus the variables changed on it, such as accent, backgrounds, font and radius.

**Language**: the one language an App speaks, set in the Manager. An App in another language is another App, a translated copy.

## Building, testing, releasing

**Test**: runs the App in the Builder with its triggers armed; nothing changes for users.

**Deploy**: makes the current version the one users get.
*Also called:* release.

**Version**: a saved state of an App. A *checkpoint* is a version saved during building (by you or the assistant) to go back to; a *release* is a version deployed to users.

**Rollback**: makes a saved version the App's current state again.

**Bundle**: an App exported as a `.hwt` file, carrying its files but no secrets. It can be imported into another App or another platform.
*Also called:* `.hwt`.

**Suite**: several Apps that work together and share data through named instances and endpoints.

## Connecting and administering

**Native agent**: an agent built in the Manager for the host it runs on, with its credentials inside. It connects outbound only.

**Docker agent**: an agent as a container, with credentials passed in at start.

**LXC agent**: an agent for INSYS routers.

**Fleet**: native agents built under one fleet name and updated together.

**Rollout**: bringing a new build to the native agents of a fleet.

**Connector**: a class that talks to an external system or protocol (OPC UA, S7, MQTT, databases, …).

**Add-on**: an optional module that runs as its own container and brings new classes (RAG AI, SensorThings, your own code).

**Integration**: a login for something outside that connects to a workspace: an MQTT client, a VRPC client or an MCP connector.

**Access mode**: who can open an App:
- anyone
- anyone with the *master password*
- users who sign up
- users who sign up and know the master password
- invited users only

**Master password**: one password shared by everyone allowed into an App.

**Plan**: what the account may use and what it costs, shown under Plan & billing.

**Files**: the workspace's shared files (images, templates, uploads, agent builds, backups), managed in the Files explorer.

**VRPC**: the open-source protocol all parts of Heisenware talk over. Only developers need it.

<!-- /generated -->
