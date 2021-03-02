var express = require('express');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var serveStatic = require('serve-static');
var errorHandler = require('errorhandler');

var config = require('./config');

// crypto 모듈 불러들이기
var crypto = require('crypto');

// 오류 핸들러 모듈
var expressErrorHandler = require('express-error-handler');

// session 미들웨어 불러오기
var expressSession = require('express-session');

// 익스프레스 객체 생성
var app = express();

// 서버 변수 설정 및 static으로 [public] 폴더 설정
app.set('port', process.env.PORT || config.server_port);

// body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended : false}));

// body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());

// public 폴더를 static으로 오픈
app.use('/public', serveStatic(path.join(__dirname, 'public')));

// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
    secret : 'my key',
    resave : true,
    saveUninitialized : true
}));

// 라우터 객체 참조
var router = express.Router();

var user = require('./routes/user');

// 로그인 라우팅 함수 - 데이터베이스 정보와의 비교
// router.route('/process/login').post(function(req, res) {
//     console.log('/process/login 호출됨');
// });

// app.use('/', router);

var errorHandler = expressErrorHandler({
    static : {
        '404' : './public/404.html'
    }
});


// app.use(expressErrorHandler.httpError(404));
// app.use(errorHandler);


// 몽고디비 모듈 사용
var MongoClient = require('mongodb').MongoClient;

// mongoose 모듈 불러들이기
var mongoose = require('mongoose');
const { setInterval } = require('timers');

// 데이터베이스 객체를 위한 변수 선언
var database;

// 데이터베이스 스키마 객체를 위한 변수 선언
var UserSchema;

// 데이터베이스 모델 객체를 위한 변수 선언
var UserModel;

// 데이터베이스에 연결
function connectDB() {

    // 데이터베이스 연결 정보
    var databaseUrl = 'mongodb://localhost:27017/local';



    // 데이터베이스 연결
    console.log('데이터베이스에 연결을 시도합니다.');
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.on('open', function() {
        console.log('데이터베이스에 연결되었습니다 : ' + databaseUrl);

        //user 스키마 및 모델 객체 생성
        createUserSchema();
    
        // 스키마에 static 메소드 추가
        UserSchema.static('findById', function(id, callback) {
            return this.find({id : id}, callback);
        });

        UserSchema.static('findAll', function(callback) {
            return this.find({}, callback);
        });

        console.log('UserSchema 정의함.');

        // UserModel 모델 정의
        UserModel = mongoose.model('users3', UserSchema);
        console.log('UserModel 정의함');
    });

    // 연결 끊어졌을 때 5초 후 재연결
    database.on('disconnected', function() {
        console.log('연결이 끊어졌습니다. 5초 후 다시 연결합니다.');
        setInterval(connectDB, 5000);
    });
}

function createUserSchema() {

    // user_schema.js 모듈 불러오기
    UserSchema = require('./database/user_schema').createSchema(mongoose);

    // UserModel 정의
    UserModel = mongoose.model('users3', UserSchema);

    // init 호출
    user.init(database, UserSchema, UserModel);

    console.log('UserModel 정의함');
}

var authUser = function(database, id, password, callback) {

    console.log('authUser 호출됨');

    // 1. 아이디를 사용해 검색
    UserModel.findById(id, function(err, results) {
        if(err) {
            callback(err, null);
            return;
        }
        
        console.log('아이디 [%s]로 사용자 검색 결과', id);
        console.dir(results);

        if(results.length > 0) {
            console.log('아이디와 일치하는 사용자 찾음');

            // 2. 비밀번호 확인 : 모델 인스턴스를 객체를 만들고 authenticate() 메소드 호출
            var user = new UserModel({id : id});
            var authenticated = user.authenticate(password, results[0]._doc.salt,
                results[0]._doc.hashed_password);

            if(authenticated) {
                console.log('비밀번호 일치함');
                callback(null, results);
            } else {
                console.log('비밀번호 일치하지 않음');
                callback(null, null);
            }
            
        } else {
            console.log('아이디와 일치하는 사용자를 찾지 못함');
            callback(null, null);
        }
    });
}

var addUser = function(database, id, password, name, callback) {

    console.log('addUser 호출됨');

    // UserModel의 인스턴스 생성
    var user = new UserModel({'id':id, 'password':password, 'name':name});

    // save()로 저장
    user.save(function(err) {

        if(err) {
            callback(err, null);
            return;
        }

        console.log('사용자 데이터 추가함');
        callback(null, user);
    });

}

// 라우터 설정
router.route('/process/listuser').post(user.listuser);

router.route('/process/adduser').post(user.adduser);

router.route('/process/login').post(user.login);

app.use('/', router);




//===== 서버 시작 =====//
http.createServer(app).listen(app.get('port'), function() {
    console.log('서버가 시작되었습니다. %d', app.get('port'));

    connectDB();
});


