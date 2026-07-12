# File Explorer

The File Explorer is the panel on the left that gives access to your account's internal file server. It is the central place for the files your App works with: data files your logic reads and writes, images for the UI, or PDFs for template backgrounds.

By default, the File Explorer shows the `uploads` folder, where your uploaded files live. You can also navigate to other areas of the file server, such as the `native-agents` folder holding your built [Agents](agents/).

{% hint style="warning" %}
Leave the advanced areas outside `uploads` untouched unless you know what you are doing.
{% endhint %}

## Uploading files

1. Click the upload icon (<i class="fa-cloud-arrow-up">:cloud-arrow-up:</i>) at the top of the File Explorer.
2. Drag and drop a file or click to select one from your computer.
3. Click Upload. The file is now ready to be used by your functions.

## Managing files

Right-click any file to open the context menu. Here you can:

* Download the file.
* Create a new folder to organize your assets.
* Rename a file or folder.
* Delete a file or folder.
* Copy the file's path to use it directly in function configurations.

<figure><img src="../../.gitbook/assets/image (520).png" alt=""><figcaption></figcaption></figure>

{% hint style="danger" %}
Be careful when renaming or deleting a file. If a function (like `readCsv`) or a PDF template already uses that file path, your logic breaks.
{% endhint %}

## Common use cases

* **Data ingestion**: Upload `.csv` or `.json` files for your logic to process.
* **UI assets**: Store images and illustrations to drag into the UI of your App.
* **Document generation**: Store the PDF master files that serve as backgrounds in the [PDF Template Editor](../build-frontend/pdf-template-editor.md).
* **Agent backups**: Every [Native Agent](agents/native-agent.md) you build lands in the `native-agents` folder, ready to download again.
