/* Client */
const curl = require('curl');
const express = require('express');
const app = express();

const printmember = (req, res, data) => {
    console.log('----------data의 parsing 결과---------');
    console.log('이름: ' + data.name);
    console.log('나이: ' + data.age);
    console.log('주소: ' + data.addr);
    console.log('연락처: ' + data.tel);
    console.log(data);
}

app.listen(60002, () => {
    console.log('Peer2: server is activated on 60002');
    // curl.getJSON(url, options, function(err, res, data) { } );
    curl.getJSON('http://127.0.0.1:60001/member', {}, printmember);
});