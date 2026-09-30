# Error handler

The error handler catches errors thrown by an executor's function. It opens a separate output that only activates when the function fails or throws an exception. Unlike the other extensions, the error handler attaches directly to an executor only, not to other extensions.

Build a dedicated logic path from this output to handle error conditions, for example to log the error details to a database or display an error message in the UI. Wire the error handler to executor triggers or link it to widgets like any other output, and chain further extensions behind it, for example a modifier to reshape the error message.

The captured error message appears below the error handler. Right-click it to clear the content or delete the node.

<figure><img src="../../.gitbook/assets/image (28).png" alt=""><figcaption><p>Error simulator executor with captured error message and a JSONata modifier</p></figcaption></figure>
