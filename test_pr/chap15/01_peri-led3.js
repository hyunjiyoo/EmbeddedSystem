const gpio = require('node-wiring-pi'), LED = 25;
const bleno = require('bleno'), util = require('util');
var ledstate = 0, nodename = '12team-led';

var Primary = bleno.PrimaryService;
var Character = bleno.Characteristic;

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
}

util.inherits(SwitchCharacteristic, Character);

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

var lightServ = new Primary({
    uuid: 'ff10',
    characteristics: [
        new SwitchCharacteristic()
    ]
});

bleno.on('stateChange', (state) => {
    if(state === 'poweredOn') {
        bleno.startAdvertising(nodename, [lightServ.uuid]);
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', (err) => {
    if(!err)
        bleno.setServices([lightService]);
});

process.on('SIGINT', () => {
    process.exit();
});

gpio.wirintPiSetup();
gpio.pinMode(LED, gpio.OUTPUT);