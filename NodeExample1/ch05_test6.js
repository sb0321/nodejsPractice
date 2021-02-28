var http = require('http');
var fs = require('fs');
const { setFlagsFromString } = require('v8');

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
    console.log('클라이언트 요청이 들어왔습니다.');

    var filename = 'house.jpg';
    var infile = fs.createReadStream(filename, {flags:'r'});

    var filelength = 0;
    var curlength = 0;

    fs.stat(filename, function(err, stats) {
        filelength = stats.size;
    });

    // 헤더 쓰기
    res.writeHead(200, {"contentType":"iamge/jpg"});

    // 파일 내용을 스트림에서 읽어 본문 쓰기
    infile.on('readable', function() {
        var chunk;

        while(null !== (chunk = infile.read())) {
            
            console.log('읽어 들인 데이터 크기 : %d 바이트', chunk.length);

            curlength += chunk.length;

            res.write(chunk, "utf8", function(err) {
                console.log('파일 부분 쓰기 완료 : %d, 파일 크기 : %d', curlength, filelength);

                if(curlength >= filelength) {
                    // 응답 전송하기
                    res.end();
                }

            });
        }
    });

    // 파이프로 연결하여 알아서 처리하도록 설정
    infile.pipe(res);
});

server.on('close', function() {
    console.log('서버가 종료됩니다.');
});