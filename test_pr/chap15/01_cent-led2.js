const noble = require('noble');

noble.on('stateChange', (state) => {
    if(state === 'poweredOn') {
        noble.startScanning(['ff10']);
    } else {
        noble.stopScanning();
    }
});

noble.on('discover', (peripheral) => {
    if(peripheral.advertisement.localName === '2team-led')
        peripheral.connect((error) => {
            if(!error) {
                let serviceUUIDs = ['ff10'];
                let characteristicUUIDs = ['ff11'];
                peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, onSwitchService);
            }
        });
});

function onSwitchService(error, services, characteristics) {
    if(!error) {
        var switchCharacteristic = characteristics[0];

        function sendData(byte) {
            let buffer = new Buffer(1);
            buffer[0] = byte;
            switchCharacteristic.write(buffer, false, () =>{ });
        }

        function led_on() {
            sendData(0x01);
            setTimeout(led_off, 2000);
        }
        function led_off() {
            sendData(0x00);
            setTimeout(led_on, 2000);
        }

        setImmediate(led_on);
    }
}