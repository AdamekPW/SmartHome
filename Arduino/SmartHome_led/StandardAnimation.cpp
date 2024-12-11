#include "StandardAnimation.h"

StandardAnimation::StandardAnimation(MyStrip& myStrip) : MyAnimation(myStrip){
  SetRandomSeed();

  for (uint16_t pixel = 0; pixel < PixelCount; pixel++)
  {
      RgbColor color = RgbColor(random(255), random(255), random(255));
      myStrip.strip.SetPixelColor(pixel, color);
  }

}

NeoPixelAnimator animationsSA(PixelCount, NEO_CENTISECONDS);

#if defined(NEOPIXEBUS_NO_STL)

struct SAAnimationState
{
    RgbColor StartingColor;  // the color the animation starts at
    RgbColor EndingColor; // the color the animation will end at
    AnimEaseFunction Easeing; // the acceleration curve it will use 
};

SAAnimationState animationStateSA[PixelCount];


void StandardAnimation::AnimUpdate(const AnimationParam& param)
{
    float progress = animationStateSA[param.index].Easeing(param.progress);

    RgbColor updatedColor = RgbColor::LinearBlend(
        animationStateSA[param.index].StartingColor,
        animationStateSA[param.index].EndingColor,
        progress);

    myStrip.strip.SetPixelColor(param.index, updatedColor);
}
#endif


void StandardAnimation::SetupAnimationSet(float brightness)
{
    for (uint16_t pixel = 0; pixel < PixelCount; pixel++)
    {
        const uint8_t peak = 128;
        uint16_t time = random(100, 400);
        RgbColor originalColor = myStrip.strip.GetPixelColor<RgbColor>(pixel);
        RgbColor targetColor = RgbColor(random(peak)*brightness, random(peak)*brightness, random(peak)*brightness);
        AnimEaseFunction easing;

        switch (random(3))
        {
        case 0:
            easing = NeoEase::CubicIn;
            break;
        case 1:
            easing = NeoEase::CubicOut;
            break;
        case 2:
            easing = NeoEase::QuadraticInOut;
            break;
        }

    #if defined(NEOPIXEBUS_NO_STL)
        animationStateSA[pixel].StartingColor = originalColor;
        animationStateSA[pixel].EndingColor = targetColor;
        animationStateSA[pixel].Easeing = easing;

        animationsSA.StartAnimation(pixel, time, AnimUpdate);
    #else
        AnimUpdateCallback animUpdate = [=](const AnimationParam& param)
        {
            float progress = easing(param.progress);
            RgbColor updatedColor = RgbColor::LinearBlend(originalColor, targetColor, progress);
            myStrip.strip.SetPixelColor(pixel, updatedColor);
        };
        animationsSA.StartAnimation(pixel, time, animUpdate);
    #endif
    }
}

settings_StandardAnimation StandardAnimation::Parse(String data){
  int startIndex = data.indexOf('|') + 1;
  int endIndex = data.indexOf('|', startIndex);
  float brightness = data.substring(startIndex, endIndex).toFloat();

  return settings_StandardAnimation(brightness);
}


void StandardAnimation::Run(void *settings){
    settings_StandardAnimation sett = (settings == NULL) ? settings_StandardAnimation(0.2) : *(settings_StandardAnimation*) settings;
    if (animationsSA.IsAnimating()) {
        animationsSA.UpdateAnimations();
        myStrip.strip.Show();
    }
    else {
        SetupAnimationSet(sett.brightness);
    }

}



