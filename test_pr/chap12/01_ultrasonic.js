const gpio = require('node-wiring-pi');
const TRIG = 26;
const ECHO = 27;

var startTime; // 초음파 송출시간
var travelTime; // 초음파수신까지 경과시간

const Triggering = function () {
    gpio.digitalWrite(TRIG, 0);
    gpio.delayMicroseconds(2);
    gpio.digitalWrite(TRIG, 1);
    gpio.delayMicroseconds(20);
    gpio.digitalWrite(TRIG, 0);

    while(gpio.digitalREAD(ECHO) === 0);

    startTime = gpio.micros();
    while(gpio.digitalREAD(ECHO) === 1);
    travelTime = gpio.micros() - startTime;

    distance = travelTime / 58;
    if (distance < 400) {
        console.log('물체의 거리: %dcm\n', distance);
    }
    setTimeout(Triggering, 500);
}

process.on('SIGINT', () => {
    process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(TRIG, gpio.OUTPUT);
gpio.pinMode(ECHO, gpio.INPUT);
setImmediate(Triggering);