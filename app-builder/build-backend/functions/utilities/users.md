# Users

With the users utility, you manage users and App access programmatically: list available Apps, look up a specific App, list the users registered for an App, and generate invitation links to onboard users dynamically. All functions are static, so you do not need to create an instance.

## `getApplications`

Retrieves a list of all available Apps. This is useful for getting an overview or for populating selection lists in your UI.

### Output

An array of App objects.

```json
[
  {
    "id": "387c2...",
    "tenantId": "651a...",
    "name": "My Dashboard App",
    "active": true,
    "roles": ["admin", "viewer"]
  },
  {
    "id": "998d1...",
    "tenantId": "651a...",
    "name": "Shopfloor Monitor",
    "active": true
  }
]
```

## `getApplication`

Retrieves details for a single, specific App.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>app</code></td><td>The name, short id, or long id (UUID) of the App.</td><td>string</td></tr></tbody></table>

### Example

```yaml
# app
My Dashboard App
```

### Output

A single App object, or `null` if not found.

```json
{
  "id": "387c2...",
  "tenantId": "651a...",
  "name": "My Dashboard App",
  "active": true
}
```

## `getUsers`

Retrieves a list of all users who are currently registered for a specific App.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>app</code></td><td>The name, short id, or long id (UUID) of the App.</td><td>string</td></tr></tbody></table>

### Example

```yaml
# app
Shopfloor Monitor
```

### Output

An array of user objects containing their profile and status details.

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

## `createAccessLink`

Generates a link that allows a user to access a specific App. The function handles three scenarios automatically:

1. New user: If the email doesn't exist, it creates the user and generates an invite link.
2. Existing user without a password: If the user exists but hasn't set a password (or needs to change it), it generates an invite link that prompts them to set one.
3. Existing active user: If the user exists and has a valid password, it generates a standard login link.

This is the primary function for building "invite user" features in your Apps.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>app</code></td><td>The name, short id, or long id (UUID) of the App the user should access.</td><td>string</td></tr><tr><td><code>email</code></td><td>The email address of the user.</td><td>string</td></tr></tbody></table>

### Example

```yaml
# app
My Dashboard App
# email
new.employee@company.com
```

### Output

An object containing the generated link and the user's status.

```json
{
  "link": "https://acme.heisenware.cloud/app/acme.default/387c2.../invite/?changePasswordId=...",
  "login": "https://acme.heisenware.cloud/app/acme.default/387c2...",
  "userStatus": "created",
  "registrationStatus": "created",
  "passwordSetupRequired": true
}
```

* `link`: The link to send to the user. Depending on the scenario, this is an invite link or the standard login link.
* `login`: The standard login link of the App, always included.
* `userStatus`: `created` when a new user was created, `existed` otherwise.
* `registrationStatus`: `created` when the user was newly registered for the App, `existed` otherwise.
* `passwordSetupRequired`: `true` when the user still has to set a password via the invite link.
