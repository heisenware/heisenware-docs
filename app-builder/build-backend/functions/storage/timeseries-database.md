# Timeseries database

The timeseries database connector is a specialized client for InfluxDB. It stores high-frequency data where the recording time is as important as the value itself, such as sensor readings, machine performance metrics, or energy consumption.

This connector requires [instance creation](./#instance-creation) before you can write and query data, unless you use the pre-initialized `internal-influx` instance.

{% hint style="info" %}
#### Intelligent downsampling and native multi-fields

The connector supports downsampling. It retains high-resolution raw data for recent events while automatically aggregating older data into lower-resolution buckets to optimize storage.

It also natively supports multi-field telemetry. When you log entire objects (such as `{ cycle_time: 4.2, yield: 150 }`), the database automatically fans them out into individual queryable fields and reconstructs the object on the fly when you read it back.
{% endhint %}

## Quick start: the internal instance

Heisenware provides a pre-initialized InfluxDB instance called `internal-influx`. It is globally available and ready for use. Select `internal-influx` in your function's instance field to log timeseries data immediately without creating an instance.

{% hint style="info" %}
#### Direct data recording with the recorder

The [recorder](../../extension-nodes/recorder.md) extension node provides the fastest way to log data. Click the `+` icon on any function output or modifier and select the recorder. By default, the node logs data directly into the `internal-influx` instance without extra function blocks in your flow.
{% endhint %}

## Connecting an external database

To connect an external InfluxDB instance, use the `create` function:

* **Cloud or public database**: Connect directly if your InfluxDB server is accessible via the internet.
* **Local database (via Agent)**: If your InfluxDB sits inside a private network, deploy an [Agent](/app-builder/build-backend/agents.md) in that network first and create the database instance within that Agent.

{% hint style="info" %}
The functions for writing and querying data remain identical whether you use the managed `internal-influx` or a custom connection.
{% endhint %}

## Downsampling pipeline

The downsampling pipeline stores data efficiently, letting you write high-frequency data (such as sensor readings every second) without running out of storage or slowing down queries over long time ranges.

#### Hot and cold data

The system categorizes data by age:

* **Hot data (recent)**: Requires high detail for real-time monitoring (such as detecting short temperature spikes).
* **Cold data (historical)**: Requires trend visibility rather than microsecond detail (such as analyzing average monthly temperatures).

The system automatically moves data through buckets as it ages, reducing resolution to optimize storage while maintaining statistical accuracy.

#### Pipeline structure

Data flows automatically through a series of stages. Write data only to the start of the pipeline.

![](<../../../../.gitbook/assets/image (1).png>)

| Bucket | Resolution | Retention | Typical use |
| :--- | :--- | :--- | :--- |
| `H+` | Raw (every point) | 1 day | Real-time monitoring, debugging recent events |
| `D+` | 5 minutes | 1 week | Zooming into last week's performance |
| `W+` | 1 hour | 1 month | Weekly trends and patterns |
| `M+` | 1 day | 1 year | Monthly analysis and seasonal trends |
| `Y+` | 1 week | Forever | Long-term historical archiving |

#### How writing works

Write operations send data to the raw (`H+`) bucket automatically. Background tasks then process the data. For example, every 5 minutes a task extracts raw data from `H+`, calculates the mean, minimum, maximum, and count, and saves a summary point to the `D+` bucket.

#### How reading works (smart stitching)

You do not need to specify a bucket when reading data. Provide a time range and `readDownsampled` routes the query:

1. It evaluates the requested `start` and `stop` times.
2. It selects the highest-resolution bucket available for that period.
3. It stitches the data together if the request spans retention boundaries.

For example, if you query the last 2 days, the function returns the last 24 hours from the raw (`H+`) bucket and the preceding 24 hours from the 5-minute (`D+`) bucket.

#### Configuration examples

* **Real-time debugging**: Pulls from the raw (`H+`) bucket to view the last 15 minutes.
  ```yaml
  # (readDownsampled)
  # options
  start: "-15m"
  tail: 100
  ```
* **Monthly reporting**: Pulls from the hourly (`W+`) or daily (`M+`) buckets to visualize trends over the last 30 days.
  ```yaml
  # (readDownsampled)
  # options
  start: "-30d"
  limit: 1000
  ```
* **Stitched view**: Returns the last 50 data points regardless of age, automatically querying older buckets if needed.
  ```yaml
  # (readDownsampled)
  # options
  tail: 50
  ```

#### Aggregated fields

During downsampling, the pipeline preserves four key statistics for each window:

* `mean`: The average value.
* `max`: The highest value.
* `min`: The lowest value.
* `count`: The total number of raw data points in the window.

## Connection

### `create`

Creates an InfluxDB client instance.

{% hint style="info" %}
Skip this step for `internal-influx`. It is already instantiated for you.
{% endhint %}

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The URL of the InfluxDB instance (such as <code>http://localhost:8086</code>).</td><td>string</td></tr><tr><td><code>token</code></td><td></td><td>The authentication token with permissions for the target organization and buckets.</td><td>string</td></tr><tr><td><code>org</code></td><td></td><td>The name of the organization in InfluxDB.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>flushInterval</code></td><td>The interval in milliseconds to flush buffered writes. Default 5000.</td><td>integer</td></tr><tr><td></td><td><code>batchSize</code></td><td>The number of points to buffer before writing. Default 1000.</td><td>integer</td></tr><tr><td></td><td><code>downsamplingPipeline</code></td><td>Overrides the default downsampling stages.</td><td>array</td></tr></tbody></table>

{% hint style="info" %}
Right-click the <code>token</code> input and mark it as a secret to mask it.
{% endhint %}

### `delete`

Removes the timeseries database client instance and its connection configuration.

{% hint style="danger" %}
#### Destructive action

Deleting an instance removes its configuration. To communicate with the database again, you must create a new instance.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` on successful deletion. Throws an error on failure.

## Writing data

### `writePoint`

Writes a single data point to a specific bucket and measurement.

When you pass an object as data, the engine fans it out into native InfluxDB fields, allowing fast analytics on individual properties later. If a measurement historically used stringified JSON, the database continues using it to preserve existing dashboards.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bucket</code></td><td>The name of the bucket to write to.</td><td>string</td></tr><tr><td><code>measurement</code></td><td>The name of the measurement (such as <code>temperature</code> or <code>production_line</code>).</td><td>string</td></tr><tr><td><code>data</code></td><td>The value to record. Accepts a number, string, boolean, or object (such as <code>{ temp: 45, status: "ok" }</code>).</td><td>any</td></tr><tr><td><code>tags</code></td><td>Optional key-value pairs to tag the data. To force the object storage behavior, add <code>objectStorageType: 'fields'</code> or <code>objectStorageType: 'json'</code>. The database strips this control flag before saving.</td><td>object</td></tr></tbody></table>

<div align="left"><figure><img src="../../../../.gitbook/assets/image (4).png" alt="" width="375"><figcaption><p>Measurement vs. tags vs. fields</p></figcaption></figure></div>

#### Example

```yaml
# bucket
D
# measurement
production_line
# data
cycle_time: 4.2
yield: 150
# tags
location: warehouse
line_id: A1
objectStorageType: fields
```

#### Output

Returns `true` when the write succeeds. Throws an error on failure.

{% hint style="info" %}
#### Internal bucket names

When using the internal database, bucket names indicate retention: <code>F</code> (forever), <code>Y</code> (year), <code>M</code> (month), <code>W</code> (week), <code>D</code> (day), <code>H</code> (hour).
{% endhint %}

### `writePoints`

Writes multiple data points to a specific bucket and measurement. This is more efficient than calling `writePoint` in a loop.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bucket</code></td><td>The name of the bucket.</td><td>string</td></tr><tr><td><code>measurement</code></td><td>The name of the measurement.</td><td>string</td></tr><tr><td><code>data</code></td><td>An array of values or objects to record.</td><td>array</td></tr><tr><td><code>tags</code></td><td>Optional tags. If specified as an array, the length must match the <code>data</code> array (one tag object per point). If specified as a single object, the tags apply to all points.</td><td>any</td></tr></tbody></table>

#### Example

```yaml
# bucket
D
# measurement
vibration
# data
- 0.5
- 0.6
- 0.4
- 0.8
```

#### Output

Returns `true` when the write succeeds. Throws an error on failure.

### `writeDownsampled`

Writes numeric data or multi-field objects to the high-frequency bucket (`H+`) for automatic downsampling.

When you pass an object containing both numbers and strings (such as `{ speed: 120, status: "running" }`), the system retains the full object in the raw `H+` bucket for debugging, but only aggregates numeric fields into long-term historical buckets. The pipeline drops non-numeric fields (such as strings and booleans) during downsampling and logs a warning.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td>The name of the measurement.</td><td>string</td></tr><tr><td><code>data</code></td><td>The numeric value, object, or array to store.</td><td>any</td></tr><tr><td><code>tags</code></td><td>Optional tags to associate with the data.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# measurement
extruder_metrics
# data
speed: 230.5
temperature: 180.2
status: heating
# tags
machine: m1
```

#### Output

Returns `true` when the write succeeds. Throws an error on failure.

## Reading data

### `read`

Reads timeseries data from a specific bucket and measurement, with options for filtering by time, isolating fields, limiting results, and aggregating data.

When you query a measurement containing multiple fields and do not specify a target field, the engine automatically pivots the data and reconstructs the original object.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bucket</code></td><td></td><td>The name of the bucket to query.</td><td>string</td></tr><tr><td><code>measurement</code></td><td></td><td>The name of the measurement.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>field</code></td><td>The specific field to isolate (such as <code>cycle_time</code>). If omitted, the function returns all fields as an object.</td><td>string</td></tr><tr><td></td><td><code>start</code></td><td>The earliest time to include (such as <code>-12h</code>, <code>-7d</code>, or <code>2025-01-01T00:00:00Z</code>). Default <code>-1y</code>.</td><td>string</td></tr><tr><td></td><td><code>stop</code></td><td>The latest time to include. Default <code>now()</code>.</td><td>string</td></tr><tr><td></td><td><code>limit</code></td><td>Limits the result to the first n data points.</td><td>integer</td></tr><tr><td></td><td><code>tail</code></td><td>Limits the result to the last n data points.</td><td>integer</td></tr><tr><td></td><td><code>every</code></td><td>The duration of time windows for aggregation (such as <code>15m</code>).</td><td>string</td></tr><tr><td></td><td><code>func</code></td><td>The aggregation function applied per window (such as <code>mean</code>, <code>sum</code>, <code>count</code>, or <code>last</code>). Default <code>mean</code>.</td><td>string</td></tr><tr><td></td><td><code>tags</code></td><td>An object of tags to filter by.</td><td>object</td></tr><tr><td></td><td><code>difference</code></td><td>Calculates differences between readings when set to <code>true</code>. Set to <code>nonNegative</code> to ignore counter resets. Default <code>false</code>.</td><td>any</td></tr><tr><td></td><td><code>fillPrevious</code></td><td>Carries the last known value forward into empty time windows when set to <code>true</code>. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>cumulativeSum</code></td><td>Keeps a running total across the selected time range when set to <code>true</code>. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>derivativeUnit</code></td><td>Calculates the rate of change per given unit (such as <code>1m</code> for per-minute rates).</td><td>string</td></tr></tbody></table>

<details>

<summary>Understanding aggregation</summary>

Timeseries databases often contain thousands of individual points. To visualize this data effectively, group the points into larger time windows and summarize them. Two parameters control this:

* `every`: The size of the time window (such as `1h`, `15m`, or `1d`).
* `func`: The calculation applied to the points within each window.

#### Available functions

| Function | Description | Typical use case |
| :--- | :--- | :--- |
| `mean` | Calculates the average value. | Smoothing noisy sensor data (such as average temperature per hour). |
| `median` | Finds the middle value. | Finding the typical value while ignoring extreme outliers. |
| `min` | Finds the lowest value. | Detecting the coldest temperature or lowest battery level. |
| `max` | Finds the highest value. | Detecting peak power usage or maximum pressure. |
| `sum` | Adds up all values. | Calculating total energy consumption or total volume flowed. |
| `count` | Counts the number of data points. | Counting machine cycles or error logs. |
| `last` | Takes the last value in the window. | The final state of a system at the end of each period. |
| `first` | Takes the first value in the window. | The starting state of a system at the beginning of each period. |

</details>

#### Examples

**Example 1: Smoothing noisy sensor data (averages)**

An analog sensor sends data every second. Group the data into time windows and calculate the mean to smooth the trend over the last 12 hours:

```yaml
# bucket
D
# measurement
extruder_temp
# options
start: -12h
every: 5m
func: mean
```

**Example 2: Peak detection and shift highs**

Find the maximum value reached per reporting period over the last 30 days:

```yaml
# bucket
D
# measurement
motor_temperature
# options
start: -30d
every: 1d
func: max
```

**Example 3: Counting incidents or machine faults**

Count how many faults or failed inspections occurred per time window for the current shift:

```yaml
# bucket
D
# measurement
qa_failures
# options
start: -8h
every: 1h
func: count
```

**Example 4: The resetting machine counter (pieces produced)**

A PLC part counter resets to 0 at shift end. Use `difference: nonNegative` to calculate pieces produced between readings while ignoring the negative drop at reset:

```yaml
# bucket
D
# measurement
packaging_line
# options
field: piece_counter
start: -24h
every: 1h
func: sum
difference: nonNegative
```

**Example 5: Event-driven machine states (sparse data)**

A machine only sends data on state changes, leaving gaps in the timeline. Use `fillPrevious: true` to carry the last known state forward into empty windows:

```yaml
# bucket
D
# measurement
cnc_machine_1
# options
field: status_code
start: -8h
every: 1m
func: last
fillPrevious: true
```

**Example 6: Cumulative running totals (energy or water usage)**

Show the running total of energy consumed in the last 12 hours:

```yaml
# bucket
D
# measurement
main_power_meter
# options
field: interval_kwh
start: -12h
every: 15m
func: sum
cumulativeSum: true
```

**Example 7: Rate of change (derivatives)**

Calculate the minute-by-minute drain rate of a chemical tank:

```yaml
# bucket
D
# measurement
chemical_tank_A
# options
field: volume_liters
start: -1h
derivativeUnit: 1m
```

**Example 8: Isolating metrics from multi-field payloads**

Show the maximum vibration recorded every 5 minutes from a multi-field payload:

```yaml
# bucket
D
# measurement
robot_arm_2
# options
field: vibration
start: -24h
every: 5m
func: max
```

#### Output

Returns an array of objects, each containing a `date` (ISO timestamp) and a `value` (a primitive value or a reconstructed object).

```json
[
  { "date": "2025-10-27T10:00:00Z", "value": { "cycle_time": 4.2, "yield": 150 } },
  { "date": "2025-10-27T10:15:00Z", "value": { "cycle_time": 4.1, "yield": 152 } }
]
```

### `readDownsampled`

Reads downsampled data by automatically stitching together details across downsampling buckets (raw `H+` for recent data, aggregated `D+`/`W+`/`M+`/`Y+` for older data).

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td></td><td>The name of the measurement.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>field</code></td><td>The specific field to extract. Default <code>value</code>.</td><td>string</td></tr><tr><td></td><td><code>aggFunc</code></td><td>The statistic returned as the main value (such as <code>mean</code> or <code>max</code>). Default <code>mean</code>.</td><td>string</td></tr><tr><td></td><td><code>start</code></td><td>The earliest time to include. Default <code>-1y</code>.</td><td>string</td></tr><tr><td></td><td><code>stop</code></td><td>The latest time to include. Default <code>now()</code>.</td><td>string</td></tr><tr><td></td><td><code>limit</code></td><td>Limits the result to the first n points.</td><td>integer</td></tr><tr><td></td><td><code>tail</code></td><td>Limits the result to the last n points.</td><td>integer</td></tr><tr><td></td><td><code>tags</code></td><td>Filters by tags.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# measurement
production_line
# options
start: -30d
field: cycle_time
aggFunc: max
tags:
  line_id: A1
```

#### Output

Returns an array of objects containing statistics (`mean`, `min`, `max`, `count`) per time point. The requested `aggFunc` maps to the main `value` key.

```json
[
  {
    "date": "2025-10-01T00:00:00Z",
    "mean": 4.5,
    "min": 4.1,
    "max": 5.2,
    "count": 60,
    "value": 5.2,
    "raw": false
  }
]
```

### `query`

Executes a raw Flux query string for complex database operations.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>flux</code></td><td>The raw Flux query string.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# flux
from(bucket:"my-bucket") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "cpu")
```

#### Output

Returns the raw query result rows from InfluxDB.

## Live data and caching

### `subscribeToChange`

Registers a callback executed whenever new data is written to a measurement.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td></td><td>The name of the measurement to watch.</td><td>string</td></tr><tr><td><code>handler</code></td><td></td><td>The callback evaluated on every write. Receives the payload.</td><td>callback</td></tr><tr><td><code>options</code></td><td><code>samplingInterval</code></td><td>Guarantees the handler fires at most once every X milliseconds. Default 0.</td><td>integer</td></tr><tr><td></td><td><code>includeData</code></td><td>Includes the written data and tags in the payload when set to <code>true</code>. Default false.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns a unique handler ID string. Use this ID with `unsubscribeFromChange` to remove the listener.

#### Example

```yaml
# measurement
production_line
# handler
<callback>
# options
samplingInterval: 1000
includeData: true
```

### `unsubscribeFromChange`

Unregisters change handlers for a measurement.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td>An optional measurement to unsubscribe from.</td><td>string</td></tr><tr><td><code>handlerId</code></td><td>An optional specific handler ID returned by <code>subscribeToChange</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` if the listener is unsubscribed, or `false` if it is not found.

### `enableCaching`

Enables time-based caching of `read` and `readDownsampled` results for a specific measurement. Repeated identical queries within the TTL return the cached result instead of querying the database. Concurrent identical queries share a single database request.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td>The name of the measurement to cache.</td><td>string</td></tr><tr><td><code>ttlMs</code></td><td>The time-to-live of cached results in milliseconds. Default 30000.</td><td>integer</td></tr></tbody></table>

#### Output

Returns `true` on successful caching activation.

#### Example

```yaml
# measurement
production_line
# ttlMs
30000
```

### `disableCaching`

Disables caching for a specific measurement and purges all cached results.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td>The name of the measurement.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` on success.

## Database management

### `delete`

Deletes data from a measurement over a specified time range.

{% hint style="danger" %}
#### Destructive action

This permanently deletes the measurement data. You cannot undo this action.
{% endhint %}

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bucket</code></td><td></td><td>The name of the bucket.</td><td>string</td></tr><tr><td><code>measurement</code></td><td></td><td>The name of the measurement to delete.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>start</code></td><td>The start time. Default <code>1970-01-01</code>.</td><td>string</td></tr><tr><td></td><td><code>stop</code></td><td>The end time. Default is the current time.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# bucket
D
# measurement
test_data
# options
start: -1h
```

#### Output

Returns `true` when the deletion succeeds.

### `flush`

Manually forces buffered pending writes to send to the database immediately. Use this during testing or before shutting down a process to prevent data loss.

#### Parameters

None.

#### Output

Returns `true` when the buffer flushes successfully.

### `reset`

Deletes all data from all measurements in all buckets. The buckets remain intact but empty.

{% hint style="danger" %}
#### Destructive action

This permanently deletes all data associated with the instance. You cannot undo this action.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` when the reset succeeds.

### `listBuckets`

Retrieves all available buckets in the connected organization.

#### Parameters

None.

#### Output

Returns an array of bucket objects.

```json
[
  { "name": "D", "id": "...", "retentionPeriod": 86400 },
  { "name": "F", "id": "...", "retentionPeriod": 0 }
]
```

### `listMeasurements`

Lists detailed information about all measurements across all buckets.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>includeStats</code></td><td>Calculates row count and cardinality when set to <code>true</code>. This operation can be slow. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>statsRangeStart</code></td><td>The start of the time range for calculations. Default <code>-1y</code>.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# options
includeStats: true
```

#### Output

Returns an array of objects containing measurement details.

```json
[
  {
    "name": "production_line",
    "bucket": "D",
    "fields": ["cycle_time", "yield"],
    "tags": ["line_id"],
    "stats": { "rowCount": 500, "seriesCardinality": 1 }
  }
]
```

### `getMeasurementDetails`

Retrieves the schema fields and tags of a specific measurement in a bucket.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bucket</code></td><td>The bucket name.</td><td>string</td></tr><tr><td><code>measurement</code></td><td>The measurement name.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# bucket
D
# measurement
production_line
```

#### Output

Returns an object detailing fields and tags.

```json
{
  "fields": ["cycle_time", "yield"],
  "tags": ["line_id", "location"]
}
```

### `getMeasurementStats`

Calculates row count and cardinality of a specific measurement over a given time range.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bucket</code></td><td></td><td>The bucket name.</td><td>string</td></tr><tr><td><code>measurement</code></td><td></td><td>The measurement name.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>start</code></td><td>The start time. Default <code>-30d</code>.</td><td>string</td></tr><tr><td></td><td><code>stop</code></td><td>The end time. Default <code>now()</code>.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# bucket
F
# measurement
errors
# options
start: -7d
```

#### Output

Returns an object detailing row count and cardinality.

```json
{
  "rowCount": 150,
  "seriesCardinality": 2
}
```
