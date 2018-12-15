const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

http.createServer((req, res) => {
   fs.readFile('s.ejs', 'utf8', function (error, data) {
       res.writeHead(200, 'utf8', { 'Content-Type': 'text/html'});
       res.end(ejs.render(data, {
           number: 244
       }));
   });
}).listen(52273, () => {
    console.log('Server Running at....');
});