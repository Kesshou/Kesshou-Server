var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var RedisRepository = require('./Kesshou/Repositories/RedisRepository');

var ErrorCodeService = require('./Kesshou/Services/ErrorCodeService');

var actmanage = require('./routes/actmanage');
var scorequery = require('./routes/scorequery');
var announce = require('./routes/announce');
var attitudestatus = require('./routes/attitudestatus');
var absentstate = require('./routes/absentstate');
var feedback = require('./routes/feedback');
var qanda = require('./routes/QandA');
var relatedlink = require('./routes/relatedlink');
var curriculum = require('./routes/curriculum');
var calendar = require('./routes/calendar');
var forum = require('./routes/forum');
var seatstate = require('./routes/seatState');

var app = express();

var version = 'v1';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use('/' + version + '/static',express.static( __dirname + '/public'));

app.use('/' + version + '/actmanage', actmanage);
app.use('/' + version + '/announce', announce);
app.use('/' + version + '/qanda', qanda);
app.use('/' + version + '/relatedlink', relatedlink);
app.use('/' + version + '/calendar', calendar);
app.use('/' + version + '/seatstate', seatstate);

/*
*Author: blackkite0206233
*Description: A middleware which is used to check token.
*Usage:
    error: token is expired.
    code:
        103: token is expired.
*/
app.use(function(req, res, next) {
    var token =req.get("Authorization");
    RedisRepository.getAccount(token).then(function(result) {
        next();
    }).catch(function(error) {
        if(error == "token過期")
            res.status(401).json(ErrorCodeService.tokenExpired);
        else
            res.status(400).json(ErrorCodeService.serverError);
    });
});
app.use('/' + version + '/scorequery', scorequery);
app.use('/' + version + '/attitudestatus', attitudestatus);
app.use('/' + version + '/absentstate', absentstate);
app.use('/' + version + '/curriculum', curriculum);
app.use('/' + version + '/forum', forum);
app.use('/' + version + '/feedback', feedback);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    // var err = new Error('Not Found');
    // err.status = 404;
    // next(err);
    res.status(400).json(ErrorCodeService.serverError);
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
