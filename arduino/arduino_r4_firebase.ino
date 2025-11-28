#include <WiFiS3.h>
#include <ArduinoHttpClient.h>

// --- WiFi Credentials ---
const char* ssid = "FBI Surveillance Van";
const char* password = "wakerthebaker";

// --- Firebase Information ---
const char* firebaseHost = "arduino-r4-wifi-default-rtdb.firebaseio.com";
String firebasePath = "/test.json";  // the .json is required for REST API

WiFiClient wifi;
HttpClient client = HttpClient(wifi, firebaseHost, 80);

void setup() {
  Serial.begin(115200);
  delay(2000);

  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println("\nConnected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  sendTestData();
}

void loop() {
  // You can add code here to send data repeatedly
  // For now we only send once on startup
}

// --- Function to send data to Firebase ---
void sendTestData() {
  Serial.println("Sending test data to Firebase...");

  client.beginRequest();
  client.post(firebasePath);
  client.sendHeader("Content-Type", "application/json");
  client.sendHeader("Connection", "close");
  
  // Change this to any data you want to send
  String jsonData = "{\"message\":\"hello from Arduino R4!\"}";
  
  client.sendHeader("Content-Length", jsonData.length());
  client.beginBody();
  client.print(jsonData);
  client.endRequest();

  // Read response
  int status = client.responseStatusCode();
  String response = client.responseBody();

  Serial.print("Status code: ");
  Serial.println(status);
  
  Serial.print("Response: ");
  Serial.println(response);
}
