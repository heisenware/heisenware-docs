# Cron

With cron, you schedule tasks that run automatically at specific times or intervals, defined in the standard cron expression format. This is useful for recurring jobs such as generating daily reports, performing nightly backups, or sending scheduled notifications.

## Understanding cron expressions

A cron expression is a string of five or six fields separated by spaces, representing a time schedule. Each field specifies a different unit of time.

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

* `*` represents "every". For example, `*` in the hour field means "every hour".
* `,` specifies a list of values. For example, `1,15,30` in the minute field means "at minutes 1, 15, and 30".
* `-` defines a range of values. For example, `9-17` in the hour field means "every hour from 9 AM to 5 PM".
* `/` specifies step values. For example, `*/15` in the minute field means "every 15 minutes".

## Static functions

These functions are called directly on the class and do not require you to create an instance.

### `validate`

Checks if a cron expression string is syntactically valid.

#### Parameters

<table><thead><tr><th width="120">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>expression</code></td><td>The cron expression to validate.</td><td>string</td></tr></tbody></table>

#### Example

```yaml
# expression
0 9 * * 1-5
```

#### Output

Returns `true` if the expression is valid, `false` otherwise.

## Instance functions

You must create an instance to use these functions.

### `create`

Creates a new, empty cron scheduler instance. The task itself is defined and started using the `schedule` function.

### `schedule`

Defines a task and schedules it to run based on a cron expression. The scheduler starts automatically when this function is called.

#### Parameters

<table><thead><tr><th width="150">Parameter</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>expression</code></td><td>A valid cron expression.</td><td>string</td></tr><tr><td><code>listener</code></td><td>The function that is executed each time the schedule is triggered.</td><td>function</td></tr><tr><td><code>options</code></td><td>Optional settings for advanced control. See below.</td><td>object</td></tr></tbody></table>

Available options:

<table><thead><tr><th width="150">Option</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>timezone</code></td><td>The timezone for the schedule, for example <code>America/New_York</code> or <code>Europe/Berlin</code>. If not set, the server's local timezone is used.</td><td>string</td></tr><tr><td><code>noOverlap</code></td><td>If <code>true</code>, prevents the task from starting a new execution while the previous one is still running. Default is <code>false</code>.</td><td>boolean</td></tr><tr><td><code>maxExecutions</code></td><td>Limits the total number of times the task runs.</td><td>integer</td></tr></tbody></table>

#### Examples

Run a task every 15 minutes:

```yaml
# expression
*/15 * * * *
# listener
<callback>
```

Run a task at 9:00 AM and 5:00 PM every day:

```yaml
# expression
0 9,17 * * *
# listener
<callback>
```

Run a cleanup job at 1:30 AM every Saturday and Sunday:

```yaml
# expression
30 1 * * 6,0
# listener
<callback>
```

#### Output

Returns the string `scheduled`.

### `start`

Starts the task scheduler. You only need to call this if you have previously called `stop`, since `schedule` starts the task automatically. Does nothing when already started.

### `stop`

Stops the task scheduler. The scheduled task will not run again until `start` is called.

### `getStatus`

Provides the current lifecycle state of the task. This is useful for monitoring or debugging.

#### Output

A string representing the current state:

* `stopped`: The scheduler is not running.
* `idle`: The scheduler is running, the task is not currently executing.
* `running`: The task is actively executing.
* `destroyed`: The task has been permanently removed.

### `destroy`

Permanently deactivates the task and cleans up all internal resources. A destroyed task cannot be restarted.

### `execute`

Manually executes the task's function immediately, outside of its regular schedule. This is useful for testing or triggering on-demand runs.

### `getNextRun`

Returns the next scheduled run time for the task.

#### Output

A date object representing the next run time, or `null` if the task is stopped or destroyed.
