#ifndef FUNLOOP_H
#define FUNLOOP_H

#include "MyAnimation.h"

class FunLoop : public MyAnimation {
    private:
        void FadeOutAnimUpdate(const AnimationParam& param);
        void LoopAnimUpdate(const AnimationParam& param);
        
    public:
        FunLoop(MyStrip &myStrip);
        void Run(void* settings);

};


#endif