const fs = require('fs');
var text = '쓰는 text';
var text1 = '쓰는 text1';

// 비동기식 쓰기
fs.writeFile('data.txt', text, 'utf8', function (error) {
    console.log('비동기식 쓰기');
});

// 동기식 쓰기
fs.writeFileSync('data1.txt', text1, 'utf8');
console.log('동기식 쓰기');

var readtext;
// 비동기식 읽기
fs.readFile('data.txt', 'utf8', function(error, readtext) {
    if(error) {
        console.log(error);
    }
    console.log('비동기식으로 읽음: ', readtext);
});

// 동기식 읽기
try {
    readtext = fs.readFileSync('data1.txt', 'utf8');
    console.log('동기식으로 읽음: %s', readtext);
} catch(error) {
    console.log(error);
}