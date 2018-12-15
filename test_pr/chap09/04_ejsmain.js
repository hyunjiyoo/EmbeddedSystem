const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

http.createServer((req, res) => {
    fs.readFile('sample.ejs', 'utf8', function (error, data) {
        res.writeHead(200, 'utf8', {'Content-Type': 'text/html'});
        res.write('<meta charset=utf8');
        res.end(ejs.render(data, {
            name: 'ejs 실습문제',
            description: 'Hello ejs With Node.js...'
        }));
    });
}).listen(52273, function () {
    console.log("Server Running at http://127.0.0.1:52273");
});