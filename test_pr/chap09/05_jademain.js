const http = require('http');
const fs = require('fs');
const jade = require('jade');

http.createServer((req, res) => {
    if(req.method == 'GET') {
        if(req.url == '/') {
            fs.readFile('hello.jade', 'utf8', (error, data) => {
                const fn = jade.compile(data);
                res.writeHead(200, {'Content-Type' : 'text/html; charset=utf8'});
                res.end(fn());
            });
        }
    }
}).listen(52273, function () {
    console.log('Server Running...');
});