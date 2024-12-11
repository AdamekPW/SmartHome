#ifndef FUNLOOP_H
#define FUNLOOP_H

#include "MyAnimation.h"

class FunLoop : public MyAnimation {
    private:
        float brightness = 0.25f;
        bool setUp = false;
        settings_FunLoop sett = settings_FunLoop(0.25);
        void FadeOutAnimUpdate(const AnimationParam& param);
        void LoopAnimUpdate(const AnimationParam& param);
        
    public:
        static settings_FunLoop Parse(String data);
        FunLoop(MyStrip &myStrip);
        void Run(void* settings);

};


#endif