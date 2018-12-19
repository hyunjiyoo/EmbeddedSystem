/* Central */
const noble = require('noble');

// 1. Bluetooth ON
noble.on('stateChange', (state) => {
    if(state === 'poweredOn') {
        // 2. Peripheral에서 Advertising 시작하면, Scanning 시작.
        noble.startScanning(['ff10']);
    } else {
        noble.stopScanning();
    }
});

// 3. Scanning 해서 기기찾음 (Discovery)
// peripheral에서 Advertising 통해 보낸 정보는 peripheral 변수에 있음.
noble.on('discover', (peripheral) => {
    if(peripheral.advertisement.localName === '2team-led') {
        console.log('블루투스 찾았음(discovery)----------------------');
        console.log('블루투스 > 이름: ' + peripheral.advertisement.localName);
        console.log('블루투스 > 주소: ' + peripheral.address);
        console.log('블루투스 > 신호세기(RSSI): ' + peripheral.rssi);
        console.log('---------------------------------------------');
        connectAndSetUp(peripheral);
    }
});

// 4. Discovery 했으니 연결요청.(connect request)
function connectAndSetUp(peripheral) {
    peripheral.connect((error) => {
        let serviceUUIDs = ['ff10'];
        let characteristicUUIDs = ['ff11'];
        peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, onServicesAndCharacteristicsDiscovered);
    });
}

function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {
    if(error) {
        console.loe('Error discovering services and characteristics' + error);
        return;
    }

    // switchCharacteristic 정보를 변수에 저장.
    var switchCharacteristic = characteristics[0];

    // 5. Data 전송
    function sendData(byte) {
        let buffer = new Buffer(1);
        buffer[0] = byte;

        console.log('블루투스 > 데이터전송(write): ' + byte);
        // write(data보냄)
        switchCharacteristic.write(buffer, false, (error) => {
            if(error) {
                console.log(error);
            }
            // 만약 peripheral로부터 받은 profile내용을 보려면
            // console.log(services);
            // console.log(characteristics);
        });
    }

    function remote_led_on() {
        // data를 16진수(hex)로 보냄.
        sendData(0x01);
        setTimeout(remote_led_off, 2000);
    }
    function remote_led_off() {
        sendData(0x00);
        setTimeout(remote_led_on, 2000);
    }
    setImmediate(remote_led_on);
}