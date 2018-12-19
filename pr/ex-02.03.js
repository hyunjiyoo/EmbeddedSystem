/* 실습일지(9/27) ex02-3
   조건1) 2색LED와 3색LED를 사용한다.
   조건2) LED2와 빨강색 LED3을 1초씩 번갈아가면서 교차로 ON/OFF 시켜라.
   조건3) 무한반복하며, c^를 누르면 종료한다.
 */

const gpio = require('node-wiring-pi');
const LED2 = 27;
const LED3 = 28;

const LED_on = function() {
    gpio.digitalWrite(LED3, 0);
    gpio.digitalWrite(LED2, 1);
    gpio.delay(1000);
    gpio.digitalWrite(LED2, 0);
    gpio.digitalWrite(LED3, 1);
    setTimeout(LED_on, 1000);
}

process.on('SIGINT', function() {
    gpio.digitalWrite(LED2, 0);
    gpio.digitalWrite(LED3, 0);
    process.exit();
});

gpio.setup('wpi');
gpio.pinMode(LED2, gpio.OUTPUT);
gpio.pinMode(LED3, gpio.OUTPUT);
setTimeout(LED_on, 300);