# Installation modes

Heisenware supports different hosting topologies depending on your infrastructure, security, and scaling requirements.

## Single-node installation

A single dedicated node runs the entire platform, including user authorization and all accounts.

<figure><img src="../../.gitbook/assets/image (42).png" alt=""><figcaption></figcaption></figure>

## Multi-node installation

This setup uses a multi-tier ingress gateway architecture with an Envoy proxy to manage traffic for a multi-tenant environment. A central master proxy acts as the primary edge gateway, handling initial TLS termination and routing for all tenant domains. It then forwards traffic to dedicated upstream servers, which route requests to specific containerized backend services.

This design centralizes security and observability while allowing flexible, decoupled deployment of tenant App services.

<figure><img src="../../.gitbook/assets/image (493).png" alt=""><figcaption></figcaption></figure>

The architecture uses a classic API gateway and ingress controller pattern with two proxy tiers:

### Tier 1: Master proxy (edge gateway)

The master proxy is the single public-facing entry point for all platform traffic. A wildcard DNS `A` record (`*.heisenware.cloud`) directs traffic for new or unassigned subdomains to its IP address.

Key responsibilities of the master proxy include:
* **TLS termination:** Decrypting all incoming HTTPS and other TLS-encrypted connections (such as MQTTS) using a wildcard certificate.
* **Tenant routing:** Making initial routing decisions based on the request's domain name (such as `account-1.heisenware.cloud`) and forwarding matched connections to predefined upstream servers.
* **Default service routing:** Routing unmatched domains (such as non-existent accounts) to shared internal services, including the main authentication portal.

### Tier 2: Upstream servers (App nodes)

Upstream servers are dedicated hosts (such as `walter-white` or `hank-schrader`) that run tenant-specific Apps and services. Each upstream server runs an Envoy instance that acts as a local reverse proxy to receive forwarded traffic from the master proxy.

Key responsibilities of upstream servers include:
* **App-layer routing:** Performing granular, path-based routing to the microservices that make up the tenant's App (such as `/app`, `/connectors`, or `/manager`).
* **Service abstraction:** Providing a stable endpoint for the master proxy, which abstracts the underlying containerized services (such as `manager` or `app-frontend`).

## On-premise installation

An on-premise installation functions as a single-node setup running on local hardware or a private cloud. This deployment completely isolates the platform from the public internet.

To set up a local server, see the [On-premise installation](../../tutorials/on-premise-installation.md) setup guide.
