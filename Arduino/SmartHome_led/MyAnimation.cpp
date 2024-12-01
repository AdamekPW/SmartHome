#include "MyAnimation.h"

MyAnimation::MyAnimation(MyStrip& myStrip) : myStrip(myStrip){
}

void MyAnimation::SetRandomSeed(){
    uint32_t seed;
    seed = analogRead(0);
    delay(1);

    for (int shifts = 3; shifts < 31; shifts += 3)
    {
        seed ^= analogRead(0) << shifts;
        delay(1);
    }

    randomSeed(seed);
}