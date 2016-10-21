/*
*Author: blackkite0206233
*Description: This file is the API of curriculum.
*/
var express = require('express');
var CurriculumWebSpider = require('../Kesshou/WebSpiders/CurriculumWebSpider');
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
        code:
            400: server error.
*/
router.get('/', function(req, res, next) {
    var token = req.body.token;
    RedisRepository.getSchoolData(token).then(function(result) {
        var stuClass = result.class;
        var finishYear = result.finish_year;
        var Class = stuClass.substr(0, 2) + finishYear + stuClass.substr(3);
        return CurriculumWebSpider.getCurriculum(Class);
    }).then(function(result) {
        res.status(200).json({"curriculum" : result});
    }).catch(function(error) {
        res.status(500).json({"error" : "伺服器錯誤", "code" : 400});
    });
});

module.exports = router;
