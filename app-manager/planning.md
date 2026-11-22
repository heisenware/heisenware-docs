---
description: >-
  The assistant's planning seat: bring your documents, agree what the Apps are,
  and let it scaffold them.
---

# Planning

**Planning** is the assistant's seat in the App Manager, with no App open and your whole workspace in view. It is where a set of Apps is decided before any of them is built.

Planning produces identity, not wiring. You bring what you have: requirement documents, a data sample, a logo, a sentence about the shift that keeps going wrong. The assistant distils that into [project notes](#project-knowledge), asks for what a plan cannot invent, and on your go creates the Apps empty. Building then continues in each App's [App Builder](../app-builder/README.md), where you watch it happen.

For what the assistant is and how it works everywhere, see [The assistant](../assistant/README.md).

{% hint style="info" %}
**Planning** appears only where the installation has the assistant: the platform is given an AI key, and the screens are told that it is there. The Heisenware cloud has one. A self-hosted installation has the assistant once you give it your own Anthropic key ([Install](../self-hosting/install.md#the-env-file)); without one it has no planning seat and no assistant in the Builder, and works through [your own AI client](ai-clients.md) instead.
{% endhint %}

## The ritual

{% stepper %}
{% step %}
### Bring the documents

Upload them to **Project knowledge**, or hand one to a question with the paperclip. The assistant reads them and writes what it understood into the project notes: the requirements, the decisions, the shape of the data.
{% endstep %}

{% step %}
### Answer what a plan cannot invent

It asks, and the answers belong to you:

* each App's **name** and its one-sentence role;
* the **corporate design**: the look, the accent colour, backgrounds, radius, font, a logo if there is one;
* the **devices** each App runs on. They become its screens: a kiosk terminal or an HMI panel at a machine, a desktop dashboard, a phone in a pocket, a tablet carried around.
* the **language** the Apps speak;
* the **navigation** that fits the device.
{% endstep %}

{% step %}
### Say go

The assistant creates the Apps, empty: each with its name, description, icon, screens, language, navigation and theme, and nothing inside. It writes their ids and roles into the project notes and hands you a link into each App's Builder.
{% endstep %}

{% step %}
### Build in the Builder

Open an App and build it there, with the assistant beside you. It reads the project notes when you agree, so it starts knowing what was decided here.
{% endstep %}
{% endstepper %}

Ask for content from the planning seat and it will say no: executors, widgets and wiring are built in an App, not here.

## The chat

The conversation runs down the middle of the screen. It shows what the assistant is doing while it works, and three kinds of card come up in it:

* **Approval required**: before anything that changes something, a card names what and offers **Approve** or **Reject**. Nothing happens until you press one.
* **Platform issue**: the assistant suspects a defect in the platform. The card shows the whole report it would send. **Inform Heisenware** files it and shows you the link; the tick **Include this conversation (credentials redacted)** decides whether the conversation rides along, and **Dismiss** folds the card and sends nothing. On a self-hosted installation nothing is sent home: the button copies the report for you to mail.
* **Notes**: where the assistant would point at something on a canvas in the Builder, here it writes a note instead.

The assistant's tool calls fold as in the Builder: the calls between two messages are one closed line that counts them, a failed call is a muted line under its call, and while a run is on, the line under the feed says what happens now. See [It works in the open](../app-builder/assistant.md#it-works-in-the-open).

**Stop** ends a run; what was done is kept. The trash icon, **Start a fresh conversation**, deletes the conversation: a reload does not bring it back, and your other open tabs of the planning seat start anew too. The project notes stay. The icon is grey while a run is on.

A conversation belongs to you and the workspace you are in. Other members do not read it, and it survives closing the tab: a run started in one tab shows in another.

## Project knowledge

Beside the chat stands **Project knowledge**, in two groups:

* **Project notes**: what the assistant distilled, as Markdown files in the workspace's `project/` folder. They are the handover to every Builder session.
* **Uploads**: the files you brought.

Both are shared with your whole team, unlike the conversations. Drop files anywhere on the rail or use **Upload**. On each file: the paperclip hands it to the next question, the arrow downloads it, and the trash deletes it for everyone. Clicking a Markdown, text, image or PDF file opens it for reading.

## Switching planning off

The switch at the top right turns the seat off. Nothing runs here then, and an App you open in the Builder does not greet you with what planning prepared; the assistant in the Builder still helps when you ask it. Your conversation is kept, and switching back on brings it back.

## What it costs

Planning spends the account's credits, like every run of the assistant. **Plan & Billing** shows [what was spent and by whom](plan-and-billing.md#ai-usage-and-credits) and sells more. Your own AI through the [MCP server](ai-clients.md) spends none.
