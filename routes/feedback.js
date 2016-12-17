/*
*Author: blackkite0206233
*Description: This file is the API of feedback.
*/
var express = require('express');

var FeedbackRepository = require('../Kesshou/Repositories/FeedbackRepository');
var RedisRepository = require('../Kesshou/Repositories/RedisRepository');
var ErrorCodeService = require('../Kesshou/Services/ErrorCodeService');

var router = express.Router();

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to post feedback.
*Usage:
    return:
        success: post successfully.
        error: the reason of error.
        code:
            400: server error.
*/
router.post('/', function(req, res, next) {
    var feedback = req.body;
    feedback.checked = 0;
    var token = req.get("Authorization");
    if(feedback.feedClass == undefined || feedback.commit == undefined || feedback.system == undefined)
        res.status(400).json(ErrorCodeService.emptyInput);
    RedisRepository.getUserInfo(token).then(function(result) {
        console.log(result);
        feedback.stu_id = result.id;
        return FeedbackRepository.postFeedback(feedback);
    }).then(function() {
        res.status(200).json({"success" : "ok"});
    }).catch(function(error) {
        console.log(error);
        res.status(400).json(ErrorCodeService.serverError);
    });
});

module.exports = router;
