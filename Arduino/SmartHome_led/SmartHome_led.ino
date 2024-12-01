
#include "FadeInOut.h"
#include "Rainbow.h"
#include "StandardAnimation.h"
#include "Cyclon.h"
#include "FunLoop.h"
#include "RandomChange.h"
#include "SimpleColor.h"

NeoPixelBus<NeoGrbFeature, Neo800KbpsMethod> strip(PixelCount, PixelPin);

MyStrip myStrip(PixelCount, PixelPin, strip);


void setup() {
  Serial.begin(9600);

  strip.Begin();
  strip.Show();
  
 
}



MyAnimation* an = NULL;
void* settings = NULL;
float luminance = 0.4f; //for FadeInOut
uint8_t RainbowBrightness = 20; int RainbowDelay = 50; //for rainbow
uint8_t AnimType = 0; //for Cyclon
RgbColor color;

char order = '0';
void loop() {
  if (Serial.available()){
    String data = Serial.readString();
    order = data[0];
  }

  if (order != 'r'){
    delete an;
    an = NULL;
  }
  switch (order){
    case '0':
      an = new SimpleColor(myStrip);
      settings = NULL;
      break;
    case '1':
      an = new FadeInOut(myStrip);
      luminance  = 0.1f;
      settings = (void*) &luminance ;
      break;
    case '2':
      an = new Rainbow(myStrip);
      RainbowBrightness = 10;
      settings = (void*) &RainbowBrightness;
      break;
    case '3':
      an = new StandardAnimation(myStrip);
      settings = NULL;
      break;
    case '4':
      an = new Cyclon(myStrip);
      AnimType = 2;
      settings = (void*) &AnimType;
      break;
    case '5':
      an = new FunLoop(myStrip);
      settings = NULL;
      break;
    case '6':
      an = new RandomChange(myStrip);
      settings = NULL;
      break;
    case '7':
      an = new SimpleColor(myStrip);
      color = RgbColor(255, 30, 190);
      settings = (void *) &color;
      break;

  }
  order = 'r';
  if (an != NULL){
    an->Run(settings);
  }

}
