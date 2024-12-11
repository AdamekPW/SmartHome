#ifndef RANDOMCHANGE_H
#define RANDOMCHANGE_H

#include "MyAnimation.h"

class RandomChange : public MyAnimation {
    private:
        void BlendAnimUpdate(const AnimationParam& param);
        void PickRandom(float luminance);
    public:
        static settings_RandomChange Parse(String data);
        RandomChange(MyStrip &myStrip);
        void Run(void* settings);

};

#endif