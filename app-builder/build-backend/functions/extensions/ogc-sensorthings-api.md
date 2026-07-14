# OGC SensorThings API

{% hint style="info" %}
#### Status notice
This extension is currently hidden from the default listing. If your architecture requires OGC compliance, contact support@heisenware.com to enable it.
{% endhint %}

The OGC SensorThings API extension provides an interoperability layer for managing Internet of Things (IoT) sensor devices, locations, datastreams, and observations using the open geospatial consortium standard. This class requires an instance. The code class name is `OgcSensorThings`.

## Things

### `getThings`

Retrieves available Thing entities from the server.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>filter</code></td><td>An OGC-compliant filter expression (for example, <code>name eq 'WeatherStation1'</code>).</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of Thing resource objects.

### `getThing`

Retrieves detailed properties for a single Thing by its ID, including locations and history.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The unique resource ID.</td><td>integer</td></tr></tbody></table>

#### Output

Returns a Thing resource object.

### `updateThing`

Updates properties on an existing Thing.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td></td><td>The target resource ID.</td><td>integer</td></tr><tr><td><code>properties</code></td><td><code>name</code></td><td>The updated name string.</td><td>string</td></tr><tr><td></td><td><code>description</code></td><td>The updated description string.</td><td>string</td></tr><tr><td></td><td><code>properties</code></td><td>Custom metadata object attributes.</td><td>object</td></tr></tbody></table>

#### Output

Returns nothing.

### `deleteThing`

Deletes a Thing resource by its ID.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The target resource ID.</td><td>integer</td></tr></tbody></table>

#### Output

Returns nothing.

### `linkLocations`

Associates Location entities with a target Thing.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>thingId</code></td><td>The destination Thing resource ID.</td><td>integer</td></tr><tr><td><code>locationIds</code></td><td>An array of Location resource IDs to bind.</td><td>array</td></tr></tbody></table>

#### Output

Returns nothing.

### `unlinkAllLocations`

Removes all associated Location links from a Thing.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>thingId</code></td><td>The target Thing resource ID.</td><td>integer</td></tr></tbody></table>

#### Output

Returns nothing.

## Locations

### `createLocation`

Creates a new Location entity.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>name</code></td><td>The name identifier for the location.</td><td>string</td></tr><tr><td></td><td><code>description</code></td><td>Description text.</td><td>string</td></tr><tr><td></td><td><code>location</code></td><td>GeoJSON geospatial coordinates data object.</td><td>object</td></tr><tr><td></td><td><code>encodingType</code></td><td>MIME type of the geo-data. Default <code>application/geo+json</code>.</td><td>string</td></tr><tr><td></td><td><code>properties</code></td><td>Custom attribute metadata map.</td><td>object</td></tr><tr><td></td><td><code>thingIds</code></td><td>Optional array of Thing IDs to link instantly.</td><td>array</td></tr></tbody></table>

#### Output

Returns the created Location resource object.

### `getLocations`

Retrieves Location entries. Supports standard filtering string arguments.

### `getLocation`

Fetches a single Location resource using its ID.

### `updateLocation`

Updates mutable fields on an existing Location entity.

### `deleteLocation`

Deletes a Location resource using its ID.

### `showLocationHistory`

Returns the chronological historical locations of a Thing, grouped by a metadata property key.

## Observed properties

### `createObservedProperty`

Registers an environmental or physical property being monitored.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>name</code></td><td>The property identifier name (such as <code>Temperature</code>).</td><td>string</td></tr><tr><td></td><td><code>description</code></td><td>Text description.</td><td>string</td></tr><tr><td></td><td><code>definition</code></td><td>A URI reference string pointing to a controlled vocabulary term.</td><td>string</td></tr><tr><td></td><td><code>properties</code></td><td>Custom metadata attributes map.</td><td>object</td></tr></tbody></table>

#### Output

Returns the created resource object.

### `getObservedProperties`

Retrieves all recorded ObservedProperty resources. Supports filters.

### `getObservedProperty`

Retrieves a single ObservedProperty resource by its ID.

### `updateObservedProperty`

Updates an existing ObservedProperty resource configuration.

### `deleteObservedProperty`

Deletes an ObservedProperty resource by its ID.

## Sensors

### `createSensor`

Creates a Sensor entity profile.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>name</code></td><td>The sensor identifier name.</td><td>string</td></tr><tr><td></td><td><code>description</code></td><td>Text description.</td><td>string</td></tr><tr><td></td><td><code>encodingType</code></td><td>The metadata document format type (for example, <code>application/pdf</code>).</td><td>string</td></tr><tr><td></td><td><code>metadata</code></td><td>A URI string pointing to system or documentation metadata.</td><td>string</td></tr><tr><td></td><td><code>properties</code></td><td>Custom attributes map.</td><td>object</td></tr></tbody></table>

#### Output

Returns the created Sensor resource object.

### `getSensors`

Retrieves Sensors from the server. Supports filters.

### `getSensor`

Fetches a specific Sensor by its ID.

### `updateSensor`

Updates properties on an active Sensor resource.

### `deleteSensor`

Deletes a Sensor resource by its ID.

## Datastreams

### `createDatastream`

Groups a collection of Observations tracking a distinct ObservedProperty.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>name</code></td><td>The datastream identifier name.</td><td>string</td></tr><tr><td></td><td><code>observationType</code></td><td>Observation model type URI.</td><td>string</td></tr><tr><td></td><td><code>unitOfMeasurement</code></td><td>Object containing <code>name</code>, <code>symbol</code>, and <code>definition</code> URI.</td><td>object</td></tr><tr><td></td><td><code>thingId</code></td><td>The linked Thing resource ID.</td><td>integer</td></tr><tr><td></td><td><code>sensorId</code></td><td>The linked Sensor resource ID.</td><td>integer</td></tr><tr><td></td><td><code>observedPropertyId</code></td><td>The linked ObservedProperty resource ID.</td><td>integer</td></tr><tr><td></td><td><code>description</code></td><td>Optional text description.</td><td>string</td></tr></tbody></table>

#### Output

Returns the created Datastream resource object.

### `getDatastreams`

Retrieves available Datastreams. Supports filter strings.

### `getDatastream`

Fetches a single Datastream by its ID.

### `updateDatastream`

Updates mutable fields on an existing Datastream.

### `deleteDatastream`

Deletes a Datastream resource by its ID.

## Observations

### `createObservation`

Logs a single numerical or qualitative data point entry.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>result</code></td><td>The captured measurement value payload.</td><td>any</td></tr><tr><td></td><td><code>phenomenonTime</code></td><td>ISO 8601 string timestamp of the physical event occurrence.</td><td>string</td></tr><tr><td></td><td><code>datastreamId</code></td><td>The destination Datastream target resource ID.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the created Observation resource object.

### `getObservations`

Retrieves observations matching optional filter arguments (such as `phenomenonTime ge 2024-01-01T00:00:00Z`).

### `getObservation`

Fetches a single Observation resource using its ID.

### `updateObservation`

Updates an existing Observation entity configuration.

### `deleteObservation`

Deletes an Observation resource using its ID.

## Raw requests

Execute unmanaged operations directly against endpoint structures using raw REST methods: `getRaw`, `postRaw`, `patchRaw`, and `deleteRaw`.
