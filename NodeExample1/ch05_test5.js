var http = require('http');
var fs = require('fs');

// 웹 서버 객체를 만든다.
var server = http.createServer();

// 웹 서버를 시작하여 3000번 포트에서 대기하도록 설정
var port = 3000;
server.listen(port, function(){
    console.log('웹 서버가 시작되었습니다.');
});

// 클라이언트 연결 처리
server.on('connection', function(socket) {
    var addr = socket.address();
    console.log('클라이언트가 접속했습니다. : %s, %d', addr.address, addr.port);
});

// 클라이언트 요청 이벤트 처리
server.on('request', function(req, res) {

    var filename = 'house.jpg';
    fs.readFile(filename, function(err, data) {
        res.writeHead(200, {"contentType":"image/jpg"});
        res.write(data);
        res.end();
    });
});

server.on('close', function() {
    console.log('서버가 종료됩니다.');
});