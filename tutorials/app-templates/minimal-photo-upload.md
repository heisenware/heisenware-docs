# Minimal photo upload

The Minimal Photo Upload App lets users scan a barcode as an order number, add a name, attach up to 10 photos, and send them directly to a local computer running a Native Agent.

## Frontend

<div align="left"><figure><img src="../../.gitbook/assets/image (38).png" alt="" width="284"><figcaption></figcaption></figure></div>

The frontend includes a [form](../../app-builder/build-frontend/widgets/input-widgets/form.md) widget to enter an order ID (which users can also scan using the [barcode / QR](../../app-builder/build-frontend/widgets/input-widgets/barcode-qr.md) widget) and a name. Users can then [upload](../../app-builder/build-frontend/widgets/input-widgets/upload.md) photos from their gallery or file system, or take them directly with the camera. Once all information is available, the Save to server [button](../../app-builder/build-frontend/widgets/trigger-widgets/button.md) widget becomes active and transfers the files to a local computer running a [Native Agent](../../app-builder/build-backend/agents/native-agent.md) with the [File I/O](../../app-builder/build-backend/functions/connectors/file-i-o.md) connector.

## Backend

<figure><img src="../../.gitbook/assets/image (36).png" alt=""><figcaption></figcaption></figure>

* **Form auto-fill:** The optional barcode scan uses the `autofill` command to populate the form directly.
* **Form data receipt:** An [`echo`](../../app-builder/build-backend/functions/utilities/data-processing.md#echo) function receives the form data. This lets the flow trigger [on page load](../../app-builder/build-backend/functions/#trigger-sources) to run the connected validation routine, which enables the upload button.
* **Photo retrieval:** A second [`echo`](../../app-builder/build-backend/functions/utilities/data-processing.md#echo) function retrieves the uploaded photos. This function uses the `File` storage option because camera images can exceed 5 MB, and buffers perform poorly on large files.
* **Live validation:** The [`combine`](../../app-builder/build-backend/functions/utilities/data-processing.md#combine) function performs live validation whenever form or photo inputs change. It uses the `toggle` command to enable or disable the button based on the [modifier](../../app-builder/build-backend/extension-nodes/modifier.md) extension node logic.
* **Sequential file processing:** You must drag the [`readFileToBuffer`](../../app-builder/build-backend/functions/connectors/file-i-o.md#readfiletobuffer) function from the [Native Agent](../../app-builder/build-backend/agents/native-agent.md). It receives an array of file paths from the [upload](../../app-builder/build-frontend/widgets/input-widgets/upload.md) widget and [processes them sequentially](../../app-builder/build-backend/functions/#sequential-processing-of-arrays-looping) into a base64 buffer on the backend to write them to the `image` directory. When configured this way, the system interprets the path relative to the Native Agent executable.
* **UI feedback:** To improve the user experience, the button shows a loading animation until the files arrive on the server. Call the `done` event on the [button](../../app-builder/build-frontend/widgets/trigger-widgets/button.md) widget to stop this animation and clear the widgets after a successful upload.

## Step-by-step guide

{% stepper %}
{% step %}
#### Download the template

Download the `minimal-photo-uploader.hwt` template file to your local computer.

[Download the template](https://downloads.heisenware.cloud/public/templates%2Fminimal-photo-uploader.hwt)
{% endstep %}

{% step %}
#### Install the Native Agent

Install a [Native Agent](../../app-builder/build-backend/agents/native-agent.md) on the computer that will receive the uploaded photos. Ensure the [File I/O](../../app-builder/build-backend/functions/connectors/file-i-o.md) connector is configured and active.
{% endstep %}

{% step %}
#### Import the template

1. Open the **App Builder**.
2. Click the tags menu in the [Top Bar](../../app-builder/deploy-and-maintain.md).
3. Select **Import** and upload the `minimal-photo-uploader.hwt` file.
4. Select the imported template and confirm the import.
{% endstep %}
{% endstepper %}
