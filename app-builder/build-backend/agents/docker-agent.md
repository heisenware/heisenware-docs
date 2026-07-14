# Docker Agent

The Docker Agent provides the same functionality as the [Native Agent](native-agent.md) but runs in an isolated Docker container. It is the right choice for edge gateways or servers where you already manage your infrastructure with Docker.

## Key differences

* **Containerized execution**: Runs in an isolated Docker container instead of directly on the host operating system.
* **Environment configuration**: Unlike the Native Agent, the Docker Agent does not include built-in credentials. Provide them as environment variables at startup.
* **Hardware and network access**: To reach local networks, USB devices, or persist data, use standard Docker features like host networking or volume mounting.
* **Platform independent**: Runs on any platform that supports Docker.

## Where to get it

The Docker Agent is available as a publicly downloadable image:

```
heisenware/docker-agent:<version>
```

Find all available versions on [Docker Hub](https://hub.docker.com/r/heisenware/docker-agent).

## How to use it

Configure the following environment variables when running the container:

```bash
docker run -it \
-e HW_DOMAIN=<account>.<workspace> \
-e HW_BROKER=mqtts://<account>.heisenware.cloud \
-e HW_USERNAME=<username> \
-e HW_PASSWORD=<password> \
-e HW_AGENT_ID=<unique-id> \
heisenware/docker-agent:v91-slim
```

### Retrieving credentials

To get `HW_USERNAME` and `HW_PASSWORD`, first add a [VRPC integration](../../../app-manager/inbound-integrations.md#vrpc-client) in the App Manager.

### Example

For an account named `my-company`, an integration with the username `agentRunner`, and the password `secret`:

```bash
docker run -it \
-e HW_DOMAIN=my-company.default \
-e HW_BROKER=mqtts://my-company.heisenware.cloud \
-e HW_USERNAME=agentRunner \
-e HW_PASSWORD=secret \
-e HW_AGENT_ID=my-agent-1 \
heisenware/docker-agent:v91-slim
```

Once the connection is established, the console shows a confirmation screen indicating the Agent is online and connected to the workspace.

<figure><img src="../../../.gitbook/assets/image (489).png" alt=""><figcaption></figcaption></figure>

## Persisting data

To keep your data and configurations (such as created instances) across container restarts or updates, mount the `/shared` volume to a persistent location on your host machine:

```bash
-v /path/on/host:/shared
```
