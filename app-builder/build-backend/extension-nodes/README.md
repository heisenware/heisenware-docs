# Extension nodes

Extension nodes process data directly within a flow without requiring a full function node. They attach to a function output or to another extension node to act on the data passing through. This lets you build processing pipelines by chaining nodes together, such as connecting a filter to a modifier, or a modifier to another modifier.

Except for recorders, extension nodes operate as their own output. You can wire them to function inputs, triggers, or widgets exactly like a standard function output.

To branch a single data source into multiple concurrent paths, attach multiple extension nodes to the same output in parallel.

## Types

<table><thead><tr><th width="137.0369873046875">Type</th><th>What it does</th></tr></thead><tbody><tr><td><a href="modifier.md"><strong>Modifier</strong></a></td><td>Transforms the structure or value of the data, using JSONata or a JavaScript expression.</td></tr><tr><td><a href="filter.md"><strong>Filter</strong></a></td><td>Acts as a conditional gate: halts the flow or branches it based on a JavaScript condition.</td></tr><tr><td><a href="recorder.md"><strong>Recorder</strong></a></td><td>Stores the output as timeseries data in the internal InfluxDB database.</td></tr><tr><td><a href="error-handler.md"><strong>Error handler</strong></a></td><td>Opens a separate output that activates only when the parent function fails, enabling dedicated error logic. You can only attach an error handler directly to a function, not to other extension nodes.</td></tr></tbody></table>

## Working with extension nodes

* **Add**: Click the + icon on a function's output or on an existing extension node and select the desired type. You can add multiple parallel extension nodes to the same output.
* **Chain**: Add an extension node to the output of another extension node to create a multi-step pipeline (e.g., filter data, then modify it).
* **Test**: Extension nodes show their last result directly below them. Click the icon of a modifier or filter to evaluate it manually during development.
* **Delete**: Right-click an extension node and select Delete.
