/*
*Author: blackkite0206233
*Description: This file is the API of absentstate.
*/
var express = require('express');
var AbsentStateWebSpiders = require('../Kesshou/WebSpiders/AbsentStateWebSpiders');
var RedisRepository = require('../Kesshou/Repositories/RedisRepository');

var router = express.Router();

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return absent state.
*Usage:
    return:
        status code:
            200: login successfully.
            500: server error.
        absentState: contains data, type, and class.
        error: it is a string to explain the reason of error.
*/
router.get('/', function(req, res, next) {
    var token = req.body.token;
    RedisRepository.getSchoolData(token).then(function(result) {
        var schoolAccount = result.school_account;
        var schoolPwd = result.school_pwd;
        return AbsentStateWebSpiders.getAbsentState(schoolAccount, schoolPwd);
    }).then(function(result) {
        res.status(200).json("absentState" : result);
    }).catch(function(error) {
        res.status(500).json("error" : error);
    });
});

module.exports = router;
