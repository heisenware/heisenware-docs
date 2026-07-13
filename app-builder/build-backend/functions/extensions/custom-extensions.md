Custom Extensions

Custom Extensions let you extend the Heisenware platform to your specific needs. We provide a project setup into which you add your custom functionality in a completely non-intrusive fashion. Built on our VRPC library, you write plain Node.js code (no APIs to learn) and make it ready for visual programming in minutes.

{% hint style="info" %}
We are actively working on the same idea for C++ and Python.
{% endhint %}

The best starting point is our docker-extension-starter-js. We recommend downloading this project as a scaffold, changing it to your needs, and placing it under your own version control.

You end up creating a Docker image whose containers integrate into the platform in one of two ways.

Running inside the platform

Once your Docker image is built, pushed, and publicly accessible (contact us for private registry support), load it as a Custom Extension.

<div align="left"><figure><img src="../../../../.gitbook/assets/image (46).png" alt=""><figcaption></figcaption></figure></div>
Once installed, and given your code is syntactically correct, it immediately appears in the Function Explorer. To apply a new version, install it again (works even with the same label).

{% hint style="info" %}
Any instances you create are automatically persisted and restarted. You find them in the File Explorer under extensions/my-extension/...
{% endhint %}

Running outside the platform

This lets you run your custom code on-premises while we bridge it automatically, seamlessly, and securely into the cloud. Start a container of your image locally and configure it with the correct credentials using environment variables:

bashdocker run -it \
-e HW_DOMAIN=<account>.<workspace> \
-e HW_BROKER=mqtts://<account>.heisenware.cloud \
-e HW_USERNAME=<username> \
-e HW_PASSWORD=<password> \
myusername/myimage:1.0.0

To retrieve a valid username and password, add a VRPC integration under Integrations (inbound) in the App Manager.

Example: For an account named my-company, an integration with username agentRunner, and a password secret, the call would be:

bashdocker run -it \
-e HW_DOMAIN=my-company.default \
-e HW_BROKER=mqtts://my-company.heisenware.cloud \
-e HW_USERNAME=agentRunner \
-e HW_PASSWORD=secret \
myusername/myimage:1.0.0

When everything is set up correctly, you should see something like this on your console:

<figure><img src="../../../../.gitbook/assets/image (48).png" alt=""><figcaption></figcaption></figure>
