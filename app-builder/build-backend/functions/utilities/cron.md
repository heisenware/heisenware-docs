# Cron

The cron class schedules automated tasks that run at specific times or intervals using standard cron expressions. It runs recurring jobs such as generating daily reports, performing nightly backups, or sending scheduled notifications. The code class name is `Cron`. This class requires an instance to schedule tasks, though it includes a static utility for verification.

## Understanding cron expressions

A cron expression is a string of five or six fields separated by spaces that represents a time schedule. Each field specifies a unit of time:

```
┌─────────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌─────────── day of month (1 - 31)
│ │ │ ┌───────── month (1 - 12)
│ │ │ │ ┌─────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

### Special characters

* `*` represents "every" (such as every hour when used in the hour field).
* `,` specifies a list of values (such as `1,15,30` to trigger at minutes 1, 15, and 30).
* `-` defines a range of values (such as `9-17` to trigger every hour from 9 AM to 5 PM).
* `/` specifies step values (such as `*/15` to trigger every 15 minutes).

## Static functions

### `validate`

Checks if a cron expression string is syntactically valid.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>expression</code></td><td>The cron expression to validate.</td><td>string</td></tr></tbody></table>

#### Output

Returns `true` if the expression is valid, or `false` if invalid.

#### Example

```yaml
# expression
0 9 * * 1-5
```

## Instance functions

### `create`

Constructs a new, empty cron scheduler instance. Define and start the task using the `schedule` function.

#### Parameters

None.

#### Output

Returns the cron instance.

### `schedule`

Defines a task and schedules it to run based on a cron expression. The scheduler starts automatically when you call this function.

#### Parameters

<table><thead><tr><th width="150">Input</th><th width="120">Key</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>expression</code></td><td></td><td>A valid cron expression string.</td><td>string</td></tr><tr><td><code>listener</code></td><td></td><td>The callback that executes each time the schedule triggers. Payload: <code>&lt;callback&gt;</code>.</td><td>callback</td></tr><tr><td><code>options</code></td><td><code>timezone</code></td><td>The timezone for the schedule (such as <code>America/New_York</code> or <code>Europe/Berlin</code>). If omitted, the client uses the server's local timezone.</td><td>string</td></tr><tr><td></td><td><code>noOverlap</code></td><td>Prevents the task from starting a new execution while the previous execution is still running. Default false.</td><td>boolean</td></tr><tr><td></td><td><code>maxExecutions</code></td><td>Limits the total number of times the task runs.</td><td>integer</td></tr></tbody></table>

#### Output

Returns the string `scheduled`.

#### Examples

Example 1: Run a task every 15 minutes

```yaml
# expression
*/15 * * * *
# listener
<callback>
```

Example 2: Run a task at 9:00 AM and 5:00 PM every day

```yaml
# expression
0 9,17 * * *
# listener
<callback>
```

Example 3: Run a cleanup job at 1:30 AM every Saturday and Sunday

```yaml
# expression
30 1 * * 6,0
# listener
<callback>
```

### `start`

Starts the task scheduler. Call this function if you previously stopped the scheduler using `stop`. This function does nothing if the scheduler is already running.

#### Parameters

None.

#### Output

Returns nothing.

### `stop`

Stops the task scheduler. The scheduled task does not run again until you call `start`.

#### Parameters

None.

#### Output

Returns nothing.

### `execute`

Executes the task callback immediately outside of its regular schedule. Use this function for testing or triggering on-demand runs.

#### Parameters

None.

#### Output

Returns nothing.

### `getStatus`

Retrieves the current lifecycle state of the task.

#### Parameters

None.

#### Output

Returns a string representing the current state:

* `stopped`: The scheduler is not running.
* `idle`: The scheduler is running, but the task is not executing.
* `running`: The task is actively executing.
* `destroyed`: The task is permanently removed.

### `getNextRun`

Retrieves the next scheduled run time for the task.

#### Parameters

None.

#### Output

Returns a date object representing the next run time, or `null` if the task is stopped or destroyed.

### `destroy`

Permanently deactivates the task and cleans up internal resources. You cannot restart a destroyed task.

{% hint style="danger" %}
#### Irreversible action

Destroying a task removes its configuration permanently.
{% endhint %}

#### Parameters

None.

#### Output

Returns nothing.
