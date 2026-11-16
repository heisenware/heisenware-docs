# Claude Code cheat sheet

The terminal side of the [MCP server](mcp-server.md): what you type to register, check, use and repair a Heisenware connection in Claude Code. The App Manager gives you the address and the lines; this page is what you do with them.

## Register once

{% tabs %}
{% tab title="By the MCP address" %}
```bash
claude mcp add --transport http heisenware <MCP address>
```

The address is on the App Manager's [AI clients](../app-manager/ai-clients.md) page, which also hands you this exact line. Then, in a session, type `/mcp`, choose **Authenticate**, and sign in with your App Manager login. Nothing is installed, and your local files stay out of reach.
{% endtab %}

{% tab title="As a local MCP server" %}
```bash
claude mcp add heisenware -- npx -y --no-audit --prefer-offline -p "<link from the App Manager>" heisenware-mcp
```

On Windows: `claude mcp add heisenware -- cmd /c npx …`, the line the App Manager shows too, run in PowerShell or cmd. Git Bash turns `/c` into a path.

The link carries an access ticket valid for twelve hours; `--prefer-offline` lets `npx` start the package it installed on the first run without asking the link again, so an expired ticket only matters on a new machine. This is the way that reaches [your files](mcp-server.md#your-files).
{% endtab %}
{% endtabs %}

Run the line in the project folder you work in. Claude Code registers the server for that folder, its default scope; `--scope user` registers it for every folder instead.

The server's name is its workspace's: `heisenware` for the `default` workspace, `heisenware-<workspace>` for any other (`heisenware-assembly`, for a workspace named Assembly). The App Manager's lines carry the right one, so two workspaces can share one folder or one scope. This page writes `heisenware`; in another workspace read its name instead, in the commands, in the tool names and in the law's prompt (`/mcp__heisenware-assembly__platform-law`).

## Check

| Command | What it tells you |
| --- | --- |
| `claude mcp list` | Every registered server with its health. `✓ Connected` means it answered: for a local MCP server, that it started and logged in. |
| `claude mcp get heisenware` | The stored command or address, and the scope it lives in. |
| `/mcp` (inside a session) | The servers of this session: status, authentication, tools. |

## Use

* **Start a new session after registering.** Claude Code connects its servers when a session starts; a session that was already open never learns about a new server. A local MCP server needs a few seconds on its first start, while `npx` unpacks the package.
* **Load the law first, every session:** `/mcp__heisenware__platform-law`, which the `/` menu lists as `/heisenware:platform-law (MCP)`. It is the rulebook Claude builds by. A connection by the address has it as the tool `get_platform_law` as well.
* **Tools** are named `mcp__heisenware__<tool>`, for example `mcp__heisenware__create_app`; [MCP tools](mcp-tools.md) lists them. Claude Code asks before the first use of each, and _always allow_ remembers it for the project.

## Approve tools without the prompts

For a session: `/permissions`. For good, in `.claude/settings.json` of the project or `~/.claude/settings.json`:

```json
{
  "permissions": {
    "allow": ["mcp__heisenware__*"],
    "deny": [
      "mcp__heisenware__deploy_app",
      "mcp__heisenware__delete_entity",
      "mcp__heisenware__end_registration",
      "mcp__heisenware__reshape_data_model"
    ]
  }
}
```

Deny rules win over allow rules, so those four stay behind a question while everything else runs. They are the tools that need your explicit `confirm: true` anyway, which Claude has to ask you for.

## Scripts and CI

```bash
echo "List the apps of this workspace" | claude -p --allowedTools "mcp__heisenware__*"
```

Put `--allowedTools` before the prompt or feed the prompt through stdin as above: the flag takes a list and would swallow a trailing prompt. `--output-format json` gives a machine-readable answer. For an isolated run, `--mcp-config <file> --strict-mcp-config` uses only the servers of that file. A slow first start needs a longer wait: `MCP_TIMEOUT=60000 claude -p ...` (milliseconds).

## Replace a local MCP server

After a platform update or a new password: open the package in the App Manager, take the fresh line, then

```bash
claude mcp remove heisenware
claude mcp add heisenware -- npx -y --no-audit --prefer-offline -p "<fresh link>" heisenware-mcp
```

and start a new session. Without a scope, `remove` takes the entry from whichever scope holds it, also one registered with `--scope user` by an earlier line.

## When something is off

| You see | Cause and fix |
| --- | --- |
| `MCP server heisenware already exists` | The name is taken, usually by an earlier registration. `claude mcp remove heisenware`, then add again. |
| `Unknown command: /mcp__heisenware__platform-law` | The server is not connected in this session: it was registered after the session started, in another folder, or it is still starting. Start a new session, give it a few seconds, check `/mcp`. |
| `✘ Failed to connect` in `claude mcp list` | By the address: sign in again with `/mcp`, **Authenticate**: the connection may have been disconnected in the App Manager or have expired after 90 days unused. As a local MCP server: run the stored command yourself (`claude mcp get heisenware` shows it). A `401` means the link's ticket has expired and `npx` asked for it again, from a line registered without `--prefer-offline` or a cleared npm cache: register a fresh line. A login error means the integration was deactivated, deleted, or its password changed: rebuild the package in the App Manager. |
| It was fine yesterday, dead today | Same as above: the platform was updated or the integration changed. Rebuild the package and register the fresh line. |
| `layout_lint` / `screenshot` answer with an install instruction | Your machine lacks a Chromium: `npx playwright-core install --with-deps chromium`, with `sudo` on Linux. Run it yourself; do not let Claude work around missing libraries. |
| `… is not available on a read-only connection` | The connection may only read: a read-only integration, `--read-only`, or _Only look_ chosen when you signed in. |
| `… is irreversible and needs confirm: true` | Claude asked for a deploy, a deletion of a whole App, an end of a registration or a reshape of the data model. Tell it to go ahead on exactly that call, or do it in the UI yourself. |
| Slow or timing out at start | `MCP_TIMEOUT=60000 claude` gives the first `npx` start a minute. |
| You want to see what happens | `claude --debug mcp` prints the connection log. |
