#include <WiFiS3.h>
#include <Arduino_JSON.h>
#include <EEPROM.h>
#include "arduino_secrets.h"  

const int motorPin = 2;
WiFiServer server(80);

void setup() {
  Serial.begin(9600);
  delay(1000);
  pinMode(motorPin, OUTPUT);
  digitalWrite(motorPin, LOW);
  
  // Credentials
  char savedSsid[32] = SECRET_SSID;
  char savedPass[32] = SECRET_PASS;

  // Connect to saved network
  WiFi.begin(savedSsid, savedPass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.print("Connected! IP: ");
  Serial.println(WiFi.localIP());
  server.begin();
}


void loop() {
  WiFiClient client = server.available();
  if (client) {
    String request = client.readStringUntil('\r');
    client.flush();

    // Handle custom pattern POST
    if (request.indexOf("POST /vibrate/custom") != -1) {
      // Wait for body
      while (client.available() == 0) delay(1);
      String body = "";
      while (client.available()) {
        char c = client.read();
        body += c;
      }
      // Parse JSON
      int jsonStart = body.indexOf('{');
      if (jsonStart != -1) {
        String jsonString = body.substring(jsonStart);
        JSONVar json = JSON.parse(jsonString);
        if (JSON.typeof(json) == "undefined") {
          sendResponse(client, 400, "Invalid JSON");
        } else {
          JSONVar pattern = json["pattern"];
          if (pattern.length() > 0) {
            runPattern(pattern);
            sendResponse(client, 200, "Pattern executed");
          } else {
            sendResponse(client, 400, "No pattern steps");
          }
        }
      } else {
        sendResponse(client, 400, "No JSON found");
      }
    }
    // Test Case
    else if (request.indexOf("/ping") != -1) {
      sendResponse(client, 200, "Connected");
    }

    // Predefined Patterns
    //anger
    else if (request.indexOf("/VP1=ON") != -1) {
      startVibration(1000);
      delay(100);
      startVibration(1000);
      delay(100);
      startVibration(1000);
      sendResponse(client, 200, "Pattern 1 executed");
    }
    //happiness 
    else if (request.indexOf("/VP2=ON") != -1) {
      startVibration(500);
      delay(100);
      startVibration(500);
      delay(100);
      startVibration(500);
      delay(100);
      startVibration(500);
      delay(100);
      startVibration(500);
      delay(100);
      startVibration(500);
      sendResponse(client, 200, "Pattern 2 executed");
    }
    //neutral
    else if (request.indexOf("/VP3=ON") != -1) {
     startVibration(200);
      sendResponse(client, 200, "Pattern 3 executed");
    }
    //sadness
    else if (request.indexOf("/VP4=ON") != -1) {
      startVibration(3000);
      sendResponse(client, 200, "Pattern 4 executed");
    }
    else {
      sendResponse(client, 404, "Not found");
    }
    delay(1);
    client.stop();
  }
}
 
void runPattern(JSONVar pattern) {
  for (int i = 0; i < pattern.length(); i++) {
    int vibrate = (int)pattern[i]["vibrate"];
    int pause = (int)pattern[i]["pause"];
    digitalWrite(motorPin, HIGH);
    delay(vibrate);
    digitalWrite(motorPin, LOW);
    delay(pause);
  }
}

void startVibration(int duration) {
  digitalWrite(motorPin, HIGH);
  delay(duration);
  digitalWrite(motorPin, LOW);
}

void sendResponse(WiFiClient& client, int code, String message) {
  client.println("HTTP/1.1 " + String(code) + " OK");
  client.println("Content-Type: application/json");
  client.println("Connection: close");
  client.println();
  client.print("{\"status\":\"");
  client.print(message);
  client.println("\"}");
}