#include "FadeInOut.h"

const uint8_t FadeInOutAnimationChannels = 1;
NeoPixelAnimator animationsFadeInOut(FadeInOutAnimationChannels);
FadeInOutAnimationState animationStateFadeInOut[FadeInOutAnimationChannels];

FadeInOut::FadeInOut(MyStrip& myStrip) : MyAnimation(myStrip){}


void FadeInOut::FadeInFadeOutRinseRepeat(float luminance) {
    if (fadeToColor) {
        RgbColor target = HslColor(random(360) / 360.0f, 1.0f, luminance);
        uint16_t time = random(800, 2000);
        
        animationStateFadeInOut[0].StartingColor = myStrip.strip.GetPixelColor<RgbColor>(0);
        animationStateFadeInOut[0].EndingColor = target;
        
        auto callback = [this](const AnimationParam& param) {
            this->BlendAnimUpdate(param);
        };

        animationsFadeInOut.StartAnimation(0, time, callback);
    } else {
        uint16_t time = random(600, 700);
        animationStateFadeInOut[0].StartingColor = myStrip.strip.GetPixelColor<RgbColor>(0);
        animationStateFadeInOut[0].EndingColor = RgbColor(0);

        auto callback = [this](const AnimationParam& param) {
            this->BlendAnimUpdate(param);
        };

        animationsFadeInOut.StartAnimation(0, time, callback);
    }
    fadeToColor = !fadeToColor;
}

void FadeInOut::BlendAnimUpdate(const AnimationParam& param) {
    RgbColor updatedColor = RgbColor::LinearBlend(
        animationStateFadeInOut[param.index].StartingColor,
        animationStateFadeInOut[param.index].EndingColor,
        param.progress
    );

    // Aktualizacja kolorów dla każdego piksela
    for (uint16_t pixel = 0; pixel < myStrip.PixelCount; pixel++) {
        myStrip.strip.SetPixelColor(pixel, updatedColor);
    }
}

settings_FadeInOut FadeInOut::Parse(String data){
  int startIndex = data.indexOf('|') + 1;
  int endIndex = data.indexOf('|', startIndex);
  float brightness = data.substring(startIndex, endIndex).toFloat();

  return settings_FadeInOut(brightness);
}


void FadeInOut::Run(void* settings) {
  settings_FadeInOut sett = (settings == NULL) ? settings_FadeInOut(0.2) : *(settings_FadeInOut*) settings;
  if (animationsFadeInOut.IsAnimating()) {
      animationsFadeInOut.UpdateAnimations();
      myStrip.strip.Show();
  }
  else {
      FadeInFadeOutRinseRepeat(sett.brightness); 
  }
}
