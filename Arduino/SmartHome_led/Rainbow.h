#ifndef RAINBOW_H
#define RAINBOW_H
#include "MyAnimation.h"

class Rainbow : public MyAnimation {
  private:
      RgbColor Wheel(uint8_t WheelPos, float brightness);

  public:
      static settings_Rainbow Parse(String data);
      Rainbow(MyStrip& myStrip);      
      void Run(void* settings);

};



#endif