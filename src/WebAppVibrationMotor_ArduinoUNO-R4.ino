#include "WiFiS3.h"
#include "ArduinoGraphics.h"
#include "Arduino_LED_Matrix.h"

const char* ssid = "Your Network Name";
const char* password = "Your Network PW";
const int motorPin = 2; // set vibration motor pin (any digital pin on the Arduino Board)

ArduinoLEDMatrix matrix;
WiFiServer server(80);

void setup() {
  Serial.begin(9600);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.print("Connected! IP: ");
  Serial.println(WiFi.localIP());

  server.begin();

  pinMode(motorPin, OUTPUT);
  digitalWrite(motorPin, LOW); // Ensure motor is off at startup

  matrix.begin();

  matrix.beginDraw();
  matrix.stroke(0xFFFFFFFF);
  const char text[] = "Hi!";   // you can add here a custom "welcome" text
  matrix.textFont(Font_4x6);
  matrix.beginText(0, 1, 0xFFFFFF);
  matrix.println(text);
  matrix.endText();

  matrix.endDraw();

  delay(2000);
}

void loop() {
  WiFiClient client = server.available();
  if (client) {
    Serial.println("New Client Connected");
    String request = client.readStringUntil('\r');
    Serial.println(request);
    client.flush();

    // Basic command handling
    if (request.indexOf("/VP1=ON") != -1) {
      startVibration(1000);  // Vibrate for 1 second (1000 ms)
      writeLEDmatrix("VP1"); // Write a scrolling text on the Arduino UNO R4 WiFi Led Matrix
    }
    if (request.indexOf("/VP2=ON") != -1) {
      startVibration(500);   // Vibrate for 0.5 second (500 ms)
      writeLEDmatrix("VP2"); // Write a scrolling text on the Arduino UNO R4 WiFi Led Matrix
      startVibration(500);   // Vibrate for 0.5 second (500 ms)
    }

    // Send HTML response
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: text/html\n");
    client.println("<!DOCTYPE html><html><body>");
    client.println("<h1>Arduino Web Control</h1>");
    client.println("<form action=\"/VP1=ON\" method=\"GET\"><button>Vibration Pattern 1</button></form>");
    client.println("<form action=\"/VP2=ON\" method=\"GET\"><button>Vibration Pattern 2</button></form>");
    client.println("</body></html>");
    client.stop();
    Serial.println("Client disconnected.");
  }

}

// Function - Start the vibration motor for a specified time in ms
void startVibration(int highTimeMs) {
  digitalWrite(motorPin, HIGH);
  delay(highTimeMs);              // Keep motor on
  digitalWrite(motorPin, LOW);    // Then turn it off
}

// Function - write on LED matrix
void writeLEDmatrix(const char* textmess) {
  matrix.beginDraw();
  matrix.stroke(0xFFFFFFFF);
  matrix.textScrollSpeed(100);
  matrix.textFont(Font_5x7);
  matrix.beginText(0, 1, 0xFFFFFF);
  matrix.println(textmess);
  matrix.endText(SCROLL_LEFT);
  matrix.endDraw();
}