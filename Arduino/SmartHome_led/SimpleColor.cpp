#include "SimpleColor.h"

SimpleColor::SimpleColor(MyStrip& myStrip) : MyAnimation(myStrip){}


settings_SimpleColor SimpleColor::Parse(String data){
  RgbColor color;

  int endIndex = data.indexOf('|'); 

  int startIndex = endIndex + 1;
  endIndex = data.indexOf('|', startIndex);
  float brightness = data.substring(startIndex, endIndex).toFloat();

  startIndex = endIndex + 1;
  endIndex = data.indexOf('|', startIndex);
  color.R = data.substring(startIndex, endIndex).toInt();

  startIndex = endIndex + 1;
  endIndex = data.indexOf('|', startIndex);
  color.B = data.substring(startIndex, endIndex).toInt();

  startIndex = endIndex + 1;
  endIndex = data.indexOf('|', startIndex);
  color.G = data.substring(startIndex, endIndex).toInt();

  return settings_SimpleColor(brightness, color);
}

void SimpleColor::Run(void* settings){
  
  settings_SimpleColor sett;
  if (settings == NULL) sett = settings_SimpleColor(0.0f, RgbColor(0, 0, 0));
  else  sett = *(settings_SimpleColor *) settings;

  sett.color.R *= sett.brightness;
  sett.color.G *= sett.brightness;
  sett.color.B *= sett.brightness;
  for (int i = 0; i < PixelCount; i++){
    myStrip.strip.SetPixelColor(i, sett.color);
  }
  myStrip.strip.Show();
}