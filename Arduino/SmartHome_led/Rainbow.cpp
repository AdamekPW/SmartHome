#include "Rainbow.h"

Rainbow::Rainbow(MyStrip& myStrip) : MyAnimation(myStrip){}


RgbColor Rainbow::Wheel(uint8_t WheelPos, float scale) 
{
    WheelPos = 255 - WheelPos;
    if (WheelPos < 85) {
        return RgbColor((255 - WheelPos * 3) * scale, 0, (WheelPos * 3) * scale);
    } 
    else if (WheelPos < 170) {
        WheelPos -= 85;
        return RgbColor(0, (WheelPos * 3) * scale, (255 - WheelPos * 3) * scale);
    } 
    else {
        WheelPos -= 170;
        return RgbColor((WheelPos * 3) * scale, (255 - WheelPos * 3) * scale, 0);
    }
}

settings_Rainbow Rainbow::Parse(String data){
  int startIndex = data.indexOf('|') + 1;
  int endIndex = data.indexOf('|', startIndex);
  float brightness = data.substring(startIndex, endIndex).toFloat();

  startIndex = endIndex + 1;
  endIndex = data.indexOf('|', startIndex);
  int del = data.substring(startIndex, endIndex).toInt();

  return settings_Rainbow(brightness, del);
}

void Rainbow::Run(void *settings){
  settings_Rainbow sett;
  if (settings == NULL) sett = settings_Rainbow(0.2, 50);
  else sett = *(settings_Rainbow*) settings;


  static RgbColor color;
  static uint8_t pos;
  static uint16_t j = 0;
  static uint32_t lastRainbowUpdate = 0;
  if (millis() - lastRainbowUpdate > sett.del){
    for(uint16_t i=0; i<myStrip.PixelCount; i++)
    {
        pos = ((i*256/myStrip.PixelCount)+j) & 0xFF;
        color = Wheel( pos, sett.brightness);
        myStrip.strip.SetPixelColor(i, color);
    }

    j++;
    if (j >= 256 * 1) j = 0;
    lastRainbowUpdate = millis();
    myStrip.strip.Show();
  }


}
