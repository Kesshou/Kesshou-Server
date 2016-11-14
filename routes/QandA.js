/*
*Author: blackkite0206233
*Description: This file is the API of school Q & A.
*/
var express = require('express');
//var QandARepositories = require('../Kesshou/Repositories/QandARepositories');
var Promise = require('bluebird');
var models  = Promise.promisifyAll(require('../models'));

var ErrorCodeService = require('../Kesshou/Services/ErrorCodeService');

var router = express.Router();

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return school Q & A.
*Usage:
    return:
        status code:
            200: register successfully.
        QandA: school Q & A.
        error: the reason of error.
        code:
            400: server error.
*/
router.get('/', function(req, res, next) {
    models.School_qa.findAll().then(function(result) {
        var QandA = [];
        for(var i = 0; i < result.length; i++) {
            QandA.push(result[i].get());
        }
        res.status(200).json(QandA);
    }).catch(function(error) {
        res.status(500).json({"error" : "伺服器錯誤", "code" : ErrorCodeService.serverError});
    });
});

module.exports = router;
