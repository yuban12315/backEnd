let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let session = require('express-session')
let mongoStore = require('connect-mongo')(session)
let bodyParser = require('body-parser');

let index = require('./libs/controllers/index');
let users = require('./libs/controllers/users');
let museum=require('./libs/controllers/museum')
let memory=require('./libs/controllers/memory')

let config = require('./libs/config')
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser(config.cookie.secert))
app.use(session({
    secret: config.cookie.secert,
    cookie:config.cookie.expectTime,
    store:new mongoStore({
        url:config.dbUrl,
        useConnectionPooling:true
    })
}))
app.use(express.static(path.join(__dirname, 'public')));


app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    next()
})

app.use('/', index);
app.use('/users', users);
//app.use('/memory',memory)
app.use('/museum',museum)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send({
        status:false,
        error:err.message
    })
});

module.exports = app;
