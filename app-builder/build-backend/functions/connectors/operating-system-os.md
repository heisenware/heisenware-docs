# Operating system

The `OS` class provides a collection of static utility functions for retrieving live performance metrics and hardware information from the underlying operating system. It monitors CPU utilization, memory allocation, storage availability, network throughput, and running Docker container states. 

Because all functions in this class are static, they do not manage state. You do not need to create or delete an instance to use them.

## System metrics

### `cpuUsage`

Retrieves the current overall CPU utilization as a percentage.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>interval</code></td><td>The measurement window in milliseconds over which to calculate utilization. Default 1000.</td><td>integer</td></tr></tbody></table>

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

Retrieves the system load averages for the past 1, 5, and 15 minutes, normalized by the total number of available logical CPU cores.

{% hint style="info" %}
#### Platform limitation
Load averages are a Unix-specific metric. When executed on a Windows runtime environment, this function always returns `[0, 0, 0]`.
{% endhint %}

#### Parameters

None.

#### Output

Returns an array of three numbers representing the normalized system load averages.

### `driveInfo`

Retrieves capacity and utilization metrics for the system's primary disk drive.

#### Parameters

None.

#### Output

Returns an object containing disk storage statistics:

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

Retrieves resource allocation and utilization metrics for the system's physical memory.

#### Parameters

None.

#### Output

Returns an object containing physical RAM capacity and allocation statistics:

```json
{
  "totalMemMb": 16384,
  "usedMemMb": 8192,
  "freeMemMb": 8192,
  "freeMemPercentage": 50
}
```

### `netInfo`

Retrieves network input and output throughput statistics aggregated across active network interfaces.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>interval</code></td><td>The measurement window in milliseconds over which to calculate network throughput. Default 1000.</td><td>integer</td></tr></tbody></table>

#### Output

Returns an object detailing input and output metrics in megabytes for each network interface alongside a combined total:

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

Retrieves the total operational uptime of the operating system.

#### Parameters

None.

#### Output

Returns an object breaking down system uptime into explicit chronological increments alongside the absolute duration in seconds:

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

Retrieves the platform name of the underlying operating system.

#### Parameters

None.

#### Output

Returns a string containing the operating system identifier (such as `Linux`, `macOS`, or `Windows_NT`).

### `hostname`

Retrieves the assigned network hostname of the local system.

#### Parameters

None.

#### Output

Returns a string containing the system hostname.

## Container management

### `containerStats`

Retrieves live resource utilization and status metrics for all running Docker containers, matching the output behavior of the standard `docker stats` command.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>socketPath</code></td><td>The local file system path pointing to the Docker daemon socket communication interface. Default <code>'/var/run/docker.sock'</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of objects detailing container execution statistics, processing allocations, and calculated memory usage with inactive file cache overhead automatically removed:

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

#### Example

```yaml
# socketPath
'/var/run/docker.sock'
```

### `containerInfo`

Retrieves comprehensive low-level configuration and state metadata profiles for all running Docker containers, matching the behavior of the `docker inspect` command.

#### Parameters

<table><thead><tr><th width="120">Input</th><th>Description</th><th width="100">Type</th></tr></thead><tbody><tr><td><code>socketPath</code></td><td>The local file system path pointing to the Docker daemon socket communication interface. Default <code>'/var/run/docker.sock'</code>.</td><td>string</td></tr></tbody></table>

#### Output

Returns an array of detailed inspection objects containing container configuration profiles, layer settings, storage volume bindings, and internal network maps.

#### Example

```yaml
# socketPath
'/var/run/docker.sock'
