const noble = require('noble');

noble.on('stateChange', (state) => {
    if(state === 'poweredOn') {
        noble.startScanning(['ff10']);
    } else {
        noble.stopScanning();
    }
});

noble.on('discover', (peri) => {
    if(peri.advertisement.localName === '2team-led')
        peri.connect((err) => {
            if(!err) {
                let servUUIDs = ['ff10'];
                let charUUIDs = ['ff11'];
                peri.discoverSomeServicesAndCharacteristics(servUUIDs, charUUIDs, onSwitch);
            }
        });
});

function onSwitch(error, services, characteristics) {
    if(!error) {
        var switchChar = characteristics[0];

        function sendData(byte) {
            let buffer = new Buffer(1);
            buffer[0] = byte;
            switchChar.write(buffer, false, () =>{ });
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