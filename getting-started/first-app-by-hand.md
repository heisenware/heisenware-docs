---
description: Copy the app from our demo and learn how to build faster with Heisenware.
---

# Your first App by hand

## Video

{% embed url="https://www.youtube.com/watch?v=ZOWjfi18SVI" fullWidth="false" %}

## Create a new App

1. Log in to your account.
2. Click **Apps** in the sidebar.
3. Click **+** to add a new App.
4. Enter a name in the app name field.
5. Upload an app icon.
6. Open the **App Builder**.

## Connect data sources

### HTTP

1. Drag and drop the `get` function from the [HTTP / REST](../reference/functions/connectors/http-rest.md#get) connector onto the canvas.
2. Configure the function:

```yaml
# url
http://www.randomnumberapi.com/api/v1.0/random
# parameters
min: 50
max: 100
count: 5
```

3. Trigger the function.
4. Add a [modifier](../app-builder/flowboard/modifier.md) to the function and enter the following JSONata expression to calculate the average:

```
$average($)
```

### OPC UA

1. Create an OPC UA client instance using the [`create`](../reference/functions/connectors/opc-ua-client.md#create) function from the [OPC UA client](../reference/functions/connectors/opc-ua-client.md) connector.
2. Enter `Demo` as the client name.
3. Trigger the function.
4. Connect to an OPC UA server using the [`connect`](../reference/functions/connectors/opc-ua-client.md#connect) function on your new client. Configure the public server address:

```yaml
# endpointUrl
opc.tcp://opcua.demo-this.com:51210/UA/SampleServer
```

5. Trigger the `connect` function.
6. Verify the connection status using the [`isConnected`](../reference/functions/connectors/opc-ua-client.md#isconnected) function.
7. Use the [`readNode`](../reference/functions/connectors/opc-ua-client.md#readnode) function to read the data node:

```yaml
# nodeId
ns=2;i=10846
```

8. Add a [modifier](../app-builder/flowboard/modifier.md) to the function and extract the raw value using:

```
value.value
```

{% hint style="info" %}
As an alternative to steps 7 and 8, use the [`readVariableValue`](../reference/functions/connectors/opc-ua-client.md#readvariable) function to retrieve the value directly.
{% endhint %}

## Configure data flow

### Combine data points

1. Drag and drop the [`combine`](../reference/functions/utilities/data-processing.md#combine) function onto the canvas.
2. Connect the modifier of the `get` function to argument 1 of the `combine` function, and the modifier of the `readNode` function to argument 2.
3. Trigger the `combine` function.
4. Add a [modifier](../app-builder/flowboard/modifier.md) to the `combine` function and calculate the sum:

```
$sum($)
```

5. Set the triggers for both the `readNode` and `get` functions to `every 10s`.
6. Set the trigger for the `combine` function to `on input change` by dragging its arguments onto the trigger.
7. Test your logic in [test mode](../app-builder/test-and-deploy.md). Wait at least 10 seconds to view incoming data.

### Record historic data

1. Add a [recorder](../app-builder/flowboard/recorder.md) to the modifier of the `combine` function.
2. Name the recorded data point `demo_data` in the configuration.
3. Run the App in [test mode](../app-builder/test-and-deploy.md) for one minute to record initial data.

## Build user interface

### Visualize live data

1. Upload your logo or another image to the [File Explorer](../app-builder/explorers/files.md).
2. Drag and drop the image onto the page in the **Page editor**.
3. Select a [circular gauge](../reference/widgets/display/circular-gauge.md) from the display widgets list and click the canvas to place it.
4. Configure the start value, end value (0 to 500), and color sections of the circular gauge in its configuration panel.
5. Drag the modifier of the `combine` function onto the circular gauge. Ensure you select the circular gauge first.
6. Run the App in [test mode](../app-builder/test-and-deploy.md) to view live data.

### Visualize recorded data

1. Click the database icon on the recorder node to automatically generate the `read` function for the [timeseries database](../reference/functions/storage/timeseries-database.md#read).
2. Within the newly generated `read` function, change the tail value to 10.
3. Trigger the `read` function.
4. Create a [new page](../app-builder/explorers/pages.md#creating-and-deleting-pages) by right-clicking the existing page in the [Page Explorer](../app-builder/explorers/pages.md) and selecting **New Page**.
5. Configure the App's main menu using the navigation menu settings. You can rename pages and add icons as needed.
6. Select the new page.
7. Add a [chart](../reference/widgets/display/chart.md) widget to the page.
8. Drag and drop the output array of the `read` function onto the chart. Ensure you select the chart first.
9. Resize and configure the chart in its settings panel.
10. Add a [button](../reference/widgets/trigger/button.md) widget and customize its label.
11. Drag and drop the button trigger onto the `read` function to link them.
12. Run the App in [test mode](../app-builder/test-and-deploy.md) to test the action.

### Adjust all screens

1. Select a screen size preview (such as rotated phone, tablet, rotated tablet, or desktop) from the top bar.
2. Adjust the size and position of each widget to optimize the layout for every device.

### Modify App theme

1. Open the [Theme Editor](../app-builder/theme-editor.md).
2. Select a base theme.
3. Choose a default theme or configure custom color presets.

## Publish and open the App

1. Deploy the App by clicking **Deploy** in the top bar (see [Deploy and maintain](../app-builder/test-and-deploy.md)).
2. Scan the QR code to launch the App on your mobile device, or click the provided URL to open the desktop version.
3. Optionally, install the App directly onto your device as a Progressive Web App.
