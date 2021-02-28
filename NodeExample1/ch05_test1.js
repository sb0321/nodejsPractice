var http = require('http');

// 웹 서버 객체를 만든다.
var server = http.createServer();

// 웹 서버를 시작하고 3000번 포트에 대기
var port = 3000;
var host = '192.168.0.5';
// server.listen(port, function() {
//     console.log('웹 서버가 시작되었습니다. : %d', port);    
// });

server.listen(port, host, '50000', function() {
    console.log('웹 서버가 시작되었습니다. : %s, %d', host, port);
});