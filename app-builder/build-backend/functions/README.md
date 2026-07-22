# Functions

Functions form the core building blocks of logic in your Apps. They visually represent code that retrieves data, processes information, manages databases, and controls devices.

Every function follows the same anatomy, represented by a colored box with a unique icon.

<figure><img src="../../../.gitbook/assets/image (51).png" alt=""><figcaption><p>A function merging two or more objects</p></figcaption></figure>

* [**Inputs**](./#inputs-and-data-configuration): Arguments the function requires to operate, such as a number to calculate or a string to send. The platform hides the input box if a function does not require inputs. Some functions let you add extra inputs. Click the pencil icon to modify input data via a form, or use YAML during development.
* [**Trigger**](./#triggers-and-execution-logic): The signal that executes the function, such as a button click or a data change. Click the play icon to run the function manually during development.
* [**Output**](./#outputs-and-chaining): The result of the operation, which passes to the next step in the flow. Click the x icon to clear the output during development.
* [**Extension nodes**](../extension-nodes/): Optional separate nodes that receive data from a function to filter, record, modify, or handle errors in real-time.

## Function categories

Available functions reside in the Function Explorer on the left side of the canvas. Browse them by category in their respective reference sections:

* [**Connectors**](connectors/): Integration functions for industrial protocols and external systems, including MQTT, OPC UA, Siemens S7, and SAP Digital Manufacturing.
* [**Storage**](storage/): Relational database and timeseries database classes that connect to databases. Both include a built-in internal database (PostgreSQL and InfluxDB). This category also contains lightweight data stores, such as the data store and circular buffer.
* [**Utilities**](utilities/): Classes for data processing, timers, cron jobs, barcode generation, and PDF processing.
* [**Extensions**](extensions/): Docker-based modules that extend the platform, such as RAG AI or process simulations.
* **Custom**: User-defined building blocks, including [subflows](subflows.md) and functions loaded via Custom Extensions.

## Types of functions

The platform classifies functions into four types based on how they manage state or context.

<table><thead><tr><th width="227.3770751953125">Type</th><th>Description</th></tr></thead><tbody><tr><td><strong>Static functions</strong></td><td>Standalone utilities that process data without context (for example, <code>mergeObjects</code>, <code>mapRange</code>, or <code>echo</code>).</td></tr><tr><td><strong>Member functions</strong></td><td>Actions linked to a specific instance. They use the unique configuration and connection settings stored in that instance (for example, <code>read</code>, <code>write</code>, or <code>publish</code>).</td></tr><tr><td><strong>Constructor functions</strong></td><td>Functions named <code>create</code> that configure and initialize a new instance.</td></tr><tr><td><strong>Destructor functions</strong></td><td>Functions named <code>delete</code> that remove an instance to free system resources.</td></tr></tbody></table>

{% hint style="info" %}
#### Concept example: OPC UA client

* **Class**: The generic blueprint for the OPC UA client.
* **Create a specific instance**: Use the `create` function to set an instance name and authorization details, which creates an instance such as `myMachine`.
* **Member functions**: Use the `connect` function of `myMachine` to establish a connection to a server endpoint URL, then use `read` to retrieve data. All member functions of `myMachine` share this connection.
{% endhint %}

## Work with functions on the canvas

* **Add**: Drag a function from the Function Explorer onto the canvas.
* **Sequence**: Create a flow by drawing a wire between nodes. See [Sequencing functions](../#sequencing-functions).
* **Configure**: Click a function to open its configuration panel. Use YAML for static data or data binding for dynamic data from other functions or widgets.
* **Documentation**: Click the info icon next to a function name to open its documentation panel.
* **Comment**: Right-click a function and select comment to add context.
* **Delete**: Select the function and press the Delete key, or click the trash icon.

{% hint style="danger" %}
#### Permanent deletion

Deleting a function permanently removes its configuration and all connected wires. This action cannot be undone.
{% endhint %}

### Status indicators

A colored status indicator icon appears next to each function name. Hover over the indicator to view status details:

* **Green**: Ready or normal operation.
* **Blue**: Slow execution (greater than two seconds).
* **Yellow**: The required instance does not exist.
* **Red**: An error or exception occurred.
* **Gray**: The function is offline or unavailable.

## Inputs and data configuration

Inputs determine function behavior. Provide data using three methods:

1. **Static data**: Fixed values typed directly into the function input using YAML, or configured via a form by clicking the pencil icon.
2. **Dynamic logic**: Data passed from the output, modifier, or filter of a preceding function.
3. **UI binding**: Live data mapped from a frontend widget (for example, a text field value).

<figure><img src="../../../.gitbook/assets/image (37).png" alt=""><figcaption><p>Function with input in YAML format</p></figcaption></figure>

### YAML input

The platform uses YAML for configuration because it provides a human-readable format for complex data structures.

<details>

<summary><strong>YAML cheat sheet</strong></summary>

#### Basic values (scalars)

Enter simple data types without quotes.

* **Strings**: `Hello world`. Use quotes if the string resembles a number or boolean (for example, `'123'` or `'true'`).
* **Numbers**: `101` or `3.14159`.
* **Booleans**: `true` or `false`.
* **Null**: `null` represents an empty or non-existent value.

#### Lists (arrays)

A collection of items.

*   **Block style**: Start each item on a new line with a hyphen.

    ```yaml
    - Apple
    - Orange
    - Banana
    ```
*   **Compact style**: Enclose items in square brackets.

    ```yaml
    [Apple, Orange, Banana]
    ```

#### Objects (key-value maps)

Data grouped under specific keys.

*   **Block style**: Place each key-value pair on its own line. Use indentation for nested properties.

    ```yaml
    user:
      name: Alex
      email: alex@example.com
      permissions:
        can_read: true
        can_write: false
    ```
*   **Compact style**: Enclose comma-separated key-value pairs in curly braces.

    ```yaml
    { name: Alex, email: alex@example.com }
    ```

#### Multiline strings

Use multiline strings for large text blocks, code scripts, or templates.

*   **Literal style (`|`)**: Preserves all line breaks exactly. Use this style for raw code or printer layouts (for example, ZPL).

    ```yaml
    |
      ^XA^FO30,80^BQN,2,3^FDLA,{{assetId}}#{{date}}^FS
      ^FO120,140^A0N,22,22^FD{{assetId}}#{{date}}^FS
      ^RFW,A^FD {{assetId}}^FS
      ^XZ
    ```
*   **Folded style (`>`)**: Converts single newlines into spaces, which creates a continuous sentence from multiple lines. Blank lines remain as newlines.

    ```yaml
    description: >
      This is a long description written across
      multiple lines in the editor, but processed
      as a single, continuous sentence.

      A new paragraph starts after a blank line.
    ```

</details>

{% hint style="info" %}
Right-click a function input to switch between the YAML and HTML views, or to mask the value by defining it as a secret.
{% endhint %}

### Callbacks

Most functions that use callbacks have an `on` prefix – such as `onMessage`. These functions listen continuously for external events, like an incoming MQTT message, and deliver that data through a specific nested output inside the function input. Throughout the configuration examples in these docs, this special input argument is named `listener`.

<figure><img src="../../../.gitbook/assets/image (104).png" alt="" width="563"><figcaption><p>A function with a callback listening for incoming MQTT messages in binary format</p></figcaption></figure>

## Triggers and execution logic

The trigger determines when a function runs.

### Trigger sources

* **Data-driven**: Connect a function trigger to an output, modifier, or filter. The default execution mode is update (`on output update`). Click the mode text to switch to change or true.
* **UI events**: Connect a widget event (such as a button's `on button click`) to the trigger.
* **App lifecycle**: Right-click the trigger and select App start > once on deploy, or select App stop. The trigger then displays `once when app starts` or `once when app stops`.
* **Page load and reload**: Right-click the trigger and select App start > once on (re-)load to execute the function whenever a user loads or reloads (refreshes) the App in the browser.
* **Periodically**: Right-click the trigger and select an interval under App start, from every 0.1s to every 1d.
* **Page load**: Drag a page from the Page Explorer onto the trigger to execute the function when that page loads.
* **Manual development**: Click the play icon inside the trigger to run the function manually during development.

<figure><img src="../../../.gitbook/assets/onpage_louade_looped.gif" alt="" width="563"><figcaption><p>Use page load to execute a function</p></figcaption></figure>

<figure><img src="../../../.gitbook/assets/onbuttom_click_trigger_looped.gif" alt="" width="563"><figcaption><p>Use a button click to execute a function</p></figcaption></figure>

### Sequential processing of arrays (looping)

To process an array item by item:

1. Right-click the trigger.
2. Select Process one by one.
3. Choose the input containing the target array. The trigger wire changes to a dotted line, indicating that the function executes once for each item in the list.

<details>

<summary><strong>Example: Merge an element into an array</strong></summary>

Sequential processing lets you merge a single element into each sub-array of a larger array.

The image below shows a `combine` function with its trigger configured to process one by one on its first input (`On arg 1`). The function executes for each sub-array, merging the singular element from the second input into both sub-arrays.

<figure><img src="../../../.gitbook/assets/image (26).png" alt=""><figcaption></figcaption></figure>

</details>

### Delayed execution

Add a delay between 0.1 and 2.0 seconds to any trigger to manage execution timing, such as waiting for a UI animation to complete before retrieving data.

## Outputs and chaining

The output returns the result of the function execution to pass data and control logic throughout your App.

### Return data types

Depending on the function, the output delivers:

* **Standard data**: JSON objects, strings, numbers, or arrays.
* **Binary content**: Files or images, such as generated PDF documents or camera captures.
* **Success flags**: A boolean value (`true` or `false`) indicating whether an operation, such as a database write, succeeded.

### Backend logic (flows)

Link an output to another function to create a functional flow:

* **Pass data**: Connect an output to an input to use the result of the first function as an argument for the next function.
* **Control flow**: Connect an output to a trigger so the subsequent function executes only after the first function completes successfully.

### UI interaction

Link an output directly to the frontend to drive user interface components:

* **Visualize data**: Connect the output to a display widget, such as a chart or value box.
* **Control properties**: Connect the output to a widget and select the property to control, such as dynamically setting a button to disabled.
* **Navigate screens**: Connect the output to a page switch trigger to change pages automatically based on backend logic.

## Extension nodes

Extension nodes attach to a function output to process data directly within the flow. Modifiers transform data, filters gate execution, recorders store information, and error handlers catch exceptions.

* **Add**: Click the plus icon (`+`) on an output and select an extension node type. You can attach multiple parallel extension nodes to a single output.
* **Chain**: Attach an extension node to the output of another extension node to create a multi-step data pipeline.
* **Delete**: Right-click an extension node and select Delete.

## Data binding (connecting to UI)

Functions communicate bidirectionally with frontend widgets through data binding:

* **Input binding**: Links a widget property, such as `formData`, to a function input.
* **Trigger binding**: Links a user action, such as `on button click`, to a function trigger.
* **Output binding**: Links a function result to a widget property, such as `data`, to update the user interface.

## Advanced addressing

Every function targets its underlying backend code using a specific address structure. To view or edit this path, right-click the function name and select _Use dynamic address_.

<figure><img src="../../../.gitbook/assets/leftclick_on_function.png" alt=""><figcaption><p>Right-click the function name and choose Use Dynamic Address</p></figcaption></figure>

This action reveals the exact path to the code, consisting of up to three boxes:

`<Agent/Service> <Class> [Instance]`

* **Box 1 (Agent/Service)**: The runtime or program executing the function. This can be a generic internal service or a specific Agent running on local infrastructure.
* **Box 2 (class)**: The code class name, such as `Busylight`, `Barcode`, or `OpcuaClient`.
* **Box 3 (instance)**: The specific instance name, such as `server1`. This box only appears for member functions. Static functions do not utilize an instance, so the platform hides this box.

<figure><img src="../../../.gitbook/assets/image (25).png" alt=""><figcaption><p>Addresses of a static function and a member function</p></figcaption></figure>

Edit this address directly in the boxes if required. The platform retains your changes if you switch back to the standard view.

{% hint style="info" %}
#### Swap Agents across environments

When moving logic between environments, such as from a test device to a production machine, update the Agent name in box 1 to target the new Agent instead of rewiring the flow.

You can use search and replace to update the Agent name across multiple functions simultaneously. This works for all addresses, even if they do not use the dynamic view.
{% endhint %}
