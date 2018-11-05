/* 실습일지(11/01) ex05-01
   우측에 timemsg.json 파일이 있다. 이 파일을 읽어서 각각 time과 msg의 값을 파징한다.
   time에 설정된 시간(초) 후에, msg에 설정된 메시지가 화면에 출력되도록 하여라.
   단 화면에 "_초 남았습니다."가 1초 지날때마다 출력되도록 하여라.
   timemsg.js 프로그램 작성하여라.
 */
const fs = require('fs');
var timemsg;

const timeHandler = function() {
    if(timemsg.time > 0) {
        console.log("%d초 남았습니다.", timemsg.time);
        timemsg.time--;
        setTimeout(timeHandler, 1000);
    } else {
        console.log("3초가 지나서 led를 켭니다.");
    }
};

timemsg = JSON.parse(fs.readFileSync("timemsg.json", 'utf8'));
console.log("숫자: %d\n문자열: %s", timemsg.time, timemsg.msg);
timeHandler();