/*
*Author: blackkite0206233
*Description: This file is the API of attitudestatus.
*/
var express = require('express');

var AttitudeStatusWebSpiders = require('../Kesshou/WebSpiders/AttitudeStatusWebSpiders');

var RedisRepository = require('../Kesshou/Repositories/RedisRepository');

var ErrorCodeService = require('../Kesshou/Services/ErrorCodeService');

var router = express.Router();

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return attituds status.
*Usage:
    return:
        attitudeStatus: contains date, item, and text.
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
        return AttitudeStatusWebSpiders.getAttitudeStatus(schoolAccount, schoolPwd);
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

module.exports = router;
