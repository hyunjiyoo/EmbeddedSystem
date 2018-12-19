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

util.inherits(SwitchCharacteristic, Characteristic);

SwitchCharacteristic.prototype.onReadRequest = (offset, callback) => {
    var data = new Buffer(1);
    data[0] = ledstate;
    callback(this.RESULT_SUCCESS, data);
};

SwitchCharacteristic.prototype.onWriteRequest = (data, offset, withoutResponse, callback) => {
    if(data[0]) {
        gpio.digitalWrite(LED, 1);
        ledstate = 1;
    }
    else {
        gpio.digitalWrite(LED, 1);
        ledstate = 0;
    }
};

var lightService = new PrimaryService({
    uuid: 'ff10',
    characteristics: [
        new SwitchCharacteristic()
    ]
});

bleno.on('stateChange', (state) => {
    if(state === 'poweredOn') {
        bleno.startAdvertising(nodename, [lightService.uuid]);
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', (error) => {
    if(!error)
        bleno.setServices([lightService]);
});

process.on('SIGING', () => {
    process.exit();
});

gpio.wirintPiSetup();
gpio.pinMode(LED, gpio.OUTPUT);