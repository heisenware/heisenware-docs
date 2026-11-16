# Custom add-ons

Your own code joins the platform as an [add-on](../reference/functions/add-ons/README.md): a program that offers its classes on the bus, so that its functions appear in the [Functions explorer](../app-builder/explorers/functions.md) and go onto the Flowboard like the platform's own. You write a plain class; [VRPC](vrpc/README.md) does the rest. There is no API to learn.

Node.js is the usual choice, and the scaffold below is Node.js. Any language VRPC has a library for works: Python and C++ too.

## What the platform gives your program

Whether your code runs inside the platform or on your own machine, it gets the same four values and needs nothing else:

| Variable | What it is |
| --- | --- |
| `HW_DOMAIN` | the workspace, `<account>.<workspace>` |
| `HW_BROKER` | the broker to connect to |
| `HW_USERNAME` | a login of that workspace |
| `HW_PASSWORD` | its password |

Your program starts a `VrpcAgent` with them, registers its classes, and serves. The agent name it chooses is the name the Functions explorer lists it under.

## Writing the class

A scaffold to start from: [heisenware-docker-extension-starter-js](https://github.com/heisenware/heisenware-docker-extension-starter-js). [Download it](https://github.com/heisenware/heisenware-docker-extension-starter-js/archive/refs/heads/master.zip), put your code in, and put it under your own version control.

### The JSDoc is the interface

What you document is what a member sees. The platform reads your JSDoc and builds the executor from it: the description on hover, the inputs, the outputs.

* **Every `@param` becomes an input**, in the order of the signature. Its name and its type are what the member reads.
* **A dotted `@param` folds into its parent**: document `@param {Object} options` before `@param {string} options.mode`, or the dotted one is dropped and the member never sees it.
* **A `@param` of function type becomes a handler**: an input the backend calls back, with an output for each value it delivers.
* **`@returns {Registration}` makes the function an [event function](vrpc/README.md#event-functions)**, one that keeps calling its handler until it is released. A name of `on` followed by a capital letter does the same. There is no third rule.
* **`@nosideeffects`** declares a function that changes nothing anyone could observe, which is what a read-only connection may call. See [Declare what changes nothing](vrpc/README.md#declare-what-changes-nothing).

Private and protected members stay off the bus. A class without documentation still works; its member just gets unnamed inputs and no description.

## Running it inside the platform

Build your Docker image, push it where the platform can pull it ([write to us](mailto:support@heisenware.com) for a private registry), and install it from the Functions explorer's **Install Extension** button, under **Custom Extension**, by its full image name. The platform starts a container of it, hands it the four values above, and mounts the workspace's shared files at `/shared`. Its login appears with the workspace's other [integrations](../app-manager/integrations.md).

Your classes are in the Functions explorer as soon as the container is up. Installing the same image again replaces the running container, which is how you bring a new version in.

{% hint style="warning" %}
#### Your own image needs your own server

On the Heisenware cloud only Heisenware's own images may be installed, because those servers are shared. **Custom Extension** works on a dedicated server and on a [self-hosted](../self-hosting/README.md) platform; elsewhere the install is refused with "Own Docker images run on your own server only". Running the same image outside the platform always works.
{% endhint %}

Instances your classes create persist if your code writes them down, which the scaffold does with VRPC's persistor into `/shared`. They come back when the container restarts, and you find them in the [Files explorer](../app-builder/explorers/files.md).

## Running it outside the platform

Useful when your code has to reach a local network, when it needs hardware the platform has not got, or when you are on the cloud and the image is your own. You run it; the platform sees an agent like any other.

Make a VRPC integration of the workspace for it: App Manager → [Integrations](../app-manager/integrations.md) → **Add** → VRPC client. It gives you a username and a password.

```bash
docker run -it \
  -e HW_DOMAIN=acme.default \
  -e HW_BROKER=mqtts://acme.heisenware.cloud \
  -e HW_USERNAME=agentRunner@acme.default \
  -e HW_PASSWORD=<the password> \
  myaccount/myimage:1.0.0
```

The connection is outbound only, so nothing has to be opened in your firewall.

Once it connects, the agent is in the App Manager's [Agents panel](../app-manager/agents/README.md) as an unmanaged agent: the platform shows its status and when it was last seen, but its software is yours to update.

<figure><img src="../.gitbook/assets/image (48).png" alt="An add-on's console output after it connected to the workspace"><figcaption></figcaption></figure>
