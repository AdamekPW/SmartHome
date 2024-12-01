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
            frontColor = HslColor(random(360) / 360.0f, 1.0f, 0.25f);
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



void FunLoop::Run(void* settings){
    animationsFunLoop.UpdateAnimations();
    myStrip.strip.Show();
}
