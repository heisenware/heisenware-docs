# Cron

With cron, you run flows automatically at specific times or intervals, defined in the standard cron expression format. This is useful for recurring jobs such as generating daily reports, performing nightly backups, or sending scheduled notifications. Give the instance its schedule when you create it and tap its `onTick` event: the schedule runs from then on, also after a restart. The code class name is `Cron`. This class requires an instance, though it includes a static utility function for verification.

## Understanding cron expressions

A cron expression is a string of five fields separated by spaces that represents a time schedule; an optional sixth field in front gives seconds (0 - 59). Each field specifies a different unit of time:

```text
┌─────────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌─────────── day of month (1 - 31)
│ │ │ ┌───────── month (1 - 12)
│ │ │ │ ┌─────── day of week (0 - 6) (0 is Sunday)
│ │ │ │ │
* * * * *
```

### Special characters

* `*` represents "every" (such as every hour when used in the hour field).
* `,` specifies a list of values (such as `1,15,30` to trigger at minutes 1, 15, and 30).
* `-` defines a range of values (such as `9-17` to trigger every hour from 9 AM to 5 PM).
* `/` specifies step values (such as `*/15` to trigger every 15 minutes).

## Static functions

These functions are called directly on the class and do not require you to create an instance.

### `validate`

Checks if a cron expression string is syntactically valid.

#### Parameters

<table>
  <thead>
    <tr>
      <th width="150">Input</th>
      <th>Description</th>
      <th width="100">Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>expression</code></td>
      <td>The cron expression string to validate.</td>
      <td>string</td>
    </tr>
  </tbody>
</table>

#### Output

Returns `true` if the expression is valid, or `false` if invalid.

#### Example

```yaml
# expression
0 9 * * 1-5
```

## Instance functions

You must create an instance to use these functions.

### `create`

Creates a cron instance. With an expression, the schedule is set and running from creation on; without one, the instance waits for `schedule`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>options</code></td><td><code>expression</code></td><td>The cron expression. Omitted leaves the instance unscheduled.</td><td>string</td></tr><tr><td></td><td><code>timezone</code></td><td>The IANA timezone the expression is read in (such as <code>Europe/Berlin</code>). If omitted, the server's local timezone is used.</td><td>string</td></tr><tr><td></td><td><code>noOverlap</code></td><td>Skips a scheduled moment while the previous one is still being handled. Default <code>false</code>.</td><td>boolean</td></tr><tr><td></td><td><code>maxExecutions</code></td><td>The number of moments after which the schedule ends.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the name of the created instance. Fails when the expression or the timezone is invalid.

#### Example

Every weekday at 9:00 in Berlin.

```yaml
# options
expression: 0 9 * * 1-5
timezone: Europe/Berlin
```

### `delete`

Deletes a cron instance and its schedule.

#### Parameters

None.

#### Output

Returns `true` upon removal.

{% hint style="danger" %}
#### Irreversible action
Deleting removes the instance configuration.
{% endhint %}

### `schedule`

Sets the schedule and starts it. A previous schedule is replaced; listeners subscribed through `onTick` stay subscribed.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>expression</code></td><td></td><td>A valid cron expression string.</td><td>string</td></tr><tr><td><code>options</code></td><td><code>timezone</code></td><td>The IANA timezone the expression is read in.</td><td>string</td></tr><tr><td></td><td><code>noOverlap</code></td><td>Skips a scheduled moment while the previous one is still being handled. Default <code>false</code>.</td><td>boolean</td></tr><tr><td></td><td><code>maxExecutions</code></td><td>The number of moments after which the schedule ends.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the string `scheduled`. Fails when the expression or the timezone is invalid; the old schedule stays.

#### Examples

##### Example 1: Every 15 minutes

```yaml
# expression
*/15 * * * *
```

##### Example 2: At 9:00 AM and 5:00 PM every day

```yaml
# expression
0 9,17 * * *
```

##### Example 3: A cleanup job at 1:30 AM every Saturday and Sunday

```yaml
# expression
30 1 * * 6,0
```

### `start`

Resumes a stopped schedule. This function does nothing if the schedule is running already.

#### Parameters

None.

#### Output

Returns `true`. Fails with `Nothing is scheduled` when there is no schedule.

### `stop`

Pauses the schedule. No moment fires until you call `start`.

#### Parameters

None.

#### Output

Returns `true`. Fails with `Nothing is scheduled` when there is no schedule.

### `execute`

Fires the scheduled moment now, outside of the regular schedule. This is useful for testing or on-demand runs.

#### Parameters

None.

#### Output

Returns `true`. Fails with `Nothing is scheduled` when there is no schedule.

### `getStatus`

Retrieves the current state of the schedule.

#### Parameters

None.

#### Output

Returns a string representing the current state:
* `unscheduled`: Nothing is scheduled.
* `stopped`: The schedule is paused.
* `idle`: The schedule is running and waiting for the next moment.
* `running`: A moment is being handled.

### `getExpression`

Retrieves the cron expression in force.

#### Parameters

None.

#### Output

Returns the expression as a string, or `null` when nothing is scheduled.

### `getNextRun`

Retrieves the next scheduled moment.

#### Parameters

None.

#### Output

Returns the next moment as an ISO 8601 timestamp, or `null` when the schedule is stopped or nothing is scheduled.

### `getNextRuns`

Retrieves the next scheduled moments.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>count</code></td><td>How many moments to return. Default 5.</td><td>integer</td></tr></tbody></table>

#### Output

Returns an array of ISO 8601 timestamps, empty when nothing is scheduled.

### `destroy`

Ends the schedule. The instance stays and can be scheduled again with `schedule`.

#### Parameters

None.

#### Output

Returns `true`.

## Event listeners

### `onTick`

Subscribes to the scheduled moments. The callback runs at every moment while the schedule runs, and on `execute`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The callback function. <br>Payload: <code>time</code>, the Unix timestamp in milliseconds of the moment, <code>localTime</code>, the moment as ISO text in the schedule's timezone, and <code>expression</code>, the expression that fired.</td><td>callback</td></tr></tbody></table>

#### Output

Returns the string `subscribed`.

### `offTick`

Removes a listener given to `onTick`.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>listener</code></td><td>The listener to remove.</td><td>callback</td></tr></tbody></table>

#### Output

Returns `true` when the listener was subscribed, otherwise `false`.
