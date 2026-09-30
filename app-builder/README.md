# App Builder tour

The App Builder is a core component of the Heisenware platform: a visual development environment where you build, test, and deploy Apps. You open it straight from the App Manager, and it focuses on one App at a time.

## Main interfaces

The App Builder splits into four areas that cover the App lifecycle and development workflow.

* **Top bar (top)**: Opens the [Theme editor](theme-editor.md) and [Template editor](template-editor.md), and gives access to App Builder settings and help. It also shows the current App version and holds the controls to [test and deploy](test-and-deploy.md).
* **Explorers (left)**: Switch between the [Functions explorer](explorers/functions.md) for backend logic, the [Pages and actions explorer](explorers/pages.md) for frontend structure, and the [Files explorer](explorers/files.md) for resources needed during App development.
* **Flowboard (center)**: An infinite drawing area where you create the [business logic](flowboard/README.md) of your entire App by wiring executors into automated flows.
* **Page editor (right)**: Where you [build the user interface (UI)](page-editor.md) of each page for all screen sizes, from text, images, and interactive widgets.

The footer along the bottom shows who is signed in, the App and domain you are working in, the App's language, which is set in the [App Manager](../app-manager/README.md#app-settings), and the base theme the [Theme editor](theme-editor.md) compiles the App's look from.

<figure><img src="../.gitbook/assets/image (512).png" alt=""><figcaption></figcaption></figure>

## How it works

Heisenware uses an integrated development process. Rather than working in isolated stages, you build logic, design interfaces, and configure data connections simultaneously within a single environment.

### Build backend

On the [Flowboard](flowboard/README.md) you create event-driven logic by dragging [functions](../concepts/executors-and-instances.md) from the [Functions explorer](explorers/functions.md) onto it, where each becomes an executor, and wiring the executors into flows. Functions are the atomic building blocks of an App: standard utility functions, industrial drivers, and custom Code Adapters written in Node.js, Python, or C++.

This logic runs in a global scope. It persists and runs independently of the active UI page, which makes the backend the central hub for continuous data processing or system monitoring. To reach machines and databases in isolated networks, you configure [native agents](../app-manager/agents/native-agent.md) or [Docker agents](../app-manager/agents/docker-agent.md) that tunnel data from local systems directly into your App's logic.

### Build frontend

In the [Page editor](page-editor.md) you design your UI per page and across different screen sizes, much like in presentation tools such as Google Slides or PowerPoint. You use the [Pages and actions explorer](explorers/pages.md) to create, nest, and organize your pages, then switch to the page you want to edit.

You compose each page from widgets, such as gauges, charts, and input fields, that you drag onto the page. To keep every page and widget visually consistent, the Theme editor defines the styles and colors that apply across the whole App.

### Linking widgets and logic

At the heart of the App Builder are links: connect almost any element to any other and data flows between the App's interface and its logic in both directions.

* **Connect anything to everything**: Link a button to an executor's trigger, an input field to an executor's inputs, or an executor's output to a widget to visualize data, toggle a button's state, or update a gauge's value.
* **Property and event links**: A property is anything about a widget that can be linked, such as its value, scale, visibility, or color. Link logic to any property, or to a widget's events, to drive the UI.
* **Reactive synchronization**: No manual glue code. Interface and logic stay in sync in real time as data flows through the App.

<figure><img src="../.gitbook/assets/Data Binding Basics.gif" alt=""><figcaption></figcaption></figure>

## App Builder settings

Customize how the App Builder behaves and how you move around the Flowboard. To access these preferences, click the settings icon in the top bar.

<figure><img src="../.gitbook/assets/image (31).png" alt="" width="367"><figcaption></figcaption></figure>

### Viewport controls

Defines the navigation logic of the Flowboard. Choose between two modes:

* **Design-tool-like**: Mimics the behavior of tools like Figma or Miro.
* **Google-maps-tool**: Navigation behaves like an interactive map.

### Grid and snapping

* **Grid size**: Defines the size of the Flowboard grid.
* **Snap to grid**: When enabled, nodes align to the grid for a cleaner layout. Setting the grid size to 0 disables snapping entirely.

### Navigation (WASD)

Fine-tune keyboard navigation on the Flowboard:

* **Invert WASD controls**: Switches the direction of the W, A, S, and D keys. By default, W is up and S is down.
* **Pan speed**: Controls how fast the camera moves across the Flowboard when using WASD.
* **Zoom speed**: Controls the sensitivity of the Q (zoom out) and E (zoom in) keys.

### Default modifier type

Every time you add a [modifier](flowboard/modifier.md), Heisenware defaults to a specific type. Choose which one appears first:

* **JSONata**: Ideal for data transformation and querying.
* **JavaScript**: Use this if you prefer writing standard JS logic for your modifiers.

### Debug backend

Enables advanced backend debugging.

{% hint style="danger" %}
This setting should typically remain off. It is intended for support cases when working directly with the Heisenware technical team.
{% endhint %}
