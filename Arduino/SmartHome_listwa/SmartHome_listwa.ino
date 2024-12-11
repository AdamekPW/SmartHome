#include <Wire.h>
#include <Adafruit_ADS1015.h>
#include <ESP8266WiFi.h>
#include <ArduinoWebsockets.h>
#include <ArduinoJson.h>

Adafruit_ADS1115 ads;
const float FACTOR = 30; 
const float multiplier = 0.00005;

using namespace websockets;

//#define DEBUG_MODE 

// #define GNIAZDO1 3 //3
// #define GNIAZDO2 1 //1
// #define GNIAZDO3 2


// #define BUTTON1 13
// #define BUTTON2 12
// #define BUTTON3 14
#define GNIAZDO1 13 
#define GNIAZDO2 12 
#define GNIAZDO3 14


#define BUTTON1 3
#define BUTTON2 1
#define BUTTON3 2
#define LED_WIFI 16



const char* ssid = "TP-Link_B6DD";
const char* password = "25585810";
const char* serverAddress = "ws://192.168.0.104:8765";  
const char* deviceId = "ESP2";
WebsocketsClient webSocket;

bool status1 = LOW;
bool status2 = LOW;
bool status3 = LOW;

void onMessageCallback(WebsocketsMessage message) {
    String data = message.data();
    status1 = data[0] == '1' ? HIGH : LOW;
    status2 = data[2] == '1' ? HIGH : LOW;
    status3 = data[4] == '1' ? HIGH : LOW;
    #ifdef DEBUG_MODE
      Serial.println("Otrzymano wiadomość: " + message.data());
    #endif
}

void sendData(float power) {
    String data = String(status1) + "|" + String(status2) + "|" + String(status3) + "|" + String(power);
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["sender_id"] = deviceId;
    jsonDoc["target_id"] = "Front";
    jsonDoc["data"] = data;  
    String jsonString;
    serializeJson(jsonDoc, jsonString);
    #ifdef DEBUG_MODE
      Serial.println(jsonString);
    #endif
    webSocket.send(jsonString);
}
void connectToWebSocket() {
  webSocket.onMessage(onMessageCallback);
  webSocket.onEvent([](WebsocketsEvent event, String data) {
      if (event == WebsocketsEvent::ConnectionOpened) {
          webSocket.send(deviceId);
          #ifdef DEBUG_MODE
            Serial.println("Połączenie WebSocket otwarte!");
          #endif
      } 
      #ifdef DEBUG_MODE
      if (event == WebsocketsEvent::ConnectionClosed) {
          Serial.println("Połączenie WebSocket zamknięte!");
      } else if (event == WebsocketsEvent::GotPing) {
          Serial.println("Otrzymano Ping!");
      } else if (event == WebsocketsEvent::GotPong) {
          Serial.println("Otrzymano Pong!");
      }
      #endif
  });
  bool connected = webSocket.connect(serverAddress);
  
  #ifdef DEBUG_MODE
  if (connected) {
      Serial.println("Połączono z serwerem WebSocket");
  } else {
      Serial.println("Nie udało się połączyć z serwerem WebSocket");
  }
  #endif
}





bool buttonChange = false;
uint32_t current_time = millis();
volatile bool button1Flag = false;
volatile bool button2Flag = false;
volatile bool button3Flag = false;
uint32_t long lastButton1Update = 0;
uint32_t long lastButton2Update = 0;
uint32_t long lastButton3Update = 0;
const uint32_t debounceDelay = 500;

void IRAM_ATTR handleButton1() {
    button1Flag = true;
}

void IRAM_ATTR handleButton2() {
    button2Flag = true;
}

void IRAM_ATTR handleButton3() {
    button3Flag = true;
}

void setup() {
  #ifdef DEBUG_MODE
    Serial.begin(9600); 
  #endif
  Wire.begin(4, 5);
  ads.setGain(GAIN_FOUR);      
  ads.begin();

  pinMode(LED_WIFI, OUTPUT);
  pinMode(GNIAZDO1, OUTPUT);
  pinMode(GNIAZDO2, OUTPUT);
  pinMode(GNIAZDO3, OUTPUT);
  digitalWrite(LED_WIFI, HIGH);
  digitalWrite(GNIAZDO1, HIGH);
  digitalWrite(GNIAZDO2, HIGH);
  digitalWrite(GNIAZDO3, HIGH);

  //Wire.setClock(100000); // Ustawienie na 100 kHz
  delay(300);
  pinMode(BUTTON1, INPUT);
  pinMode(BUTTON2, INPUT);
  pinMode(BUTTON3, INPUT);
  attachInterrupt(digitalPinToInterrupt(BUTTON1), handleButton1, FALLING);
  attachInterrupt(digitalPinToInterrupt(BUTTON2), handleButton2, FALLING);
  attachInterrupt(digitalPinToInterrupt(BUTTON3), handleButton3, FALLING);
  

  WiFi.begin(ssid, password);
  #ifdef DEBUG_MODE
    Serial.print("Łączenie z Wi-Fi");
  #endif

  while (WiFi.status() != WL_CONNECTED) {
      delay(1000);
      #ifdef DEBUG_MODE
        Serial.print(".");
      #endif
  }

  #ifdef DEBUG_MODE
    Serial.println("\nPołączono z Wi-Fi");
  #endif
  connectToWebSocket();
  
}


float getCurrent()
{

  float current;
  float sum = 0;
  float min_sq = 2000;
  float max_sq = -2000;
  for (int i = 0; i < 12; i++){
    float voltage = ads.readADC_Differential_0_1() * multiplier;
    current = voltage * FACTOR;
    sum += sq(current);
    if (min_sq < current) min_sq = current;
    if (max_sq > current) max_sq = current;
  }
  sum -= min_sq;
  sum -= max_sq;
  
  current = sqrt(sum / 10);
  return (current);
}

unsigned long previousMillis = 0; // zmienna do przechowywania poprzedniego czasu
const int interval1 = 800;        // czas pierwszego opóźnienia w milisekundach
const int interval2 = 800;        // czas drugiego opóźnienia w milisekundach
int ledState = LOW;               // aktualny stan diody (LOW lub HIGH)
int currentInterval = interval1;  // zmienna przechowująca aktualny interwał

void loop() {
  webSocket.poll();
  current_time = millis();

  if (button1Flag) {
    button1Flag = false;
    if (current_time - lastButton1Update > debounceDelay) {
        lastButton1Update = current_time;
        //Serial.println("BUTTON1 changed");
        status1 = !status1;
        buttonChange = true;
    }
  }

  if (button2Flag) {
    button2Flag = false;
    if (current_time - lastButton2Update > debounceDelay) {
        lastButton2Update = current_time;
        //Serial.println("BUTTON2 changed");
        status2 = !status2;
        buttonChange = true;
    }
  }

  if (button3Flag) {
    button3Flag = false;
    if (current_time - lastButton3Update > debounceDelay) {
        lastButton3Update = current_time;
        //Serial.println("BUTTON3 changed");
        status3 = !status3;
        buttonChange = true;
    }
  }

  static uint32_t lastConnectionTry = 0;
  if (!webSocket.available()){
    if (current_time - previousMillis >= currentInterval) {
          previousMillis = current_time; 
          ledState = (ledState == LOW) ? HIGH : LOW; 
          digitalWrite(LED_WIFI, ledState);
          currentInterval = (currentInterval == interval1) ? interval2 : interval1;
    }
    
    if (current_time - lastConnectionTry > 20000){
      lastConnectionTry = current_time;
      #ifdef DEBUG_MODE
        Serial.println("WebSocket disconnected, reconnecting...");
      #endif
      connectToWebSocket(); 

    }
    
  } else {
    static uint32_t lastCurrentCheck = 0;
    if (millis() - lastCurrentCheck >= 2000){
      lastCurrentCheck = millis();
      float current = getCurrent();
      #ifdef DEBUG_MODE
        Serial.println(current, 3);
      #endif
      sendData(current*230);
    }
  }

  digitalWrite(GNIAZDO1, !status1);
  digitalWrite(GNIAZDO2, !status2);
  digitalWrite(GNIAZDO3, !status3);
 
  if (buttonChange){
    sendData(-1.0f);
    buttonChange = false;
  }

}
