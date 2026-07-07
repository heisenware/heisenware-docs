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

# Heisenware Product Docs

**Heisenware is an industrial application platform.** You build software visually and deploy it to production without writing boilerplate or setting up infrastructure. Underneath sits a full distributed architecture, so your apps scale from a single machine to a whole plant. When you need to go deeper, you keep direct access to the code and configuration.

## The platform at a glance

Heisenware is divided into three core components that cover the entire application lifecycle:

<table data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th><th data-hidden data-card-cover data-type="image">Cover image</th></tr></thead><tbody><tr><td><strong>APP MANAGER</strong></td><td>Admin dashboard to create and manage apps, members, and integrations.</td><td><a href="https://app.gitbook.com/s/E5Ketpww1s7TauSAJrJ8/app-manager">App Manager</a></td><td><a href=".gitbook/assets/App Manager in Browser preview.png">App Manager in Browser preview.png</a></td></tr><tr><td><strong>APP BUILDER</strong></td><td>Visual programming interface to build and test custom software applications.</td><td><a href="https://app.gitbook.com/s/E5Ketpww1s7TauSAJrJ8/app-builder">App Builder</a></td><td><a href=".gitbook/assets/658shots_so.png">658shots_so.png</a></td></tr><tr><td><strong>PRODUCTION APPS</strong></td><td>The live, end-user-facing applications created and run with Heisenware.</td><td><a href="https://app.gitbook.com/s/E5Ketpww1s7TauSAJrJ8/production-apps">Production Apps</a></td><td><a href=".gitbook/assets/tracking.jpg">tracking.jpg</a></td></tr></tbody></table>

## Hosting and architecture

The [Heisenware architecture](account/hosting-and-architecture.md) consists of the central platform and optional Agents. Each account (tenant) runs in isolation and supports two deployment modes:

* **Cloud deployment**: The recommended way to use Heisenware. Your apps are hosted by us on [Hetzner](https://www.hetzner.com/) in Germany.
* **On-premises deployment**: You run the entire platform as a Docker application on your own local servers or private cloud.&#x20;

Regardless of the deployment mode, you can use Agents to bridge separated networks. For example, if you host the platform in a corporate data center (IT) and need to access machines in a secured shopfloor network (OT), an Agent acts as the secure tunnel.

### See it in action

See how to build and operate industrial applications in Heisenware.

{% embed url="https://www.youtube.com/watch?v=MM4teGtbB7k" %}

## Engineering philosophy & core concepts

Heisenware is a visual programming environment. Mastering the platform requires understanding its engineering concepts.

### Transparency & flexibility

Heisenware keeps the underlying complexity visible and reachable. When you need custom logic, it is there.

* **Visual with full code access:** You build logic visually using the Backend Builder, but you retain direct access to developer tools like JavaScript expressions for data transformation and YAML for configuration.
* **Extensible**: When the built-in Functions are not enough, you wrap your own code (Node.js, Python, C++) into extensions that become native Functions.

### Object-oriented scalability

Heisenware uses an object-oriented model. You build logic once and instantiate it across an entire fleet.

* **Classes (the blueprint)**: Reusable logic definitions (e.g., an `email` class or a generic `Machine` connector).
* **Instances (the asset)**: Living, stateful copies of a class. You don't write code for "Machine A". You instantiate the `Machine` class with Machine A's specific IP and credentials.
* **Stateful context**: Member functions know their context (e.g., _which_ server to use) without passing global variables.

### Native event-driven architecture

Industrial systems are asynchronous. Sensors spike, users click, and machines stop at unpredictable times. Heisenware applications are natively event-driven.

* **Reactive logic**: Backend flows do not run in a linear loop. They sit dormant until a specific trigger (an event) fires.
* **Event sources**: Triggers can be user interactions (UI events), data changes (e.g., a PLC tag update), or system lifecycle events.
* **Non-blocking**: This ensures your UI remains responsive while backend logic handles complex tasks asynchronously.

### Distributed connectivity

We solve the "OT vs. IT" network gap by treating local hardware as a first-class citizen of the cloud platform.

* **The bridge**: Through Native Agents and Docker Agents, we securely bridge local, private networks (OT/Shopfloor) to the cloud without VPNs.
* **Local execution**: You can push backend logic (connectors) to run _locally_ on the edge device. The platform treats these remote Functions the same as cloud Functions.

### Unified data binding

We eliminate the "glue code" typically needed to connect a frontend to a backend.

* **Direct linking**: In the App Builder, you connect a backend Function's Output directly to a frontend Widget's property.
* **Reactive UI**: When backend data changes (e.g., a new sensor reading), the bound UI widget automatically re-renders to reflect the new state.

<figure><img src=".gitbook/assets/Data Binding Basics.gif" alt=""><figcaption></figcaption></figure>

## Glossary of Terms

A quick-reference list of specific terms and concepts used across the Heisenware platform.

<table><thead><tr><th width="195.99176025390625">Term</th><th>Description</th></tr></thead><tbody><tr><td><strong>Account</strong></td><td>The top-level organizational container representing a tenant (e.g., <code>acme.heisenware.cloud</code>). It houses all workspaces, members, and shared resources.</td></tr><tr><td><strong>Agent</strong></td><td>A secure, industrial-grade bridge running as a local service (Native, Docker, or LXC) within a private network. It securely tunnels data from local edge protocols (e.g., OPC UA, Modbus, S7) to the cloud workspace.</td></tr><tr><td><strong>App</strong></td><td>A standalone, Progressive Web App (PWA) software application built, tested, and deployed entirely within Heisenware.</td></tr><tr><td><strong>App Builder</strong></td><td>The comprehensive visual development environment where Members design, build, test, and deploy applications.</td></tr><tr><td><strong>App Manager</strong></td><td>The central administrative dashboard for managing accounts, workspaces, apps, members, and inbound integrations.</td></tr><tr><td><strong>Backend Builder</strong></td><td>The infinite canvas within the App Builder where developers create event-driven business logic by wiring together Functions into reactive flows.</td></tr><tr><td><strong>Code Adapter</strong></td><td>Developer-written code (using Node.js, Python, C++, etc.) that wraps existing software libraries or algorithms so they can be integrated into Heisenware as Custom Extensions.</td></tr><tr><td><strong>Custom Extension</strong></td><td>A containerized module (typically built via a Code Adapter) loaded into the platform to expand native functionality with custom, proprietary backend tools.</td></tr><tr><td><strong>Deployment</strong></td><td>The process of publishing a specific version of an app, transitioning it from the App Builder environment to a live state accessible to Users.</td></tr><tr><td><strong>Domain</strong></td><td>The unique identifier combining your account and workspace (e.g., <code>acme.default</code>) used for internal routing and API integrations.</td></tr><tr><td><strong>Event</strong></td><td>A specific trigger, such as a user click, a data update, or a schedule interval, that initiates the execution of a Function flow in the backend.</td></tr><tr><td><strong>File Explorer</strong></td><td>The panel in the App Builder used to upload, store, and manage static assets and files (e.g., images, CSVs, PDF templates) for use in your applications.</td></tr><tr><td><strong>Filter</strong></td><td>A Function extension that evaluates a boolean JavaScript expression to act as a logical gate, conditionally halting or allowing the continuation of a data flow.</td></tr><tr><td><strong>Flow</strong></td><td>A reactive, event-driven sequence of connected Functions executing business logic in the Backend Builder.</td></tr><tr><td><strong>Frontend Builder</strong></td><td>The page-specific visual design canvas within the App Builder where developers compose responsive user interfaces using widgets and static elements.</td></tr><tr><td><strong>Function</strong></td><td>An atomic, visual building block in the Backend Builder representing executable code that performs specific tasks (e.g., database queries, API calls, hardware control).</td></tr><tr><td><strong>Function Explorer</strong></td><td>The structural repository panel in the App Builder containing all available Functions, organized by categories like Connectors, Storage, Utilities, and Extensions.</td></tr><tr><td><strong>Integration</strong></td><td>A configured, authorized entry point allowing external systems, MQTT clients, or VRPC clients to securely send data to a Heisenware workspace.</td></tr><tr><td><strong>JavaScript Expression</strong></td><td>Standard JavaScript logic evaluated on-the-fly within Modifiers or Filters to perform calculations, condition checks, or array manipulations.</td></tr><tr><td><strong>JSONata</strong></td><td>A lightweight query and transformation language natively supported in Heisenware for efficiently restructuring JSON data payloads.</td></tr><tr><td><strong>Member</strong></td><td>A developer, engineer, or administrator with access to the Heisenware platform to build and manage applications (strictly distinct from a User).</td></tr><tr><td><strong>Modifier</strong></td><td>A Function extension that transforms or reshapes data on-the-fly as it passes from one Function to the next within a flow.</td></tr><tr><td><strong>Page Explorer</strong></td><td>The panel in the App Builder used to structure an application's hierarchy by creating, duplicating, and organizing pages and subpages.</td></tr><tr><td><strong>Property</strong></td><td>A configurable setting of a UI widget that determines its behavior, data binding, or visual appearance.</td></tr><tr><td><strong>PWA (Progressive Web App)</strong></td><td>A modern web application standard that provides a native app-like experience (installable, responsive, offline-capable) directly from any web browser.</td></tr><tr><td><strong>Tag (Versioning)</strong></td><td>A named, point-in-time snapshot of an app's configuration (logic, UI, and bindings) that can be exported, restored, or used as a template blueprint.</td></tr><tr><td><strong>User</strong></td><td>An end-user who logs in or otherwise interacts with a live, published Heisenware app (strictly distinct from a Member).</td></tr><tr><td><strong>VRPC (Variadic Remote Procedure Call)</strong></td><td>The open-source, asynchronous communication protocol over MQTT that powers all distributed data exchange and remote function calls within the Heisenware ecosystem.</td></tr><tr><td><strong>Widget</strong></td><td>An interactive or display-oriented visual component (e.g., a chart, button, or form) placed in the Frontend Builder to construct the user interface.</td></tr><tr><td><strong>Workspace</strong></td><td>A dedicated sub-container within an Account used to securely isolate related apps, databases, files, and members from one another.</td></tr><tr><td><strong>YAML</strong></td><td>A human-readable data serialization language used extensively in the Backend Builder for quickly configuring static Function Inputs and data structures.</td></tr></tbody></table>
