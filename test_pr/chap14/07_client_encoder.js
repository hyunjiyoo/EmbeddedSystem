const req = require('request');
const gpio = require('node-wiring-pi');
const DT = 29, CLK = 28;
var rid, rotate = 0;

var encoderValue = {
    actid: 'LED3',
    value: rotate
};

req.put(
    {url: 'http://127.0.0.1:60001/led',
     form: encoderValue,
     headers: {'content-type' : 'application/x-www-form-urlencoded'}},
    (err, res, body) => {
        id(!err && res.statusCode === 200)
            console.log(body);
    }
);

const SenseRotate = () => {
    var checked = 0;
    // 오른쪽 회전 (1++)
    while(gpio.digitalRead(DT) === 0) {
        if(checked === 0) {
            rotate++;
            checked++;
        }
        while(gpio.digitalRead(CLK) === 0) { }
    }
    // 왼쪽 회전 (1--)
    while(gpio.digitalRead(CLK) === 0) {
        if(checked === 0) {
            rotate--;
            checked++;
        }
        while(gpio.digitalRead(DT) == 0) { }
    }
    rid = setTimeout(SenseRotate, 100);
}

process.on('SIGINT', ()=> {
    clearTimeout(rid);
    process.exit();
});

gpio.wiringPiSetup();
gpio.pinMode(DT, gpio.INPUT);
gpio.pinMode(CLK, gpio.INPUT);
setImmediate(SenseRotate);