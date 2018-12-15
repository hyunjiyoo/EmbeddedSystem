const fs = require('fs');

fs.readFile('timemsg.json', 'utf8', function (error, jsonRead) {
    if(error) {
        console.log(error);
    }

    const timeIntr = function () {
        console.log(leftTime + "초 남았습니다.");
        leftTime--;
        if(leftTime > 0) {
            setTimeout(timeIntr, 1);
        } else {
            printmsg();
        }
    }

    const printmsg = function () {
        console.log(time + "초가 지나서 " + msg);
    };

    var timemsg = JSON.parse(jsonRead);
    var time = timemsg.time; // 3
    var msg = timemsg.msg; // "led를 켭니다"
    var leftTime = time;
    console.log("숫자 : ", time);
    console.log("문자열 : ", msg);
    timeIntr();
});