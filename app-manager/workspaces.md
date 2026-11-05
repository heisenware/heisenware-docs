# Workspaces

A workspace is an isolated area inside your [account](account.md) with its own Apps, databases, files, agents and integrations. Nothing in one workspace reaches another. Use several to separate teams, sites or the clients you build for.

Every account starts with one: `default`. How many it can hold is part of your plan.

## What a workspace holds

You can build as many Apps in a workspace as your plan allows. Every App in a workspace shares that workspace's resources:

* **Databases**: A [timeseries database](../reference/functions/storage/timeseries-database.md) (InfluxDB) for high-frequency sensor data, and a [relational database](../reference/functions/storage/relational-database.md) (PostgreSQL) for structured data.
* [**Files**](../app-builder/explorers/files.md): The files your Apps use, managed in the App Builder's Files explorer.
* [**Agents**](agents/README.md): The agents that connect your machines and hosts.
* [**Integrations**](integrations.md): Shared connections to external systems.

The diagram below illustrates this structure:

<figure><img src="../.gitbook/assets/Account Structure (1).png" alt=""><figcaption></figcaption></figure>

## Switch workspaces

The workspace switcher sits at the top of the App Manager's menu and shows the workspace you are in. Click it to see the workspaces you reach, and pick one. The screens start afresh, so nothing of the workspace you left stays on them.

Each workspace in the list shows its domain, for example `acme.halle`, with a button to copy it. Your own code and your MQTT clients connect with the domain, not with the workspace's name.

## Add a workspace

Owners of the account add workspaces:

1. Open the workspace switcher and click **Add workspace**.
2. Enter a **Name**. It is what people see, and you can change it later.
3. Optionally enter an **Id**. Left empty, it follows from the name: `Halle Süd` becomes `halle-sued`. The id is part of the workspace's domain and never changes. It takes lower-case letters, digits and dashes inside, 32 characters at most.
4. Click **Add**.

You land in the new workspace while its services start.

When your plan is full, the switcher says how many workspaces it holds, with **Ask for more** instead of **Add workspace**. On a self-hosted installation the license carries the number.

## Divide your plan's Apps

Your plan's Apps count for the whole account, and by default all workspaces share them. Owners of the account can reserve Apps for a workspace, for example for a client you build for:

1. Open **Plan & Billing** and find **Workspaces**.
2. Click **Edit** on the workspace.
3. Enter the number under **Apps reserved**.

A workspace with Apps reserved may hold that many, and those slots are kept for it. The workspaces without a reservation share what is left. Leave the field empty to go back to sharing.

A reservation cannot be lower than the Apps the workspace holds, or higher than what your plan has left. The Apps screen shows every member where the workspace stands, for example *3 of 5 apps in this workspace*.

The same dialog changes the workspace's name.

## Who reaches a workspace

| Access | What it gives |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| **Owner of the account** | Every workspace, the plan and billing, all members, and adding and deleting workspaces. |
| **Owner of a workspace** | Builds in that workspace and chooses who else does. |
| **Editor** | Builds in that workspace, its integrations included. |

See [Members](members.md) for how to give and take access.

## Delete a workspace

Owners of the account delete workspaces. This cannot be undone.

1. Open **Plan & Billing** and find **Workspaces**.
2. Click **Edit** on the workspace, then **Delete**.
3. Check what the dialog names, type the workspace's name and click **Delete workspace**.

The workspace is gone for everyone at once. If you were inside it, you land in another workspace. The rest follows in the background, and the workspace shows as **Being Deleted** until it is done. Should that row stay, click **Try again**.

What goes:

* Its Apps with their data and their deployed backends, and the App users who hold no other App.
* Its databases and files.
* Its agents' and integrations' logins. Whatever is connected loses its connection and cannot return.
* Its AI client connections and the assistant's conversations in it.
* Members who hold nothing else leave the account. Someone who is still a user of an App stays that, without the App Manager.

What the assistant used in the workspace stays on your account's bill. Once the delete is done, the workspace's id is free again.

{% hint style="info" %}
You cannot delete an account's last workspace. Any other can go, `default` included.
{% endhint %}
