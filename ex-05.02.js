/* 실습일지(11/01) ex05-02
   오른쪽 그림처럼 출력시키는 websound.js 웹서버 프로그램을 만들고자 한다.
   단, MVC 모델방식으로 만들고자 Views 부분을 s.ejs 로 구현하되
   "기준값"이라는 입력필드의 default 값을 websound.js에서 동적으로 지정한다.
 */
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

http.createServer(function(request, response) {
    if(request.method == 'GET') {
        if (request.url == '/') {
            fs.readFile('s.ejs', 'utf8', function(error, data) {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write('<meta charset=utf8>');
                response.end(ejs.render(data, {
                    name: '임베디드시스템제어',
                    description: '사운드센서측정 기준값 설정',
                    ref_value: 244
                }));
            });
        }
    }
}).listen(52273, function() {
    console.log('Server Running at http://127.0.0.1:52273');
});