const req = require('request');

var data = {
    actid: 'LED3',
    redcolor: 'ON',
    greencolor: 'OFF',
    bluecolor: 'OFF'
};

req.put(
    {url:'http://127.0.0.1:60001/led',
     form: data,
     headers: {'content-type' : 'application/x-www-form-urlencoded'}},
    (err, res, body) => {
        if(!err && res.statusCode == 200) {
            console.log(body);
        }
    }
);