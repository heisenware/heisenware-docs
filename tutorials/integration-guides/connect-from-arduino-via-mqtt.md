# Connect from Arduino via MQTT

Find below a short code snippet showing you how you could send data from your Arduino (ESP32) to your Heisenware account.

For that to work replace the ALL\_CAPS variables in the code with your correct configuration.

{% hint style="success" %}
As you have an external device or application (here the Arduino Device) that needs to publish data _to_ the Heisenware broker, you must first create credentials for it or use smart onboarding. Please follow the guide on [Creating an MQTT Integration](../../app-manager/integrations-inbound-connections.md#mqtt-client) to do this.
{% endhint %}

For a regular account that calls `acme` with no extra workspaces the `ACCOUNT` is `acme` and the `DOMAIN` is `acme.default` .

```cpp
// Use <ESP8266WiFi.h> for ESP8266

#include <WiFi.h> 
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h> // <-- ADDED for JSON

// 1. WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// 2. MQTT Configuration
const char* mqtt_server = "ACCOUNT.heisenware.cloud";
const int mqtt_port = 8884;
const char* mqtt_user = "YOUR_HW_MQTT_USERNAME";
const char* mqtt_pass = "YOUR_HW_MQTT_PASSWORD";
const char* mqtt_topic = "DOMAIN/arduino";

// 3. Timer for publishing
unsigned long lastMsgTime = 0;
const long msgInterval = 5000; // Publish every 5 seconds (5000 ms)

// 4. Instantiate clients
WiFiClientSecure espClient;
PubSubClient client(espClient);

// Callback function for subscribed topics
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

  // Seed the random number generator
  randomSeed(analogRead(A0)); 

  // Connect to WiFi
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  
  // 5. CRITICAL: Disable certificate validation (INSECURE)
  Serial.println("WARNING: Disabling SSL certificate validation!");
  espClient.setInsecure(); 
  
  // 6. Set the MQTT server, custom port, and callback
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    const char* clientID = "MyESP32-JSONPublisher";

    // 7. Connect using username and password
    if (client.connect(clientID, mqtt_user, mqtt_pass)) {
      Serial.println("connected");
      
      // Subscribe to your topic
      client.subscribe(mqtt_topic);
      Serial.print("Subscribed to: ");
      Serial.println(mqtt_topic);
      
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000); 
    }
  }
}

// 8. Function to publish the JSON message
void publishRandomValue() {
  // Generate a random integer
  int randomValue = random(0, 100); // Random number between 0 and 99

  // Create a JSON document.
  // Size 64 is small but sufficient for {"value": 100}
  StaticJsonDocument<64> doc;
  doc["value"] = randomValue;

  // Serialize JSON to a char buffer
  char buffer[64];
  size_t n = serializeJson(doc, buffer);

  // Publish the message
  Serial.print("Publishing JSON: ");
  Serial.println(buffer);
  
  if (client.publish(mqtt_topic, buffer, n)) {
    Serial.println("Publish OK");
  } else {
    Serial.println("Publish failed");
  }
}

void loop() {
  // 1. Ensure connection is active
  if (!client.connected()) {
    reconnect();
  }
  // 2. Allow the MQTT client to process messages
  client.loop();

  // 3. Handle non-blocking publishing
  unsigned long now = millis();
  if (now - lastMsgTime > msgInterval) {
    lastMsgTime = now;
    
    // Call the function to build and send the message
    publishRandomValue();
  }
}

```
