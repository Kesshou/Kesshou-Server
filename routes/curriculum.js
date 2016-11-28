/*
*Author: blackkite0206233
*Description: This file is the API of curriculum.
*/
var express = require('express');

var CurriculumWebSpider = require('../Kesshou/WebSpiders/CurriculumWebSpider');

var RedisRepository = require('../Kesshou/Repositories/RedisRepository');

var ErrorCodeService = require('../Kesshou/Services/ErrorCodeService');

var router = express.Router();

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return student's curriculum.
*Usage:
    return:
        curriculum: student's curriculum.
        error: it is a string to explain the reason of error.
        code:
            103: token is expired.
            400: server error.
*/
router.get('/', function(req, res, next) {
    var token = req.get("Authorization");
    RedisRepository.getUserData(token).then(function(result) {
        var stuClass = result.class;
        var finishYear = result.finish_year;
        var Class = stuClass.substr(0, 2) + finishYear + stuClass.substr(3);
        return CurriculumWebSpider.getCurriculum(Class);
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
