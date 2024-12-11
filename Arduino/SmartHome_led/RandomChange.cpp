#include "RandomChange.h"


RandomChange::RandomChange(MyStrip& myStrip) : MyAnimation(myStrip){
    SetRandomSeed();
}

NeoPixelAnimator animationsRC(PixelCount);

struct RCAnimationState
{
    RgbColor StartingColor;
    RgbColor EndingColor;
};

RCAnimationState animationStateRC[PixelCount];

void RandomChange::BlendAnimUpdate(const AnimationParam& param)
{
    RgbColor updatedColor = RgbColor::LinearBlend(
        animationStateRC[param.index].StartingColor,
        animationStateRC[param.index].EndingColor,
        param.progress);
    myStrip.strip.SetPixelColor(param.index, updatedColor);
}

void RandomChange::PickRandom(float luminance)
{
    uint16_t count = random(PixelCount);
    auto callback = [this](const AnimationParam& param) {
      this->BlendAnimUpdate(param);
    };
    while (count > 0)
    {
      
        uint16_t pixel = random(PixelCount);
        uint16_t time = random(100, 400);
        animationStateRC[pixel].StartingColor = myStrip.strip.GetPixelColor<RgbColor>(pixel);
        animationStateRC[pixel].EndingColor = HslColor(random(360) / 360.0f, 1.0f, luminance);

        animationsRC.StartAnimation(pixel, time, callback);

        count--;
    }
}

settings_RandomChange RandomChange::Parse(String data){
     int startIndex = data.indexOf('|') + 1;
    int endIndex = data.indexOf('|', startIndex);
    float brightness = data.substring(startIndex, endIndex).toFloat();

    return settings_RandomChange(brightness);
}

void RandomChange::Run(void* settings){
  settings_RandomChange sett;
  if (settings == NULL)
    sett = settings_RandomChange(0.2);
  else 
    sett = *(settings_RandomChange*) settings;
  if (animationsRC.IsAnimating()) {
      animationsRC.UpdateAnimations();
      myStrip.strip.Show();
  }
  else {
      PickRandom(sett.brightness); 
  }

}