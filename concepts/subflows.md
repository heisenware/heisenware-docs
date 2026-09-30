# Subflows

A subflow bundles multiple functions into a single, reusable custom function. You define which inputs go in and which output comes out. On the canvas, the subflow behaves like any other function: it has inputs, a trigger, and an output, and you wire it into your flows the same way.

Use subflows to:

* Reuse logic you need in several places instead of copying functions.
* Keep the canvas clean by hiding implementation details behind one block.
* Share a tested algorithm as a single building block.

### Creating a subflow

{% stepper %}
{% step %}
**Add a subflow**

Drag a subflow from the toolbar onto the canvas. A named container appears, marked with a subflow label.
{% endstep %}

{% step %}
**Add your logic**

Add the functions that make up your logic to the container, just like adding functions to a group.
{% endstep %}

{% step %}
**Define the interface**

Connect your logic to the input, trigger, and output of the orange function block inside the container. This block defines the interface of your new custom function.
{% endstep %}
{% endstepper %}

### Naming a subflow

Every subflow gets a default name (e.g. run\_aa7L). Edit the title of the container to rename it. The name updates in the Function Explorer accordingly.

### Using a subflow

Once created, your custom function appears in the Function Explorer under Custom > Subflows. From there, drag it onto the canvas and use it like any built-in function.

### Subflows vs. grouping

A group is a visual aid only and has no effect on execution. A subflow is a functional unit with a defined interface. Use groups to tidy up, use subflows to build reusable logic.
