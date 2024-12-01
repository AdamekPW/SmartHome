#include "Cyclon.h"

Cyclon::Cyclon(MyStrip& myStrip) : MyAnimation(myStrip){
  SetupAnimations();
}

const RgbColor CylonEyeColor(HtmlColor(0x7f0000));
NeoPixelAnimator animationsCyclon(2);
uint16_t lastPixel = 0; 
int8_t moveDir = 1;


void Cyclon::FadeAll(uint8_t darkenBy)
{
    RgbColor color;
    for (uint16_t indexPixel = 0; indexPixel < myStrip.strip.PixelCount(); indexPixel++)
    {
        color = myStrip.strip.GetPixelColor<RgbColor>(indexPixel);
        color.Darken(darkenBy);
        myStrip.strip.SetPixelColor(indexPixel, color);
    }
}

void Cyclon::FadeAnimUpdate(const AnimationParam& param)
{
    if (param.state == AnimationState_Completed)
    {
        FadeAll(10);
        animationsCyclon.RestartAnimation(param.index);
    }
}

void Cyclon::MoveAnimUpdate(const AnimationParam& param)
{
    float progress = moveEase(param.progress);

    uint16_t nextPixel;
    if (moveDir > 0)
        nextPixel = progress * PixelCount;
    else
      nextPixel = (1.0f - progress) * PixelCount;

    if (lastPixel != nextPixel) {
        for (uint16_t i = lastPixel + moveDir; i != nextPixel; i += moveDir) {
            myStrip.strip.SetPixelColor(i, CylonEyeColor);
        }
    }
    myStrip.strip.SetPixelColor(nextPixel, CylonEyeColor);
    lastPixel = nextPixel;

    if (param.state == AnimationState_Completed)
    {
        moveDir *= -1;
        animationsCyclon.RestartAnimation(param.index);
    }
}

void Cyclon::SetupAnimations() {
    auto callback1 = [this](const AnimationParam& param) {
        this->FadeAnimUpdate(param);
    };
    auto callback2 = [this](const AnimationParam& param) {
        this->MoveAnimUpdate(param);
    };
    animationsCyclon.StartAnimation(0, 50, callback1);
    animationsCyclon.StartAnimation(1, 10000, callback2);
}


void Cyclon::Run(void* settings){
    uint8_t AnimType = settings == NULL ? 0 : *(uint8_t*) settings;
    switch (AnimType){
      case 0:
          moveEase = NeoEase::Linear;
          break;
      case 1:
          moveEase = NeoEase::QuadraticInOut;
          break;
      case 2:
          moveEase = NeoEase::CubicInOut;
          break;
      case 3:
          moveEase = NeoEase::QuarticInOut;
          break;
      case 4:
          moveEase = NeoEase::QuinticInOut;
          break;
      case 5:
          moveEase = NeoEase::SinusoidalInOut;
          break;
      case 6:
          moveEase = NeoEase::ExponentialInOut;
          break;
      case 7:
          moveEase = NeoEase::CircularInOut;
          break;
    }
    animationsCyclon.UpdateAnimations();
    myStrip.strip.Show();
}