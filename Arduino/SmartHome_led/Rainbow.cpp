#include "Rainbow.h"

Rainbow::Rainbow(MyStrip& myStrip) : MyAnimation(myStrip){}


RgbColor Rainbow::Wheel(uint8_t WheelPos, uint8_t brightness) 
{
    WheelPos = 255 - WheelPos;
    float scale = brightness / 255.0;
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

void Rainbow::Run(void *settings){
  uint8_t brightness = settings == NULL ? 20 : *(uint8_t*)settings;
  static RgbColor color;
  static uint16_t j = 0;
  static uint8_t pos;

  for(uint16_t i=0; i<myStrip.PixelCount; i++)
  {
      pos = ((i*256/myStrip.PixelCount)+j) & 0xFF;
      color = Wheel( pos, 20);
      myStrip.strip.SetPixelColor(i, color);
  }
  myStrip.strip.Show();

  j++;
  if (j >= 256 * 1) j = 0;


  delay(50);

}
