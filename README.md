# Heisenware Product Docs

**Heisenware is the industrial application platform for engineers who build real software.** It combines the speed of visual development with the power of a full-stack environment. Unlike restrictive no-code tools, Heisenware exposes a sophisticated, distributed architecture designed for industrial scalability. It allows you to build, deploy, and manage production-grade applications without the overhead of boilerplate code and complex infrastructure setup.

## The platform at a glance

Heisenware is divided into three core components that cover the entire application lifecycle:

<table data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th><th data-hidden data-card-cover data-type="image">Cover image</th></tr></thead><tbody><tr><td><strong>APP MANAGER</strong></td><td>Admin dashboard to create and manage apps, members, and integrations.</td><td><a href="https://app.gitbook.com/s/E5Ketpww1s7TauSAJrJ8/app-manager">App Manager</a></td><td><a href=".gitbook/assets/App Manager in Browser preview.png">App Manager in Browser preview.png</a></td></tr><tr><td><strong>APP BUILDER</strong></td><td>Visual programming interface to build and test custom software applications.</td><td><a href="https://app.gitbook.com/s/E5Ketpww1s7TauSAJrJ8/app-builder">App Builder</a></td><td><a href=".gitbook/assets/658shots_so.png">658shots_so.png</a></td></tr><tr><td><strong>PRODUCTION APPS</strong></td><td>The live, end-user-facing applications created and run with Heisenware.</td><td><a href="https://app.gitbook.com/s/E5Ketpww1s7TauSAJrJ8/production-apps">Production Apps</a></td><td><a href=".gitbook/assets/tracking.jpg">tracking.jpg</a></td></tr></tbody></table>

### Hosting & architecture

The [Heisenware architecture](account/hosting-and-architecture.md) consists of the central platform and optional agents. Each account (tenant) runs in isolation and supports two deployment modes:

- **Cloud deployment**: The recommended way to use Heisenware. Your apps are hosted by us on Hetzner Online GmbH in Germany.
- **On-premises deployment**: You run the entire platform as a Docker application on your own local servers or private cloud.

Regardless of the deployment mode, you can use [Edge Agents](app-builder/build-backend/function-explorer/agents/) to bridge separated networks. For example, if you host the platform in a corporate data center (IT) and need to access machines in a secured shopfloor network (OT), an agent acts as the secure tunnel.

### See it in action

See how to build and operate industrial applications in Heisenware.

{% embed url="https://www.youtube.com/watch?v=MM4teGtbB7k" %}

## Engineering philosophy & core concepts

Heisenware is not just a drag-and-drop interface. It is a visual programming environment. Mastering the platform requires understanding the engineering concepts we expose rather than hide.

### Transparency & flexibility

Standard no-code platforms often act as "black boxes" by abstracting complexity so heavily that you hit a wall when you need custom logic. Heisenware operates transparently.

- **Visual, yet code-capable:** You build logic visually using the Flow builder, but you retain direct access to developer tools like JavaScript expressions for data transformation and YAML for configuration.
- **No "no-code cliff"**: When pre-built Functions aren't enough, you don't hack workarounds. You extend the platform by wrapping your code (Node.js, Python, C++) into extensions that become native Functions.

### Object-oriented scalability

Unlike linear scripting tools that struggle to manage multiple devices, Heisenware uses a strict object-oriented model. This allows you to build logic once and instantiate it across an entire fleet.

- **Classes (the blueprint)**: Reusable logic definitions (e.g., an `email` class or a generic `Machine` connector).
- **Instances (the asset)**: Living, stateful copies of a class. You don't write code for "Machine A". You instantiate the `Machine` class with Machine A's specific IP and credentials.
- **Stateful context**: Member functions know their context (e.g., _which_ server to use) without passing global variables.

### Native event-driven architecture

Industrial systems are asynchronous. Sensors spike, users click, and machines stop at unpredictable times. Heisenware applications are natively event-driven.

- **Reactive logic**: Backend flows do not run in a linear loop. They sit dormant until a specific trigger (an event) fires.
- **Event sources**: Triggers can be user interactions (UI events), data changes (e.g., a PLC tag update), or system lifecycle events.
- **Non-blocking**: This ensures your UI remains responsive while backend logic handles complex tasks asynchronously.

### Distributed connectivity

We solve the "OT vs. IT" network gap by treating local hardware as a first-class citizen of the cloud platform.

- **The bridge**: Through Native Agents and Docker agents, we securely bridge local, private networks (OT/Shopfloor) to the cloud without VPNs.
- **Local execution**: You can push backend logic (connectors) to run _locally_ on the edge device. The platform treats these remote Functions the same as cloud Functions.

### Unified data binding

We eliminate the "glue code" typically needed to connect a frontend to a backend.

- **Direct linking**: In the App Builder, you connect a backend Function's output directly to a frontend widget's property.
- **Reactive UI**: When backend data changes (e.g., a new sensor reading), the bound UI widget automatically re-renders to reflect the new state.

<figure><img src=".gitbook/assets/Data Binding Basics.gif" alt=""><figcaption></figcaption></figure>

## Glossary of Terms

A quick-reference list of specific terms and concepts used across the Heisenware platform.

| Term                                       | Description                                                                                                                                                                                                           |
| :----------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Account**                                | The top-level organizational container representing a tenant (e.g., `acme.heisenware.cloud`). It houses all workspaces, members, and shared resources.                                                                |
| **Agent**                                  | A secure, industrial-grade bridge running as a local service (Native, Docker, or LXC) within a private network. It securely tunnels data from local edge protocols (e.g., OPC UA, Modbus, S7) to the cloud workspace. |
| **App**                                    | A standalone, Progressive Web App (PWA) software application built, tested, and deployed entirely within Heisenware.                                                                                                  |
| **App Builder**                            | The comprehensive visual development environment where Members design, build, test, and deploy applications.                                                                                                          |
| **App Manager**                            | The central administrative dashboard for managing accounts, workspaces, apps, members, and inbound integrations.                                                                                                      |
| **Backend Builder**                        | The infinite canvas within the App Builder where developers create event-driven business logic by wiring together Functions into reactive flows.                                                                      |
| **Code Adapter**                           | Developer-written code (using Node.js, Python, C++, etc.) that wraps existing software libraries or algorithms so they can be integrated into Heisenware as Custom Extensions.                                        |
| **Custom Extension**                       | A containerized module (typically built via a Code Adapter) loaded into the platform to expand native functionality with custom, proprietary backend tools.                                                           |
| **Deployment**                             | The process of publishing a specific version of an app, transitioning it from the App Builder environment to a live state accessible to Users.                                                                        |
| **Domain**                                 | The unique identifier combining your account and workspace (e.g., `acme.default`) used for internal routing and API integrations.                                                                                     |
| **Event**                                  | A specific trigger—such as a user click, a data update, or a schedule interval—that initiates the execution of a Function flow in the backend.                                                                        |
| **File Explorer**                          | The panel in the App Builder used to upload, store, and manage static assets and files (e.g., images, CSVs, PDF templates) for use in your applications.                                                              |
| **Filter**                                 | A Function extension that evaluates a boolean JavaScript expression to act as a logical gate, conditionally halting or allowing the continuation of a data flow.                                                      |
| **Flow**                                   | A reactive, event-driven sequence of connected Functions executing business logic in the Backend Builder.                                                                                                             |
| **Frontend Builder**                       | The page-specific visual design canvas within the App Builder where developers compose responsive user interfaces using widgets and static elements.                                                                  |
| **Function**                               | An atomic, visual building block in the Backend Builder representing executable code that performs specific tasks (e.g., database queries, API calls, hardware control).                                              |
| **Function Explorer**                      | The structural repository panel in the App Builder containing all available Functions, organized by categories like Connectors, Storage, Utilities, and Extensions.                                                   |
| **Integration**                            | A configured, authorized entry point allowing external systems, MQTT clients, or VRPC clients to securely send data to a Heisenware workspace.                                                                        |
| **JavaScript Expression**                  | Standard JavaScript logic evaluated on-the-fly within Modifiers or Filters to perform calculations, condition checks, or array manipulations.                                                                         |
| **JSONata**                                | A lightweight query and transformation language natively supported in Heisenware for efficiently restructuring JSON data payloads.                                                                                    |
| **Member**                                 | A developer, engineer, or administrator with access to the Heisenware platform to build and manage applications (strictly distinct from a User).                                                                      |
| **Modifier**                               | A Function extension that transforms or reshapes data on-the-fly as it passes from one Function to the next within a flow.                                                                                            |
| **Page Explorer**                          | The panel in the App Builder used to structure an application's hierarchy by creating, duplicating, and organizing pages and subpages.                                                                                |
| **Property**                               | A configurable setting of a UI widget that determines its behavior, data binding, or visual appearance.                                                                                                               |
| **PWA (Progressive Web App)**              | A modern web application standard that provides a native app-like experience (installable, responsive, offline-capable) directly from any web browser.                                                                |
| **Tag (Versioning)**                       | A named, point-in-time snapshot of an app's configuration (logic, UI, and bindings) that can be exported, restored, or used as a template blueprint.                                                                  |
| **User**                                   | An end-user who logs in or otherwise interacts with a live, published Heisenware app (strictly distinct from a Member).                                                                                               |
| **VRPC (Variadic Remote Procedure Call)** | The open-source, asynchronous communication protocol over MQTT that powers all distributed data exchange and remote function calls within the Heisenware ecosystem.                                                   |
| **Widget**                                 | An interactive or display-oriented visual component (e.g., a chart, button, or form) placed in the Frontend Builder to construct the user interface.                                                                  |
| **Workspace**                              | A dedicated sub-container within an Account used to securely isolate related apps, databases, files, and members from one another.                                                                                    |
| **YAML**                                   | A human-readable data serialization language used extensively in the Backend Builder for quickly configuring static Function inputs and data structures.                                                              |
