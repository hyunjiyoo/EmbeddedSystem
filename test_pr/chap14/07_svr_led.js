const gpio = require('node-wiring-pi');
const express = require('express');
const bodyParser = require('body-parser');
const LED_R = 25, LED_G = 26, LED_B = 27;
const app = express();

var encoderValue = {
    actid: 'LED3',
    value: 0
};

const ledControl = (req, res) => {
    if(req.body.actid == 'LED3') {
        if(req.body.value <= 0) {
            gpio.digitalWrite(LED_R, 0);
            gpio.digitalWrite(LED_G, 0);
            gpio.digitalWrite(LED_B, 0);
        }
        else if(req.body.value === 1) {
            gpio.digitalWrite(LED_R, 1);
            gpio.digitalWrite(LED_G, 0);
            gpio.digitalWrite(LED_B, 0);
        }
        else if(req.body.value === 2) {
            gpio.digitalWrite(LED_R, 0);
            gpio.digitalWrite(LED_G, 1);
            gpio.digitalWrite(LED_B, 0);
        }
        else if(req.body.value === 3) {
            gpio.digitalWrite(LED_R, 0);
            gpio.digitalWrite(LED_G, 0);
            gpio.digitalWrite(LED_B, 1);
        }
        else {
            gpio.digitalWrite(LED_R, 1);
            gpio.digitalWrite(LED_G, 1);
            gpio.digitalWrite(LED_B, 1);
        }
        res.send("OK");
    }
    else
        res.send("FAIL");
}

app.use(bodyParser.urlencoded({extended:false}));
app.put('/led', ledControl);
app.get('/led', (req,res) => {
    res.send('OK');
});

app.listen(60001, () => {
    console.log('Server is Running...');
    gpio.wiringPiSetup();
    gpio.pinMode(LED_R, gpio.OUTPUT);
    gpio.pinMode(LED_G, gpio.OUTPUT);
    gpio.pinMode(LED_B, gpio.OUTPUT);
});