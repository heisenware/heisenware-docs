---
description: >-
  This guide explains how to connect an external MQTT client to your Heisenware
  tenant. You will learn to send data to Heisenware and receive data from
  Heisenware via MQTT.
---

# Connect an external MQTT client

Learn how to connect an external MQTT client to your Heisenware tenant to send data to and receive data from your Apps.

## Initial setup and sending data (ingest)

{% stepper %}
{% step %}
#### Create a Heisenware account
If you do not have an account, [sign up](https://heisenware.cloud/manager/authentication/sign-up) to get started.
{% endstep %}

{% step %}
#### Generate client credentials
1. Open the **App Manager** and navigate to **Integrations**.
2. [Add a new MQTT integration](../../app-manager/inbound-integrations.md#connecting-mqtt-and-vrpc-clients) to generate a dedicated username and password for your external MQTT client.
{% endstep %}

{% step %}
#### Configure your MQTT client
Configure your external client using the connection details and instructions from the [MQTT Client](../../app-builder/build-backend/functions/connectors/mqtt-client.md#connecting-an-external-client-to-heisenware) connector documentation. Use the username and password you generated in the previous step.
{% endstep %}

{% step %}
#### Start publishing data
Publish test data to a specific topic from your external client. This provides live messages to verify your connection in the next steps.
{% endstep %}

{% step %}
#### Subscribe using the internal MQTT client
Each Heisenware tenant includes a default internal MQTT client.

1. Open the **App Builder** for your App.
2. Locate the [`onJsonMessage`](../../app-builder/build-backend/functions/connectors/mqtt-client.md#onjsonmessage) or [`onStringMessage`](../../app-builder/build-backend/functions/connectors/mqtt-client.md#onstringmessage) function of the internal client in the **Function Explorer** and drag it onto the canvas.
3. Enter your active topic name in the function settings.
4. Trigger the function manually to subscribe the App to the topic.
5. Run the App in [test mode](../../app-builder/deploy-and-maintain.md) to view incoming messages in the event output.
{% endstep %}

{% step %}
#### Process incoming data
To work with incoming messages in your App's data flow, connect the event handler output to a [memory](../../app-builder/build-backend/functions/utilities/data-processing.md) function (part of the [Data processing](../../app-builder/build-backend/functions/utilities/data-processing.md) utility class).

The memory function converts the incoming real-time stream into a standard function output. From there, you can modify, store, forward, or visualize the payload as needed.

<figure><img src="../../.gitbook/assets/image (501).png" alt=""><figcaption></figcaption></figure>
{% endstep %}
{% endstepper %}

## Receive data on your client (egress)

{% hint style="info" %}
#### Complete the initial setup
Ensure you complete steps 1 through 3 of the initial setup to configure your client credentials before proceeding with egress configuration.
{% endhint %}

{% stepper %}
{% step %}
#### Publish data to the internal broker
Use the [`publishJson`](../../app-builder/build-backend/functions/connectors/mqtt-client.md#publishjson) or [`publishString`](../../app-builder/build-backend/functions/connectors/mqtt-client.md#publishstring) function in the Backend Builder to publish data to a specific topic.

You can enter a static message manually or bind dynamic data to the input box.

{% hint style="info" %}
#### Generate test data
Use the [Data simulation](../../app-builder/build-backend/functions/utilities/data-simulation.md) class to generate dynamic test values. You can format this simulated data using a [modifier](../../app-builder/build-backend/extension-nodes/modifier.md) extension node before publishing.
{% endhint %}
{% endstep %}

{% step %}
#### Subscribe with your external client
Configure your external MQTT client to subscribe to the same topic you defined in the previous step. The client will now receive all payloads published by the App.
{% endstep %}
{% endstepper %}
