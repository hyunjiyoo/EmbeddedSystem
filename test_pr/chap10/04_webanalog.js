/*
   조건1) 아날로그 사운드센서는 0번 채널에, 아날로그 광센서는 1번채널에 연결한다.
   조건2) SMD 3색 LED는 브레드보드를 이용해서 라즈베리파이와 연결한다.
   조건3) 광센서에서 아날로그 값(0~4095)에 따라서 LED의 밝기(0~100)를 PWM방식으로 제어한다.
         다시말하면, 밝기정도를 10개 구간으로 나누고 밝은 정도에 따라서 LED의 밝기를 제어한다.
   조건4) 광센서 아날로그 값을 등급화 할 때, 강의실의 밝기환경을 고려하여 적절하게 구분한다.
   조건5) 웹UI에서 사운드센서 ON/OFF..광센서 ON/OFF를 각각 제어할 수 있어야 한다.
   조건6) ^c를 누르면 LED, 광센서, 사운드센서를 모두 OFF 시킨 후 프로그램을 종료한다.
 */

const gpio = require('node-wiring-pi'), fs = require('fs'), mcpadc = require('mcp-adc');
const express = require('express'), bodyParser = require('body-parser');
const app = express();
const soundsensor = new mcpadc.Mcp3208();
const lightsensor = new mcpadc.Mcp3208();
const S_CHANNEL = 0, L_CHANNEL = 1;
const SPI_SPEED = 1000000, CE = 10;
const LED3= 29;

var sid, lid;
var QuietSound, BrightLight;

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    fs.readFile('views/04_webanalog.js', 'utf8', (error, data) => {
       if(error)
           res.send(error);
       else
           res.send(data);
    });
});
app.post('/', (req, res) => {
    let body = req.body;
    QuietSound = body.s_value;
    res.redirect('/');
});

// sound sensor control
const SoundDetect = function() {
    soundsensor.readRawValue(S_CHANNEL, function (value) {
        if (value > QuietSound) {
            console.log('소리큼');
        } else {
            console.log('인식못함');
        }
    });
    sid = setTimeout(SoundDetect, 1000);
}
app.get('/sound/1', (req, res) => {
    sid = setTimeout(SoundDetect, 100);
    res.redirect('/');
});
app.get('/sound/0', (req, res) => {
    clearTimeout(sid);
    res.redirect('/');
});

// light sensor control
const LightDetect = function() {
    lightsensor.readRawValue(L_CHANNEL, function (value) {
        // BrightLight를 0~100값으로 변경
        BrightLight = value / 40.95;
        gpio.softPwmCreate(LED3, 0, 100);

        for(i = 0; i < 10; i++) {
            // 밝기정도를 10개 구간으로 나눈다.
            let light_value = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

            if(BrightLight < light_value[i])
                BrightLight = light_value[i];

            gpio.softPwmWrite(LED3, BrightLight);
        }
    });
    lid = setTimeout(LightDetect, 1000);
}
app.get('/light/1', (req, res) => {
    lid = setTimeout(LightDetect, 100);
    res.redirect('/');
});
app.get('/light/0', (req, res) => {
    gpio.digitalWrite(LED3, 0);
    clearTimeout(lid);
    res.redirect('/');
});

process.on('SIGINT', function () {
    gpio.digitalWrite(LED3, 0);
    clearTimeout(sid);
    clearTimeout(lid);
    process.exit();
});

app.listen(60001, () => {
    gpio.wiringPiSetup();
    gpio.wiringPiSPISetup(S_CHANNEL, SPI_SPEED);
    gpio.wiringPiSPISetup(L_CHANNEL, SPI_SPEED);
    gpio.pinMode(CE, gpio.OUTPUT);
    gpio.pinMode(LED3, gpio.OUTPUT);
    console.log('Server Running at http://127.0.0.1:60001...');
});