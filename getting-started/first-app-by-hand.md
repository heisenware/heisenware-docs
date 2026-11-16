---
description: >-
  Build a small App step by step: two data sources, a combined value, a history, and two pages.
---

# Your first App by hand

This tutorial builds the same kind of App as the assistant does, click by click, so you see what every piece is. It reads a number from a web API and a value from a public OPC UA server, adds them up, keeps their history, and shows both on two pages.

{% hint style="info" %}
If you would rather describe the App than build it, see [Your first App with the assistant](first-app-with-the-assistant.md). Come back here to understand what was built.
{% endhint %}

## Video

{% embed url="https://www.youtube.com/watch?v=ZOWjfi18SVI" fullWidth="false" %}

{% hint style="warning" %}
The video shows an older App Builder. The steps below are the current ones; where the two differ, follow the text.
{% endhint %}

## Create the App

1. In the App Manager, open **Apps** and click **New app**, then **Blank app**.
2. On the App's page, set the **App Name** and the **Language** in the **General Settings** card, and add an icon.
3. Click **Start App Builder** in the **Development** card.

## Read two data sources

Everything in this section happens on the [Flowboard](../app-builder/flowboard/README.md), and every function comes from the [Functions explorer](../app-builder/explorers/functions.md) on the left.

### HTTP

1. Drag the [`get`](../reference/functions/connectors/http-rest.md#get) function of **Connectors** > **HTTP / REST** onto the Flowboard. It becomes an [executor](../concepts/executors-and-instances.md): the function's arguments are its inputs.
2. Fill the inputs:

   ```yaml
   # url
   https://www.randomnumberapi.com/api/v1.0/random
   # options
   params:
     min: 50
     max: 100
     count: 5
   ```

3. Click the trigger button on the executor to run it once. The output shows the five numbers it answered.
4. Add a [modifier](../app-builder/flowboard/modifier.md) to the output with the **+** on its right, right-click it and choose **Jsonata**, and average the numbers:

   ```jsonata
   $average($)
   ```

### OPC UA

1. Drag the [`create`](../reference/functions/connectors/opc-ua-client.md#create) function of **Connectors** > **OPC UA Client** onto the Flowboard, name the instance `demo` and leave the options empty for an unencrypted connection. Click the trigger to create it.
2. Under that instance, drag [`connect`](../reference/functions/connectors/opc-ua-client.md#connect) onto the Flowboard and give it the server's endpoint:

   ```yaml
   # endpointUrl
   opc.tcp://opcua.demo-this.com:51210/UA/SampleServer
   ```

3. Click its trigger. It answers `true` once connected. [`isConnected`](../reference/functions/connectors/opc-ua-client.md#isconnected) answers the same question later without reconnecting.
4. Drag [`readVariable`](../reference/functions/connectors/opc-ua-client.md#readvariable) onto the Flowboard and give it the node to read:

   ```yaml
   # address
   ns=2;i=10846
   ```

`readVariable` answers the value itself. [`readNode`](../reference/functions/connectors/opc-ua-client.md#readnode) answers the whole node instead, with its status code and timestamps, which you then reduce with a modifier.

{% hint style="info" %}
An OPC UA server inside your own network is not reachable from the cloud, whatever the firewall allows. Such a server needs an [agent](../concepts/agents-and-where-code-runs.md) installed in that network.
{% endhint %}

## Let the values meet

### Combine the two

1. Drag [`combine`](../reference/functions/utilities/data-processing.md#combine) of **Utilities** > **Data Processing** onto the Flowboard. It answers the latest value of each of its inputs as one array.
2. Wire the HTTP modifier to its first input and the `readVariable` output to its second.
3. Make both inputs run the executor: drag each input onto the executor's trigger. A row appears per source, reading *on input* with a mode button beside it; leave it at *update*, or click it for *change*, *true* or *all updated*. An input that also runs its executor is a hot input. A value arriving at an input never runs an executor by itself. See [Triggers and wires](../concepts/triggers-and-wires.md).
4. Add a modifier to `combine` and sum the two:

   ```jsonata
   $sum($)
   ```

5. Give `readVariable` and `get` their own impulse: right-click the trigger, open **App Start** and pick **every 10s**. That is how polling is set.
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
6. Place a [button](../reference/widgets/trigger/button.md), set its text, and drag the button onto the trigger of `read` so a click fetches the data again.
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
