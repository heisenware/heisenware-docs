# High-Level Architecture

## Core Philosophy & Architectural Style

The Heisenware platform is built upon a decoupled, event-driven, service-oriented architecture (SOA). The fundamental design philosophy is to abstract away the complexity of industrial and IT systems into a unified, remotely-controllable, and extensible ecosystem. Communication is standardized through a central message bus, enabling location transparency and independent scalability for all components.

This approach ensures the platform is robust, highly extensible, and inherently prepared for next-generation interfaces, including AI-driven development.

## Architectural Pillars

The platform is composed of three primary, decoupled pillars:

* **Communication Fabric** ([VRPC](../vrpc/) over MQTT): At the heart of the system is our open-source Versatile RPC (VRPC) library running over an MQTT message broker. This provides a seamless, real-time, and bidirectional communication layer. All frontend-to-backend and service-to-service interactions occur as remote procedure calls, making the entire distributed system feel like a single, local application.
* **Backend Services** (Node.js): The backend is not a monolith. It consists of multiple services that connect to the VRPC domain as independent agents:
  * The App Builder Core: This is the central orchestration service. It manages the structure, logic, and state of all user-created applications.
  * Capability Microservices: These are pluggable services (e.g., the `connector` service) that provide concrete capabilities. They register specialized classes for interacting with external systems like PLCs (S7, Modbus), databases (InfluxDB, SQL), APIs (SAP, GraphQL), and IoT protocols (OPC UA, MQTT).
* **Frontend** (React): The frontends are a highly responsive thin clients. The `react-vrpc` library provides React hooks that connect directly to the VRPC message bus. This allows UI components to subscribe to backend state changes and re-render in real-time without the need for traditional API polling.

## Key Component Abstractions

The App Builder Core operates on three primary object-oriented abstractions:

* `Application`: The top-level container for a user-built solution. It orchestrates the lifecycle of its constituent pages, widgets, and logic blocks.
* `Executor`: The atomic unit of computation, representing a single Function block in the visual editor. Each `Executor` is a reactive object with defined inputs, outputs, and triggers, capable of calling any function registered within the VRPC domain—whether in the App Builder Core or any connected microservice.
* `Widget`: A Backend-for-Frontend (BFF) representation of a UI component. It holds the component's state and serves as the crucial linking pin between the visual user interface and the backend `Executor` logic.

## Strengths & Strategic Advantages

This architectural design provides several key strategic advantages:

* **Extreme Extensibility**: New functionality, such as support for a new industrial protocol, can be added by simply creating a new class and registering it in a microservice. The core platform remains unchanged, allowing for rapid and safe extension.
* **Scalability & Resilience**: Each microservice, as well as the App Builder Core, can be scaled independently. The decoupled nature ensures that the failure or restart of one capability service does not impact the rest of the platform.
* **Inherent AI-Readiness**: The entire backend is, by design, a comprehensive Action API. The granular, object-oriented components and the VRPC communication layer are perfectly suited to be commanded by an AI agent. Furthermore, VRPC's ability to extract JSDoc metadata provides a built-in, self-documenting "instruction manual" for an AI to discover and utilize platform capabilities autonomously.
