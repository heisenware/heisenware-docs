# Event simulation

With event simulation, you generate mock events to test and validate your flows. This ensures your flows handle different scenarios and edge cases before real event sources are connected, and it also works as a placeholder while your App is still under construction.

To access the event simulator, unfold Simulation > Events in the Function Explorer.

## Instance management

### Create an instance

Drag the `create` function onto the canvas, insert a unique name for your instance and trigger the function.

<figure><img src="../../../../.gitbook/assets/create_instance.png" alt=""><figcaption><p>Creating an event simulator instance</p></figcaption></figure>

### Delete an instance

Drag the `delete` function onto the canvas and insert the name of the instance you want to delete.

<figure><img src="../../../../.gitbook/assets/delete_instance.png" alt=""><figcaption><p>Deleting an event simulator instance</p></figcaption></figure>

## Instance functions

### Reacting to a manually triggered event

The `onManualTrigger` function catches a manual trigger of the `triggerManually` function in the same instance and outputs the payload, which is a Unix timestamp in this case. To try this, drag both functions onto the canvas and trigger the `triggerManually` function to generate the necessary event.

<figure><img src="../../../../.gitbook/assets/image (33).png" alt=""><figcaption><p>After triggering the second function, the first outputs the timestamp</p></figcaption></figure>

### Reacting to an automatically triggered event

The `onAutoTrigger` function reacts to the automatic trigger set up by `startAutoTrigger` and outputs the Unix timestamp payload. You can set the interval in milliseconds after which the event repeats in the `interval` input box, the default is 1000. You might need to trigger `onAutoTrigger` once for it to start reacting to the automatically generated events after triggering `startAutoTrigger`.

<figure><img src="../../../../.gitbook/assets/image (34).png" alt=""><figcaption><p>Reacting to periodically generated events</p></figcaption></figure>

You can stop the automatic trigger with the `stopAutoTrigger` function.

<figure><img src="../../../../.gitbook/assets/stopautotrigger.png" alt=""><figcaption><p>Stopping the generation of events</p></figcaption></figure>

### Reacting with a delayed callback

The `triggerCallback` function reacts to an event triggered by itself. After triggering the function, there is a delay as set by the `timeout` input box in milliseconds, the default is 3000. It will not react to the output of the callback, to avoid an infinite loop.

<figure><img src="../../../../.gitbook/assets/triggerCallback.png" alt=""><figcaption><p>Callback output as reaction to function generated event</p></figcaption></figure>
