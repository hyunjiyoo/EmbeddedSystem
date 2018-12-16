const gpio = require('node-wiring-pi');
const DT = 29, CLK = 28;

var rotate = 0;

const SenseRotate = () => {
    var checked = 0;
    // 오른쪽 핀(DT)가 먼저 접점이 떨어질 경우
    while(gpio.digitalRead(DT) == 0) {
        // rotate값을 1추가
        if(checked == 0) {
            rotate++;
            checked++;
            console.log(rotate);
        }
        // 이후 감지되는 과정 모두 무시
        while(gpio.digitalRead(CLK) == 0) { }
    }

    // 왼쪽으로 돌릴 시 CLK 기준으로 수행
    while(gpio.digitalRead(CLK) == 0) {
        if(checked == 0) {
            rotate--;
            checked++;
            console.log(rotate);
        }
        while(gpio.digitalRead(DT) == 0) { }
    }
    setTimeout(SenseRotate, 20);
}

process.on('SIGINT', () => {
    console.log('Program exit...');
    process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(DT, gpio.INPUT);
gpio.pinMode(CLK, gpio.INPUT);
setImmediate(SenseRotate);