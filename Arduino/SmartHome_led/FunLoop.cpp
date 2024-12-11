#include "FunLoop.h"

struct FunLoopAnimationState
{
    RgbColor StartingColor;
    RgbColor EndingColor;
    uint16_t IndexPixel; 
};

const uint16_t AnimCount = PixelCount / 5 * 2 + 1;
const uint16_t PixelFadeDuration = 1000; 
const uint16_t NextPixelMoveDuration = 10000 / PixelCount; 

NeoGamma<NeoGammaTableMethod> colorGamma;
NeoPixelAnimator animationsFunLoop(AnimCount);
FunLoopAnimationState animationStateFunLoop[AnimCount];
uint16_t frontPixel = 0; 
RgbColor frontColor;  


FunLoop::FunLoop(MyStrip& myStrip) : MyAnimation(myStrip){
  SetRandomSeed();
  auto callback = [this](const AnimationParam& param) {
    this->LoopAnimUpdate(param);
  };
  animationsFunLoop.StartAnimation(0, NextPixelMoveDuration, callback);
}


void FunLoop::FadeOutAnimUpdate(const AnimationParam& param)
{
    RgbColor updatedColor = RgbColor::LinearBlend(
        animationStateFunLoop[param.index].StartingColor,
        animationStateFunLoop[param.index].EndingColor,
        param.progress);
    myStrip.strip.SetPixelColor(animationStateFunLoop[param.index].IndexPixel, 
        colorGamma.Correct(updatedColor));
}

void FunLoop::LoopAnimUpdate(const AnimationParam& param)
{
    if (param.state == AnimationState_Completed)
    {
        animationsFunLoop.RestartAnimation(param.index);
        frontPixel = (frontPixel + 1) % PixelCount; 
        if (frontPixel == 0) {
            frontColor = HslColor(random(360) / 360.0f, 1.0f, brightness);
        }

        uint16_t indexAnim;
        if (animationsFunLoop.NextAvailableAnimation(&indexAnim, 1))
        {
            animationStateFunLoop[indexAnim].StartingColor = frontColor;
            animationStateFunLoop[indexAnim].EndingColor = RgbColor(0, 0, 0);
            animationStateFunLoop[indexAnim].IndexPixel = frontPixel;

            auto callback = [this](const AnimationParam& param) {
                this->FadeOutAnimUpdate(param);
            };

            animationsFunLoop.StartAnimation(indexAnim, PixelFadeDuration, callback);
        }
    }
}

settings_FunLoop FunLoop::Parse(String data){
    int startIndex = data.indexOf('|') + 1;
    int endIndex = data.indexOf('|', startIndex);
    float brightness = data.substring(startIndex, endIndex).toFloat();

    // startIndex = endIndex + 1;
    // endIndex = data.indexOf('|', startIndex);
    // uint32_t time = data.substring(startIndex, endIndex).toInt();

    return settings_FunLoop(brightness);
}

void FunLoop::Run(void* settings){
    settings_FunLoop sett;
    if (settings == NULL)
      sett = settings_FunLoop(0.2);
    else 
      sett = *(settings_FunLoop*) settings;
    brightness = sett.brightness;
    animationsFunLoop.UpdateAnimations();
    myStrip.strip.Show();
}
