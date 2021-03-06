/*
*Author: blackkite0206233
*Description: This file is the API of scorequery.
*/
var express = require('express');

var ErrorCodeService = require('../Kesshou/Services/ErrorCodeService');

var ScoreWebSpiders = require('../Kesshou/WebSpiders/ScoreWebSpiders');
var RedisRepository = require('../Kesshou/Repositories/RedisRepository');

var router = express.Router();

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return history score.
*Usage:
    return:
        absentState: user's absent status.
        error: it is a string to explain the reason of error.
        code:
            103: token is expired.
            400: server error.
*/
router.get('/historyscore/:grade/:semester', function(req, res, next) {
    var token = req.get("Authorization");
    var grade = req.params.grade;
    var semester = req.params.semester;
    RedisRepository.getUserData(token).then(function(result) {
        var schoolAccount = result.school_account;
        var schoolPwd = result.school_pwd;
        return ScoreWebSpiders.getHistoryScore(schoolAccount, schoolPwd, grade, semester);
    }).then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        console.log(error);
        if(error == "token過期")
            res.status(401).json(ErrorCodeService.tokenExpired);
        else
            res.status(400).json(ErrorCodeService.serverError);
    });
});

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return sectional exam score.
*Usage:
    return:
        absentState: user's absent status.
        error: it is a string to explain the reason of error.
        code:
            103: token is expired.
            400: server error.
*/
router.get('/sectionalexamscore/:semester', function(req, res, next) {
    var token = req.get("Authorization");
    var semester = req.params.semester;
    RedisRepository.getUserData(token).then(function(result) {
        var schoolAccount = result.school_account;
        var schoolPwd = result.school_pwd;
        return ScoreWebSpiders.getSectionalExamScore(schoolAccount, schoolPwd, semester);
    }).then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        if(error == "token過期")
            res.status(401).json({"error" : error, "code" : ErrorCodeService.tokenExpired});
        else
            res.status(400).json({"error" : "伺服器錯誤", "code" : ErrorCodeService.serverError});
    });
})

module.exports = router;
