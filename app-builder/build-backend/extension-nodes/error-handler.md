# Error handler

The error handler manages errors thrown by a function. It opens a separate output that only activates when the function fails or throws an exception. Unlike the other extension nodes, the error handler attaches directly to a function only, not to other extension nodes.

Build a dedicated logic path from this output to handle error conditions, for example to log the error details to a database or display an error message in the UI. Wire the error handler to widgets or function triggers like any other output, and chain further extension nodes behind it, for example a modifier to reshape the error message.

The captured error message appears below the error handler. Right-click it to clear the content or delete the node.

<figure><img src="../../../.gitbook/assets/image (28).png" alt=""><figcaption><p>Error simulator function with captured error message and JSONata modification</p></figcaption></figure>
