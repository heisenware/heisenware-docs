# Cron

The `Cron` class provides a powerful and convenient way to schedule tasks that run automatically at specific times or intervals. It is a wrapper around the popular `node-cron` library, allowing you to define schedules using the standard **cron expression** format.

This is useful for automating recurring jobs, such as generating daily reports, performing nightly backups, or sending out scheduled notifications.

## Understanding Cron Expressions

A cron expression is a string that consists of five or six fields separated by spaces, representing a time schedule. Each field specifies a different unit of time.

```
┌─────────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌─────────── day of month (1 - 31)
│ │ │ ┌───────── month (1 - 12)
│ │ │ │ ┌─────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *

```

**Special Characters:**

* `*`: Asterisk. Represents "every". For example, `*` in the hour field means "every hour".
* `,`: Comma. Specifies a list of values. For example, `1,15,30` in the minute field means "at minutes 1, 15, and 30".
* `-`: Hyphen. Defines a range of values. For example, `9-17` in the hour field means "every hour from 9 AM to 5 PM".
* `/`: Slash. Specifies step values. For example, `*/15` in the minute field means "every 15 minutes".

## Static Functions

These functions are called directly on the `Cron` class and do not require you to create an instance.

### validate

Checks if a cron expression string is syntactically valid.

**Parameters**

* `expression`: The cron expression to validate.

**Example**

```
# expression
'0 9 * * 1-5'

```

Output

Returns true if the expression is valid, false otherwise.

## Instance Functions

You must create an instance of the `Cron` class to use these functions.

### create

Creates a new, empty cron scheduler instance. The task itself is defined and started using the `schedule` method.

### schedule

Defines a task and schedules it to run based on a cron expression. The scheduler starts automatically when this function is called.

**Parameters**

* `expression`: A string containing a valid cron expression.
* `listener`: The function that will be executed each time the schedule is triggered.
* `options`: An optional object for advanced control.
  * `timezone`: A string specifying the timezone for the schedule (e.g., `"America/New_York"`, `"Europe/Berlin"`). If not set, it uses the server's local timezone.
  * `noOverlap`: A boolean. If `true`, it prevents the task from starting a new execution if the previous one is still running.
  * `maxExecutions`: An integer that limits the total number of times the task will run before it is automatically destroyed.

**Example 1: Run a task every 15 minutes**

```yaml
# expression
*/15 * * * *
# listener
<callback>

```

**Example 2: Run a task at 9:00 AM and 5:00 PM every day**

```yaml
# expression
0 9,17 * * *
# listener
<callback>

```

**Example 3: Run a cleanup job at 1:30 AM every Saturday and Sunday**

```yaml
# expression
30 1 * * 6,0
# listener
<callback>

```

Output

Returns the string 'scheduled'.

### start

Starts the task scheduler. **Note**: You only need to call this if you have previously called `stop()`. The `schedule` method starts the task automatically.

### stop

Stops the task scheduler. The scheduled task will not run again until `start()` is called.

### getStatus

Provides the current lifecycle state of the task. This is useful for monitoring.

Output

A string representing the current state, such as stopped, idle (running but not executing), or running (actively executing).

### destroy

Permanently deactivates the task and cleans up all internal resources. A destroyed task cannot be restarted.

### execute

Manually executes the task's function immediately, outside of its regular schedule. This is useful for testing or for triggering on-demand runs.

### getNextRun

Returns the date and time of the next scheduled execution.

Output

A JavaScript Date object representing the next run time, or null if the task is stopped or destroyed.
