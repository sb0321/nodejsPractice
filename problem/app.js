var express = require('express');
var http = require('http');
var path = require('path');

// Express middleware 불러오기
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());


// public 폴더 오픈
app.use('/public', serveStatic(path.join(__dirname, 'public')));


var router = express.Router();

router.route('/process/upload').post(function(req, res) {

    console.log('/process/upload 호출');


    var username = req.body.username;
    var date = req.body.date;
    var text = req.body.text;

    console.log(username + " " + date + " " + text);
});

app.use('/', router);

http.createServer(app).listen(3000, function() {
    console.log('서버 시작');
});