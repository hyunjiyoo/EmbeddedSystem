const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var mydata = {
    name: 'hjyoo',
    age: 100,
    addr: 'suji',
    tel: '010-222-3333'
};

app.use(bodyParser.urlencoded({extended: false}));

app.delete('/member', (req, res) => {
    console.log('DELETE method로 데이터 수신...');
    console.log('이름: ' + req.body.name + ' 인 자료를 삭제합니다');

    res.send('서버에서 확실히 받았다고 함');
});


app.listen(60001, () => {
    console.log('Peer1: 서버(60001) 가동중...');
    console.log(mydata);
});