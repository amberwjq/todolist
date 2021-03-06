var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var index = require('./routes/index');
var users = require('./routes/users');
//var flash = require("connect-flash");
var flash = require('req-flash');
var session = require('express-session');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

 // configuration ===============================================================
//mongoose.createConnection('mongodb://localhost/test')//connect to a MongoDB database
// Connection URL
var url = 'mongodb://localhost:27017/test';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
  });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.text());
// app.use(bodyParser.text({type: '*/*'}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))
app.use(session({ cookie: { maxAge: 3600000 }, //60000 is 1 min
                  secret: 'woot',
                  resave: false, 
                  saveUninitialized: false}));
app.use(flash());

app.use('/', index);
 app.use('/user', users);

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
var server = app.listen(8000, function() {
    console.log('Ready on port %d', server.address().port);
});

module.exports = app;



