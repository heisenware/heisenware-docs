# Installation Modes

## Single-node installation

The entire platform, including authorization and all accounts, runs on a single, dedicated node.

<figure><img src="../../.gitbook/assets/image (42).png" alt=""><figcaption><p>Single node architecture with under a service perspective</p></figcaption></figure>

## Multi-node installation

In this setup the platform employs a multi-tier ingress gateway architecture using Envoy proxy to manage traffic for a multi-tenant environment. A central "master" proxy acts as the primary edge gateway, handling initial TLS termination and routing for all tenant domains. It then forwards traffic to dedicated upstream servers, which in turn route requests to specific containerized backend services.

This strategy provides strong centralization for security and observability while allowing for flexible and decoupled deployment of tenant application services.

<figure><img src="../../.gitbook/assets/image (493).png" alt=""><figcaption><p>High-level view of the service distribution on a multi-node setup</p></figcaption></figure>

The architecture is a classic API Gateway / Ingress Controller pattern, composed of two primary tiers of proxies.

* Tier 1: Master Proxy (Edge Gateway)
  * Entry Point: This is the single, public-facing entry point for all platform traffic. It's associated with a wildcard DNS `A` record (`*.heisenware.cloud`), which directs all traffic for new or unassigned subdomains to its IP address.
  * Responsibilities:
    * TLS Termination: It handles all incoming HTTPS and other TLS-encrypted connections (MQTTS, etc.), decrypting traffic using a wildcard certificate.
    * Tenant Routing: It performs the initial routing decision based on the request's domain name (e.g., `account-1.heisenware.cloud`). A match forwards the connection to a pre-defined upstream server.
    * Default Service Routing: For domains that do not match a specific tenant rule (e.g., a non-existent account), it falls back to routing to a set of shared, internal services like the main authentication portal.
* Tier 2: Upstream Servers (Application Nodes)
  * Role: These are the dedicated hosts (e.g., `walter-white`, `hank-schrader`) that run the actual tenant-specific applications and services.
  * Local Proxy: Each upstream server runs its own Envoy instance that acts as a local reverse proxy. This instance receives the forwarded traffic from the Master Proxy.
  * Responsibilities:
    * Application-Layer Routing: It performs more granular, path-based routing to the various microservices that make up the tenant's application (e.g., `/app`, `/connectors`, `/manager`).
    * Service Abstraction: It provides a stable endpoint for the Master Proxy, abstracting away the underlying containerized services (`manager`, `app-frontend`, etc.).

## On-premises installation

Technically, this is a single-node installation, with the node running on the customer's hardware (on-premises or private cloud). The platform is not accessible via the internet.

