---
description: >-
  In this tutorial you will learn how to integrate a Heidenhain controlled CNC
  machine and use it in your app.
---

# Connect Heidenhain CNC with OPC UA Support

This tutorial walks you through the process in a step by step fashion. We will connect a modern TNC7 based machine. The described steps however are also valid for any other version that supports the OPC UA connectivity.

Let's get started!

### Step 1 - Allow SSH access via password

On your CNC machine you have to temporarily enable password-based access via SSH.

<figure><img src="../../.gitbook/assets/Screenshot (2).png" alt=""><figcaption></figcaption></figure>

For that go to "Einstellungen".

<figure><img src="../../.gitbook/assets/Screenshot (3).png" alt=""><figcaption></figcaption></figure>

In "Betriebssystem" select "Current User" and click "Öffnen".

<figure><img src="../../.gitbook/assets/Screenshot (4).png" alt=""><figcaption></figcaption></figure>

In the popup select "Zertifikate und Schlüssel".

<figure><img src="../../.gitbook/assets/Screenshot (5).png" alt=""><figcaption></figcaption></figure>

Check the "Erlaube Authentifizierung mit Passwort".

<figure><img src="../../.gitbook/assets/Screenshot (6).png" alt=""><figcaption></figcaption></figure>

And then restart the internal SSH server by clicking "Speichern & Server neu starten".

That's all for now on the machine.

### Step 2 - Download and start an Agent

Open the App Builder using a computer that has access to the CNC machine(s).

<figure><img src="../../.gitbook/assets/Screenshot (7).png" alt=""><figcaption></figcaption></figure>

Start configuring an Agent by clicking the create Agent icon in the "Function Explorer" panel.

<figure><img src="../../.gitbook/assets/Screenshot (8).png" alt=""><figcaption></figcaption></figure>

Check both the OPC UA Client and the Heidenhain OPC UA connector. Use a prefix that for example identifies your company and click "Submit".

<figure><img src="../../.gitbook/assets/Screenshot (10).png" alt=""><figcaption></figcaption></figure>

As the Agent is freshly compiled (to embed all security aspects of your account/workspace) this may take some time - typically not more than 2 minutes.

Please wait patiently until a download dialogue opens (on some browsers the download will start automatically).

{% hint style="info" %}
You can always find the Native Agent executable in the "File Explorer" panel under the "native-agents" folder and download them again from there.
{% endhint %}

<figure><img src="../../.gitbook/assets/Screenshot (11).png" alt=""><figcaption></figcaption></figure>

On your local file system create a new folder, e.g. "Heisenware" and place the Native Agent in there.

<figure><img src="../../.gitbook/assets/Screenshot (12).png" alt=""><figcaption></figcaption></figure>

Start the Native Agent by double-clicking and allow Windows to execute it by clicking "Weitere Informationen".

<figure><img src="../../.gitbook/assets/Screenshot (13).png" alt=""><figcaption></figcaption></figure>

Finally click on "Trotzdem ausführen".

<figure><img src="../../.gitbook/assets/Screenshot (14).png" alt=""><figcaption></figcaption></figure>

If everything worked a terminal window should open, saying the connection to the broker is `[OK]` and at the same time the Agent should appear in the "Function Explorer" panel of the App Builder.

{% hint style="info" %}
In case the Agent does not connect, but tries re-connecting all the time, make sure your firewall allows to dial out on port 8883 for establishing a secure MQTTS connection.
{% endhint %}

### Step 3 - Setup certificates for the OPC UA connection

In order to connect to the Heidenhain OPC UA server a functioning PKI infrastructure has to be in place and four types of certificates must be exchanged:

From machine to host:

1. CA certificate and revocation list
2. Server certificate

From host to machine:

3. Client certificate
4. User certificate

This is a very complex and sensitive process, fortunately you have to do this only once per machine and our Agent is helping you in getting this right.

<figure><img src="../../.gitbook/assets/Screenshot (16).png" alt=""><figcaption></figcaption></figure>

Drag the "create" function of the Heidenhain module to a section of the logic board.

<figure><img src="../../.gitbook/assets/Screenshot (21).png" alt=""><figcaption></figcaption></figure>

Select an instance name (here: "tnc7") and provide the machine IP address to the "machineIpAddress" property. Trigger the function by pressing the return icon on the green trigger item.

<figure><img src="../../.gitbook/assets/Screenshot (25).png" alt=""><figcaption></figcaption></figure>

Drag the two functions "prepareOpcUaAssistant" and "finalizeOpcUaAssitant". Trigger the preparation function. If you can see the above return value it worked and you can switch to your machine again.

### Step 4 - Use the OPC UA Assistant on the machine

On your machine open the OPC UA Assistant.

<figure><img src="../../.gitbook/assets/Screenshot (26).png" alt=""><figcaption></figcaption></figure>

On the TNC7 you can find it under "Einstellungen" => "Netzwerk/Fernzugriff" => "OPC UA" => "OPC UA Verbinundungsassistent". On an TNC640 you have to open the heros menu and navigate there.

<figure><img src="../../.gitbook/assets/Screenshot (27).png" alt=""><figcaption></figcaption></figure>

Go step by step through the assistant.

<figure><img src="../../.gitbook/assets/Screenshot (28).png" alt=""><figcaption></figcaption></figure>

When exporting the server certificates, navigate to the "TNC:" drive, you will find a "heisenware" folder there and inside another "export" folder.

<figure><img src="../../.gitbook/assets/Screenshot (29).png" alt=""><figcaption></figcaption></figure>

Use this to export the all the machine certificates into.

<figure><img src="../../.gitbook/assets/Screenshot (31).png" alt=""><figcaption></figcaption></figure>

Click the "Alle Zertifikate exportieren" and move to the next step using "Vorwärts".

<figure><img src="../../.gitbook/assets/Screenshot (33).png" alt=""><figcaption></figcaption></figure>

During this step the assitant wants to import the client certificate, again navigate to the "heisenware" folder but this time use the "import" folder.

<figure><img src="../../.gitbook/assets/Screenshot (34).png" alt=""><figcaption></figcaption></figure>

Select the "heisenware_opcua_client.der" certificate and finalize the import.

<figure><img src="../../.gitbook/assets/Screenshot (36).png" alt=""><figcaption></figcaption></figure>

During the next step you have to activate the OPC UA connection, for that check the corresponding checkbox and click "Anwenden". Then go to the next step.

<figure><img src="../../.gitbook/assets/Screenshot (38).png" alt=""><figcaption></figcaption></figure>

Now its time to import the user certificate. Again use "heisenware/import" but this time select the "heisenware_opcua_user.der" certificate.

<figure><img src="../../.gitbook/assets/Screenshot (40).png" alt=""><figcaption></figcaption></figure>

Finally, I you haven't done it already, allow the firewall to accept OPC UA traffic.

<figure><img src="../../.gitbook/assets/Screenshot (41).png" alt=""><figcaption></figcaption></figure>

Change the OPC UA "Methode" by double-clicking and selecting the "Allen erlauben" option. Afterwards reload the firewall configuration using "Firewall-Konfiguration neu laden".

<figure><img src="../../.gitbook/assets/Screenshot (43).png" alt=""><figcaption></figcaption></figure>

Things should look like this. You can simply go forward or even finish the assistent now. That's all you had to do.

### Step 5 - Connect to the OPC UA server

Back in your App Builder (which now can run on any other browser) finalize the setup.

<figure><img src="../../.gitbook/assets/Screenshot (45).png" alt=""><figcaption></figcaption></figure>

Click the "finalizeOpcUaAssistant" and you should see a success message.

<figure><img src="../../.gitbook/assets/Screenshot (46).png" alt=""><figcaption></figcaption></figure>

You can now drag the "connect" function and simply execute it. If you see a "true" you made it!

The rest follows our regular App Builder methodology, so enjoy working with your machine and crafting great Apps!

<figure><img src="../../.gitbook/assets/Screenshot (48).png" alt=""><figcaption></figcaption></figure>
