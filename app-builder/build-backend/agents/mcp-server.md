# MCP Server

The Heisenware MCP server lets you drive the platform from **your own AI agent** — Claude Desktop, Claude Code, or any client that speaks the [Model Context Protocol](https://modelcontextprotocol.io). The agent gets the same tools the embedded assistant uses: creating apps, wiring backend functions, placing widgets, verifying the result. You spend your own AI subscription; nothing runs through Heisenware's models.

## How it works

* **Bring your own agent**: the server runs on your machine and talks to your workspace over the same encrypted MQTT connection an Agent uses. Your AI client talks to the server over stdio.
* **Your integration's authority**: the server logs in as a [VRPC integration](../../../app-manager/inbound-integrations.md#vrpc-client). It can do exactly what that integration is allowed to do — nothing more.
* **Guard rails inside the tools**: the irreversible operations (`delete_entity`, `delete_page`, `release_app`) only run with an explicit `confirm: true` that your agent has to ask you for. A `--read-only` mode exposes no mutating tool at all.
* **Version-locked**: every platform serves the MCP server package that matches its own version, so the tools always match the workspace they talk to. The download link comes from the App Manager (it carries an access ticket valid for twelve hours; `npx` keeps the file after the first run, so an expired link only matters on a new machine). Register the versioned file, never a `latest` alias: `npx` keeps a copy of what it ran once and would not notice a platform upgrade behind an unchanged name.

## Retrieving credentials

Create a [VRPC integration](../../../app-manager/inbound-integrations.md#vrpc-client) in the App Manager's Integrations panel. Its username and password are the `HW_USERNAME` and `HW_PASSWORD` below.

## Configuration

The server reads the same four variables as the [Docker Agent](docker-agent.md):

| Variable      | Value                                                        |
| ------------- | ------------------------------------------------------------ |
| `HW_DOMAIN`   | `<account>.<workspace>`, e.g. `my-company.default`           |
| `HW_BROKER`   | `mqtts://<account>.heisenware.cloud:8883`                    |
| `HW_USERNAME` | username of the VRPC integration                             |
| `HW_PASSWORD` | password of the VRPC integration                             |

Optional:

| Variable               | Value                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `HW_PUBLIC_HOST`       | `https://<account>.heisenware.cloud` — enables the visual tools (`layout_lint`, `screenshot`), see below         |
| `HW_WORKSPACE`         | directory where fetched files and screenshots are stored (default: a folder in your temp directory)             |
| `HW_ALLOW_VALUE_READS` | `false` disables `read_value` and `screenshot`, which can reveal live data                                        |
| `HW_DEPLOY_MODE`       | `onprem` for an on-premise installation (default `server`)                                                       |

Flag: `--read-only` — production-support mode. No mutating tool is offered and live values cannot be read.

## The platform law comes first

The tools describe themselves, but building a good app on Heisenware follows rules that no single tool can carry: how triggers, wires and variables relate, when to verify, how to treat files and credentials. The embedded assistant in the App Builder knows these rules by heart. Your own agent gets them from the server as the **platform law**, and the first message of every session should load it. The server offers the law three ways:

* as a **prompt** named `platform-law` (Claude Code turns it into the slash command `/mcp__heisenware__platform-law`, Claude Desktop lists it in the attachment menu),
* as the **resource** `heisenware://law/platform-law`, for clients that read resources,
* as plain text you can paste into your first message, for clients that support neither.

The server also points every client at the law in its connection instructions, so a capable agent reads it by itself. Widget contracts are available the same way, as resources named `heisenware://widgets/<type>/manifest`.

## Claude Code

Register the server once:

```bash
claude mcp add heisenware \
  -e HW_DOMAIN=my-company.default \
  -e HW_BROKER=mqtts://my-company.heisenware.cloud:8883 \
  -e HW_USERNAME=agentRunner \
  -e HW_PASSWORD=secret \
  -- npx -y --no-audit "<download link from the App Manager>"
```

The download link looks like `https://my-company.heisenware.cloud/my-company.default/resources/download/mcp/heisenware-mcp-<version>.tgz?t=<ticket>`.

The package is self-contained: it carries its dependencies, so the first start needs no access to the npm registry and works on-premise without internet. `--no-audit` keeps npm from asking the public registry for a security report anyway; the first start takes a few seconds, every later one about one.

`claude mcp list` should now show `heisenware` as connected. Then, in every session:

1. Make `/mcp__heisenware__platform-law` your first message. It loads the law.
2. Ask in your own words, for example: _"List my apps and describe the one called Dashboard."_ The tools appear as `mcp__heisenware__<tool>`.

## Claude Desktop

Add the server to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "heisenware": {
      "command": "npx",
      "args": [
        "-y",
        "--no-audit",
        "<download link from the App Manager>"
      ],
      "env": {
        "HW_DOMAIN": "my-company.default",
        "HW_BROKER": "mqtts://my-company.heisenware.cloud:8883",
        "HW_USERNAME": "agentRunner",
        "HW_PASSWORD": "secret"
      }
    }
  }
}
```

For read-only access append `"--read-only"` to `args`. Then, in every chat: open the attachment menu (**+**), pick the `heisenware` server and its `platform-law` prompt as the first message, and ask.

## Other MCP clients

Any other client is configured the same way: the command, its arguments and the four variables. Load the law first through the resource `heisenware://law/platform-law`, or paste its text as your first message, then ask.

## Checking the connection

On startup the server prints one line to its error output, which your client shows in its MCP log:

```
heisenware-mcp 93.0.0: connected to my-company.default as agentRunner via mqtts://... - platform v93-server, 60 tools, read-write, law served as prompt + resource
```

A version mismatch between the package and the platform is reported as a warning. Download the package your platform serves to resolve it.

## Visual verification

`layout_lint` and `screenshot` render your app in a headless browser on your machine. They need `HW_PUBLIC_HOST` and a local Chromium:

```bash
npx playwright-core install chromium
```

Without it, both tools stay listed and answer with this instruction.

{% hint style="warning" %}
#### Screenshots show geometry, not live values yet

`layout_lint` works fully. `screenshot` currently renders the page without the widgets' live values: the app player signs in as a user, and an integration credential is not a user. The embedded assistant in the App Builder does not have this limitation. Until a member login is available on this surface, verify values with `read_value`.
{% endhint %}

{% hint style="info" %}
#### Which tools are there?

Ask your agent to list them — every tool carries its own description of what it does and how the platform expects it to be used. The embedded assistant in the App Builder uses exactly the same tools.
{% endhint %}
