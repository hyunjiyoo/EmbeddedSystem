const humitemp = require('node-dht-sensor');
const htsensor = {
    sensors: [ { name: "                Indoor(Blue)",
                 type: 11, pin: 12 },
               { name: "Outdoor(White)",
                 type: 22, pin: 16 }
             ],

    read: function () {
        for(let index in this.sensors) {
            let result;
            result = humitemp.read(this.sensors[index].type, this.sensors[index].pin);
            console.log(this.sendors[index].name + ": "
                        + result.temperature.toFixed(1) + "C, "
                        + result.humidity.toFixed(1) + "%");
        }
        setTimeout(() => {htsensor.read();}, 2500);
    }
};
htsensor.read();