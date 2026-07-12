# Extension nodes

Extension nodes process data directly in a flow, without adding full function blocks. They attach to a function's output or to another extension node and act on the data passing through. This lets you build pipelines like filter to modifier, modifier to filter, or modifier to modifier to recorder.

An extension node behaves like an output of its own: wire it to function inputs, triggers, or widgets, exactly as you would wire the function output itself.

There are four types:

<table><thead><tr><th width="200">Type</th><th>What it does</th></tr></thead><tbody><tr><td><a href="modifier.md"><strong>Modifier</strong></a></td><td>Transforms the structure or value of the data, using JSONata or a JavaScript expression.</td></tr><tr><td><a href="filter.md"><strong>Filter</strong></a></td><td>Acts as a conditional gate: halts the flow or branches it based on a JavaScript condition.</td></tr><tr><td><a href="recorder.md"><strong>Recorder</strong></a></td><td>Stores the output as timeseries data in the internal InfluxDB.</td></tr><tr><td><a href="error-handler.md"><strong>Error handler</strong></a></td><td>Opens a separate output that only activates when the function fails, enabling dedicated error logic. Attaches directly to a function only, not to other extension nodes.</td></tr></tbody></table>

## Working with extension nodes

* **Add**: Click the + icon on a function's output or on an existing extension node and select the desired type. You can add multiple parallel extension nodes to the same output.
* **Chain**: Add an extension node to the output of another extension node to create a multi-step pipeline (e.g., filter data, then modify it).
* **Test**: Extension nodes show their last result directly below them. Click the icon of a modifier or filter to evaluate it manually during development.
* **Delete**: Right-click an extension node and select Delete.
