# MCP Server

The Heisenware MCP server lets you drive the platform from **your own AI agent** — Claude Desktop, Claude Code, or any client that speaks the [Model Context Protocol](https://modelcontextprotocol.io). The agent gets the same tools the embedded assistant uses: creating apps, wiring backend functions, placing widgets, verifying the result. You spend your own AI subscription; nothing runs through Heisenware's models.

## How it works

* **Bring your own agent**: the server runs on your machine and talks to your workspace over the same encrypted MQTT connection an Agent uses. Your AI client talks to the server over stdio.
* **Your integration's authority**: the connector is an [integration](../../../app-manager/inbound-integrations.md) of your workspace and can do exactly what that integration is allowed to do — nothing more. Deactivate or delete it in the App Manager and the connector stops.
* **Guard rails inside the tools**: the irreversible operations (`delete_entity`, `delete_page`, `deploy_app`) only run with an explicit `confirm: true` that your agent has to ask you for. `deploy_app` is the builder's Deploy button: it tags a version and the platform brings the production backend up within about a minute; `test_app` is the Test button and starts nothing in production. A `--read-only` mode exposes no mutating tool at all.
* **Version-locked**: every platform serves the MCP server package that matches its own version, so the tools always match the workspace they talk to. The download link comes from the App Manager (it carries an access ticket valid for twelve hours; `npx` keeps the file after the first run, so an expired link only matters on a new machine). Register the versioned file, never a `latest` alias: `npx` keeps a copy of what it ran once and would not notice a platform upgrade behind an unchanged name.

## Getting your connector

Open the [Integrations panel](../../../app-manager/inbound-integrations.md) of the App Manager and add an **MCP connector**. Give it a name (it logs in under that name) and tick _read-only_ if it is meant for production support. The platform builds a package with the credentials inside and shows it right away; later, click the package on the integration's row. The view gives you:

* the `claude mcp add` line for Claude Code,
* the JSON block for Claude Desktop,
* the download link itself, to copy or to download, for any other client.

The link carries an access ticket valid for twelve hours. `npx` keeps the package after the first run, so an expired link only matters on a new machine; open the view again for a fresh one. Changing the integration's password builds the package again; deleting the integration deletes the package and stops the connector at its next login.

Nothing else is needed: no variables, no npm registry (the package carries its dependencies), no installation on your side beyond Node.js 18 or newer.

## Configuration by hand (advanced)

For CI or a checkout of the platform, the server also reads the same four variables as the [Docker Agent](docker-agent.md); they win over the baked-in configuration:

| Variable      | Value                                                        |
| ------------- | ------------------------------------------------------------ |
| `HW_DOMAIN`   | `<account>.<workspace>`, e.g. `my-company.default`           |
| `HW_BROKER`   | `mqtts://<account>.heisenware.cloud:8883`                    |
| `HW_USERNAME` | username of a VRPC integration                               |
| `HW_PASSWORD` | its password                                                 |

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

The terminal commands around the connector - register, check, approve tools, replace, repair - are collected on the [Claude Code cheat sheet](mcp-cheat-sheet.md).

Register the server once with the line from the executable's view in the App Manager; it looks like this:

```bash
claude mcp add --scope user heisenware -- npx -y --no-audit "https://my-company.heisenware.cloud/my-company.default/resources/download/mcp/heisenware-mcp-agentRunner-v93.tgz?t=<ticket>"
```

`--scope user` registers the server for you in every folder. Without it, Claude Code binds the server to the folder the line was run in, and a session started elsewhere does not see it.

Claude Code refuses a name that is already registered (`MCP server heisenware already exists`), for example from an earlier link that has since expired. Remove the old entry and register again:

```bash
claude mcp remove --scope user heisenware
```

`claude mcp list` shows what is registered.

Then start a **new** session: Claude Code connects its servers when a session starts, and the package takes about ten seconds to start the first time. `/mcp` inside the session shows the server as connected; from then on the law is available as the command `/mcp__heisenware__platform-law` (the `/` menu lists it as `/heisenware:platform-law (MCP)`).

The package is self-contained: it carries its dependencies, so the first start needs no access to the npm registry and works on-premise without internet. `--no-audit` keeps npm from asking the public registry for a security report anyway; the first start takes a few seconds, every later one about one.

`claude mcp list` should now show `heisenware` as connected. Then, in every session:

1. Make `/mcp__heisenware__platform-law` your first message. It loads the law.
2. Ask in your own words, for example: _"List my apps and describe the one called Dashboard."_ The tools appear as `mcp__heisenware__<tool>`.

## Claude Desktop

Add the block from the Connect dialog to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "heisenware": {
      "command": "npx",
      "args": [
        "-y",
        "--no-audit",
        "https://my-company.heisenware.cloud/my-company.default/resources/download/mcp/heisenware-mcp-agentRunner-v93.tgz?t=<ticket>"
      ]
    }
  }
}
```

A read-only connector is its own integration, ticked _read-only_ when created; no flag needed. Then, in every chat: open the attachment menu (**+**), pick the `heisenware` server and its `platform-law` prompt as the first message, and ask.

## Other MCP clients

Any other client is configured the same way: `npx -y --no-audit "<download link>"` as the command. Load the law first through the resource `heisenware://law/platform-law`, or paste its text as your first message, then ask.

## Checking the connection

On startup the server prints one line to its error output, which your client shows in its MCP log:

```
heisenware-mcp 93.0.0: connected to my-company.default as agentRunner via mqtts://... - platform v93-server, 60 tools, read-write, law served as prompt + resource
```

A version mismatch between the package and the platform is reported as a warning. Download the package your platform serves to resolve it.

## Visual verification

`layout_lint` and `screenshot` render your app in a headless browser on your machine, signed in as your connector, so a screenshot shows the widgets with their live values. A package built by the App Manager knows your platform's address; all that is needed on your machine is a Chromium:

```bash
npx playwright-core install --with-deps chromium
```

On Linux the `--with-deps` part installs system libraries through the package manager and needs root, so run it with `sudo` there; on macOS and Windows it needs nothing more. Without a working Chromium, both tools stay listed and answer with this instruction — run the line yourself rather than letting the agent improvise around missing libraries.

{% hint style="info" %}
#### Which tools are there?

Ask your agent to list them — every tool carries its own description of what it does and how the platform expects it to be used. The embedded assistant in the App Builder uses exactly the same tools.
{% endhint %}
