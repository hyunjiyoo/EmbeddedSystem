const express = require('express'), fs = require('fs');
const gpio = require('node-wiring-pi'), mcpadc = require('mcp-adc');
const app = express();
const soundsensor = new mcpadc.Mcp3208();
const bodyParser = require('body-parser');

const CS_MCP3208 = 10
const SPI_CHANNEL = 0
const SPI_SPEED = 1000000
var QuietSound = 1997;
var sid;

app.use(bodyParser.urlencoded({ extended: false })); // body parser 환경설정

const SoundDetect = function () {
    soundsensor.readRawValue(SPI_CHANNEL, function (value) {
        if(value > QuietSound) {
            console.log("기준값:(%d), 아날로그 측정값(%d)", QuietSound, value);
        } else {
            console.log("인식안함");
        }
    });
    sid = setTimeout(SoundDetect, 200);
}

process.on('SIGINT', function () {
    console.log('Program Exit...');
    process.exit();
});

app.get('/', (req, res) => {
    console.log('sensor 호출');
    fs.readFile('views/03_sen.html', 'utf8', (error, data) => {
        if (error)
            res.send(error);
        else
            res.send(data);
    });
});

app.post('/', (req, res) => {
    let body = req.body;

    console.log('다음값으로 설정됩니다: ');
    console.log(' ==> : ' + body.threshold);
    QuietSound = body.threshold;
    res.redirect('/'); // redirect는 get method로 전송.
});

app.get('/1', (req, res) => {
    console.log('sound sensor ON 호출');
    sid = setTimeout(SoundDetect, 200);
    res.redirect('/');
});

app.get('/0', (req, res) => {
    console.log('sound sensor OFF 호출');
    clearTimeout(sid);
    res.redirect('/');
});

app.listen(60001, () => {
    gpio.wiringPiSetup();
    gpio.wiringPiSPISetup(SPI_CHANNEL, SPI_SPEED);
    gpio.pinMode(CS_MCP3208, gpio.OUTPUT);
    console.log('http://127.0.0.1:60001/');
});

