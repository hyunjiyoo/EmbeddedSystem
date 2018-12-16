const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var value = 0;

var mydata = {
    name: value,
};

app.use(bodyParser.urlencoded({extended: false}));

app.put('/member', (req, res) => {
    if(req.body.name == 1) {
        console.log('PUT method로 데이터 수신...');
        console.log('이름: ' + req.body.name);
    }
    else {
        req.body.name = 2;
        console.log('이름: ' + req.body.name);
    }
    res.send('서버에서 확실히 받았다고 함');
});

app.listen(60001, () => {
    console.log('Peer1: 서버(60001) 가동중...');
});