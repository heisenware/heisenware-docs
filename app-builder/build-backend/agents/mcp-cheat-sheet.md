# Claude Code cheat sheet

The terminal side of the [MCP server](mcp-server.md): everything you type to register, check, use and repair the Heisenware connector in Claude Code. The App Manager's Integrations panel gives you the link and the lines; this page is what you do with them.

## Register once

```bash
claude mcp add --scope user heisenware -- npx -y --no-audit "<link from the App Manager>"
```

`--scope user` registers the server for you in every folder. Without it Claude Code binds the server to the folder you ran the line in, and a session started elsewhere does not see it. The link carries an access ticket valid for twelve hours; `npx` keeps the package after the first start, so the link only matters on a new machine.

## Check

| Command | What it tells you |
| --- | --- |
| `claude mcp list` | Every registered server with its health. `✓ Connected` means the connector started and logged in - the first time this fetches the package. |
| `claude mcp get heisenware` | The stored command and the scope it lives in. |
| `/mcp` (inside a session) | The servers of this session: status, reconnect, tools. |

## Use

* **Start a new session after registering.** Claude Code connects its servers when a session starts; a session that was already open never learns about a new server. The connector needs about ten seconds on its first start.
* **Load the law first, every session:** `/mcp__heisenware__platform-law` - the `/` menu lists it as `/heisenware:platform-law (MCP)`. It is the rulebook the agent builds by.
* **Tools** are named `mcp__heisenware__<tool>`, e.g. `mcp__heisenware__create_app`. Claude Code asks before the first use of each; "always allow" remembers it for the project.

## Approve tools without the prompts

For a session: `/permissions`. For good, in `.claude/settings.json` of the project or `~/.claude/settings.json`:

```json
{ "permissions": { "allow": ["mcp__heisenware__*"] } }
```

A single tool is `mcp__heisenware__create_app`. Deny rules win over allow rules, so `"deny": ["mcp__heisenware__delete_*"]` keeps the destructive tools behind a question even when everything else is allowed - they need your explicit `confirm` anyway.

## Scripts and CI

```bash
echo "List the apps of this workspace" | claude -p --allowedTools "mcp__heisenware__*"
```

Put `--allowedTools` before the prompt or feed the prompt through stdin as above: the flag takes a list and would swallow a trailing prompt. `--output-format json` gives a machine-readable answer. For an isolated run, `--mcp-config <file> --strict-mcp-config` uses only the servers of that file. A slow first start needs a longer wait: `MCP_TIMEOUT=60000 claude -p ...` (milliseconds).

## Replace the connector

After a platform update, a new password, or an expired link: open the executable in the App Manager, take the fresh line, then

```bash
claude mcp remove --scope user heisenware
claude mcp add --scope user heisenware -- npx -y --no-audit "<fresh link>"
```

and start a new session.

## When something is off

| You see | Cause and fix |
| --- | --- |
| `MCP server heisenware already exists` | The name is taken, usually by an earlier registration. `claude mcp remove --scope user heisenware`, then add again. |
| `Unknown command: /mcp__heisenware__platform-law` | The server is not connected in this session: it was registered after the session started, in another folder without `--scope user`, or it is still starting. Start a new session, wait ten seconds, check `/mcp`. |
| `✘ Failed to connect` in `claude mcp list` | Run the stored command yourself (`claude mcp get heisenware` shows it). A `401` means the link's ticket has expired: fetch a fresh line from the App Manager. A login error means the integration was deactivated, deleted, or its password changed: rebuild the package in the App Manager. |
| The connector was fine yesterday, dead today | Same as above: the platform was updated or the integration changed. Rebuild from the executable's view and register the fresh line. |
| `layout_lint` / `screenshot` answer with an install instruction | Your machine lacks a Chromium: `npx playwright-core install --with-deps chromium`, with `sudo` on Linux. Run it yourself; do not let the agent work around missing libraries. |
| Slow or timing out at start | `MCP_TIMEOUT=60000 claude` gives the first `npx` start a minute. |
| You want to see what happens | `claude --debug mcp` prints the connection log. |
