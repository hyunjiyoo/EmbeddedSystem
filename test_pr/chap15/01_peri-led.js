/* Peripheral */
const gpio = require('node-wiring-pi');
const bleno = require('bleno');
const util = require('util');
const LED = 25;
var ledstate = 0;
var nodename = '12team-led';

var PrimaryService = bleno.PrimaryService;
var Characteristic = bleno.Characteristic;

var SwitchCharacteristic = () => {
    SwitchCharacteristic.super_.call(this, {
        uuid: 'ff11',
        properties: ['read', 'write'],
        descriptors: [
            new bleno.Descriptor({
                uuid: '2901',
                value: 'Switch'
            })
        ]
    });
};

// Characteristic을 SwitchCharacteristic으로 ovverriding.
util.inherits(SwitchCharacteristic, Characteristic);

// central 기기에서 reqd request를 하면 peripheral에서 이 함수가 실행됨. (data 전송)
SwitchCharacteristic.prototype.onReadRequest = (offset, callback) => {
    var data = new Buffer(1);
    console.log('read request');
    data[0] = ledstate;
    callback(this.RESULT_SUCCESS, data); // central 기기로 data 전송.(즉, ledstate값 전송)
};

// central 기기에서 write request를 하면 peripheral에서 이 함수가 실행됨. (data 받음)
// data에는 hex로 보낸 0x01과 0x00이 있음.
SwitchCharacteristic.prototype.onWriteRequest = (data, offset, withoutResponse, callback) => {
    // data가 1이면 LED ON
    if(data[0]) {
        console.log('블루투스 > 데이터수신: ' + data.toString('hex') + ' (LED ON)');
        gpio.digitalWrite(LED, 1);
        ledstate = 1;
    }
    // data가 0이면 LED OFF
    else {
        ledstate = 0;
        console.log('블루투스 > 데이터수신: ' + data.toString('hex') + ' (LED OFF)');
        gpio.digitalWrite(LED, 0);
    }
    // central 기기로 응답(성공)을 전송
    callback(this.RESULT_SUCCESS);
};

var lightService = new PrimaryService({
    uuid: 'ff10',
    characteristics: [
        new SwitchCharacteristic()
    ]
});

// 1. Bluetooth ON
bleno.on('stateChange', (state) => {
    if(state === 'poweredOn') {
        // Start advertising. (자신의 정보 보냄)
        bleno.startAdvertising(nodename, [lightService.uuid]);
        console.log('-----------------------------------');
        console.log('블루투스 > ON (' + nodename + ' 가동)');
    } else {
        bleno.stopAdvertising();
        console.log('블루투스 > Advertising을 중단합니다.');
    }
});

// 2. Start Advertising
bleno.on('advertisingStart', (error) => {
    if(!error) {
        console.log('블루투스 > Advertising을 시작합니다..');
        console.log('---------------------------------');
        // 2. Service Setting.
        bleno.setServices([lightService]);
    }
    else
        console.log('블루투스 > Advertising 도중 오류발생');
});

function exit() {
    console.log('블루투스 > 프로그램을 종료합니다');
    process.exit();
}

process.on('SIGINT', exit);
gpio.wiringPiSetup();
gpio.pinMode(LED, gpio.OUTPUT);