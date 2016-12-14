/*
*Author: blackkite0206233
*Description: This file is the API of related link.
*/
var express = require('express');

var RelatedlinkRepository = require('../Kesshou/Repositories/RelatedlinkRepository');

var ErrorCodeService = require('../Kesshou/Services/ErrorCodeService');

var router = express.Router();

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return related link.
*Usage:
    return:
        QandA: related link.
        error: the reason of error.
        code:
            400: server error.
*/
router.get('/', function(req, res, next) {
    RelatedlinkRepository.getRelatedLink().then(function(result) {
        res.status(200).json(result);
    }).catch(function(error) {
        res.status(400).json(ErrorCodeService.serverError);
    });
});

module.exports = router;
