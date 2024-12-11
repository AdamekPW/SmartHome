#ifndef CYCLON_H
#define CYCLON_H

#include "MyAnimation.h"


class Cyclon : public MyAnimation {
  private:
      bool setUp = false;
      float brightness = 0.2;
      void FadeAll(uint8_t darkenBy);
      void FadeAnimUpdate(const AnimationParam& param);
      void MoveAnimUpdate(const AnimationParam& param);
      void SetupAnimations(uint32_t time1, uint32_t time2);
      AnimEaseFunction moveEase =
//      NeoEase::Linear;
//      NeoEase::QuadraticInOut;
//      NeoEase::CubicInOut;
        NeoEase::QuarticInOut;
//      NeoEase::QuinticInOut;
//      NeoEase::SinusoidalInOut;
//      NeoEase::ExponentialInOut;
//      NeoEase::CircularInOut;
  public:
      static settings_Cyclon Parse(String data);
      Cyclon(MyStrip& myStrip);
      void Run(void* settings);


};

#endif