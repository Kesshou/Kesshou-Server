/*
*Author: blackkite0206233
*Description: This file is the API of school Q & A.
*/
var express = require('express');
var QandARepositories = require('../Kesshou/Repositories/QandARepositories');

var ErrorCodeService = require('../Kesshou/Services/ErrorCodeService');

var router = express.Router();

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return school Q & A.
*Usage:
    return:
        QandA: school Q & A.
        error: the reason of error.
        code:
            400: server error.
*/
router.get('/', function(req, res, next) {
    QandARepositories.getQandA().then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        res.status(400).json(ErrorCodeService.serverError);
    });
});

module.exports = router;
