#include <WiFiS3.h>
#include <Arduino_JSON.h>
#include <EEPROM.h>
#include "arduino_secrets.h"  // Add this include

const int motorPin = 2;
WiFiServer server(80);

void setup() {
  Serial.begin(9600);
  delay(1000);
  pinMode(motorPin, OUTPUT);
  digitalWrite(motorPin, LOW);
  
  // Load saved credentials from EEPROM (fallback)
  char savedSsid[32] = "";
  char savedPass[32] = "";
  EEPROM.get(0, savedSsid);
  EEPROM.get(32, savedPass);

  if (strlen(savedSsid) == 0) {
    // No saved credentials: Start AP mode with secrets
    WiFi.beginAP(AP_NAME, AP_PASS);  // Use defines from arduino_secrets.h
    Serial.println("AP mode: Connect to " + String(AP_NAME) + " and go to 192.168.4.1");
    server.begin();
    while (true) {
      WiFiClient client = server.available();
      if (client) {
        String request = client.readStringUntil('\r');
        if (request.indexOf("GET / ") != -1) {
          // Serve setup HTML page
          client.println("HTTP/1.1 200 OK");
          client.println("Content-Type: text/html");
          client.println("Connection: close");
          client.println();
          client.println("<!DOCTYPE html><html><head><title>Arduino Setup</title></head><body>");
          client.println("<h1>WiFi Setup</h1>");
          client.println("<form action='/setup' method='POST'>");
          client.println("SSID: <input type='text' name='ssid'><br>");
          client.println("Password: <input type='password' name='password'><br>");
          client.println("<input type='submit' value='Save and Reboot'>");
          client.println("</form></body></html>");
        } else if (request.indexOf("POST /setup") != -1) {
          // Parse SSID/PW from POST
          String body = "";
          while (client.available()) {
            char c = client.read();
            body += c;
          }
          // Simple parsing (improve for production)
          int ssidStart = body.indexOf("ssid=") + 5;
          int ssidEnd = body.indexOf("&", ssidStart);
          String newSsid = body.substring(ssidStart, ssidEnd);
          int pwStart = body.indexOf("password=") + 9;
          String newPw = body.substring(pwStart);
          
          // Save to EEPROM
          newSsid.toCharArray(savedSsid, 32);
          newPw.toCharArray(savedPass, 32);
          EEPROM.put(0, savedSsid);
          EEPROM.put(32, savedPass);
          
          // Respond and reboot
          client.println("HTTP/1.1 200 OK");
          client.println("Content-Type: text/plain");
          client.println("Connection: close");
          client.println();
          client.println("Credentials saved. Rebooting...");
          delay(1000);
          // Reboot (if supported) or exit loop
        }
        delay(1);
        client.stop();
      }
    }
  } else {
    // Connect to saved network
    WiFi.begin(savedSsid, savedPass);
    while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
    }
    Serial.print("Connected! IP: ");
    Serial.println(WiFi.localIP());
    server.begin();
  }
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