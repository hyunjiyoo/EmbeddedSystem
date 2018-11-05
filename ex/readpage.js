/* response 객체
   file system 모듈로 webpage.html 을 읽어서 보내는 웹서버 예제
 */
const fs = require('fs');
const http = require('http');

// 서버생성 및 실행
http.createServer( (request, response) => {
    // HTML 파일을 읽습니다.
    fs.readFile('webpage.html', function(error, data) {
        if (error) {
            response.writeHead(500, 'utf8', { 'Content-Type': 'text/plain' } );
            response.end('Server: File error');
        }
        else {
            response.writeHead(200, { 'Content-Type': 'text/html'} );
            response.end(data);
        }
    });
}).listen(52273, () => {
    console.log("Server Running at http://127.0.0.1:52273");
});