# Flowboard

The backend is the working core of your App. It fetches, processes, and stores data, talks to machines and external systems, and drives everything users see in the UI. You build it visually by wiring executors into flows on the Flowboard.

{% hint style="info" %}
#### Always-on logic

Backend logic runs in the background, even when no user has the App open. This makes the backend the central hub for continuous data processing and system monitoring.
{% endhint %}

## Core backend components

* [**Functions**](../../concepts/executors-and-instances.md): The atomic building blocks of your logic. They fetch data, process information, manage databases, and control devices. Find them all in the [Functions explorer](../explorers/functions.md).
* [**Extensions**](../../concepts/extensions-branching-and-errors.md): Modifiers, filters, recorders, and error handlers that refine data directly inside a flow.
* [**Agents**](../../concepts/agents-and-where-code-runs.md): Programs that run logic (like connectors) directly inside a local network, for example on a factory floor, and tunnel the data securely into your backend.
* [**Files**](../explorers/files.md): CSVs, PDFs, images, and other resources your logic or UI reads from and writes to. Manage them in the Files explorer.

## Working on the Flowboard

Turn individual functions into automated flows. Drag functions onto the Flowboard, where each becomes an executor, and wire the executors together. Data moves directly from one executor's output to the next executor's input, creating reactive, event-driven sequences. Executors and their extensions are the building blocks of every flow.

### Adding functions

* **From the Explorer**: Drag functions from the [Functions explorer](../explorers/functions.md) in the left panel onto the Flowboard.
* **Quick access**: Use the toolbar for the everyday tools `echo`, `memory`, `trigger`, and `combine`.

<figure><img src="../../.gitbook/assets/memory_flow_builder_looped.gif" alt="" width="563"><figcaption></figcaption></figure>

### Sequencing functions

Create flows by drawing wires between executors. Click the output of an executor (or a [modifier](modifier.md) attached to it) and drag the wire to the part of the next executor that receives it.

* **Output to trigger**: The completion of the first executor runs the second, without handing over data.
* **Output to input**: Hands over specific data to the next executor.
* **Hot inputs**: You can connect an input to its own trigger. The executor then runs automatically whenever that input value updates.

Executors only run when they receive a trigger or a data update. One output can drive multiple executors, and inputs can receive data from many sources across the Flowboard or the pages.

{% hint style="info" %}
#### Session isolation

Executors and flows run in isolation for each user session. Each session keeps its own state and execution path, so data processing for one user or machine never interferes with another.
{% endhint %}

### Grouping (sections)

Keep a growing Flowboard clean with sections. Select multiple executors and click the group icon in the toolbar to frame them in a named section that you can collapse to save space. Sections are a visual aid only and have no impact on how the logic runs.

To bundle executors into one reusable executor instead, use a [subflow](../../concepts/subflows.md).

<figure><img src="../../.gitbook/assets/gruppieren_functions_2_looped.gif" alt="" width="563"><figcaption></figcaption></figure>

### Annotations

Place documentation cards anywhere on the Flowboard using the annotation tool, for example to sketch the architecture of an App, explain a logic path that spans several executors, or leave instructions for other members.

A card holds rich text: headings, lists, tables, quotes, code blocks, links, and pictures from the media library. Double-click a card to edit it in the panel; a code block in the `mermaid` language is drawn as a diagram. The palette in the panel header tints the card, for example in the color of the section it explains. Cards keep the width you give them and grow with their content. Zoomed out, the text lifts a little to stay legible but never leaves its card.

The AI assistant writes annotations in Markdown, including tables, images, and Mermaid diagrams.

<figure><img src="../../.gitbook/assets/Annotation_looped.gif" alt="" width="563"><figcaption></figcaption></figure>

### Tidying the Flowboard

The Flowboard previews layout changes before applying them: every moved node turns orange. Confirm the new layout with the check icon or revert it with the round arrow icon; both icons appear in the toolbar.

* **Clear Collisions** (snowplow): Moves executors, extension nodes, sections, and other nodes just enough to remove overlaps between them. Start it from the toolbar.
* **Auto-Format All**: Rebuilds the entire layout. An algorithm groups connected logic into islands and arranges all elements for readability. Start it from the toolbar.
* **Placing new nodes**: When you drop a new executor or extension node onto the Flowboard, nearby nodes shift automatically to make room. Confirm or revert the shift the same way.

### Navigating the Flowboard

* **Panning**: Use your trackpad, or hold Shift + mouse wheel for horizontal movement and the mouse wheel alone for vertical movement. You can also pan with WASD on your keyboard.
* **Zooming**: Use trackpad pinch-to-zoom or hold Ctrl + mouse wheel. You can also zoom with Q and E on your keyboard.

{% hint style="info" %}
Customize these controls (like mouse wheel behavior) in the [App Builder settings](../README.md#app-builder-settings).
{% endhint %}

### Search and replace

Change the configuration of many executors at once. Select at least two executors to activate the search and replace tool in the toolbar, then find a specific string (such as a device's IP address) and replace it with a new value across the whole selection.

{% hint style="warning" %}
Search and replace currently only supports strings without spaces.
{% endhint %}

<figure><img src="../../.gitbook/assets/search_in_function_and_replace_2_looped.gif" alt="" width="563"><figcaption></figcaption></figure>
