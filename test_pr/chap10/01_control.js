// const gpio = require('node-wiring-pi');
const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const app = express();

// const BLUELED = 29;
// const BUZZER = 24;
// const LIGHT = 28;

var timerid, index, value = [];
var led1state = '#b0b0b0';
var buzzerstate = '#b0b0b0';
var lightstate = '#b0b0b0';

app.get('/', (req, res) => {
    fs.readFile('views/01_contpage.ejs', 'utf8', (error, data) => {
        if(error)
            res.send(500);
        else
            res.send(ejs.render(data, {
                led1color: led1state,
                buzzercolor: buzzerstate,
                lightcolor: lightstate
            }));
    });
});

app.get('/led1/1', (req, res) => {
    console.log("LED ON");
    // gpio.digitalWrite(BLUELED, 1);
    led1state: '#0000ff';
    res.redirect('/');
});

app.get('/led1/0', (req, res) => {
    console.log("LED OFF");
    // gpio.digitalWrite(BLUELED, 0);
    led1state: '#b0b0b0';
    res.redirect('/');
});

app.get('/buzzer/1', (req, res) => {
    console.log("BUZZER ON");
    // gpio.digitalWrite(BUZZER, 1);
    buzzerstate: '#0000ff';
    res.redirect('/');
});

app.get('/buzzer/0', (req, res) => {
    console.log("BUZZER OFF");
    // gpio.digitalWrite(BUZZER, 0);
    buzzerstate: '#b0b0b0';
    res.redirect('/');
});

const lightctl = function() {
    if(index < 500) {
        // value[index++] = gpio.digitalRead(LIGHT);
        console.log('%d', value[index-1]);
    } else {
        index = 0;
    }
    timerid = setTimeout(lightctl, 1000);
}

app.get('/light/1', (req, res) => {
    console.log("LIGHT ON");
    lightstate: '#0000ff';
    timerid = setTimeout(lightctl, 100);
    res.redirect('/');
});

app.get('/light/2', (req, res) => {
    fs.readFile('views/01_lightdata.ejs', 'utf8', (error, data) => {
        res.send(ejs.render(data, {
            lightdata: value
        }));
    });
});

app.get('/light/0', (req, res) => {
    console.log('LIGHT OFF');
    lightstate: '#b0b0b0';
    clearTimeout(timerid);
    res.redirect('/');
});

app.listen(60001, () => {
    // gpio.wiringPiSetup();
    // gpio.pinMode(BLUELED, gpio.OUTPUT);
    // gpio.pinMode(BUZZER, gpio.OUTPUT);
    // gpio.pinMode(LIGHT, gpio.INPUT);
    console.log("웹서버 실행중.. http://127.0.0.1:60001...");
});
