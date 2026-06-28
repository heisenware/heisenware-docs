# OGC SensorThings API

{% hint style="danger" %}
**This extension is currently taken out from the default list**

If you feel that is exactly what you need, please [reach out to us](mailto:support@heisenware.com).
{% endhint %}

## Introduction to OGC SensorThings API

The OGC SensorThings API is a standard specification aiming to simplify and standardise the integration and communication of Internet of Things (IoT) sensor data. It enables seamless interoperability between different systems, devices, and applications by providing a unified way to access and share sensor data over the internet. This API is particularly useful for real-time data exchange and monitoring tasks in diverse and distributed sensor networks.

### **Example**

**Environmental monitoring application**

Imagine an environmental monitoring application that collects data from various sensors deployed in a city. This application can utilise the OGC SensorThings API to access real-time data from sensors measuring air quality, temperature, humidity, and noise levels. By making API requests, the application:

* Retrieves current air quality indexes from different areas within the city.
* Gathers temperature and humidity readings to monitor weather conditions.
* Accesses noise level data to identify and address noise pollution hotspots.

This API enables the application to provide citizens and city officials with up-to-date environmental information, supporting better decision-making and urban planning.

## Functions

### getThings

Retrieves all Things available on the server. A `$filter` expression can be applied for selective querying (e.g., filtering by name or description).

**Example Filter Expression:**\
`name eq 'WeatherStation1'`

### getThing

Retrieves detailed information about a single Thing by its ID, including its associated `Locations` and `HistoricalLocations`.

### updateThing

Updates the specified properties of an existing Thing.\
Possible updatable properties include:

* `name` (String): The name of the Thing.
* `description` (String): Description text.
* `properties` (Object): Additional metadata.

### deleteThing

Deletes a Thing identified by its ID.

### linkLocations

Associates one or more Location entities to a Thing.

### unlinkAllLocations

Removes all Location links from a Thing.

### createLocation

Creates a new Location.

**Options:**

* `name` (String): Name of the Location.
* `location` (Object): Geospatial data in the format of `encodingType`.
* `description` (String): Description of the Location.
* `properties` (Object): Custom attributes.
* `encodingType` (String): Defaults to `'application/geo+json'`.

You may also link this Location directly to existing Things by providing their IDs.

### getLocations

Retrieves all Locations. Supports `$filter` expressions (e.g., `name eq 'SiteA'`).

### getLocation

Retrieves a specific Location by ID.

### updateLocation

Updates an existing Location’s properties:

* `name`
* `description`
* `properties`
* `location`
* `encodingType`

#### `deleteLocation`

Deletes a Location by ID.

#### `showLocationHistory`

Returns the historical Locations of a Thing, aggregated over time based on a specified property found in the `properties`field of each Location.

### createObservedProperty

Creates an ObservedProperty.

**Required options:**

* `name` (String): Name of the ObservedProperty.

**Optional options:**

* `description` (String): Description.
* `properties` (Object): Custom metadata.
* `definition` (String): URI of a controlled vocabulary term.

### getObservedProperties

Retrieves all ObservedProperties. Supports `$filter` expressions (e.g., `name eq 'Temperature'`).

### getObservedProperty

Fetches a single ObservedProperty by ID.

### updateObservedProperty

Updates an existing ObservedProperty’s properties.

### deleteObservedProperty

Deletes an ObservedProperty by ID.

### createSensor

Creates a Sensor entity.

**Required options:**

* `name` (String): Name of the Sensor.

**Optional options:**

* `description` (String)
* `properties` (Object)
* `encodingType` (String): MIME type, e.g., `application/pdf`.
* `metadata` (String): Metadata URI.

### getSensors

Retrieves all Sensors. Supports `$filter` expressions.

### getSensor

Fetches a Sensor by ID.

### updateSensor

Updates a Sensor entity.

### deleteSensor

Deletes a Sensor by ID.

## **Datastreams**

### createDatastream

Creates a Datastream entity.

**Required options:**

* `name` (String)
* `observationType` (String): URI or identifier of the observation type (e.g., `http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement`).
* `unitOfMeasurement` (Object): Must include:
  * `name` (e.g., `'Degree Celsius'`)
  * `symbol` (e.g., `'°C'`)
  * `definition` (URI string)
* `thingId` (Integer)
* `sensorId` (Integer)
* `observedPropertyId` (Integer)

**Optional options:**

* `description` (String)

### getDatastreams

Retrieves all Datastreams. Supports `$filter` expressions.

### getDatastream

Fetches a specific Datastream by ID.

### updateDatastream

Updates an existing Datastream.

### deleteDatastream

Deletes a Datastream by ID.

## **Observations**

### createObservation

Creates an Observation.

**Required options:**

* `result` (any type): The value/result of the observation.
* `phenomenonTime` (String, ISO 8601 format): Timestamp of the observation.

**Also requires:**

* `datastreamId` (Integer)

### getObservations

Retrieves all Observations. Supports `$filter` expressions (e.g., `phenomenonTime ge 2024-01-01T00:00:00Z`).

### getObservation

Fetches a specific Observation by ID.

### updateObservation

Updates an Observation entity.

### deleteObservation

Deletes an Observation by ID.

### **Raw Requests**

For flexibility, raw request methods are also provided:

* `getRaw`
* `postRaw`
* `patchRaw`
* `deleteRaw`

These allow direct URL access to the API for custom operations.

### **Filters and Queries**

Many `get*` methods support OGC-compliant [filter expressions](https://fraunhoferiosb.github.io/FROST-Server/sensorthingsapi/requestingData/STA-Example-Queries.html), such as:

```
pgsqlCopyEditname eq 'StationA'
description ne 'Old station'
properties/owner eq 'City Council'
```

### **Notes:**

* All IDs refer to `@iot.id` properties from SensorThings resources.
* All date/time values follow ISO 8601.
* For geospatial data in Locations, the standard `GeoJSON` format is recommended (`encodingType: 'application/geo+json'`).

### **More information**

[OGC SensorThings API Standard 1.0](https://docs.ogc.org/is/15-078r6/15-078r6.html)

[FROST Server Documentation](https://fraunhoferiosb.github.io/FROST-Server/)

