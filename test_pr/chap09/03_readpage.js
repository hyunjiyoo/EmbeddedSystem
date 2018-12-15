/* file system 모듈로 webpage.html 을 읽어서 보내는 웹서버 예제 */
const fs = require('fs');
const http = require('http');

// 서버생성, 실행
http.createServer((req, res) => {
    fs.readFile('webpage.html', (error, data) => {
        if(error) {
            res.writeHead(500, 'utf8', {'Content-Type': 'text/plain'});
            res.end('Server: File error');
        } else {
            res.writeHead(200, 'utf8', {'Content-Type': 'text/html'});
            res.end(data);
        }
    });
}).listen(52273, () => {
    console.log('Server Running at http://127.0.0.1:52273');
});