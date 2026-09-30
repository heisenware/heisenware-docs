# Remote support

Heisenware can support your on-premise installation remotely: build an app with you, fix one, look at a screenshot of it. No way into your network is needed for this, and you decide when it happens, for how long, and how much Heisenware may do.

## How it works

Your installation runs a **support agent**. Switched on, it opens one outbound TLS connection to `support.heisenware.cloud` on port 8883, the same door a [Native Agent](../app-manager/agents/native-agent.md) uses, and offers Heisenware the App Builder tools of one workspace over it. Every tool runs inside your installation; only the request and its result travel. Nothing listens for incoming connections, and the connection ends when you switch the agent off.

```
  Heisenware                  support.heisenware.cloud             Your installation
 ┌───────────────┐           ┌────────────────┐    ║        ┌────────────────────────┐
 │ App Builder   │           │    support     │    ║  8883  │  support agent         │
 │ tools         ├──────────►│    tenant      │◄───╫────────┤  (dials out)           │
 └───────────────┘           └────────────────┘    ║        │        │               │
                                                   ║        │        ▼               │
                                              your firewall │ broker, engine,        │
                                                            │ builder, player        │
                                                            └────────────────────────┘
```

| Leaves your installation | Stays inside |
| --- | --- |
| The tool calls Heisenware makes and their results, screenshots included | Your broker, engine, builder and player |
| The list of tools and your platform version | Your apps' data, events and MQTT feeds |
| | Every credential of your installation |

## Before you start

* Heisenware sends you a **ticket**: a name for your installation and a password.
* You need a **VRPC integration** of the workspace Heisenware should work in: App Manager → Integrations → Add → VRPC client (see [Integrations](../app-manager/integrations.md)). The session has exactly this integration's access; deactivate or delete it and the session ends.
* Your firewall must allow outbound TCP 8883 to `support.heisenware.cloud`. Nothing inbound.

## Switch it on

{% stepper %}
{% step %}
#### Fill in the session

Open `.env` in your installation directory and set:

```bash
HW_SUPPORT_AGENT=plant-a                          # from the ticket
HW_SUPPORT_PASSWORD=...                           # from the ticket
HW_SUPPORT_DOMAIN=acme.default                    # the workspace, <account>.<workspace>
HW_SUPPORT_INTEGRATION=remote-support             # the VRPC integration of that workspace
HW_SUPPORT_INTEGRATION_PASSWORD=...
HW_SUPPORT_PUBLIC_HOST=https://heisenware.example.local   # your installation's address
HW_SUPPORT_EXPIRES_AT=2026-10-01T18:00:00Z        # optional: the agent stops by itself (UTC)
```
{% endstep %}

{% step %}
#### Start

```bash
./start.sh
```
{% endstep %}

{% step %}
#### Check

```bash
docker compose logs -f supportAgent
```

`support link up` means Heisenware can reach the installation. Tell them.
{% endstep %}
{% endstepper %}

## What you control

* **Expiry.** `HW_SUPPORT_EXPIRES_AT` (ISO 8601, UTC): the agent disconnects by itself at that time.
* **Read-only.** `HW_SUPPORT_READ_ONLY=true`: Heisenware can look (apps, executors, logs, screenshots) but change nothing.
* **Live values.** `HW_SUPPORT_VALUE_READS=false`: no values of your running apps, screenshots without them.
* **Irreversible operations.** Deleting an entity or a page and deploying an app need an explicit confirmation on Heisenware's side, per call.
* **Audit.** Every call is one line in the container log: `docker compose logs supportAgent`.

## Switch it off

Empty `HW_SUPPORT_AGENT` in `.env` (or remove the lines) and run `./start.sh`. For a pause, `docker compose stop supportAgent`. Deactivating or deleting the integration ends the session too.

{% hint style="info" %}
#### One outbound port

The agent connects to `support.heisenware.cloud` on TCP 8883 with TLS, verifying the host against the public certificate roots. It never listens.
{% endhint %}
