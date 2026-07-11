# Overview

The App Builder is a core component of the Heisenware platform. It is a visual development environment used to build, test, and deploy Apps. Accessed directly from the App Manager, it provides a focused environment for developing one App at a time.

## Main interfaces

The App Builder is organized into four distinct areas to manage the App lifecycle and development workflow.

* **Top Bar (top)**: Opens the [Theme Editor](build-frontend/theme-editor.md) and [PDF Template Editor](build-frontend/pdf-template-editor.md), and gives access to App Builder settings, language, and help. It also shows the current App version and holds the controls to [test and deploy](deploy-and-maintain.md).
* **Explorers (left)**: Switch between the [Function Explorer](build-backend/function-explorer/) for backend logic, the [Page Explorer](build-frontend/page-explorer.md) for frontend structure, and the [File Explorer](build-backend/file-explorer.md) for resources needed during app development.
* **Backend Builder (center)**: An infinite drawing area where you create the [business logic](build-backend/) of your entire App by wiring up selected functions into automated flows.
* **Frontend Builder (right)**: A page-specific design canvas for composing user interfaces for all screen sizes. This is where you [build user interfaces (UI)](build-frontend/) using text, images, and interactive widgets.

<figure><img src="../.gitbook/assets/image (512).png" alt=""><figcaption></figcaption></figure>

## How it works

Heisenware uses a highly integrated development process. Rather than working in isolated stages, you build logic, design interfaces, and configure data connections simultaneously within a single environment.

### Build backend

In the [Backend Builder](build-backend/) you create event-driven logic by dragging [functions](build-backend/functions.md) from the [Function Explorer](build-backend/function-explorer/) onto the canvas and wiring them into flows. Functions are the atomic building blocks of an App: standard utility blocks, industrial drivers, and custom Code Adapters written in Node.js, Python, or C++.

This logic runs in a global scope. It is persistent and runs independently of the active UI page, which makes the backend the central hub for continuous data processing or system monitoring. To reach machines and databases in isolated networks, you configure [Native Agents](build-backend/function-explorer/agents/native-agent.md) or [Docker Agents](build-backend/function-explorer/agents/docker-agent.md) that tunnel data from local systems directly into your App's logic.

### Build frontend

The [Frontend Builder](build-frontend/) is a canvas on which you design your UI per page and across different screen sizes, similar to popular presentation tools such as Google Slides or PowerPoint. You use the [Page Explorer](build-frontend/page-explorer.md) to create, nest, and organize your pages, then switch to the page you want to edit.

You compose each page from widgets, functional components like gauges, charts, and input fields that you drag onto the canvas. To keep every page and widget visually consistent, the Theme Editor defines the styles and colors that apply across the whole App.

### Unified data binding

The core strength of the App Builder is the ability to connect virtually any element to any other via data binding. This creates a bidirectional flow between the App's interface and the logic.

* **Connect anything to everything**: You can link a button to a function trigger, bind an input field to a function's input parameters, or use a function's output to visualize data, toggle a button's state, or update a gauge's value.
* **Property and event binding**: A property is anything about a widget that can change, its value, scale, visibility, color, and more. You can bind backend logic to any property, or to a widget's events, to drive the UI dynamically.
* **Reactive synchronization**: The system eliminates manual glue code. The interface and logic remain in sync in real time as data flows through the App.

<figure><img src="../.gitbook/assets/Data Binding Basics.gif" alt=""><figcaption></figcaption></figure>
