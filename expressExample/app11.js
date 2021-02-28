var express = require('express');
var http = require('http');
var path = require('path');

//Express middleWare 불러오기
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');

var expressErrorHandler = require('express-error-handler');
var cookieParser = require('cookie-parser');

var app = express();

// 기본 속성 설정
app.set('port', process.env.PORT || 3000);


app.use(cookieParser());

// // body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use('/public', serveStatic(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

var router = express.Router();

router.route('/process/showCookie').get(function(req, res) {
    console.log('/process/showCookie 호출됨');

    res.send(req.cookies);
});

router.route('/process/setUserCookie').get(function(req, res) {
    console.log('/process/setUserCookie 호출됨');
    
    // 쿠키 설정
    res.cookie('user', {
        id : 'mike',
        name : '소녀시대',
        authorized : true
    });

    // redirect로 응답
    res.redirect('/process/showCookie');
})

router.route('/process/users/:id').get(function(req, res) {
    console.log('/process/users/:id 처리함');

    // URL 파라미터 확인
    var paramId = req.params.id;

    console.log('/process/users 와 토큰 %s를 이용해 처리함.', paramId);

    res.writeHead(200, {'Content-Type' : 'text/html;charset=utf8'});
    res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
    res.end();
});

router.route('/process/login').post(function(req, res) {
    
    console.log('/process/login 처리함');
    
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    
    res.writeHead('200', {'Content-Type':'text/html;charset=utf-8'});
    res.write('<h1>express 서버에서 응답한 결과입니다.</h1>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
    res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
    res.write('<br><br><a href="/public/login2.html">로그인 페이지로 돌아가기></a>');
    res.end();
});


// app.all('*', function(req, res) {

//     res.status(404).send('<h1>ERROR 페이지를 찾을 수 없습니다.</h1>');

// });
app.use('/', router);

var errorHandler = expressErrorHandler({
    static : {
        '404' : './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


http.createServer(app).listen(3000, function() {
    console.log('Express 서버가 3000번 포트에서 시작됨.');
});
