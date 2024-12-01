#ifndef MYANIMATION
#define MYANIMATION

#include "Arduino.h"
#include <NeoPixelBus.h>
#include <NeoPixelAnimator.h>
#include <String.h>
#include "Consts.h"


struct MyStrip {
  uint16_t PixelCount;
  uint8_t PixelPin;
  NeoPixelBus<NeoGrbFeature, Neo800KbpsMethod>& strip;
};

class MyAnimation {

    public:
        MyStrip& myStrip;
        MyAnimation(MyStrip& myStrip);
        void SetRandomSeed();
        virtual void Run(void* settings) = 0;

};

#endif