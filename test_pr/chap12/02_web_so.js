const http = require('http');
const gpio = require('node-wiring-pi');
const fs = require('fs');
const socketio = require('socket.io');
const LED = 29, TRIG = 26, ECHO = 27;

var startTime, travelTime;
var index = 0, value = [];
var timerid, timeout = 800;
var cnt = 1;

const server = http.createServer((req, res) => {
    fs. readFile('views/02_web_so.html', 'utf8', (error, data) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
}).listen(65001, () => {
    gpio.wiringPiSetup();
    gpio.pinMode(LED, gpio.OUTPUT);
    gpio.pinMode(ECHO, gpio.INPUT);
    gpio.pinMode(TRIG, gpio.OUTPUT);
    gpio.digitalWrite(LED, 0); // LED 초기화
    console.log('Server Running at...');
});

// 웹서버가 listen하는 포트를 socket도 이용.
const io = socketio.listen(server);
io.sockets.on('connection', (socket) => {
    socket.on('startmsg', (data) => {
        console.log('가동메세지 수신(측정주시: %d)!', data);
        timeout = data;
        watchon();
    });

    socket.on('stopmsg', (data) => {
        console.log('중지메세지 수신!');
        clearTimeout(timerid);
    })
});

const watchon = () => {
    gpio.digitalWrite(TRIG, 0);
    gpio.delayMicroseconds(2);
    gpio.digitalWrite(TRIG, 1);
    gpio.delayMicroseconds(20);
    gpio.digitalWrite(TRIG, 0);

    while (gpio.digitalRead(ECHO) === 0) ;
    startTime = gpio.micros();
    while(gpio.digitalRead(ECHO) === 1) ;
    travelTime = gpio.micros() - startTime;

    distance = travelTime / 58;
    if(distance < 400) {
        if (index < 500) {
            value[index++] = distance;
            console.log('근접거리: %d cm', value[index - 1]);
            io.sockets.emit('watch', value[index - 1]);
        }
        else
            index = 0;

        // LED점멸 - 초음파센서 작동알림.
        if ((index % 2) == 0)
            gpio.digitalWrite(LED, 1);
        else
            gpio.digitalWrite(LED, 0);
    }
    timerid = setTimeout(watchon, timeout);
}