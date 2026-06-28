---
description: Copy the app from our demo and learn how to build faster with Heiseware.
---

# Your First Heisenware App

## Video

{% embed url="https://www.youtube.com/watch?v=ZOWjfi18SVI" fullWidth="false" %}

## Create a new app

1. Log in to your Heisenware account
2. Click on Apps
3. Click on the + to add a new app
4. Choose an App Name
5. Upload an App Icon
6. Open the App Builder

## Connect data sources

### HTTP

1. Drag and drop the [HTTP `get` Function](../../app-builder/build-backend/function-explorer/connectors/http-rest.md#do-a-get-request) on the canvas
2. Configure the Function:

```yaml
#url
http://www.randomnumberapi.com/api/v1.0/random
#parameters
min: 50
max: 100
count: 5
```

3. Trigger the Function.
4. Add a [JSONata modifier](/broken/pages/i9IfQGI7JsZoIlPbpDlt#jsonata) to the Function and enter the average Function:

```
$average($)
```

### OPC UA

1. Create an OPC UA client with the [OPC UA `create` Function](../../app-builder/build-backend/Function-explorer/connectors/opc-ua-client.md#create).
2. Call the client `Demo` or use any other name you like.&#x20;
3. Trigger the Function.
4. Connect to an OPC UA server using the [`connect` Function](../../app-builder/build-backend/function-explorer/connectors/opc-ua-client.md#connect) from within the client just created. You can use the following public server:

```
opc.tcp://opcua.demo-this.com:51210/UA/SampleServer
```

5. Trigger the `connect` Function
6. Check the connection with the isConnected Function
7. Use the clients [readNode](../../app-builder/build-backend/function-explorer/connectors/opc-ua-client.md#readnode) Function and configure it with the following node ID:

```
ns=2;i=10846
```

8. Add a JSONata modifier to the Function and extract the value with:

```
value.value
```

{% hint style="info" %}
Alternatively to step 7 and 8, you can also use the [readVariableValue](../../app-builder/build-backend/function-explorer/connectors/opc-ua-client.md#readvariablevalue) Function to get right to the value.
{% endhint %}

## Configure data flow

### Combine data points

1. Drag and drop the combine Function on to the canvas.
2. Connect the modifier of the `get` Function with argument 1 of the combine Function and the modifier of the readNode Function with argument 2 of the combine Function.
3. Trigger the combine Function
4. Add a JSONata modifier to the Function and enter the sum Function:

```
$sum($)
```

5. Set the readNode trigger  and the `get` Function trigger to `every 10s`.
6. Set the combine trigger to `on input change` by drag and drop of each of the Functions arguments (or just one of them) on the trigger.
7. Test your logic using the [test mode](/broken/pages/eFPI0X9VZcFlensbHWF5). Wait at least 10 seconds to see data.

### Record historic data

1. Add a [recorder](your-first-heisenware-app.md#record-historic-data) to the modifier behind the combine Function.
2. Call the recorded data point `demo_data` or use any other name you like.&#x20;
3. Start the test mode for a minute or so to record some data.

## Build user interface

### Visualize live data

1. Upload your logo or any other image to the [resources](/broken/pages/XylIfG5wjJjfNvDi8xWH).
2. Drag and drop the image onto the [Frontend Builder](../../app-builder/build-frontend/).
3. Pick a [circular gauge](../../app-builder/build-frontend/widgets/display-widgets/circular-gauge.md) from the display widgets and click in the Frontend Builder to place it.
4. Configure start and end value (0 to 500) and the color sections of the circular gauge.
5. Connect the modifier of the combine Function to the circular gauge with drag and drop. Make sure to select the circular gauge first.
6. Start the test mode and see the data coming.

### Visualize recorded data

1. Click on the database icon of the recorder to auto generate the [InfluxDB `read` Function](/broken/pages/WbN12C0jrmgbmfoePmC2#read-function).
2. Within the `read` Function, change the `tail` value to 10.&#x20;
3. Trigger the `read` Function.
4. Create a [new page](../../app-builder/build-frontend/page-explorer.md#add-and-delete) with right-click in the pages panel on the first page and a click on `New Page`.
5. Configure the apps main menu using the [navigation builder](/broken/pages/rvvWSVQBKkjdqJHIsrkv#navigation-menu). Rename pages and add icons if you like.
6. Select the new page.
7. Add a [chart](../../app-builder/build-frontend/widgets/display-widgets/chart.md) widget to the page.
8. Connect the output of the `read` Function (array) to the chart with drag and drop. Make sure to select the circular gauge first.
9. Resize and configure the chart.
10. Add a [button](../../app-builder/build-frontend/widgets/trigger-widgets/button.md) and configure it.
11. Connect `read` Function trigger and button.
12. Test your logic using the test mode.

### Adjust all screens

1. Choose the [preview](/broken/pages/blDW45ECaLEvV3KEsB1m) of rotated phone, tablet, rotated tablet or desktop.
2. Adjust all widgets size and position for each screen.

### Modify app theme

1. Open the [theme editor](../../app-builder/build-frontend/theme-editor.md).
2. Pick a base theme.
3. Pick a default theme or configure your own theme.

## Publish and open the app

1. Click on [deploy](/broken/pages/eFPI0X9VZcFlensbHWF5).
2. Scan the QR code to open the app on your phone or click the URL to open the desktop version of your app.&#x20;
3. Optionally install the app on your device.
