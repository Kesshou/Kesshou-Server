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
        status code:
            200: get history score successfully.
            500: server error.
        absentState: an array, each item contains type, credit, score, makeup(optional), retake(optional), and qualify.
        error: it is a string to explain the reason of error.
        code:
            400: server error.
*/
router.post('/historyscore', function(req, res, next) {
    var token = req.body.token;
    var grade = req.body.grade;
    var semester = req.body.semester;
    RedisRepository.getUserData(token).then(function(result) {
        var schoolAccount = result.school_account;
        var schoolPwd = result.school_pwd;
        return ScoreWebSpiders.getHistoryScore(schoolAccount, schoolPwd, grade, semester);
    }).then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        console.log(error);
        res.status(500).json({"error" : "伺服器錯誤", "code" : ErrorCodeService.serverError});
    });
});

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return sectional exam score.
*Usage:
    return:
        status code:
            200: get sectional exam score successfully.
            500: server error.
        absentState: an array, each item contains first_section, second_section, last_section, performance, and average.
        error: it is a string to explain the reason of error.
        code:
            400: server error.
*/
router.post('/sectionalexamscore', function(req, res, next) {
    var token = req.body.token;
    var semester = req.body.semester;
    RedisRepository.getUserData(token).then(function(result) {
        var schoolAccount = result.school_account;
        var schoolPwd = result.school_pwd;
        return ScoreWebSpiders.getSectionalExamScore(schoolAccount, schoolPwd, semester);
    }).then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        res.status(500).json({"error" : "伺服器錯誤", "code" : ErrorCodeService.serverError});
    });
})

module.exports = router;
