#ifndef STANDARDANIMATION_H
#define STANDARDANIMATION_H

#include "MyAnimation.h"

class StandardAnimation : public MyAnimation {
  private:
    void AnimUpdate(const AnimationParam& param);
    void SetupAnimationSet();
  public:
    StandardAnimation(MyStrip& myStrip);  
    void Run(void* settings);

};

#endif