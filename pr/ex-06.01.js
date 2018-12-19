/* 실습일지(11/15) ex06-01
   조건1) 아날로그 사운드센서는 0번 채널에, 아날로그 광센서는 1번채널에 연결한다.
   조건2) SMD 3색 LED는 브레드보드를 이용해서 라즈베리파이와 연결한다.
   조건3) 광센서에서 아날로그 값(0~4095)에 따라서 LED의 밝기(0~100)를 PWM방식으로 제어한다.
         다시말하면, 밝기정도를 10개 구간으로 나누고 밝은 정도에 따라서 LED의 밝기를 제어한다.
   조건4) 광센서 아날로그 값을 등급화 할 때, 강의실의 밝기환경을 고려하여 적절하게 구분한다.
   조건5) 웹UI에서 사운드센서 ON/OFF..광센서 ON/OFF를 각각 제어할 수 있어야 한다.
   조건6) ^c를 누르면 LED, 광센서, 사운드센서를 모두 OFF 시킨 후 프로그램을 종료한다.
 */

const express = require('express');
const fs = require('fs');
const gpio = require('node-wiring-pi');
const bodyParser = require('body-parser');
const mcpadc = require('mcp-adc');
const app = express();
const soundsensor = new mcpadc.Mcp3208();
const lightsensor = new mcpadc.Mcp3208();

const CS_MCP3208 = 10
const SPI_CHANNEL_ZERO = 0
const SPI_CHANNEL_ONE = 1
const SPI_SPEED = 1000000

const LED_R = 27;
const LED_G = 28;
const LED_B = 29;
var sound_value = 1997;
var sid;
var lid;

app.use(bodyParser.urlencoded( { extended: false }));

const SoundDetect = function() {
    soundsensor.readRawValue(SPI_CHANNEL_ZERO, function (value) {
        if(value > sound_value)
            console.log("사운드센서 기준값: (%d), 아날로그 측정값 (%d)", sound_value, value);
        else
            console.log("사운드센서 인식안함");
    });
    sid = setTimeout(SoundDetect, 200);
}

const LightDetect = function() {
    lightsensor.readRawValue(SPI_CHANNEL_ONE, function (value) {
        let convert_value = value / 40.95;

        gpio.softPwmCreate(LED_R, 0, 100);
        gpio.softPwmCreate(LED_G, 0, 100);
        gpio.softPwmCreate(LED_B, 0, 100);
        gpio.softPwmWrite(LED_R, convert_value);
        gpio.softPwmWrite(LED_G, convert_value);
        gpio.softPwmWrite(LED_B, convert_value);
        console.log("아날로그 광센서 값: (%d), LED3 밝기값: (%d)", value, convert_value);

        if(convert_value > 50)
            console.log("LED 밝아짐");
        else
            console.log("LED 어두워짐")
    });
    lid = setTimeout(LightDetect, 200);
}

process.on('SIGINT', function () {
    gpio.digitalWrite(LED_R, 0);
    gpio.digitalWrite(LED_G, 0);
    gpio.digitalWrite(LED_B, 0);
    clearTimeout(sid);
    clearTimeout(lid);
    console.log("Program Exit...");
    process.exit();
});

app.get('/', (req, res) => {
    fs.readFile('sen.html', 'utf8', (error, data) => {
        if(!error)
            res.send(data);
    });
});

app.post('/', (req, res) => {
    let body = req.body;
    sound_value = body.threshold_sound;
    res.redirect('/');
});

app.get('/1', (req, res) => {
    console.log("sound sensor ON 호출");
    sid = setTimeout(SoundDetect, 200);
    res.redirect('/');
});

app.get('/0', (req, res) => {
    console.log("sound sensor OFF 호출");
    clearTimeout(sid);
    res.redirect('/');
});

app.get('/11', (req, res) => {
    console.log("light sensor ON 호출");
    lid = setTimeout(LightDetect, 200);
    res.redirect('/');
});

app.get('/10', (req, res) => {
    console.log("light sensor OFF 호출");
    gpio.digitalWrite(LED_R, 0);
    gpio.digitalWrite(LED_G, 0);
    gpio.digitalWrite(LED_B, 0);
    clearTimeout(lid);
    res.redirect('/');
});

app.listen(60001, () => {
    gpio.wiringPiSetup();
    gpio.wiringPiSPISetup(SPI_CHANNEL_ZERO, SPI_SPEED);
    gpio.wiringPiSPISetup(SPI_CHANNEL_ONE, SPI_SPEED);
    gpio.pinMode(CS_MCP3208, gpio.OUTPUT);
    gpio.pinMode(LED_R, gpio.OUTPUT);
    gpio.pinMode(LED_G, gpio.OUTPUT);
    gpio.pinMode(LED_B, gpio.OUTPUT);
    console.log("아날로그 사운드센서, 광센서 제어용 웹서버...");
    console.log("http://192.9.82.80:60001/");
});