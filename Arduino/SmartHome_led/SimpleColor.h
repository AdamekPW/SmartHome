#ifndef  SIMPLECOLOR_H
#define SIMPLECOLOR_H

#include "MyAnimation.h"

class SimpleColor : public MyAnimation {
    private:
        
    public:
        SimpleColor(MyStrip& myStrip);
        void Run(void* settings);
};


#endif