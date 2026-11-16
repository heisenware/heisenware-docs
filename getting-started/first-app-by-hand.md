---
description: >-
  Build a small App step by step: two machines, a combined value, a history, and two pages.
---

# Your first App by hand

This tutorial builds the same kind of App as the assistant does, click by click, so you see what every piece is. It reads the load of two machines, takes the higher of the two, keeps its history, and shows both on two pages.

{% hint style="info" %}
If you would rather describe the App than build it, see [Your first App with the assistant](first-app-with-the-assistant.md). Come back here to understand what was built.
{% endhint %}

## Create the App

1. In the App Manager, open **Apps** and click **New app**, then **Blank app**.
2. On the App's page, set the **App Name** and the **Language** in the **General Settings** card, and add an icon.
3. Click **Start App Builder** in the **Development** card.

## Read two data sources

Everything in this section happens on the [Flowboard](../app-builder/flowboard/README.md), and every function comes from the [Functions explorer](../app-builder/explorers/functions.md) on the left.

### The filler

Packaging line 2 has two machines. You read both, so take the first one now and the second right after.

1. Drag the [`create`](../reference/functions/utilities/signal-simulation.md#create) function of **Utilities** > **Signal Simulator** onto the Flowboard. It becomes an executor. Name its instance `filler`.
2. Fill its `options` input:

   ```yaml
   preset: machine
   timeScale: 30
   ```

   The `machine` preset is a generic machine: it runs, goes idle, now and then faults, and its load and temperature follow. `timeScale: 30` lets a simulated minute pass every two seconds, so you see something happen while you build.

3. Right-click the trigger, open **App Start** and pick *once on deploy*. The instance is then part of the App: it is created when the App starts, and creating one that exists changes nothing.
4. Under that instance, drag [`getValues`](../reference/functions/utilities/signal-simulation.md#getvalues) onto the Flowboard. Click its trigger button to run it once: it answers the machine's signals as one object.

   ```json
   { "state": "running", "load": 75.1, "temperature": 47.7, "partCount": 462 }
   ```

5. Add a [modifier](../app-builder/flowboard/modifier.md) to the output with the **+** on its right and pick the machine's load out of it:

   ```javascript
   x.load
   ```

### The capper

Do the same once more. One class, a second living object of it: that is what an [instance](../concepts/executors-and-instances.md) is.

1. Drag `create` onto the Flowboard again and name this instance `capper`. Give it the same `options` and the same **App Start** > *once on deploy* trigger.
2. Drag `getValues` under `capper` onto the Flowboard, and add the same `x.load` modifier to its output.

{% hint style="info" %}
A real machine takes the place of the simulator later, and nothing else about the App changes: a [connector](../reference/functions/connectors/README.md) reads it instead. A machine inside your own network is not reachable from the cloud, whatever the firewall allows; it needs an [agent](../concepts/agents-and-where-code-runs.md) in that network.
{% endhint %}

## Let the values meet

### Combine the two

1. Drag [`combine`](../reference/functions/utilities/data-processing.md#combine) of **Utilities** > **Data Processing** onto the Flowboard. It answers the latest value of each of its inputs as one array.
2. Wire the filler's modifier to its first input and the capper's modifier to its second.
3. Make both inputs run the executor: drag each input onto the executor's trigger. A row appears per source, reading *on input* with a mode button beside it; leave it at *update*, or click it for *change*, *true* or *all updated*. An input that also runs its executor is a hot input. A value arriving at an input never runs an executor by itself. See [Triggers and wires](../concepts/triggers-and-wires.md).
4. Add a modifier to `combine` and take the higher of the two:

   ```jsonata
   $max($)
   ```

   A line is as busy as its busiest machine, so that number is the one worth a gauge.

5. Give both `getValues` executors their own impulse: right-click the trigger, open **App Start** and pick **every 10s**. That is how polling is set.
6. Click **Test** in the top bar and wait for the first interval. Values appear on the items as they arrive. See [Test and deploy](../app-builder/test-and-deploy.md).

### Keep the history

1. Add a [recorder](../app-builder/flowboard/recorder.md) to the modifier of `combine`: **+**, then **Recorder**.
2. Set its **Data Point Name** to `demo_data`. You need that name to read the data back.
3. Leave the App in **Test** for a minute, so there is something to chart.

## Build the pages

### Show the live value

1. Upload a logo or another picture in the [Files explorer](../app-builder/explorers/files.md), then drag it onto the page in the [Page editor](../app-builder/page-editor.md).
2. Place a [circular gauge](../reference/widgets/display/circular-gauge.md) from the display widgets.
3. In its settings, set the scale's start and end value and the colour ranges of its frame.
4. Select the gauge, then drag the modifier of `combine` onto it. The gauge now shows every value that modifier produces. See [Widgets and links](../concepts/widgets-and-links.md).
5. **Test** the App again and watch the needle move.

### Show the history

1. Click the letter icon inside the recorder. It generates the matching [`read`](../reference/functions/storage/timeseries-database.md#read) executor on the Flowboard, already set to `demo_data`.
2. In that executor's `options`, set `tail: 10` to keep the last ten rows.
3. Click its trigger to see the rows it answers.
4. In the [Pages and actions explorer](../app-builder/explorers/pages.md), right-click the page and choose **New Page**. Rename the pages and give them icons; the navigation menu is configured in the same explorer.
5. On the new page, place a [chart](../reference/widgets/display/chart.md), select it, and drag the `read` executor's output onto it. Size and configure the chart in its settings.
6. Place a [button](../reference/widgets/trigger/button.md) and set its text. Then drag the trigger of `read` onto that button: a click now fetches the data again. The trigger goes to the widget, not the widget to the trigger.
7. Give `read` a second trigger source, **App Start** > **once on (re-)load**, so the chart is filled when a user opens the App. A deployed App runs on its own backend: nothing your test run produced reaches it.
8. **Test** the App and try the button.

### Design every screen

A widget's position and size belong to the screen it is on. The screen you first placed a widget on is its reference, and the others follow it until you arrange them yourself.

1. Switch screens with the picker in the top bar.
2. On each screen your App serves, give the page its own layout: its own reading order, its own sizes, fewer things on the phone. A derived screen is a draft, not a result.

See [Screens and layouts](../concepts/screens-and-layouts.md).

### Set the look

1. Open the [Theme editor](../app-builder/theme-editor.md).
2. Pick a base theme, light or dark.
3. Change the accent, the backgrounds, the border radius and the font. The App's look is one theme, not a stack of overrides.

## Deploy and open the App

1. Click **Deploy** in the top bar. That version is what users get from then on.
2. The **Distribute Your App** dialog shows the App's link and a QR code. Scan it with a phone, or open the link.
3. On the device, install the App from the browser's menu to keep it on the home screen.

See [Test and deploy](../app-builder/test-and-deploy.md) for versions, bundles and rollbacks.
