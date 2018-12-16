/* Server */
const express = require('express');
const app = express();

var mydata = {
    name: "홍길동",
    age: 27,
    addr: "수원",
    tel: "010-999-9999"
};

const getmember = (req, res) => {
    console.log("Peer2: get request from Peer1");
    res.send(mydata);
}

app.get('/member', getmember);

app.listen(60001, () => {
    console.log('Peer1: server is activated on 60001...');
});
