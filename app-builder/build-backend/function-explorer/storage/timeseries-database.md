# Timeseries Database

{% hint style="info" %}
This article already reflects v91 which is not yet released to the public. Some features may not be existing with your current version.
{% endhint %}

The `Timeseries Database` class provides a specialized client for interacting with InfluxDB. It is designed for high-frequency data where the time of the recording is just as important as the value itself—such as sensor readings (IoT), machine performance metrics, or energy consumption.

{% hint style="success" %}
**Key feature: Intelligent downsampling & Native Multi-Fields**

A standout feature of this class is its built-in support for downsampling. This allows you to manage data storage efficiently by keeping high-resolution raw data for recent events while automatically aggregating older data into lower-resolution buckets.

Additionally, the engine natively supports multi-field telemetry. You can log entire objects (e.g., `{ cycle_time: 4.2, yield: 150 }`), and the database will automatically fan them out into highly optimized, individually queryable fields, reconstructing them for you on the fly when you read them back.
{% endhint %}

### Quick start: The internal instance

Heisenware provides a pre-initialized InfluxDB instance called `internal-influx`. It is globally available and ready for use. You do not need to call a "create" function; simply select `internal-influx` in your function's instance field to start logging time-series data immediately.

{% hint style="info" %}
#### **Direct data recording with the recorder**

For the fastest way to log data, you can use the [Recorder](../../recorder.md) extension. Simply click the `+` icon on any Function's Output or Modifier and select the Recorder. By default, it is configured to log data directly into the `internal-influx` instance on the fly, without needing extra function blocks in your flow.
{% endhint %}

## Connecting an external database

To connect to an external InfluxDB instance, use the `create` function. As with all Heisenware integrations, consider your location:

* Cloud connection: Connect directly if your InfluxDB server is accessible via the internet.
* Local connection (via Agent): If your InfluxDB is hosted on a private network, deploy an [Edge Agent](https://docs.heisenware.com/app-builder/build-backend/functions-library/agents) in that network and create your instance within that agent.

{% hint style="info" %}
One set of functions: Whether you use the managed `internal-influx` or a custom connection via an Agent, the functions for writing and querying data remain identical.
{% endhint %}

## Constructor and Member Functions

### create

Creates an instance of the InfluxDB client, configuring it to connect to a specific database URL with the necessary credentials.

{% hint style="success" %}
Skip this step for the `internal-influx`. It is already instantiated for you.
{% endhint %}

Parameters

* `url`: The URL of your InfluxDB instance (e.g., `http://localhost:8086`).
* `token`: The authentication token with the required permissions for your organization and buckets.
* `org`: The name of the organization in InfluxDB.

### writePoint

Writes a single data point to a specific bucket and **measurement**. This is the standard way to record a piece of data.

If you pass a JavaScript object as data, the engine intelligently fans it out into native InfluxDB **fields**, allowing you to run fast analytics on individual properties later. _(Note: If a measurement historically used stringified JSON blobs, it will automatically continue doing so to prevent breaking existing dashboards)._

Parameters

* `bucket`: The name of the bucket to write to.
* `measurement`: The name of the measurement (e.g., "temperature", "production\_line").
* `data`: The value to record. Can be a number, string, boolean, or an object (e.g., `{ temp: 45, status: "ok" }`).
* `tags`: An optional object of key-value pairs to tag the data.
  * _Advanced Control:_ You can force the object storage behavior by passing `objectStorageType: 'fields'` or `objectStorageType: 'json'` in the tags. This control flag is intercepted and stripped before saving to the database.

<div align="left"><figure><img src="../../../../.gitbook/assets/image (4).png" alt="" width="375"><figcaption><p>Measurement vs. Tags vs. Fields</p></figcaption></figure></div>

Example

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

Output

Returns `true` on success.

### writePoints

Writes multiple data points at once to a specific bucket and measurement. This is more efficient than calling `writePoint` multiple times in a loop.

Parameters

* `bucket`: The name of the bucket.
* `measurement`: The name of the measurement.
* `data`: An array of values or objects to record.
* `tags`: Optional tags. If provided as an array, it must match the length of the `data` array (one tag object per data point). If provided as a single object, it applies to all points.

Example

```yaml
# bucket
D
# measurement
vibration
# data
[0.5, 0.6, 0.4, 0.8]
```

Output

Returns `true` on success.

### writeDownsampled

Writes numeric data or multi-field objects to the high-frequency bucket (`H+`) specifically for the purpose of automatic downsampling.

If you pass a complex object containing both numbers and strings (e.g., `{ speed: 120, status: "running" }`), the full object is kept in the raw `H+` bucket for debugging, but only the numeric fields are automatically aggregated into the long-term historical buckets.

Parameters

* `measurement`: The name of the measurement.
* `data`: The numeric value, object, or array to store.
* `tags`: Optional tags to associate with the data.

Example

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

Output

Returns `true` on success.

<details>

<summary>Understanding Downsampling</summary>

This class uses an advanced Downsampling Pipeline to store your data efficiently. This system allows you to write high-frequency data (like sensor readings every second) without running out of storage or slowing down your dashboards when querying long time ranges (like "last year").

**The Concept: "Hot" vs. "Cold" Data**

Think of your data like news.

* "Hot" Data (Recent): You care about every detail. _Example: "What is the temperature right now? Did it spike 5 seconds ago?"_
* "Cold" Data (Historical): You care about trends, not microseconds. _Example: "What was the average temperature last month?"_

Our system automatically moves data through "buckets" as it ages, reducing its resolution (granularity) to save space while keeping the statistical accuracy you need.

**1. The Pipeline Structure**

Data flows automatically through a series of stages. You only write to the start of the pipeline; the system handles the rest.

![](<../../../../.gitbook/assets/image (1).png>)

| **Bucket Name** | **Resolution (Granularity)** | **Retention (How long it stays)** | **Used For**                                   |
| --------------- | ---------------------------- | --------------------------------- | ---------------------------------------------- |
| `H+`            | Raw (Every point)            | 1 Day                             | Real-time monitoring, debugging recent events. |
| `D+`            | 5 Minutes                    | 1 Week                            | zooming into last week's performance.          |
| `W+`            | 1 Hour                       | 1 Month                           | Weekly trends and patterns.                    |
| `M+`            | 1 Day                        | 1 Year                            | Monthly analysis and seasonal trends.          |
| `Y+`            | 1 Week                       | Forever                           | Long-term historical archiving.                |

**2. How Writing Works**

As a developer, you don't need to choose which bucket to write to. You simply send data to the system, and it lands in the Raw (`H+`) bucket automatically.

Background Tasks:

Behind the scenes, scheduled tasks wake up periodically to process this data. For example, every 5 minutes, a task takes all the raw data from H+, calculates the Mean, Min, Max, and Count, and saves a single summary point into D+.

**3. How Reading Works (The "Smart Stitching")**

This is the most powerful feature. When you ask for data, you don't need to know which bucket it is in. You just provide a time range, and the `readDownsampled` function acts as a smart broker:

1. It looks at your requested `start` and `stop` times.
2. It automatically selects the highest-resolution bucket available for that period.
3. If your request spans across boundaries (e.g., "last 2 hours" to "last 2 weeks"), it stitches data together seamlessly.

Example Scenario:

If you ask for "The last 2 days", the system might return:

* The last 24 hours from the Raw (`H+`) bucket (high detail).
* The 24 hours before that from the 5-minute (`D+`) bucket (medium detail).

**4. Configuration Examples**

Here is how you use this in your low-code functions.

Scenario A: Real-Time Debugging

You want to see exactly what happened in the last 15 minutes. The system will pull from the Raw (`H+`) bucket.

```yaml
# Function: readDownsampled
options:
  start: "-15m"
  tail: 100
```

Scenario B: Monthly Reporting

You want to visualize the trend over the last 30 days. Loading raw data for 30 days would be millions of points (slow!). The system automatically pulls from the Hourly (`W+`) or Daily (`M+`) buckets, making the query instant.

```yaml
# Function: readDownsampled
options:
  start: "-30d"
  limit: 1000
```

Scenario C: The "Stitched" View

You want the last 50 data points, regardless of how old they are. The system will look at the newest data first, and if it doesn't find enough, it will automatically look further back in time into older buckets.

```yaml
# Function: readDownsampled
options:
  tail: 50
```

**Summary of Aggregated Fields**

When data is downsampled, we don't just keep the average. We preserve four key statistics for every window, so you never lose the context of what happened:

* `mean`: The average value (good for smooth lines).
* `max`: The highest value seen (good for detecting spikes).
* `min`: The lowest value seen.
* `count`: How many raw data points went into this period (good for understanding data density).

</details>

### read

Reads time-series data from a specific bucket and measurement. It offers powerful options for filtering by time, isolating specific fields, limiting results, and aggregating data.

The Magic Router: If you query a measurement that contains multiple fields (e.g., an object) and do not specify a target field, the engine automatically pivots the data and reconstructs the original JavaScript object for you.

{% hint style="info" %}
Internal bucket names when using the internal database, bucket names indicate retention:

`F` (Forever), `Y` (Year), `M` (Month), `W` (Week), `D` (Day), `H` (Hour).
{% endhint %}

Parameters

* `bucket`: The name of the bucket to query.
* `measurement`: The name of the measurement.
* `options`: An optional object to refine the query.
  * `field`: The specific field to isolate (e.g., `'cycle_time'`). If omitted, returns all fields as an object.
  * `start`: The earliest time to include (e.g., `'-12h'`, `'-7d'`, `'2025-01-01T00:00:00Z'`). Defaults to `'-1y'`.
  * `stop`: The latest time to include. Defaults to `'now()'`.
  * `limit`: Limits the result to the _first_ `n` data points.
  * `tail`: Limits the result to the _last_ `n` data points.
  * `every`: Duration of time windows for aggregation (e.g., `'15m'`). Requires `func`.
  * `func`: The aggregation function (e.g., `'mean'`, `'sum'`, `'count'`, `'last'`).
  * `tags`: An object of tags to filter by.

<details>

<summary>Examples</summary>

#### 1. Smoothing Noisy Sensor Data (Averages)

The Problem: An analog temperature or vibration sensor sends data every second. When plotted on a dashboard, the chart looks incredibly "spiky" and noisy, making it hard to see the actual trend.

The Solution: Group the data into time windows (e.g., 5 minutes) and calculate the `mean` (average). This acts as a low-pass filter, smoothing the line out perfectly.

Task: _Show me a smooth trend of the extruder temperature over the last 12 hours._

```yaml
# measurement
extruder_temp
# options
start: -12h
every: 5m
func: mean
```

#### 2. Peak Detection & Shift Highs

The Problem: You want to ensure a motor never exceeded its safe operating temperature during a shift, or you want to find the maximum pressure a hydraulic press reached yesterday.

The Solution: Use the `max` (or `min`) function combined with an `every` window that matches your reporting period (e.g., 8 hours for a shift, 1 day for daily reports).

Task: _Find the highest temperature the motor reached each day over the last 30 days._

```yaml
# measurement
motor_temperature
# options
start: -30d
every: 1d
func: max
```

#### 3. Counting Incidents or Machine Faults

The Problem: Your application logs an entry every time a machine throws a fault code or a quality inspection fails. You want a bar chart showing how many errors happened hour by hour.

The Solution: Use the `count` function. It ignores the actual values and simply counts how many data points occurred within each time window.

Task: _Show me a bar chart of quality inspection failures per hour for the current shift._

```yaml
# measurement
qa_failures
# options
start: -8h
every: 1h
func: count
```

#### 4. The Resetting Machine Counter (Pieces Produced)

The Problem: Your PLC tracks the total number of parts produced using an integer counter. When the shift ends (or the counter hits its memory limit, like `9999`), it resets back to `0`. If you try to calculate the average or sum of this data, the reset will ruin your math.

The Solution: Use the `difference: nonNegative` option. This calculates the exact number of pieces produced between each reading and automatically ignores the impossible negative drop when the machine resets to zero.

Task: _Show me the total number of pieces produced per hour over the last 24 hours._

```yaml
# measurement
packaging_line
# options
field: piece_counter
start: -24h
every: 1h
func: sum              # Add up the differences in each hour
difference: nonNegative # Safely ignore the counter resets back to 0
```

#### 5. Event-Driven Machine States (Sparse Data)

The Problem: To save bandwidth, a machine only sends data when its state changes (e.g., `1` for Running, `0` for Stopped, `2` for Fault). If the machine turned on at 8:00 AM and you query the data at 9:00 AM, the database might return nothing for that hour, leaving a gap in your dashboard.

The Solution: Use `fillPrevious: true`. This tells the engine to look backward, find the last known state, and carry it forward into any empty time windows to create a continuous, accurate timeline.

Task: _Plot a continuous minute-by-minute state chart for the current 8-hour shift._

```yaml
# measurement
cnc_machine_1
# options
field: status_code
start: -8h
every: 1m
func: last             # Get the latest state in that minute
fillPrevious: true     # If no state was broadcast, assume the previous state
```

#### 6. Cumulative Running Totals (Energy/Water Usage)

The Problem: Your smart meter reports the amount of energy (kWh) or water (Liters) consumed every 15 minutes. The maintenance team wants to see a chart showing the _accumulated_ total usage building up throughout the shift.

The Solution: Use `cumulativeSum: true` to keep a running tally of the data points across your selected time range.

Task: _Show the running total of energy consumed so far in the last 12 hours_

```yaml
# measurement
main_power_meter
# options
field: interval_kwh
start: -12h
every: 15m
func: sum
cumulativeSum: true    # Add each 15m window to the running total
```

#### 7. Rate of Change / Drainage (Derivatives)

The Problem: You are monitoring the absolute volume of a liquid tank (in liters). You don't just want to see the volume go down; you want to trigger an alarm if the tank is draining _too fast_ (Liters per Minute).

The Solution: Use `derivativeUnit`. This calculates the mathematical slope between your data points, converting absolute values into a speed or rate.

Task: _Show me the minute-by-minute drain rate of the chemical tank._

```yaml
# measurement
chemical_tank_A
# options
field: volume_liters
start: -1h
derivativeUnit: 1m     # Convert absolute volume into Liters/Minute
```

#### 8. Isolating Metrics from Multi-Field Payloads

The Problem: You used the `writePoint` function to save an entire JavaScript object containing multiple metrics at once (e.g., `{ temperature: 45, vibration: 1.2, speed: 1500 }`). Now, you only want to visualize one specific metric on a chart.

The Solution: Use the `field` option to tell the engine to extract only that specific data stream before applying any math or aggregation.

Task: _Show me the maximum vibration recorded every 5 minutes._

```yaml
# measurement
robot_arm_2
# options
field: vibration       # Isolate just the vibration metric from the payload
start: -24h
every: 5m
func: max
```

</details>

Output

An array of objects, where each object has a `date` (ISO timestamp) and a `value` (which can be a single primitive or a reconstructed object).

```json
[
  { "date": "2025-10-27T10:00:00Z", "value": { "cycle_time": 4.2, "yield": 150 } },
  { "date": "2025-10-27T10:15:00Z", "value": { "cycle_time": 4.1, "yield": 152 } }
]
```

<details>

<summary>Understanding Aggregation</summary>

When working with time-series data, you often have thousands of individual data points (like sensor readings every second). To make sense of this data or to visualize it effectively, you typically want to group these points into larger time windows and summarize them. This process is called aggregation.

In the `read` function, this is controlled by two parameters:

* `every`: Defines the size of the time window (e.g., `'1h'` for one hour, `'15m'` for 15 minutes, `'1d'` for one day).
* `func`: Defines the mathematical calculation to apply to the data points within each window.

#### Available Functions

The following functions can be used in the `func` parameter to summarize your data:

| **Function** | **Description**                           | **Typical Use Case**                                                      |
| ------------ | ----------------------------------------- | ------------------------------------------------------------------------- |
| `mean`       | Calculates the average value.             | Smoothing out noisy sensor data (e.g., average temperature per hour).     |
| `median`     | Finds the middle value.                   | Finding the "typical" value while ignoring extreme outliers.              |
| `min`        | Finds the lowest value.                   | Detecting the coldest temperature or lowest battery level in a period.    |
| `max`        | Finds the highest value.                  | Detecting peak power usage or maximum pressure in a day.                  |
| `sum`        | Adds up all values.                       | Calculating total energy consumption (kWh) or total volume flowed.        |
| `count`      | Counts the number of data points.         | Counting how many times a machine cycled or how many error logs occurred. |
| `last`       | Takes the very last value in the window.  | Seeing the final state of a system at the end of each period.             |
| `first`      | Takes the very first value in the window. | Seeing the starting state of a system at the beginning of each period.    |

#### Examples

The following examples show how to configure the `read` function options to perform different types of analysis.

**1. Smoothing Data (Hourly Average)**

If you have a sensor sending data every second, a chart might look very "spiky." To see a smooth trend, you can calculate the average (`mean`) for every hour (`1h`).

```yaml
# options
start: -24h
every: 1h
func: mean
```

**2. Peak Detection (Daily Maximum)**

To monitor a motor's performance, you might want to know the highest speed or temperature it reached each day over the past month.

```yaml
# options
start: -30d
every: 1d
func: max
```

**3. Usage Totals (Monthly Sum)**

If you are tracking water flow where each data point represents liters used since the last reading, you can sum them up to get the total monthly consumption.

```yaml
# options
start: -1y
every: 1mo
func: sum
```

**4. Incident Counting**

If your application writes a value of `1` every time an error occurs, you can count how many errors happened in 15-minute intervals.

```yaml
# options
start: -12h
every: 15m
func: count
```

</details>

### readDownsampled

A "smart" query function that automatically stitches together data from different aggregated buckets. It retrieves high-resolution data for recent timeframes and lower-resolution (aggregated) data for older timeframes, providing an optimized view of long-term history without processing millions of raw data points.

You can extract specific metrics (like `max` or `min`) from targeted fields (like `cycle_time`).

Parameters

* `measurement`: The name of the measurement.
* `options`: Query options.
  * `field`: The specific field to extract (defaults to `'value'`).
  * `aggFunc`: The statistical aggregation to return as the main `value` (e.g., `'mean'`, `'max'`). Defaults to `'mean'`.
  * `start`: Earliest time (default `'-1y'`).
  * `stop`: Latest time (default `'now()'`).
  * `limit`: Limit to first `n` results.
  * `tail`: Limit to last `n` results.
  * `tags`: Filter by tags.

Example

```yaml
# measurement
production_line
# options
start: -30d
field: cycle_time
aggFunc: max
tags: { line_id: "A1" }
```

Output

An array of objects containing statistical data (`mean`, `min`, `max`, `count`) for each time point. The requested `aggFunc` is mapped to the main `value` key for easy chart binding.

```json
[
  {
    "date": "2025-10-01T00:00:00Z",
    "mean": 4.5,
    "min": 4.1,
    "max": 5.2,
    "count": 60,
    "value": 5.2,  // The 'max' value requested via aggFunc
    "raw": false
  }
]
```

### query

Allows you to execute a raw Flux query string. This provides maximum flexibility for complex database operations not covered by the helper functions.

Parameters

* `flux`: The raw Flux query string.

Example

```yaml
# flux
from(bucket:"my-bucket") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "cpu")
```

Output

The raw result rows from InfluxDB.

### delete

Deletes data from a measurement. You can delete the entire measurement or specify a time range to delete only a portion of the data.

Parameters

* `bucket`: The name of the bucket.
* `measurement`: The name of the measurement to delete.
* `options`: Time range options.
  * `start`: Start time (defaults to `1970-01-01...`).
  * `stop`: End time (defaults to now).

Example

```yaml
# bucket
D
# measurement
test_data
# options
start: -1h
```

Output

Returns `true` on success.

### flush

Manually forces any buffered data (pending writes) to be sent to the database immediately. This is useful during testing or before shutting down a process to ensure no data is lost.

Output

Returns `true` (void promise) when complete.

### reset

Danger Zone. This function deletes all data from all measurements in all buckets connected to this instance. The buckets themselves are preserved, but they will be empty.

Output

Returns `true` when the reset is complete.

### listBuckets

Retrieves a list of all available buckets in the connected organization.

Output

An array of bucket objects.

```json
[
  { "name": "D", "id": "...", "retentionPeriod": 86400 },
  { "name": "F", "id": "...", "retentionPeriod": 0 }
]
```

### listMeasurements

Lists detailed information about all measurements across all buckets.

Parameters

* `options`:
  * `includeStats`: If `true`, calculates row count and cardinality (Warning: this can be slow).
  * `statsRangeStart`: Time range for stats (default `'-1y'`).

Example

```yaml
# options
includeStats: true
```

Output

An array of measurement details.

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

### getMeasurementDetails

Retrieves the schema (fields and tags) for a specific measurement in a specific bucket.

Parameters

* `bucket`: The bucket name.
* `measurement`: The measurement name.

Example

```yaml
# bucket
D
# measurement
production_line
```

Output

```json
{
  "fields": ["cycle_time", "yield"],
  "tags": ["line_id", "location"]
}
```

### getMeasurementStats

Calculates statistics (row count and cardinality) for a specific measurement over a given time range.

Parameters

* `bucket`: The bucket name.
* `measurement`: The measurement name.
* `options`:
  * `start`: Start time (default `'-30d'`).
  * `stop`: End time (default `'now()'`).

Example

```yaml
# bucket
F
# measurement
errors
# options
start: -7d
```

Output

```json
{
  "rowCount": 150,
  "seriesCardinality": 2
}
```
