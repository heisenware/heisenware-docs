---
description: This article lists and explains all available simulator functions.
---

# Data Simulation

The `Simulator` class is a powerful toolkit of static utility functions designed to generate a wide variety of random and mock data. It is invaluable for testing, prototyping, and creating realistic demonstrations without needing real data. The class can generate everything from simple numbers and strings to complex, structured data like personal information, geographic coordinates, and time-series datasets.

Since all methods in this class are **static**, you do not need to create an instance of it.

### randomInteger

Returns a random whole number between a minimum (inclusive) and a maximum (inclusive) value.

**Parameters**

* `options`: An optional object.
  * `min`: The minimum possible integer. Defaults to `0`.
  * `max`: The maximum possible integer. Defaults to `99999`.

**Example**

```yaml
# options
min: 1
max: 10

```

**Output**: A random integer between 1 and 10 (e.g., `7`).

### randomNumber

Returns a random floating-point number between a minimum (inclusive) and a maximum (exclusive) value.

**Parameters**

* `options`: An optional object.
  * `min`: The minimum possible number. Defaults to `0`.
  * `max`: The maximum possible number (this value is not included in the output). Defaults to `1`.

**Example**

```yaml
# options
min: 0
max: 100

```

**Output**: A random number between 0 and 99.99... (e.g., `42.123`).

### randomString

Generates a string of a specified length, composed of random printable UTF-16 characters.

**Parameters**

* `length`: The desired length of the string. Defaults to `10`.

**Example**

```yaml
# length
12

```

**Output**: A random string like `'A7b$p(qR_sT!'`.

### randomText

Generates random "lorem ipsum" style text, useful for populating text fields and paragraphs.

**Parameters**

* `options`: An optional object to configure the text generation.
  * `count`: The number of units to generate. Defaults to `1`.
  * `units`: The type of unit to generate. Can be `'words'`, `'sentences'`, or `'paragraphs'`. Defaults to `'sentences'`.
  * `format`: The output format, either `'plain'` (default) or `'html'`.
  * `sentenceLowerBound` / `sentenceUpperBound`: The min/max number of words per sentence.
  * `paragraphLowerBound` / `paragraphUpperBound`: The min/max number of sentences per paragraph.

**Example 1: Generate 5 random words**

```yaml
# options
count: 5
units: words

```

**Output**: `'lorem ipsum dolor sit amet'`

**Example 2: Generate 1 paragraph with HTML tags**

```yaml
# options
count: 1
units: paragraphs
format: html

```

**Output**: `'<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...</p>'`

### error

Intentionally throws an error with a specified or random message. This is useful for testing error-handling logic.

**Parameters**

* `customMessage`: An optional string to use as the error message. If omitted, a random text string is used.

### randomObject

Generates a JavaScript object with a random number of keys and random values of various types.

**Parameters**

* `options`: An optional object.
  * `min`: The minimum number of key-value pairs in the object. Defaults to `3`.
  * `max`: The maximum number of key-value pairs. Defaults to `7`.
  * `allowNesting`: If `true`, the object's values can themselves be other random objects. Defaults to `true`.

**Output**

```json
{
  "mary": "Hic quisquam.",
  "edward": [ 5, 8, 1, 9 ],
  "margaret": 1234
}

```

### randomArrayOfIntegers

Returns an array of random integers.

**Parameters**

* `length`: The desired length of the array. Defaults to `10`.

### randomArrayOfNumbers

Returns an array of random floating-point numbers.

**Parameters**

* `length`: The desired length of the array. Defaults to `10`.

### randomArrayOfDigits

Returns an array of random single digits (0-9).

**Parameters**

* `length`: The desired length of the array. Defaults to `10`.

### randomArrayOfStrings

Returns an array of random words.

**Parameters**

* `length`: The desired length of the array. Defaults to `10`.

### randomArrayOfObjects

Returns an array of random objects, each with a simple structure.

**Parameters**

* `length`: The desired length of the array. Defaults to `10`.
* `options`: An optional object to control the structure of the objects within the array.

### randomNumericData

Generates numeric datasets, often used for charting. The data follows a Gaussian (or "normal") distribution, creating realistic-looking random fluctuations around a mean value.

**Parameters**

* `options`: An optional object.
  * `nDataSets`: The number of separate datasets to generate. Defaults to `1`.
  * `nDataPoints`: The number of data points in each dataset. Defaults to `100`.
  * `addTimeAxis`: If `true`, adds a `date` field to each data point, incrementing by one second for each point.
  * `timeFormat`: The format for the `date` field when `addTimeAxis` is true. Can be `'epoch'`, `'iso'`, `'string'`, or `'object'`.

**Example 1: A single dataset as a simple array**

```yaml
# options
nDataSets: 1
nDataPoints: 5

```

**Output**

```json
[-0.5, 1.2, 0.8, -0.1, 0.3]

```

**Example 2: Multiple datasets with an ISO time axis**

```yaml
# options
nDataSets: 2
nDataPoints: 3
addTimeAxis: true
timeFormat: iso

```

**Output**

```json
[
  { "dataset0": 65.4, "dataset1": -22.1, "date": "2025-08-29T12:46:00.000Z" },
  { "dataset0": 66.1, "dataset1": -21.5, "date": "2025-08-29T12:46:01.000Z" },
  { "dataset0": 65.9, "dataset1": -22.3, "date": "2025-08-29T12:46:02.000Z" }
]

```

### randomAddressData

Returns an array of realistic-looking, randomly generated address objects.

**Parameters**

* `options`: An optional object.
  * `entries`: The number of address objects to generate. Defaults to `10`.
  * `locale`: The locale to use for generating the data. Can be `'DE'` (German) or `'US'` (United States). Defaults to `'DE'`.

### randomPersonData

Returns an array of realistic-looking, randomly generated objects representing people.

**Parameters**

* `options`: An optional object.
  * `entries`: The number of person objects to generate. Defaults to `10`.
  * `locale`: The locale to use. Can be `'DE'` or `'US'`. Defaults to `'DE'`.

Output

An array of objects, where each object has fields like firstName, lastName, company, phone, and an avatar which is a base64 encoded random JPEG image.

### Dataset Functions

These functions return static, pre-defined JSON datasets that are useful for consistently testing and demonstrating UI components like charts, grids, and boards.

* `kanbanData()`: Returns data structured for a Kanban board.
* `energyData()`: Returns data about energy sources.
* `populationDataset()`: Returns population data.
* `marketValueDataset()`: Returns data about company market values.
* `australianMedalsDataset()`: Returns data about Olympic medals.
* `populationVsAgeDataset()`: Returns data correlating age and population.

### randomChatData

Generates an array of simple chat message objects to simulate a conversation.

**Parameters**

* `messages`: The total number of messages to generate. Defaults to `10`.

### randomPointInCircle

Generates a random GPS coordinate (latitude and longitude) that falls within a specified radius of a central point.

**Parameters**

* `distance`: The radius of the circle in meters. Defaults to `5000`.
* `coord`: The central coordinate object. Defaults to a location in Hamburg, Germany.

### longExecution

Simulates a long-running asynchronous process by waiting for a specified amount of time.

**Parameters**

* `time`: The simulated execution time in milliseconds.
