# Display widgets

Display widgets turn your data into something people can read at a glance: charts, gauges, maps, tables, and more. They take the values flowing out of your functions and render them live, which makes them the building blocks of any dashboard or data-driven interface.

{% hint style="info" %}
#### Categorization by main usage

We group widgets by their primary purpose, but many are versatile. A [form](../input-widgets/form.md) (an [input widget](../input-widgets/)) can display data, and a [data grid](data-grid.md) (a [display widget](./)) can capture it. Always check a widget's properties to see its full range.
{% endhint %}

## Available display widgets

Each display widget has its own documentation page.

* [**Card**](card.md): A container for grouping and giving structure to other elements.
* [**Chart**](chart.md): Line, bar, area, and scatter charts.
* [**Chat**](chat.md): A conversational interface for [RAG](../../../build-backend/function-explorer/extensions/rag-ai/) use cases.
* [**Circular gauge**](circular-gauge.md): A primary value and a secondary sub-value on a circular dial.
* [**Data grid**](data-grid.md): A powerful table for viewing and editing database records.
* [**Data list**](data-list.md): A simple, scrollable list of items.
* [**Data tiles**](data-tiles.md): Items laid out as responsive tiles.
* [**Iframe**](iframe.md): Embeds an external web page or application inside your interface.
* [**Kanban**](kanban.md): An interactive board for moving items through the stages of a process.
* [**Linear gauge**](linear-gauge.md): A primary value and a secondary sub-value on a linear bar.
* [**Map**](map.md): Geographic data points on an interactive map.
* [**Media view**](media-view.md): Displays images, videos, or PDFs dynamically.
* [**Pie chart**](pie-chart.md): Proportions of a whole.
* [**Progress bar**](progress-bar.md): The progress of a process, as a percentage or absolute value.
* [**Sankey**](sankey.md): The flow and distribution of values between two sets.
* [**Sparkline**](sparkline.md): A compact line chart without axes, ideal for inline trends.
* [**Status lamp**](status-lamp.md): A status shown as a colored light.
* [**Timeline**](timeline.md): How the state of something changes over a time span, such as the production, downtime, and setup phases of a machine.
* [**Toast**](toast.md): A brief notification that appears for a limited time.
* [**Value box**](value-box.md): A flexible box for a single key figure or any other content.

## Connecting to logic (data binding)

Display widgets get their data from your functions and flows. You drag from a function onto the widget, and the slot you pick sets the direction:

* **Function output to widget**: A function's output (or a modifier) writes into a widget property, such as a time series into a chart's `data`. This is the main direction for display widgets.
* **Widget to function input**: Some display widgets, like the data grid, also send data back. A widget event flows into a function's input, carrying its data with it, so an edited cell or selected row travels into your logic the moment it changes.

For the full mechanic, see [connecting widgets to logic](../README.md#connecting-widgets-to-logic).
