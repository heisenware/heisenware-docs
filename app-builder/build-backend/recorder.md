# Recorder

The Recorder captures a function's output and stores it as time-series data in the [internal InfluxDB](function-explorer/storage/timeseries-database.md). This allows you to store a data stream, visualize it within your applications, or analyze it as required. It records data during both build-time (in test mode) and the app's runtime.

The recorder has two settings:

* **Measurement Name**: You must provide a unique name for the measurement in the recorder's text box.
* **Retention Policy**: Right-click the circle icon (which defaults to 'F' for Forever) to set how long the recorded data should be stored. Options range from one hour to a year, or forever.
