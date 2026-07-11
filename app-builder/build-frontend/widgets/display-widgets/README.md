# Display widgets

Display widgets visualize data for your end-users. They take data from your [functions](/app-builder/build-backend/functions.md) and present it in various forms, such as charts, gauges, maps, and tables. These widgets are the key to creating rich, data-driven dashboards and user interfaces.

{% hint style="info" %}
#### Widget versatility
We categorize [widgets](/app-builder/build-frontend/widgets.md) based on their primary purpose. However, some widgets are versatile; for example, a [form](/app-builder/build-frontend/widgets/input-widgets/form.md) (an [input widget](/app-builder/build-frontend/widgets/input-widgets.md)) can display data, while a [data grid](/app-builder/build-frontend/widgets/display-widgets/data-grid.md) (a display widget) can accept user inputs. Always check the specific properties of a widget to see its full range of capabilities.
{% endhint %}

## Available display widgets

* [**Card**](/app-builder/build-frontend/widgets/display-widgets/card.md): A decorative container element for structure and group backgrounds.
* [**Chart**](/app-builder/build-frontend/widgets/display-widgets/chart.md): A component for creating line, bar, area, or scatter charts.
* [**Chat**](/app-builder/build-frontend/widgets/display-widgets/chat.md): Reusable conversational interfaces for Retrieval-Augmented Generation ([RAG AI](/app-builder/build-backend/function-explorer/extensions/rag-ai.md)) use cases.
* [**Circular gauge**](/app-builder/build-frontend/widgets/display-widgets/circular-gauge.md): Visualizes a primary value and a secondary sub-value in a circular form.
* [**Data grid**](/app-builder/build-frontend/widgets/display-widgets/data-grid.md): A powerful component for displaying and interacting with database tables.
* [**Data list**](/app-builder/build-frontend/widgets/display-widgets/data-list.md): Displays a collection of items in a simple, scrollable list view.
* [**Data tiles**](/app-builder/build-frontend/widgets/display-widgets/data-tiles.md): Displays a collection of items in a responsive, tiled view.
* [**Iframe**](/app-builder/build-frontend/widgets/display-widgets/iframe.md): Embeds external web pages or applications directly into your interface.
* [**Kanban**](/app-builder/build-frontend/widgets/display-widgets/kanban.md): An interactive board for visualizing items across different stages of a process.
* [**Linear gauge**](/app-builder/build-frontend/widgets/display-widgets/linear-gauge.md): Visualizes a primary value and a secondary sub-value in a linear bar form.
* [**Map**](/app-builder/build-frontend/widgets/display-widgets/map.md): Marks geographic data points on an interactive map.
* [**Media view**](/app-builder/build-frontend/widgets/display-widgets/media-view.md): Displays media dynamically, such as images, videos, or PDFs.
* [**Pie chart**](/app-builder/build-frontend/widgets/display-widgets/pie-chart.md): A classic chart for visualizing proportions.
* [**Progress bar**](/app-builder/build-frontend/widgets/display-widgets/progress-bar.md): Visualizes process progress as a percentage or absolute value.
* [**Sankey**](/app-builder/build-frontend/widgets/display-widgets/sankey.md): Visualizes the flow and distribution of data between two sets of values.
* [**Sparkline**](/app-builder/build-frontend/widgets/display-widgets/sparkline.md): A small, simple line chart without axes, ideal for inline data trends.
* [**Status lamp**](/app-builder/build-frontend/widgets/display-widgets/status-lamp.md): Displays a mappable status as a colored light.
* [**Timeline**](/app-builder/build-frontend/widgets/display-widgets/timeline.md): Displays events in chronological order.
* [**Toast**](/app-builder/build-frontend/widgets/display-widgets/toast.md): A time-limited notification message that appears briefly to the user.
* [**Value box**](/app-builder/build-frontend/widgets/display-widgets/value-box.md): A flexible box for displaying a key data point or arbitrary information.

## Connecting to logic (data binding)

Display widgets receive data from your functions.

### How to link

Link widgets by dragging your logic to the UI:

1. Drag an output or [modifier](/app-builder/build-backend/modifier.md) of a function from the [Backend Builder](/app-builder/build-backend.md) and drop it onto the widget.
2. Select the specific widget property you want to link (e.g., `value` or `data`) from the pop-up menu on the function block.

### Interaction types

* **From function output or modifier**: A function sends a primary value (like a time series) to the widget's `data` property.
* **To function input**: Certain display widgets, such as the data grid, support input operations. Connect the widget to a function input to send selected rows or edited cells back to your logic.
