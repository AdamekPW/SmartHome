#ifndef STANDARDANIMATION_H
#define STANDARDANIMATION_H

#include "MyAnimation.h"

class StandardAnimation : public MyAnimation {
  private:
    void AnimUpdate(const AnimationParam& param);
    void SetupAnimationSet(float brightness);
  public:
    static settings_StandardAnimation Parse(String data);
    StandardAnimation(MyStrip& myStrip);  
    void Run(void* settings);

};

#endif