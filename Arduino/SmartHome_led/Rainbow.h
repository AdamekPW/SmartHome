#ifndef RAINBOW_H
#define RAINBOW_H
#include "MyAnimation.h"

class Rainbow : public MyAnimation {
  private:
      RgbColor Wheel(uint8_t WheelPos, uint8_t brightness);

  public:
      Rainbow(MyStrip& myStrip);      
      void Run(void* settings);

};



#endif