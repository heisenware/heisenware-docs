# Account

A Heisenware account is your organization on Heisenware. Everything you build lives inside one: its [members](members.md), its [workspaces](workspaces.md) with their Apps, and its [plan](plan-and-billing.md).

## Its name is its address

An account's name is chosen once, when the account is created, and never changes. On the Heisenware cloud it is also the account's address: `acme` becomes `acme.heisenware.cloud`, where its members sign in and its Apps are served. The name takes 3 to 63 characters: lower-case letters, digits and dashes, starting and ending with a letter or a digit.

Inside the account, each workspace adds its own id: `acme.default` is the domain of the workspace `default`. Your own code and your MQTT clients connect with the domain.

{% hint style="info" %}
On request we make Heisenware available under a web domain of your own. [Contact us](mailto:support@heisenware.com) to discuss it.

A [self-hosted](../self-hosting/README.md) installation has one address, the one your IT gave it, and the account name is a name rather than an address. Ask your administrator for it.
{% endhint %}

## Its owner

The member who creates the account is its first owner. Owners of the account reach every workspace, hold the plan and the billing, invite and remove members, and add and delete workspaces. An account always keeps at least one owner. See [Members](members.md) for how to make someone else one.

## Getting in

Creating an account, signing in and taking up an invitation are on their own page: [Sign up and sign in](../getting-started/sign-up-and-sign-in.md).

## Deleting the account

Deleting an account deletes every workspace in it, with its Apps, their data and their users. Send the request to our [support team](mailto:support@heisenware.com) from an address that owns the account. To get rid of one workspace only, see [Delete a workspace](workspaces.md#delete-a-workspace).
