const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoStore = require('connect-mongo')(session)
const bodyParser = require('body-parser')

const index = require('./libs/controllers/index')
const users = require('./libs/controllers/users')
const museum=require('./libs/controllers/museum')
const memory=require('./libs/controllers/memory')

const config = require('./libs/config')
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
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

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    next()
})

app.use('/', index)
app.use('/users', users)
app.use('/memory',memory)
app.use('/museum',museum)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    console.log(err)

    // render the error page
    res.status(err.status || 500)
    res.send({
        status:false,
        error:err.message
    })
})

module.exports = app


