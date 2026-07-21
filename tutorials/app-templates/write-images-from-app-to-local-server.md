---
description: >-
  This tutorial explains how to share images taken inside an App with a local
  server or PC using the photo widget, an agent and the writeBufferToFile
  function.
---

# Write images from App to server

{% stepper %}
{% step %}
#### Prepare the file connector agent

Download an [Agent](../../app-builder/build-backend/agents/) with the [File I/O](../../app-builder/build-backend/functions/connectors/file-i-o.md) connector and start it on the server or PC where you want to store the images.
{% endstep %}

{% step %}
#### Add and configure the photo widget

Pick the [photo](../../app-builder/build-frontend/widgets/input-widgets/photo.md) widget from the input widgets and place it into the user interface of your App. Switch the storage type of the photo widget from file to buffer.
{% endstep %}

{% step %}
#### Prepare the photo data

Use a [memory](../../app-builder/build-backend/functions/utilities/data-processing.md#memory) function to receive images from the photo widget by connecting the photo widget to the function's input. Add two JSONata [modifier](../../app-builder/build-backend/extension-nodes/modifier.md) extension nodes to extract the base64 buffer string and to prepare the path and file name.

Use these JSONata snippets in your modifiers. Replace the path from the example with the path on your server where you want to store the images. Double all backslashes to work with the JSONata syntax.

```
'C:\\Data\\Images' & '\\' & name & '.jpeg'
```

```
base64
```

After taking a photo in test mode, the memory function must look like the screenshot below.

<figure><img src="../../.gitbook/assets/image (70).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
#### Configure the writeBufferToFile function

Find the [`writeBufferToFile`](../../app-builder/build-backend/functions/connectors/file-i-o.md#writebuffertofile) function inside your file connector agent, which appears in the Function Explorer, and drag it onto the canvas.

Connect the path modifier to the `filePath` input and the buffer modifier to the `buffer` input.

<figure><img src="../../.gitbook/assets/image (71).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
#### Configure a trigger

Configure the trigger of the `writeBufferToFile` function as needed, for example `on input change`.
{% endstep %}
{% endstepper %}
