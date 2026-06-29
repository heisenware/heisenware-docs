# Minimal Photo Upload

Welcome to the minimal photo upload guide! This app allows any user to scan a barcode that acts as a order number, add a name, attach up to ten photos and send them to an on-premise computer (acting as a receiver of the photos).

## Frontend

<div align="left"><figure><img src="../../.gitbook/assets/image (38).png" alt="" width="284"><figcaption></figcaption></figure></div>

The frontend features a [form](../../app-builder/build-frontend/widgets/input-widgets/form.md) to enter an order id (can alternatively be scanned from a [barcode](../../app-builder/build-frontend/widgets/input-widgets/barcode-qr.md)) and a name. The user can then [upload](../../app-builder/build-frontend/widgets/input-widgets/upload.md) photos from a gallery or the file system or directly take them with the camera. When all information is available the `Save to Server` [button](../../app-builder/build-frontend/widgets/trigger-widgets/button.md) gets active and the files are transferred to the builder's computer (running a [native file agent](../../app-builder/build-backend/function-explorer/connectors/file-i-o.md)).

## Backend

<figure><img src="../../.gitbook/assets/image (36).png" alt=""><figcaption></figcaption></figure>

* The optionally scanned barcode uses the `autofill` command to send its data directly to the form.
* The form data itself is received via an [`echo`](../../app-builder/build-backend/function-explorer/utilities/data-processing.md#echo) function, this way it can be triggered [on page-load](/broken/pages/QmLFl2Lf6Bh8XBr1DnpD#trigger-sources-and-events) and the connected validation routine will be triggered (important to enable the upload button)
* Another `echo` functions retrieves the uploaded images / photos. Crucially, it uses the `File` storage option as camera images can be huge (> 5MB) each and buffers perform poorly on such large entities.
* The [`combine`](../../app-builder/build-backend/function-explorer/utilities/data-processing.md#combine) function does a live-validation whenever any of the input (form or photos) change and uses the `toggle` command to set the button according to the simple Modifier logic.
* The [`readFileToBuffer`](../../app-builder/build-backend/function-explorer/connectors/file-i-o.md#readfiletobuffer) actually must be dragged from the native file agent. It receives an array of pathes from the uploader widget and [processes them one-by-one](/broken/pages/QmLFl2Lf6Bh8XBr1DnpD#sequential-processing-looping) into a base64 buffer (on the backend) to subsequently write them to the `image` directory. When specified this way the path is interpreted relative to the Native Agent's executable
* For improved UI the upload button will show an animation until the files arrived on the server (calling `done` on the button does this trick) and the widgets are cleared after success.

## Try Yourself

In order to try yourself you can start from [this template file](https://downloads.heisenware.cloud/public/templates%2Fminimal-photo-uploader.hwt). Make sure to install a Native Agent of type `File` on the computer that should receive the photos.

