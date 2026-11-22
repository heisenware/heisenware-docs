# Users

The users class reaches the App users of the workspace from a flow: it lists the Apps, lists who is registered for one, and hands out an access link for an email address. With it one App can onboard the users of another: a supervisor's App invites the operators who open the line App.

This works for the Apps that have users, which are the ones whose access mode asks people to sign in. [App users and access](../../../app-manager/users-and-access.md) explains the modes, and does the same by hand on the App's page in the App Manager.

You find the functions under **Utilities** > **Users** in the Functions explorer. This class provides static functions only and does not require an instance. The code class name is `Users`.

{% hint style="warning" %}
#### The answers carry secrets

`getApplications` and `getApplication` answer an App's settings as they are stored, the master password among them, and `getUsers` answers each user's authentication token. Pick the fields you need with a [modifier](../../../app-builder/flowboard/modifier.md) before the value goes any further, and never link such an output to a widget.
{% endhint %}

### `getApplications`

Lists the Apps of the workspace.

#### Parameters

None.

#### Output

Returns an array of App objects, one per App of the workspace, each with its `id` and the App's stored settings: `appId`, `appName`, `domain`, `accessMode`, `locale` and the rest. Throws an error when the user directory cannot be reached.

### `getApplication`

Looks up one App of the workspace.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>app</code></td><td>The name, short ID, or long ID (UUID) of the App.</td><td>string</td></tr></tbody></table>

#### Output

Returns one App object, shaped as in `getApplications`, or nothing when no App of the workspace carries that name or id.

#### Examples

```yaml
# app
Line 2 Monitor
```

### `getUsers`

Lists the users registered for one App.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>app</code></td><td>The name, short ID, or long ID (UUID) of the App.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of user objects containing profile and status details. Returns an empty array if the App is not found. `lastLogin` is a Unix timestamp in milliseconds.

```json
[
  {
    "email": "rita.morales@acme.com",
    "username": "rmorales",
    "firstName": "Rita",
    "lastName": "Morales",
    "userId": "a1b2c3...",
    "picture": "https://...",
    "authenticationToken": "kY7x...",
    "roles": ["admin"],
    "lastLogin": 1678886400000,
    "active": true,
    "verified": true
  },
  {
    "email": "tom.berger@acme.com",
    "firstName": "Tom",
    "userId": "d4e5f6...",
    "roles": [],
    "active": true,
    "verified": false
  }
]
```

#### Examples

```yaml
# app
Line 2 Monitor
```

### `createAccessLink`

Gives an email address access to an App and answers the link to hand the person. An address without an account gets one, an account not yet registered for the App is registered, and the link that comes back fits the case:

* **A new account**: an invite link, on which the user sets a password.
* **An account whose password is still to be set**: the same invite link.
* **An account that has a password**: the App's own address.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>app</code></td><td>The name, short ID, or long ID (UUID) of the target App.</td><td>string</td></tr><tr><td><code>email</code></td><td>The email address of the user.</td><td>string</td></tr></tbody></table>

#### Output

Returns an object containing the generated link and user status details. Throws an error if the App is not found, and when the App refuses the registration: an account this call created is then deleted again, an account that existed before stays as it was.

* `link`: The invite or standard login link to send to the user depending on their scenario.
* `login`: The standard login link for the App.
* `userStatus`: Returns `created` if a new user was created, or `existed` if they already had an account.
* `registrationStatus`: Returns `created` if the user was newly registered for this App, or `existed`.
* `passwordSetupRequired`: Returns `true` if the user must set a password using the invite link.

```json
{
  "link": "https://acme.heisenware.cloud/app/acme.default/387c2.../invite/?changePasswordId=...",
  "login": "https://acme.heisenware.cloud/app/acme.default/387c2...",
  "userStatus": "created",
  "registrationStatus": "created",
  "passwordSetupRequired": true
}
```

#### Examples

```yaml
# app
Line 2 Monitor
# email
rita.morales@acme.com
```
