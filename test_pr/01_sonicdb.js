const gpio = require('node-wiring-pi');
const mysql = require('mysql');
const TRIG = 9, ECHO = 8;

var startTime, travelTime;

const client = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '111111',
    database: 'sensordb'
});

const Triggering = () => {
    gpio.digitalWrite(TRIG, 0);
    gpio.delayMicroseconds(2);
    gpio.digitalWrite(TRIG, 1);
    gpio.delayMicroseconds(20);
    gpio.digitalWrite(TRIG, 0);
    while(gpio.digitalRead(ECHO) === 0) ;
    startTime = gpio.micros();
    while(gpio.digitalRead(ECHO) === 1) ;
    travelTime = gpio.micros() - startTime;
    distance = travelTime / 58;

    if (distance < 400) {
        if (distance < 20) {
            let stamptime = new Date(); // 현재 측정시간
            client.query('INSERT INTO sonic VALUES (?,?)', [stamptime, distance], (err, result) => {
                if(err)
                    console.log(err);
                else
                    console.log('success');
            });
        }
    }
    setTimeout(Triggering, 700);
}

const Retrieve = () => {
    let stamp_distance;
    client.query('SELECT * FROM `sonic`', (error, results, fields) => {
        console.log('---------------------------------');
        results.forEach((element, i) => {
            stamp_distance = '';
            stamp_distance += element.stamp.toLocaleString() + '.';
            stamp_distance += element.stamp.getMilliseconds() + ' ';
            stamp_distance += element.distance;
            console.log(stamp_distance);
        });
        console.log('---------------------------------');
        setTimeout(Retrieve, 5000);
    });
}

gpio.wiringPiSetup();
gpio.pinMode(TRIG, gpio.OUTPUT);
gpio.pinMode(ECHO, gpio.INPUT);
setImmediate(Triggering);
setImmediate(Retrieve);