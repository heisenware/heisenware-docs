---
description: >-
  This guide explains how to connect an external MQTT client to your Heisenware
  tenant. You will learn to send data to Heisenware and receive data from
  Heisenware via MQTT.
---

# Connect an External MQTT Client

## Initial Setup and Sending Data (Ingest)

{% stepper %}
{% step %}
#### Sign up for Heisenware

If you haven't done so yet, [sign up and create your account](https://heisenware.cloud/manager/authentication/sign-up) first.
{% endstep %}

{% step %}
#### Generate Client Credentials

Navigate to the App Manager > Integrations page. [Add a new MQTT integration](../../app-manager/integrations-inbound-connections.md#connecting-mqtt-and-vrpc-clients) to generate the specific username and password for your external MQTT client.
{% endstep %}

{% step %}
#### Configure your MQTT Client

Configure your external client using the connection details and instructions provided in the [MQTT integration guide](../../app-builder/build-backend/function-explorer/connectors/mqtt-client.md#connecting-an-external-client-to-heisenware). You will need the username and password generated in Step 2.
{% endstep %}

{% step %}
#### Start Publishing Data

Publish some test data on a topic from your external client to Heisenware. This ensures there is data to visualize in the next step.
{% endstep %}

{% step %}
#### Subscribe using the Internal MQTT Client

Your Heisenware tenant includes a default internal MQTT client.

* Open the App Builder for your app.
* Use the [`onJsonMessage`](../../app-builder/build-backend/function-explorer/connectors/mqtt-client.md#onjsonmessage) (or [`onStringMessage`](../../app-builder/build-backend/function-explorer/connectors/mqtt-client.md#onstringmessage)) Function belonging to the internal client.
* Enter the topic you are publishing on into the Function.
* Trigger the Function manually. You are now subscribed.&#x20;
* Enable [Test Mode](../../app-builder/deploy-and-maintain.md#app-testing-test-mode) to see incoming data appear inside the event handler.
{% endstep %}

{% step %}
#### Work with the Incoming Data (Optional)

To process the data, we recommend connecting the event handler to a [memory](https://docs.heisenware.com/app-builder/backend/functionality/utilities/data-processing#memory) Function.

* The memory makes the incoming data available as a regular Function output.
* From here, you can modify, store, forward, or visualize the data as needed.

<figure><img src="../../.gitbook/assets/image (501).png" alt=""><figcaption></figcaption></figure>
{% endstep %}
{% endstepper %}

## Receiving Data on Your Client (Egress)

{% hint style="info" %}
You must complete the Initial Setup (steps 1–3 above) before proceeding.
{% endhint %}

{% stepper %}
{% step %}
#### Publish Data to the Internal Broker

Use the [`publishJson`](../../app-builder/build-backend/function-explorer/connectors/mqtt-client.md#publishjson) or [`publishString`](../../app-builder/build-backend/function-explorer/connectors/mqtt-client.md#publishstring) Function in the App Builder to publish data to a specific topic.

You can manually fill the message input box or use dynamic data.

{% hint style="info" %}
The [Data Simulation](../../app-builder/build-backend/function-explorer/utilities/data-simulation.md) class is a great way to create dynamic data for testing. You can prepare this simulated data using a [modifier](/broken/pages/eybgxpp69PNrUW2fHZ4X#modifier) before publishing.
{% endhint %}
{% endstep %}

{% step %}
#### Subscribe with your External Client

Configure your external MQTT client to subscribe to the topic you defined in Step 1. You will now receive the data published by Heisenware.
{% endstep %}
{% endstepper %}
