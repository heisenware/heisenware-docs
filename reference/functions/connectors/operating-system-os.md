# Operating system (OS)

The operating system connector reads live metrics of the machine it runs on: CPU, memory, disk, network, uptime and the Docker containers there. Every function is static, so no instance is needed.

What you measure depends on the executor's address. On an internal agent of the platform you see the platform's own container; on a [native, Docker or LXC agent](../../../concepts/agents-and-where-code-runs.md) you see the machine or container the agent runs on, which is what a dashboard of your own hardware wants.

## System metrics

### `cpuUsage`

Retrieves the current overall CPU utilization as a percentage.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>interval</code></td><td>The measurement window in milliseconds used to calculate utilization. Default 1000.</td><td>integer</td></tr></tbody></table>

#### Output

Returns a number representing the total CPU usage percentage.

#### Example

```yaml
# interval
2000
```

### `cpuCount`

Retrieves the total number of logical CPU cores available on the system.

#### Parameters

None.

#### Output

Returns an integer representing the core count.

### `loadAverage`

Retrieves system load averages for the past 1, 5, and 15 minutes, normalized by the total number of available logical CPU cores.

{% hint style="info" %}
#### Platform limitation

Load averages are a Unix-specific metric. On Windows, this function always returns `[0, 0, 0]`.
{% endhint %}

#### Parameters

None.

#### Output

Returns an array of three numbers representing the normalized system load averages.

### `driveInfo`

Retrieves how full the main drive is.

#### Parameters

None.

#### Output

Returns the drive's size in gigabytes and in percent:

```json
{
  "totalGb": "930.85",
  "usedGb": "450.20",
  "freeGb": "480.65",
  "usedPercentage": 48.37,
  "freePercentage": 51.63
}
```

### `memInfo`

Retrieves how much of the physical memory is in use.

#### Parameters

None.

#### Output

Returns the memory in megabytes and in percent:

```json
{
  "totalMemMb": 16384,
  "usedMemMb": 8192,
  "freeMemMb": 8192,
  "usedMemPercentage": 50,
  "freeMemPercentage": 50
}
```

### `netInfo`

Retrieves how much data went in and out over the measurement window, per interface.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>interval</code></td><td>The measurement window in milliseconds used to calculate network throughput. Default 1000.</td><td>integer</td></tr></tbody></table>

#### Output

Returns one entry per interface, in megabytes, plus their total:

```json
{
  "total": {
    "inputMb": "0.15",
    "outputMb": "0.05"
  },
  "eth0": {
    "inputMb": "0.15",
    "outputMb": "0.05"
  }
}
```

#### Example

```yaml
# interval
1000
```

### `uptime`

Retrieves how long the operating system has been running.

#### Parameters

None.

#### Output

Returns the uptime broken into years, days, hours, minutes and seconds, and in seconds as `totalSeconds`:

```json
{
  "y": 0,
  "d": 14,
  "h": 6,
  "m": 32,
  "s": 15,
  "totalSeconds": 1233135
}
```

### `os`

Retrieves the name of the host's operating system.

#### Parameters

None.

#### Output

Returns the distribution and its version, such as `Ubuntu 22.04` or `macOS 14.4`. Where the system does not say, the answer is what `uname -sr` reports.

### `hostname`

Retrieves the hostname of the machine.

#### Parameters

None.

#### Output

Returns a string containing the system hostname.

## Container management

Both functions talk to the Docker daemon of the host through its socket. They work where the agent reaches that socket, which means a native, Docker or LXC agent on a machine that runs Docker; an unreachable socket fails the call.

### `containerStats`

Retrieves live resource utilization and status metrics for all running Docker containers, as `docker stats` does. Memory is reported with the inactive file cache taken off, so the numbers match the Docker CLI.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>socketPath</code></td><td>The file system path to the Docker daemon socket. Default <code>'/var/run/docker.sock'</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns one object per running container:

```json
[
  {
    "id": "a1b2c3d4e5f6",
    "name": "my-app-container",
    "state": "running",
    "status": "Up 2 weeks",
    "created": 1678886400,
    "usedMemory": "150.25 MiB",
    "availableMemory": "7.79 GiB",
    "memoryUsage": "1.89 %",
    "cpuUsage": "5.12 %",
    "numberCpus": 8
  }
]
```

### `containerInfo`

Retrieves what `docker inspect` tells about every running container: its configuration and its state.

#### Parameters

<table><thead><tr><th width="150">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>socketPath</code></td><td>The file system path to the Docker daemon socket. Default <code>'/var/run/docker.sock'</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns the `docker inspect` result of every running container: its configuration, image layers, volume bindings and networks.
