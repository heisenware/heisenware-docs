# Operating System (OS)

The `OS` class is a collection of static utility functions for retrieving key metrics and information about the underlying operating system. It can report on CPU, memory, drive space, network activity, and even inspect running Docker containers.

Since all methods in this class are static, you do not need to create an instance of it.

***

#### cpuUsage

Retrieves the current overall CPU usage as a percentage.

Parameters

* `interval`: An optional interval in milliseconds over which to measure the usage. Defaults to `1000`.

Example

```yaml
# interval
2000
```

Output

A number representing the CPU usage percentage (e.g., 15.5).

***

#### cpuCount

Returns the number of logical CPU cores available on the system.

Output

The total number of CPUs (e.g., 8).

***

#### loadAverage

Returns the 1, 5, and 15-minute system load averages, normalized by the number of CPU cores.

Note: This is a Unix-specific concept. On Windows, the return value is always `[0, 0, 0]`.

Output

An array of three numbers representing the load averages for the last 1, 5, and 15 minutes, respectively.

***

#### driveInfo

Retrieves usage information for the primary disk drive.

Output

An object containing drive space details. For example:

```json
{
  "totalGb": "930.85",
  "usedGb": "450.20",
  "freeGb": "480.65",
  "usedPercentage": 48.37,
  "freePercentage": 51.63
}
```

***

#### memInfo

Retrieves information about the system's physical memory usage.

Output

An object containing memory details. For example:

```json
{
  "totalMemMb": 16384,
  "usedMemMb": 8192,
  "freeMemMb": 8192,
  "freeMemPercentage": 50
}
```

***

#### netInfo

Retrieves network input/output statistics for all network interfaces.

Parameters

* `interval`: An optional interval in milliseconds over which to measure the statistics. Defaults to `1000`.

Output

An object detailing the input and output in megabytes for each network interface and a combined total. For example:

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

***

#### uptime

Retrieves the system uptime.

Output

An object containing the uptime broken down into years, days, hours, minutes, and seconds, as well as the total uptime in seconds.

***

#### os

Retrieves the name of the operating system.

Output

A string containing the OS name (e.g., Linux, macOS, Windows\_NT).

***

#### hostname

Retrieves the system's hostname.

Output

A string containing the hostname.

***

#### containerStats

Retrieves live performance statistics for all running Docker containers, similar to the `docker stats` command.

Parameters

* `socketPath`: An optional path to the Docker socket file. Defaults to `/var/run/docker.sock`.

Output

An array of objects, where each object represents a running container and includes its key performance stats. For example:

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

***

#### containerInfo

Retrieves detailed information about all running Docker containers, equivalent to running the `docker inspect` command for each container.

Parameters

* `socketPath`: An optional path to the Docker socket file. Defaults to `/var/run/docker.sock`.

Output

An array of large JSON objects, where each object contains the full inspect output for a container, including network settings, volumes, configuration, and state.

