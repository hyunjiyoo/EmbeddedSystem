const request = require('request');

var peer2data = {
    name: 3,
};

request.put(
    {url: 'http://127.0.0.1:60001/member',
     form: peer2data,
     headers: {'content-type' : 'application/x-www-form-urlencoded'}},
    (err, res, body) => {
        if(!err && res.statusCode == 200) {
            console.log(body);
        }
    }
);