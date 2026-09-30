# Users

The users class manages users and App access programmatically. Use it to list available Apps, look up specific Apps, view registered users, and generate invitation links to onboard users dynamically. This class provides static functions only and does not require an instance. The code class name is `Users`.

### `getApplications`

Retrieves a list of all available Apps. Use this function to get an overview or populate selection lists in your UI.

#### Parameters

None.

#### Output

Returns an array of App objects, each containing `id` and the App's data fields such as `appName` and `appId`. Throws an error if the request fails.

### `getApplication`

Retrieves details for a specific App.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>app</code></td><td>The name, short ID, or long ID (UUID) of the App.</td><td>string</td></tr></tbody></table>

#### Output

Returns a single App object, or nothing if not found.

#### Examples

```yaml
# app
My Dashboard App
```

### `getUsers`

Retrieves a list of all users registered for a specific App.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>app</code></td><td>The name, short ID, or long ID (UUID) of the App.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of user objects containing profile and status details. Returns an empty array if the App is not found. `lastLogin` is a Unix timestamp in milliseconds.

```json
[
  {
    "email": "jane.doe@company.com",
    "username": "jdoe",
    "firstName": "Jane",
    "lastName": "Doe",
    "userId": "a1b2c3...",
    "picture": "https://...",
    "authenticationToken": "kY7x...",
    "roles": ["admin"],
    "lastLogin": 1678886400000,
    "active": true,
    "verified": true
  },
  {
    "email": "john.smith@company.com",
    "firstName": "John",
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
Shopfloor Monitor
```

### `createAccessLink`

Generates a link for a user to access a specific App. The function automatically handles three scenarios:
1. **New user:** If the email address does not exist, the function creates the user and generates an invite link.
2. **Existing user without a password:** If the user exists but has not set a password, the function generates an invite link prompting them to set one.
3. **Existing active user:** If the user exists and has a valid password, the function generates a standard login link.

Use this function to build user invitation features in your Apps.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>app</code></td><td>The name, short ID, or long ID (UUID) of the target App.</td><td>string</td></tr><tr><td><code>email</code></td><td>The email address of the user.</td><td>string</td></tr></tbody></table>

#### Output

Returns an object containing the generated link and user status details. Throws an error if the App is not found.

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
My Dashboard App
# email
new.employee@company.com
```
