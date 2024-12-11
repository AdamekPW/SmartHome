
#include "FadeInOut.h"
#include "Rainbow.h"
#include "StandardAnimation.h"
#include "Cyclon.h"
#include "FunLoop.h"
#include "RandomChange.h"
#include "SimpleColor.h"
#include <Arduino.h>

#include <WiFi.h>
#include <ArduinoWebsockets.h>
#include <ArduinoJson.h>

using namespace websockets;

const char* ssid = "TP-Link_B6DD";
const char* password = "25585810";

const char* serverAddress = "ws://192.168.0.104:8765";  

const char* deviceId = "ESP3";

NeoPixelBus<NeoGrbFeature, Neo800KbpsMethod> strip(PixelCount, PixelPin);

MyStrip myStrip(PixelCount, PixelPin, strip);

WebsocketsClient webSocket;

MyAnimation* an = NULL;
void* settings = NULL;

//id = 1
settings_FadeInOut sett_FadeInOut;
//id = 2
settings_Rainbow sett_Rainbow;
//id = 3 
settings_StandardAnimation sett_StandardAnimation;
//id = 4
settings_Cyclon sett_Cyclon;
//id = 5
settings_FunLoop sett_FunLoop;
//id = 6
settings_RandomChange sett_RandomChange;
//id = 7 
settings_SimpleColor sett_SimpleColor;


void DecodeData(String data){
  char id = data[0];
  switch (id){
    case '0':
      an = new SimpleColor(myStrip);
      settings = NULL;
      break;
    case '1':
      an = new FadeInOut(myStrip);
      sett_FadeInOut = FadeInOut::Parse(data);
      settings = (void*) &sett_FadeInOut;
      break;
    case '2':
      an = new Rainbow(myStrip);
      sett_Rainbow = Rainbow::Parse(data);
      settings = (void*) &sett_Rainbow;
      break;
    case '3':
      an = new StandardAnimation(myStrip);
      sett_StandardAnimation = StandardAnimation::Parse(data);
      settings = (void*) &sett_StandardAnimation;
      break;
    case '4':
      an = new Cyclon(myStrip);
      sett_Cyclon = Cyclon::Parse(data);
      settings = (void*) &sett_Cyclon;
      break;
    case '5':
      an = new FunLoop(myStrip);
      sett_FunLoop = FunLoop::Parse(data);
      settings = (void*) &sett_FunLoop;
      break;
    case '6':
      an = new RandomChange(myStrip);
      sett_RandomChange = RandomChange::Parse(data);
      settings = (void*) &sett_RandomChange;
      break; 
    case '7':
      an = new SimpleColor(myStrip);
      sett_SimpleColor = SimpleColor::Parse(data);
      settings = (void*) &sett_SimpleColor;
      break;

  }
}



void onMessageCallback(WebsocketsMessage message) {
  Serial.println(message.data());
  if (an != NULL) {
      delete an;
      an = NULL;  
  }
  DecodeData(message.data());
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

void connectToWebSocket() {
    webSocket.onMessage(onMessageCallback);
    webSocket.onEvent([](WebsocketsEvent event, String data) {
        if(event == WebsocketsEvent::ConnectionOpened) {
            Serial.println("WebSocket connected.");
            
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

void setup() {
  Serial.begin(9600);
  
  connectToWiFi();
  connectToWebSocket();

  strip.Begin();
  strip.Show();
  
}


void loop() {
  webSocket.poll();
  if (!webSocket.available()) {
      Serial.println("WebSocket disconnected, reconnecting...");
      connectToWebSocket();  // Ponowna próba połączenia
  } 

  if (an != NULL){
    an->Run(settings);
  }

}
