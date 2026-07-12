---
description: Beta Feature
---

# Sap Digital Manufacturing

The `SapDigitalManufacturing` class is a client wrapper for the **SAP Digital Manufacturing** cloud API. It handles the OAuth2 authentication flow and provides simplified methods to interact with the API, such as reading data from standard endpoints and querying Managed Data Objects (MDOs) via OData.

You must create an instance of this class to connect to your specific SAP Digital Manufacturing tenant.

#### create

Creates an instance of the SAP Digital Manufacturing client. This configures the connection details required to authenticate and communicate with your specific API tenant.

**Parameters**

* `options`: An object containing your tenant's connection and authentication credentials.
  * `publicApiEndpoint`: The base URL for your Digital Manufacturing API (e.g., `"https://api.eu20.dmc.cloud.sap"`).
  * `authUrl`: The full URL of the OAuth token endpoint, which is specific to your authentication service setup.
  * `clientId`: The OAuth client ID for your application.
  * `clientSecret`: The OAuth client secret for your application.

**Example**

```yaml
# options
publicApiEndpoint: https://api.eu20.dmc.cloud.sap
authUrl: https://my-subaccount.authentication.eu20.hana.ondemand.com/oauth/token
clientId: sb-abc123def456!xyz
clientSecret: my-very-secret-key-!@#$

```

#### canCommunicate

Performs a basic check to verify that the provided credentials are correct and that a connection to the API endpoint can be established. It authenticates and makes a simple request to the root of the API.

Output

Returns true if communication is successful, false otherwise.

#### read

Performs a generic GET request to any standard REST API endpoint within the Digital Manufacturing suite. This is useful for querying collections of data like orders, materials, or resources.

**Parameters**

* `path`: The relative path of the API endpoint (e.g., `/order/v1/orders`).
* `params`: An optional object of key-value pairs that will be converted into URL query parameters.

**Example 1: Get a list of all work centers in a plant**

```yaml
# path
/resource/v1/workcenters
# params
plant: 1710

```

_Generated URL: `.../resource/v1/workcenters?plant=1710`_

**Example 2: Get details for a specific production order**

```yaml
# path
/order/v1/orders
# params
plant: 1710
order: '1000456'

```

_Generated URL: `.../order/v1/orders?plant=1710&order=1000456`_

Output

The parsed JSON response from the API.

#### readMdo

Reads data from a **Managed Data Object (MDO)** using the OData protocol. MDOs are custom data tables you can create in SAP Digital Manufacturing to store your own master data (e.g., tool lists, quality parameters, special instructions).

**Parameters**

* `entityPath`: The OData path for the MDO (e.g., `/ToolMDOs`).
* `query`: An optional OData query string to filter, sort, or select data.

**Example 1: Read the top 5 entries from a Tool MDO**

```yaml
# entityPath
/ToolMDOs
# query
?$top=5

```

_Generated URL: `.../ToolMDOs?$top=5`_

Example 2: Read a specific tool by its ID

This uses the standard OData key predicate format.

```yaml
# entityPath
/ToolMDOs('TOOL-001')

```

_Generated URL: `.../ToolMDOs('TOOL-001')`_

**Example 3: Filter tools by type and select specific fields**

```yaml
# entityPath
/ToolMDOs
# query
?$filter=toolType eq 'DRILL'&select=toolId,description,wear

```

_Generated URL: `.../ToolMDOs?$filter=toolType%20eq%20'DRILL'&$select=toolId,description,wear`_

Output

The parsed JSON response from the OData service.
