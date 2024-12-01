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

void RandomChange::Run(void* settings){
  if (animationsRC.IsAnimating()) {
      animationsRC.UpdateAnimations();
      myStrip.strip.Show();
  }
  else {
      PickRandom(0.2f); 
  }

}