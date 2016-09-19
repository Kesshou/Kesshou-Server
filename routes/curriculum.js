/*
*Author: blackkite0206233
*Description: This file is the API of curriculum.
*/
var express = require('express');
var AttitudeStatusWebSpiders = require('../Kesshou/WebSpiders/CurriculumWebSpider');
var RedisRepository = require('../Kesshou/Repositories/RedisRepository');

var router = express.Router();

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return student's curriculum.
*Usage:
    return:
        status code:
            200: get curriculum successfully.
            500: server error.
        curriculum: student's curriculum.
        error: it is a string to explain the reason of error.
*/
router.get('/', function(req, res, next) {
    var token = req.body.token;
    RedisRepository.getSchoolData(token).then(function(result) {
        var schoolAccount = result.school_account;
        var schoolPwd = result.school_pwd;
        return CurriculumWebSpider.getCurriculum(schoolAccount, schoolPwd);
    }).then(function(result) {
        res.status(200).json("curriculum" : result);
    }).catch(function(error) {
        res.status(500).json("error" : error);
    });
});

module.exports = router;
