#include "SimpleColor.h"

SimpleColor::SimpleColor(MyStrip& myStrip) : MyAnimation(myStrip){}


void SimpleColor::Run(void* settings){
  RgbColor color = settings == NULL ? RgbColor(0, 0, 0) : *(RgbColor *) settings;
  for (int i = 0; i < PixelCount; i++){
    myStrip.strip.SetPixelColor(i, color);
  }
  myStrip.strip.Show();
}