# Files explorer

The File Explorer is the panel on the left that gives access to your account's internal file server. It is the central place for the files your App works with: data files your logic reads and writes, images for the UI, or PDFs for template backgrounds.

By default, the File Explorer shows the `uploads` folder, where your uploaded files live. You can also navigate to other areas of the file server, such as the `native-agents` folder holding your built [Agents](../../concepts/agents-and-where-code-runs.md).

{% hint style="warning" %}
Leave the advanced areas outside `uploads` untouched unless you know what you are doing.
{% endhint %}

## Uploading files

1. Click the upload icon (<i class="fa-cloud-arrow-up">:cloud-arrow-up:</i>) at the top of the File Explorer.
2. Drag and drop a file or click to select one from your computer.
3. Click Upload. The file is now ready to be used by your functions.

## Viewing files

Double-click a file to open it in a tab next to the Flowboard. Text and code files (CSV, JSON, YAML, scripts), Markdown (rendered, with a toggle to its source), images and PDFs show right there; any other file type offers a download instead. The view is read-only and follows the file: when a function or the assistant rewrites it, the tab reloads. Close a tab with its cross, or switch back to the Flowboard with the Flow tab. The download icon in the tab's header saves the file to your computer.

The platform's own areas, such as your Apps' design records in the `builder-backend` folder, open and download like any other file. They are read-only.

## Managing files

Right-click any file to open the context menu. Here you can:

* Open the file in a tab (what a double-click does).
* Download the file.
* Create a new folder to organize your assets.
* Rename a file or folder.
* Delete a file or folder.
* Copy the file's path to use it directly in function configurations.

<figure><img src="../../.gitbook/assets/image (520).png" alt=""><figcaption></figcaption></figure>

{% hint style="danger" %}
**Irreversible action**

Be careful when renaming or deleting a file. If a function (like `readCsv`) or a PDF template already uses that file path, your logic breaks.
{% endhint %}

## Common use cases

* **Data ingestion**: Upload `.csv` or `.json` files for your logic to process.
* **UI assets**: Store images and illustrations to drag into the UI of your App.
* **Document generation**: Store the PDF master files that serve as backgrounds in the [PDF Template Editor](../template-editor.md).
* **Agent backups**: Every [Native Agent](../../app-manager/agents/native-agent.md) you build lands in the `native-agents` folder, ready to download again, or to delete when you no longer need it.
