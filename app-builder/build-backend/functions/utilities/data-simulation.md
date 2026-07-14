# Data simulation

With data simulation, you generate a wide variety of random and mock data. This is invaluable for testing, prototyping, and creating realistic demonstrations without needing real data. The functions cover everything from simple numbers and strings to complex, structured data like personal information, geographic coordinates, and time series datasets. All functions are static, so you do not need to create an instance.

## `randomInteger`

Returns a random whole number between a minimum (inclusive) and a maximum (inclusive) value.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>min</code>: the minimum possible integer, defaults to <code>0</code>. <code>max</code>: the maximum possible integer, defaults to <code>99999</code>.</td><td>object</td></tr></tbody></table>

### Example

```yaml
# options
min: 1
max: 10
```

### Output

A random integer between 1 and 10, for example `7`.

## `randomNumber`

Returns a random floating-point number between a minimum (inclusive) and a maximum (exclusive) value.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>min</code>: the minimum possible number, defaults to <code>0</code>. <code>max</code>: the maximum possible number (not included in the output), defaults to <code>1</code>.</td><td>object</td></tr></tbody></table>

### Example

```yaml
# options
min: 0
max: 100
```

### Output

A random number between 0 and 99.99..., for example `42.123`.

## `randomString`

Generates a string of a specified length, composed of random printable characters (`!` to `}`).

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>length</code></td><td>The desired length of the string. Defaults to <code>10</code>, maximum is 2^20.</td><td>integer</td></tr></tbody></table>

### Example

```yaml
# length
12
```

### Output

A random string like `A7b$p(qR_sT!`.

## `randomText`

Generates random "lorem ipsum" style text, useful for populating text fields and paragraphs.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td>Optional settings. See below.</td><td>object</td></tr></tbody></table>

Available options:

<table><thead><tr><th width="220">Option</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>count</code></td><td>The number of units to generate. Defaults to <code>1</code>.</td><td>integer</td></tr><tr><td><code>units</code></td><td>The type of unit to generate: <code>words</code>, <code>sentences</code>, or <code>paragraphs</code>. Defaults to <code>sentences</code>.</td><td>string</td></tr><tr><td><code>format</code></td><td>The output format, either <code>plain</code> (default) or <code>html</code>.</td><td>string</td></tr><tr><td><code>sentenceLowerBound</code>, <code>sentenceUpperBound</code></td><td>The minimum and maximum number of words per sentence.</td><td>number</td></tr><tr><td><code>paragraphLowerBound</code>, <code>paragraphUpperBound</code></td><td>The minimum and maximum number of sentences per paragraph.</td><td>number</td></tr></tbody></table>

### Examples

Generate 5 random words:

```yaml
# options
count: 5
units: words
```

Output: `lorem ipsum dolor sit amet`

Generate 1 paragraph with HTML tags:

```yaml
# options
count: 1
units: paragraphs
format: html
```

Output: `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...</p>`

## `error`

Intentionally throws an error with a specified or random message. This is useful for testing error-handling logic.

### Parameters

<table><thead><tr><th width="160">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>customMessage</code></td><td>An optional string to use as the error message. If omitted, a random text string is used.</td><td>string</td></tr></tbody></table>

## `randomObject`

Generates an object with a random number of keys and random values of various types.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>min</code>: minimum number of key-value pairs, defaults to <code>3</code>. <code>max</code>: maximum number of key-value pairs, defaults to <code>7</code>. <code>allowNesting</code>: if <code>true</code>, values can themselves be other random objects, defaults to <code>true</code>.</td><td>object</td></tr></tbody></table>

### Output

```json
{
  "mary": "Hic quisquam.",
  "edward": [ 5, 8, 1, 9 ],
  "margaret": 1234
}
```

## `randomArrayOfIntegers`

Returns an array of random integers.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>length</code></td><td>The desired length of the array. Defaults to <code>10</code>.</td><td>integer</td></tr></tbody></table>

## `randomArrayOfNumbers`

Returns an array of random floating-point numbers.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>length</code></td><td>The desired length of the array. Defaults to <code>10</code>.</td><td>integer</td></tr></tbody></table>

## `randomArrayOfDigits`

Returns an array of random single digits (0 to 9).

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>length</code></td><td>The desired length of the array. Defaults to <code>10</code>.</td><td>integer</td></tr></tbody></table>

## `randomArrayOfStrings`

Returns an array of random words.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>length</code></td><td>The desired length of the array. Defaults to <code>10</code>.</td><td>integer</td></tr></tbody></table>

## `randomArrayOfObjects`

Returns an array of random objects. Nesting is disabled, so all values are simple.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>length</code></td><td>The desired length of the array. Defaults to <code>10</code>.</td><td>integer</td></tr><tr><td><code>options</code></td><td><code>min</code>: minimum number of entries per object, defaults to <code>3</code>. <code>max</code>: maximum number of entries per object, defaults to <code>7</code>.</td><td>object</td></tr></tbody></table>

## `randomNumericData`

Generates numeric datasets, often used for charting. The data follows a Gaussian (normal) distribution, creating realistic-looking random fluctuations around a mean value.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td>Optional settings. See below.</td><td>object</td></tr></tbody></table>

Available options:

<table><thead><tr><th width="150">Option</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>nDataSets</code></td><td>The number of separate datasets to generate. Defaults to <code>1</code>.</td><td>integer</td></tr><tr><td><code>nDataPoints</code></td><td>The number of data points in each dataset. Defaults to <code>100</code>.</td><td>integer</td></tr><tr><td><code>addTimeAxis</code></td><td>If <code>true</code>, adds a <code>date</code> field to each data point, incrementing by one second per point. Defaults to <code>false</code>.</td><td>boolean</td></tr><tr><td><code>timeFormat</code></td><td>The format of the <code>date</code> field when <code>addTimeAxis</code> is <code>true</code>: <code>epoch</code> (default), <code>iso</code>, <code>string</code>, or <code>object</code>.</td><td>string</td></tr></tbody></table>

### Examples

A single dataset as a simple array (only when <code>nDataSets</code> is 1 and <code>addTimeAxis</code> is off):

```yaml
# options
nDataSets: 1
nDataPoints: 5
```

Output:

```json
[-0.5, 1.2, 0.8, -0.1, 0.3]
```

Multiple datasets with an ISO time axis:

```yaml
# options
nDataSets: 2
nDataPoints: 3
addTimeAxis: true
timeFormat: iso
```

Output:

```json
[
  { "dataset0": 65.4, "dataset1": -22.1, "date": "2025-08-29T12:46:00.000Z" },
  { "dataset0": 66.1, "dataset1": -21.5, "date": "2025-08-29T12:46:01.000Z" },
  { "dataset0": 65.9, "dataset1": -22.3, "date": "2025-08-29T12:46:02.000Z" }
]
```

## `randomAddressData`

Returns an array of realistic-looking, randomly generated address objects with the fields `street`, `buildingNumber`, `city`, `state`, and `country`.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>entries</code>: the number of address objects to generate, defaults to <code>10</code>. <code>locale</code>: the locale for the data, <code>DE</code> (default) or <code>US</code>.</td><td>object</td></tr></tbody></table>

## `randomPersonData`

Returns an array of realistic-looking, randomly generated objects representing people.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>entries</code>: the number of person objects to generate, defaults to <code>10</code>. <code>locale</code>: the locale for the data, <code>DE</code> (default) or <code>US</code>.</td><td>object</td></tr></tbody></table>

### Output

An array of objects with the fields `title`, `firstName`, `lastName`, `company`, `phone`, `verified`, `validUntil`, `note`, and an `avatar`, which is a base64-encoded random JPEG image.

## Dataset functions

These functions return static, pre-defined JSON datasets that are useful for consistently testing and demonstrating UI components like charts, grids, and boards.

* `kanbanData`: Returns data structured for a kanban board.
* `energyData`: Returns data about energy sources.
* `populationDataset`: Returns population data.
* `marketValueDataset`: Returns data about company market values.
* `australianMedalsDataset`: Returns data about Olympic medals.
* `populationVsAgeDataset`: Returns data correlating age and population.

## `randomChatData`

Generates an array of simple chat message objects (`role` and `content`) to simulate a conversation.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>messages</code></td><td>The total number of messages to generate. Defaults to <code>10</code>.</td><td>integer</td></tr></tbody></table>

## `timelineData`

Generates randomized chronological timeline data spanning a specific time duration, ending at the current time. Each entry represents a change on one of the tracks (state, operator, shift) with a timestamp. This is ideal for testing timeline visualizations of machine states.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td>Optional settings. See below.</td><td>object</td></tr></tbody></table>

Available options:

<table><thead><tr><th width="190">Option</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>totalDurationHours</code></td><td>Total duration of the generated data in hours. Defaults to <code>24</code>.</td><td>number</td></tr><tr><td><code>includeState</code></td><td>Whether to include the state track (values like <code>Running</code>, <code>Idle</code>, <code>Maintenance</code>, <code>Error</code>). Defaults to <code>true</code>.</td><td>boolean</td></tr><tr><td><code>includeOperator</code></td><td>Whether to include the operator track. Defaults to <code>false</code>.</td><td>boolean</td></tr><tr><td><code>includeShift</code></td><td>Whether to include the shift track. Defaults to <code>false</code>.</td><td>boolean</td></tr><tr><td><code>timeFormat</code></td><td>Format of the timestamps: <code>epoch</code> (default), <code>iso</code>, <code>string</code>, or <code>object</code>.</td><td>string</td></tr></tbody></table>

### Output

An array of timeline events, each with the enabled tracks and a `timestamp`.

## `randomPointInCircle`

Generates a random GPS coordinate (latitude and longitude) that falls within a specified radius of a central point.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>distance</code></td><td>The radius of the circle in meters. Defaults to <code>5000</code>.</td><td>integer</td></tr><tr><td><code>coord</code></td><td>The central coordinate object with <code>lat</code> and <code>lng</code>. Defaults to a location in Hamburg, Germany.</td><td>object</td></tr></tbody></table>

### Output

A coordinate object, for example `{ "lat": 53.5583, "lng": 10.0121 }`.

## `longExecution`

Simulates a long-running asynchronous process by waiting for a specified amount of time.

### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>time</code></td><td>The simulated execution time in milliseconds.</td><td>integer</td></tr></tbody></table>

### Output

The provided execution time, after the delay.
