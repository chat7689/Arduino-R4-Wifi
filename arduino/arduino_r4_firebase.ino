#include <WiFiS3.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <R4HttpClient.h>
#include "arduino_secrets.h"  // Your WiFi credentials

// Initialize LCD with I2C address 0x27, 16 columns, 2 rows
LiquidCrystal_I2C lcd(0x27, 16, 2);

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

// Firebase URL
const char* FIREBASE_URL = "https://arduino-r4-wifi-default-rtdb.firebaseio.com/lcd/text.json";

WiFiSSLClient wifiClient;
R4HttpClient http; // Using default constructor

String lastText = "";
unsigned long lastPoll = 0;
const unsigned long POLL_MS = 2000;

void setup() {
  Serial.begin(115200);
  delay(500);

  lcd.init();
  lcd.backlight();
  lcd.print("Connecting WiFi...");

  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(250);
    Serial.print(".");
  }

  IPAddress ip = WiFi.localIP();
  lcd.clear();
  lcd.print("IP Address:");
  lcd.setCursor(0,1);
  lcd.print(ip);
  Serial.print("Connected with IP: "); Serial.println(ip);

  http.begin(wifiClient, FIREBASE_URL); // ready to fetch data
}

void loop() {
  if (millis() - lastPoll < POLL_MS) return;
  lastPoll = millis();

  if (WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid, pass);
    return;
  }

  int code = http.GET();
  if (code != 200) {
    Serial.print("HTTP GET failed, code: "); Serial.println(code);
    return;
  }

  String body = http.getBody();
  Serial.print("Response: "); Serial.println(body);

  // Expecting JSON string e.g. "Hello"
  if (body.length() >= 2 && body[0] == '"' && body[body.length()-1] == '"') {
    String txt = body.substring(1, body.length()-1);
    if (txt != lastText) {
      lastText = txt;
      lcd.clear();
      if (txt.length() <= 16) {
        lcd.print(txt);
      } else {
        lcd.print(txt.substring(0,16));
        lcd.setCursor(0,1);
        lcd.print(txt.substring(16, min((int)txt.length(), 32)));
      }
      Serial.print("LCD updated: "); Serial.println(txt);
    }
  } else {
    Serial.println("Unexpected JSON format");
  }
}
