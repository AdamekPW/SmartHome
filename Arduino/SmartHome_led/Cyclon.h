#ifndef CYCLON_H
#define CYCLON_H

#include "MyAnimation.h"


class Cyclon : public MyAnimation {
  private:
      void FadeAll(uint8_t darkenBy);
      void FadeAnimUpdate(const AnimationParam& param);
      void MoveAnimUpdate(const AnimationParam& param);
      void SetupAnimations();
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
      Cyclon(MyStrip& myStrip);
      void Run(void* settings);


};

#endif