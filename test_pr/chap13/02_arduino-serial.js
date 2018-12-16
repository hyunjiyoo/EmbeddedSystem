const gpio = require('node-wiring-pi');
const serial = require('serialport');
const BUTTON = 29;
var onoff = 1;

const comport = new serial('/dev/ttyACM0',
    {   baudRate: 9600,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false
    });

comport.on("open", () => {
    console.log("Open성공: Arduino와 연결!!");
});

comport.on("data", (data) => {
    console.log("%s", data);
});

CheckButton = () => {
    let data = gpio.digitalRead(BUTTON);
    if(!data) {
        console.log("Nodejs: Button was pressed!!");
        if(onoff == 1) {
            comport.write("11$");
            onoff = 0;
        } else {
            comport.write("12$");
            onoff = 1;
        }
    }
    setTimeout(CheckButton, 300);
}

gpio.wiringPiSetup();
gpio.pinMode(BUTTON, gpio.INPUT);
setImmediate(CheckButton);