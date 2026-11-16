# Timeseries database

The timeseries database connector is a client for InfluxDB. It stores values whose recording time matters as much as the value itself: sensor readings, machine metrics, energy consumption. In the Functions explorer the class is **Timeseries Database**; the code class name is `Influx`.

Two things shape how it works:

* **Downsampling**: recent points are kept as they came, older ones are summarized into coarser buckets, so that a year of data stays small and a read over a long range stays quick.
* **Multi-field points**: write a whole object, such as `{ cycle_time: 4.2, yield: 150 }`, and each property becomes a field of its own. A read puts the object back together.

## Quick start: the internal instance

Every workspace has an InfluxDB of its own, the instance `internal-influx`. It is there from the start, with Heisenware's storage tiers in it. Pick a function from inside `internal-influx` and drag it onto the Flowboard.

<figure><img src="../../../.gitbook/assets/image (55).png" alt=""><figcaption></figcaption></figure>

{% hint style="info" %}
#### Direct data recording with the recorder

The quickest way to record data is the [recorder](../../../app-builder/flowboard/recorder.md). Click the `+` on any output or modifier and choose it. It writes every value into `internal-influx` by itself, with no further executor in the flow.
{% endhint %}

## Connecting an external database

To connect an InfluxDB of your own, use the [`create`](timeseries-database.md#create) function. Where you create the instance depends on where the server is:

* **Reachable over the internet**: create the instance on the Connectors agent, beside `internal-influx`.
* **Inside a private network**: install an [agent](../../../concepts/agents-and-where-code-runs.md) in that network first, and create the instance there.

{% hint style="info" %}
The functions for reading and writing are the same, whether you use `internal-influx` or a server of your own. Writing, however, needs Heisenware's storage tiers, see [A database of your own](timeseries-database.md#a-database-of-your-own).
{% endhint %}

## Downsampling pipeline

The downsampling pipeline lets you write high-frequency data, such as a sensor reading every second, without running out of storage or slowing down reads over long time ranges.

It rests on Heisenware's **storage tiers**, also called the ladder: a set of buckets, each keeping its points for a fixed time, and the InfluxDB tasks that summarize the points of one bucket into the next. `internal-influx` holds the tiers from the start. A database of your own gets them only when you ask for it, see [A database of your own](timeseries-database.md#a-database-of-your-own).

#### Hot and cold data

Data is worth different things at different ages:

* **Recent**: every point counts, for watching a machine now and for finding a short temperature spike afterwards.
* **Old**: the trend counts, not the single point: an average month, a yearly pattern.

Points move through the buckets as they age. Each stage keeps less detail and the statistics that matter: the mean, the minimum, the maximum and the number of points of each window.

#### Pipeline structure

Data flows automatically through a series of stages. Write data only to the start of the pipeline.

You never see the `+` buckets in the software. They are the internal stages of this pipeline. What you select instead, for example as the recording type of a [recorder](../../../app-builder/flowboard/recorder.md), is either a fixed retention (`H`, `D`, `W`, `M`, or `Y`, keeping raw data for 1 hour up to 1 year, matching the letter) or `DS` (downsampled), which feeds this pipeline for long-term storage without a fixed retention.

![](<../../../.gitbook/assets/image (1).png>)

<table><thead><tr><th width="102.66650390625">Bucket</th><th width="184.4444580078125">Resolution</th><th width="130.9261474609375">Retention</th><th>Typical use</th></tr></thead><tbody><tr><td><code>H+</code></td><td>Raw (every point)</td><td>1 day</td><td>Real-time monitoring, debugging recent events</td></tr><tr><td><code>D+</code></td><td>5 minutes</td><td>1 week</td><td>Zooming into last week's performance</td></tr><tr><td><code>W+</code></td><td>1 hour</td><td>1 week</td><td>Weekly trends and patterns</td></tr><tr><td><code>M+</code></td><td>1 day</td><td>1 month</td><td>Monthly analysis and seasonal trends</td></tr><tr><td><code>Y+</code></td><td>1 week</td><td>1 year</td><td>Yearly trends and seasonal patterns</td></tr><tr><td><code>F+</code></td><td>1 month</td><td>Forever</td><td>Long-term historical archiving</td></tr></tbody></table>

#### How writing works

Write operations send data to the raw (`H+`) bucket automatically. Background tasks then process the data. For example, every 5 minutes a task extracts raw data from `H+`, calculates the mean, minimum, maximum, and count, and saves a summary point to the `D+` bucket.

#### How reading works

You do not need to specify a bucket when reading data. Provide a time range and `readDownsampled` routes the query:

1. It evaluates the requested `start` and `stop` times.
2. It selects the highest-resolution bucket available for that period.
3. It stitches the data together if the request spans retention boundaries.

For example, if you query the last 2 days, the function returns the last 24 hours from the raw (`H+`) bucket and the preceding 24 hours from the 5-minute (`D+`) bucket.

#### Configuration examples

*   **Real-time debugging**: Pulls from the raw (`H+`) bucket to view the last 15 minutes.

    ```yaml
    # (readDownsampled)
    # options
    start: "-15m"
    tail: 100
    ```
*   **Monthly reporting**: Pulls from the hourly (`W+`) or daily (`M+`) buckets to visualize trends over the last 30 days.

    ```yaml
    # (readDownsampled)
    # options
    start: "-30d"
    limit: 1000
    ```
*   **Stitched view**: Returns the last 50 data points regardless of age, automatically querying older buckets if needed.

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

#### A database of your own

Connecting to an InfluxDB of your own writes nothing into it. It is read as it is, with its own buckets and measurements, so a database that belongs to someone else stays untouched. Reading, `query`, `describe` and `readRows` work at once.

Writing needs the tiers, because there is nowhere else to write: `writePoint`, `writePoints`, `writeDownsampled`, `updatePoint`, `generateFakeInfluxData`, `importData` and `reset` fail with a message saying so. [`adoptLadder`](timeseries-database.md#adoptladder) creates them, or pass `ladder: true` when you create the instance.

{% hint style="warning" %}
Creating the tiers writes buckets and tasks into a database that may belong to someone else, and nothing takes that back. It is your decision to make, not the platform's.
{% endhint %}

## Connection

### `create`

Creates an InfluxDB client instance.

An InfluxDB on `https` with a self-made or company certificate is refused until it is trusted. Trust it once for the whole workspace with the [Trusted certificates](../connectors/trusted-certificates.md) function `trustServer`. The next call accepts it.

{% hint style="info" %}
Skip this step for `internal-influx`. It is already instantiated for you.
{% endhint %}

#### Parameters

<table><thead><tr><th width="114.8148193359375">Input</th><th width="198.703857421875">Key</th><th width="292.66650390625">Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>url</code></td><td></td><td>The URL of the InfluxDB instance (such as <code>http://localhost:8086</code>).</td><td>string</td></tr><tr><td><code>token</code></td><td></td><td>The authentication token with permissions for the target organization and buckets.</td><td>string</td></tr><tr><td><code>org</code></td><td></td><td>The name of the organization in InfluxDB.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>ladder</code></td><td>Creates Heisenware's <a href="timeseries-database.md#a-database-of-your-own">storage tiers</a> in the database where they are missing, so that it can be written to. Default <code>false</code>: nothing is created and the database is read as it is.</td><td>boolean</td></tr><tr><td></td><td><code>flushInterval</code></td><td>The interval in milliseconds to flush buffered writes. Default 5000.</td><td>integer</td></tr><tr><td></td><td><code>batchSize</code></td><td>The number of points to buffer before writing. Default 1000.</td><td>integer</td></tr><tr><td></td><td><code>buckets</code></td><td>Overrides the default buckets: the bucket name to how long it keeps points, in milliseconds (<code>0</code> keeps them forever).</td><td>object</td></tr><tr><td></td><td><code>downsamplingPipeline</code></td><td>Overrides the default downsampling stages.</td><td>array</td></tr><tr><td></td><td><code>tls</code></td><td>TLS settings for an <code>https</code> URL, on top of what the workspace trusts: <code>rejectUnauthorized</code> (false accepts any certificate), <code>ca</code>, <code>cert</code>, <code>key</code>, <code>passphrase</code>.</td><td>object</td></tr></tbody></table>

{% hint style="info" %}
Right-click the `token` input and mark it as a secret to mask it.
{% endhint %}

#### Output

Returns the name of the created instance.

### Removing the instance

The instance's own `delete` removes the instance and its connection configuration. It is not the [`delete`](timeseries-database.md#delete) below, which deletes measurement data.

{% hint style="danger" %}
#### Irreversible action

Deleting an instance removes its configuration. To communicate with the database again, you must create a new instance.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` upon removal.

## Writing data

### `writePoint`

Writes a single data point to a specific bucket and measurement.

When you pass an object as data, the engine fans it out into native InfluxDB fields, allowing fast analytics on individual properties later. If a measurement historically used stringified JSON, the database continues using it to preserve existing dashboards.

#### Parameters

<table><thead><tr><th width="123.14794921875">Input</th><th width="506.4072265625">Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bucket</code></td><td>The name of the bucket to write to.</td><td>string</td></tr><tr><td><code>measurement</code></td><td>The name of the measurement (such as <code>temperature</code> or <code>production_line</code>).</td><td>string</td></tr><tr><td><code>data</code></td><td>The value to record. Accepts a number, string, boolean, or object (such as <code>{ temp: 45, status: "ok" }</code>).</td><td>any</td></tr><tr><td><code>tags</code></td><td>Optional key-value pairs to tag the data. To force the object storage behavior, add <code>objectStorageType: 'fields'</code> or <code>objectStorageType: 'json'</code>. The database strips this control flag before saving.</td><td>object</td></tr><tr><td><code>options</code></td><td>Optional. <code>timestamp</code> stores the point at that time instead of the write time: a date string, epoch milliseconds, or a Date. Use it for events that carry their own time, such as a buffered edge device replaying after a connection loss.</td><td>object</td></tr></tbody></table>

<div align="left"><figure><img src="../../../.gitbook/assets/image (4).png" alt="" width="375"><figcaption><p>Measurement vs. tags vs. fields</p></figcaption></figure></div>

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
# options
timestamp: 2026-09-17T10:00:00.250Z
```

#### Output

Returns `true` when the point is accepted for buffered writing, including when the data type is invalid (the connector then skips the write and logs a warning). Write failures surface in the logs, not as errors.

{% hint style="info" %}
#### Internal bucket names

When using the internal database, bucket names indicate retention: `F` (forever), `Y` (year), `M` (month), `W` (week), `D` (day), `H` (hour).
{% endhint %}

### `writePoints`

Writes multiple data points to a specific bucket and measurement. This is more efficient than calling `writePoint` in a loop.

Data that arrives in batches with its own timing, such as a machine sending 10 ms samples in 100 ms MQTT packets, keeps that timing when you pass one timestamp per point in `options.timestamps`. Without it, every point is stamped at the write time.

#### Parameters

<table><thead><tr><th width="128.7037353515625">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bucket</code></td><td>The name of the bucket.</td><td>string</td></tr><tr><td><code>measurement</code></td><td>The name of the measurement.</td><td>string</td></tr><tr><td><code>data</code></td><td>An array of values or objects to record.</td><td>array</td></tr><tr><td><code>tags</code></td><td>Optional tags. If specified as an array, the length must match the <code>data</code> array (one tag object per point). If specified as a single object, the tags apply to all points.</td><td>any</td></tr><tr><td><code>options</code></td><td>Optional. <code>timestamps</code> is an array with one entry per point (same length as <code>data</code>): a date string, epoch milliseconds, or a Date each. A <code>null</code> entry stamps that point at the write time.</td><td>object</td></tr></tbody></table>

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

#### Example with timestamps

A 100 ms packet of 10 ms samples, stored with the time each sample was measured:

```yaml
# bucket
W
# measurement
highSpeed
# data
- { pressure: 101.2, temperature: 210.1 }
- { pressure: 101.4, temperature: 210.3 }
- { pressure: 101.3, temperature: 210.6 }
# options
timestamps:
  - 2026-09-17T10:00:00.000Z
  - 2026-09-17T10:00:00.010Z
  - 2026-09-17T10:00:00.020Z
```

Reading the measurement back returns the samples 10 ms apart, in their original order.

#### Output

Returns `true` when the points are accepted for buffered writing. Throws an error if `data` is not an array, the length of a tags or timestamps array does not match the data array, or a timestamp cannot be parsed. Write failures surface in the logs, not as errors.

### `writeDownsampled`

Writes numeric data or multi-field objects to the high-frequency bucket (`H+`) for automatic downsampling.

When you pass an object containing both numbers and strings (such as `{ speed: 120, status: "running" }`), the system retains the full object in the raw `H+` bucket for debugging, but only aggregates numeric fields into long-term historical buckets. The pipeline drops non-numeric fields (such as strings and booleans) during downsampling and logs a warning.

#### Parameters

<table><thead><tr><th width="139.8148193359375">Input</th><th width="489.4813232421875">Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td>The name of the measurement.</td><td>string</td></tr><tr><td><code>data</code></td><td>The numeric value, object, or array to store.</td><td>any</td></tr><tr><td><code>tags</code></td><td>Optional tags to associate with the data.</td><td>object</td></tr><tr><td><code>options</code></td><td>Optional. <code>timestamps</code> works as in <code>writePoints</code>: one entry per element of <code>data</code>. The downsampling pipeline aggregates the points at their own time.</td><td>object</td></tr></tbody></table>

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

Returns `true` when the data is accepted for buffered writing, including when no numeric fields remain after filtering (the connector then logs a warning).

## Reading data

### `read`

Reads timeseries data from a specific bucket and measurement, with options for filtering by time, isolating fields, limiting results, and aggregating data.

When you query a measurement containing multiple fields and do not specify a target field, the engine automatically pivots the data and reconstructs the original object.

#### Parameters

<table><thead><tr><th width="133.33349609375">Input</th><th width="148.7037353515625">Key</th><th width="377.036865234375">Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bucket</code></td><td></td><td>The name of the bucket to query.</td><td>string</td></tr><tr><td><code>measurement</code></td><td></td><td>The name of the measurement.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>field</code></td><td>The specific field to isolate (such as <code>cycle_time</code>). If omitted, the function returns all fields as an object.</td><td>string</td></tr><tr><td></td><td><code>start</code></td><td>The earliest time to include (such as <code>-12h</code>, <code>-7d</code>, or <code>2025-01-01T00:00:00Z</code>). Default <code>-1y</code>.</td><td>string</td></tr><tr><td></td><td><code>stop</code></td><td>The latest time to include. Default <code>now()</code>.</td><td>string</td></tr><tr><td></td><td><code>limit</code></td><td>Limits the result to the first n data points.</td><td>integer</td></tr><tr><td></td><td><code>offset</code></td><td>Skips the first n data points after sorting. Needs <code>limit</code>.</td><td>integer</td></tr><tr><td></td><td><code>tail</code></td><td>Limits the result to the last n data points.</td><td>integer</td></tr><tr><td></td><td><code>sortDesc</code></td><td>Sorts by time descending before <code>limit</code> and <code>offset</code> when set to <code>true</code>. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>every</code></td><td>The duration of time windows for aggregation (such as <code>15m</code>).</td><td>string</td></tr><tr><td></td><td><code>func</code></td><td>The aggregation function applied per window (such as <code>mean</code>, <code>sum</code>, <code>count</code>, or <code>last</code>). Default <code>mean</code>.</td><td>string</td></tr><tr><td></td><td><code>tags</code></td><td>Reads only the series carrying these tag values. See <a href="timeseries-database.md#tags-and-series">Tags and series</a>.</td><td>object</td></tr><tr><td></td><td><code>withTags</code></td><td>Keeps the series apart when set to <code>true</code>: every row then carries the tags of its point, and a window has a row per series. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>difference</code></td><td>Calculates differences between readings when set to <code>true</code>. Set to <code>nonNegative</code> to ignore counter resets. Default <code>false</code>.</td><td>any</td></tr><tr><td></td><td><code>fillPrevious</code></td><td>Carries the last known value forward into empty time windows when set to <code>true</code>. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>cumulativeSum</code></td><td>Keeps a running total across the selected time range when set to <code>true</code>. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>derivativeUnit</code></td><td>Calculates the rate of change per given unit (such as <code>1m</code> for per-minute rates).</td><td>string</td></tr><tr><td></td><td><code>timeout</code></td><td>Milliseconds after which the query is cancelled and the call fails.</td><td>integer</td></tr></tbody></table>

#### Tags and series

A measurement whose points carry tags holds one **series** per combination of tag values. Unless you say otherwise, the series are read as one: a row says nothing about the tags its point carried, and a window in which several series hold a value answers one row, joined by the function you asked for.

* **Summed**: `sum`, `count` and `integral` answer the sum over the series.
* **Picked**: `min` and `max` answer the smallest and the largest value, `first` and `last` the point first and last in time, `median` the median.
* **Averaged**: `mean`, `stddev`, `spread` and `skew` answer the mean of the series' values, which is a mean of means, not the mean of every point.
* **Not joined**: `mode`, `distinct` and `unique`. Read them from one series, with `tags`, or keep the series apart with `withTags`.

`tags` narrows the read to the series carrying the values you name. `withTags: true` keeps the series apart: every row then tells its tags, a window has one row per series, and `limit`, `offset`, `tail` and the sorting apply to all rows together.

```yaml
# (read) the last value of every 10 minutes, per series
# options
start: -1d
every: 10m
func: last
withTags: true
```

answers one row per series and window:

```json
[
  { "date": "2026-11-12T21:00:00Z", "value": { "bag": 8709 }, "tags": { "line": "A" } },
  { "date": "2026-11-12T21:00:00Z", "value": { "bag": 5348 }, "tags": { "line": "B" } }
]
```

<details>

<summary>Understanding aggregation</summary>

Timeseries databases often contain thousands of individual points. To visualize this data effectively, group the points into larger time windows and summarize them. Two parameters control this:

* `every`: The size of the time window (such as `1h`, `15m`, or `1d`).
* `func`: The calculation applied to the points within each window.

#### Available functions

| Function | Description                          | Typical use case                                                    |
| -------- | ------------------------------------ | ------------------------------------------------------------------- |
| `mean`   | Calculates the average value.        | Smoothing noisy sensor data (such as average temperature per hour). |
| `median` | Finds the middle value.              | Finding the typical value while ignoring extreme outliers.          |
| `min`    | Finds the lowest value.              | Detecting the coldest temperature or lowest battery level.          |
| `max`    | Finds the highest value.             | Detecting peak power usage or maximum pressure.                     |
| `sum`    | Adds up all values.                  | Calculating total energy consumption or total volume flowed.        |
| `count`  | Counts the number of data points.    | Counting machine cycles or error logs.                              |
| `last`   | Takes the last value in the window.  | The final state of a system at the end of each period.              |
| `first`  | Takes the first value in the window. | The starting state of a system at the beginning of each period.     |

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

<table><thead><tr><th width="132.4072265625">Input</th><th width="93.1480712890625">Key</th><th width="400.70361328125">Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td></td><td>The name of the measurement.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>field</code></td><td>The specific field to extract. Default <code>value</code>.</td><td>string</td></tr><tr><td></td><td><code>aggFunc</code></td><td>The statistic returned as the main value (such as <code>mean</code> or <code>max</code>). Default <code>mean</code>.</td><td>string</td></tr><tr><td></td><td><code>start</code></td><td>The earliest time to include. Default <code>-1y</code>.</td><td>string</td></tr><tr><td></td><td><code>stop</code></td><td>The latest time to include. Default <code>now()</code>.</td><td>string</td></tr><tr><td></td><td><code>limit</code></td><td>Limits the result to the first n points.</td><td>integer</td></tr><tr><td></td><td><code>tail</code></td><td>Limits the result to the last n points.</td><td>integer</td></tr><tr><td></td><td><code>tags</code></td><td>Filters by tags.</td><td>object</td></tr><tr><td></td><td><code>withTags</code></td><td>Keeps the series apart when set to <code>true</code>: every row then carries the tags of its point, and <code>limit</code> and <code>tail</code> apply to all rows together. Default false. See <a href="timeseries-database.md#tags-and-series">Tags and series</a>.</td><td>boolean</td></tr></tbody></table>

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

Executes a raw Flux query string for complex database operations. It works on a database read as it is, without Heisenware's storage tiers, too.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>flux</code></td><td></td><td>The raw Flux query string.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>limit</code></td><td>Stops reading after this many rows. A result of exactly this many rows may have been cut.</td><td>integer</td></tr><tr><td></td><td><code>timeout</code></td><td>Milliseconds after which the query is cancelled and the call fails.</td><td>integer</td></tr></tbody></table>

#### Example

```yaml
# flux
from(bucket:"my-bucket") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "cpu")
```

#### Output

Returns the raw query result rows from InfluxDB.

### `readRows`

Reads a measurement as rows, for analysing it: the columns once (the time, the tags, the fields) and each row as an array in their order. This is what the assistant's data tools read a time series with, and it is the right function when a flow has to answer a question about a measurement rather than draw it.

Where it reads: the bucket you name, otherwise, for a measurement that follows the storage tiers, each stretch of the range from the finest resolution that still keeps it, otherwise the one plain bucket the measurement sits in. The answer's `buckets` say which bucket answered for which stretch.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td></td><td>The measurement to read.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>start</code></td><td>The earliest time to read. Default <code>-1d</code>.</td><td>string</td></tr><tr><td></td><td><code>stop</code></td><td>The time to read up to. Default <code>now()</code>.</td><td>string</td></tr><tr><td></td><td><code>fields</code></td><td>The fields to read. All of them without it. A field the measurement does not have is refused, with the nearest names.</td><td>array</td></tr><tr><td></td><td><code>tags</code></td><td>Only the points with these tag values.</td><td>object</td></tr><tr><td></td><td><code>every</code></td><td>Aggregates into windows of this length, such as <code>15m</code>. Windows are cut in UTC whatever <code>timeZone</code> says, and written at their end.</td><td>string</td></tr><tr><td></td><td><code>func</code></td><td>The aggregate of a window. Default <code>mean</code>. Over a downsampled stretch it works on the stored values, not on the raw points: a count of points is <code>aggFunc: count</code> with <code>func: sum</code>.</td><td>string</td></tr><tr><td></td><td><code>aggFunc</code></td><td>What a downsampled stretch is read as: the stored <code>mean</code>, <code>min</code>, <code>max</code> or <code>count</code> of each window. Default <code>mean</code>.</td><td>string</td></tr><tr><td></td><td><code>bucket</code></td><td>The one bucket to read, as <code>describe</code> lists them.</td><td>string</td></tr><tr><td></td><td><code>maxBytes</code></td><td>The size the rows of the answer may take. Default 1048576 (1 MB), at most 16777216 (16 MB).</td><td>integer</td></tr><tr><td></td><td><code>timeout</code></td><td>Milliseconds the whole read may take. Default 30000, at most 300000.</td><td>integer</td></tr><tr><td></td><td><code>timeZone</code></td><td>The time zone times are written in, such as <code>Europe/Berlin</code>. Default <code>UTC</code>.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# measurement
press
# options
start: -8h
fields: [temperature]
tags: { machine: A }
every: 1h
func: max
timeZone: Europe/Berlin
```

#### Output

Returns `{ columns, rows, rowsTotal, cut, buckets, ms, timeZone }`. The answer stops at `maxBytes`: then `cut` is `true`, `rowsTotal` holds the true number of rows, and `summary` sums up each column over all of them. Times are instants with their offset; a field of JSON objects comes parsed.

```json
{
  "columns": ["time", "machine", "temperature"],
  "rows": [
    ["2026-11-11T08:00:00+01:00", "A", 71.2],
    ["2026-11-11T09:00:00+01:00", "A", 73.9]
  ],
  "rowsTotal": 8,
  "cut": false,
  "buckets": [{ "bucket": "H+", "resolution": "raw" }]
}
```

### `describe`

Describes the time series for whoever is about to read them, in two levels, so that a large database does not come at once.

* **Without a measurement**: how series are kept here, each resolution of the ladder with how long it is kept, and every measurement, either `downsampled` or with the plain buckets it sits in.
* **With a measurement**: its fields with their types, its tags with their values where a tag has at most 20, and for each bucket it sits in the resolution, how long points are kept, and its first and last point.

A database read as it is, without Heisenware's storage tiers, answers `readOnly: true` and its own buckets in place of the ladder.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>measurement</code></td><td>The measurement to describe. Without it the measurements are listed.</td><td>string</td></tr><tr><td></td><td><code>timeout</code></td><td>Milliseconds the whole description may take. Default 30000, at most 300000.</td><td>integer</td></tr><tr><td></td><td><code>timeZone</code></td><td>The time zone instants are written in. Default <code>UTC</code>.</td><td>string</td></tr></tbody></table>

#### Output

Without a measurement, `{ downsampling, measurements, ms }`. With one, `{ measurement, fields, tags, stored, timeZone, ms }`, plus `format` when the values are JSON objects in one field. What did not finish within the time limit is named in `notRead`.

## Live data and caching

### `subscribeToChange`

Registers a callback executed whenever new data is written to a measurement.

#### Parameters

<table><thead><tr><th width="128.7037353515625">Input</th><th width="162.592529296875">Key</th><th width="359.7037353515625">Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td></td><td>The name of the measurement to watch.</td><td>string</td></tr><tr><td><code>handler</code></td><td></td><td>The callback evaluated on every write. Receives an object containing the measurement name, plus the written data and tags when <code>includeData</code> is enabled.</td><td>callback</td></tr><tr><td><code>options</code></td><td><code>samplingInterval</code></td><td>Guarantees the handler fires at most once every X milliseconds. Default 0.</td><td>integer</td></tr><tr><td></td><td><code>includeData</code></td><td>Includes the written data and tags in the payload when set to <code>true</code>. Default false.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns a unique handler id once the executor is listening. The written data arrives on the event outputs, not on the return. Keep the id to end this one subscription later with [`unsubscribeFromChange`](timeseries-database.md#unsubscribefromchange), or choose **Stop listening** on the executor's event input. See [Backend events](../../../concepts/backend-events.md).

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

Unregisters change handlers. Call it without parameters to remove all handlers across all measurements.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td>An optional measurement to unsubscribe from.</td><td>string</td></tr><tr><td><code>handlerId</code></td><td>An optional specific handler ID returned by <code>subscribeToChange</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` if the listener is unsubscribed, or `false` if it is not found.

### `enableCaching`

Enables time-based caching of `read` and `readDownsampled` results for a specific measurement. Repeated identical queries within the TTL return the cached result instead of querying the database. Concurrent identical queries share a single database request.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td>The name of the measurement to cache.</td><td>string</td></tr><tr><td><code>ttlMs</code></td><td>The time-to-live of cached results in milliseconds. Default 30000.</td><td>integer</td></tr></tbody></table>

#### Output

Returns nothing.

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

Returns nothing.

## Database management

### `delete`

Deletes data from a measurement over a given time range. It is not [removing the instance](timeseries-database.md#removing-the-instance), which the instance's own `delete` does.

{% hint style="danger" %}
#### Irreversible action

This permanently deletes the measurement data. You cannot undo this action.
{% endhint %}

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="94.0738525390625">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bucket</code></td><td></td><td>The name of the bucket.</td><td>string</td></tr><tr><td><code>measurement</code></td><td></td><td>The name of the measurement to delete.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>start</code></td><td>The start time. Default <code>1970-01-01T00:00:00Z</code>.</td><td>string</td></tr><tr><td></td><td><code>stop</code></td><td>The end time. Default is the current time.</td><td>string</td></tr><tr><td></td><td><code>tags</code></td><td>Deletes only the points carrying these tag values.</td><td>object</td></tr></tbody></table>

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

### `deletePoint`

Deletes one data point, named by its timestamp and, where several series carry that time, by its tags.

{% hint style="danger" %}
#### Irreversible action

This permanently deletes the point. You cannot undo this action.
{% endhint %}

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bucket</code></td><td></td><td>The name of the bucket.</td><td>string</td></tr><tr><td><code>measurement</code></td><td></td><td>The name of the measurement.</td><td>string</td></tr><tr><td><code>point</code></td><td><code>date</code></td><td>The point's timestamp, as an ISO string.</td><td>string</td></tr><tr><td></td><td><code>tags</code></td><td>The tags identifying the point.</td><td>object</td></tr></tbody></table>

#### Output

Returns `true` when the deletion succeeds.

### `updatePoint`

Rewrites one data point: the original is deleted and the new data written at the same timestamp. A point has no identity of its own in a time series, so there is no update in place.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bucket</code></td><td></td><td>The name of the bucket.</td><td>string</td></tr><tr><td><code>measurement</code></td><td></td><td>The name of the measurement.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>date</code></td><td>The original point's timestamp.</td><td>string</td></tr><tr><td></td><td><code>tags</code></td><td>The tags identifying the original point.</td><td>object</td></tr><tr><td></td><td><code>data</code></td><td>The new field data.</td><td>any</td></tr><tr><td></td><td><code>newTags</code></td><td>The tags of the rewritten point.</td><td>object</td></tr></tbody></table>

#### Output

Returns `true` on success.

### `flush`

Manually forces buffered pending writes to send to the database immediately. Use this during testing or before shutting down a process to prevent data loss.

#### Parameters

None.

#### Output

Returns nothing. Throws an error if flushing fails.

### `reset`

Deletes all data from all measurements in all buckets. The buckets remain intact but empty.

{% hint style="danger" %}
#### Irreversible action

This permanently deletes all data associated with the instance. You cannot undo this action.
{% endhint %}

#### Parameters

None.

#### Output

Returns `true` when the reset succeeds.

### `adoptLadder`

Creates Heisenware's [storage tiers](timeseries-database.md#a-database-of-your-own) in this database: the buckets, each with how long it keeps points, and the tasks that summarize one into the next. From then on the database is written and read through them, on every connection. What it held before stays as it is.

{% hint style="warning" %}
This writes into a database that may belong to someone else, and nothing takes it back. `internal-influx` holds the tiers already.
{% endhint %}

#### Parameters

None.

#### Output

Returns `{ ladder, created }`: that the tiers are there, and the buckets this call created.

```json
{ "ladder": true, "created": ["H", "D", "H+", "D+"] }
```

### `generateFakeInfluxData`

Writes fake sensor readings (a temperature and a humidity) into a measurement, as if an App had been recording them with a [recorder](../../../app-builder/flowboard/recorder.md) for a while already. Use it to have something to read and chart before the real data arrives. A `source: fake` tag tells the points apart.

The points are written the way the recorder writes them, so the choice mirrors the recorder's recording type: a raw policy (`H`, `D`, `W`, `M`, `Y`) fills that one bucket at the recording interval, as far back as its retention allows; `DS` fills the whole downsampling pipeline at once, so that `readDownsampled` answers immediately.

Running it again replaces what it wrote before: the measurement's data is deleted from the target buckets first.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurement</code></td><td></td><td>The measurement to write into, such as <code>office</code>.</td><td>string</td></tr><tr><td><code>config</code></td><td><code>policy</code></td><td>The recorder policy: <code>H</code>, <code>D</code>, <code>W</code>, <code>M</code>, <code>Y</code> or <code>DS</code>. Default <code>DS</code>.</td><td>string</td></tr><tr><td></td><td><code>intervalMs</code></td><td>How often the simulated flow records. Default 10000.</td><td>integer</td></tr><tr><td></td><td><code>historyMs</code></td><td>How long the simulated App has been recording. Default one year.</td><td>integer</td></tr></tbody></table>

#### Output

Returns how many points went where and the time range they cover: `{ written, from, to, policy, bucketsWritten, countsPerBucket }`.

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

<table><thead><tr><th width="112.963134765625">Input</th><th width="161.6666259765625">Key</th><th width="391.5185546875">Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>includeStats</code></td><td>Calculates row count and cardinality when set to <code>true</code>. This operation can be slow. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>statsRangeStart</code></td><td>The start of the time range for calculations. Default <code>-1y</code>.</td><td>string</td></tr></tbody></table>

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

<table><thead><tr><th width="150">Input</th><th width="99.629638671875">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>bucket</code></td><td></td><td>The bucket name.</td><td>string</td></tr><tr><td><code>measurement</code></td><td></td><td>The measurement name.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>start</code></td><td>The start time. Default <code>-30d</code>.</td><td>string</td></tr><tr><td></td><td><code>stop</code></td><td>The end time. Default <code>now()</code>.</td><td>string</td></tr></tbody></table>

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

## Export and import

An export writes every point as it stands, with its tags, into a gzipped archive of InfluxDB line protocol files, one per bucket, named `<name>.hwd` under `/shared/data-backups`. The rows are written as the query answers them, so an export of any size holds no more than one row in memory. The Database editor's **Export** and **Import** at the head of the Model tab do the same for the relational database.

### `exportData`

Exports all time-series data of the database: every measurement, every point, whatever its tags.

#### Parameters

None.

#### Output

Returns the name of the created `.hwd` archive, without its path.

### `exportMeasurementData`

Exports all time-series data of one measurement.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>measurementName</code></td><td>The name of the measurement to export.</td><td>string</td></tr></tbody></table>

#### Output

Returns the name of the created `.hwd` archive, without its path.

### `importData`

Imports an archive an export wrote: every point as the archive holds it, its tags unchanged. The points are added to what the database already holds; nothing is cleared first.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>fileName</code></td><td>The name of the archive in <code>/shared/data-backups</code>, a plain name without a path.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` when the import completes.
