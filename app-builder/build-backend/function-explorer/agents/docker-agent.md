# Docker Agent

The Docker Agent provides the same core functionality as the Native Agent but is designed for containerized environments. It is the ideal choice for edge gateways or servers where you already manage your infrastructure using Docker.

### Key Differences

* **Containerized execution**: It runs within an isolated Docker container rather than directly on the host operating system.
* **Environment configuration**: Unlike the Native Agent, credentials are not "baked in." You must provide them via environmental variables during startup.
* **Hardware & network access**: To reach local networks, USB devices, or persist data, you use standard Docker features (like host networking or volume mounting).
* **Platform independent**: It runs on any platform that supports Docker, providing a consistent deployment model across different hardware.

### Where to get it?

Our Docker agent is available as a publicly downloadable image:

```
heisenware/docker-agent:<version>
```

You can find a list of all available versions on [Docker Hub](https://hub.docker.com/r/heisenware/docker-agent).

### How to use it

Setting up the Docker Agent is straightforward. You simply need to configure the following environment variables when running the container:

```bash
docker run -it \
-e HW_DOMAIN=<account>.<workspace> \
-e HW_BROKER=mqtts://<account>.heisenware.cloud \
-e HW_USERNAME=<username> \
-e HW_PASSWORD=<password> \
-e HW_AGENT_ID=<unique-id> \
heisenware/docker-agent:v91-slim
```

#### **Retrieving Credentials**

To get your `HW_USERNAME` and `HW_PASSWORD`, you must first add a [VRPC Integration](https://docs.heisenware.com/app-manager/overview-and-dashboard/integrations-external-clients#connecting-mqtt-and-vrpc-clients) in the App Manager.

**Example**

For an account named `my-company`, an integration with the username `agentRunner`, and the password `secret`, the command would look like this:

```bash
docker run -it \
-e HW_DOMAIN=my-company.default \
-e HW_BROKER=mqtts://my-company.heisenware.cloud \
-e HW_USERNAME=agentRunner \
-e HW_PASSWORD=secret \
-e HW_AGENT_ID=my-agent-1 \
heisenware/docker-agent:v91-slim
```

Once the connection is successfully established, your console will show a confirmation screen (see below) indicating the agent is online and connected to the workspace.

<figure><img src="../../../../.gitbook/assets/image (489).png" alt=""><figcaption></figcaption></figure>

### Persisting Data

To ensure your data and configurations (such as created instances) persist across container restarts or updates, you must mount the `/shared` volume to a persistent location on your host machine.
