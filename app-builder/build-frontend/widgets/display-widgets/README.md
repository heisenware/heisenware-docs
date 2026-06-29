# Display Widgets

Display widgets are used to visualize data for your end-users. They take data from your functions and present it in various forms, such as charts, gauges, maps, and tables. These widgets are the key to creating rich, data-driven dashboards and user interfaces.

{% hint style="info" %}
#### Categorization by main usage

We categorize widgets based on their primary purpose. However, some widgets are versatile; for example, a [form](../input-widgets/form.md) (an [input widget](../input-widgets/)) can display data, while a [data grid](data-grid.md) (a [display widget](./)) can be used for data input. Always check the specific properties of a widget to see its full range of capabilities.
{% endhint %}

## Available display widgets

Each display widget has its own detailed documentation page.

* [**Card**](card.md): A container element you can use for structure and group backgrounds.
* [**Chart**](chart.md): A component for creating line, bar, area, or scatter charts.
* [**Chat**](chat.md): Allows for building conversational interfaces in [RAG](../../../build-backend/function-explorer/extensions/rag-ai/) use cases.
* [**Circular Gauge**](circular-gauge.md): Visualizes a primary value and a secondary sub-value in a circular form.
* [**Data Grid**](data-grid.md): A powerful component for displaying and interacting with database tables.
* [**Data List**](data-list.md): Displays a collection of items in a simple, scrollable list view.
* [**Data Tiles**](data-tiles.md): Displays a collection of items in a responsive, tiled view.
* [**Kanban Board**](kanban.md): An interactive board for visualizing items across different stages of a process.
* [**Linear Gauge**](linear-gauge.md): Visualizes a primary value and a secondary sub-value in a linear bar form.
* [**Map**](map.md): Marks geographic data points on an interactive map.
* [**Media View**](media-view.md): Allows the dynamic display of media, such as images, videos, or PDFs.
* [**Pie Chart**](pie-chart.md): A classic chart for visualizing proportions.
* [**Progress Bar**](progress-bar.md): Visualizes the progress of a process as a percentage or absolute value.
* [**Sankey**](sankey.md): Visualizes the flow and distribution of data between two sets of values.
* [**Sparkline**](sparkline.md): A small, simple line chart without axes, ideal for inline data trends.
* [**Status Lamp**](status-lamp.md): Displays a mappable status as a colored light.
* [**Toast**](toast.md): A time-limited notification message that appears briefly to the user.
* [**Value Box**](value-box.md): A flexible box for displaying a key data point or arbitrary information.

## Connecting to logic (data binding)

Display widgets receive their data from your Functions.

### How to link

You link widgets by dragging the logic to the UI:

1. Drag an output or [Modifier](../../../build-backend/modifier.md) of a [Function](../../../build-backend/functions.md) and drop it onto the widget.
2. A menu will appear on the Function block; pick the specific widget property you want to link (e.g., `value` or `data`).

### Interaction types

* **From Function Output / from modifier**: A Function sends a primary value (like a time series) to the widget's `data` property.
* **To Function Input**: Certain display widgets, such as the data grid, support input as well. In these cases, you can connect the widget to a Function Input. It will then behave like an input widget, sending selected rows or edited cells back to your logic.
