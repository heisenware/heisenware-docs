# Overview

The App Builder is a core component of the Heisenware platform. It is a visual development environment used to build, test, and deploy applications. Accessed directly from the App Manager, it provides a focused environment for developing one application at a time.

## Main interfaces

The App Builder is organized into four distinct spatial zones to manage the application lifecycle and development workflow.

* **Global Toolbar (top)**: Manages application-wide configurations, editor modes, and the deployment pipeline. This is where you access [theme editing](build-frontend/theme-editor.md), the [PDF template editor](build-frontend/pdf-template-editor.md), and handle the [app lifecycle](deploy-and-maintain.md) (testing, versioning, and deployment).
* **Explorer (left)**: Allows you to explore available [Functions](build-backend/function-explorer/) for backend logic, [pages](build-frontend/page-explorer.md) for frontend structure, and [files](build-backend/file-explorer.md) needed as resources during the app development process.
* **Backend Builder (center)**: An infinite drawing area where you create the [business logic](build-backend/) of your entire application by wiring up selected Functions into automated flows.
* **Frontend Builder (right)**: A page-specific design canvas for composing user interfaces for all screen sizes. This is where you [build user interfaces (UI)](build-frontend/) using text, images, and interactive widgets.

<figure><img src="../.gitbook/assets/image (512).png" alt=""><figcaption></figcaption></figure>

## How it works

Heisenware uses a highly integrated development process. Rather than working in isolated stages, you build logic, design interfaces, and configure data connections simultaneously within a single environment.

### Build backend

Using the [Backend Builder](build-backend/) you create event-driven sequences by dragging selected Functions from the Explorer onto the canvas.

* **Functions**: The atomic building blocks of an app. These include standard utility blocks, industrial drivers, and custom Code Adapters (Node.js, Python, or C++).
* **Global scope**: Logic in the Backend Builder is persistent. It runs independently of the active UI page, making it the central hub for continuous data processing or system monitoring.
* **Agents**: Secure bridges for isolated networks. You configure Native or Docker Agents to tunnel data from local systems directly into your application logic.

### Build frontend

The [Frontend Builder](build-frontend/) is a canvas on which you design your UI per page and across different screen sizes in a way you are used from popular presentation tools (such as Google Slides or Powerpoint). You will use the Explorer to switch to the page you want to edit.

* **Widgets**: Functional components like gauges, charts, and input fields. You drag these onto the canvas to compose the interface.
* **Theme editing**: A global editor accessed via the top bar. It defines the styles and colors that ensure visual consistency across all pages and widgets.
* **Page hierarchy**: A management tool in the left panel used to create, nest, and organize the application structure.

### Unified data binding

The core strength of the App Builder is the ability to connect virtually any element to any other via data binding. This creates a bidirectional flow between the app's interface and the logic.

* **Connect anything to everything**: You can link a button to a Function Trigger, bind an input field to a Function's Input parameters, or use a Function's Output to visualize data, toggle a button's state, or update a gauge's value.
* **Property and event binding**: Beyond just data values, you can bind to widget properties like scale, visibility, or color, allowing the backend logic to drive the UI's appearance dynamically.
* **Reactive synchronization**: The system eliminates manual glue code. The interface and logic remain in sync in real time as data flows through the application.

<figure><img src="../.gitbook/assets/Data Binding Basics.gif" alt=""><figcaption></figcaption></figure>
