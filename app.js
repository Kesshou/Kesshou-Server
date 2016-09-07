var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var RedisRepository = require('./Kesshou/Repositories/RedisRepository');

var actmanage = require('./routes/actmanage');
//var scorequery = require('./routes/scorequery');
var announcementdisplay = require('./routes/announcementdisplay');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', function(req, res, next){
//     var a = [{"name" : "aaa", "age" : "1"},
//                     {"name" : "bbb", "age" : "2"},
//                     {"name" : "ccc", "age" : "3"}];
//     console.log(a.length);
// })

app.use('/actmanage', actmanage);

app.use(function(req, res, next) {
    var token =req.body.token;
    RedisRepository.getAccount(token).then(function(result) {
        if(result) {
            next();
        } else {
            res.status(408).json({"error" : "token過期"});
        }
    });
});
//app.use('/scorequery', scorequery);
app.use('/announcementdisplay', announcementdisplay);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        // res.render('error', {
        //     message: err.message,
        //     error: err
        // });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    // res.render('error', {
    //     message: err.message,
    //     error: {}
    // });
});


module.exports = app;
