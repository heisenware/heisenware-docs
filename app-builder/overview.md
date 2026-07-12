# Overview

The App Builder is a core component of the Heisenware platform: a visual development environment where you build, test, and deploy Apps. You open it straight from the App Manager, and it focuses on one App at a time.

## Main interfaces

The App Builder splits into four areas that cover the App lifecycle and development workflow.

* **Top Bar (top)**: Opens the [Theme Editor](build-frontend/theme-editor.md) and [PDF Template Editor](build-frontend/pdf-template-editor.md), and gives access to App Builder settings, language, and help. It also shows the current App version and holds the controls to [test and deploy](deploy-and-maintain.md).
* **Explorers (left)**: Switch between the [Function Explorer](build-backend/functions/function-explorer.md) for backend logic, the [Page Explorer](build-frontend/page-explorer.md) for frontend structure, and the [File Explorer](build-backend/file-explorer.md) for resources needed during app development.
* **Backend Builder (center)**: An infinite drawing area where you create the [business logic](build-backend/) of your entire App by wiring up selected functions into automated flows.
* **Frontend Builder (right)**: A page-specific design canvas for composing user interfaces for all screen sizes. This is where you [build user interfaces (UI)](build-frontend/) using text, images, and interactive widgets.

<figure><img src="../.gitbook/assets/image (512).png" alt=""><figcaption></figcaption></figure>

## How it works

Heisenware uses a highly integrated development process. Rather than working in isolated stages, you build logic, design interfaces, and configure data connections simultaneously within a single environment.

### Build backend

In the [Backend Builder](build-backend/) you create event-driven logic by dragging [functions](build-backend/functions/) from the [Function Explorer](build-backend/functions/function-explorer.md) onto the canvas and wiring them into flows. Functions are the atomic building blocks of an App: standard utility blocks, industrial drivers, and custom Code Adapters written in Node.js, Python, or C++.

This logic runs in a global scope. It persists and runs independently of the active UI page, which makes the backend the central hub for continuous data processing or system monitoring. To reach machines and databases in isolated networks, you configure [Native Agents](build-backend/agents/native-agent.md) or [Docker Agents](build-backend/agents/docker-agent.md) that tunnel data from local systems directly into your App's logic.

### Build frontend

The [Frontend Builder](build-frontend/) is a canvas on which you design your UI per page and across different screen sizes, similar to popular presentation tools such as Google Slides or PowerPoint. You use the [Page Explorer](build-frontend/page-explorer.md) to create, nest, and organize your pages, then switch to the page you want to edit.

You compose each page from widgets, functional components like gauges, charts, and input fields that you drag onto the canvas. To keep every page and widget visually consistent, the Theme Editor defines the styles and colors that apply across the whole App.

### Unified data binding

The App Builder's core strength is data binding: connect almost any element to any other and data flows between the App's interface and its logic in both directions.

* **Connect anything to everything**: Link a button to a function trigger, bind an input field to a function's input parameters, or feed a function's output into a widget to visualize data, toggle a button's state, or update a gauge's value.
* **Property and event binding**: A property is anything about a widget that can change, its value, scale, visibility, color, and more. Bind backend logic to any property, or to a widget's events, to drive the UI dynamically.
* **Reactive synchronization**: No manual glue code. Interface and logic stay in sync in real time as data flows through the App.

<figure><img src="../.gitbook/assets/Data Binding Basics.gif" alt=""><figcaption></figcaption></figure>
