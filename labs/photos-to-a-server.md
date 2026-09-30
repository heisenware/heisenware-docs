# Photos from the App to a server

The Minimal Photo Upload App lets users scan a barcode as an order number, add a name, attach up to 10 photos, and send them directly to a local computer running a Native Agent.

## Frontend

<div align="left"><figure><img src="../.gitbook/assets/image (38).png" alt="" width="284"><figcaption></figcaption></figure></div>

The frontend includes a [form](../reference/widgets/input/form.md) widget to enter an order ID (which users can also scan using the [barcode / QR](../reference/widgets/input/barcode-qr.md) widget) and a name. Users can then [upload](../reference/widgets/input/upload.md) photos from their gallery or file system, or take them directly with the camera. Once all information is available, the Save to server [button](../reference/widgets/trigger/button.md) widget becomes active and transfers the files to a local computer running a [Native Agent](../app-manager/agents/native-agent.md) with the [File I/O](../reference/functions/connectors/file-i-o.md) connector.

## Backend

<figure><img src="../.gitbook/assets/image (36).png" alt=""><figcaption></figcaption></figure>

* **Form auto-fill:** The optional barcode scan uses the `autofill` command to populate the form directly.
* **Form data receipt:** An [`echo`](../reference/functions/utilities/data-processing.md#echo) function receives the form data. This lets the flow trigger [on page load](../concepts/executors-and-instances.md#trigger-sources) to run the connected validation routine, which enables the upload button.
* **Photo retrieval:** A second [`echo`](../reference/functions/utilities/data-processing.md#echo) function retrieves the uploaded photos. This function uses the `File` storage option because camera images can exceed 5 MB, and buffers perform poorly on large files.
* **Live validation:** The [`combine`](../reference/functions/utilities/data-processing.md#combine) function performs live validation whenever form or photo inputs change. It uses the `toggle` command to enable or disable the button based on the [modifier](../app-builder/flowboard/modifier.md) extension node logic.
* **Sequential file processing:** Drag the [`readFileToBuffer`](../reference/functions/connectors/file-i-o.md#readfiletobuffer) function from your [Native Agent](../app-manager/agents/native-agent.md) onto the canvas. It receives an array of file paths from the [upload](../reference/widgets/input/upload.md) widget and [processes them sequentially](../concepts/executors-and-instances.md#sequential-processing-of-arrays-looping) into a base64 buffer on the backend to write them to the `image` directory. When configured this way, the system interprets the path relative to the Native Agent executable.
* **UI feedback:** To improve the user experience, the button shows a loading animation until the files arrive on the server. Call the `done` event on the [button](../reference/widgets/trigger/button.md) widget to stop this animation and clear the widgets after a successful upload.

## Step-by-step guide

{% stepper %}
{% step %}
#### Download the template
Download the `minimal-photo-uploader.hwt` template file to your local computer.

[Download the template](https://downloads.heisenware.cloud/public/templates%2Fminimal-photo-uploader.hwt)
{% endstep %}

{% step %}
#### Install the Native Agent
Install a [Native Agent](../app-manager/agents/native-agent.md) on the computer that will receive the uploaded photos. Ensure the [File I/O](../reference/functions/connectors/file-i-o.md) connector is configured and active.
{% endstep %}

{% step %}
#### Import the template
1. Open the **App Builder**.
2. Click the tags menu in the [top bar](../app-builder/test-and-deploy.md).
3. Select **Import** and upload the `minimal-photo-uploader.hwt` file.
4. Select the imported template and confirm the import.
{% endstep %}
{% endstepper %}

## Write images from App to server

{% stepper %}
{% step %}
##### Prepare the file connector agent

Download an [Agent](../concepts/agents-and-where-code-runs.md) with the [File I/O](../reference/functions/connectors/file-i-o.md) connector and start it on the server or PC where you want to store the images.
{% endstep %}

{% step %}
##### Add and configure the photo widget

Pick the [photo](../reference/widgets/input/photo.md) widget from the input widgets and place it into the user interface of your App. Switch the storage type of the photo widget from file to buffer.
{% endstep %}

{% step %}
##### Prepare the photo data

Use a [memory](../reference/functions/utilities/data-processing.md#memory) function to receive images from the photo widget by connecting the photo widget to the function's input. Add two JSONata [modifier](../app-builder/flowboard/modifier.md) extension nodes to extract the base64 buffer string and to prepare the path and file name.

Use these JSONata snippets in your modifiers. Replace the path from the example with the path on your server where you want to store the images. Double all backslashes to work with the JSONata syntax.

```
'C:\\Data\\Images' & '\\' & name & '.jpeg'
```

```
base64
```

After taking a photo in test mode, the memory function must look like the screenshot below.

<figure><img src="../.gitbook/assets/image (70).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
##### Configure the writeBufferToFile function

Find the [`writeBufferToFile`](../reference/functions/connectors/file-i-o.md#writebuffertofile) function inside your file connector agent, which appears in the Function Explorer, and drag it onto the canvas.

Connect the path modifier to the `filePath` input and the buffer modifier to the `buffer` input.

<figure><img src="../.gitbook/assets/image (71).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
##### Configure a trigger

Configure the trigger of the `writeBufferToFile` function as needed, for example `on input change`.
{% endstep %}
{% endstepper %}
