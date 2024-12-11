#ifndef CONSTS_H
#define CONSTS_H
#include "Arduino.h"
#include <NeoPixelBus.h>
#include <NeoPixelAnimator.h>
const uint16_t PixelCount = 83;
const uint8_t PixelPin = 26;

struct settings_FadeInOut {
    float brightness;
};

struct settings_Rainbow {
    float brightness;
    int del;
};

struct settings_StandardAnimation {
    float brightness;
};

struct settings_Cyclon {
    float brightness;
    uint8_t mode;
    uint32_t time1;
    uint32_t time2;
};

struct settings_FunLoop {
    float brightness;
};

struct settings_RandomChange {
    float brightness;
};


struct settings_SimpleColor {
    float brightness;
    RgbColor color;
};



#endif