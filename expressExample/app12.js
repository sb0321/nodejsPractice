var express = require('express');
var http = require('http');
var path = require('path');

//Express middleWare 불러오기
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');

var expressErrorHandler = require('express-error-handler');

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var app = express();

// 기본 속성 설정
app.set('port', process.env.PORT || 3000);


app.use(cookieParser());
app.use(expressSession({
    secret : 'my key',
    resave : true,
    saveUninitialized : true
}));

// // body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use('/public', serveStatic(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

var router = express.Router();

// 상품정보 라우팅 함수
router.route('/process/product').get(function(req, res) {

    console.log('/process/product 호출됨');

    if(req.session.user) {
        res.redirect('/public/product.html');
    } else {
        res.redirect('/public/login2.html');
    }

});

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

// 로그인 라우팅 함수 - 로그인 후 세션 저장함
router.route('/process/login').post(function(req, res) {
    
    console.log('/process/login 호출됨');
    
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    
    if(req.session.user) {
        // 이미 로그인된 상태
        console.log('이미 로그인되어 상품 페이지로 이동합니다.');

        res.redirect('/public/product.html');

    } else {
        // 세션 저장
        req.session.user = {
            id : paramId,
            name : '소녀시대',
            authorized : true
        };

    }

    
    res.writeHead('200', {'Content-Type':'text/html;charset=utf-8'});
    res.write('<h1>로그인 성공</h1>');
    res.write('<div><p>Param id : ' + paramId + '</p></div>');
    res.write('<div><p>Param password : ' + paramPassword + '</p></div>');
    res.write('<br><br><a href="/public/product.html">상품 페이지로 이동하기</a>');
    res.end();
});

// 로그아웃 라우팅 함수 - 로그아웃 후 세션 삭제함
router.route('/process/logout').get(function(req, res) {
    console.log('/process/logout 호출됨');

    if(req.session.user) {
        // 로그인된 상태
        console.log('로그아웃합니다.');

        req.session.destroy(function(err) {
            if(err) {
                throw err;
            }

            console.log('세션을 삭제하고 로그아웃되었습니다.');
            res.redirect('/public/login2.html');
        });
    } else {
        // 로그인 안된 상태
        console.log('아직 로그인 되어 있지 않습니다.');
        res.redirect('/public/login2.html');
    }
})


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
