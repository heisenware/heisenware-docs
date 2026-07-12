# Users

The `Users` class provides a service for managing users and applications within our authentication system.

It is designed to help you programmatically manage access to your applications. You can use it to retrieve lists of available apps, get details about specific apps, list all users registered to an app, and—most importantly—generate access or invitation links to onboard users dynamically.

Since all methods in this class are static, you do not need to create an instance of it.

## Static Functions

### getApplications

Retrieves a list of all applications currently configured in your tenant. This is useful for getting an overview of available apps or for populating selection lists in your UI.

Output

An array of application objects.

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

### getApplication

Retrieves details for a single, specific application. You can look up the application using its name or its ID.

Parameters

* `app`: The name or the unique ID (UUID) of the application you want to find.

Example

```yaml
# app
My Dashboard App
```

Output

A single application object, or `null` if not found.

```json
{
  "id": "387c2...",
  "tenantId": "651a...",
  "name": "My Dashboard App",
  "active": true
}
```

### getUsers

Retrieves a list of all users who are currently registered for a specific application.

Parameters

* `app`: The name or the unique ID (UUID) of the application.

Example

```yaml
# app
Shopfloor Monitor
```

Output

An array of user objects containing their profile and status details.

```json
[
  {
    "email": "jane.doe@company.com",
    "username": "jdoe",
    "firstName": "Jane",
    "lastName": "Doe",
    "userId": "a1b2c3...",
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

### createAccessLink

Generates a specialized link that allows a user to access a specific application. This function is "smart" and handles three different scenarios automatically:

1. New User: If the email doesn't exist, it creates the user and generates an invite link.
2. Existing User (Password Reset Required): If the user exists but hasn't set a password (or needs to change it), it generates an invite link that prompts them to set a password.
3. Existing User (Active): If the user exists and has a valid password, it generates a standard login link.

This is the primary function used for building "Invite User" features in your apps.

Parameters

* `app`: The name or unique ID of the application the user should access.
* `email`: The email address of the user.

Example

```yaml
# app
My Dashboard App
# email
new.employee@company.com
```

Output

An object containing the generated link and the user's status.

```json
{
  "link": "https://acme.heisenware.cloud/app/acme.default/387c2...?changePasswordId=...",
  "userStatus": "created",
  "registrationStatus": "created",
  "passwordSetupRequired": true
}
```
