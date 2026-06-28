# Simple Agent

This is a very simple example demonstrating the basic steps needed to make existing C++ code remotely callable.

{% hint style="info" %}
In order to follow this example from scratch, create a new directory (e.g. vrpc-foo-agent) and cd into it.

```bash
mkdir vrpc-foo-agent
cd vrpc-foo-agent
```

Next, download and unpack the VRPC C++ tarball (containing the header-only library):

```bash
wget https://vrpc.io/vrpc-3.0.0.tar.gz
tar -xzf vrpc.tar.gz
```

Finally create a directory `src` and you are good to go.
{% endhint %}

{% stepper %}
{% step %}
### Existing C++ code

We pretend that the code below already existed and should be made remotely accessible.

_src/Foo.hpp_

```cpp
class Foo {
  int _value = 0;

 public:
  Foo() = default;

  int getValue() const { return _value; }

  void setValue(int value) { _value = value; }
};
```
{% endstep %}

{% step %}
### Make it accessible from remote

We are going to produce an executable that starts an agent and sits waiting until it receives remote requests to call functions. Hence, we have to provide a `main.cpp` file.

_src/main.cpp_

```cpp
#include <vrpc/adapter.hpp>
#include <vrpc/agent.hpp>

#include "Foo.hpp"

// always define the adapter macros in the vrpc namespace
namespace vrpc {

// Adapt constructor
// Needs: class, [arg1-type, [arg2-type...]]
VRPC_CTOR(Foo);

// Adapt const member function
// Needs: class, return-type, function, [arg1-type, [arg2-type...]]
VRPC_CONST_MEMBER_FUNCTION(Foo, int, getValue)

// Adapt non-const member function
// Needs: class, return-type, function, [arg1-type, [arg2-type...]]
VRPC_MEMBER_FUNCTION(Foo, void, setValue, int)
}  // namespace vrpc

int main(int argc, char** argv) {
  auto agent = vrpc::VrpcAgent::from_commandline(argc, argv);
  if (agent) agent->serve();
  return EXIT_SUCCESS;
}
```

Making functions remotely available takes nothing more than filling in some macros. See the reference documentation for all details.

{% hint style="warning" %}
**IMPORTANT**

Always define the macros in the `vrpc` namespace.
{% endhint %}
{% endstep %}

{% step %}
### Compilation

This very simple example can be compiled using a single command. Make sure you are sitting in the root of the example directory, then run:

```
g++ -I. -pthread -o vrpc-foo-agent src/main.cpp
```

As you can see we are telling the compiler to add the current working directory to the include path. This is needed to find the VRPC headers in the `vrpc` folder. That's already it! After some time your agent should be built and be ready to use.

Try it by simply running the executable in an all-default setting (using the free vrpc.io broker and the default `vrpc` domain):

```
./vrpc-foo-agent
```

Once you see the line

```
Connecting to message broker... [OK]
```

appearing in your terminal, you made it and your C++ code is remotely callable!

#### TLS

When you want to use a TLS encrypted connection you can do so by compiling:

```
g++ -I. -DVRPC_USE_TLS -pthread -o vrpc-foo-agent src/main.cpp -lssl -lcrypto
```
{% endstep %}
{% endstepper %}

## Usage with Heisenware Platform

{% hint style="danger" %}
We will update this chapter soon, the information here is outdated.
{% endhint %}

For any agent to work, you must provide it with a valid domain and access token. You get an access token from your [Admin Tool](https://admin.heisenware.cloud/) using the _Access Control_ tab.

Simply copy the default _Agent Token_ or create a new one and use this.

Having that you are ready to make the communication to your agent private:

```
./vrpc-foo-agent -d <yourDomain> -t <yourToken> -b ssl://heisenware.cloud
```

In case of success you should see an output similar to this:

```
Domain          : <yourDomain>
Agent           : <yourAgent>
Broker          : ssl://heisenware.cloud:8883
------
Connecting to message broker... [OK]
```

Now, your agent code runs under your private domain and anyone wanting to communicate to it needs to be in the same domain and having a valid access token to do so. Using the [VRPC App](https://app.vrpc.io/) you may even generate access tokens with detailed access rights down to a per-function level.

**IMPORTANT**

{% hint style="info" %}
Use `heisenware.cloud` as broker host when working with professional Heisenware accounts.
{% endhint %}
