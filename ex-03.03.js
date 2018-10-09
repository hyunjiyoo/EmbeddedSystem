/* 실습일지(10/2) ex03-3
*  조건1) 2개의 센서(버튼, 광센서) 2개의 액츄레이터(부저, 3색LED)를 활용한다.
*  조건2) 버튼을 누르면 0.5초간 부저소리가 발생하며, 아래 조건3, 조건4가 활성화된다.
*  조건3) 어두워지면 3색LED를 모두 켠다. 밝아지면 LED가 모두 꺼진다.
*  조건4) 무한반복 실행되며, ^C를 누르면 모든 LED와 부저가 모두 꺼진후 프로그램이 종료된다. */

const gpio = require('node-wiring-pi');
const LIGHT = 2;
const BUTTON = 29;
const LED_R = 28;
const LED_G = 27;
const LED_B = 23;
const BUZZER = 25;

const CheckButton = function () {
    let data = gpio.digitalRead(BUTTON);
    if(!data) {
        gpio.digitalWrite(BUZZER, 1);
        setTimeout(CheckLight, 500);
    }
    setTimeout(CheckButton, 300);
}

const CheckLight = function () {
    gpio.digitalWrite(BUZZER, 0);
    let data_l = gpio.digitalRead(LIGHT);
    if(!data_l) {
        console.log("Nodejs: Bright!!");
        gpio.digitalWrite(LED_R, 0);
        gpio.digitalWrite(LED_G, 0);
        gpio.digitalWrite(LED_B, 0);
    }
    else {
        console.log("Nodejs: Dark..");
        gpio.digitalWrite(LED_R, 1);
        gpio.digitalWrite(LED_G, 1);
        gpio.digitalWrite(LED_B, 1);
    }
    setTimeout(CheckLight, 100);
}

process.on('SIGINT', function () {
    gpio.digitalWrite(BUZZER, 0);
    gpio.digitalWrite(LED_R, 0);
    gpio.digitalWrite(LED_G, 0);
    gpio.digitalWrite(LED_B, 0);
    process.exit();
});

gpio.setup('wpi');
gpio.pinMode(LIGHT, gpio.INPUT);
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(LED_R, gpio.OUTPUT);
gpio.pinMode(LED_G, gpio.OUTPUT);
gpio.pinMode(LED_B, gpio.OUTPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);

setTimeout(CheckButton, 100);