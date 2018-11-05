/* jade 템플릿 엔진 */
const http = require('http');
const fs = require('fs');
const jade = require('jade');

http.createServer(function(request, response) {
    if (request.method == 'GET') {
        if (request.url == '/') {
            fs.readFile('hello.jade', 'utf8', function(error, data) {
                const fn = jade.compile(data);
                response.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
                response.end(fn());
            });
        }
    }
}).listen(52273, function() {
    console.log("Server Running at http://127.0.0.1:52273");
});