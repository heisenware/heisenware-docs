# High-level architecture

The Heisenware platform uses a decoupled, event-driven, service-oriented architecture (SOA). Its core design philosophy abstracts the complexity of industrial and IT systems into a unified, remotely controlled, and extensible ecosystem. A central message bus standardizes communication, which enables location transparency and independent scalability for all components.

This approach ensures the platform remains robust, highly extensible, and ready for next-generation interfaces, including AI-driven development.

## Core philosophy and architectural style

We designed Heisenware around the principle of loose coupling. By separating frontend presentation, orchestrating backend logic, and integrating external devices, the platform prevents single points of failure and simplifies updates. The underlying communication layer treats remote resources as local objects, allowing developers to interact with distant PLCs, databases, or services through standard function calls.

## Architectural pillars

The platform consists of three decoupled pillars:

* **Communication fabric** ([VRPC](../vrpc/) over MQTT): Our open-source Versatile RPC (VRPC) library runs over an MQTT message broker at the core of the system to provide a real-time, bidirectional communication layer. All frontend-to-backend and service-to-service interactions run as remote procedure calls, which makes the distributed platform function like a single, local application.
* **Backend services** (Node.js): The backend uses modular services that connect to the VRPC domain as independent agents rather than a single monolith:
  * **App Builder Core**: The central orchestration service that manages the structure, logic, and state of all user-built Apps.
  * **Capability microservices**: Pluggable services (such as the `connector` service) that provide concrete features. They register specialized classes to interact with external systems like PLCs (Siemens S7, Modbus), databases (timeseries, relational), APIs (SAP, GraphQL), and industrial protocols (OPC UA, MQTT).
* **Frontend** (React): The frontend applications act as responsive thin clients. The `react-vrpc` library provides React hooks that connect directly to the VRPC message bus. This setup lets UI widgets subscribe to backend state changes and re-render in real-time without traditional API polling.

## Key component abstractions

The App Builder Core operates on three primary object-oriented abstractions:

* `Application`: The top-level container for a user-built App. It orchestrates the lifecycle of its pages, widgets, and logic blocks.
* `Executor`: The atomic unit of computation, representing a single function node in the visual editor. Each `Executor` is a reactive object with defined inputs, outputs, and triggers. It can call any function registered within the VRPC domain, whether inside the App Builder Core or a connected microservice.
* `Widget`: A Backend-for-Frontend (BFF) representation of a UI component. It holds the widget state and links the visual user interface to the backend `Executor` logic.

## Strengths and strategic advantages

The platform's architecture provides several technical advantages:

* **Extensibility**: You can add new functionality – such as support for an industrial protocol – by creating a new class and registering it in a microservice. The core platform remains unchanged, which ensures rapid and safe extensions.
* **Scalability and resilience**: You can scale each microservice and the App Builder Core independently. The decoupled architecture ensures that a failure or restart in one capability service does not affect the rest of the platform.
* **AI readiness**: The entire backend functions as a comprehensive Action API. The granular, object-oriented components and the VRPC communication layer are optimized for control by AI agents. Additionally, VRPC extracts JSDoc metadata to provide a built-in, self-documenting reference that lets AI agents discover and use platform capabilities autonomously.
