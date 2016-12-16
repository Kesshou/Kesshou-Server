/*
*Author: blackkite0206233
*Description: This file is the API of curriculum.
*/
var express = require('express');

var SeatStateWebSpider = require('../Kesshou/WebSpiders/SeatStateWebSpider');

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
    SeatStateWebSpider.getSeatState().then(function(result) {
        res.status(200).end(result);
    }).catch(function(error) {
        console.log(error);
        res.status(400).json(ErrorCodeService.serverError);
    });
});

module.exports = router;
