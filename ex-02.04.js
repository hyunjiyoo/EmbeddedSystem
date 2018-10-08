/* 실습일지(9/27) ex02-4
   조건1) 버튼을 한번 클릭하면 LED2가 켜진다. (켜진상태로 유지)
   조건2) 버튼을 다시한번 클릭하면 LED2가 꺼진다. (꺼진상태로 유지)
   조건3) 무한반복 (단, ^c 종료)
 */

const gpio = require('node-wiring-pi');
const BUTTON = 27;
const LED2 = 28;

var count = 0;

const CheckButton = function() {
    gpio.digitalWrite(LED2, 0);
    let data = gpio.digitalRead(BUTTON);
    if(!data){
        count++;
        LED_light();
    }
}

const LED_light = function() {
    if(count%2 == 1) {
        gpio.digitalWrite(LED2, 1);
    }
    else {
        gpio.digitalWrite(LED2, 0);
    }
}

process.on('SIGINT', function() {
    gpio.digitalWrite(LED2, 0);
    process.exit();
});

gpio.setup('wpi');
gpio.pinMode(BUTTON, gpio.INPUT);
gpio.pinMode(LED2, gpio.OUTPUT);
setTimeout(CheckButton, 300);