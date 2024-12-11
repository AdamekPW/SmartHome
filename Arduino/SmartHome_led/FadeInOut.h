#ifndef FADEINOUT
#define FADEINOUT
#include "MyAnimation.h"

struct FadeInOutAnimationState
{
    RgbColor StartingColor;
    RgbColor EndingColor;
};


class FadeInOut : public MyAnimation {
  private:
      boolean fadeToColor = true;
      
      void BlendAnimUpdate(const AnimationParam& param);
      void FadeInFadeOutRinseRepeat(float luminance);
  public:
      static settings_FadeInOut Parse(String data);
      FadeInOut(MyStrip& myStrip);      
      void Run(void *settings);

};

#endif