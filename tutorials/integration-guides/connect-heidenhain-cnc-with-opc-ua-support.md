---
description: >-
  In this tutorial you will learn how to integrate a Heidenhain controlled CNC
  machine and use it in your App.
---

# Connect Heidenhain CNC with OPC UA support

This tutorial explains how to connect a Heidenhain controlled CNC machine to your App using OPC UA. 

This guide uses a modern TNC7-based machine as an example, but the steps apply to any Heidenhain controller that supports OPC UA connectivity.

## Connectivity guide

{% stepper %}
{% step %}
### Allow SSH access via password
Temporarily enable password-based SSH access on your CNC machine.

1. Open the settings (**Einstellungen**) menu on the controller.

<figure><img src="../../.gitbook/assets/Screenshot (2).png" alt=""><figcaption></figcaption></figure>

2. Under the operating system (**Betriebssystem**) section, select **Current User** and click **Open** (**Öffnen**).

<figure><img src="../../.gitbook/assets/Screenshot (3).png" alt=""><figcaption></figcaption></figure>

3. In the dialog box, select **Certificates and keys** (**Zertifikate und Schlüssel**).

<figure><img src="../../.gitbook/assets/Screenshot (4).png" alt=""><figcaption></figcaption></figure>

4. Check the box to allow password authentication (**Erlaube Authentifizierung mit Passwort**).

<figure><img src="../../.gitbook/assets/Screenshot (5).png" alt=""><figcaption></figcaption></figure>

5. Click **Save and restart server** (**Speichern & Server neu starten**) to restart the internal SSH server.

<figure><img src="../../.gitbook/assets/Screenshot (6).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
### Download and start a Native Agent
Open the App Builder on a computer that has network access to your CNC machine.

1. Click the create Agent icon in the **Function Explorer** panel (see [Agents](../../app-builder/build-backend/agents.md)).

<figure><img src="../../.gitbook/assets/Screenshot (7).png" alt=""><figcaption></figcaption></figure>

2. Check the checkboxes for both the [OPC UA Client](../../app-builder/build-backend/functions/connectors/opc-ua-client.md) and the [Heidenhain OPC UA](../../app-builder/build-backend/functions/connectors/heidenhain-opc-ua.md) connectors. 

3. Enter a prefix that identifies your workspace and click **Submit**.

<figure><img src="../../.gitbook/assets/Screenshot (8).png" alt=""><figcaption></figcaption></figure>

The system compiles a custom Native Agent executable to embed the specific security credentials of your workspace. This process takes up to 2 minutes.

Wait for the download dialog to open automatically in your browser.

{% hint style="info" %}
### Re-downloading Agents
You can access and download your compiled Native Agent executables at any time from the `native-agents` directory inside the [File Explorer](../../app-builder/build-backend/file-explorer.md).
{% endhint %}

<figure><img src="../../.gitbook/assets/Screenshot (11).png" alt=""><figcaption></figcaption></figure>

4. Create a new directory on your local computer (such as `C:\Heisenware`) and move the downloaded Native Agent binary into it.

<figure><img src="../../.gitbook/assets/Screenshot (12).png" alt=""><figcaption></figcaption></figure>

5. Run the Native Agent executable. If prompted by Windows SmartScreen, click **More info** (**Weitere Informationen**) and select **Run anyway** (**Trotzdem ausführen**).

<figure><img src="../../.gitbook/assets/Screenshot (13).png" alt=""><figcaption></figcaption></figure>

6. Once the terminal window opens and displays a broker connection status of `[OK]`, verify that your new Agent appears online in the **Function Explorer** panel of the **App Builder**.

{% hint style="info" %}
### Troubleshooting Agent connectivity
If the Agent fails to connect and repeatedly loops through reconnection attempts, verify that your network firewall permits outbound traffic on port `8883` to establish the secure MQTTS connection.
{% endhint %}
{% endstep %}

{% step %}
### Set up certificates for the OPC UA connection
To establish a secure connection to the Heidenhain OPC UA server, you must exchange certificates between the CNC machine and your host computer.

Our Native Agent automates this file exchange. You only need to perform these configuration steps once per machine.

<figure><img src="../../.gitbook/assets/Screenshot (16).png" alt=""><figcaption></figcaption></figure>

1. Drag the `create` function from the [Heidenhain OPC UA](../../app-builder/build-backend/functions/connectors/heidenhain-opc-ua.md) connector onto the **Backend Builder** canvas.

2. Define an instance name (such as `tnc7`) and enter your machine's IP address in the `machineIpAddress` input field. Trigger the function manually.

<figure><img src="../../.gitbook/assets/Screenshot (21).png" alt=""><figcaption></figcaption></figure>

3. Drag both the `prepareOpcUaAssistant` and `finalizeOpcUaAssistant` functions onto the canvas.

4. Trigger the `prepareOpcUaAssistant` function. Once it returns successfully, return to your CNC machine.

<figure><img src="../../.gitbook/assets/Screenshot (25).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
### Run the OPC UA Assistant on the machine
Open the OPC UA Assistant interface on your CNC machine.

1. On a TNC7 controller, navigate to **Settings** (**Einstellungen**) > **Network/Remote Access** (**Netzwerk/Fernzugriff**) > **OPC UA** > **OPC UA Connection Assistant** (**OPC UA Verbindungsassistent**). On a TNC640 controller, open this menu via the Heros interface.

<figure><img src="../../.gitbook/assets/Screenshot (26).png" alt=""><figcaption></figcaption></figure>

2. Follow the assistant's prompts step by step.

<figure><img src="../../.gitbook/assets/Screenshot (27).png" alt=""><figcaption></figcaption></figure>

3. When the assistant prompts you to export server certificates, select the `TNC:` drive, open the `heisenware` directory, and navigate into the `export` folder.

<figure><img src="../../.gitbook/assets/Screenshot (28).png" alt=""><figcaption></figcaption></figure>

4. Click **Export all certificates** (**Alle Zertifikate exportieren**) to save the machine certificates into this folder, then click **Next** (**Vorwärts**).

<figure><img src="../../.gitbook/assets/Screenshot (31).png" alt=""><figcaption></figcaption></figure>

5. When the assistant prompts you to import the client certificate, navigate to the `heisenware` folder and open the `import` directory.

<figure><img src="../../.gitbook/assets/Screenshot (33).png" alt=""><figcaption></figcaption></figure>

6. Select the `heisenware_opcua_client.der` certificate and complete the import.

<figure><img src="../../.gitbook/assets/Screenshot (34).png" alt=""><figcaption></figcaption></figure>

7. Check the checkbox to enable the OPC UA connection, click **Apply** (**Anwenden**), and click **Next**.

<figure><img src="../../.gitbook/assets/Screenshot (36).png" alt=""><figcaption></figcaption></figure>

8. When prompted to import the user certificate, open the `heisenware/import` directory and select the `heisenware_opcua_user.der` certificate file.

<figure><img src="../../.gitbook/assets/Screenshot (38).png" alt=""><figcaption></figcaption></figure>

9. Allow the system firewall to accept OPC UA traffic. Double-click the OPC UA method (**Methode**) option and set it to **Allow all** (**Allen erlauben**). 

10. Click **Reload firewall configuration** (**Firewall-Konfiguration neu laden**) to apply the network rules.

<figure><img src="../../.gitbook/assets/Screenshot (41).png" alt=""><figcaption></figcaption></figure>

11. Complete the assistant to finalize the on-machine certificate setup.
{% endstep %}

{% step %}
### Connect to the OPC UA server
Return to the **App Builder** in your browser to finalize the integration.

1. Trigger the `finalizeOpcUaAssistant` function on your canvas. It should return a success message.

<figure><img src="../../.gitbook/assets/Screenshot (45).png" alt=""><figcaption></figcaption></figure>

2. Drag the `connect` function from the Heidenhain OPC UA instance onto the canvas and trigger it. A return value of `true` confirms a successful connection.

<figure><img src="../../.gitbook/assets/Screenshot (46).png" alt=""><figcaption></figcaption></figure>

You can now use the standard [Heidenhain OPC UA](../../app-builder/build-backend/functions/connectors/heidenhain-opc-ua.md) functions to read, write, and monitor live parameters from your CNC machine.

<figure><img src="../../.gitbook/assets/Screenshot (48).png" alt=""><figcaption></figcaption></figure>
{% endstep %}
{% endstepper %}
