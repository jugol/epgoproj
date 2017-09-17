var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var mongoose   = require('mongoose');
var helmet = require('helmet');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var apiUser = require('./routes/api.user');
var apiAuth = require('./routes/api.auth');

var app = express();

app.use(helmet());//보안 관련 라이브러리

//database
mongoose.Promise = global.Promise;
mongoose.connect("몽고디비에 접속할 로그인 주소 입력", {useMongoClient: true});
var db = mongoose.connection;
db.once('open', function () {
   console.log('DB connected!');
});
db.on('error', function (err) {
  console.log('DB ERROR:', err);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type, x-access-token'); 
  //CORS에  x-access-token이 추가되었습니다. jwt로 생성된 토큰은 header의 x-access-token 항목을 통해 전달됩니다.
  next();
});
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.all('/api/user*', apiUser);
app.all('/api/auth*', apiAuth);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
