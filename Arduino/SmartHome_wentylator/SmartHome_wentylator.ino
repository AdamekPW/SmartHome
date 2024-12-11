#include <WiFi.h>
#include <ArduinoWebsockets.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#define WentylatorPIN 27
#define LED 26
#define TermometrPIN 14

OneWire oneWire(TermometrPIN); 
DallasTemperature sensors(&oneWire); //Przekazania informacji do biblioteki

using namespace websockets;


const char* ssid = "TP-Link_B6DD";
const char* password = "25585810";

const char* serverAddress = "ws://192.168.0.104:8765";  

const char* deviceId = "ESP1";

WebsocketsClient webSocket;


void onMessageCallback(WebsocketsMessage message) {
  if (message.data() == "ON"){
    Serial.println("Wlaczanie wentylatora...");
    digitalWrite(WentylatorPIN, HIGH);
  } else if (message.data() == "OFF"){
    Serial.println("Wylaczanie wentylatora...");
    digitalWrite(WentylatorPIN, LOW);
  } else {
    Serial.print("Nieznana komenda: ");
    Serial.println(message.data());
  }
}

void connectToWiFi() {
    Serial.print("Connecting to WiFi...");
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println(" connected!");
}


void sendData(float temp) {
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["sender_id"] = deviceId;
    jsonDoc["target_id"] = "Front";
    jsonDoc["data"] = temp;  
    String jsonString;
    serializeJson(jsonDoc, jsonString);
    Serial.println(jsonString);
    webSocket.send(jsonString);
}
// Funkcja inicjalizująca połączenie WebSocket
void connectToWebSocket() {
    webSocket.onMessage(onMessageCallback);
    webSocket.onEvent([](WebsocketsEvent event, String data) {
        if(event == WebsocketsEvent::ConnectionOpened) {
            Serial.println("WebSocket connected.");
            
            // Wysłanie identyfikatora urządzenia po połączeniu
            StaticJsonDocument<200> jsonDoc;
            webSocket.send(deviceId);
        } else if(event == WebsocketsEvent::ConnectionClosed) {
            Serial.println("WebSocket disconnected.");
        } else if(event == WebsocketsEvent::GotPing) {
            Serial.println("Received Ping!");
        } else if(event == WebsocketsEvent::GotPong) {
            Serial.println("Received Pong!");
        }
    });

    webSocket.connect(serverAddress);
    
}

float getAvgTemp(){
  float minValue = 127;
  float maxValue = -127;
  float sum = 0;
  for (int i = 0; i < 20; i++){
    sensors.requestTemperatures();
    float temp = sensors.getTempCByIndex(0);
    if (temp < minValue) minValue = temp;
    if (temp > maxValue) maxValue = temp;
    sum += temp;
  }
  sum -= minValue;
  sum -= maxValue;
  return sum / 18;

}

void setup() {
    Serial.begin(9600);
    pinMode(LED, OUTPUT);
    digitalWrite(LED, HIGH);
    connectToWiFi();
    
    connectToWebSocket();
    pinMode(WentylatorPIN, OUTPUT);
}

unsigned long lastSendTime = 0;
void loop() {
    // Utrzymuje połączenie WebSocket
    webSocket.poll();
    if (!webSocket.available()) {
        Serial.println("WebSocket disconnected, reconnecting...");
        connectToWebSocket();  // Ponowna próba połączenia
        digitalWrite(LED, LOW);
        delay(1000);
        digitalWrite(LED, HIGH);
        delay(500);
    } else {
      if (millis() - lastSendTime > 10000) {
          lastSendTime = millis();
          float avgTemp = getAvgTemp();
          sendData(avgTemp);
      }
    }

  
}

