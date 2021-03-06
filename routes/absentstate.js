/*
*Author: blackkite0206233
*Description: This file is the API of absentstate.
*/
var express = require('express');

var ErrorCodeService = require('../Kesshou/Services/ErrorCodeService');

var AbsentStateWebSpiders = require('../Kesshou/WebSpiders/AbsentStateWebSpiders');
var RedisRepository = require('../Kesshou/Repositories/RedisRepository');

var router = express.Router();

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return absent state.
*Usage:
    return:
        absentState: contains data, type, and class.
        error: it is a string to explain the reason of error.
        code:
            103: token is expired.
            400: server error.
*/
router.get('/', function(req, res, next) {
    var token = req.get("Authorization");
    RedisRepository.getUserData(token).then(function(result) {
        var schoolAccount = result.school_account;
        var schoolPwd = result.school_pwd;
        return AbsentStateWebSpiders.getAbsentState(schoolAccount, schoolPwd);
    }).then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        if(error == "token過期")
            res.status(401).json(ErrorCodeService.tokenExpired);
        else
            res.status(400).json(ErrorCodeService.serverError);
    });
});

module.exports = router;
