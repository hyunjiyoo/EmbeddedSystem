/* 실습일지 (10/2) ex03-1
*  조건1) 버튼과 3색LED, 부저를 활용한다.
*  조건2) 버튼을 첫 번째로 누르면 파랑색LED가 켜졌다 꺼진다. 두 번째로 누르면 빨강색이 켜진후 꺼진다. 세 번째로 누르면 초록색LED가 켜진후 꺼진다.
*  조건3) LED가 켜질 때마다 부저소리가 난다.
*  조건4) 무한반복 실행되며, ^C를 누르면 모든 LED와 부저가 모두 켜진 후 프로그램이 종료된다. */

const gpio = require('node-wiring-pi');
const BUTTON = 29;
const LED_RED = 28;
const LED_GREEN = 27;
const LED_BLUE = 23;
const BUZZER = 25;

var order = [1,2,3];
var index = -1;

const TurnOn = function() {
    index++;
    if(index > order.length - 1)
        index = 0;
    gpio.digitalWrite(BUZZER, 1);

    if(order[index] == 1){
        console.log("Blue light on");
        gpio.digitalWrite(LED_BLUE, 1);
    }
    else if(order[index] == 2){
        console.log("Red light on");
        gpio.digitalWrite(LED_RED, 1);
    }
    else {
        console.log("Green light on");
        gpio.digitalWrite(LED_GREEN, 1);
    }
    setTimeout(CheckButton, 100);
}

const TurnOff = function() {
    gpio.digitalWrite(BUZZER, 0);
    gpio.digitalWrite(LED_BLUE, 0);
    gpio.digitalWrite(LED_RED, 0);
    gpio.digitalWrite(LED_GREEN, 0);
    setTimeout(CheckButton, 100);
}

const CheckButton = function() {
    let data = gpio.digitalRead(BUTTON);
    if(!data){
        setTimeout(TurnOn, 100);
    }
    else {
        setTimeout(TurnOff, 100);
    }
}

process.on('SIGINT', function() {
    gpio.digitalWrite(BUZZER, 0);
    gpio.digitalWrite(LED_BLUE, 0);
    gpio.digitalWrite(LED_RED, 0);
    gpio.digitalWrite(LED_GREEN, 0);
    process.exit();
});

gpio.setup('wpi');
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(LED_BLUE, gpio.OUTPUT);
gpio.pinMode(LED_RED, gpio.OUTPUT);
gpio.pinMode(LED_GREEN, gpio.OUTPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);

setTimeout(CheckButton, 100);