---
description: >-
  How your own AI client gets the platform's tools: the workspace's MCP address, or a
  local MCP server on your computer.
---

# MCP server

The Heisenware **MCP server** lets you drive the platform from **your own AI client**: Claude, ChatGPT, Microsoft Copilot, Gemini, Claude Code, or any client that speaks the [Model Context Protocol](https://modelcontextprotocol.io). Your client gets the same tools the [assistant](README.md) uses, listed on [MCP tools](mcp-tools.md): creating Apps, wiring executors, placing widgets, verifying the result. You spend your own AI subscription, and nothing runs through Heisenware's models.

## Two ways in

| | By the MCP address | As a local MCP server |
| --- | --- | --- |
| **What it is** | The workspace serves the tools at `https://<platform host>/<account>.<workspace>/mcp`. | A package you run on your own computer, which talks to the workspace over the same encrypted MQTT connection an agent uses. |
| **To set up** | Nothing to install: paste the address into your client and sign in with your App Manager login. | Add a **Local MCP server** integration, register the package with your client. |
| **It works as** | you, with your rights, until you disconnect it. | its [integration](../app-manager/integrations.md), with the authority that integration has. |
| **Your files** | stay out: files travel through the workspace's shared files. | are reachable: bundles land on your disk, screenshots are local files, and a local file goes up as it is. |
| **Good for** | AI clients in the cloud (claude.ai, ChatGPT, Microsoft 365 Copilot, Le Chat) and for clients on your machine that need no local files. | a client in your terminal or editor that works on your files anyway: Claude Code, Claude Desktop, Cursor. |

[AI clients](../app-manager/ai-clients.md) is the page for the first way: the address, the steps per client, signing in, and what a connection may do. The rest of this page is about the second.

## What a local MCP server is

* **Your client starts it.** The package runs on your machine and talks to your AI client over its standard input and output. Nothing listens on a port, and the workspace never reaches your computer.
* **It has its integration's authority.** A local MCP server is an [integration](../app-manager/integrations.md) of the workspace and can do exactly what that integration may do, nothing more. Deactivate or delete it in the App Manager and the server stops at its next login.
* **One per member.** The integration is named after you, and it logs in as `<name>@<account>.<workspace>`, for example `burkhard@acme.default`, so one can be removed without touching the others.
* **Read-only is a choice when you create it.** A read-only integration is the one for production support: the mutating tools are not offered at all, and live values cannot be read. The flag `--read-only` does the same for a server you configure yourself.
* **It is version-locked.** Every platform serves the package that matches its own version, so the tools always match the workspace they talk to. The server warns when the two majors differ.

## Get it and register it

The [Integrations panel](../app-manager/integrations.md) of the App Manager creates the integration, builds the package with the credentials inside, and hands you the lines to paste. The package view gives you the `claude mcp add` line for Claude Code and its Windows variant, the JSON block for Claude Desktop, and the download link itself for any other client.

All you need on your side is Node.js 18 or newer. There are no environment variables to set, and no npm registry is involved: the package carries its dependencies, so the first start works on-premise without internet.

{% hint style="warning" %}
#### The link carries a ticket

The download link is valid for twelve hours. `--prefer-offline` lets `npx` start the copy it installed on the first run without asking the link again, so an expired ticket only matters on a new machine: open the package view again for a fresh link. Register the versioned file, never a `latest` alias: `npx` keeps what it ran once and would not notice a platform upgrade behind an unchanged name.
{% endhint %}

### The server's name is its workspace's

Every line the App Manager hands you registers the server as `heisenware` for the `default` workspace and as `heisenware-<workspace>` for any other. Your client puts that name in front of every tool (`mcp__heisenware__describe_app`) and every prompt, so two workspaces can live in one client without colliding. The examples below use `heisenware`; in another workspace read its name instead.

{% tabs %}
{% tab title="Claude Code" %}
```bash
claude mcp add heisenware -- npx -y --no-audit --prefer-offline -p "https://acme.heisenware.cloud/acme.default/resources/download/mcp/heisenware-mcp-burkhard-v93.tgz?t=<ticket>" heisenware-mcp
```

Run it in the project folder you work in: Claude Code registers the server for that folder, its default scope, so each folder can point at its own platform. `--scope user` registers it for every folder instead.

Then start a **new** session: Claude Code connects its servers when a session starts. The terminal side of all this, including what to do when something is off, is on the [Claude Code cheat sheet](claude-code-cheat-sheet.md).
{% endtab %}

{% tab title="Claude Desktop" %}
Add the block from the package view to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "heisenware": {
      "command": "npx",
      "args": [
        "-y",
        "--no-audit",
        "--prefer-offline",
        "-p",
        "https://acme.heisenware.cloud/acme.default/resources/download/mcp/heisenware-mcp-burkhard-v93.tgz?t=<ticket>",
        "heisenware-mcp"
      ]
    }
  }
}
```

Then ask. Nothing has to be loaded per chat: the server hands Claude the [platform law](mcp-server.md#the-platform-law-comes-first) by itself.
{% endtab %}

{% tab title="Windows" %}
Start `npx` through `cmd` and run the line in PowerShell or cmd, not in Git Bash, which turns `/c` into a path. The App Manager shows this line too:

```bash
claude mcp add heisenware -- cmd /c npx -y --no-audit --prefer-offline -p "<link>" heisenware-mcp
```
{% endtab %}

{% tab title="Other clients" %}
Any other client takes the same command: `npx -y --no-audit --prefer-offline -p "<download link>" heisenware-mcp`. The package carries two executables, the local server and the support agent of an on-premise installation ([remote support](../self-hosting/remote-support.md)), so the line has to name the one to run.
{% endtab %}
{% endtabs %}

## The platform law comes first

The tools describe themselves, but building a good App follows rules no single tool can carry: how triggers, wires and variables relate, when to verify, how to treat files and credentials. That is the [platform law](README.md#what-it-builds-by). You do not have to load it: the server hands it to your AI client in the law's own sections, where they are needed.

* **The tool `get_platform_law`** answers the law's front page: the mental model, the sections, and the tools that build on each. The server's connection instructions tell every client to call it before its first build action. With a section's number it answers that section, with a tool's name everything that tool builds on.
* **A tool that builds asks for its sections itself.** Until your client has read the sections a tool builds on, the tool does not run. It names them, the client reads them with `get_platform_law` and calls the tool again. You see a first call that is refused and then repeated: that is the law arriving, not an error. A tool that lists, describes or reads values asks for nothing, and neither does one that only takes something away or stops.
* **The whole text in one piece** is the prompt `platform-law` and the resource `heisenware://law/platform-law`. Claude Code turns the prompt into the command `/mcp__heisenware__platform-law` (`/mcp__heisenware-<workspace>__platform-law` outside the default workspace), Claude Desktop lists it in the attachment menu. A client that took one of them is asked for no section.

What a client has read counts for its connection: for a local MCP server as long as it runs, for the workspace's MCP address until the connection has rested for ten minutes. After that a tool asks for its sections again.

Two more kinds of knowledge come as resources: a widget's binding contract as `heisenware://widgets/<type>/manifest`, and a connector's domain guide as `heisenware://connectors/<class>/guide`. The tools `get_widget_manifest` and `get_connector_guide` answer the same text for clients that read no resources.

## Your files

A local MCP server shares your computer with your AI client, so files move as paths on both sides:

* `export_app` writes the App's `.hwt` bundle next to your client, and `import_app` takes one from disk: that is how your client derives one App from another without the App Builder.
* `fetch_shared_file` and `open_file` copy a shared file, or a file a table row points to, into a local folder and answer its path, for your client to open and read.
* `upload_shared_file` takes a local file, up to 15 MB, into the workspace's shared files.
* `screenshot` hands the picture to your client and writes the PNG into the same local folder, under `screens/`, so your client can open it again later.

By the MCP address the same tools work with the workspace's shared files instead, since the client is somewhere else: [Files](../app-manager/ai-clients.md#files) says how a file gets in and out there.

## Visual verification

`layout_lint` and `screenshot` render your App in a headless browser on your machine, signed in as the integration, so a screenshot shows the widgets with their live values. `use_app` clicks and types in it like a member. A package built by the App Manager knows your platform's address; all that is missing on your machine is a Chromium:

```bash
npx playwright-core install --with-deps chromium
```

On Linux `--with-deps` installs system libraries through the package manager and needs root, so run it with `sudo` there; on macOS and Windows nothing more is needed. Without a working Chromium the three tools stay listed and answer with this instruction. Run it yourself rather than letting your AI client improvise around missing libraries.

## Checking the connection

On startup the server prints one line to its error output, which your client shows in its MCP log:

```
heisenware-mcp 93.0.0: connected to acme.default as burkhard@acme.default via mqtts://acme.heisenware.cloud:8883 (config.json) - platform v93-server, 119 tools, read-write, law served as prompt + resource
```

It names, in order: the package version, the workspace, the login, the broker, where the credentials came from, the platform's version, how many tools are served, whether the connection may change anything, and whether the law rode along. `READ-ONLY` there means 38 tools instead of 119. A mismatch between the package's major version and the platform's is reported as a warning: download the package your platform serves to resolve it.

## Configuration by hand

For CI, or for a checkout of the platform, the server reads the same four environment variables as the [Docker agent](../app-manager/agents/docker-agent.md). They win over the configuration baked into the package.

| Variable | Value |
| --- | --- |
| `HW_DOMAIN` | `<account>.<workspace>`, e.g. `acme.default` |
| `HW_BROKER` | `mqtts://<account>.heisenware.cloud:8883` |
| `HW_USERNAME` | username of a VRPC integration, `<name>@<account>.<workspace>` |
| `HW_PASSWORD` | its password |

Optional:

| Variable | Value |
| --- | --- |
| `HW_PUBLIC_HOST` | `https://<account>.heisenware.cloud`: enables the visual tools |
| `HW_WORKSPACE` | the folder for fetched files and screenshots (default: `heisenware-mcp/<domain>` in your temp directory) |
| `HW_ALLOW_VALUE_READS` | `false` holds back everything that reads live values, data or pictures |
| `HW_DEPLOY_MODE` | `onprem` for an on-premise installation (default `server`) |

Flags: `--read-only` for production support, `--version`, `--help`.

{% hint style="info" %}
#### Which tools are there?

[MCP tools](mcp-tools.md) lists all of them, generated from the code, with what each one changes and what needs your explicit go. Your AI client can list them too: every tool carries its own description.
{% endhint %}
