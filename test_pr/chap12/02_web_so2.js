const gpio = require('node-wiring-pi'), fs = require('fs');
const http = require('http'), socketio = require('socket.io');
const LED = 29, TRIG = 26, ECHO = 27;

var startTime, travelTime, timerid, timeout = 800;
var index, value = [];

const server = http.createServer((req, res) => {
    fs.readFile('views/02_web_so2.html', 'utf8', (error, data) => {
       res.writeHead(200, {'Content-Type': 'text/html'});
       res.end(data);
    });
}).listen(65001, () => {
    gpio.wiringPiSetup();
    gpio.pinMode(LED, gpio.OUTPUT);
    gpio.pinMode(TRIG, gpio.OUTPUT);
    gpio.pinMode(ECHO, gpio.INPUT);
    gpio.digitalWrite(LED, 0);
});

const io = socketio.listen(server);
io.sockets.on('connection', (socket) => {
    socket.on('start', (data) => {
        timeout = data;
        watchon();
    });

    socket.on('stop', () => {
        clearTimeout(timerid);
    });
});

const watchon = () => {
    gpio.digitalWrite(TRIG, 0);
    gpio.delayMicroseconds(2);
    gpio.digitalWrite(TRIG, 1);
    gpio.delayMicroseconds(20);
    gpio.digitalWrite(TRIG, 0);
    while(gpio.digitalRead(ECHO) === 0) ;
    startTime = gpio.micros();
    while(gpio.digitalRead(ECHO) === 1) ;
    travelTime = gpio.micors() - startTime;
    distance = travelTime / 58;

    if(distance < 400) {
        if(index < 500) {
            value[index++] = distance;
            io.sockets.emit('watch', value[index-1]);
        }
        else
            index = 0;

        if((index % 2) === 0)
            gpio.digitalWrite(LED, 1);
        else
            gpio.digitalWrite(LED, 0);
    }
    timerid = setTimeout(watchon, timeout);
}