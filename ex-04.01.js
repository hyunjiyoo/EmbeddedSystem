/* 실습일지(10/11) ex04-01
   조건1) 3개의 센서(버튼, 광센서, 터치센서) 4개의 액츄레이터(부저, LED1, LED3, 릴레이)를 활용한다.
   조건2) Touch 센서에 터치할때마다 1색 LED가 0.2초동안 켜졌다 꺼진다.
   조건3) 버튼을 첫 번째 누르면 부저소리가 0.1초동안 나면서 3색 LED가 모두 켜진다.
   조건4) 3색 LED가 모두 켜져있을때만 광센서가 빛을 센싱 할 수 있다.
   조건5) 광센서에서 변화(밝음->어두움)가 측정되면 Relay를 제어하여 전류를 흐르게 한다.
   조건6) 광센서에서 변화(어두움->밝음)가 측정되면 Relay를 제어하여 전류를 차단시킨다.
   조건7) 버튼을 두 번째 누르면 부저소리가 0.1초동안 나면서 3색 LED가 모두 꺼진다.
   조건8) 무한반복 실행되며, ^c를 누르면 모든 LED, 부저, 릴레이가 모두 꺼진후 프로그램이 종료된다.
 */

const gpio = require('node-wiring-pi');
const BUTTON = 21;
const LIGHT = 22;
const TOUCH = 24;
const BUZZER = 25;
const LED3 = 28;
const RELAY = 29;
const LED1 = 27;

var count = 0;

const CheckTouch = function() {
    var data_t = gpio.digitalRead(TOUCH);
    if(data_t) {
        gpio.digitalWrite(LED1, 1);
        gpio.delay(200);
        gpio.digitalWrite(LED1, 0);
    }
    setTimeout(CheckButton, 100);
}

const CheckButton = function () {
    CheckTouch();
    var data_b = gpio.digitalRead(BUTTON);
    if(!data_b) {
        gpio.digitalWrite(BUZZER, 1);
        gpio.delay(100);
        gpio.digitalWrite(BUZZER, 0);
        count++;
        if(count%2 == 1) {
            gpio.digitalWrite(LED3, 1);
            setTimeout(CheckLight, 300);
        }
        else {
            gpio.digitalWrite(LED3, 0);
        }
    }
    setTimeout(CheckButton, 300);
}

const CheckLight = function() {
    var data_l = gpio.digitalRead(LIGHT);
    if(data_l) {
        gpio.digitalWrite(RELAY, gpio.HIGH);
    }
    else {
        gpio.digitalWrite(RELAY, gpio.LOW);
    }
    setTimeout(CheckButton, 300);
}

process.on('SIGINT', function() {
    gpio.digitalWrite(LED1, 0);
    gpio.digitalWrite(LED3, 0);
    gpio.digitalWrite(BUZZER, 0);
    gpio.digitalWrite(RELAY, 0);
    console.log("Program Exit...");
    process.exit();
});

gpio.setup('wpi'); // gpio.wiringPiSetup();
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(LIGHT, gpio.INPUT);
gpio.pinMode(TOUCH, gpio.INPUT);
gpio.pinMode(BUZZER, gpio.OUTPUT);
gpio.pinMode(LED3, gpio.OUTPUT);
gpio.pinMode(RELAY, gpio.OUTPUT);
gpio.pinMode(LED1, gpio.OUTPUT);

setTimeout(CheckButton, 300);