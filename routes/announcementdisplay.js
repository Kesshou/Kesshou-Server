/*
*Author: blackkite0206233
*Description: This file is the API of announcementdisplay.
*/
var express = require('express');
var RedisRepository = require('../Kesshou/Repositories/RedisRepository');
var AnnounceRepository = require('../Kesshou/Repositories/AnnounceRepository');
var UserRepository = require('../Kesshou/Repositories/UserRepository');
var router = express.Router();

/*
*Author: blackkite0206233
*Description:
    This function is the API which was used to return announcement.
*Usage:
    return:
        status code:
            200: register successfully.
        announce: the announcement shich was found.
*/
router.get('/announce', function(req, res, next) {
    var announce;
    var type = req.type;
    if(type != "collect") {
        announce = AnnounceRepository.getAnnouncement("sort", type);
    } else {
        var account = RedisRepository.getAccount(req.token);
        var userID = UserRepository.getUserInfo(account)
        announce = AnnounceRepository.getCollection(userID);
    }
    res.status(200).json({"announce" : announce});
});

module.exports = router;
