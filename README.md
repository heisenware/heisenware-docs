# Heisenware Product Docs

**Heisenware is the industrial application platform for engineers who build real software.** It combines the speed of visual development with the power of a full-stack environment. Unlike restrictive no-code tools, Heisenware exposes a sophisticated, distributed architecture designed for industrial scalability. It allows you to build, deploy, and manage production-grade applications without the overhead of boilerplate code and complex infrastructure setup.

## The platform at a glance

Heisenware is divided into three core components that cover the entire application lifecycle:

<table data-view="cards"><thead><tr><th></th><th></th><th data-hidden data-card-target data-type="content-ref"></th><th data-hidden data-card-cover data-type="image">Cover image</th></tr></thead><tbody><tr><td><strong>APP MANAGER</strong></td><td>Admin dashboard to create and manage apps, members, and integrations.</td><td><a href="https://app.gitbook.com/s/E5Ketpww1s7TauSAJrJ8/app-manager">App Manager</a></td><td><a href=".gitbook/assets/App Manager in Browser preview.png">App Manager in Browser preview.png</a></td></tr><tr><td><strong>APP BUILDER</strong></td><td>Visual programming interface to build and test custom software applications.</td><td><a href="https://app.gitbook.com/s/E5Ketpww1s7TauSAJrJ8/app-builder">App Builder</a></td><td><a href=".gitbook/assets/658shots_so.png">658shots_so.png</a></td></tr><tr><td><strong>PRODUCTION APPS</strong></td><td>The live, end-user-facing applications created and run with Heisenware.</td><td><a href="https://app.gitbook.com/s/E5Ketpww1s7TauSAJrJ8/production-apps">Production Apps</a></td><td><a href=".gitbook/assets/tracking.jpg">tracking.jpg</a></td></tr></tbody></table>

### Hosting & architecture

The [Heisenware architecture](account/hosting-and-architecture.md) consists of the central platform and optional agents. Each account (tenant) runs in isolation and supports two deployment modes:

* **Cloud deployment**: The recommended way to use Heisenware. Your apps are hosted by us on Hetzner Online GmbH in Germany.
* **On-premises deployment**: You run the entire platform as a Docker application on your own local servers or private cloud.

Regardless of the deployment mode, you can use [Edge Agents](app-builder/build-backend/function-explorer/agents/) to bridge separated networks. For example, if you host the platform in a corporate data center (IT) and need to access machines in a secured shopfloor network (OT), an agent acts as the secure tunnel.

### See it in action

See how to build and operate industrial applications in Heisenware.

{% embed url="https://www.youtube.com/watch?v=MM4teGtbB7k" %}

## Engineering philosophy & core concepts

Heisenware is not just a drag-and-drop interface. It is a visual programming environment. Mastering the platform requires understanding the engineering concepts we expose rather than hide.

### Transparency & flexibility

Standard no-code platforms often act as "black boxes" by abstracting complexity so heavily that you hit a wall when you need custom logic. Heisenware operates transparently.

* **Visual, yet code-capable:** You build logic visually using the Flow builder, but you retain direct access to developer tools like JavaScript expressions for data transformation and YAML for configuration.
* **No "no-code cliff"**: When pre-built functions aren't enough, you don't hack workarounds. You extend the platform by wrapping your code (Node.js, Python, C++) into extensions that become native functions.

### Object-oriented scalability

Unlike linear scripting tools that struggle to manage multiple devices, Heisenware uses a strict object-oriented model. This allows you to build logic once and instantiate it across an entire fleet.

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

* **The bridge**: Through native agents and Docker agents, we securely bridge local, private networks (OT/Shopfloor) to the cloud without VPNs.
* **Local execution**: You can push backend logic (connectors) to run _locally_ on the edge device. The platform treats these remote functions the same as cloud functions.

### Unified data binding

We eliminate the "glue code" typically needed to connect a frontend to a backend.

* **Direct linking**: In the App Builder, you connect a backend function's output directly to a frontend widget's property.
* **Reactive UI**: When backend data changes (e.g., a new sensor reading), the bound UI widget automatically re-renders to reflect the new state.

<figure><img src=".gitbook/assets/Data Binding Basics.gif" alt=""><figcaption></figcaption></figure>

## Glossary of terms

A quick-reference list of specific terms used across the Heisenware platform.

<table><thead><tr><th width="187.785888671875">Term</th><th>Description</th></tr></thead><tbody><tr><td>Account</td><td>Represents a tenant and is the highest level of organization. It is usually your company name and defines your URL (e.g., <code>acme.heisenware.cloud</code>).</td></tr><tr><td>App</td><td>A stand-alone software application built with Heisenware. All apps are automatically PWAs.</td></tr><tr><td>App Builder</td><td>The visual programming environment where you design, build, and test applications.</td></tr><tr><td>App Manager</td><td>The administrative dashboard for managing workspaces, apps, members, and integrations.</td></tr><tr><td>Application logic</td><td>The backend of an app, consisting of integrations, databases, and logic flows.</td></tr><tr><td>Build time</td><td>The phase when a developer is actively designing and configuring an application in the App builder.</td></tr><tr><td>Code Adapter</td><td>Custom code written to wrap existing software libraries, making them accessible as Heisenware blocks.</td></tr><tr><td>Command</td><td>An action that causes a temporary, non-persistent change to a widget's state, such as highlighting it.</td></tr><tr><td>Deployment</td><td>The process of publishing a version of an app, making it live for end-users.</td></tr><tr><td>Domain</td><td>Combines your account and workspace into an identifier (e.g., <code>acme.default</code>).</td></tr><tr><td>Edge Agent</td><td>An executable program or Docker container deployed in a private network to establish a secure bridge to the internet/cloud.</td></tr><tr><td>Event</td><td>A trigger the app responds to, such as a user click, database update, or timer.</td></tr><tr><td>Flow</td><td>A sequence of connected functions that defines how data is processed.</td></tr><tr><td>Integration</td><td>A configured entry point allowing external systems to send data to your account.</td></tr><tr><td>JavaScript expressions</td><td>A feature allowing the use of standard JavaScript expressions to perform simple data transformations or calculations on the fly.</td></tr><tr><td>JSON (JavaScript Object Notation)</td><td>A standard data format supported in Heisenware for structuring and exchanging data.</td></tr><tr><td>JSONata</td><td>A powerful query language used within Heisenware to reshape complex data on the fly.</td></tr><tr><td>Member</td><td>A user with access to build and manage applications (distinct from an end-user).</td></tr><tr><td>Property</td><td>A setting of a widget that can be read or changed by logic (e.g., the value in a circular gauge).</td></tr><tr><td>PWA (Progressive Web App)</td><td>Runs in a browser but offers a native-like experience (offline capable, installable).</td></tr><tr><td>Runtime</td><td>The phase when a deployed application is live and responding to user input.</td></tr><tr><td>Tag</td><td>A named, exportable version/snapshot of a Heisenware app.</td></tr><tr><td>Template</td><td>A specific tag serving as a blueprint for creating new apps.</td></tr><tr><td>User Interface (UI)</td><td>The visual part of an app that an end-user interacts with to view data, input data, and trigger actions.</td></tr><tr><td>Widget</td><td>A visual UI element used to display data (chart) or collect input (button).</td></tr><tr><td>Workspace</td><td>A container within your account used to organize related apps and members.</td></tr><tr><td>YAML</td><td>A human-readable data format used in Heisenware to configure functions.</td></tr></tbody></table>
