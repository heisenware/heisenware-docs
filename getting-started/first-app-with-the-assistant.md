---
description: >-
  Build your first App by saying what you want: a monitor for packaging line 2, with simulated signals and no hardware.
---

# Your first App with the assistant

The fastest way into Heisenware is to describe the App you want and watch it being built. This page builds a small one end to end: a monitor for acme's packaging line 2, with simulated filler signals, so you need no machine and no network.

You will need an account and a workspace. See [Sign up and sign in](sign-up-and-sign-in.md).

{% stepper %}
{% step %}
### Create the App

In the App Manager, open **Apps** and click **New app**, then **Blank app**. The App is created at once, named `App 1`, and its page opens.

On that page, the **General Settings** card holds the **App Name**, the **Language** your users read, and the **Description** they see when they install the App. Call it `Line 2 monitor`.

If you have requirements, a data sample or a logo in hand, start on the **Planning** screen instead: there the assistant sees the whole workspace, takes your files into the **Project knowledge** rail, and scaffolds the Apps a plan needs. See [Planning](../app-manager/planning.md).
{% endstep %}

{% step %}
### Open the Builder and the assistant

On the App's page, the **Development** card has **Start App Builder**. The Builder opens in a new tab, with the **Console** at the bottom and the **Assistant** tab in it. If the Console is closed, reopen it with **Toggle Console** in the top toolbar.
{% endstep %}

{% step %}
### Say what you want

Write it the way you would tell a colleague. Name the devices, the values and what you want to see:

> Build a monitor for packaging line 2 on the desktop. There is no PLC yet, so simulate the filler with the Signal Simulator's `machine` preset: its state, load, temperature and part count. One page with the filler's name and part count at the top, a status lamp that is green while it runs, grey when it is idle and red on a fault, a gauge for the load in percent, and a chart of the temperature.

Press Enter to send. The round button becomes **Stop** while the assistant works, so you can interrupt it at any point.
{% endstep %}

{% step %}
### Watch it build

The assistant works out loud. Between its sentences, one line appears per step it takes: the widget contracts it reads, the executors it creates, the links it draws. Click a line to see what it sent. Under the feed, a **Working** line names the step it came from and how long it has been going. Only a step that failed prints its answer; the rest stay quiet.

For this App it saves a **checkpoint** first, then builds roughly this:

* **A Signal Simulator instance** on the Flowboard, created from the `machine` preset and triggered **once on deploy**, so the simulation exists whenever the App runs.
* **An `onTick` executor** beside it. Its event outputs carry the value map of every tick: `state`, `load`, `temperature`, `partCount`.
* **The widgets** on the page, each linked to the value it shows, and a titled section around the executors that belong together.

The Builder follows along: it switches to the page and the screen the assistant is working on, and the node or widget it points at pulses on the canvas. A member who clicks elsewhere mid-run is left alone until the next message.

Then it verifies its own work: it starts the App with **Test**, clicks through it the way a user would, checks the geometry of every screen, takes a screenshot and looks at it. Done means the display showed the value, not that the function returned it.
{% endstep %}

{% step %}
### Steer it

* **Ask for a change** in plain words: *make the chart show the last hour and move the lamp next to the name*.
* **Point at something**: click a widget, an executor or a file, and the Console header shows what is selected (**Widget: circularGauge**, **Executor Selected**). Then *this gauge should end at 120* needs no further explanation.
* **Go back**: every checkpoint is a version. Open **Tags** in the top bar, click the one you want, and confirm **Switch**. Pages, widgets, executors, extensions, variables and the theme come back as they were.
{% endstep %}

{% step %}
### Deploy and open the App

A deploy is what your users get, so the assistant never does it on its own. Ask for it, and an **Approval required: deploy\_app** card appears in the chat with the call it wants to make. Click **Approve**.

The version badge in the top bar becomes `v1`. Click it for **Distribute Your App**: the App's link and a QR code to scan with a phone. The link always serves the deployed version, and a device that opens it can install the App.
{% endstep %}
{% endstepper %}

{% hint style="info" %}
A deployed App runs on its own backend. Nothing a test run in the Builder produced carries over, so every display that must show something on first sight needs a source of its own in the App. That is why the simulator is created on App start and not by hand.
{% endhint %}

## Where to go next

* [Your first App by hand](first-app-by-hand.md): the same mechanics, built click by click, to see what the assistant actually made.
* [Executors and instances](../concepts/executors-and-instances.md): the node on the Flowboard, and the living objects behind it.
* [The assistant](../assistant/README.md): what it can do, how it verifies, and where it stops and asks.
* [Planning](../app-manager/planning.md): for anything larger than one App.
