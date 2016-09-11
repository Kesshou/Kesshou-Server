/*
*Author: blackkite0206233
*Description: This file is the API of attitudestatus.
*/
var express = require('express');
var AttitudeStatusWebSpiders = require('../Kesshou/WebSpiders/AttitudeStatusWebSpiders');
var RedisRepository = require('../Kesshou/Repositories/RedisRepository');

var router = express.Router();

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return attituds status.
*Usage:
    return:
        status code:
            200: login successfully.
            500: server error.
        attitudeStatus: contains date, item, and text.
        error: it is a string to explain the reason of error.
*/
router.get('/', function(req, res, next) {
    var token = req.body.token;
    RedisRepository.getSchoolData(token).then(function(result) {
        var schoolAccount = result.school_account;
        var schoolPwd = result.school_pwd;
        return AttitudeStatusWebSpiders.getAttitudeStatus(schoolAccount, schoolPwd);
    }).then(function(result) {
        res.status(200).json("attitudeStatus" : result);
    }).catch(function(error) {
        res.status(500).json("error" : error);
    });
});

module.exports = router;
