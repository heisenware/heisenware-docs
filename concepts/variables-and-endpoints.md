---
description: >-
  Named values and named actions: when to use a variable instead of a wire, the built-in variables, secrets, and endpoints as an App's public contract.
---

# Variables and endpoints

A **variable** is a named value of the App, used as `$name`. An **endpoint** is an executor published under a stable name so that others can run it. Together they are what an App shows to the outside: **endpoints are the actions, variables are the values.**

## Variables

### Wire or variable

Wires are the default: the line on the Flowboard shows where a value goes. Use a variable when:

* a value with a natural name is needed in two or more distant places, such as the selected machine;
* the value is needed inside an [expression](../app-builder/flowboard/modifier.md) or inside a text;
* a wire would cross [sections](../app-builder/flowboard/README.md) or run across the whole Flowboard.

{% hint style="warning" %}
A variable does not run anything. "When X happens, do Y" is a job for a [trigger](triggers-and-wires.md). An executor reacts to a variable only through a hot input that reads it: the input receives the new value, and that runs the executor.
{% endhint %}

### Static and runtime variables

* A **static variable** is a constant you set once: an address, a limit, a credential.
* A **runtime variable** is written by your logic: an output or an [extension](extensions-branching-and-errors.md) publishes its value into the variable (**Make variable…**). Its shared value survives restarts of the App and deployments. A user's own value lives as long as that user is connected.

Widgets do not write variables. A widget writes an input; from there a modifier picks what you need and publishes it. For example, a form's content arrives at an executor, and a modifier with `x.machine` publishes `$machine`.

Variables follow [scopes](scopes.md). A variable a user's action wrote holds that user's value, and every other user still reads the shared one or the default.

### Using a variable

* **In an input**: type `$machine` as the whole value, or `${machine}` inside a text: `Line 2: ${machine} stopped`. **Insert Variable** in an input's menu lists what exists.
* **In an expression**: `$machine` is a value you compute with: `x.filter(row => row.machine === $machine)`. It is never text that is pasted in.
* **In an address**: `$machines` in the agent or instance box. See [Addresses](executors-and-instances.md#addresses-where-a-call-goes).

A variable keeps the type it was given. `810` the number and `'810'` the text are different values, and a database column of text will not match the number. Check the type when a comparison silently finds nothing.

### Secrets

A **secret** is a variable whose value is masked wherever it is shown. Every credential belongs in a secret static variable, not in an input. A secret is not part of an exported [bundle](../app-builder/test-and-deploy.md): after an import, you enter it again.

### Built-in variables

Three variables exist in every App. They are computed, not stored, and you cannot write them.

| Variable | Holds | Example |
| --- | --- | --- |
| `$USER` | the user in whose scope the run happens | `ada@acme.com` |
| `$LOCALE` | the App's language | `de-DE` |
| `$TIMEZONE` | the time zone of that user's browser | `Europe/Berlin` |

`$USER` and `$TIMEZONE` are empty when no user is involved: at App start, in a poll, in an event from a machine. `$LOCALE` is always set. See [Scopes](scopes.md#who-is-the-user) and [Languages and time zones](languages-and-time-zones.md).

Manage variables in the [Variables explorer](../app-builder/explorers/variables.md).

## Endpoints

An endpoint publishes one executor under a name, such as `startOrder`. Whoever calls the endpoint fills the executor's inputs, runs it and gets its result. The name is a promise: you can rebuild the logic behind it, and callers notice nothing.

Create an endpoint when someone outside the Flowboard needs to run something:

* **Another App** of the workspace. Instead of reaching into the other App's logic, it calls the endpoint. See [Suites of Apps](suites-of-apps.md).
* **An external system** connected through an [integration](../app-manager/integrations.md).
* **Ask.** The AI that answers an App's users runs the App's endpoints as the user. See [Ask](../app-manager/ask.md).

### An endpoint is a contract

* **Describe it.** The description says what the endpoint does and what it changes. People and AI decide by it whether to call.
* **Ask the user first** stays ticked for everything that changes something. Ask then runs the endpoint only after the user has confirmed that one call. Untick it only for endpoints that merely read or open a page.
* **Test it** the way a caller will use it before you hand out its name.

With Ask switched on, an App's contract is every endpoint and every variable that is not a secret. A value no user should read belongs in a secret.

Publish and manage endpoints in the [Endpoints explorer](../app-builder/explorers/endpoints.md).
