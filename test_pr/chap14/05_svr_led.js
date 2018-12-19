const express = require('express');
const gpio = require('node-wiring-pi');
const bodyParser = require('body-parser');
const app = express();

const GREEN = 21, RED = 22, BLUE = 23;

var mydata = {
    actid: 'LED3',
    redcolor: 'OFF',
    greencolor: 'OFF',
    bluecolor: 'OFF'
};

const led3control = (req, res) => {
    console.log('PUT method로 데이터 수신..');
    if(req.body.actid == 'LED3'){
        if(req.body.redcolor == 'ON') {
            gpio.digitalWrite(RED, 1);
            gpio.digitalWrite(BLUE, 0);
            gpio.digitalWrite(GREEN, 0);
            console.log('red LED ON');
        }
        if(req.body.greencolor == 'ON') {
            gpio.digitalWrite(RED, 0);
            gpio.digitalWrite(BLUE, 0);
            gpio.digitalWrite(GREEN, 1);
            console.log('green LED ON');
        }
        if(req.body.bluecolor == 'ON') {
            gpio.digitalWrite(RED, 0);
            gpio.digitalWrite(BLUE, 1);
            gpio.digitalWrite(GREEN, 0);
            console.log('blue LED ON');
        }
        res.send('OK');
    }
    else
        res.send('FAIL');
}

app.use(bodyParser.urlencoded({extended:false}));

app.put('/led', led3control);
app.get('/led', (req, res) => {
    console.log('Get method');
    res.send('OK');
});

app.listen(60001, () => {
    console.log('SVR_LED.js: server(60001) Running...');
    gpio.wiringPiSetup();
    gpio.pinMode(BLUE, gpio.OUTPUT);
    gpio.pinMode(RED, gpio.OUTPUT);
    gpio.pinMode(GREEN, gpio.OUTPUT);
});