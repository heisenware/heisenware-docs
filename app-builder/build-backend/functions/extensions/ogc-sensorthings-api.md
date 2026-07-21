# OGC SensorThings API

{% hint style="info" %}
#### Available as a Docker Extension

This connector is not part of the default function list. It ships as a [Docker Extension](./), where the installation is explained.
{% endhint %}

The OGC SensorThings API connector talks to an OGC SensorThings compliant server (such as a FROST server) and manages Things, Locations, ObservedProperties, Sensors, Datastreams, and Observations. This class requires an instance. The code class name is `SensorThings`.

## Example use case

Imagine an environmental monitoring application that collects data from various sensors deployed in a city. Using the OGC SensorThings API, the application:

* retrieves current air quality indexes from different areas within the city
* gathers temperature and humidity readings to monitor weather conditions
* accesses noise level data to identify noise pollution hotspots

## General conventions

* All IDs refer to the `@iot.id` property of SensorThings resources.
* All date and time values follow ISO 8601.
* For geospatial data in Locations, GeoJSON is recommended (`encodingType: 'application/geo+json'`).

{% hint style="danger" %}
#### Irreversible action

All delete functions (`deleteThing`, `deleteLocation`, `deleteObservedProperty`, `deleteSensor`, `deleteDatastream`, `deleteObservation`) permanently remove the resource from the server.
{% endhint %}

## Filter expressions

All `get*` list functions accept an optional OGC compliant [filter expression](https://fraunhoferiosb.github.io/FROST-Server/sensorthingsapi/requestingData/STA-Example-Queries.html), such as:

```
name eq 'StationA'
description ne 'Old station'
properties/owner eq 'City Council'
```

## Instance management

### `create`

Creates a SensorThings client instance.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>apiUrl</code></td><td>The URL of the SensorThings server, for example <code>https://server.de/FROST-Server/v1.1</code>. If omitted, the internal FROST server is used.</td><td>string</td></tr></tbody></table>

#### Output

Returns the name of the created instance.

### `delete`

Deletes a client instance.

#### Parameters

None.

#### Output

Returns `true` upon removal.

{% hint style="danger" %}
#### Irreversible action

Deleting removes the instance configuration.
{% endhint %}

## Things

### `createThing`

Creates a Thing, an object of the physical or information world that can be identified and integrated into communication networks.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="140">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>name</code></td><td>Name of the Thing.</td><td>string</td></tr><tr><td></td><td><code>description</code></td><td>Description of the Thing. Default empty.</td><td>string</td></tr><tr><td></td><td><code>properties</code></td><td>Any further properties of the Thing. Default <code>{}</code>.</td><td>object</td></tr><tr><td></td><td><code>uniqueName</code></td><td>If <code>true</code>, an existing Thing with the same name is updated instead of creating a duplicate. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns the numeric ID of the created Thing. If `uniqueName` is set and a Thing with the same name exists, that Thing is updated and the server answer of the update is returned instead.

### `getThings`

Retrieves all or a filtered set of Things.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>filter</code></td><td>Optional filter expression, see <a href="ogc-sensorthings-api.md#filter-expressions">Filter expressions</a>.</td><td>string</td></tr></tbody></table>

#### Output

Returns the server result object with a `value` array of Things. Locations are expanded.

### `getThing`

Reads all information of a single Thing.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The Thing ID.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the Thing object with expanded Locations and HistoricalLocations.

### `updateThing`

Updates a Thing.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The Thing ID.</td><td>integer</td></tr><tr><td><code>changes</code></td><td>An object containing only the fields to change, for example <code>name</code>, <code>description</code>, or <code>properties</code>.</td><td>object</td></tr></tbody></table>

#### Output

Returns the server answer to the update request.

### `deleteThing`

Deletes a Thing.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The Thing ID.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the server answer to the delete request.

### `linkLocations`

Links Locations to a Thing.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>thingId</code></td><td>The Thing ID.</td><td>integer</td></tr><tr><td><code>locationIds</code></td><td>Array of Location IDs to link.</td><td>array</td></tr></tbody></table>

#### Output

Returns nothing. The update runs without waiting for the server, so errors are not reported back.

### `unlinkAllLocations`

Removes all Location links from a Thing.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>thingId</code></td><td>The Thing ID.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the server answer to the update request.

## Locations

### `createLocation`

Creates a Location. The Location locates the Thing or Things it is associated with; a Thing's Location is defined as its last known location.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="140">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>name</code></td><td>Name of the Location.</td><td>string</td></tr><tr><td></td><td><code>location</code></td><td>Location data in the format defined by <code>encodingType</code>, typically a GeoJSON object.</td><td>any</td></tr><tr><td></td><td><code>description</code></td><td>Description of the Location. Default empty.</td><td>string</td></tr><tr><td></td><td><code>properties</code></td><td>Any further properties of the Location. Default <code>{}</code>.</td><td>object</td></tr><tr><td></td><td><code>encodingType</code></td><td>Encoding type of the location data. Default <code>application/geo+json</code>.</td><td>string</td></tr><tr><td></td><td><code>uniqueName</code></td><td>If <code>true</code>, an existing Location with the same name is updated instead of creating a duplicate. Default <code>false</code>.</td><td>boolean</td></tr><tr><td><code>thingIds</code></td><td></td><td>Array of Thing IDs to link the Location to. Default <code>[]</code>.</td><td>array</td></tr></tbody></table>

#### Output

Returns the numeric ID of the created Location. If `uniqueName` is set and a Location with the same name exists, that Location is updated and its ID is returned.

#### Example

```yaml
# options
name: Warehouse A
description: Main storage site
location:
  type: Point
  coordinates: [9.99, 53.55]

# thingIds
[12, 13]
```

### `getLocations`

Retrieves all or a filtered set of Locations.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>filter</code></td><td>Optional filter expression, see <a href="ogc-sensorthings-api.md#filter-expressions">Filter expressions</a>.</td><td>string</td></tr></tbody></table>

#### Output

Returns the server result object with a `value` array of Locations. Things are expanded.

### `getLocation`

Retrieves a single Location.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The Location ID.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the Location object with expanded Things.

### `updateLocation`

Updates a Location.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The Location ID.</td><td>integer</td></tr><tr><td><code>changes</code></td><td>An object containing only the fields to change, for example <code>name</code>, <code>description</code>, <code>properties</code>, <code>location</code>, or <code>encodingType</code>.</td><td>object</td></tr></tbody></table>

#### Output

Returns the server answer to the update request.

### `deleteLocation`

Deletes a Location.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The Location ID.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the server answer to the delete request.

### `showLocationHistory`

Aggregates the historical Locations of a Thing by time and a selected property.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>thingId</code></td><td>The Thing ID.</td><td>integer</td></tr><tr><td><code>property</code></td><td>A key found in the <code>properties</code> section of each Location.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array with one entry per historical location record, each containing a `time` string (minute resolution) and one key per Location name holding the value of the selected property.

## Observed properties

### `createObservedProperty`

Creates an ObservedProperty, which specifies the phenomenon of an Observation.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="140">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>name</code></td><td>Name of the ObservedProperty.</td><td>string</td></tr><tr><td></td><td><code>description</code></td><td>Description of the ObservedProperty. Default empty.</td><td>string</td></tr><tr><td></td><td><code>properties</code></td><td>Any further properties. Default <code>{}</code>.</td><td>object</td></tr><tr><td></td><td><code>definition</code></td><td>URI of a controlled vocabulary term. Default empty.</td><td>string</td></tr><tr><td></td><td><code>uniqueName</code></td><td>If <code>true</code>, an existing ObservedProperty with the same name is updated instead of creating a duplicate. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns the numeric ID of the created or updated ObservedProperty.

### `getObservedProperties`

Retrieves all or a filtered set of ObservedProperties.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>filter</code></td><td>Optional filter expression, see <a href="ogc-sensorthings-api.md#filter-expressions">Filter expressions</a>.</td><td>string</td></tr></tbody></table>

#### Output

Returns the server result object with a `value` array of ObservedProperties.

### `getObservedProperty`

Retrieves a single ObservedProperty.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The ObservedProperty ID.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the ObservedProperty object.

### `updateObservedProperty`

Updates an ObservedProperty.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The ObservedProperty ID.</td><td>integer</td></tr><tr><td><code>changes</code></td><td>An object containing only the fields to change.</td><td>object</td></tr></tbody></table>

#### Output

Returns the server answer to the update request.

### `deleteObservedProperty`

Deletes an ObservedProperty.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The ObservedProperty ID.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the server answer to the delete request.

## Sensors

### `createSensor`

Creates a Sensor, an instrument that observes a property or phenomenon to estimate its value.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="140">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>name</code></td><td>Name of the Sensor.</td><td>string</td></tr><tr><td></td><td><code>description</code></td><td>Description of the Sensor. Default empty.</td><td>string</td></tr><tr><td></td><td><code>properties</code></td><td>Any further properties. Default <code>{}</code>.</td><td>object</td></tr><tr><td></td><td><code>encodingType</code></td><td>Encoding type of the metadata document, for example <code>application/pdf</code>. Default empty.</td><td>string</td></tr><tr><td></td><td><code>metadata</code></td><td>Metadata URI in the specified encoding type. Default empty.</td><td>string</td></tr><tr><td></td><td><code>uniqueName</code></td><td>If <code>true</code>, an existing Sensor with the same name is updated instead of creating a duplicate. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns the numeric ID of the created Sensor.

### `getSensors`

Retrieves all or a filtered set of Sensors.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>filter</code></td><td>Optional filter expression, see <a href="ogc-sensorthings-api.md#filter-expressions">Filter expressions</a>.</td><td>string</td></tr></tbody></table>

#### Output

Returns the server result object with a `value` array of Sensors.

### `getSensor`

Retrieves a single Sensor.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The Sensor ID.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the Sensor object.

### `updateSensor`

Updates a Sensor.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The Sensor ID.</td><td>integer</td></tr><tr><td><code>changes</code></td><td>An object containing only the fields to change.</td><td>object</td></tr></tbody></table>

#### Output

Returns the server answer to the update request.

### `deleteSensor`

Deletes a Sensor.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The Sensor ID.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the server answer to the delete request.

## Datastreams

### `createDatastream`

Creates a Datastream, which groups a collection of Observations measuring the same ObservedProperty and produced by the same Sensor.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="180">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>name</code></td><td>Name of the Datastream.</td><td>string</td></tr><tr><td></td><td><code>description</code></td><td>Description of the Datastream. Default empty.</td><td>string</td></tr><tr><td></td><td><code>observationType</code></td><td>URI of the observation type used to encode observations, for example <code>http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement</code>.</td><td>string</td></tr><tr><td></td><td><code>unitOfMeasurement</code></td><td>Object with three keys: <code>name</code> (full name of the unit), <code>symbol</code> (textual form of the unit symbol), and <code>definition</code> (URI defining the unit).</td><td>object</td></tr><tr><td></td><td><code>uniqueName</code></td><td>If <code>true</code>, an existing Datastream with the same name is updated instead of creating a duplicate. Default <code>false</code>.</td><td>boolean</td></tr><tr><td><code>thingId</code></td><td></td><td>A Thing ID to link to.</td><td>integer</td></tr><tr><td><code>sensorId</code></td><td></td><td>A Sensor ID to link to.</td><td>integer</td></tr><tr><td><code>observedPropertyId</code></td><td></td><td>An ObservedProperty ID to link to.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the numeric ID of the created or updated Datastream.

#### Example

```yaml
# options
name: Temperature outdoor
observationType: http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement
unitOfMeasurement:
  name: Degree Celsius
  symbol: °C
  definition: http://unitsofmeasure.org/ucum.html

# thingId
1

# sensorId
2

# observedPropertyId
3
```

### `getDatastreams`

Retrieves all or a filtered set of Datastreams.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>filter</code></td><td>Optional filter expression, see <a href="ogc-sensorthings-api.md#filter-expressions">Filter expressions</a>.</td><td>string</td></tr></tbody></table>

#### Output

Returns the server result object with a `value` array of Datastreams.

### `getDatastream`

Retrieves a single Datastream.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The Datastream ID.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the Datastream object.

### `updateDatastream`

Updates a Datastream.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The Datastream ID.</td><td>integer</td></tr><tr><td><code>changes</code></td><td>An object containing only the fields to change.</td><td>object</td></tr></tbody></table>

#### Output

Returns the server answer to the update request.

### `deleteDatastream`

Deletes a Datastream.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The Datastream ID.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the server answer to the delete request.

## Observations

### `createObservation`

Creates an Observation, the act of measuring or otherwise determining the value of a property.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="160">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>result</code></td><td>The measured or estimated value of the observation.</td><td>any</td></tr><tr><td></td><td><code>phenomenonTime</code></td><td>The time instant or period of the observation, in ISO 8601 format.</td><td>string</td></tr><tr><td><code>datastreamId</code></td><td></td><td>A Datastream ID to link to.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the numeric ID of the created Observation.

#### Example

```yaml
# options
result: 21.4
phenomenonTime: 2024-01-01T12:00:00Z

# datastreamId
4
```

### `getObservations`

Retrieves all or a filtered set of Observations, for example with the filter `phenomenonTime ge 2024-01-01T00:00:00Z`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>filter</code></td><td>Optional filter expression, see <a href="ogc-sensorthings-api.md#filter-expressions">Filter expressions</a>.</td><td>string</td></tr></tbody></table>

#### Output

Returns the server result object with a `value` array of Observations.

### `getObservation`

Retrieves a single Observation.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The Observation ID.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the Observation object.

### `updateObservation`

Updates an Observation.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The Observation ID.</td><td>integer</td></tr><tr><td><code>changes</code></td><td>An object containing only the fields to change.</td><td>object</td></tr></tbody></table>

#### Output

Returns the server answer to the update request.

### `deleteObservation`

Deletes an Observation.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>id</code></td><td>The Observation ID.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the server answer to the delete request.

## Raw requests

For custom operations, four raw request functions provide direct URL access to the API.

### `getRaw`

Sends a raw GET request.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td>The path or full URL to request.</td><td>string</td></tr></tbody></table>

#### Output

Returns the raw server response.

### `postRaw`

Sends a raw POST request. No request body can be provided.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td>The path or full URL to request.</td><td>string</td></tr></tbody></table>

#### Output

Returns the raw server response.

### `patchRaw`

Sends a raw PATCH request. No request body can be provided.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td>The path or full URL to request.</td><td>string</td></tr></tbody></table>

#### Output

Returns the raw server response.

### `deleteRaw`

Sends a raw DELETE request.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td>The path or full URL to request.</td><td>string</td></tr></tbody></table>

#### Output

Returns the raw server response.

## More information

[OGC SensorThings API Standard 1.0](https://docs.ogc.org/is/15-078r6/15-078r6.html)

[FROST Server Documentation](https://fraunhoferiosb.github.io/FROST-Server/)
