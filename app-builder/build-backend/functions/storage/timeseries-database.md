# Timeseries database

The timeseries database class is a specialized client for InfluxDB. It is designed for high-frequency data where the time of the recording is just as important as the value itself, such as sensor readings, machine performance metrics, or energy consumption.

{% hint style="info" %}
#### Key features: Intelligent downsampling and native multi-fields

The class has built-in support for downsampling: It keeps high-resolution raw data for recent events while automatically aggregating older data into lower-resolution buckets, so storage stays efficient.

It also natively supports multi-field telemetry. Log entire objects (e.g. `{ cycle_time: 4.2, yield: 150 }`) and the database automatically fans them out into individually queryable fields, reconstructing the object on the fly when you read it back.
{% endhint %}

## Quick start: The internal instance

Heisenware provides a pre-initialized InfluxDB instance called `internal-influx`. It is globally available and ready for use. Select `internal-influx` in your function's instance field to start logging timeseries data immediately, no `create` needed.

{% hint style="info" %}
#### Direct data recording with the recorder

The fastest way to log data is the [recorder](../../extension-nodes/recorder.md) extension node. Click the `+` icon on any function output or modifier and select the recorder. By default it logs data directly into the `internal-influx` instance, without extra function blocks in your flow.
{% endhint %}

## Connecting an external database

To connect an external InfluxDB instance, use the `create` function:

* Cloud or public database: Connect directly if your InfluxDB server is accessible via the internet.
* Local database (via Agent): If your InfluxDB is hosted on a private network, deploy an [Agent](../../agents/) in that network and create your instance within that Agent.

{% hint style="info" %}
Whether you use the managed `internal-influx` or a custom connection, the functions for writing and querying data are identical.
{% endhint %}

## Connection

### `create`

Creates an InfluxDB client instance connecting to a specific database URL with the necessary credentials.

{% hint style="info" %}
Skip this step for `internal-influx`. It is already instantiated for you.
{% endhint %}

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="150">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The URL of your InfluxDB instance (e.g. <code>http://localhost:8086</code>).</td><td>string</td></tr><tr><td><code>token</code></td><td></td><td>The authentication token with the required permissions for your organization and buckets.</td><td>string</td></tr><tr><td><code>org</code></td><td></td><td>The name of the organization in InfluxDB.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>flushInterval</code></td><td>The interval in milliseconds to flush buffered writes. Default <code>5000</code>.</td><td>integer</td></tr><tr><td></td><td><code>batchSize</code></td><td>The number of points to buffer before writing. Default <code>1000</code>.</td><td>integer</td></tr><tr><td></td><td><code>downsamplingPipeline</code></td><td>Overrides the default downsampling stages.</td><td>array</td></tr></tbody></table>

{% hint style="info" %}
Right-click the `token` input and mark it as a secret to mask it.
{% endhint %}

### `delete` (instance)

Removes the instance and its connection configuration. The database itself is not touched.

## Writing data

### `writePoint`

Writes a single data point to a specific bucket and measurement. This is the standard way to record a piece of data.

If you pass an object as data, the engine fans it out into native InfluxDB fields, allowing fast analytics on individual properties later. If a measurement historically used stringified JSON blobs, it automatically continues doing so to prevent breaking existing dashboards.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bucket</code></td><td>The name of the bucket to write to.</td><td>string</td></tr><tr><td><code>measurement</code></td><td>The name of the measurement (e.g. <code>temperature</code>, <code>production_line</code>).</td><td>string</td></tr><tr><td><code>data</code></td><td>The value to record: A number, string, boolean, or an object (e.g. <code>{ temp: 45, status: "ok" }</code>).</td><td>any</td></tr><tr><td><code>tags</code></td><td>Optional key-value pairs to tag the data. Advanced: Force the object storage behavior by adding <code>objectStorageType: 'fields'</code> or <code>objectStorageType: 'json'</code>. This control flag is stripped before saving.</td><td>object</td></tr></tbody></table>

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

Returns `true` on success.

{% hint style="info" %}
#### Internal bucket names

When using the internal database, bucket names indicate retention: `F` (forever), `Y` (year), `M` (month), `W` (week), `D` (day), `H` (hour).
{% endhint %}

### `writePoints`

Writes multiple data points at once to a specific bucket and measurement. More efficient than calling `writePoint` in a loop.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="130">Type</th></tr></thead><tbody><tr><td><code>bucket</code></td><td>The name of the bucket.</td><td>string</td></tr><tr><td><code>measurement</code></td><td>The name of the measurement.</td><td>string</td></tr><tr><td><code>data</code></td><td>An array of values or objects to record.</td><td>array</td></tr><tr><td><code>tags</code></td><td>Optional tags. As an array, it must match the length of <code>data</code> (one tag object per point), otherwise the function throws an error. As a single object, it applies to all points.</td><td>object or array</td></tr></tbody></table>

#### Example

```yaml
# bucket
D
# measurement
vibration
# data
[0.5, 0.6, 0.4, 0.8]
```

#### Output

Returns `true` on success.

### `writeDownsampled`

Writes numeric data or multi-field objects to the high-frequency bucket (`H+`) specifically for automatic downsampling.

If you pass an object containing both numbers and strings (e.g. `{ speed: 120, status: "running" }`), the full object is kept in the raw `H+` bucket for debugging, but only the numeric fields are aggregated into the long-term historical buckets. Top-level strings and booleans in `data` cannot be downsampled and are dropped with a warning in the logs.

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

Returns `true` on success.

<details>

<summary>Understanding downsampling</summary>

The downsampling pipeline stores your data efficiently: You can write high-frequency data (like sensor readings every second) without running out of storage or slowing down dashboards when querying long time ranges.

#### The concept: Hot vs. cold data

Think of your data like news:

* Hot data (recent): You care about every detail. "What is the temperature right now? Did it spike 5 seconds ago?"
* Cold data (historical): You care about trends, not microseconds. "What was the average temperature last month?"

The system automatically moves data through buckets as it ages, reducing its resolution to save space while keeping the statistical accuracy you need.

#### 1. The pipeline structure

Data flows automatically through a series of stages. You only write to the start of the pipeline.

![](<../../../../.gitbook/assets/image (1).png>)

<table><thead><tr><th width="130">Bucket</th><th width="180">Resolution</th><th width="140">Retention</th><th>Used for</th></tr></thead><tbody><tr><td><code>H+</code></td><td>Raw (every point)</td><td>1 day</td><td>Real-time monitoring, debugging recent events.</td></tr><tr><td><code>D+</code></td><td>5 minutes</td><td>1 week</td><td>Zooming into last week's performance.</td></tr><tr><td><code>W+</code></td><td>1 hour</td><td>1 month</td><td>Weekly trends and patterns.</td></tr><tr><td><code>M+</code></td><td>1 day</td><td>1 year</td><td>Monthly analysis and seasonal trends.</td></tr><tr><td><code>Y+</code></td><td>1 week</td><td>Forever</td><td>Long-term historical archiving.</td></tr></tbody></table>

#### 2. How writing works

You do not choose a bucket. You send data and it lands in the raw (`H+`) bucket automatically. Behind the scenes, scheduled tasks process the data: For example, every 5 minutes a task takes the raw data from `H+`, calculates mean, min, max, and count, and saves a single summary point into `D+`.

#### 3. How reading works (smart stitching)

When you ask for data, you do not need to know which bucket it is in. Provide a time range and `readDownsampled` acts as a smart broker:

1. It looks at your requested `start` and `stop` times.
2. It selects the highest-resolution bucket available for that period.
3. If your request spans boundaries (e.g. "last 2 hours" to "last 2 weeks"), it stitches the data together seamlessly.

Example: If you ask for the last 2 days, the system might return the last 24 hours from the raw (`H+`) bucket (high detail) and the 24 hours before that from the 5-minute (`D+`) bucket (medium detail).

#### 4. Configuration examples

Scenario A: Real-time debugging. See exactly what happened in the last 15 minutes; the system pulls from the raw (`H+`) bucket.

```yaml
# (readDownsampled)
# options
start: "-15m"
tail: 100
```

Scenario B: Monthly reporting. Visualize the trend over the last 30 days; instead of millions of raw points, the system pulls from the hourly (`W+`) or daily (`M+`) buckets, making the query instant.

```yaml
# (readDownsampled)
# options
start: "-30d"
limit: 1000
```

Scenario C: The stitched view. Get the last 50 data points regardless of age; the system looks at the newest data first and automatically reaches back into older buckets if needed.

```yaml
# (readDownsampled)
# options
tail: 50
```

#### Aggregated fields

When data is downsampled, four key statistics are preserved for every window, so you never lose the context:

* `mean`: The average value (good for smooth lines).
* `max`: The highest value seen (good for detecting spikes).
* `min`: The lowest value seen.
* `count`: How many raw data points went into this period (good for understanding data density).

</details>

## Reading data

### `read`

Reads timeseries data from a specific bucket and measurement, with options for filtering by time, isolating fields, limiting results, and aggregating data.

If you query a measurement that contains multiple fields (e.g. an object) and do not specify a target field, the engine automatically pivots the data and reconstructs the original object for you.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="150">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bucket</code></td><td></td><td>The name of the bucket to query.</td><td>string</td></tr><tr><td><code>measurement</code></td><td></td><td>The name of the measurement.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>field</code></td><td>The specific field to isolate (e.g. <code>cycle_time</code>). If omitted, all fields are returned as an object.</td><td>string</td></tr><tr><td></td><td><code>start</code></td><td>The earliest time to include (e.g. <code>-12h</code>, <code>-7d</code>, <code>2025-01-01T00:00:00Z</code>). Default <code>-1y</code>.</td><td>string</td></tr><tr><td></td><td><code>stop</code></td><td>The latest time to include. Default <code>now()</code>.</td><td>string</td></tr><tr><td></td><td><code>limit</code></td><td>Limits the result to the first n data points.</td><td>integer</td></tr><tr><td></td><td><code>tail</code></td><td>Limits the result to the last n data points.</td><td>integer</td></tr><tr><td></td><td><code>every</code></td><td>Duration of time windows for aggregation (e.g. <code>15m</code>).</td><td>string</td></tr><tr><td></td><td><code>func</code></td><td>The aggregation function applied per window (e.g. <code>mean</code>, <code>sum</code>, <code>count</code>, <code>last</code>). Default <code>mean</code>.</td><td>string</td></tr><tr><td></td><td><code>tags</code></td><td>An object of tags to filter by.</td><td>object</td></tr><tr><td></td><td><code>difference</code></td><td>Set to <code>true</code> to calculate differences between readings, or <code>nonNegative</code> to additionally ignore counter resets safely. Default <code>false</code>.</td><td>boolean or string</td></tr><tr><td></td><td><code>fillPrevious</code></td><td>If <code>true</code>, carries the last known value forward into empty time windows.</td><td>boolean</td></tr><tr><td></td><td><code>cumulativeSum</code></td><td>If <code>true</code>, keeps a running total across the selected time range.</td><td>boolean</td></tr><tr><td></td><td><code>derivativeUnit</code></td><td>Calculates the rate of change per given unit (e.g. <code>1m</code> for per-minute rates).</td><td>string</td></tr></tbody></table>

<details>

<summary>Examples</summary>

#### 1. Smoothing noisy sensor data (averages)

An analog sensor sends data every second and the chart looks spiky. Group the data into time windows and calculate the mean to smooth the line. Task: Show a smooth trend of the extruder temperature over the last 12 hours.

```yaml
# measurement
extruder_temp
# options
start: -12h
every: 5m
func: mean
```

#### 2. Peak detection and shift highs

Find the maximum a value reached per reporting period. Task: Find the highest temperature the motor reached each day over the last 30 days.

```yaml
# measurement
motor_temperature
# options
start: -30d
every: 1d
func: max
```

#### 3. Counting incidents or machine faults

Your App logs an entry for every fault or failed inspection. Use `count` to chart how many occurred per time window. Task: Show quality inspection failures per hour for the current shift.

```yaml
# measurement
qa_failures
# options
start: -8h
every: 1h
func: count
```

#### 4. The resetting machine counter (pieces produced)

A PLC part counter resets to 0 at shift end or at its memory limit, ruining sums and averages. Use `difference: nonNegative` to calculate the pieces produced between readings while ignoring the impossible negative drop at reset. Task: Show the total pieces produced per hour over the last 24 hours.

```yaml
# measurement
packaging_line
# options
field: piece_counter
start: -24h
every: 1h
func: sum
difference: nonNegative
```

#### 5. Event-driven machine states (sparse data)

A machine only sends data when its state changes, leaving gaps in the timeline. Use `fillPrevious: true` to carry the last known state forward into empty windows. Task: Plot a continuous minute-by-minute state chart for the current 8-hour shift.

```yaml
# measurement
cnc_machine_1
# options
field: status_code
start: -8h
every: 1m
func: last
fillPrevious: true
```

#### 6. Cumulative running totals (energy or water usage)

A meter reports consumption every 15 minutes and you want the accumulated total building up throughout the shift. Use `cumulativeSum: true`. Task: Show the running total of energy consumed in the last 12 hours.

```yaml
# measurement
main_power_meter
# options
field: interval_kwh
start: -12h
every: 15m
func: sum
cumulativeSum: true
```

#### 7. Rate of change (derivatives)

You monitor the absolute volume of a tank but want to alarm when it drains too fast. Use `derivativeUnit` to convert absolute values into a rate. Task: Show the minute-by-minute drain rate of the chemical tank.

```yaml
# measurement
chemical_tank_A
# options
field: volume_liters
start: -1h
derivativeUnit: 1m
```

#### 8. Isolating metrics from multi-field payloads

You saved an entire object with `writePoint` (e.g. `{ temperature: 45, vibration: 1.2, speed: 1500 }`) and want to visualize one metric. Use the `field` option. Task: Show the maximum vibration recorded every 5 minutes.

```yaml
# measurement
robot_arm_2
# options
field: vibration
start: -24h
every: 5m
func: max
```

</details>

#### Output

An array of objects, each with a `date` (ISO timestamp) and a `value` (a single primitive or a reconstructed object):

```json
[
  { "date": "2025-10-27T10:00:00Z", "value": { "cycle_time": 4.2, "yield": 150 } },
  { "date": "2025-10-27T10:15:00Z", "value": { "cycle_time": 4.1, "yield": 152 } }
]
```

<details>

<summary>Understanding aggregation</summary>

Timeseries data often has thousands of individual points. To visualize it effectively, group the points into larger time windows and summarize them. Two parameters control this:

* `every`: The size of the time window (e.g. `1h`, `15m`, `1d`).
* `func`: The calculation applied to the points within each window.

#### Available functions

<table><thead><tr><th width="120">Function</th><th width="270">Description</th><th>Typical use case</th></tr></thead><tbody><tr><td><code>mean</code></td><td>Calculates the average value.</td><td>Smoothing noisy sensor data (e.g. average temperature per hour).</td></tr><tr><td><code>median</code></td><td>Finds the middle value.</td><td>Finding the typical value while ignoring extreme outliers.</td></tr><tr><td><code>min</code></td><td>Finds the lowest value.</td><td>Detecting the coldest temperature or lowest battery level.</td></tr><tr><td><code>max</code></td><td>Finds the highest value.</td><td>Detecting peak power usage or maximum pressure.</td></tr><tr><td><code>sum</code></td><td>Adds up all values.</td><td>Calculating total energy consumption or total volume flowed.</td></tr><tr><td><code>count</code></td><td>Counts the number of data points.</td><td>Counting machine cycles or error logs.</td></tr><tr><td><code>last</code></td><td>Takes the last value in the window.</td><td>The final state of a system at the end of each period.</td></tr><tr><td><code>first</code></td><td>Takes the first value in the window.</td><td>The starting state of a system at the beginning of each period.</td></tr></tbody></table>

#### Examples

Smoothing data (hourly average):

```yaml
# options
start: -24h
every: 1h
func: mean
```

Peak detection (daily maximum):

```yaml
# options
start: -30d
every: 1d
func: max
```

Usage totals (monthly sum):

```yaml
# options
start: -1y
every: 1mo
func: sum
```

Incident counting (15-minute intervals):

```yaml
# options
start: -12h
every: 15m
func: count
```

</details>

### `readDownsampled`

A smart query function that automatically stitches together data from the downsampling buckets: High-resolution data for recent timeframes, aggregated data for older ones. This provides an optimized view of long-term history without processing millions of raw points. See [understanding downsampling](timeseries-database.md#writedownsampled) for the pipeline details.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="110">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td></td><td>The name of the measurement.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>field</code></td><td>The specific field to extract. Default <code>value</code>.</td><td>string</td></tr><tr><td></td><td><code>aggFunc</code></td><td>The statistic returned as the main <code>value</code> (e.g. <code>mean</code>, <code>max</code>). Default <code>mean</code>.</td><td>string</td></tr><tr><td></td><td><code>start</code></td><td>Earliest time to include. Default <code>-1y</code>.</td><td>string</td></tr><tr><td></td><td><code>stop</code></td><td>Latest time to include. Default <code>now()</code>.</td><td>string</td></tr><tr><td></td><td><code>limit</code></td><td>Limits the result to the first n points.</td><td>integer</td></tr><tr><td></td><td><code>tail</code></td><td>Limits the result to the last n points.</td><td>integer</td></tr><tr><td></td><td><code>tags</code></td><td>Filter by tags.</td><td>object</td></tr></tbody></table>

#### Example

```yaml
# measurement
production_line
# options
start: -30d
field: cycle_time
aggFunc: max
tags: { line_id: "A1" }
```

#### Output

An array of objects containing the statistics (`mean`, `min`, `max`, `count`) per time point. The requested `aggFunc` is mapped to the main `value` key for easy chart binding:

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

Executes a raw Flux query string, for complex operations not covered by the helper functions.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>flux</code></td><td>The raw Flux query string.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# flux
from(bucket:"my-bucket") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "cpu")
```

#### Output

The raw result rows from InfluxDB.

## Live data and caching

### `subscribeToChange`

Registers a callback that fires whenever new data is written to a measurement via `writePoint`, `writePoints`, or `writeDownsampled`. Use it to react to incoming data without polling.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="170">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td></td><td>The name of the measurement to watch.</td><td>string</td></tr><tr><td><code>handler</code></td><td></td><td>Callback that receives a payload on every write, see below.</td><td>callback</td></tr><tr><td><code>options</code></td><td><code>samplingInterval</code></td><td>Guarantees the handler fires at most once every X milliseconds. Default <code>0</code> (every write).</td><td>integer</td></tr><tr><td></td><td><code>includeData</code></td><td>If <code>true</code>, includes the written <code>data</code> and <code>tags</code> in the payload. Default <code>false</code>.</td><td>boolean</td></tr></tbody></table>

#### Callback payload

By default the payload only contains the measurement name: `{ measurement }`. With `includeData: true`, it also contains a copy of the written data and tags: `{ measurement, data, tags }`.

#### Output

A unique handler ID string. Use it with `unsubscribeFromChange`. Registering the same callback twice returns the existing ID.

### `unsubscribeFromChange`

Unregisters change handlers. The behavior depends on the provided arguments:

* No arguments: Unsubscribes all handlers across all measurements.
* Only `measurement`: Unsubscribes all handlers of that measurement.
* Both: Unsubscribes the specific handler from that measurement.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td>Optional measurement to unsubscribe from.</td><td>string</td></tr><tr><td><code>handlerId</code></td><td>Optional specific handler ID returned by <code>subscribeToChange</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` if something was unsubscribed, otherwise `false`.

### `enableCaching`

Enables time-based caching of `read` and `readDownsampled` results for a specific measurement. Repeated identical queries within the TTL return the cached result instead of hitting the database, and identical queries running at the same time share one database request. Useful for dashboards where many widgets query the same data.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td>The name of the measurement to cache.</td><td>string</td></tr><tr><td><code>ttlMs</code></td><td>Time-to-live of cached results in milliseconds. Default <code>30000</code>.</td><td>integer</td></tr></tbody></table>

#### Output

Nothing.

### `disableCaching`

Disables caching for a specific measurement and instantly purges its cached results.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td>The name of the measurement.</td><td>string</td></tr></tbody></table>

#### Output

Nothing.

## Management

### `delete` (measurement data)

Deletes data from a measurement: The entire measurement, or only a time range.

{% hint style="danger" %}
This permanently deletes the data. The action cannot be undone.
{% endhint %}

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="100">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bucket</code></td><td></td><td>The name of the bucket.</td><td>string</td></tr><tr><td><code>measurement</code></td><td></td><td>The name of the measurement to delete.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>start</code></td><td>Start time. Default <code>1970-01-01</code>.</td><td>string</td></tr><tr><td></td><td><code>stop</code></td><td>End time. Default: Now.</td><td>string</td></tr></tbody></table>

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

Returns `true` on success.

### `flush`

Manually forces any buffered pending writes to be sent to the database immediately. Useful during testing or before shutting down a process, to ensure no data is lost.

#### Parameters

None.

#### Output

Nothing on success. Throws an error on failure.

### `reset`

Deletes all data from all measurements in all buckets connected to this instance. The buckets themselves are preserved, but empty.

{% hint style="danger" %}
This permanently deletes ALL data of the instance. The action cannot be undone.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` when the reset is complete.

### `listBuckets`

Retrieves all available buckets in the connected organization.

#### Parameters

None.

#### Output

An array of bucket objects:

```json
[
  { "name": "D", "id": "...", "retentionPeriod": 86400 },
  { "name": "F", "id": "...", "retentionPeriod": 0 }
]
```

### `listMeasurements`

Lists detailed information about all measurements across all buckets.

#### Parameters

<table><thead><tr><th width="110">Input</th><th width="170">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>includeStats</code></td><td>If <code>true</code>, calculates row count and cardinality. Can be slow.</td><td>boolean</td></tr><tr><td></td><td><code>statsRangeStart</code></td><td>Time range for the statistics. Default <code>-1y</code>.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# options
includeStats: true
```

#### Output

An array of measurement details:

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

Retrieves the schema (fields and tags) of a specific measurement in a specific bucket.

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

```json
{
  "fields": ["cycle_time", "yield"],
  "tags": ["line_id", "location"]
}
```

### `getMeasurementStats`

Calculates statistics (row count and cardinality) of a specific measurement over a given time range.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="100">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bucket</code></td><td></td><td>The bucket name.</td><td>string</td></tr><tr><td><code>measurement</code></td><td></td><td>The measurement name.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>start</code></td><td>Start time. Default <code>-30d</code>.</td><td>string</td></tr><tr><td></td><td><code>stop</code></td><td>End time. Default <code>now()</code>.</td><td>string</td></tr></tbody></table>

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

```json
{
  "rowCount": 150,
  "seriesCardinality": 2
}
```
