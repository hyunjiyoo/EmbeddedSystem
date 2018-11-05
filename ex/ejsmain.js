/* ejs 모듈 (=Embedded JavaScript Template 모듈)
   확장모듈(ejs, jade)을 이용하면 동적페이지 생성할 수 있음
 */
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

http.createServer(function (request, response) {
    fs.readFile('sample.ejs', 'utf8', function(error, data) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('<meta charset=utf8>');
        response.end(ejs.render(data, {
            name: 'ejs 실습문제',
            description: 'Hello ejs With Node.js..!'
        }));
    });
}).listen(52273, function () {
    console.log("Server Running at http://127.0.0.1:52273");
});