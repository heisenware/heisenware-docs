---
description: >-
  This tutorial explains how to share images taken inside an app with a local
  server or PC using the photo widget, an agent and the writeBufferToFile
  function.
---

# Write images from app to local server

{% stepper %}
{% step %}
### Prepare file connector agent

Download an [agent](../../app-builder/build-backend/function-explorer/agents/) with file connector and start the agent on the server or PC you want to store the images.
{% endstep %}

{% step %}
### Add photo widget and configure it

Pick the [photo widget](../../app-builder/build-frontend/widgets/input-widgets/photo.md) from input widgets and place it into the user interface of your app. Switch the storage type of the photo widget from file to buffer.&#x20;
{% endstep %}

{% step %}
### Prepare the photo data

Use a memory function to get images from the photo widget by connecting the photo widget with the memory functions input. Also, add two [JSONata modifiers](/broken/pages/eybgxpp69PNrUW2fHZ4X#jsonata-modifier) to the memory to extract the base64 buffer string and prepare the path and file name.

These are the JSONata snippets to use in your modifiers. Replace the path from the example with the path on your server where you want to store the images. All backslashes must be doubled to be working with JSONata syntax.

```
'C:\\Users\\gerri\\Desktop\\Demo\\Images' & '\\' & name & '.jpeg'
```

```
base64
```

The final memory function, after taking a photo in test mode, must look like in the screenshot below.

<figure><img src="../../.gitbook/assets/image (70).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
### Configure the writeBufferToFile function

Find the [writeBufferToFile](../../app-builder/build-backend/function-explorer/connectors/file-i-o.md#writebuffertofile) function inside your file connector agent that should have appeared in the functionality panel and drag it onto the canvas.&#x20;

Connect the path modifier with the `filePath` input and the buffer modifier with the `buffer` input.

<figure><img src="../../.gitbook/assets/image (71).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
### Configure a trigger

Configure the writeBufferToFile function trigger as needed. For example, you could use the `on input change` trigger.
{% endstep %}
{% endstepper %}
