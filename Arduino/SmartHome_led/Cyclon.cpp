#include "Cyclon.h"

Cyclon::Cyclon(MyStrip& myStrip) : MyAnimation(myStrip){
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

void Cyclon::SetupAnimations(uint32_t time1, uint32_t time2) {
    auto callback1 = [this](const AnimationParam& param) {
        this->FadeAnimUpdate(param);
    };
    auto callback2 = [this](const AnimationParam& param) {
        this->MoveAnimUpdate(param);
    };
    animationsCyclon.StartAnimation(0, time1, callback1);
    animationsCyclon.StartAnimation(1, time2, callback2);
}

settings_Cyclon Cyclon::Parse(String data){
  int startIndex = data.indexOf('|') + 1;
  int endIndex = data.indexOf('|', startIndex);
  float brightness = data.substring(startIndex, endIndex).toFloat();

  startIndex = endIndex + 1;
  endIndex = data.indexOf('|', startIndex);
  uint8_t mode = data.substring(startIndex, endIndex).toInt();

  startIndex = endIndex + 1;
  endIndex = data.indexOf('|', startIndex);
  uint32_t time1 = data.substring(startIndex, endIndex).toInt();

  startIndex = endIndex + 1;
  endIndex = data.indexOf('|', startIndex);
  uint32_t time2 = data.substring(startIndex, endIndex).toInt();

  
  return settings_Cyclon(brightness, mode, time1, time2);
}


void Cyclon::Run(void* settings){
    
    settings_Cyclon sett;
    if (settings == NULL)
        sett = settings_Cyclon(0.2, 4, 50, 10000);
    else 
        sett = *(settings_Cyclon*) settings;

    switch (sett.mode){
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

    if (!setUp){
       SetupAnimations(sett.time1, sett.time2);
       brightness = sett.brightness;
       setUp = true;
    }

    animationsCyclon.UpdateAnimations();
    myStrip.strip.Show();
}