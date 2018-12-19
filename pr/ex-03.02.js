/* 실습일지(10/2) ex03-2
*  조건1) 버튼을 3초미만으로 누르고 있으면, 파랑색 LED만 켜진 후 꺼진다.
*  조건2) 버튼을 3초이상 누르고 있으면, 3옥타브(도), 4옥타브(미), 5옥타브(솔), 6옥타브(도)를 0.5초 간격으로 연속재생되며, 빨강색 LED가 켜지도록 한다.
*  */
const gpio = require('node-wiring-pi');
const BUTTON = 29;
const LED_B = 23;
const LED_R = 28;
const BUZZER = 25;

var tones = [ 130, 329, 783, 1045 ];
var index = 0;

const CheckButton = function() {
    let data = gpio.digitalRead(BUTTON);
    if(!data){
        // 3초 미만
        BlueOn();
        // 3초 이상
        RedOn();
    }
    setTimeout(CheckButton, 300);
}

const BlueOn = function() {
    gpio.digitalWrite(LED_B, 1);
    gpio.digitalWrite(LED_B, 0);
}

const RedOn = function() {
    gpio.digitalWrite(LED_R, 1);
    if (index >= tones.length - 1) {
        index = 0;
    }
    gpio.softToneWrite(BUZZER, tones[index++]);
    setTimeout(RedOn, 500);
}

gpio.setup('wpi');
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(LED_B, gpio.OUTPUT);
gpio.pinMode(LED_R, gpio.OUTPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
setTimeout(CheckButton, 300);