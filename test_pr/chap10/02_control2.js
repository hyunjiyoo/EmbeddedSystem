const gpio = require('node-wiring-pi');
const fs = require('fs');
const express = require('express');
const ejs = require('ejs');
const app = express();

const LED1 = 29;
const LED_R = 25, LED_G = 23, LED_B = 22;
const BUZZER = 24, SOUND = 27, LIGHT = 28;

var led1state = '#b0b0b0';
var buzzerstate = '#b0b0b0';
var lightstate = '#b0b0b0';
var soundstate = '#b0b0b0';
var ledRstate = '#b0b0b0';
var ledGstate = '#b0b0b0';
var ledBstate = '#b0b0b0';

var light_timerid, sound_timerid;
var l_value = [], l_index;
var s_value = [], s_index;

// main page
app.get('/', (req, res) => {
    fs.readFile('views/02_contpage.ejs', 'utf8', (error, data) => {
        if(error)
            res.send(error);
        else {
            res.send(ejs.render(data, {
                led1color: led1state,
                buzzercolor: buzzerstate,
                lightcolor: lightstate,
                soundcolor: soundstate,
                ledRcolor: ledRstate,
                ledGcolor: ledGstate,
                ledBcolor: ledBstate
            }));
        }
    });
});

// 1-color led control
app.get('/led1/1', (req, res) => {
    console.log('LED1 ON');
    gpio.digitalWrite(LED1, 1);
    led1state: '#0000ff';
    res.redirect('/');
});
app.get('/led1/0', (req, res) => {
    console.log('LED1 OFF');
    gpio.digitalWrite(LED1, 0);
    led1state: '#b0b0b0';
    res.redirect('/');
});

// buzzer control
app.get('/buzzer/1', (req, res) => {
    console.log('BUZZER ON');
    gpio.digitalWrite(BUZZER, 1);
    buzzerstate: '#0000ff';
    res.redirect('/');
});
app.get('/buzzer/0', (req, res) => {
    console.log('BUZZER OFF');
    gpio.digitalWrite(BUZZER, 0);
    buzzerstate: '#b0b0b0';
    res.redirect('/');
});

// 3-color led control
app.get('/led3/r/1', (req, res) => {
    console.log('LED3 RED ON');
    gpio.digitalWrite(LED_R, 1);
    ledRstate: '#ff0000';
    res.redirect('/');
});
app.get('/led3/r/0', (req, res) => {
    console.log('LED3 RED OFF');
    gpio.digitalWrite(LED_R, 0);
    ledRstate: '#b0b0b0';
    res.redirect('/');
});

app.get('/led3/g/1', (req, res) => {
    console.log('LED3 GREEN ON');
    gpio.digitalWrite(LED_G, 1);
    ledGstate: '#00ff00';
    res.redirect('/');
});
app.get('/led3/g/0',(req, res) => {
    console.log('LED3 GREEN OFF');
    ledGstate: '#b0b0b0';
    res.redirect('/');
});

app.get('/led3/b/1', (req, res) => {
    console.log('LED3 BLUE ON');
    gpio.digitalWrite(LED_B, 1);
    ledBstate: '#0000ff';
    res.redirect('/');
});
app.get('/led3/b/0', (req, res) => {
    console.log('LED3 BLUE OFF');
    gpio.digitalWrite(LED_B, 0);
    ledBstate: '#b0b0b0';
    res.redirect('/');
});

// light control
const lightctl = function() {
    if (l_index < 500) {
        l_value[l_index++] = gpio.digitalRead(LIGHT);
    } else {
        l_index = 0;
    }
    light_timerid = setTimeout(lightctl, 1000);
}

app.get('/light/1', (req, res) => {
    console.log('LIGHT ON');
    lightstate = '#0000ff';
    light_timerid = setTimeout(lightctl, 100);
    res.redirect('/');
});
app.get('/light/0', (req, res) => {
    console.log('LIGHT OFF');
    lightstate = '#b0b0b0';
    clearTimeout(light_timerid);
    res.redirect('/');
});
app.get('/light/2', (req, res) => {
    console.log('광센서 측정값 보기');
    fs.readFile('views/02_lightdata.ejs', 'utf8', (error, data) => {
       res.send(ejs.render(data, {
           lightdata: value
       }));
    });
});

// sound control
const soundctl = function() {
    if(s_index < 500) {
        s_value[s_index++] = gpio.digitalRead(SOUND);
    } else {
        s_index = 0;
    }
    sound_timerid = setTimeout(soundctl, 1000);
}
app.get('/sound/1', (req, res) => {
   console.log('SOUND ON');
   soundstate: '#0000ff';
   sound_timerid = setTimeout(soundctl, 100);
   res.redirect('/');
});
app.get('/sound/0', (req, res) => {
   console.log('SOUND OFF');
   soundstate: '#b0b0b0';
   clearTimeout(sound_timerid);
   res.redirect('/');
});
app.get('/sound/2', (req, res) => {
    console.log('사운드 측정값 보기');
    fs.readFile('views/02_sounddata.ejs', 'utf8', (error, data) => {
       res.send(ejs.render(data, {
           sounddata: value
       }));
    });
});


app.listen(60001, () => {
    gpio.wirintPiSetup();
    gpio.pinMode(LED1, gpio.OUTPUT);
    gpio.pinMode(LED_R, gpio.OUTPUT);
    gpio.pinMode(LED_G, gpio.OUTPUT);
    gpio.pinMode(LED_B, gpio.OUTPUT);
    gpio.pinMode(BUZZER, gpio.OUTPUT);
    gpio.pinMode(SOUND, gpio.INPUT);
    gpio.pinMode(LIGHT, gpio.INPUT);
    console.log("Server Running at ...");
});
