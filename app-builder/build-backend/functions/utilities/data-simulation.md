# Data simulation

The data simulation class generates random and mock data for testing, prototyping, and creating demonstrations without requiring real information. These functions create numbers, strings, and complex structured datasets such as personal profiles, geographic coordinates, and time-series logs. This class provides static functions only and does not require an instance. The code class name is `Simulator`.

## Basic values

### `randomInteger`

Returns a random whole number between a minimum and a maximum value (both inclusive).

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>min</code></td><td>The minimum possible integer. Default 0.</td><td>integer</td></tr><tr><td></td><td><code>max</code></td><td>The maximum possible integer. Default 99999.</td><td>integer</td></tr></tbody></table>

#### Output

Returns a random integer.

#### Example

```yaml
# options
min: 1
max: 10
```

### `randomNumber`

Returns a random floating-point number between a minimum and a maximum value.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>min</code></td><td>The minimum possible number. Default 0.</td><td>number</td></tr><tr><td></td><td><code>max</code></td><td>The maximum possible number (exclusive). Default 1.</td><td>number</td></tr></tbody></table>

#### Output

Returns a random floating-point number.

#### Example

```yaml
# options
min: 0
max: 100
```

### `randomString`

Generates a string of a specified length composed of random printable characters from `!` to `}` (character codes 33 to 125).

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>length</code></td><td>The desired length of the string. Maximum is 2^20. Default 10.</td><td>integer</td></tr></tbody></table>

#### Output

Returns a random string.

#### Example

```yaml
# length
12
```

### `randomText`

Generates random placeholder text in a lorem ipsum style to populate text fields and layout paragraphs.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="180">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>count</code></td><td>The number of units to generate. Default 1.</td><td>integer</td></tr><tr><td></td><td><code>units</code></td><td>The type of unit to generate: <code>words</code>, <code>sentences</code>, or <code>paragraphs</code>. Default <code>sentences</code>.</td><td>string</td></tr><tr><td></td><td><code>format</code></td><td>The output format, either <code>plain</code> or <code>html</code>. Default <code>plain</code>.</td><td>string</td></tr><tr><td></td><td><code>sentenceLowerBound</code></td><td>The minimum number of words per sentence.</td><td>integer</td></tr><tr><td></td><td><code>sentenceUpperBound</code></td><td>The maximum number of words per sentence.</td><td>integer</td></tr><tr><td></td><td><code>paragraphLowerBound</code></td><td>The minimum number of sentences per paragraph.</td><td>integer</td></tr><tr><td></td><td><code>paragraphUpperBound</code></td><td>The maximum number of sentences per paragraph.</td><td>integer</td></tr><tr><td></td><td><code>suffix</code></td><td>The line ending used between units. Defaults to the system line break.</td><td>string</td></tr></tbody></table>

#### Output

Returns a string of random text.

#### Examples

Example 1: Generate words

```yaml
# options
count: 5
units: words
```

Example 2: Generate paragraphs with HTML tags

```yaml
# options
count: 1
units: paragraphs
format: html
```

### `error`

Throws an execution error with a specified or random message to test error-handling logic.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>customMessage</code></td><td>An optional string to use as the error message. If omitted, the function uses a random lorem ipsum sentence.</td><td>string</td></tr></tbody></table>

#### Output

Throws an execution error.

## Complex structures

### `randomObject`

Generates an object with a random number of keys and values of various types.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>min</code></td><td>The minimum number of key-value pairs. Default 3.</td><td>integer</td></tr><tr><td></td><td><code>max</code></td><td>The maximum number of key-value pairs. Default 7.</td><td>integer</td></tr><tr><td></td><td><code>allowNesting</code></td><td>Allows values to be other random objects. Default true.</td><td>boolean</td></tr></tbody></table>

#### Output

Returns a random object.

### `randomArrayOfIntegers`

Returns an array of random integers.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>length</code></td><td>The length of the array. Default 10.</td><td>integer</td></tr></tbody></table>

#### Output

Returns an array of integers.

### `randomArrayOfNumbers`

Returns an array of random floating-point numbers.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>length</code></td><td>The length of the array. Default 10.</td><td>integer</td></tr></tbody></table>

#### Output

Returns an array of numbers.

### `randomArrayOfDigits`

Returns an array of random single digits (0 to 9).

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>length</code></td><td>The length of the array. Default 10.</td><td>integer</td></tr></tbody></table>

#### Output

Returns an array of integers.

### `randomArrayOfStrings`

Returns an array of random words.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>length</code></td><td>The length of the array. Default 10.</td><td>integer</td></tr></tbody></table>

#### Output

Returns an array of strings.

### `randomArrayOfObjects`

Returns an array of random objects with flat, non-nested values.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>length</code></td><td></td><td>The length of the array. Default 10.</td><td>integer</td></tr><tr><td><code>options</code></td><td><code>min</code></td><td>The minimum number of entries per object. Default 3.</td><td>integer</td></tr><tr><td></td><td><code>max</code></td><td>The maximum number of entries per object. Default 7.</td><td>integer</td></tr></tbody></table>

#### Output

Returns an array of objects.

## Specialized datasets

### `randomNumericData`

Generates numeric datasets using a Gaussian distribution to create realistic random fluctuations around a mean value, typically used for charts.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>nDataSets</code></td><td>The number of separate datasets to generate. Default 1.</td><td>integer</td></tr><tr><td></td><td><code>nDataPoints</code></td><td>The number of data points per dataset. Default 100.</td><td>integer</td></tr><tr><td></td><td><code>addTimeAxis</code></td><td>Adds a <code>date</code> field to each data point, incrementing by one second per point. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>timeFormat</code></td><td>The format of the <code>date</code> field when <code>addTimeAxis</code> is true: <code>epoch</code>, <code>iso</code>, <code>string</code>, or <code>object</code>. Default <code>epoch</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns a single array of numbers if `nDataSets` is 1 and `addTimeAxis` is false. Otherwise returns an array of objects with one key per dataset (`dataset0`, `dataset1`, ...) and, if enabled, the `date` field.

#### Examples

Example 1: Single dataset array

```yaml
# options
nDataSets: 1
nDataPoints: 5
```

Example 2: Multiple datasets with an ISO time axis

```yaml
# options
nDataSets: 2
nDataPoints: 3
addTimeAxis: true
timeFormat: iso
```

### `randomAddressData`

Returns an array of realistic address objects containing street, building number, city, state, and country fields.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>entries</code></td><td>The number of address objects to generate. Default 10.</td><td>integer</td></tr><tr><td></td><td><code>locale</code></td><td>The geographic locale format for the data: <code>DE</code> or <code>US</code>. Default <code>DE</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of address objects.

### `randomPersonData`

Returns an array of realistic personal identity records.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>entries</code></td><td>The number of person objects to generate. Default 10.</td><td>integer</td></tr><tr><td></td><td><code>locale</code></td><td>The regional locale format for names and data: <code>DE</code> or <code>US</code>. Default <code>DE</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of objects containing `avatar` (a base64-encoded random JPEG image), `title`, `firstName`, `lastName`, `company`, `phone`, `verified` (always `true`), `validUntil` (a random ISO date within the next 30 hours), and `note` (always empty).

### `randomChatData`

Generates an array of simple chat message objects with alternating `role` values (`You` and `ChatBot`) and random `content` to simulate a conversation.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>messages</code></td><td>The total number of chat messages to generate. Default 10.</td><td>integer</td></tr></tbody></table>

#### Output

Returns an array of chat message objects.

### `timelineData`

Generates randomized chronological timeline events spanning a specific duration and ending at the current time. This function supports tracking machine states, operator assignments, and work shifts.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="150">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>totalDurationHours</code></td><td>The total duration of the generated data in hours. Default 24.</td><td>number</td></tr><tr><td></td><td><code>includeState</code></td><td>Includes the machine state track (values <code>Running</code>, <code>Idle</code>, <code>Maintenance</code>, or <code>Error</code>). Default true.</td><td>boolean</td></tr><tr><td></td><td><code>includeOperator</code></td><td>Includes the operator assignment track. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>includeShift</code></td><td>Includes the work shift track. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>timeFormat</code></td><td>The timestamp format: <code>epoch</code>, <code>iso</code>, <code>string</code>, or <code>object</code>. Default <code>epoch</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of timeline event objects with a `timestamp` and the enabled tracks.

### `randomPointInCircle`

Generates a random GPS coordinate within a specified radius of a central point.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>distance</code></td><td></td><td>The radius of the circle in meters. Default 5000.</td><td>integer</td></tr><tr><td><code>coord</code></td><td><code>lat</code></td><td>The latitude of the central coordinate point. Default 53.5511 (Hamburg, Germany).</td><td>number</td></tr><tr><td></td><td><code>lng</code></td><td>The longitude of the central coordinate point. Default 9.9937 (Hamburg, Germany).</td><td>number</td></tr></tbody></table>

#### Output

Returns a coordinate object containing `lat` and `lng` properties.

### Predefined reference datasets

These functions require no parameters and return static, predefined JSON datasets to test layout configurations and UI components (such as charts, data grids, or kanban boards) consistently:

* `kanbanData`: Returns structured columns and cards for a kanban board.
* `energyData`: Returns data tracking power metrics and energy sources.
* `populationDataset`: Returns historical demographic population data.
* `marketValueDataset`: Returns data tracking corporate market valuations.
* `australianMedalsDataset`: Returns statistics on historical Olympic medals.
* `populationVsAgeDataset`: Returns data correlating age groups and population distribution.

## Execution control

### `longExecution`

Simulates a long-running asynchronous process by pausing execution for a specified duration.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>time</code></td><td>The simulated execution duration in milliseconds.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the execution duration value after the specified delay.
