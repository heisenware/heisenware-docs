---
description: >-
  The AI built into Heisenware: where it sits, what it builds by, how it works, what
  it reads and what it asks you first.
---

# The assistant

The **assistant** is the AI built into Heisenware. It builds Apps with you: it reads the platform, creates executors and widgets, wires them, starts the App and looks at the result. In the App Manager it plans Apps with you; in the App Builder it builds them.

It works in your workspace as you, with your rights, and never more: every call it makes goes through your own login. It is how most of the platform is driven. You say what the App has to do, the assistant builds it while you watch, and you correct it in words.

{% hint style="info" %}
The assistant is there where the installation runs it. In the Heisenware cloud it always does. On [your own server](#what-leaves-the-platform) it runs once you give the installation your own Anthropic key, and without one there is no assistant. [Your own AI client](mcp-server.md) works everywhere.
{% endhint %}

## Two seats

* **[Planning](../app-manager/planning.md)**, in the App Manager, with no App open and the whole workspace in view: you bring your documents, agree what the Apps are and what they look like, and it creates them empty. It builds no content there.
* **[The Console](../app-builder/assistant.md)**, at the bottom of the App Builder, with one App open: it builds and changes that App. Every executor it places and every widget it moves appears on the Flowboard and on the page as it happens.

A conversation belongs to you and to the App you are in; other members do not read it. What should outlive it goes into the [project notes](../app-manager/planning.md#project-knowledge), which the whole team shares.

## What it builds by

Every tool tells the assistant what it does, but building a good App follows rules no single tool can carry: how triggers, wires and variables relate, when to verify, how to treat files and credentials, what belongs in one App and what in a suite. Those rules are the **platform law**, one text that ships with the platform and is versioned with it. The assistant reads it before its first build action, and these pages agree with it: where a concept page and the law would disagree, the law decides. Your own AI client gets the same text, section by section, see [the platform law](mcp-server.md#the-platform-law-comes-first).

## How it works

* **In the open**: it says what it is about to do, does it, and points at what it changed. The App Builder follows along: every write to a page and every look at one brings your canvas to that page and screen. A **Stop** ends a run, and what was done is kept.
* **A checkpoint first, a rollback as undo**: before a build of several steps it saves a [checkpoint](../app-builder/test-and-deploy.md#versions-and-checkpoints). Inside an App it then changes and deletes freely, because a rollback brings the records back: pages, widgets, executors with their extensions, sections, variables, endpoints, the theme. If a result disappoints, ask for the rollback.
* **It tests what it built**: it starts the App inside the Builder (**Test**, never a deployment), checks the layout as numbers first (widgets that overlap, text that is cut, surfaces nobody can see), takes screenshots and looks at them, and then uses the App the way a user does: clicks the button, types the value, reads what the widgets show. Done means it saw the result in the App, not that the backend answered.
* **It asks for your go** for what a rollback cannot undo: deleting a whole App, deploying, ending a registration on an agent, and reshaping the data model or running SQL that loses data. A card names the one call and waits for **Approve** or **Reject**. Deleting an executor, a widget or a page asks nothing: a rollback restores it.
* **It hands platform defects back to you**: when the platform contradicts its own law or tools, the assistant reports it instead of quietly working around it. The card shows the whole report, and **Inform Heisenware** files it with us. Nothing is sent unless you click. On a self-hosted installation nothing is sent home at all: the card copies the report for you to mail.

## What it reads

* **The structure of your Apps**, always: pages, widgets, executors, variables, endpoints, the theme, the data model, and which agents, containers and functions exist.
* **Live values, data and pictures**, under one policy. Reading a cached value, querying a database or an InfluxDB, opening a file a row points to, reading the log of an agent or a container, taking a screenshot: all of that is what your Apps hold and what they saw, and it may be personal data. An installation can switch the whole family off; the tools then refuse, and the assistant may not build an executor to read around them. A read-only connection has it off as well.
* **Project notes only when you agree**: notes are the workspace's shared memory ([project knowledge](../app-manager/planning.md#project-knowledge)). Outside the planning seat the assistant lists them and asks before it reads one, because a note read into a conversation rides along with every later turn of it. A file you attach yourself is yours to give.
* **What you attach**: documents, a data sample, a photo of a machine label, a PDF of a requirement. It reads them before it answers.
* **The platform's own source**, for exactly the version that runs, when a tool's answer is ambiguous. It never changes it.

## What it cannot do

* **It cannot deploy on its own.** A release always needs your go, and [Deploy](../app-builder/test-and-deploy.md#deployment) stays your decision.
* **It cannot build or install agents.** It reads the fleet and tells you what is wrong with an agent, but creating, updating or restarting one happens in the [Agents](../app-manager/agents/README.md) panel or on the host, by you. The same holds for an [add-on](../developers/custom-add-ons.md) of your own.
* **It cannot change what your plan allows.** At the App quota it refuses to create another App and names the limit; [Plan & Billing](../app-manager/plan-and-billing.md) is yours.

## What leaves the platform

What you write, what the assistant answers, and everything it reads to get there travels to the AI provider the installation calls. The service calls **Anthropic**: the model is `claude-opus-5-5` unless the installation names another, and the installation holds one API key for it. Tell your team what that means before you point the assistant at production data, and remember that a screenshot of a page carries the values on it.

On **your own server** the package carries the assistant, and the key is yours: the assistant runs once `.env` holds your Anthropic API key as `HW_ANTHROPIC_API_KEY` (see [Install](../self-hosting/install.md#the-env-file)). Its conversations then go from your installation to Anthropic (`api.anthropic.com`) over outbound HTTPS, under your own agreement with Anthropic, and nothing goes to Heisenware: a platform defect is copied for you to mail, never sent. Without a key there is no planning seat and no assistant in the Builder, and no conversation leaves your network. Such an installation is driven with [your own AI client](mcp-server.md), which spends your own AI subscription and leaves the choice of provider to you; a local MCP server needs no internet at all.

## What it costs

Every run of the assistant spends the account's **credits**, in the planning seat and in the Console alike. [Plan & Billing](../app-manager/plan-and-billing.md#ai-usage-and-credits) shows the balance, what was spent this month and by whom, and sells more. When nothing is left, the assistant says so and stops. Your own AI client spends none.

On your own server the assistant counts no credits: a run costs what Anthropic charges on your key, and **Plan & License** shows that in euros.

## Your own AI client instead

The platform offers the same tools to the AI you already pay for: Claude, ChatGPT, Gemini, Claude Code, Microsoft's agents or any other client that speaks the Model Context Protocol. There are two ways in, and you can use both:

* **The workspace's MCP address**, with nothing to install: see [AI clients](../app-manager/ai-clients.md).
* **A local MCP server** on your own computer, for a client that should work with your local files: see [MCP server](mcp-server.md).

What those clients get is listed on [MCP tools](mcp-tools.md), and it is what the built-in assistant works with. They too build by the platform law: a tool that builds runs once the client has read the sections it builds on. And they too need your explicit go for what a rollback cannot undo, as a `confirm: true` on exactly that call.

## Ask, for an App's users

The invited users of an App do not build: they ask. **[Ask](../app-manager/ask.md)** gives them an AI inside the App, or from their own AI client, that answers from the workspace's data, draws charts, runs the App's endpoints for them and makes reports to download. It changes no App and no setting. A member switches it on per App.
