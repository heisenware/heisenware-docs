# Recorder

The recorder captures a function's output and stores it as timeseries data in the [internal InfluxDB](../functions/storage/timeseries-database.md). Use it to record a data stream, visualize it in your Apps, or analyze it later. It records during build-time (in test mode) and during the App's runtime.

## Settings

* **Measurement name**: Fill the Data Point Name box with a unique name. You need this name to find and read the recorded data.
* **Recording type**: Right-click the recorder to select how long the data is stored: 1 hour (H, default), 1 day (D), 1 week (W), 1 month (M), 1 year (Y), or downsampled (DS) for long-term storage in downsampled form.

<figure><img src="../../../.gitbook/assets/image (47).png" alt=""><figcaption></figcaption></figure>

{% hint style="info" %}
If the [Industrial Blockchain](../functions/extensions/industrial-blockchain.md) extension is available in your account, an additional Blockchain (BC) recording type appears. It stores the data in the blockchain instead of InfluxDB.
{% endhint %}

## Reading recorded data

Click the letter icon inside the recorder to generate a matching readout function directly on the canvas. Depending on the recording type, this is the `read` or `readDownsampled` function of the internal InfluxDB (or the blockchain `read` function), preconfigured with your measurement name.
