---
description: >-
  Working ESP32 code that publishes into a Heisenware workspace over MQTT.
---

# Connect an Arduino via MQTT

An ESP32 is the cheapest sensor you can put on a machine. This lab gets one to publish a JSON reading into a workspace, where an App picks it up.

## Before the sketch

{% stepper %}
{% step %}
#### Make the credentials

A device publishes directly to the workspace's broker, so it needs its own login. In the App Manager, open [Integrations](../app-manager/integrations.md) and click **Add Integration** > **MQTT client**. Rename it to something you recognize and copy the whole username and the password.

A username always ends in its workspace: `arduino@acme.default`. The part after the `@` is the **domain**: your account name, a dot, and the workspace. An account `acme` with only the standard workspace has the domain `acme.default`.
{% endstep %}

{% step %}
#### Know the topic rule

Every topic a client of `acme.default` uses begins with that domain. `acme.default/arduino` is a good first topic. Avoid a topic of exactly five levels and any level named `__something__`: those belong to the platform's own traffic. See [Connect an external MQTT client](connect-an-external-mqtt-client.md) for the whole rule.
{% endstep %}

{% step %}
#### Install the libraries

In the Arduino IDE's library manager: **PubSubClient** (Nick O'Leary) and **ArduinoJson** (Benoît Blanchon). `WiFi` and `WiFiClientSecure` come with the ESP32 board package.
{% endstep %}
{% endstepper %}

## The sketch

Replace the four capitalized placeholders. For the account `acme` with the standard workspace, `ACCOUNT` is `acme` and the topic reads `acme.default/arduino`.

```cpp
// Use <ESP8266WiFi.h> for ESP8266

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// 1. WiFi
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// 2. The workspace's broker.
//    Port 8884 is MQTT over TLS; in the Heisenware cloud it is the only
//    way in, because the address is read from the TLS handshake.
const char* mqtt_server = "ACCOUNT.heisenware.cloud";
const int mqtt_port = 8884;
const char* mqtt_user = "arduino@ACCOUNT.default";
const char* mqtt_pass = "YOUR_HW_MQTT_PASSWORD";

// 3. The topic always starts with the workspace's domain
const char* mqtt_topic = "ACCOUNT.default/arduino";

// 4. Publishing interval
unsigned long lastMsgTime = 0;
const long msgInterval = 5000; // every 5 seconds

WiFiClientSecure espClient;
PubSubClient client(espClient);

// Called for every message on a subscribed topic
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void setup() {
  Serial.begin(115200);
  delay(10);

  randomSeed(analogRead(A0));

  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // 5. The quick way: do not validate the server certificate.
  //    For production, load the CA chain with espClient.setCACert().
  Serial.println("WARNING: server certificate validation is off");
  espClient.setInsecure();

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");

    // On port 8884 the client id is yours to choose freely
    const char* clientID = "esp32-line2";

    if (client.connect(clientID, mqtt_user, mqtt_pass)) {
      Serial.println("connected");

      // Subscribing is optional. The broker also hands back what this
      // client publishes, so subscribe to another topic to avoid an echo.
      client.subscribe(mqtt_topic);
      Serial.print("Subscribed to: ");
      Serial.println(mqtt_topic);

    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" - retrying in 5 seconds");
      delay(5000);
    }
  }
}

void publishRandomValue() {
  int randomValue = random(0, 100);

  StaticJsonDocument<64> doc;
  doc["value"] = randomValue;

  char buffer[64];
  size_t n = serializeJson(doc, buffer);

  Serial.print("Publishing JSON: ");
  Serial.println(buffer);

  if (client.publish(mqtt_topic, buffer, n)) {
    Serial.println("Publish OK");
  } else {
    Serial.println("Publish failed");
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsgTime > msgInterval) {
    lastMsgTime = now;
    publishRandomValue();
  }
}
```

## See the data in an App

The messages arrive on the workspace's own broker, where every App can hear them.

1. In the Builder's [Functions explorer](../app-builder/explorers/functions.md), open **Connectors** > **MQTT Client** > **internal-mqtt** and drag [`onJsonMessage`](../reference/functions/connectors/mqtt-client.md#onjsonmessage) onto the Flowboard. That instance is already connected.
2. Set its `topic` input to `acme.default/arduino`.
3. Right-click its trigger and add **App Start** > **once on deploy**, then click **Test**.
4. The payloads appear on the executor's **event outputs**. The return only says that the executor is listening. Link an output to a widget, or wire it onward.

## When it does not connect

* **`rc=-2`, over and over**: the TLS handshake failed. Check the port (`8884`, not `1883`) and that the firewall lets outbound TCP 8884 through.
* **`rc=5`**: the login was refused. Copy the username again, whole, including the `@acme.default`. Changing the password in the Integrations panel closes the device's connection at once.
* **Connected, but the App hears nothing**: the topic does not start with the workspace's domain, or it has exactly five levels. The broker accepts the connection and refuses the publish.
* **A reading arrives as a string**: `doc["value"] = randomValue` sends a number. A numeric-looking value the device sends as text stays text all the way into the database, where a numeric column refuses it.
