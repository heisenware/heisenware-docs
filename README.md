---
description: >-
  Overview of the Heisenware platform, architecture, core concepts, and key
  terminology.
layout:
  width: default
  title:
    visible: true
  description:
    visible: true
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
  metadata:
    visible: true
  tags:
    visible: true
  actions:
    visible: true
---

# Welcome

**Heisenware is an industrial application platform.** You build software visually and deploy it to production without writing boilerplate or setting up infrastructure. Underneath sits a full distributed architecture, so your Apps scale from a single machine to a whole plant. When you need to go deeper, you reach the code and configuration directly.

## The platform at a glance

Three core components cover the entire application lifecycle:

<table data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th><th data-hidden data-card-cover data-type="image">Cover image</th></tr></thead><tbody><tr><td><strong>App Manager</strong></td><td>Admin dashboard to create and manage Apps, members, and integrations.</td><td><a href="app-manager/overview.md">App Manager</a></td><td><a href=".gitbook/assets/App Manager in Browser preview.png">App Manager in Browser preview.png</a></td></tr><tr><td><strong>App Builder</strong></td><td>Visual programming interface to build and test custom software applications.</td><td><a href="app-builder/overview.md">App Builder</a></td><td><a href=".gitbook/assets/658shots_so.png">658shots_so.png</a></td></tr><tr><td><strong>Production Apps</strong></td><td>The live, end-user-facing Apps created and run with Heisenware.</td><td><a href="production-apps/overview.md">Production Apps</a></td><td><a href=".gitbook/assets/tracking.jpg">tracking.jpg</a></td></tr></tbody></table>

## Hosting and architecture

The [Heisenware architecture](account/hosting-and-architecture.md) consists of the central platform and optional [Agents](app-builder/build-backend/function-explorer/agents/). Each account (tenant) runs in isolation and supports two deployment modes:

* **Cloud deployment**: The recommended way to use Heisenware. We host your Apps on [Hetzner](https://www.hetzner.com/) in Germany.
* **On-premises deployment**: You run the entire platform as a Docker application on your local servers or private cloud.

Whichever mode you choose, [Agents](app-builder/build-backend/function-explorer/agents/) bridge separated networks for you. For example, when you host the platform in a corporate data center (IT) and need to reach machines in a secured shopfloor network (OT), an Agent opens the secure tunnel.

## See it in action

Watch how to build and operate industrial apps in Heisenware.

{% embed url="https://www.youtube.com/watch?v=MM4teGtbB7k" %}

## Engineering philosophy and core concepts

Heisenware is a visual programming environment. A few engineering concepts, all kept visible and under your control, make it click.

### Transparency and flexibility

Heisenware keeps the underlying complexity visible and reachable. When you need custom logic, it is there.

* **Visual with full code access:** You build logic visually in the [Backend Builder](app-builder/build-backend/) and still reach developer tools directly, like JavaScript expressions for data transformation and YAML for configuration.
* **Extensible**: When the built-in [functions](app-builder/build-backend/functions.md) fall short, you wrap your own code (Node.js, Python, C++) into Custom Extensions that become native functions.

### Object-oriented scalability

Heisenware uses an object-oriented model. You build logic once and instantiate it across an entire fleet of devices.

* **Classes (the blueprint)**: Reusable logic definitions, e.g. the [OPC UA client connector](app-builder/build-backend/function-explorer/connectors/opc-ua-client.md) or an [email connector](app-builder/build-backend/function-explorer/connectors/email.md).
* **Instances (the asset)**: Living, stateful copies of a class. You don't write code for machine A. You create an instance of the OPC UA client, name it `opcua-machine-a`, and give it the machine's IP and credentials.
* **Stateful context**: Member functions carry their own context, e.g. which server to use, so you pass no global variables.

### Native event-driven architecture

Industrial systems are asynchronous. Sensors spike, users click, and machines stop at unpredictable times. Heisenware Apps handle this natively.

* **Reactive logic**: [Backend flows](app-builder/build-backend/) do not run in a linear loop. They sit dormant until a specific trigger (an event) fires.
* **Event sources**: A trigger can be a user interaction (a UI event), a data change (e.g. a PLC tag update), or a system lifecycle event.
* **Non-blocking**: Your UI stays responsive while backend logic handles complex tasks asynchronously.

### Distributed connectivity

Heisenware closes the "OT vs. IT" network gap by treating local hardware as a first-class citizen of the cloud platform.

* **The bridge**: [Native Agents](app-builder/build-backend/function-explorer/agents/native-agent.md) and [Docker Agents](app-builder/build-backend/function-explorer/agents/docker-agent.md) securely connect local, private networks (OT/shopfloor) to the cloud without VPNs.
* **Local execution**: You push backend logic ([connectors](app-builder/build-backend/function-explorer/connectors/)) to run locally on the edge device, and the platform treats these remote functions exactly like cloud functions.

### Unified data binding

Heisenware removes the "glue code" you would normally write to connect a frontend to a backend.

* **Direct linking**: In the [App Builder](app-builder/overview.md), you connect a backend function's output straight to a frontend [widget's](app-builder/build-frontend/widgets/) property.
* **Reactive UI**: When backend data changes (e.g. a new sensor reading), the bound widget re-renders to reflect the new state.

<figure><img src=".gitbook/assets/Data Binding Basics.gif" alt=""><figcaption></figcaption></figure>

## Glossary

A quick-reference list of specific terms and concepts used across the Heisenware platform.

<table><thead><tr><th width="195.99176025390625">Term</th><th>Description</th></tr></thead><tbody><tr><td><strong>Account</strong></td><td>The top-level organizational container representing a tenant (e.g., <code>acme.heisenware.cloud</code>). It houses all workspaces, members, and shared resources.</td></tr><tr><td><a href="app-builder/build-backend/function-explorer/agents/"><strong>Agent</strong></a></td><td>A secure, industrial-grade bridge running as a local service (Native, Docker, or LXC) within a private network. It tunnels data from local edge protocols (e.g., OPC UA, Modbus, S7) to the cloud workspace.</td></tr><tr><td><strong>App</strong></td><td>A standalone Progressive Web App (PWA), built, tested, and deployed entirely within Heisenware.</td></tr><tr><td><a href="app-builder/overview.md"><strong>App Builder</strong></a></td><td>The visual development environment where members design, build, test, and deploy Apps.</td></tr><tr><td><a href="app-manager/overview.md"><strong>App Manager</strong></a></td><td>The central administrative dashboard for managing accounts, workspaces, Apps, members, and inbound integrations.</td></tr><tr><td><a href="app-builder/build-backend/"><strong>Backend Builder</strong></a></td><td>The infinite canvas within the App Builder where developers create event-driven business logic by wiring functions together into reactive flows.</td></tr><tr><td><strong>Class</strong></td><td>A reusable logic definition, or blueprint, that you instantiate to create working copies. Examples include the OPC UA client connector and the email connector.</td></tr><tr><td><strong>Code Adapter</strong></td><td>Developer-written code (using Node.js, Python, C++, etc.) that wraps existing software libraries or algorithms so they can be integrated into Heisenware as Custom Extensions.</td></tr><tr><td><strong>Custom Extension</strong></td><td>A containerized module (typically built via a Code Adapter) loaded into the platform to expand native functionality with custom, proprietary backend tools.</td></tr><tr><td><strong>Data Visualizer</strong></td><td>A tool for exploring your databases directly, both on-board and connected external ones. You view, filter, and visualize entries without building an App. Coming in v93.</td></tr><tr><td><strong>Deployment</strong></td><td>Publishing a specific version of an App, moving it from the App Builder environment to a live state accessible to users.</td></tr><tr><td><strong>Domain</strong></td><td>The unique identifier combining your account and workspace (e.g., <code>acme.default</code>) used for internal routing and API integrations.</td></tr><tr><td><strong>Event</strong></td><td>A specific trigger, such as a user click, a data update, or a schedule interval, that initiates the execution of a flow in the backend.</td></tr><tr><td><a href="app-builder/build-backend/file-explorer.md"><strong>File Explorer</strong></a></td><td>The panel in the App Builder used to upload, store, and manage static assets and files (e.g., images, CSVs, PDF templates) for use in your Apps.</td></tr><tr><td><a href="app-builder/build-backend/filter.md"><strong>Filter</strong></a></td><td>An extension node that evaluates a boolean JavaScript expression to act as a logical gate, conditionally halting or allowing a data flow.</td></tr><tr><td><strong>Flow</strong></td><td>A reactive, event-driven sequence of connected functions that executes business logic in the Backend Builder.</td></tr><tr><td><a href="app-builder/build-frontend/"><strong>Frontend Builder</strong></a></td><td>The page-specific visual design canvas within the App Builder where developers compose responsive user interfaces from widgets and static elements.</td></tr><tr><td><strong>Function</strong></td><td>An atomic, visual building block in the Backend Builder representing executable code that performs a specific task (e.g., database queries, API calls, hardware control).</td></tr><tr><td><a href="app-builder/build-backend/function-explorer/"><strong>Function Explorer</strong></a></td><td>The structural repository panel in the App Builder containing all available functions, organized by categories like connectors, storage, utilities, and extensions.</td></tr><tr><td><strong>Instance</strong></td><td>A living, stateful copy of a class, configured for a specific asset. For example, an instance of the OPC UA client named <code>opcua-machine-a</code> holds one machine's IP and credentials.</td></tr><tr><td><strong>Integration</strong></td><td>A configured, authorized entry point that lets external systems, MQTT clients, or VRPC clients securely send data to a Heisenware workspace.</td></tr><tr><td><strong>JavaScript expression</strong></td><td>Standard JavaScript logic evaluated on-the-fly within modifiers or filters to perform calculations, condition checks, or array manipulations.</td></tr><tr><td><strong>JSONata</strong></td><td>A lightweight query and transformation language natively supported in Heisenware for efficiently restructuring JSON data payloads.</td></tr><tr><td><strong>Member</strong></td><td>A developer, engineer, or administrator with access to the Heisenware platform to build and manage Apps (strictly distinct from a user).</td></tr><tr><td><a href="app-builder/build-backend/modifier.md"><strong>Modifier</strong></a></td><td>An extension node that transforms or reshapes data on-the-fly as it passes from one function to the next within a flow.</td></tr><tr><td><a href="app-builder/build-frontend/page-explorer.md"><strong>Page Explorer</strong></a></td><td>The panel in the App Builder used to structure an application's hierarchy by creating, duplicating, and organizing pages and subpages.</td></tr><tr><td><a href="app-builder/build-frontend/pdf-template-editor.md"><strong>PDF Template Editor</strong></a></td><td>The tool in the App Builder for designing PDF templates that the <code>fillTemplate</code> function populates with dynamic data at runtime.</td></tr><tr><td><strong>Property</strong></td><td>Anything about a widget that can change, including its value, scale, visibility, and color. Any property can be bound to backend logic to drive the UI dynamically.</td></tr><tr><td><strong>PWA (Progressive Web App)</strong></td><td>A modern web application standard that provides a native app-like experience (installable, responsive, offline-capable) directly from any web browser.</td></tr><tr><td><a href="app-builder/deploy-and-maintain.md"><strong>Tag</strong></a></td><td>A named, point-in-time snapshot of an App's configuration (logic, UI, and bindings) that you can export, restore, or use as a template blueprint.</td></tr><tr><td><a href="app-builder/build-frontend/theme-editor.md"><strong>Theme Editor</strong></a></td><td>The tool in the App Builder for defining an App's colors, fonts, and visual styling, applied consistently across its pages and widgets.</td></tr><tr><td><strong>User</strong></td><td>An end-user who logs in or otherwise interacts with a live, published Heisenware App (strictly distinct from a member).</td></tr><tr><td><a href="https://vrpc.io/"><strong>VRPC (Variadic Remote Procedure Call)</strong></a></td><td>The open-source, asynchronous communication protocol over MQTT that powers all distributed data exchange and remote function calls within the Heisenware ecosystem.</td></tr><tr><td><a href="app-builder/build-frontend/widgets/"><strong>Widget</strong></a></td><td>An interactive or display-oriented visual component (e.g., a chart, button, or form) placed in the Frontend Builder to construct the user interface.</td></tr><tr><td><strong>Workspace</strong></td><td>A dedicated sub-container within an account used to securely isolate related Apps, databases, files, and members from one another.</td></tr><tr><td><strong>YAML</strong></td><td>A human-readable data serialization language used extensively in the Backend Builder for quickly configuring static function inputs and data structures.</td></tr></tbody></table>
