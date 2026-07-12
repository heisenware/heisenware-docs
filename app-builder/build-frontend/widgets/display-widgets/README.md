# Display widgets

Display widgets render data as charts, gauges, maps, and tables. These components receive values from functions and modifiers to display them live, forming the core building blocks of dashboards and data-driven interfaces.

{% hint style="info" %}
#### Widget versatility and categorization

The platform groups widgets by their primary purpose, though many serve multiple roles. For example, a [form](../input-widgets/form.md) (an [input widget](../input-widgets/)) can display data and a [data grid](data-grid.md) (a [display widget](./)) can capture input. Check the properties of each widget to see its full capabilities.
{% endhint %}

## Available display widgets

* [**Card**](card.md): Groups and structures other layout elements.
* [**Chart**](chart.md): Renders line, bar, area, and scatter charts.
* [**Chat**](chat.md): Provides a conversational interface for RAG use cases.
* [**Circular gauge**](circular-gauge.md): Displays a primary value and a secondary sub-value on a circular dial.
* [**Data grid**](data-grid.md): Displays database records in an interactive table that supports viewing and editing.
* [**Data list**](data-list.md): Displays a scrollable list of items.
* [**Data tiles**](data-tiles.md): Arranges items into responsive tile layouts.
* [**Dynamic group**](../dynamic-group.md): Bundles multiple widgets together to act as a repeated container driven by data.
* [**Iframe**](iframe.md): Embeds external web pages or applications inside the interface.
* [**Kanban**](kanban.md): Arranges items on an interactive board to track process stages.
* [**Linear gauge**](linear-gauge.md): Displays a primary value and a secondary sub-value on a linear bar.
* [**Map**](map.md): Displays geographic data points on an interactive map.
* [**Media view**](media-view.md): Displays images, videos, or PDF files dynamically.
* [**Pie chart**](pie-chart.md): Displays proportional data as parts of a whole.
* [**Progress bar**](progress-bar.md): Displays process progress as a percentage or an absolute value.
* [**Sankey**](sankey.md): Displays the flow and distribution of values between datasets.
* [**Sparkline**](sparkline.md): Displays a compact line chart without axes to show inline trends.
* [**Status lamp**](status-lamp.md): Displays operational status using a colored light indicator.
* [**Timeline**](timeline.md): Displays state changes over a time span, such as machine production and downtime phases.
* [**Toast**](toast.md): Displays brief temporary notifications.
* [**Value box**](value-box.md): Displays a single key figure or individual content block.

## Data binding

Display widgets receive data from functions and modifiers. Drag from a function or modifier onto the widget. The selected slot determines the data direction:

* **Function output or modifier to widget**: A function output or modifier writes into a widget property, such as a time series array feeding into a chart data property. This is the primary direction for display widgets.
* **Widget to function input**: Certain display widgets, such as the data grid, send data back to backend logic. A widget event flows into a function input along with its data payload, transmitting edited cells or selected rows the moment they change.

See [Widgets](../#data-binding) for the full mechanics.
